import Image from "next/image";
import type { CSSProperties } from "react";

import { MusicButton } from "@/components/ui/MusicButton";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { design, littleChild } from "@/content/client";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Trang "hồi nhỏ" — dựng lại bộ layer brand/little child (artboard 4961×7016).

  Dưới lên: nền trời + mặt dây chuyền ảnh hai đứa hồi nhỏ → đĩa than (xoay
  mãi) → khung tem răng cưa (đè lên mép trái đĩa, như file gốc) → ảnh cưới
  trong lòng tem → vệt chuyển động quanh đĩa → đôi chim kéo dải ruy băng.

  Cuộn tới gần khung tem thì đôi chim bay dần sang phải, lên nằm trên đĩa
  than, và ảnh cưới hiện theo vệt trái → phải ngay sau cánh chim — "start
  scene" / "end scene" trong brand/little child. Toạ độ khung cuối đo bằng
  cách dò đôi chim trong end scene.png.
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

/** Toạ độ px artboard, đo từ các file trong brand/little child. */
const DISC = { x: 1965, y: 3512, size: 2794 };
const STAMP = { x: 0, y: 3520, w: 2863 };
const PHOTO = { x: 0, y: 3851, w: 2648, h: 2115 };
const SWOOSH = { x: 2832, y: 3213, w: 1501 };
const BIRDS = { x: 246, y: 4242, w: 2180, h: 1019 };
/** Đôi chim ở end scene lệch so với start scene bấy nhiêu px artboard. */
const BIRDS_TRAVEL = { dx: 2480, dy: -584 };
/** Tâm chữ "Phát nhạc" dưới đĩa. */
const LABEL = { cx: 4127, cy: 6597 };
/** Dải trống giữa tên "Trung & Linh" và mép trên khung tem. */
const NOTE = { x: 250, cy: 3330 };

export function LittleChild() {
  const sky = resolveBackground(design.littleChild.background);
  const disc = element("vinyl-disc");
  const swoosh = element("vinyl-swoosh");
  const stamp = element("stamp-frame");
  const birds = element("dove-ribbon");

  return (
    <SectionWrapper
      section="littleChild"
      flush
      width="bleed"
      labelledBy="little-child-title"
      className="sm:py-section"
    >
      <h2 id="little-child-title" className="sr-only">
        {littleChild.title}
      </h2>

      <div
        data-scene
        data-scene-start="52% 74%"
        data-scene-end="82% 30%"
        className="@container relative mx-auto aspect-[4961/7016] w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift"
      >
        {sky ? (
          <Image
            src={sky.src}
            alt={littleChild.lockedAlt}
            fill
            sizes="(min-width: 40rem) 40rem, 100vw"
            className="object-cover"
          />
        ) : null}

        <p
          data-reveal
          className="absolute -translate-y-1/2 whitespace-nowrap font-display text-poster-note italic text-cocoa"
          style={{ left: pctX(NOTE.x), top: pctY(NOTE.cy) }}
        >
          {littleChild.question}
        </p>

        {disc ? (
          <div className="absolute aspect-square" style={box(DISC.x, DISC.y, DISC.size)}>
            <Image
              src={disc.src}
              width={disc.width}
              height={disc.height}
              alt=""
              sizes="(min-width: 40rem) 23rem, 57vw"
              data-spin="9"
              className="size-full will-change-transform"
            />
          </div>
        ) : null}

        {stamp ? (
          <Image
            src={stamp.src}
            width={stamp.width}
            height={stamp.height}
            alt=""
            sizes="(min-width: 40rem) 23rem, 58vw"
            className="absolute h-auto"
            style={box(STAMP.x, STAMP.y, STAMP.w)}
          />
        ) : null}

        <div className="wipe-mask absolute" data-scene-wipe style={box(PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h)}>
          <Image
            src={littleChild.photo.src}
            alt={littleChild.photo.alt}
            fill
            sizes="(min-width: 40rem) 21rem, 54vw"
            className="object-cover"
          />
        </div>

        {swoosh ? (
          <Image
            src={swoosh.src}
            width={swoosh.width}
            height={swoosh.height}
            alt=""
            sizes="(min-width: 40rem) 12rem, 31vw"
            className="pointer-events-none absolute h-auto"
            style={box(SWOOSH.x, SWOOSH.y, SWOOSH.w)}
          />
        ) : null}

        {/* Vùng chạm tròn trùm lên đĩa, nhãn "Phát nhạc" treo dưới đĩa như file gốc */}
        <MusicButton
          playLabel={littleChild.playLabel}
          pauseLabel={littleChild.pauseLabel}
          className="absolute aspect-square rounded-full font-body text-poster-label text-ink"
          style={box(DISC.x, DISC.y, DISC.size)}
          labelClassName="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          labelStyle={{
            left: `${((LABEL.cx - DISC.x) / DISC.size) * 100}%`,
            top: `${((LABEL.cy - DISC.y) / DISC.size) * 100}%`,
          }}
        />

        {birds ? (
          <Image
            src={birds.src}
            width={birds.width}
            height={birds.height}
            alt=""
            sizes="(min-width: 40rem) 18rem, 44vw"
            data-scene-x={((BIRDS_TRAVEL.dx / BIRDS.w) * 100).toFixed(2)}
            data-scene-y={((BIRDS_TRAVEL.dy / BIRDS.h) * 100).toFixed(2)}
            className="pointer-events-none absolute h-auto will-change-transform"
            style={box(BIRDS.x, BIRDS.y, BIRDS.w)}
          />
        ) : null}
      </div>
    </SectionWrapper>
  );
}
