import Image from "next/image";

import { Divider } from "@/components/ui/Divider";
import { Eyebrow, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { couple, thankYou } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Màn cuối: một ảnh cưới phủ kín khung hình (`design.thankYou` trong
 * client.ts), lời cảm ơn nằm ở khoảng trời phía trên, hashtag ở chân.
 * Lời ký là monogram của cặp đôi (brand/elements/monogram).
 */
export function ThankYou() {
  const monogram = element("monogram-cream");

  return (
    <SectionWrapper section="thankYou" flush width="bleed" labelledBy="thank-you-title">
      <div className="safe-top relative flex min-h-[100svh] flex-col items-center justify-between px-gutter py-section text-center">
        <div className="flex flex-col items-center gap-stack">
          <SectionHead
            eyebrow={thankYou.eyebrow}
            title={thankYou.title}
            titleId="thank-you-title"
            intro={thankYou.lines.join(" ")}
          />
          <Reveal delay={90} className="flex flex-col items-center gap-stack">
            <Divider diamond />
            {monogram ? (
              <Image
                src={monogram.src}
                width={monogram.width}
                height={monogram.height}
                alt={thankYou.signature}
                sizes="8rem"
                className="h-auto w-[clamp(5rem,22vw,8rem)]"
              />
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={150}>
          <Eyebrow>{couple.hashtag}</Eyebrow>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
