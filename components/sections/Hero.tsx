import Image from "next/image";

import { HeroGuest } from "@/components/sections/HeroGuest";
import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, Lead } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, hero, venue } from "@/content/client";
import { element } from "@/lib/assets";

/*
  Ô vuông bàn cờ ở hai góc trên của bố cục poster, lấy theo file thiết kế
  (brand/source/hero1.png). Đơn vị là một ô (`--spacing-cell`); số âm là ô bị
  mép màn cắt bớt.
*/
const CELLS: { side: "left" | "right"; x: number; y: number }[] = [
  { side: "left", x: 0.5, y: 0 },
  { side: "left", x: -0.5, y: 1 },
  { side: "right", x: -0.22, y: -0.4 },
  { side: "right", x: 0.78, y: 0.6 },
  { side: "right", x: -0.22, y: 1.6 },
  { side: "right", x: 0.78, y: 2.6 },
];

const unit = (n: number) => `calc(var(--spacing-cell) * ${n})`;

/**
 * Trang bìa: tên hai người, ngày giờ, một dòng mời.
 *
 * Các khối gắn `data-hero` nên chúng hiện theo cú chạm mở thiệp chứ không chờ
 * cuộn — hero nằm ngay dưới màn mở thiệp nên sẽ không bao giờ "cuộn tới".
 */
export function Hero() {
  return hero.layout === "poster" ? <PosterHero /> : <ClassicHero />;
}

/**
 * Ảnh cưới full màn, chữ tiêu đề ở trên, ô vuông nhấp nháy ở hai góc.
 *
 * Ảnh là nền của section (`design.hero` trong client.ts), nên nó đã nằm sẵn
 * dưới màn mở thiệp và lộ ra khi giấy được kéo. Ô vuông (`data-flicker`) và
 * chữ (`data-hero`) chờ cú mở thiệp rồi mới hiện — xem Motion.tsx.
 */
function PosterHero() {
  const title = element(hero.titleArt);

  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title" priority>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {CELLS.map((cell, i) => (
          <span
            key={i}
            data-flicker
            className="absolute size-cell bg-tone-fg"
            style={{ top: unit(cell.y), [cell.side]: unit(cell.x) }}
          />
        ))}
      </div>

      <div className="safe-top relative flex min-h-[100svh] flex-col items-center px-gutter text-center">
        <h1 id="hero-title" className="flex w-full flex-col items-center gap-tight">
          {title ? (
            <Image
              src={title.src}
              width={title.width}
              height={title.height}
              alt={hero.titleAlt}
              sizes="(min-width: 40rem) 32rem, 72vw"
              priority
              data-reveal
              data-hero
              data-reveal-style="wipe"
              className="wipe-mask h-auto w-[min(72%,32rem)]"
            />
          ) : (
            <span className="font-display text-h1 uppercase">{hero.titleAlt}</span>
          )}

          {/* "Thân gửi" + tên khách — rỗng (và ẩn) khi khách không vào bằng link riêng */}
          <span
            data-reveal
            data-hero
            data-reveal-delay="850"
            className="mt-tight flex flex-col items-center gap-tight text-harbor empty:hidden"
          >
            <HeroGuest />
          </span>

          <span
            data-reveal
            data-hero
            data-reveal-delay="1050"
            className="max-w-[18rem] font-title text-base text-harbor"
          >
            {hero.invite}
          </span>

          <span
            data-reveal
            data-hero
            data-reveal-delay="1200"
            className="mt-stack flex flex-col items-center font-title text-hero-name uppercase text-harbor"
          >
            <span>{couple.groomGiven}</span>
            <span aria-hidden className="font-amp text-hero-amp normal-case">
              &amp;
            </span>
            <span className="sr-only">và</span>
            <span>{couple.brideGiven}</span>
          </span>
        </h1>

        <p
          data-reveal
          data-hero
          data-reveal-delay="1550"
          className="mt-stack flex w-full max-w-[18rem] items-center gap-stack font-title text-hero-date text-harbor"
        >
          <span aria-hidden className="h-px grow bg-harbor" />
          {ceremony.dateShort.replaceAll(" ", "")}
          <span aria-hidden className="h-px grow bg-harbor" />
        </p>
      </div>
    </SectionWrapper>
  );
}

function ClassicHero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="container-site flex min-h-[100svh] flex-col items-center justify-center gap-stack py-section text-center">
        <Eyebrow data-reveal data-hero>
          {hero.eyebrow}
        </Eyebrow>

        <Heading
          level="display"
          id="hero-title"
          data-reveal
          data-hero
          className="flex flex-col items-center short:text-h1"
        >
          <span>{couple.groom}</span>
          <span className="font-script text-h2 text-tone-accent">&amp;</span>
          <span>{couple.bride}</span>
        </Heading>

        <div data-reveal data-hero className="flex flex-col items-center gap-tight">
          <Divider diamond />
          <Lead>{hero.headline}</Lead>
          <p className="font-display text-h3">
            {ceremony.weekday}, {ceremony.dateShort}
          </p>
          <Caption>
            {ceremony.timeLabel} · {venue.name}
          </Caption>
        </div>

        <p data-reveal data-hero className="mt-block text-eyebrow uppercase text-tone-muted">
          {hero.scrollHint} ↓
        </p>
      </div>
    </SectionWrapper>
  );
}
