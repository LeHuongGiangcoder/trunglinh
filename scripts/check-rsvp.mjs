// Chốt lúc build: site chưa nối Glow RSVP Hub thì không được build.
//
// Rsvp.tsx báo "đã gửi" khi rsvp.endpoint hoặc rsvp.client rỗng, nên một site
// mới quên nối Hub vẫn trông như chạy. Script này đọc khối `export const rsvp`
// trong content/client.ts và dừng build nếu thiếu.
//
//   node scripts/check-rsvp.mjs [đường-dẫn-file]   (mặc định content/client.ts)
//   ALLOW_EMPTY_RSVP=1                              bỏ qua, dùng cho khung nền
//
// Không bao giờ in giá trị endpoint ra log.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HUB_PREFIX = "https://script.google.com/macros/";

if (process.env.ALLOW_EMPTY_RSVP === "1") {
  console.log("[check-rsvp] bỏ qua (ALLOW_EMPTY_RSVP=1)");
  process.exit(0);
}

const file = resolve(process.argv[2] ?? "content/client.ts");

let source;
try {
  source = readFileSync(file, "utf8");
} catch (err) {
  console.error(`[check-rsvp] Không đọc được file: ${file} (${err.code ?? err.message})`);
  process.exit(1);
}

// Cắt đúng khối `export const rsvp = { ... };` — từ dòng khai báo đến dòng
// đóng `}` đầu tiên nằm sát lề trái.
// Bỏ BOM nếu có (một số editor trên Windows ghi BOM) để dòng đầu vẫn khớp `^export`.
const lines = source.replace(/^﻿/, "").split(/\r?\n/);
const start = lines.findIndex((l) => /^export\s+const\s+rsvp\b/.test(l));
if (start === -1) {
  console.error(`[check-rsvp] Không tìm thấy khối "export const rsvp" trong ${file}`);
  process.exit(1);
}
let end = lines.findIndex((l, i) => i > start && /^\}/.test(l));
if (end === -1) end = lines.length - 1;
const block = lines.slice(start, end + 1).join("\n");

// Lấy giá trị chuỗi của một key nằm ở đầu dòng (không dính dòng bị comment).
function readString(key) {
  const re = new RegExp(`^[ \\t]*${key}[ \\t]*:[ \\t]*(["'\`])((?:\\\\.|(?!\\1)[^\\\\\\n])*)\\1`, "m");
  const m = block.match(re);
  return m ? m[2].trim() : "";
}

const endpoint = readString("endpoint");
const client = readString("client");

const problems = [];
if (!endpoint) {
  problems.push("rsvp.endpoint đang trống");
} else if (!endpoint.startsWith(HUB_PREFIX)) {
  problems.push(`rsvp.endpoint không phải URL Apps Script (phải bắt đầu bằng ${HUB_PREFIX})`);
}
if (!client) {
  problems.push("rsvp.client đang trống");
}

if (problems.length === 0) {
  console.log("[check-rsvp] OK: endpoint và client đã được điền.");
  process.exit(0);
}

console.error("[check-rsvp] RSVP chưa nối Hub, dừng build:");
for (const p of problems) console.error(`  - ${p}`);
console.error("");
console.error("  Site này sẽ báo khách \"đã gửi\" dù không có gì được ghi lại.");
console.error("  Cách sửa: chạy skill glow-rsvp để nó điền endpoint + client vào content/client.ts.");
console.error("  Nếu đây là khung nền glow-base (cố ý để trống): đặt ALLOW_EMPTY_RSVP=1 rồi build lại.");
console.error("    PowerShell: $env:ALLOW_EMPTY_RSVP = \"1\"; npm run build");
console.error("    bash:       ALLOW_EMPTY_RSVP=1 npm run build");
process.exit(1);
