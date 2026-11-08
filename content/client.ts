import type { BackgroundName, DividerName, ElementName, TextureName } from "@/content/assets";
import type { Tone } from "@/content/theme";

/**
 * NỘI DUNG CỦA KHÁCH — làm site mới thì sửa duy nhất file này (và theme.ts,
 * public/images, public/audio). Không cần mở components.
 *
 * ⚠️ Toàn bộ giá trị dưới đây là PLACEHOLDER. Trước khi gửi khách phải thay
 * hết: tên, ngày giờ, địa chỉ, link Maps, ảnh, nhạc, RSVP endpoint.
 *
 * Ngày giờ luôn viết dạng ISO kèm offset Việt Nam (+07:00) để lịch và đồng hồ
 * đếm ngược không lệch múi giờ.
 */

/* --------------------------------------------------------------- SECTIONS */

/** Mọi section có trong khung nền. */
export type SectionId =
  | "intro"
  | "hero"
  | "saveTheDate"
  | "littleChild"
  | "album"
  | "venue"
  | "loveStory"
  | "gallery"
  | "weddingInfo"
  | "agenda"
  | "dresscode"
  | "honeymoonFund"
  | "rsvp"
  | "thankYou";

/**
 * Thứ tự hiển thị. Bỏ một section khỏi mảng này là nó không render nữa —
 * không cần xoá code. Đổi chỗ hai dòng là đổi thứ tự trên trang.
 *
 * `intro` là màn mở thiệp, luôn nằm ngoài luồng cuộn; để nó trong mảng thì
 * có cổng mở thiệp, bỏ ra thì trang mở thẳng vào hero.
 */
export const sections: SectionId[] = [
  "intro",
  "hero",
  "saveTheDate",
  "gallery",
  "littleChild",
  "album",
  "venue",
  "honeymoonFund",
  "rsvp",
  "thankYou",
];

/* ----------------------------------------------------------- MẶT NHÌN */

/**
 * Một hoạ tiết rời đặt lên nền section.
 *
 * `at` là chuỗi utility Tailwind định vị + bề rộng, ví dụ
 * `"top-[6%] -left-[4%] w-[28%]"`. Dùng % thay vì rem để hoạ tiết co theo
 * section trên điện thoại; `hideOnMobile` cho những cái màn hẹp không còn chỗ.
 */
export type DecorPlacement = {
  name: ElementName;
  at: string;
  rotate?: number;
  /**
   * Chỉ đặt khi người dùng yêu cầu. Mặc định 1 — xem "Ba luật thiết kế" trong
   * CLAUDE.md: không làm mờ hoạ tiết cho chìm vào nền.
   */
  opacity?: number;
  /** Lắc lư nhẹ, cho thứ trông như đang treo hoặc rung rinh. */
  sway?: boolean;
  /** Trôi chậm hơn trang bao nhiêu % khi cuộn. */
  parallax?: number;
  hideOnMobile?: boolean;
};

export type SectionDesign = {
  /** id trong HTML — cũng là cái dùng cho link neo `#...`. */
  anchor: string;
  /** Bảng màu, xem `tones` trong content/theme.ts. */
  tone: Tone;
  /**
   * Ảnh nền full-bleed. Nhận hai kiểu:
   *   • tên trong `assets.backgrounds` — ảnh của design system, ở brand/
   *   • đường dẫn bắt đầu bằng "/" — ảnh của chính cặp đôi, ở public/images
   * null = chỉ dùng màu nền của tông.
   */
  background?: BackgroundName | `/${string}` | null;
  /** Độ mờ của lớp phủ trên ảnh nền, 0–1. Cao hơn = chữ dễ đọc hơn. 0 = không phủ. */
  overlay?: number;
  /**
   * Điểm giữ lại khi ảnh nền bị cắt bớt (giá trị CSS object-position), ví dụ
   * "50% 70%" để giữ phần dưới ảnh. Mặc định giữa ảnh.
   */
  focus?: string;
  /** Vân giấy lặp kín nền. */
  texture?: TextureName | null;
  /** Dải ngăn cưỡi lên đường nối với section phía trên. */
  divider?: DividerName | null;
  decor?: DecorPlacement[];
};

/**
 * Mặt nhìn của từng section — tông màu, nền, hoạ tiết.
 *
 * Tách khỏi file section để đổi diện mạo là sửa nội dung chứ không sửa code.
 * Tên asset lấy từ `content/assets.ts`, file đó do `npm run assets` sinh ra
 * sau khi bạn thả file vào `brand/`. Gõ sai tên là TypeScript báo đỏ ngay.
 *
 * Khung nền để trống hết phần nền — site chạy bằng màu phẳng của theme.
 */
export const design: Record<SectionId, SectionDesign> = {
  intro: { anchor: "intro", tone: "sky", background: "cherub-sky", overlay: 0 },
  hero: { anchor: "hero", tone: "dark", background: "/images/hero.jpg", overlay: 0, focus: "50% 62%" },
  saveTheDate: { anchor: "save-the-date", tone: "light", background: "save-the-date-paper", overlay: 0 },
  littleChild: { anchor: "little-child", tone: "sky", background: "little-child-sky", overlay: 0 },
  album: { anchor: "album", tone: "light", background: "gallery-paper", overlay: 0 },
  venue: { anchor: "venue", tone: "light", background: "venue", overlay: 0 },
  loveStory: { anchor: "love-story", tone: "paper" },
  gallery: { anchor: "gallery", tone: "light", background: "save-the-date-paper", overlay: 0 },
  weddingInfo: { anchor: "wedding-info", tone: "dark" },
  agenda: { anchor: "agenda", tone: "light" },
  dresscode: { anchor: "dresscode", tone: "paper" },
  honeymoonFund: {
    anchor: "honeymoon-fund",
    tone: "light",
    background: "/images/honeymoon.jpg",
    overlay: 0,
    focus: "50% 70%",
  },
  rsvp: { anchor: "rsvp", tone: "sky" },
  thankYou: {
    anchor: "thank-you",
    tone: "dark",
    background: "/images/thank-you.jpg",
    overlay: 0,
    focus: "47% 50%",
  },
};

/* ------------------------------------------------------------------ COUPLE */

export const couple = {
  /** Tên hiển thị lớn ở hero và màn mở thiệp */
  groom: "Trung",
  bride: "Linh",
  /** Tên đầy đủ, dùng trong phần thông tin lễ cưới */
  /** Tên đệm + tên, dùng ở đầu trang Album (bố cục "mosaic") */
  groomGiven: "Đức Trung",
  brideGiven: "Thuỳ Linh",
  groomFull: "Họ Tên Đầy Đủ Chú Rể",
  brideFull: "Họ Tên Đầy Đủ Cô Dâu",
  hashtag: "#TenChuReCuoiTenCoDau",
};

/** Bố mẹ hai bên — hiện ở section Thông tin lễ cưới */
export const families = [
  {
    side: "Nhà trai",
    people: [
      { role: "Ông", name: "Họ Tên Bố Chú Rể" },
      { role: "Bà", name: "Họ Tên Mẹ Chú Rể" },
    ],
    home: "Địa chỉ nhà trai",
  },
  {
    side: "Nhà gái",
    people: [
      { role: "Ông", name: "Họ Tên Bố Cô Dâu" },
      { role: "Bà", name: "Họ Tên Mẹ Cô Dâu" },
    ],
    home: "Địa chỉ nhà gái",
  },
];

/* -------------------------------------------------------------- NGÀY & GIỜ */

export const ceremony = {
  /** Giờ khai tiệc. Lịch, đồng hồ đếm ngược và link Google Calendar đều tính từ đây. */
  startISO: "2026-12-10T17:30:00+07:00",
  /** Giờ tan tiệc — chỉ dùng cho link thêm vào lịch. */
  endISO: "2026-12-10T21:30:00+07:00",
  weekday: "Thứ Năm",
  dateShort: "10 . 12 . 2026",
  timeLabel: "17:30",
  /** Ngày âm — gia đình tự đọc, không tính tự động. */
  lunar: "Tức ngày ... tháng ... năm Bính Ngọ",
};

export const venue = {
  name: "Khách sạn Minh Toàn Galaxy",
  hall: "Tầng 3 — Sảnh Eros",
  address: "306 Đường 2/9, Hoà Cường, TP. Đà Nẵng",
  /**
   * Link Maps của khách. Nên dùng link chia sẻ ghim sẵn, đừng để ?query= tự tìm.
   * TODO: đang tạm dùng link tìm kiếm — thay bằng link ghim khách gửi.
   */
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%A1ch+s%E1%BA%A1n+Minh+To%C3%A0n+Galaxy+306+%C4%90%C6%B0%E1%BB%9Dng+2%2F9+%C4%90%C3%A0+N%E1%BA%B5ng",
  mapLabel: "Xem bản đồ",
  note: "Kính mời quý khách tới sớm ít phút để kịp chụp hình cùng gia đình.",
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  /**
   * Kiểu màn mở thiệp:
   *   "card"   — tên + nút "Mở thiệp" trên ảnh nền (mặc định của glow-base)
   *   "cherub" — hai tấm giấy + dấu sáp, hai thiên thần bay vào kéo giấy ra
   *              (kit brand/Cherub-Reveal-V5, asset `cherub-*` trong brand/elements)
   */
  variant: "cherub" as "card" | "cherub",
  eyebrow: "Save the Date",
  /** Dòng gợi ý dưới dấu sáp (kiểu "cherub"). */
  hint: "Chạm nhẹ vào dấu sáp để mở thiệp",
  /** Nút bỏ qua hoạt cảnh (kiểu "cherub"). */
  skip: "Bỏ qua",
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: "Mở thiệp",
  note: "Trân trọng kính mời",
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  /**
   * Bố cục trang bìa:
   *   "classic" — chữ giữa màn trên nền ảnh phủ màu
   *   "poster"  — ảnh cưới full màn, chữ tiêu đề (ảnh `love-story-title`) ở
   *               trên, ô vuông bàn cờ nhấp nháy ở hai góc
   */
  layout: "poster" as "classic" | "poster",
  /** Ảnh chữ tiêu đề cho bố cục "poster" — tên trong brand/elements. */
  titleArt: "love-story-title" as ElementName,
  titleAlt: "Our Love Story",
  eyebrow: "Trân trọng kính mời",
  headline: "đến chung vui cùng gia đình chúng tôi",
  /** Lời mời trên tên cô dâu chú rể (bố cục "poster"). */
  invite: "Trân trọng kính mời quý khách đến tham dự lễ thành hôn của",
  scrollHint: "Cuộn xuống",
};

/* ----------------------------------------------------------- SAVE THE DATE */

/**
 * Thẻ Save the Date dựng từ bộ layer brand/save the date: nền giấy, hai ảnh,
 * chữ "Save the Date!", huy hiệu thiên nga, thẻ lịch răng cưa (lịch + tên đã
 * in sẵn trong ảnh). `date` là dòng chữ thật đặt trên tên cô dâu chú rể.
 */
export const saveTheDate = {
  title: "Save the Date",
  date: "10.12.2026",
  /** Trái: khung cao sát mép trên · Phải: khung lệch xuống. Ảnh dọc 2:3. */
  photos: [
    { src: "/images/save-the-date-01.jpg", alt: "Cô dâu chú rể dưới tấm voan bên chiếc xe cổ" },
    { src: "/images/save-the-date-02.jpg", alt: "Cô dâu chú rể vẫy voan trên con đường ven biển" },
  ],
};

/* ------------------------------------------------------------ LITTLE CHILD */

/**
 * Trang ảnh hồi nhỏ, dựng từ bộ layer brand/little child: mặt dây chuyền hai
 * trái tim (ảnh đã in sẵn trong nền), khung tem, đĩa than xoay. Cuộn tới thì
 * đôi chim bay sang phải và để lộ ảnh cưới trong khung tem.
 */
export const littleChild = {
  title: "Trung & Linh hồi nhỏ",
  /** Mô tả nền — nền mang luôn hai ảnh hồi nhỏ nên cần alt thật. */
  lockedAlt: "Mặt dây chuyền hai trái tim lồng ảnh Trung và Linh hồi nhỏ",
  question: "Cả nhà có thấy tướng phu thê từ nhỏ không ạ?",
  /** Ảnh cưới đã cắt đúng hình lòng khung tem (răng cưa) — đổi ảnh thì cắt lại. */
  photo: {
    src: "/images/little-child-wedding.webp",
    alt: "Cô dâu chú rể ngồi trên chiếc xe mui trần trên con đường ven biển",
  },
  /** Nhãn dưới đĩa than — chạm vào đĩa là bật/tắt nhạc. */
  playLabel: "Phát nhạc",
  pauseLabel: "Tạm dừng",
};

/* ------------------------------------------------------------------ ALBUM */

/**
 * Trang album thứ hai, dựng từ bộ layer brand/gallery 2: ảnh cặp đôi trong
 * khung vòm, mây hai bên, bướm bay, và một băng ảnh năm thẻ chuyển bằng hai
 * mũi tên (hoặc vuốt ngang). Tên dưới băng ảnh lấy từ `couple`.
 */
export const album = {
  title: "Album ảnh cưới",
  /** Ảnh trong khung vòm — đã cắt đúng khổ 4961×2480 của artboard. */
  arc: {
    src: "/images/album-arc.jpg",
    alt: "Chú rể nắm tay cô dâu xoay một vòng trong studio",
  },
  quote:
    "“Giữa muôn vàn cuộc gặp gỡ, chúng mình đã tìm thấy nhau. Từ hai câu chuyện riêng biệt, giờ đây cùng viết nên một hành trình mang tên hạnh phúc.”",
  /** Ảnh nằm giữa băng lúc mới vào trang (chỉ số trong `shots`). */
  start: 2,
  /** Ít nhất 7 ảnh để băng xoay vòng mà không thấy thẻ nhảy từ mép này sang mép kia. */
  shots: [
    { src: "/images/album-01.jpg", alt: "Cô dâu tựa vai chú rể trên ghế sofa da" },
    { src: "/images/album-02.jpg", alt: "Cô dâu chú rể ngồi bên khung cửa sổ lớn" },
    { src: "/images/album-03.jpg", alt: "Chú rể nâng cằm cô dâu dưới tấm voan" },
    { src: "/images/album-04.jpg", alt: "Cô dâu xoay váy trong tay chú rể" },
    { src: "/images/album-05.jpg", alt: "Cô dâu chú rể nắm tay bước đi" },
    { src: "/images/album-06.jpg", alt: "Chú rể hôn má cô dâu" },
    { src: "/images/album-07.jpg", alt: "Cô dâu đứng sau chú rể đang ngồi trên sofa" },
    { src: "/images/album-08.jpg", alt: "Cô dâu chú rể đứng trước phông nâu" },
    { src: "/images/album-09.jpg", alt: "Cô dâu cúi nhìn chú rể đang tựa lưng" },
  ],
  prevLabel: "Ảnh trước",
  nextLabel: "Ảnh sau",
};

/* -------------------------------------------------------------- LOVE STORY */

export const loveStory = {
  eyebrow: "Chuyện của chúng mình",
  title: "Love Story",
  intro: "Vuốt sang để xem những khoảnh khắc chúng mình giữ lại.",
  /** Mỗi chương là một thẻ trong băng ảnh kéo ngang. */
  chapters: [
    {
      year: "2020",
      title: "Lần đầu gặp nhau",
      body: "Một dòng kể ngắn về lần đầu hai người gặp nhau.",
      photo: "/images/couple-01.jpg",
      alt: "Cô dâu và chú rể trong lần đầu gặp nhau",
    },
    {
      year: "2022",
      title: "Chính thức yêu",
      body: "Một dòng kể ngắn về lúc hai người thành một đôi.",
      photo: "/images/couple-02.jpg",
      alt: "Cô dâu và chú rể khi mới yêu",
    },
    {
      year: "2024",
      title: "Cùng nhau đi khắp nơi",
      body: "Một dòng kể ngắn về những chuyến đi của hai người.",
      photo: "/images/couple-03.jpg",
      alt: "Cô dâu và chú rể trong một chuyến đi",
    },
    {
      year: "2026",
      title: "Lời cầu hôn",
      body: "Một dòng kể ngắn về lời cầu hôn.",
      photo: "/images/couple-04.jpg",
      alt: "Cô dâu và chú rể trong ngày cầu hôn",
    },
  ],
  /** Nhịp kết, đứng riêng dưới băng ảnh. Để null thì không hiện. */
  finale: {
    year: "Tháng 12 . 2026",
    title: "Và chúng mình cưới",
    body: "Hẹn gặp quý khách trong ngày trọng đại.",
  },
};

/* ---------------------------------------------------------------- GALLERY */

export const gallery = {
  /**
   * Bố cục album:
   *   "reel"   — dải ảnh kéo ngang (mặc định của glow-base), đọc `shots`
   *   "mosaic" — theo brand/gallery/layout.png: một ảnh cắt thành các ô xếp
   *              hình trái tim, hai ô chi tiết nghiêng, một ảnh viền trắng
   */
  layout: "mosaic" as "reel" | "mosaic",
  /**
   * Dữ liệu cho bố cục "mosaic". Mọi toạ độ ghép đã đo khớp với ảnh dưới —
   * đổi ảnh thì phải đo lại `mosaic` và `details`.
   */
  mosaic: {
    src: "/images/gallery-mosaic.jpg",
    alt: "Cô dâu chú rể bên chiếc xe cổ, tấm voan bay trong gió",
    /** Ảnh đặt trên artboard 4961×7016: góc trái-trên (x, y) và bề rộng, đơn vị px artboard. */
    place: { x: -156, y: -340, width: 4600 },
    /**
     * Hai ô chi tiết, cắt từ cùng ảnh: tâm (cx, cy) và cạnh ô (side), tính
     * theo tỉ lệ bề ngang/bề cao của ảnh gốc.
     */
    details: [
      { cx: 0.3974, cy: 0.4437, side: 0.1725, alt: "Chiếc nơ của chú rể" },
      { cx: 0.7399, cy: 0.4422, side: 0.1667, alt: "Tấm voan của cô dâu" },
    ],
  },
  eyebrow: "Album",
  title: "Khoảnh khắc của chúng mình",
  note: "Những tấm hình chúng mình thương nhất.",
  /** Chữ gợi ý cho người xem biết dải ảnh kéo ngang được. */
  hint: "Vuốt sang để xem tiếp",
  shots: [
    { src: "/images/gallery-01.jpg", alt: "Ảnh cưới số 1" },
    { src: "/images/gallery-02.jpg", alt: "Ảnh cưới số 2" },
    { src: "/images/gallery-03.jpg", alt: "Ảnh cưới số 3" },
    { src: "/images/gallery-04.jpg", alt: "Ảnh cưới số 4" },
    { src: "/images/gallery-05.jpg", alt: "Ảnh cưới số 5" },
    { src: "/images/gallery-06.jpg", alt: "Ảnh cưới số 6" },
  ],
};

/* ------------------------------------------------------------ WEDDING INFO */

export const weddingInfo = {
  eyebrow: "Thông tin lễ cưới",
  title: "Ngày chúng mình về chung một nhà",
  intro: "Kính mời quý khách tới dự tiệc mừng lễ thành hôn.",
  saveTheDateLabel: "Save the date",
  venueLabel: "Địa điểm",
  calendarLabel: "Thêm vào lịch",
  photo: "/images/couple-05.jpg",
  photoAlt: "Cô dâu và chú rể",
};

/* ----------------------------------------------------------------- AGENDA */

export const agenda = {
  eyebrow: "Chương trình",
  title: "Trình tự buổi lễ",
  intro: "Giờ dự kiến của buổi tiệc.",
  items: [
    { time: "17:30", title: "Đón khách", note: "Quý khách nhận chỗ và chụp hình lưu niệm" },
    { time: "18:00", title: "Làm lễ", note: "Nghi thức thành hôn" },
    { time: "18:30", title: "Khai tiệc", note: "Mở tiệc cùng gia đình hai bên" },
    { time: "19:30", title: "Tiệc sau lễ", note: "Âm nhạc và chúc phúc" },
  ],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: "Trang phục",
  title: "Dress Code",
  headline: "Thanh lịch & trang trọng",
  note: "Để khung hình ngày cưới thật hoà hợp, kính mời quý khách chọn trang phục theo bảng màu dưới đây.",
  /** Để mảng rỗng thì phần bảng màu tự ẩn. */
  swatches: [
    { name: "Xanh rêu", hex: "#1d3a2b" },
    { name: "Kem", hex: "#f1e7d6" },
    { name: "Vàng đồng", hex: "#b99a5b" },
    { name: "Trắng", hex: "#ffffff" },
  ],
  avoid: "Xin hạn chế trang phục màu trắng tinh của cô dâu.",
};

/* ---------------------------------------------------------- HONEYMOON FUND */

export const honeymoonFund = {
  eyebrow: "Honeymoon Fund",
  title: "Quỹ trăng mật",
  body: "Nếu quý khách muốn gửi thêm một chút yêu thương, chúng mình xin được đón nhận để cùng nhau thực hiện chuyến đi đầu tiên của đời vợ chồng.",
  /** Tài khoản nhận — số tài khoản chạm vào là chép. */
  account: { bank: "BIDV · PGD Lương Ngọc Quyến", number: "3901092775", holder: "DO THUY LINH" },
  copyHint: "Chạm để sao chép",
  copiedLabel: "Đã sao chép số tài khoản",
};

/* ------------------------------------------------------------------- RSVP */

/**
 * RSVP đi qua Glow RSVP Hub. KHÔNG tự tạo Google Sheet, KHÔNG dán Apps Script:
 * chạy skill `glow-rsvp` để nó tạo Sheet và điền ba giá trị dưới đây.
 *
 *   mode "general"      — một form mở, ai có link site cũng trả lời được
 *   mode "personalized" — mỗi khách một link `?to=<slug>`, site gọi tên khách
 *
 * `endpoint` để TRỐNG trong khung nền. Secret của hub không bao giờ nằm trong
 * repo — nó ở ~/.glow/rsvp.env.
 */
export const rsvp = {
  mode: "personalized" as "general" | "personalized",
  /** URL của Glow RSVP Hub — skill glow-rsvp điền vào. */
  endpoint: "https://script.google.com/macros/s/AKfycbxB9Oc65toi-UmEfTB_J6d3l8LQoNQvhpyY1IaIIKR2h8I59K1NxvCGTZckTqLaT5y_/exec",
  /** Slug của khách, trùng subdomain: ten-khach.gloweb.site → "ten-khach" */
  client: "trunglinh",

  eyebrow: "R.S.V.P",
  title: "Quý khách sẽ đến chứ?",
  note: "Nhắn giúp chúng mình một tiếng để gia đình chuẩn bị chỗ ngồi chu đáo.",
  deadline: "Vui lòng phản hồi trước ngày 30 . 11 . 2026",

  /**
   * Nhãn trùng tên cột trong Sheet "RSVP · trunglinh" (tab Guests Management):
   * Tham dự · Số người đi cùng · Khách nhà · Lời chúc. Key gửi đi
   * (attending/guests/side/message) chính là khoá cột — đổi key thì chạy
   * `~/glow-tools/glow-rsvp.sh fields trunglinh --fields "..."`.
   */
  fields: {
    name: { label: "Họ và tên", placeholder: "Nguyễn Văn A" },
    attending: {
      label: "Tham dự",
      yes: "Có, tôi sẽ đến",
      no: "Rất tiếc, tôi xin vắng",
    },
    guests: { label: "Số người đi cùng", none: "Không, tôi đi một mình", max: 4 },
    side: {
      label: "Khách nhà",
      options: ["Nhà trai", "Nhà gái"],
    },
    message: {
      label: "Lời chúc",
      placeholder: "Chúc hai bạn trăm năm hạnh phúc…",
    },
  },

  submit: "Gửi phản hồi",
  sending: "Đang gửi…",
  successTitle: "Đã nhận được!",
  successNote: "Cảm ơn quý khách. Chúng mình sẽ giữ sẵn một chỗ thật đẹp.",
  errorNote: "Gửi chưa được, quý khách thử lại giúp chúng mình một lần nữa nhé.",
  /** Chào khách vào bằng link riêng — chỉ dùng khi mode "personalized". */
  greeting: "Thân mời",
};

/* --------------------------------------------------------------- THANK YOU */

export const thankYou = {
  eyebrow: "Thank you",
  title: "Cảm ơn quý khách",
  lines: [
    "Cảm ơn quý khách đã dành thời gian",
    "đồng hành cùng chúng mình trong ngày trọng đại.",
  ],
  signature: "Monogram T & L",
};

/* ------------------------------------------------------------------ NHẠC */

/**
 * Nhạc nền. `src` để "" thì nút nhạc tự ẩn và trang vẫn chạy bình thường.
 * Nhạc chỉ bật từ chính cú chạm "Mở thiệp" — trình duyệt trên điện thoại
 * không cho phát nhạc ngoài một thao tác của người dùng.
 */
export const music = {
  src: "/audio/music.mp3",
  enabled: true,
  title: "Risk It All — Bruno Mars",
  volume: 0.55,
};

/* ------------------------------------------------------------------- META */

export const meta = {
  /** Domain thật của site — dùng để dựng link ảnh OG tuyệt đối. */
  siteUrl: "https://ten-khach.gloweb.site",
  title: "Tên Chú Rể & Tên Cô Dâu — Thiệp cưới",
  description:
    "Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi ngày 10.12.2026.",
  /** Ảnh hiện khi dán link lên Zalo / Facebook. */
  ogImage: "/images/hero.jpg",
  locale: "vi_VN",
  lang: "vi",
};
