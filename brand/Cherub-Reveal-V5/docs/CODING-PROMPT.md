# Prompt tích hợp V5

Hãy cập nhật intro hiện tại theo kit V5. Yêu cầu quan trọng nhất: hai giấy phải là cùng các layer từ frame đầu đến lúc rời màn hình. Khi thiên thần xuất hiện, giấy và nền giữ nguyên hoàn toàn.

Dùng `paper-left-full.webp` và `paper-right-full.webp` ngay từ lúc tải trang, cả hai opacity 1. Chúng đã được regenerate nguyên vẹn và cân màu. Dùng stamp độc lập `stamp.webp` tại (530,850), kích thước 330×330 trên artboard 1448×2048.

Click stamp: chỉ stamp fade trong 1,15s. Hai thiên thần bay vào theo timeline có sẵn và đập cánh. Trước 3,5s, giấy không translate, rotate, scale, fade, morph, đổi src hoặc đổi màu. Đến 3,5s, mới transform hai parent để thiên thần kéo chính hai giấy đó ra hai bên. Giữ nhịp 9,2s và renderer cánh V4 đã duyệt.

Xóa logic dùng ảnh bìa ghép hoặc texture giấy cũ để crossfade sang giấy full. Không dùng các file legacy/closed composite trong runtime. `source/reference-original.webp` chỉ là reference, không được đặt thành overlay.

Tham khảo `demo.html`, `controller.js`, `cherub-mesh.js`, manifest và animation guide. Giữ same-parent hand lock khi kéo, preload/decode, button accessible, click guard, reduced motion, Bỏ qua, scroll/focus lifecycle và cleanup. Thay placeholder bằng hero thật, bỏ panel duyệt khỏi giao diện khách mời. Không thay nội dung ngoài intro.

Kiểm tra đặc biệt: render giấy+nền riêng ở 0s, 1,3s, 2s, 2,9s, 3,49s phải giống nhau từng pixel; chỉ layer stamp và thiên thần được thay đổi theo nhịp trước khi kéo.
