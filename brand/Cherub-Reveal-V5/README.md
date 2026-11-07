# Cherub Reveal V5

V5 bỏ hoàn toàn việc đổi/crossfade bộ giấy. Trạng thái ban đầu được ghép từ chính hai tấm giấy full đã cân màu ở V4, cộng một stamp riêng. Từ lúc tải xong đến lúc kéo, giấy giữ nguyên hình, màu, kích thước và opacity.

## Mở xem

- Giải nén cả thư mục và mở `demo.html`, giữ `assets`, `controller.js`, `cherub-mesh.js` cạnh HTML.
- File `Cherub-Reveal-V5.html` gửi riêng chứa sẵn asset, không cần giải nén.
- Có chọn ảnh couple, chạy lại, tạm dừng và scrub để duyệt chuyển động. Ảnh được đọc tại thiết bị.

## Quy tắc cố định của V5

1. Hai giấy full xuất hiện ngay từ frame đầu, opacity luôn bằng 1.
2. Stamp là asset độc lập; chỉ stamp fade trong 0–1,15s.
3. Khi thiên thần xuất hiện, chỉ các layer thiên thần chuyển động. Giấy và nền giữ nguyên.
4. Đến 3,5s, hai giấy mới bắt đầu di chuyển, mỗi giấy và thiên thần cùng một parent.

## Asset

| File | Vai trò |
|---|---|
| `assets/paper-left-full.png`, `paper-right-full.png` | Hai giấy nguyên vẹn, màu V4, transparent 1448×2048 |
| `assets/paper-left-full.webp`, `paper-right-full.webp` | Bản lossless dùng trong demo |
| `assets/stamp.png`, `stamp.webp` | Stamp xanh riêng, transparent 660×660 |
| `assets/cherub-left.png`, `cherub-right.png` | Hai thiên thần riêng, trọn cánh, 800×960 |
| `assets/cherub-left.webp`, `cherub-right.webp` | Texture lossless cho renderer |
| `assets/background.webp` | Nền xanh cố định |
| `source/reference-original.webp` | Reference để đối chiếu, không được dùng làm overlay trong intro |

Đọc `docs/CODING-PROMPT.md` và `docs/ANIMATION-GUIDE.md` khi tích hợp. Kit V5 không cần các asset giấy legacy hoặc ảnh bìa ghép của V1–V4.

Nhịp mở 9,2s và mesh cánh giữ như V4. Hero vẫn là vùng mẫu vì chưa có ảnh couple cuối cùng. Video là render từ cùng controller và Canvas fallback, chưa phải browser E2E.
