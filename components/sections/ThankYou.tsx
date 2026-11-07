import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Heading, Lead, Script } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { couple, thankYou } from "@/content/client";

/**
 * Màn cuối: một ảnh cưới phủ kín khung hình (`design.thankYou` trong
 * client.ts), lời cảm ơn nằm ở khoảng trời phía trên, hashtag ở chân.
 */
export function ThankYou() {
  return (
    <SectionWrapper section="thankYou" flush width="bleed" labelledBy="thank-you-title">
      <div className="safe-top relative flex min-h-[100svh] flex-col items-center justify-between px-gutter py-section text-center">
        <Reveal className="flex flex-col items-center gap-stack">
          <Eyebrow>{thankYou.eyebrow}</Eyebrow>
          <Heading level="h2" id="thank-you-title">
            {thankYou.title}
          </Heading>
          <Divider diamond />
          <div className="flex flex-col gap-tight">
            {thankYou.lines.map((line) => (
              <Lead key={line}>{line}</Lead>
            ))}
          </div>
          <Script>{thankYou.signature}</Script>
        </Reveal>

        <Reveal delay={150}>
          <Eyebrow>{couple.hashtag}</Eyebrow>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
