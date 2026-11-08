import Image from "next/image";
import type { CSSProperties } from "react";

import { AlbumStrip } from "@/components/sections/AlbumStrip";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { album, couple, design } from "@/content/client";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Trang album thứ hai — dựng lại bộ layer brand/gallery 2 (artboard 4961×7016).

  Dưới lên: nền giấy → ảnh cặp đôi trong khung vòm (viền xanh, mép dưới tan
  vào giấy) → mây hai bên → băng ảnh năm thẻ + mũi tên + tên → bướm bay.

  Bướm có hai chuyển động tách nhau: cánh đập bằng CSS (.flutter trong
  globals.css), thân lượn quanh chỗ đứng bằng GSAP ([data-flit] trong Motion).
*/

const BOARD_W = 4961;
const BOARD_H = 7016;

const pctX = (v: number) => `${(v / BOARD_W) * 100}%`;
const pctY = (v: number) => `${(v / BOARD_H) * 100}%`;
const box = (x: number, y: number, w: number, h?: number): CSSProperties => ({
  left: pctX(x),
  top: pctY(y),
  width: pctX(w),
  ...(h !== undefined ? { height: pctY(h) } : {}),
});

/** Khung ảnh vòm: hộp chứa ảnh, đường chân trời của viền và hai đầu cung. */
const ARC = { x: 0, y: 820, w: BOARD_W, h: 2480 };
const ARC_LINE = 320; // viền ngang ở hai mép, tính từ đỉnh hộp
const ARC_FROM = 480;
const ARC_TO = 4740;
const ARC_LIFT = -96; // điểm điều khiển Bézier, cho đỉnh cung chạm ~y 8

/** Đường viền vòm, toạ độ trong hộp ARC. */
const ARC_PATH = `M0 ${ARC_LINE} H${ARC_FROM} C1400 ${ARC_LIFT} 3820 ${ARC_LIFT} ${ARC_TO} ${ARC_LINE} H${ARC.w}`;
/** Cùng đường đó, khép lại và quy về 0–1 cho clipPath objectBoundingBox. */
const nx = (v: number) => (v / ARC.w).toFixed(4);
const ny = (v: number) => (v / ARC.h).toFixed(4);
const ARC_CLIP = `M0 ${ny(ARC_LINE)} L${nx(ARC_FROM)} ${ny(ARC_LINE)} C${nx(1400)} ${ny(ARC_LIFT)} ${nx(3820)} ${ny(ARC_LIFT)} ${nx(ARC_TO)} ${ny(ARC_LINE)} L1 ${ny(ARC_LINE)} L1 1 L0 1 Z`;

const CLOUDS = [
  { name: "cloud-left", x: 0, y: 3360, w: 1622 },
  { name: "cloud-right", x: 3489, y: 3344, w: 1472 },
] as const;

/**
 * Bướm: chỗ đứng (px artboard), thân nằm ở đâu trong hình (`body`), thân
 * nghiêng bao nhiêu so với phương đứng (`axis`), và lượn xa bao nhiêu.
 */
const BUTTERFLIES = [
  { name: "butterfly-a", x: 0, y: 858, w: 608, body: "40% 60%", axis: "-45deg", flit: 70, delay: "0s" },
  { name: "butterfly-b", x: 4300, y: 2113, w: 660, body: "73% 57%", axis: "45deg", flit: 55, delay: "-0.7s" },
  { name: "butterfly-c", x: 4205, y: 2946, w: 595, body: "52% 57%", axis: "45deg", flit: 80, delay: "-1.3s" },
] as const;

/** Đoạn trích dẫn dưới tên. */
const QUOTE = { x: 250, y: 5730, w: 4461 };

export function Album() {
  const paper = resolveBackground(design.album.background);

  return (
    <SectionWrapper section="album" flush width="bleed" labelledBy="album-title" className="sm:py-section">
      <h2 id="album-title" className="sr-only">
        {album.title}
      </h2>

      {/* clipPath của khung vòm — objectBoundingBox nên co theo ảnh */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <clipPath id="album-arc" clipPathUnits="objectBoundingBox">
          <path d={ARC_CLIP} />
        </clipPath>
      </svg>

      {/* overflow-clip, không phải hidden: bướm bay ra mép không được làm khung cuộn ngang */}
      <div className="@container relative mx-auto aspect-[4961/7016] w-full overflow-clip sm:max-w-prose sm:rounded-paper sm:shadow-lift">
        {paper ? (
          <Image src={paper.src} alt="" fill sizes="(min-width: 40rem) 40rem, 100vw" className="object-cover" />
        ) : null}

        <div className="fade-bottom absolute [clip-path:url(#album-arc)]" style={box(ARC.x, ARC.y, ARC.w, ARC.h)}>
          <Image
            src={album.arc.src}
            alt={album.arc.alt}
            fill
            sizes="(min-width: 40rem) 40rem, 100vw"
            className="object-cover"
          />
        </div>

        <svg
          aria-hidden
          viewBox={`0 0 ${ARC.w} ${ARC.h}`}
          className="pointer-events-none absolute overflow-visible fill-none stroke-sky-ink"
          style={box(ARC.x, ARC.y, ARC.w, ARC.h)}
        >
          <path d={ARC_PATH} strokeWidth={10} />
        </svg>

        {CLOUDS.map((c) => {
          const art = element(c.name);
          return art ? (
            <Image
              key={c.name}
              src={art.src}
              width={art.width}
              height={art.height}
              alt=""
              sizes="(min-width: 40rem) 14rem, 33vw"
              className="pointer-events-none absolute h-auto"
              style={box(c.x, c.y, c.w)}
            />
          ) : null;
        })}

        <AlbumStrip
          shots={album.shots}
          start={album.start}
          names={`${couple.groomGiven} & ${couple.brideGiven}`}
          prevLabel={album.prevLabel}
          nextLabel={album.nextLabel}
          prevArt={element("arrow-left")}
          nextArt={element("arrow-right")}
        />

        <p
          data-reveal
          className="absolute text-center font-display text-poster-quote text-balance text-ink"
          style={box(QUOTE.x, QUOTE.y, QUOTE.w)}
        >
          {album.quote}
        </p>

        {BUTTERFLIES.map((b) => {
          const art = element(b.name);
          return art ? (
            <div
              key={b.name}
              aria-hidden
              data-flit={b.flit}
              className="pointer-events-none absolute z-30 will-change-transform"
              style={box(b.x, b.y, b.w)}
            >
              <span
                className="flutter"
                style={{ "--body": b.body, "--axis": b.axis, "--flap-delay": b.delay } as CSSProperties}
              >
                <span className="flutter-wings">
                  <Image
                    src={art.src}
                    width={art.width}
                    height={art.height}
                    alt=""
                    sizes="(min-width: 40rem) 6rem, 14vw"
                    className="h-auto w-full"
                  />
                </span>
              </span>
            </div>
          ) : null;
        })}
      </div>
    </SectionWrapper>
  );
}
