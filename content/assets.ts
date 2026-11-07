/**
 * TỰ SINH — đừng sửa tay. Chạy `npm run assets` để dựng lại.
 *
 * Bản kê những gì đang có trong brand/. Nguồn thật nằm ở brand/, bản chép để
 * phục vụ nằm ở public/brand/. Gắn asset vào section ở `design` trong
 * content/client.ts; TypeScript sẽ bắt lỗi nếu gõ sai tên.
 */

export const assets = {
  /** Vân giấy / hoạ tiết lặp, trải kín nền section */
  textures: {},

  /** Ảnh nền full-bleed của một section */
  backgrounds: {
    "cherub-sky": { src: "/brand/backgrounds/cherub-sky.webp", width: 1448, height: 2048 },
    "little-child-sky": { src: "/brand/backgrounds/little-child-sky.webp", width: 1600, height: 2263 },
    "save-the-date-paper": { src: "/brand/backgrounds/save-the-date-paper.webp", width: 1600, height: 2263 },
    "venue": { src: "/brand/backgrounds/venue.webp", width: 2480, height: 3507 },
  },

  /** Hoạ tiết rời (hoa, ruy băng, con dấu) — nền trong suốt */
  elements: {
    "calendar-card": { src: "/brand/elements/calendar-card.webp", width: 1600, height: 1085 },
    "cherub-left": { src: "/brand/elements/cherub-left.webp", width: 800, height: 960 },
    "cherub-paper-left": { src: "/brand/elements/cherub-paper-left.webp", width: 1448, height: 2048 },
    "cherub-paper-right": { src: "/brand/elements/cherub-paper-right.webp", width: 1448, height: 2048 },
    "cherub-right": { src: "/brand/elements/cherub-right.webp", width: 800, height: 960 },
    "cherub-stamp": { src: "/brand/elements/cherub-stamp.webp", width: 660, height: 660 },
    "dove-ribbon": { src: "/brand/elements/dove-ribbon.webp", width: 900, height: 421 },
    "heart-doodle-left": { src: "/brand/elements/heart-doodle-left.webp", width: 737, height: 575 },
    "heart-doodle-right": { src: "/brand/elements/heart-doodle-right.webp", width: 736, height: 575 },
    "love-script": { src: "/brand/elements/love-script.webp", width: 721, height: 290 },
    "love-story-title": { src: "/brand/elements/love-story-title.webp", width: 1600, height: 619 },
    "save-the-date-script": { src: "/brand/elements/save-the-date-script.webp", width: 1200, height: 724 },
    "stamp-frame": { src: "/brand/elements/stamp-frame.webp", width: 1100, height: 1068 },
    "swan-seal": { src: "/brand/elements/swan-seal.webp", width: 600, height: 600 },
    "vinyl-disc": { src: "/brand/elements/vinyl-disc.webp", width: 1000, height: 1000 },
    "vinyl-swoosh": { src: "/brand/elements/vinyl-swoosh.webp", width: 700, height: 1537 },
  },

  /** Dải ngăn giữa hai section, lặp theo chiều ngang */
  dividers: {},
} as const;

export type TextureName = keyof typeof assets.textures;
export type BackgroundName = keyof typeof assets.backgrounds;
export type ElementName = keyof typeof assets.elements;
export type DividerName = keyof typeof assets.dividers;
