import Image from "next/image";
import type { CSSProperties } from "react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, design, gallery } from "@/content/client";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Album bố cục "mosaic" — dựng lại brand/gallery/layout.png.

  Artboard gốc 4961×7016 (khổ A), mọi khối đặt theo % của nó nên cả trang co
  giãn nguyên khối. Khối giữa là MỘT ảnh nhìn qua các ô bo góc xếp so le
  thành hình trái tim: mỗi ô là một cửa sổ cắt đúng phần ảnh nằm sau nó, nên
  ảnh liền mạch qua khe giữa các ô. Mọi ô dùng chung một `sizes` để trình
  duyệt chỉ tải ảnh đó một lần.
*/

const BOARD_W = 4961;
const BOARD_H = 7016;

/** Cạnh ô ghép và năm cột so le, đo từ layout.png (px artboard). */
const TILE = 772;
const COLUMNS: { x: number; rows: number[] }[] = [
  { x: 500, rows: [2028, 2816] },
  { x: 1288, rows: [1548, 3116] },
  { x: 2076, rows: [2180, 2968, 3756] },
  { x: 2864, rows: [1548, 3116] },
  { x: 3652, rows: [2028, 2816] },
];

/** Hai ô chi tiết nghiêng (tâm + cạnh + góc) và khung ảnh viền trắng. */
const DETAILS = [
  { cx: 1204, cy: 5505, side: 790, rotate: -4.6 },
  { cx: 2350, cy: 5496, side: 790, rotate: 4.6 },
];
const FRAME = { x: 3252, y: 4553, w: 1299, h: 1908, border: 40 };

/** Nét vẽ tay tách từ layout (brand/elements). */
const INK = [
  { name: "love-script", x: 2103, y: 1773, w: 721, delay: 900, wipe: true },
  { name: "heart-doodle-left", x: 1305, y: 2415, w: 737, delay: 1100, wipe: true },
  { name: "heart-doodle-right", x: 2884, y: 2415, w: 736, delay: 1250, wipe: true },
] as const;

/** Một ảnh dùng chung cho mọi ô — bề rộng ảnh khi hiển thị ≈ 93% artboard. */
const PHOTO_SIZES = "(min-width: 40rem) 37rem, 93vw";

const pctX = (v: number) => `${(v / BOARD_W) * 100}%`;
const pctY = (v: number) => `${(v / BOARD_H) * 100}%`;

/** Ô vuông/chữ nhật trên artboard, theo px artboard. */
const box = (x: number, y: number, w: number, h?: number): CSSProperties => ({
  left: pctX(x),
  top: pctY(y),
  width: pctX(w),
  ...(h !== undefined ? { height: pctY(h) } : {}),
});

export function GalleryMosaic() {
  const paper = resolveBackground(design.gallery.background);
  const { mosaic } = gallery;
  const photoW = mosaic.place.width;
  /* Ảnh gốc 2:3 — chiều cao suy từ tỉ lệ ảnh, nên giữ đúng tỉ lệ khi thay ảnh. */
  const photoH = photoW * 1.5;

  /** Vị trí ảnh lớn bên trong một ô, tính theo % của chính ô đó. */
  const windowFor = (tileX: number, tileY: number): CSSProperties => ({
    left: `${((mosaic.place.x - tileX) / TILE) * 100}%`,
    top: `${((mosaic.place.y - tileY) / TILE) * 100}%`,
    width: `${(photoW / TILE) * 100}%`,
    height: `${(photoH / TILE) * 100}%`,
  });

  /** Ô chi tiết: phóng ảnh sao cho đúng vùng (cx, cy, side) lấp kín ô. */
  const detailFor = (d: (typeof mosaic.details)[number]): CSSProperties => {
    const sideH = d.side / 1.5; // cạnh ô tính theo bề cao ảnh 2:3
    return {
      width: `${100 / d.side}%`,
      height: `${100 / sideH}%`,
      left: `${(-(d.cx - d.side / 2) / d.side) * 100}%`,
      top: `${(-(d.cy - sideH / 2) / sideH) * 100}%`,
    };
  };

  return (
    <SectionWrapper section="gallery" flush width="bleed" labelledBy="gallery-title" className="sm:py-section">
      <div className="@container relative mx-auto aspect-[4961/7016] w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift">
        {paper ? (
          <Image src={paper.src} alt="" fill sizes="(min-width: 40rem) 40rem, 100vw" className="object-cover" />
        ) : null}

        {/* Tên + ngày, góc trên trái */}
        <h2 id="gallery-title" className="font-display font-semibold uppercase text-taupe">
          <span
            data-reveal
            className="absolute whitespace-nowrap text-poster-title"
            style={{ left: pctX(510), top: pctY(560) }}
          >
            {couple.groomGiven}
          </span>
          <span
            data-reveal
            data-reveal-delay="150"
            className="absolute flex items-baseline gap-tight whitespace-nowrap text-poster-title"
            style={{ right: pctX(BOARD_W - 2608), top: pctY(860) }}
          >
            <span className="font-script text-poster-title font-normal normal-case">and</span>
            {couple.brideGiven}
          </span>
        </h2>
        <p
          data-reveal
          data-reveal-delay="300"
          className="absolute whitespace-nowrap font-display text-poster-caption font-semibold text-taupe"
          style={{ right: pctX(BOARD_W - 2622), top: pctY(1190) }}
        >
          {ceremony.dateShort.replace(/\s/g, "")}
        </p>

        {/* Khối ghép trái tim */}
        <div role="img" aria-label={mosaic.alt}>
          {COLUMNS.flatMap((col, c) =>
            col.rows.map((y, r) => (
              <div
                key={`${c}-${r}`}
                aria-hidden
                data-reveal
                data-reveal-delay={String(Math.abs(c - 2) * 120 + r * 90)}
                className="absolute overflow-hidden rounded-tile"
                style={box(col.x, y, TILE, TILE)}
              >
                <div className="absolute" style={windowFor(col.x, y)}>
                  <Image src={mosaic.src} alt="" fill sizes={PHOTO_SIZES} className="object-cover" />
                </div>
              </div>
            )),
          )}
        </div>

        {INK.map((ink) => {
          const art = element(ink.name);
          if (!art) return null;
          return (
            <Image
              key={ink.name}
              src={art.src}
              width={art.width}
              height={art.height}
              alt=""
              sizes="(min-width: 40rem) 6rem, 15vw"
              data-reveal
              data-reveal-delay={String(ink.delay)}
              data-reveal-style={ink.wipe ? "wipe" : undefined}
              className="wipe-mask absolute h-auto"
              style={box(ink.x, ink.y, ink.w)}
            />
          );
        })}

        {/* Hai ô chi tiết nghiêng */}
        {DETAILS.map((d, i) => (
          <div
            key={i}
            data-reveal
            data-reveal-delay={String(200 + i * 160)}
            className="absolute"
            style={box(d.cx - d.side / 2, d.cy - d.side / 2, d.side, d.side)}
          >
            <div
              className="relative size-full overflow-hidden rounded-tile"
              style={{ transform: `rotate(${d.rotate}deg)` }}
            >
              <div className="absolute" style={detailFor(mosaic.details[i])}>
                <Image
                  src={mosaic.src}
                  alt={mosaic.details[i].alt}
                  fill
                  sizes={PHOTO_SIZES}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Ảnh viền trắng góc dưới phải */}
        <div
          data-reveal
          data-reveal-delay="300"
          className="absolute rounded-tile-lg bg-surface"
          style={box(FRAME.x, FRAME.y, FRAME.w, FRAME.h)}
        >
          <div
            className="absolute overflow-hidden rounded-tile"
            style={{
              inset: `${(FRAME.border / FRAME.h) * 100}% ${(FRAME.border / FRAME.w) * 100}%`,
            }}
          >
            <Image src={mosaic.src} alt={mosaic.alt} fill sizes={PHOTO_SIZES} className="object-cover" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
