import { Body, SectionHead } from "@/components/ui/Heading";
import { CopyText } from "@/components/ui/CopyText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { honeymoonFund } from "@/content/client";

/**
 * Quỹ trăng mật: ảnh cặp đôi phủ kín khung hình (`design.honeymoonFund` trong
 * client.ts). Tiêu đề và lời ngỏ ở khoảng tường trống phía trên; tài khoản
 * nhận gọn hai dòng ở chân section — số tài khoản chạm vào là chép.
 */
export function HoneymoonFund() {
  const { account } = honeymoonFund;

  return (
    <SectionWrapper section="honeymoonFund" flush width="bleed" labelledBy="honeymoon-fund-title">
      <div className="safe-top relative flex min-h-[125svh] flex-col items-center px-gutter py-section text-center">
        <SectionHead
          eyebrow={honeymoonFund.eyebrow}
          title={honeymoonFund.title}
          titleId="honeymoon-fund-title"
        />

        <Reveal delay={90}>
          <Body>{honeymoonFund.body}</Body>
        </Reveal>

        <Reveal delay={120} className="mt-auto flex flex-col items-center gap-tight">
          <p className="text-balance font-display text-small text-tone-fg">
            <span className="text-tone-accent">{account.holder}</span> · {account.bank}
          </p>
          <CopyText
            value={account.number}
            hint={honeymoonFund.copyHint}
            copiedLabel={honeymoonFund.copiedLabel}
            className="font-display text-h3"
          />
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
