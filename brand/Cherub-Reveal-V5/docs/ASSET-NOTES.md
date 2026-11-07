# Asset notes V5

Hai PNG giấy full và các bản WebP giữ nguyên byte so với V4: màu ivory, hình và đường viền không thay đổi. Hai PNG thiên thần, mesh và background cũng giữ nguyên.

V5 thay cấu trúc scene: bỏ ảnh bìa ghép và lớp giấy chuyển tiếp; từ frame đầu chỉ render hai giấy full. Stamp tách thành một asset riêng, xuất PNG/WebP 660×660 từ native stamp SVG đã có. Không regenerate giấy hoặc thiên thần ở V5.

`source/reference-original.webp` chỉ lưu hình gốc để tham khảo. Runtime HTML không sử dụng nó. Kit chỉ chứa các asset cần thiết cho cấu trúc mới.

Các giấy full được regenerate riêng ở V3; native SVG color transfer sRGB ở V4 đã cân chúng về cùng tông trang đầu. Chi tiết giấy có khác nhẹ với ảnh phẳng gốc. Khung đầu V5 được ghép từ đúng bộ giấy full dùng khi kéo, để scene nhất quán từ đầu đến cuối.
