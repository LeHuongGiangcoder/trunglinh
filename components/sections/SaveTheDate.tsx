import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { design, saveTheDate } from "@/content/client";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Thẻ Save the Date — dựng lại theo file layout trong brand/save the date.

  Mọi khối là một layer đặt theo % của artboard, nên thẻ co giãn nguyên khối
  mà không lệch: trên điện thoại tràn hết bề ngang, trên màn rộng thành một
  tấm thiệp đặt giữa nền giấy.

  Artboard gốc 4961×7016; thẻ lịch bản mới cao hơn (chừa chỗ cho dòng ngày và
  giờ) nên artboard kéo dài xuống cho vừa chân thẻ.

  Chỉ chữ "Save the Date!" có animation (wipe); các khối còn lại đứng yên.

  Thứ tự lớp, dưới lên: nền giấy → hai ảnh → chữ "Save the Date!" →
  thẻ lịch răng cưa (đè lên chân ảnh trái) → huy hiệu thiên nga → ngày + giờ.
*/

const W = 4961;
const CARD = { x: 81, y: 3761, w: 4800, h: 4432 };
const H = CARD.y + CARD.h;

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;
/** Khung theo pixel artboard → style % để co theo khung chứa. */
const box = (x: number, y: number, w: number, h?: number) => ({
  left: pct(x, W),
  top: pct(y, H),
  width: pct(w, W),
  ...(h ? { height: pct(h, H) } : {}),
});

/** Toạ độ đo từ layout.png (pixel artboard). */
const FRAME = {
  photoLeft: box(0, 0, 2390, 3900),
  photoRight: box(2575, 263, 2249, 3371),
  script: box(187, 353, 2082),
  card: box(CARD.x, CARD.y, CARD.w, CARD.h),
  seal: box(2104, 3324, 753),
  /** Ngày + giờ: ngay dưới "THE WEDDING OF", trên tên hai bạn. */
  details: { top: pct(CARD.y + 1560, H) },
} as const;

export function SaveTheDate() {
  const paper = resolveBackground(design.saveTheDate.background);
  const script = element("save-the-date-script");
  const card = element("save-the-date-stamp");
  const seal = element("swan-seal");
  const [left, right] = saveTheDate.photos;

  return (
    <SectionWrapper
      section="saveTheDate"
      flush
      width="bleed"
      labelledBy="save-the-date-title"
      className="sm:py-section"
    >
      <h2 id="save-the-date-title" className="sr-only">
        {saveTheDate.title} — {saveTheDate.date}
      </h2>

      <div className="@container relative mx-auto aspect-[4961/8193] w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift">
        {paper ? (
          <Image src={paper.src} alt="" fill sizes="(min-width: 40rem) 40rem, 100vw" className="object-cover" />
        ) : null}

        <div className="absolute overflow-hidden" style={FRAME.photoLeft}>
          <Image
            src={left.src}
            alt={left.alt}
            fill
            sizes="(min-width: 40rem) 20rem, 50vw"
            className="object-cover"
          />
        </div>

        <div className="absolute overflow-hidden" style={FRAME.photoRight}>
          <Image
            src={right.src}
            alt={right.alt}
            fill
            sizes="(min-width: 40rem) 19rem, 46vw"
            className="object-cover"
          />
        </div>

        {script ? (
          <Image
            src={script.src}
            width={script.width}
            height={script.height}
            alt=""
            sizes="(min-width: 40rem) 17rem, 42vw"
            data-reveal
            data-reveal-style="wipe"
            className="wipe-mask absolute h-auto"
            style={FRAME.script}
          />
        ) : null}

        {card ? (
          <Image
            src={card.src}
            width={card.width}
            height={card.height}
            alt="Lịch tháng 12, ngày cưới được đánh dấu — The wedding of Trung & Linh"
            sizes="(min-width: 40rem) 39rem, 97vw"
            className="absolute"
            style={FRAME.card}
          />
        ) : null}

        {seal ? (
          <Image
            src={seal.src}
            width={seal.width}
            height={seal.height}
            alt=""
            sizes="(min-width: 40rem) 6rem, 15vw"
            className="absolute h-auto"
            style={FRAME.seal}
          />
        ) : null}

        <div
          className="absolute inset-x-0 flex flex-col items-center text-center font-body text-cocoa"
          style={FRAME.details}
        >
          <p aria-hidden className="text-poster font-semibold">
            {saveTheDate.date}
          </p>

          {/* Hai cột đối xứng quanh một vạch dọc: giờ trên, việc dưới, cùng căn giữa. */}
          <ul className="mt-tight grid w-[94%] grid-cols-2 divide-x divide-cocoa">
            {saveTheDate.schedule.map((item) => (
              <li key={item.time} className="flex flex-col items-center px-tight">
                <span className="font-title text-poster-note italic">{item.time}</span>
                <span className="text-poster-label text-balance">{item.label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-stack max-w-[80%] font-body text-poster-label italic text-balance">{saveTheDate.note}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
