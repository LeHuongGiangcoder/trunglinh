"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Một dòng chữ chạm vào là chép vào clipboard — số tài khoản, mã, địa chỉ.
 *
 * Dòng gợi ý bên dưới đổi thành `copiedLabel` trong vài giây sau khi chép,
 * và được đọc to qua aria-live cho trình đọc màn hình. Cỡ chữ của dòng chính
 * do section truyền qua `className` (một bậc trong thang của theme.ts).
 */
export function CopyText({
  value,
  hint,
  copiedLabel,
  className = "",
}: {
  value: string;
  hint: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Safari cũ / trang không chạy https: chép bằng ô nhập ẩn.
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.top = "-100vh";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex cursor-pointer flex-col items-center gap-tight text-center"
      aria-label={`${value}. ${hint}`}
    >
      <span
        className={`inline-flex items-center gap-tight text-tone-fg lining-nums tabular-nums transition-colors group-hover:text-tone-accent ${className}`}
      >
        {value}
        <CopyIcon done={copied} />
      </span>
      <span aria-live="polite" className="text-small text-tone-accent">
        {copied ? copiedLabel : hint}
      </span>
    </button>
  );
}

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[0.6em] shrink-0 text-tone-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {done ? (
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      ) : (
        <>
          <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
          <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
        </>
      )}
    </svg>
  );
}
