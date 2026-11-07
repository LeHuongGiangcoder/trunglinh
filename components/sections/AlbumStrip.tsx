"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import type { Asset } from "@/lib/assets";

/*
  Băng ảnh năm thẻ của trang Album — thẻ giữa to nhất, hai bên nhỏ dần, thấp
  dần như brand/gallery 2. Bấm mũi tên (hoặc vuốt ngang) thì cả băng trượt
  một nấc, xoay vòng. Thẻ ngoài năm ô nhìn thấy nằm ẩn ở hai mép để trượt vào.

  Toạ độ là px trên artboard 4961×7016, quy ra % của artboard.
*/

const BOARD_W = 4961;
const BOARD_H = 7016;

type Box = { x: number; y: number; w: number; h: number };

/** Ô theo khoảng cách tới thẻ giữa: 0, ±1, ±2, và ±3 là chỗ chờ (ẩn). */
const SLOT: Record<number, Box> = {
  [-3]: { x: 300, y: 4300, w: 300, h: 560 },
  [-2]: { x: 430, y: 4160, w: 460, h: 840 },
  [-1]: { x: 890, y: 3732, w: 774, h: 1388 },
  0: { x: 1664, y: 3120, w: 1612, h: 2052 },
  1: { x: 3276, y: 3732, w: 774, h: 1388 },
  2: { x: 4050, y: 4160, w: 460, h: 840 },
  3: { x: 4361, y: 4300, w: 300, h: 560 },
};

/** Góc trên-trái của thẻ thụt xuống một bậc: rộng / sâu theo tỉ lệ thẻ. */
const NOTCH = { x: 0.265, y: 0.195 };

/** Mũi tên và dòng tên giữa chúng (px artboard). */
const PREV = { x: 1227, y: 5310, w: 472 };
const NEXT = { x: 3289, y: 5278, w: 453 };
const NAMES = { cx: 2494, cy: 5430 };

/** Mọi thẻ dùng chung một `sizes` để mỗi ảnh chỉ tải một lần dù thẻ đổi cỡ. */
const SIZES = "(min-width: 40rem) 13rem, 33vw";

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const place = (b: { x: number; y: number; w: number; h?: number }): CSSProperties => ({
  left: pct(b.x, BOARD_W),
  top: pct(b.y, BOARD_H),
  width: pct(b.w, BOARD_W),
  ...(b.h !== undefined ? { height: pct(b.h, BOARD_H) } : {}),
});

type Shot = { src: string; alt: string };

type AlbumStripProps = {
  shots: Shot[];
  start: number;
  names: string;
  prevLabel: string;
  nextLabel: string;
  prevArt: Asset | null;
  nextArt: Asset | null;
};

export function AlbumStrip({ shots, start, names, prevLabel, nextLabel, prevArt, nextArt }: AlbumStripProps) {
  const n = shots.length;
  const [index, setIndex] = useState(start % n);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = (step: number) => setIndex((i) => (i + step + n) % n);

  /** Khoảng cách vòng tròn từ thẻ i tới thẻ giữa, trong [-n/2, n/2). */
  const offsetOf = (i: number) => {
    let d = (i - index + n) % n;
    if (d >= n / 2) d -= n;
    return d;
  };

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const from = swipe.current;
    swipe.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return (
    <>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={names}
        className="absolute inset-0 touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        {shots.map((shot, i) => {
          const d = offsetOf(i);
          const slot = SLOT[Math.max(-3, Math.min(3, d))];
          const shown = Math.abs(d) <= 2;
          return (
            <div
              key={shot.src}
              aria-hidden={d !== 0}
              className="absolute transition-[left,top,width,height,opacity] duration-(--t-duration-slow) ease-glow"
              style={{ ...place(slot), opacity: shown ? 1 : 0, zIndex: 10 - Math.abs(d) }}
            >
              {/* Thân thẻ dưới bậc thụt: trọn bề ngang */}
              <div
                className="absolute inset-x-0 bottom-0 overflow-hidden rounded-tile-xl"
                style={{ top: `${NOTCH.y * 100}%` }}
              >
                <div
                  className="absolute inset-x-0"
                  style={{ top: `${(-NOTCH.y / (1 - NOTCH.y)) * 100}%`, height: `${100 / (1 - NOTCH.y)}%` }}
                >
                  <Image src={shot.src} alt={d === 0 ? shot.alt : ""} fill sizes={SIZES} className="object-cover" />
                </div>
              </div>
              {/* Phần nhô lên bên phải bậc thụt: trọn bề cao */}
              <div
                className="absolute inset-y-0 right-0 overflow-hidden rounded-tile-xl"
                style={{ left: `${NOTCH.x * 100}%` }}
              >
                <div
                  className="absolute inset-y-0"
                  style={{ left: `${(-NOTCH.x / (1 - NOTCH.x)) * 100}%`, width: `${100 / (1 - NOTCH.x)}%` }}
                >
                  <Image src={shot.src} alt="" fill sizes={SIZES} className="object-cover" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-script text-poster-script text-cocoa"
        style={{ left: pct(NAMES.cx, BOARD_W), top: pct(NAMES.cy, BOARD_H) }}
      >
        {names}
        <span className="sr-only">
          {" "}
          — {index + 1}/{n}
        </span>
      </p>

      <ArrowButton art={prevArt} label={prevLabel} box={PREV} onClick={() => go(-1)} />
      <ArrowButton art={nextArt} label={nextLabel} box={NEXT} onClick={() => go(1)} />
    </>
  );
}

function ArrowButton({
  art,
  label,
  box,
  onClick,
}: {
  art: Asset | null;
  label: string;
  box: { x: number; y: number; w: number };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      /* Hình mũi tên nhỏ trên điện thoại — nút luôn chừa đủ vùng chạm quanh nó */
      className="group absolute z-20 flex items-center justify-center before:absolute before:top-1/2 before:left-1/2 before:size-tap before:-translate-1/2"
      style={place(box)}
    >
      {art ? (
        <Image
          src={art.src}
          width={art.width}
          height={art.height}
          alt=""
          sizes="(min-width: 40rem) 6rem, 10vw"
          className="h-auto w-full transition-transform duration-(--t-duration-fast) ease-glow group-active:scale-90"
        />
      ) : null}
    </button>
  );
}
