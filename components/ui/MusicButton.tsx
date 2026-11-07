"use client";

import type { CSSProperties } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { music } from "@/content/client";

type MusicButtonProps = {
  /** Nhãn khi nhạc đang tắt / đang phát. */
  playLabel: string;
  pauseLabel: string;
  className?: string;
  style?: CSSProperties;
  /** Đặt riêng chỗ của nhãn chữ — ví dụ nút trùm lên hoạ tiết, nhãn treo bên dưới. */
  labelClassName?: string;
  labelStyle?: CSSProperties;
};

/**
 * Nút bật/tắt nhạc đặt ngay trong artwork (đĩa than, máy hát…), dùng chung
 * trạng thái với MusicToggle nổi ở góc. Site tắt nhạc thì không render gì.
 */
export function MusicButton({ playLabel, pauseLabel, className = "", style, labelClassName = "", labelStyle }: MusicButtonProps) {
  const { musicOn, toggleMusic } = useExperience();

  // Không dựa vào `hasAudio`: nếu cú mở thiệp không phát được nhạc thì chính
  // nút này phải là chỗ để khách tự bật.
  if (!music.enabled || music.src === "") return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={musicOn}
      aria-label={`${musicOn ? pauseLabel : playLabel}: ${music.title}`}
      className={className}
      style={style}
    >
      <span aria-hidden className={labelClassName} style={labelStyle}>
        {musicOn ? pauseLabel : playLabel}
      </span>
    </button>
  );
}
