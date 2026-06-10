Dựa trên các tài liệu `planning doc.md` và các `sprintbacklog` bạn cung cấp, dưới đây là bản **CHANGELOG.md** được viết lại hoàn chỉnh theo cấu trúc chuẩn (Keep a Changelog) và phản ánh đầy đủ các tính năng đã triển khai trong Sprint 4.

---

# CHANGELOG.md

Tất cả thay đổi đáng chú ý của dự án FocusFlow được ghi lại tại đây.  
Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Tích hợp WebSocket cho đồng bộ real-time (nếu có backend)
- Xuất báo cáo hiệu suất tuần dạng PDF

---

## [1.6.0] — 2026-06-10

### Added

#### 🧠 Hệ Thống Dự Báo Quá Tải Nhận Thức (Cognitive Overload Predictor)
- **Chỉ số CLI (Cognitive Load Index):** Thanh đo thứ hai trong `EnergyBar`, phản ánh mức độ căng thẳng não bộ theo thời gian thực (0% → 100%).
- **Cảnh báo thông minh:** Tự động đổi màu thanh CLI theo ngưỡng:
  - 🟢 Xanh lá (`< 50%`): An toàn
  - 🟡 Cam (`50% - 79%`): Cảnh báo nhẹ
  - 🔴 Đỏ rực nhấp nháy (`≥ 80%`): Quá tải, kèm thông báo khuyến nghị nghỉ ngơi
- **Cơ chế tích lũy & phục hồi:**
  - `+0.8%`/phút khi chạy Pomodoro
  - `+10%` khi hoàn thành task **HIGH energy**
  - `+5%` khi dời lịch/hoãn task
  - `-20%` khi nhấn **Take Break**
  - `Reset về 0%` khi kết thúc ngày (EOD)

#### 🐣 Sinh Vật Nhịp Sinh Học (Bio-Companion)
- **Trạng thái Trứng:** Hiển thị quả trứng lắc lư khi chưa làm trắc nghiệm sinh học. Nhấp vào → mở modal khảo sát.
- **Nở theo nhóm sinh học:**
  - 🐤 **Sơn Ca (Early Bird):** Chim vàng chanh nhấp nhô
  - 🦉 **Cú Đêm (Night Owl):** Cú xanh lam phồng xẹp
  - 🕊️ **Bồ Câu (Third Bird):** Bồ câu lục nhạt nghiêng đầu
- **Trạng thái sức khỏe:**
  - **Active:** Nhảy nhót khi làm việc đúng **Khung giờ vàng sinh học**
  - **Fatigued:** Nằm dài, mắt nhắm, kèm chữ "Zzz" khi làm việc quá giờ ngủ sinh học
  - **Decompressing:** Thiền / ngủ sâu khi ở chế độ nghỉ ngơi hoặc Decompression
- **Hệ thống Bio-XP & Thăng cấp:**
  - Cộng điểm từ các hành động lành mạnh, **x2 điểm khi làm đúng giờ vàng**
  - Bảng điểm: `+20` (hoàn thành task), `+15` (Pomodoro), `+5` (Take Break), `+25` (EOD)
  - Công thức thăng cấp: `XP_max = Level × 100`
  - Popover hiển thị Level, thanh tiến trình XP, và ô đổi tên Pet trực tiếp

#### 📦 Sắp xếp thông minh theo Cụm bối cảnh (Smart Category Batching)
- **Phát hiện tự động:** Khi có `≥ 3` task cùng danh mục (`Học tập`/`Làm việc`/`Admin`) chưa hoàn thành trong ngày → hiển thị Banner đề xuất gom lịch.
- **Thuật toán tìm khe trống lý tưởng (`findOptimalStartTime`):**
  - Tính tổng thời lượng cần thiết, quét khe trống từ thời điểm hiện tại đến 21:00
  - **Ưu tiên tránh** Khung giờ vàng sinh học (theo Chronotype)
  - Fallback sang khe trống bất kỳ nếu không có khe lý tưởng
- **Hành động 1-click:**
  - Nút **"Đồng ý gom lịch"** → Tự động dời các task nối tiếp nhau vào khe thời gian đề xuất
  - Nút **"Bỏ qua"** → Ẩn banner đến hết ngày (hoặc cho đến khi có thay đổi task)

#### 🔧 Các cải tiến kỹ thuật khác
- **Title trang web:** Cập nhật thẻ `<title>` trong `index.html` thành "FocusFlow"
- **Đồng bộ trạng thái:** Lưu trữ `BioPetState` và `cognitiveLoad` vào `localStorage` với các key tương ứng
- **Hiệu ứng SVG & CSS Keyframes:** Sử dụng hoạt họa thuần CSS (`wobble`, `bounce`, `breath`, `pulse`) để tối ưu hiệu năng client-side

---

## [1.5.0] — 2026-06-09

### Added

#### 🌙 Khảo sát Nhịp sinh học (Chronotype Survey) & Đồ thị Năng lượng 24h
- **Trắc nghiệm 3 câu hỏi MEQ rút gọn:** Phân loại người dùng vào Sơn Ca, Cú Đêm, hoặc Bồ Câu.
- **Đồ thị năng lượng SVG:** Vẽ đường cong hình sin mô tả mức năng lượng theo giờ trong ngày cho từng nhóm sinh học.

#### ⏰ Hệ thống Gợi ý Lịch trình Thông minh (Smart Scheduler Nudges)
- **Cảnh báo khi xếp sai giờ:** Phát hiện task **HIGH energy** và **Q1/Q2** được xếp ngoài khung giờ vàng sinh học → Hiển thị banner vàng kèm nút **"Chuyển lịch"** 1-click.

#### 🤖 Trích xuất AI tối ưu theo Sinh học
- **Tích hợp Chronotype vào AI Parsing:** Khi tạo task HIGH energy bằng ngôn ngữ tự nhiên mà không có thời gian cụ thể, Gemini tự động gán `scheduled_at` vào khung giờ vàng tương ứng:
  - Sơn Ca: `08:00 - 11:00`
  - Cú Đêm: `20:00 - 22:00`
  - Bồ Câu: `09:00 - 11:30` hoặc `15:00 - 17:00`

### Changed
- **Nâng cấp độ ổn định của hệ thống:** Cải tiến cơ chế kết nối với Gemini API để tránh treo ứng dụng khi chưa có API Key.

---

## [1.4.0] — 2026-06-08

### Added

#### ✨ Trợ lý thêm công việc thông minh bằng AI
- **Thanh nhập liệu tự nhiên (AI Command Bar):** Người dùng nhập tiếng Việt thông thường (ví dụ: *"Họp phòng lúc 2h chiều"*), hệ thống tự động nhận diện và điền sẵn: tiêu đề, thời lượng, mức ưu tiên, danh mục, giờ hẹn.
- **Structured Outputs với Gemini API:** Sử dụng JSON Schema để đảm bảo đầu ra từ AI khớp chính xác với kiểu dữ liệu `Task`.

#### 🧩 Hệ thống ngăn ngừa dồn ứ công việc (Anti-Doom-Pile)
- **Theo dõi trì hoãn:** Task có `postpone_count ≥ 3` hiển thị nhãn cảnh báo cam và nút **"🧩 Rã nhỏ bước hành động"**.
- **Rã nhỏ bằng AI:** Nhấn nút → Gọi Gemini chia task lớn thành 2-3 **micro-steps** (5-15 phút, năng lượng LOW/MEDIUM) để dễ bắt đầu ngay lập tức.
- **Ghi nhận lý do trì hoãn:** Lưu lại lý do người dùng nhập khi hoãn task (trường `postpone_reasons`).

### Changed
- **Cập nhật cấu trúc `Task`:** Bổ sung `postpone_count` và `postpone_reasons`.
- **Nâng cấp logic tăng `postpone_count`:** Tự động tăng khi dời `due_date` qua modal sửa task hoặc qua EOD Closure.

---

## [1.3.0] — 2026-06-06

### Added

#### 🔒 Khóa tập trung dựa trên Lịch trình (Schedule-based Focus Mode)
- **Tự động kích hoạt:** Quét mỗi phút, nếu có task Deep Work (`Q1/Q2` + `HIGH/MEDIUM` + `scheduled_at` trùng giờ hiện tại) → Tự động mở **Focus Overlay** toàn màn hình.
- **Giao diện khóa tập trung:**
  - Đồng hồ đếm ngược Pomodoro (25 phút)
  - Danh sách micro-steps (checkbox để tick)
  - Âm thanh nền White Noise / Rain Sound (Web Audio API)
  - Chặn thoát trang ngẫu nhiên (sự kiện `beforeunload`)
- **Cơ chế hoãn có kiểm soát:** Khi nhấn "Hoãn công việc" → Yêu cầu chọn/nhập lý do cụ thể → Lưu vào `postpone_reasons` và tăng `postpone_count`.

#### 🌙 Công cụ Decompression & Giấc ngủ Nhận thức buổi tối
- **Kích hoạt:** Sau 19:30 và đã hoàn thành EOD → Hiển thị nút **"🌙 Khởi động chu trình xả hơi 3 phút"**.
- **Bước 1 – Brain Dump:** Ô nhập văn bản lớn để "trút bỏ lo toan", khi gửi → hiệu ứng fade-out tan biến.
- **Bước 2 – Bài tập thở 4-7-8:** Vòng tròn hoạt họa co giãn theo nhịp (hít 4s – giữ 7s – thở 8s), lặp lại 4 chu kỳ.
- **Bước 3 – OFF Mode cứng:** Khóa toàn bộ tương tác với task cho đến sáng hôm sau (sau 05:00).

### Changed
- **Cập nhật cấu trúc `Task`:** Bổ sung `actual_min` (thời gian làm thực tế).
- **Nâng cấp `EnergyBar`:** Reset năng lượng về 100% khi nhấn **Take Break** (thay vì cộng dồn +20%).
- **Tối ưu hóa giao diện:** Ẩn bảng công thức tính điểm dưới nút **"Xem công thức tính điểm"** để giao diện Bản đồ Tăng trưởng gọn gàng hơn.

### Fixed
- **Sửa lỗi xung đột giao diện Trợ lý Ra Quyết định:** Chuyển Modal sang `createPortal` gắn vào `document.body` để tránh render loop.
- **Loại bỏ hoàn toàn nút "Giả lập 7 ngày":** Hệ thống hiện chỉ dựa trên dữ liệu thực từ `localStorage`.

---

## [1.2.0] — 2026-06-04

### Added
- **Khu vực "Tác vụ Deep Work đề xuất"** trong Bảng Tăng trưởng (Growth Dashboard): Tự động lọc tối đa 2 task chưa hoàn thành thỏa mãn `HIGH energy` + `Q1/Q2`.

### Changed
- **Bổ sung mốc thời gian rảnh 30 phút và 60 phút** vào bộ lọc của Trợ lý Ra Quyết định (trước đây chỉ có 15 phút).

---

## [1.1.1] — 2026-06-03

### Changed
- **Loại bỏ form nhập giờ thủ công:** Thay thế bằng đồng hồ số động lấy từ thời gian hệ thống thực tế, cập nhật mỗi giây. Đảm bảo EOD vận hành chính xác tuyệt đối.

---

## [1.1.0] — 2026-06-02

### Added
- **Tài liệu hướng dẫn người dùng (User Guide)** trong `README.md`
- **Tài liệu kiểm định chất lượng `CHECKLIST_REVIEW.md`** bám sát từng Acceptance Criteria
- **Quy trình Vibe Coding** và tài liệu đối chứng `APPLY_VIBECODING.md`

### Fixed
- **Sửa lỗi xung đột giao diện Trợ lý Ra Quyết định** (render loop / iframe nested layouts)

---

## [1.0.0] — 2026-06-01

### Added
- **PB-1:** Hệ thống tự động tái cấu trúc lịch trình khi xảy ra xung đột thời gian, cảnh báo và gợi ý dời lịch 1-click.
- **PB-1.1:** Tích hợp Ma trận Eisenhower (Q1–Q4) và Mức năng lượng (HIGH/MEDIUM/LOW) cho toàn bộ Task.
- **PB-2:** Quy trình **Kết thúc ngày (EOD)** tự động: hiển thị tóm tắt, thành tựu nổi bật, và kích hoạt trạng thái "OFF".
- **PB-2.1:** Tổng hợp task tồn đọng và tự động lập kế hoạch ưu tiên sáng hôm sau.
- **PB-3:** Thống kê và phân tích hiệu suất thời gian thực, gợi ý khung giờ **Deep Work** tối ưu.
- **PB-3.1:** Thanh **Ngân sách năng lượng (Energy Budget)** với cảnh báo khi ≤ 20%.
- **PB-4:** Gợi ý **"Việc 15 phút"** tận dụng thời gian trống bất ngờ từ Dashboard.
- **PB-5:** Dashboard **Bản đồ Tăng trưởng kỹ năng** theo tuần với biểu đồ thống kê thời gian thực.
- **PB-5.1:** Thuật toán phát hiện khoảng trống thời gian và đề xuất **Time-boxing học tập**.

---

## Quy ước đặt tên version

| Segment | Ý nghĩa |
| :--- | :--- |
| **MAJOR** | Breaking change hoặc ra mắt Epic mới hoàn chỉnh |
| **MINOR** | Hoàn thành 1 Sprint (thêm feature không phá vỡ) |
| **PATCH** | Bug fix, cải thiện hiệu năng, UX tweak nhỏ |
