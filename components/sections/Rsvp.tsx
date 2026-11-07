"use client";

import { useState, type FormEvent } from "react";

import { useGuest } from "@/components/experience/GuestProvider";
import { Button } from "@/components/ui/Button";
import { Caption, Heading, Script, SectionHead } from "@/components/ui/Heading";
import { PaperCard } from "@/components/ui/PaperCard";
import { Choice, Field, FieldLabel } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { rsvp } from "@/content/client";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Form RSVP.
 *
 * Dữ liệu đi thẳng tới Glow RSVP Hub theo đúng hợp đồng trong skill glow-rsvp:
 *
 *   • POST, Content-Type `text/plain;charset=utf-8` — để Apps Script không
 *     dính CORS preflight (nó không trả lời được preflight).
 *   • Body là MỘT object phẳng: `client` + đúng các field của form.
 *   • Không gửi key rỗng và không gửi state của giao diện (status, step…).
 *   • Hub tự đổi "yes"/"no" thành Có/Không, nên gửi nguyên chuỗi đó.
 *
 * Thêm hay đổi tên field ở đây thì phải chạy lại:
 *   ~/glow-tools/glow-rsvp.sh fields <client> --fields "key=Nhãn;…"
 *
 * `rsvp.endpoint` còn trống (khung nền chưa nối Sheet) thì form vẫn chạy đủ
 * và báo thành công, chỉ không gửi đi đâu cả.
 */
export function Rsvp() {
  const { guest } = useGuest();
  const [status, setStatus] = useState<Status>("idle");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(0);
  const [side, setSide] = useState("");

  const personalized = rsvp.mode === "personalized";
  const fields = rsvp.fields;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const going = attending === "yes";

    // Thứ tự các key ở đây chính là thứ tự cột trong Sheet của khách.
    const values: Record<string, string | number> = {
      name: guest?.name ?? String(data.get("name") ?? "").trim(),
      attending,
      guests: going ? guests : 0,
      side,
      message: String(data.get("message") ?? "").trim(),
    };

    // Khách vào bằng link mời riêng: gửi kèm slug để hub ghi đúng dòng của họ.
    if (personalized && guest?.slug) values.slug = guest.slug;

    // Không gửi key rỗng — cột trống trong Sheet là rác.
    for (const [key, value] of Object.entries(values)) {
      if (value === "") delete values[key];
    }

    setStatus("sending");

    if (!rsvp.endpoint || !rsvp.client) {
      // Chưa chạy skill glow-rsvp. Vẫn cho khách thấy màn cảm ơn khi dựng thử.
      console.info("[rsvp] chưa nối hub, dữ liệu sẽ gửi:", values);
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ client: rsvp.client, ...values }),
      });
      const payload = (await res.json()) as { ok?: boolean };
      setStatus(payload?.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionWrapper
      section="rsvp"
      flush
      width="bleed"
      labelledBy="rsvp-title"
      className="sm:py-section"
    >
      {/*
        Nền giấy brand/rsvp.png cắt ba dải (xem PaperCard). Lề trong tính theo %
        bề ngang thiệp để chữ luôn né hoa ở bốn góc, dù thiệp to hay nhỏ.
      */}
      <PaperCard
        top="rsvp-paper-top"
        middle="rsvp-paper-middle"
        bottom="rsvp-paper-bottom"
        className="px-[13%] pt-[16%] pb-[26%]"
      >
        {/* Đầu thiệp hẹp hơn form: hoa góc phải thòng xuống ngang tầm tiêu đề */}
        <div className="px-[9%]">
          <SectionHead
            eyebrow={rsvp.eyebrow}
            title={
              personalized && guest
                ? `${rsvp.greeting} ${guest.name}`
                : rsvp.title
            }
            titleId="rsvp-title"
            intro={rsvp.note}
          />
        </div>

        <Reveal>
          {status === "sent" ? (
            <div
              role="status"
              className="flex flex-col items-center gap-stack text-center"
            >
              <Heading level="h3">{rsvp.successTitle}</Heading>
              <Script>{rsvp.successNote}</Script>
              <Button variant="outline" onClick={() => setStatus("idle")}>
                Sửa lại câu trả lời
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-block">
              {/* Khách đã có tên trong Sheet thì khỏi hỏi lại */}
              {personalized && guest ? null : (
                <Field label={fields.name.label} htmlFor="rsvp-name">
                  <input
                    id="rsvp-name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={80}
                    placeholder={fields.name.placeholder}
                    className="field-input"
                  />
                </Field>
              )}

              <fieldset className="flex flex-col gap-tight">
                <FieldLabel as="legend">{fields.attending.label}</FieldLabel>
                <Choice
                  name="attending"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                >
                  {fields.attending.yes}
                </Choice>
                <Choice
                  name="attending"
                  value="no"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                >
                  {fields.attending.no}
                </Choice>
              </fieldset>

              {attending === "yes" ? (
                <Field label={fields.guests.label} htmlFor="rsvp-guests">
                  <select
                    id="rsvp-guests"
                    name="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="field-input"
                  >
                    <option value={0}>{fields.guests.none}</option>
                    {Array.from(
                      { length: fields.guests.max },
                      (_, i) => i + 1,
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} người
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              <fieldset className="flex flex-col gap-tight">
                <FieldLabel as="legend">{fields.side.label}</FieldLabel>
                <div className="flex flex-wrap gap-x-block">
                  {fields.side.options.map((option) => (
                    <Choice
                      key={option}
                      name="side"
                      value={option}
                      checked={side === option}
                      onChange={() => setSide(option)}
                    >
                      {option}
                    </Choice>
                  ))}
                </div>
              </fieldset>

              <Field label={fields.message.label} htmlFor="rsvp-message">
                <textarea
                  id="rsvp-message"
                  name="message"
                  maxLength={600}
                  placeholder={fields.message.placeholder}
                  className="field-input"
                />
              </Field>

              <div className="flex flex-col items-center gap-stack">
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? rsvp.sending : rsvp.submit}
                </Button>
                <Caption className="text-center">{rsvp.deadline}</Caption>
                {status === "error" ? (
                  <p role="alert" className="text-small text-tone-accent">
                    {rsvp.errorNote}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </Reveal>
      </PaperCard>
    </SectionWrapper>
  );
}
