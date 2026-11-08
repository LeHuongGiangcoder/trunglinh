import { Body, Caption, Eyebrow, SectionHead } from "@/components/ui/Heading";
import { CopyText } from "@/components/ui/CopyText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { honeymoonFund } from "@/content/client";

/**
 * Quỹ trăng mật: ảnh cặp đôi phủ kín khung hình (`design.honeymoonFund` trong
 * client.ts). Tiêu đề ở khoảng tường trống phía trên; lời ngỏ và tài khoản
 * nhận ở chân section — số tài khoản chạm vào là chép.
 */
export function HoneymoonFund() {
  const { account } = honeymoonFund;

  return (
    <SectionWrapper section="honeymoonFund" flush width="bleed" labelledBy="honeymoon-fund-title">
      <div className="safe-top relative flex min-h-[125svh] flex-col items-center gap-block px-gutter py-section text-center">
        <SectionHead
          eyebrow={honeymoonFund.eyebrow}
          title={honeymoonFund.title}
          titleId="honeymoon-fund-title"
          intro={honeymoonFund.intro}
        />

        <Reveal delay={120} className="mt-auto flex flex-col items-center gap-block">
          <Body>{honeymoonFund.body}</Body>

          <div className="flex flex-col items-center gap-stack">
            <div className="flex flex-col items-center gap-tight">
              <Eyebrow>{account.holder}</Eyebrow>
              <p className="font-display text-h4 text-tone-fg">{account.bank}</p>
            </div>
            <CopyText
              value={account.number}
              hint={honeymoonFund.copyHint}
              copiedLabel={honeymoonFund.copiedLabel}
              className="font-display text-h1"
            />
          </div>

          <Caption>{honeymoonFund.caption}</Caption>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
