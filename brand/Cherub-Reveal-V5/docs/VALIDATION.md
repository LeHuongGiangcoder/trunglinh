# Validation V5

- Controller chạy trong DOM mô phỏng, renderer dùng cùng Canvas fallback như demo.
- Paper/background-only pass được so sánh byte raster ở 0s, 0,6s, 1,12s, 1,3s, 2s, 2,9s và 3,49s. Điều kiện nghiệm thu: hoàn toàn giống nhau.
- Kiểm tra parent transform giấy là identity trước 3,5s; HTML/controller không chứa layer chuyển tiếp và không gán opacity/src cho giấy.
- Hai PNG giấy full, texture WebP, background và cherub mesh giữ nguyên V4.
- Render 185 frame, 20fps để tạo video. Xem frame mở đầu, stamp fade, thiên thần xuất hiện và giấy bắt đầu kéo.
- ZIP kiểm tra CRC và file checksum sau khi lưu.

Giới hạn: chưa chạy browser E2E vì môi trường không có browser engine khả dụng. Video là render native Canvas từ cùng logic, không phải quay browser. Khi tích hợp cần duyệt WebGL/Chrome/Safari và ảnh hero thật.
