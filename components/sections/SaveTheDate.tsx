import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { design, saveTheDate } from "@/content/client";
import { background as resolveBackground, element } from "@/lib/assets";

/*
  Thẻ Save the Date — dựng lại đúng file layout trong brand/save the date.

  Mọi khối là một layer đặt theo % của artboard gốc 4961×7016 (khổ A), nên
  thẻ co giãn nguyên khối mà không lệch: trên điện thoại tràn hết bề ngang,
  trên màn rộng thành một tấm thiệp đặt giữa nền giấy.

  Thứ tự lớp, dưới lên: nền giấy → hai ảnh → chữ "Save the Date!" →
  thẻ lịch răng cưa (đè lên chân ảnh trái) → huy hiệu thiên nga → dòng ngày.
*/

/** Toạ độ đo từ layout.png, đổi ra % artboard. */
const FRAME = {
  photoLeft: { left: "0%", top: "0%", width: "48.18%", height: "55.59%" },
  photoRight: { left: "51.91%", top: "3.75%", width: "45.33%", height: "48.05%" },
  script: { left: "3.77%", top: "5.03%", width: "41.97%" },
  card: { left: "1.63%", top: "53.61%", width: "96.76%" },
  seal: { left: "42.41%", top: "47.38%", width: "15.18%" },
  /** Khoảng trống giữa "THE WEDDING OF" và tên — dòng ngày nằm giữa khoảng này. */
  date: { top: "79.8%" },
} as const;

export function SaveTheDate() {
  const paper = resolveBackground(design.saveTheDate.background);
  const script = element("save-the-date-script");
  const card = element("calendar-card");
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

      <div className="@container relative mx-auto aspect-[4961/7016] w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift">
        {paper ? (
          <Image src={paper.src} alt="" fill sizes="(min-width: 40rem) 40rem, 100vw" className="object-cover" />
        ) : null}

        <div data-reveal className="absolute overflow-hidden" style={FRAME.photoLeft}>
          <Image
            src={left.src}
            alt={left.alt}
            fill
            sizes="(min-width: 40rem) 20rem, 50vw"
            className="object-cover"
          />
        </div>

        <div data-reveal data-reveal-delay="180" className="absolute overflow-hidden" style={FRAME.photoRight}>
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
            data-reveal-delay="500"
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
            data-reveal
            data-reveal-delay="300"
            className="absolute h-auto"
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
            data-reveal
            data-reveal-delay="650"
            className="absolute h-auto"
            style={FRAME.seal}
          />
        ) : null}

        <p
          aria-hidden
          data-reveal
          data-reveal-delay="850"
          className="absolute inset-x-0 -translate-y-1/2 text-center font-body text-poster font-medium text-cocoa"
          style={FRAME.date}
        >
          {saveTheDate.date}
        </p>
      </div>
    </SectionWrapper>
  );
}
