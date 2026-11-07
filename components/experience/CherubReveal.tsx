"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { design, intro } from "@/content/client";
import { CherubMesh, type CherubSide } from "@/lib/cherub-mesh";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Màn mở thiệp "cherub" — port của kit brand/Cherub-Reveal-V5.

  Mọi toạ độ là px trên artboard 1448×2048 của kit; cả artboard được co
  (fit contain) và đặt giữa màn, còn nền trời thì phủ kín (cover).

  Luật của kit, giữ nguyên:
    • Hai tấm giấy là CÙNG hai layer từ frame đầu tới lúc rời màn — không đổi
      src, không fade, không filter. Trước 3,5s parent của giấy là identity.
    • Chỉ dấu sáp fade (0–1,15s). Thiên thần bay vào, đập cánh, rồi nắm giấy
      kéo ra hai bên; tay và giấy chung một parent nên tay không trượt.
    • Hero thật nằm ngay dưới overlay. Nền trời của overlay mờ dần đều cả
      màn trong lúc giấy được kéo, nên hero hiện lên phía sau hai tấm giấy.
*/

const BOARD_W = 1448;
const BOARD_H = 2048;
const DURATION = 9.2;

const T = {
  stampFade: [0, 1.15],
  arrival: { left: [1.12, 2.9], right: [1.28, 3.06] },
  pull: [3.5, 8.6],
  /** Lúc giấy gần rời mép — bắn sự kiện để hero (ô vuông, chữ) bắt đầu hiện. */
  heroReveal: 7.4,
  /** Nền trời mờ dần từ lúc giấy bắt đầu kéo tới khi giấy đã ra gần mép. */
  skyFade: [3.6, 6.4],
  angelFade: [8.35, 8.9],
} as const;

const TRAVEL = { left: -1030, right: 1030, up: -35, rotation: 2.2 };
const GRIPS: Record<CherubSide, [number, number]> = { left: [606, 926], right: [865, 926] };
const HANDS: Record<CherubSide, [number, number]> = { left: [645, 290], right: [140, 284] };
const SIDES: CherubSide[] = ["left", "right"];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const segment = (t: number, [a, b]: readonly [number, number] | readonly number[]) => clamp((t - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const sine = (x: number) => (1 - Math.cos(Math.PI * x)) / 2;

type NodeKey =
  | "stage"
  | "sky"
  | "board"
  | "stamp"
  | "stampImg"
  | "hint"
  | `${"group" | "angel" | "canvas" | "texture" | "paper"}-${CherubSide}`;

const ASSET = {
  paperLeft: element("cherub-paper-left"),
  paperRight: element("cherub-paper-right"),
  stamp: element("cherub-stamp"),
  cherubLeft: element("cherub-left"),
  cherubRight: element("cherub-right"),
};

export function CherubReveal() {
  const { open, startMusic, revealHero } = useExperience();
  const sky = resolveBackground(design.intro.background);

  /* Mọi node cần viết style mỗi frame, gom vào một bảng — gắn bằng callback ref. */
  const nodes = useRef<Partial<Record<NodeKey, HTMLElement>>>({});
  const bind = useCallback(
    (key: NodeKey) => (node: HTMLElement | null) => {
      if (node) nodes.current[key] = node;
      else delete nodes.current[key];
    },
    [],
  );

  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  /* Trạng thái hoạt cảnh để trong ref — render() viết thẳng vào style mỗi frame. */
  const state = useRef({ t: 0, last: 0, raf: 0, running: false, done: false, revealed: false });
  const meshes = useRef<Partial<Record<CherubSide, CherubMesh>>>({});
  const heroPhoto = useRef<HTMLElement | null>(null);
  const reduced = useRef(false);

  const render = useCallback(
    (time: number) => {
      const s = state.current;
      s.t = time;
      const pull = sine(segment(time, T.pull));

      const n = nodes.current;
      const stamp = n.stamp;
      if (stamp) {
        stamp.style.opacity = String(1 - smooth(segment(time, T.stampFade)));
        stamp.style.visibility = time >= 1.16 ? "hidden" : "visible";
      }
      if (n.hint) n.hint.style.opacity = String(1 - smooth(segment(time, [0, 0.8])));

      for (const side of SIDES) {
        const sign = side === "left" ? -1 : 1;
        const arrival = T.arrival[side];
        const a = sine(segment(time, arrival));
        const group = n[`group-${side}`];
        const angel = n[`angel-${side}`];
        if (group) {
          group.style.transform =
            pull === 0
              ? "none"
              : `translate(${TRAVEL[side] * pull}px, ${TRAVEL.up * pull}px) rotate(${sign * TRAVEL.rotation * pull}deg)`;
        }
        if (angel) {
          // Nhún nhẹ khi bay, dừng hẳn trước lúc tay chạm giấy.
          const bob =
            5 * Math.sin(((time - arrival[0]) * Math.PI * 2) / 2.8) * (1 - segment(time, [arrival[1] - 0.3, arrival[1]]));
          angel.style.transform = `translate(${sign * 160 * (1 - a)}px, ${70 * (1 - a) + bob}px) rotate(${sign * 3 * (1 - a)}deg)`;
          angel.style.opacity = String(
            smooth(segment(time, [arrival[0], arrival[0] + 0.9])) * (1 - smooth(segment(time, T.angelFade))),
          );
        }
        const mesh = meshes.current[side];
        if (mesh && time > arrival[0] - 0.1 && time < 8.9) mesh.draw(reduced.current ? 0 : time - arrival[0]);
      }

      // Nền trời giữ nguyên, chỉ "thở" mờ dần đều cả màn trong lúc giấy được kéo —
      // không xẻ đôi nền. Hero thật ở dưới hiện lên qua lớp nền đang tan.
      const fade = smooth(segment(time, T.skyFade));
      if (n.sky) {
        n.sky.style.opacity = String(1 - fade);
        n.sky.style.visibility = fade >= 1 ? "hidden" : "visible";
      }
      if (heroPhoto.current) heroPhoto.current.style.transform = `scale(${1.02 - 0.02 * pull})`;
      if (n.board) n.board.style.visibility = time >= 9 ? "hidden" : "visible";

      if (time >= T.heroReveal && !s.revealed) {
        s.revealed = true;
        revealHero();
      }
    },
    [revealHero],
  );

  const finish = useCallback(() => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    s.running = false;
    if (s.done) return;
    s.done = true;
    if (heroPhoto.current) heroPhoto.current.style.transform = "";
    open();
  }, [open]);

  const start = useCallback(() => {
    const s = state.current;
    if (!ready || s.running || s.t > 0 || s.done) return;
    // Nhạc phải gọi ngay trong cú chạm, trình duyệt điện thoại mới cho phát.
    startMusic();
    setStarted(true);
    if (reduced.current) {
      render(DURATION);
      finish();
      return;
    }
    s.running = true;
    s.last = 0;
    const tick = (now: number) => {
      if (!s.running) return;
      if (!s.last) s.last = now;
      const dt = Math.min(0.08, (now - s.last) / 1000);
      s.last = now;
      render(Math.min(DURATION, s.t + dt));
      if (s.t >= DURATION) finish();
      else s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  }, [ready, render, finish, startMusic]);

  const skip = useCallback(() => {
    if (state.current.done) return;
    startMusic();
    render(DURATION);
    finish();
  }, [render, finish, startMusic]);

  /* Đặt thiên thần theo điểm nắm, co artboard theo màn, chờ ảnh decode xong. */
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const n = nodes.current;
    for (const side of SIDES) {
      const [gx, gy] = GRIPS[side];
      const [hx, hy] = HANDS[side];
      const angel = n[`angel-${side}`];
      const group = n[`group-${side}`];
      if (angel) {
        angel.style.left = `${gx - hx}px`;
        angel.style.top = `${gy - hy}px`;
        angel.style.transformOrigin = `${hx}px ${hy}px`;
      }
      if (group) group.style.transformOrigin = `${gx}px ${gy}px`;
    }

    const stage = n.stage;
    const board = n.board;
    const layout = () => {
      if (!stage || !board) return;
      const scale = Math.min(stage.clientWidth / BOARD_W, stage.clientHeight / BOARD_H);
      board.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };
    const observer = new ResizeObserver(layout);
    if (stage) observer.observe(stage);
    layout();

    heroPhoto.current = document.querySelector<HTMLElement>(
      `#${design.hero.anchor} [data-section-photo]`,
    );

    const decode = (img: HTMLElement | null | undefined) =>
      img instanceof HTMLImageElement ? img.decode().catch(() => undefined) : Promise.resolve();

    let cancelled = false;
    const images = [
      n["paper-left"],
      n["paper-right"],
      n.stampImg,
      n["texture-left"],
      n["texture-right"],
      // Hero thật cũng phải sẵn sàng trước khi cho chạm, để khe mở không lộ nền trống.
      heroPhoto.current,
    ];
    Promise.all(images.map(decode)).then(() => {
      if (cancelled) return;
      for (const side of SIDES) {
        const canvas = n[`canvas-${side}`];
        const texture = n[`texture-${side}`];
        if (canvas instanceof HTMLCanvasElement && texture instanceof HTMLImageElement) {
          const mesh = new CherubMesh(canvas, texture, side);
          mesh.draw(0);
          meshes.current[side] = mesh;
        }
      }
      setReady(true);
      render(state.current.t);
    });

    const onVisibility = () => {
      state.current.last = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    render(0);

    const currentMeshes = meshes.current;
    const s = state.current;
    return () => {
      cancelled = true;
      cancelAnimationFrame(s.raf);
      s.running = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      for (const mesh of Object.values(currentMeshes)) mesh?.dispose();
    };
    // Chỉ dựng một lần khi mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={bind("stage")}
      data-tone={design.intro.tone}
      role="dialog"
      aria-modal="true"
      aria-label={intro.eyebrow}
      className="fixed inset-0 z-40 overflow-hidden text-tone-fg"
    >
      {/* Nền trời: phủ kín màn, mờ dần khi giấy được kéo */}
      <div ref={bind("sky")} aria-hidden className="absolute inset-0 bg-tone-bg">
        {sky ? <Image src={sky.src} alt="" fill sizes="100vw" priority className="object-cover" /> : null}
      </div>

      <div ref={bind("board")} className="artboard" style={{ width: BOARD_W, height: BOARD_H }}>
        {/* Giấy phải nằm dưới, giấy trái đè lên — đúng thứ tự của kit */}
        {(["right", "left"] as const).map((side) => {
          const paper = side === "left" ? ASSET.paperLeft : ASSET.paperRight;
          return (
            <div key={side} ref={bind(`group-${side}`)} className="absolute inset-0 will-change-transform">
              {paper ? (
                <Image
                  ref={bind(`paper-${side}`)}
                  src={paper.src}
                  width={BOARD_W}
                  height={BOARD_H}
                  sizes="100vw"
                  priority
                  alt=""
                  className="absolute inset-0 h-full w-full"
                />
              ) : null}
              <div
                ref={bind(`angel-${side}`)}
                aria-hidden
                className="absolute opacity-0 will-change-transform"
                style={{ width: 800, height: 960 }}
              >
                <canvas ref={bind(`canvas-${side}`)} className="block h-full w-full" />
              </div>
            </div>
          );
        })}

        {ASSET.stamp ? (
          <div ref={bind("stamp")} className="absolute" style={{ left: 530, top: 850, width: 330, height: 330 }}>
            <Image
              ref={bind("stampImg")}
              src={ASSET.stamp.src}
              width={330}
              height={330}
              sizes="40vw"
              priority
              alt=""
              className="h-full w-full"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={start}
          disabled={!ready || started}
          aria-label={intro.hint}
          className="pointer-events-auto absolute cursor-pointer touch-manipulation rounded-full disabled:cursor-default"
          style={{ left: 510, top: 830, width: 370, height: 370 }}
        />
      </div>

      <p
        ref={bind("hint")}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 px-gutter text-center text-eyebrow uppercase text-tone-fg"
        style={{ bottom: "calc(var(--t-space-block) + env(safe-area-inset-bottom))" }}
      >
        {intro.hint}
      </p>

      <button
        type="button"
        onClick={skip}
        className="absolute flex min-h-tap items-center rounded-btn border border-tone-line bg-tone-bg/70 px-stack text-eyebrow uppercase text-tone-fg backdrop-blur-sm"
        style={{
          top: "calc(var(--t-space-tight) + env(safe-area-inset-top))",
          right: "max(var(--t-space-tight), env(safe-area-inset-right))",
        }}
      >
        {intro.skip}
      </button>

      {/* Texture của hai thiên thần cho renderer — không hiển thị trực tiếp */}
      <div aria-hidden className="hidden">
        {ASSET.cherubLeft ? (
          <Image ref={bind("texture-left")} src={ASSET.cherubLeft.src} width={800} height={960} sizes="800px" priority alt="" />
        ) : null}
        {ASSET.cherubRight ? (
          <Image ref={bind("texture-right")} src={ASSET.cherubRight.src} width={800} height={960} sizes="800px" priority alt="" />
        ) : null}
      </div>
    </div>
  );
}
