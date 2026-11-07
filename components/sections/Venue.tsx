import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { design, venue } from "@/content/client";
import { background as resolveBackground } from "@/lib/assets";

/*
  Trang Địa điểm — file brand/venue.png là một tấm thiệp đã dàn trang sẵn
  (artboard 4961×7016): nền giấy nổi, ký hoạ khách sạn, tên sảnh, địa chỉ và
  nút "Xem bản đồ" đều in trong ảnh.

  Vì chữ nằm trong ảnh, section giữ một bản chữ thật cho trình đọc màn hình
  và phủ một link trong suốt đúng lên khung nút "Xem bản đồ".
*/

/** Khung nút "Xem bản đồ", đo trên venue.png, đổi ra % artboard. */
const MAP_BUTTON = { left: "29.5%", top: "77%", width: "41%", height: "17%" } as const;

export function Venue() {
  const card = resolveBackground(design.venue.background);

  return (
    <SectionWrapper
      section="venue"
      flush
      width="bleed"
      labelledBy="venue-title"
      className="sm:py-section"
    >
      <div className="sr-only">
        <h2 id="venue-title">{venue.name}</h2>
        <p>{venue.hall}</p>
        <p>{venue.address}</p>
      </div>

      <div
        data-reveal
        className="relative mx-auto aspect-[4961/7016] w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift"
      >
        {card ? (
          <Image
            src={card.src}
            alt=""
            fill
            sizes="(min-width: 40rem) 40rem, 100vw"
            className="object-cover"
          />
        ) : null}

        <a
          href={venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${venue.mapLabel} — ${venue.name}`}
          className="absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tone-accent"
          style={MAP_BUTTON}
        />
      </div>
    </SectionWrapper>
  );
}
