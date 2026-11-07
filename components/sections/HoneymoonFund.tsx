import { Caption, SectionHead } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { honeymoonFund } from "@/content/client";

/** Quỹ trăng mật: lời ngỏ ngắn và mã QR đặt trong khung ảnh chung của site. */
export function HoneymoonFund() {
  const { qr } = honeymoonFund;

  return (
    <SectionWrapper section="honeymoonFund" width="prose" labelledBy="honeymoon-fund-title">
      <SectionHead
        eyebrow={honeymoonFund.eyebrow}
        title={honeymoonFund.title}
        titleId="honeymoon-fund-title"
        intro={honeymoonFund.intro}
      />

      <Reveal delay={90} className="flex flex-col items-center gap-block text-center">
        <p className="max-w-prose text-base text-tone-fg">{honeymoonFund.body}</p>

        <ImageFrame
          src={qr.src}
          alt={qr.alt}
          ratio={`${qr.width} / ${qr.height}`}
          sizes="(max-width: 48rem) 80vw, 24rem"
          className="w-[80%] max-w-[24rem]"
        />

        <Caption>{honeymoonFund.caption}</Caption>
      </Reveal>
    </SectionWrapper>
  );
}
