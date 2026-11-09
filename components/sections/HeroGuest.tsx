"use client";

import { useGuest } from "@/components/experience/GuestProvider";
import { hero } from "@/content/client";

/**
 * "Thân gửi" + tên khách, tra từ Sheet RSVP theo `?to=<slug>`.
 *
 * Không có khách (vào thẳng trang chủ, slug sai, hub chưa nối) thì không
 * render gì — khối bọc ở Hero có `empty:hidden` nên bố cục khép lại như cũ.
 * Đang hỏi hub thì giữ sẵn chỗ (chữ ẩn) để tên hiện ra không đẩy cả trang.
 */
export function HeroGuest() {
  const { guest, loading } = useGuest();
  if (!guest && !loading) return null;

  return (
    <>
      <span className="font-title text-base italic">{hero.greeting}</span>
      <span className={`max-w-[20rem] font-title text-hero-guest text-balance ${guest ? "" : "invisible"}`}>
        {guest?.name ?? " "}
      </span>
    </>
  );
}
