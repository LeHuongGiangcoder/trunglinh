import Image from "next/image";
import type { ReactNode } from "react";

import type { ElementName } from "@/content/assets";
import { element } from "@/lib/assets";

/**
 * Tấm thiệp giấy co giãn theo nội dung.
 *
 * Một trang thiệp khổ A (vd. brand/rsvp.png) cắt làm ba dải: `top` và `bottom`
 * mang hoạ tiết viền, giữ nguyên tỉ lệ; `middle` chỉ có vân giấy, kéo dài theo
 * chiều dọc cho vừa nội dung. Nhờ vậy form dài bao nhiêu thì hoa ở góc vẫn
 * nằm đúng góc, không bị `object-cover` cắt mất như khi phủ cả ảnh.
 *
 * Điện thoại: tràn hết bề ngang. Màn rộng: thành một tấm thiệp đặt giữa trang,
 * cùng khuôn với các trang poster khác.
 */
export function PaperCard({
  top,
  middle,
  bottom,
  className = "",
  children,
}: {
  top: ElementName;
  middle: ElementName;
  bottom: ElementName;
  /** Chỉ cho layout bên trong (padding, gap) — không đặt màu ở đây. */
  className?: string;
  children: ReactNode;
}) {
  const head = element(top);
  const body = element(middle);
  const foot = element(bottom);

  return (
    <div className="relative isolate mx-auto w-full overflow-hidden sm:max-w-prose sm:rounded-paper sm:shadow-lift">
      <div aria-hidden className="absolute inset-0 -z-10 flex flex-col">
        {head ? (
          <Image
            src={head.src}
            width={head.width}
            height={head.height}
            alt=""
            sizes="(min-width: 40rem) 40rem, 100vw"
            className="h-auto w-full shrink-0"
          />
        ) : null}
        {body ? (
          <div className="relative -my-px grow">
            <Image src={body.src} alt="" fill sizes="(min-width: 40rem) 40rem, 100vw" className="object-fill" />
          </div>
        ) : null}
        {foot ? (
          <Image
            src={foot.src}
            width={foot.width}
            height={foot.height}
            alt=""
            sizes="(min-width: 40rem) 40rem, 100vw"
            className="h-auto w-full shrink-0"
          />
        ) : null}
      </div>

      <div className={className}>{children}</div>
    </div>
  );
}
