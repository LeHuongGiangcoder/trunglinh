# Animation guide V5

## Cấu trúc từ frame đầu

Trang đầu được ghép từ nền + `paper-right-full` + `paper-left-full` + stamp độc lập. Cùng hai tấm giấy này sẽ được kéo ra sau đó. Không có overlay ảnh bìa ghép, texture proxy, morph, crossfade giấy hoặc đổi src khi click.

Màu hai giấy giữ nguyên V4, khoảng ivory #f4f0ea. PNG/WebP đã cân màu sẵn; opacity giấy luôn 1, không áp thêm filter màu.

## Timeline

| Thời gian | Diễn biến |
|---|---|
| 0s | Hai giấy full và stamp đã nằm đúng vị trí; thiên thần ẩn |
| 0–1,15s | Chỉ stamp fade nhẹ tại chỗ, không nhấc/xoay/scale |
| 1,12–2,90s | Thiên thần trái bay vào, đập cánh |
| 1,28–3,06s | Thiên thần phải bay vào sau 160ms |
| Trước 3,50s | Giấy đứng yên tuyệt đối, cùng màu, họa tiết, outline và opacity như frame đầu |
| 3,50–8,60s | Hai thiên thần kéo giấy ra hai bên, easeInOutSine |
| 7,90–9,20s | Hero copy hiện mềm |
| 8,35–8,90s | Thiên thần fade khi đã rời mép |
| 9,00–9,20s | Kết thúc intro, mở tương tác hero |

Tổng 9,2s. Nhịp kéo, cánh và đường bay không thay đổi so với V4.

## Tọa độ

Artboard 1448×2048, fit contain, center trong viewport. Background có thể cover. Hai giấy full cùng canvas, luôn đặt (0,0), width 1448, height 2048; vị trí artwork đã được bake vào canvas. Đừng trim rồi đặt lại.

| Thành phần | Thông số |
|---|---|
| Stamp | x=530, y=850, w=330, h=330 artboard px |
| Stamp texture | PNG/WebP 660×660, hiển thị 330×330 |
| Thiên thần trái/phải | Sprite 800×960, hiển thị 800×960 trong artboard |
| Tay trái local | (645,290) |
| Tay phải local | (140,284) |
| Nắm giấy trái | (606,926) |
| Nắm giấy phải | (865,926) |
| Quãng kéo | Trái -1030px, phải +1030px, đi lên 35px |
| Xoay khi kéo | Ra ngoài ±2,2° |

Tính top-left nhân vật bằng `grip - localHand * spriteScale`. Mỗi giấy và thiên thần tương ứng nằm chung parent transform. Bob thân dừng trước lúc tay chạm; sau đó tay giữ cùng vị trí tương đối với giấy.

## Điều kiện phải giữ cho giấy

- `src` cố định từ lúc preload đến lúc unmount.
- `opacity: 1` ở mọi frame.
- Không filter động, không đổi texture, không scale/morph/fade.
- Parent transform phải là identity với mọi t < 3,5s.
- Trong nhịp thiên thần bay vào, giấy và nền phải cho ra cùng raster nếu tách riêng các layer thiên thần và stamp.
- Khi bắt đầu kéo, chỉ transform parent theo timeline; không đổi asset ở mốc này.

## Cánh

Một texture liền cho mỗi con, continuous mesh như V4. Chu kỳ 1,6s, hai bên lệch phase. Cánh ngoài khoảng ±24°, cánh xa ±15°, falloff mềm để không kéo biến dạng mặt hoặc bàn tay. Giữ padding sprite, không cắt cánh thành mảnh rời. WebGL là renderer chính, Canvas 2D fallback.

## Hero và production

- Hero thật preload/decode trước khi cho bấm stamp. Mask phụ chỉ mở khi nhịp kéo bắt đầu; trước đó hero ẩn hoàn toàn.
- Stamp button hỗ trợ Enter/Space và chặn click lặp. Bỏ qua/reduced motion đi đến cùng trạng thái cuối.
- Khóa/unlock scroll và focus theo lifecycle app; bỏ overlay sau hoàn tất, cleanup khi unmount.
- Callback `invitation:opened` đúng một lần mỗi lượt. Nếu lưu session, chỉ lưu sau hoàn tất.
- Giữ nhạc theo lựa chọn sản phẩm, không tự autoplay.
- Bỏ panel chọn ảnh/replay/pause/scrub khỏi production. Các nút này chỉ để duyệt.
- Kiểm tra Chrome/Safari trên mobile và desktop với ảnh couple thật. Video native chỉ xác nhận bố cục và logic render, không thay thế browser E2E.
