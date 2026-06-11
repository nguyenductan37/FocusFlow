# Changelog

Mục đích của file này nhằm theo dõi tất cả các thay đổi của dự án FocusFlow qua từng phiên bản, áp dụng quy chuẩn đánh số phiên bản Semantic Versioning (MAJOR.MINOR.PATCH).

## [Unreleased]

*Mục này chứa các thay đổi đã hoàn thành trên nhánh phát triển nhưng chưa được đóng gói thành phiên bản chính thức.*

### Added

* Tích hợp WebSocket cho đồng bộ real-time (nếu có backend)
* Xuất báo cáo hiệu suất tuần dạng PDF

---

## [1.8.0] - 2026-06-11

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Tự Động Xếp Lịch Thông Minh (Smart Slot-Scheduling Nudge):**
  * **Thuật toán chấm điểm phối hợp (Hybrid Scoring System):** Mở rộng cơ chế gợi ý ra tất cả các danh mục (Làm việc, Học tập, Admin...). Tự động chấm điểm các task chưa xếp lịch dựa trên 3 tiêu chí: độ khớp thời lượng, mức ưu tiên Eisenhower, và mức độ khớp năng lượng với giờ vàng sinh học theo Chronotype của người dùng.
  * **Giao diện Dropdown & Xếp lịch tức thời:** Thẻ gợi ý hiển thị task tối ưu nhất cùng một menu dropdown cho phép người dùng thay đổi sang các task phù hợp khác. Bấm "Xếp lịch ngay" sẽ cập nhật trực tiếp thời gian bắt đầu của task được chọn mà không cần mở modal tạo mới.
  * **Cơ chế ẩn thông minh (Dynamic Dismiss):** Khi người dùng nhấn "Bỏ qua", hệ thống lưu lại mốc giờ của khe trống và ẩn thẻ gợi ý cho riêng khe đó. Khi lịch trình thay đổi tạo ra khe trống mới, thẻ gợi ý sẽ tự động hiển thị lại.
  * **Chế độ dự phòng (Fallback):** Nếu không còn task chưa xếp lịch nào trong ngày, hệ thống sẽ gợi ý tạo mới một task học tập để củng cố kỹ năng.

### Fixed

* Khắc phục lỗi TypeScript `CATEGORY_NAMES` không khớp với định nghĩa của `TaskCategory` trong `BatchingNudgeCard.tsx`.
* Cập nhật `tsconfig.json` thêm `types: ["vite/client"]` để giải quyết lỗi không nhận diện được kiểu dữ liệu của `import.meta.env` trong môi trường Vite.

---

## [1.7.0] - 2026-06-11

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Hệ thống Tiêu diệt Task Bóng Tối (Slay the Shadow Tasks):**
  * **Cơ chế phân loại & theo dõi:** Cập nhật logic rã nhỏ task trì hoãn (`handleSplitTask`) để gán `parentId` liên kết và đánh dấu `isShadowStep: true` cho các task con mới.
  * **Giao diện mảnh vỡ bóng tối:** Tạo style viền tím nhạt nhấp nháy phát sáng (`border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]`), gắn thêm nhãn dán tím `👾 Mảnh vỡ bóng tối` và biểu tượng kiếm chéo `⚔️` cạnh tiêu đề các task con chưa hoàn thành.
  * **Banner tiến trình chiến đấu:** Hiển thị banner màu tím ở đầu danh sách nhiệm vụ để theo dõi tiến trình: `👾 Đang bao vây Quái vật bóng tối (${category}) — Tiến độ: ${completed}/${total} mảnh` kèm thanh tiến trình trực quan.
  * **Cơ chế dứt điểm (Victory Slay Check):** Khi hoàn thành mảnh vỡ cuối cùng trong nhóm: Cộng ngay $+50$ Bio-XP cho linh vật đồng hành; tự động mở khóa ngẫu nhiên một trong ba phụ kiện dũng sĩ: **Kiếm đồ chơi (`toy_sword`)**, **Khiên gỗ (`wooden_shield`)**, hoặc **Vương miện dũng sĩ (`hero_crown`)** (đảm bảo không trùng món đã có); trình duyệt phát hiệu ứng âm thanh Victory arpeggio qua Web Audio API.
* **Trang bị dũng sĩ & Tủ đồ Linh vật (Pet Gear & Closet):**
  * **Linh vật Chiến đấu (Bio-Pet Battle Mode):** Khi có mảnh vỡ bóng tối chưa hoàn thành trong ngày, linh vật sẽ chuyển sang trạng thái chiến đấu: thay đổi mắt sang dạng tập trung nghiêm túc (lông mày xếch chéo), vòng hào quang quanh linh vật phát sáng tím nhấp nháy, và phát ra các câu thoại bong bóng cảnh giác dũng mãnh.
  * **Khu vực Trang bị dũng sĩ:** Tích hợp khu vực **"⚔️ Trang bị dũng sĩ"** trong Popover thông số linh vật để người dùng dễ dàng bấm "Trang bị" hoặc "Tháo ra" các phụ kiện đã mở khóa.
  * **Hiển thị SVG trang bị động:** Nhúng các nhóm hình vẽ SVG của phụ kiện (Kiếm đồ chơi, Khiên gỗ, Vương miện) đè lên cơ thể của cả 3 dòng linh vật (Sơn Ca, Cú Đêm, Bồ Câu) theo tọa độ tỷ lệ chuẩn xác.

---

## [1.6.0] - 2026-06-10

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Hệ Thống Dự Báo Quá Tải Nhận Thức (Cognitive Overload Predictor):**
  * **Chỉ số CLI (Cognitive Load Index):** Thanh đo thứ hai trong `EnergyBar`, phản ánh mức độ căng thẳng não bộ theo thời gian thực (0% → 100%).
  * **Cảnh báo thông minh:** Tự động đổi màu thanh CLI theo ngưỡng: Xanh lá (`< 50%`), Cam (`50% - 79%`), Đỏ rực nhấp nháy (`≥ 80%` kèm đề xuất nghỉ ngơi).
  * **Cơ chế tích lũy & phục hồi:** `+0.8%`/phút khi chạy Pomodoro, `+10%` khi hoàn thành task HIGH energy, `+5%` khi dời lịch/hoãn task, `-20%` khi nhấn Take Break, reset về `0%` cuối ngày (EOD).
* **Sinh Vật Nhịp Sinh Học (Bio-Companion):**
  * **Trạng thái Trứng:** Hiển thị quả trứng lắc lư khi chưa làm trắc nghiệm sinh học, click mở modal khảo sát.
  * **Nở theo nhóm sinh học:** **Sơn Ca (Early Bird)** - Chim vàng chanh; **Cú Đêm (Night Owl)** - Cú xanh lam; **Bồ Câu (Third Bird)** - Bồ câu lục nhạt.
  * **Trạng thái sức khỏe:** Active (nhảy nhót khi làm việc đúng giờ vàng), Fatigued (nằm dài, mắt nhắm kèm chữ "Zzz" khi quá giờ ngủ sinh học), Decompressing (ngủ sâu / thiền ở chế độ Decompression).
  * **Hệ thống Bio-XP & Thăng cấp:** Nhận XP từ các hành động lành mạnh (hoàn thành task $+20$, Pomodoro $+15$, Take Break $+5$, EOD $+25$), x2 điểm khi làm đúng giờ vàng. Đạt cấp mới khi `XP_max = Level × 100`.
* **Sắp xếp thông minh theo Cụm bối cảnh (Smart Category Batching):**
  * **Phát hiện tự động:** Đề xuất gom lịch khi có `≥ 3` task cùng danh mục chưa hoàn thành.
  * **Thuật toán tìm khe trống lý tưởng:** Quét khe trống phù hợp đến 21:00, ưu tiên tránh giờ vàng sinh học.
  * **Hành động 1-click:** Nhấn "Đồng ý gom lịch" để dời các task nối tiếp nhau vào khe giờ đề xuất; nhấn "Bỏ qua" để ẩn đề xuất đến hết ngày.

### Changed

* **Thay đổi tiêu đề trang:** Cập nhật `<title>` trong `index.html` thành "FocusFlow".
* **Đồng bộ dữ liệu:** Lưu trữ `BioPetState` và `cognitiveLoad` vào `localStorage`.
* **Tối ưu hoạt họa:** Sử dụng CSS Keyframes thuần (`wobble`, `breath`, `pulse`) thay vì các thư viện JS nặng để tối ưu hiệu năng.

---

## [1.5.0] - 2026-06-09

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Khảo sát Nhịp sinh học (Chronotype Survey) & Đồ thị Năng lượng 24h:**
  * **Trắc nghiệm 3 câu hỏi MEQ:** Phân loại người dùng vào nhóm Sơn Ca, Cú Đêm, hoặc Bồ Câu.
  * **Đồ thị năng lượng:** Sử dụng đường cong SVG mô tả dao động năng lượng theo giờ cho từng nhóm sinh học.
* **Hệ thống Gợi ý Lịch trình Thông minh (Smart Scheduler Nudges):**
  * **Cảnh báo khi xếp sai giờ:** Phát hiện task HIGH energy hoặc Q1/Q2 xếp ngoài khung giờ vàng, hiển thị cảnh báo kèm nút "Chuyển lịch" 1-click.
* **Trích xuất AI tối ưu theo Sinh học:**
  * **Tích hợp Chronotype vào AI Parsing:** Tự động gán task HIGH energy vào giờ vàng tương ứng khi tạo bằng ngôn ngữ tự nhiên không rõ giờ.

### Changed

* **Nâng cấp độ ổn định hệ thống:** Cải tiến cơ chế lazy init cho Gemini API client nhằm tránh crash khi chưa có API Key.

---

## [1.4.0] - 2026-06-08

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Trợ lý thêm công việc thông minh bằng AI:**
  * **Thanh nhập liệu tự nhiên (AI Command Bar):** Tự động phân tích câu lệnh tiếng Việt tự nhiên và điền sẵn các trường dữ liệu task.
  * **Structured Outputs với Gemini API:** Áp dụng JSON Schema để đảm bảo kết quả phản hồi của AI chuẩn xác 100%.
* **Hệ thống ngăn ngừa dồn ứ công việc (Anti-Doom-Pile):**
  * **Theo dõi trì hoãn:** Hiện nhãn cảnh báo cam cho task có `postpone_count ≥ 3` và nút "Rã nhỏ bước hành động"; rã nhỏ bằng AI qua Gemini và lưu trữ lý do hoãn.

### Changed

* **Cấu trúc dữ liệu Task:** Bổ sung các trường `postpone_count` và `postpone_reasons`.
* **Logic tăng postpone_count:** Tự động tăng khi đổi ngày hạn (due_date) trong modal sửa task hoặc qua EOD Closure.

---

## [1.3.0] - 2026-06-06

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Khóa tập trung dựa trên Lịch trình (Schedule-based Focus Mode):**
  * **Kích hoạt tự động:** Quét mỗi phút, hiển thị Focus Overlay toàn màn hình nếu trùng giờ của task Deep Work.
  * **Giao diện tập trung:** Pomodoro 25 phút, danh sách micro-steps, âm thanh nền White Noise / Rain Sound và chặn thoát trang.
  * **Hoãn có kiểm soát:** Yêu cầu chọn/nhập lý do cụ thể khi hoãn task trong chế độ khóa tập trung.
* **Công cụ Decompression & Giấc ngủ Nhận thức:**
  * **Chu trình xả hơi 3 phút:** Kích hoạt sau 19:30 sau khi hoàn thành EOD.
  * **Các bước thực hiện:** Brain Dump (trút bỏ lo toan với hiệu ứng tan biến), Bài tập thở 4-7-8 hoạt họa co giãn, và kích hoạt chế độ khóa tương tác (OFF Mode) đến 05:00 sáng hôm sau.

### Changed

* **Cấu trúc dữ liệu Task:** Bổ sung trường `actual_min` để ghi nhận thời gian thực tế thực hiện task.
* **Cải tiến EnergyBar:** Reset năng lượng về 100% khi nhấn Take Break (thay vì cộng dồn +20%).
* **Tối ưu hóa UI:** Ẩn bảng công thức tính điểm dưới nút dropdown tại Bản đồ Tăng trưởng giúp giao diện gọn gàng hơn.

### Fixed

* **Trợ lý Ra Quyết định:** Chuyển Modal sang `createPortal` gắn vào `document.body` để tránh render loop chồng lấn.
* **Giả lập dữ liệu:** Loại bỏ hoàn toàn nút "Giả làm 7 ngày" để đảm bảo tính xác thực của số liệu trên Growth Dashboard.

---

## [1.2.0] - 2026-06-04

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Đề xuất Deep Work:** Tự động đề cử tối đa 2 task chưa hoàn thành thỏa mãn HIGH energy và thuộc nhóm Q1/Q2 trên Growth Dashboard.

### Changed

* **Bộ lọc Trợ lý Ra Quyết định:** Bổ sung thêm mốc thời gian trống 30 phút và 60 phút (trước đây chỉ hỗ trợ 15 phút).

---

## [1.1.1] - 2026-06-03

*Thông tin của một phiên bản đã chính thức phát hành.*

### Changed

* **Đồng hồ số hệ thống:** Loại bỏ form nhập giờ giả lập thủ công tại EOD, thay thế bằng đồng hồ số tự động cập nhật theo thời gian thực của hệ thống máy tính.

---

## [1.1.0] - 2026-06-02

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Tài liệu hướng dẫn người dùng:** Bổ sung User Guide chi tiết trong `README.md`.
* **Tài liệu QA/Review:** Tạo file `CHECKLIST_REVIEW.md` bám sát từng AC của dự án.
* **Quy trình Vibe Coding:** Tài liệu hóa quy trình phát triển và kiểm tra chất lượng trong `APPLY_VIBECODING.md`.

### Fixed

* **UI Assist Decision-maker:** Khắc phục lỗi lặp render khi dùng iframe nested layouts.

---

## [1.0.0] - 2026-06-01

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **PB-1:** Hệ thống tự động phát hiện và cảnh báo xung đột lịch trình, hỗ trợ dời lịch 1-click.
* **PB-1.1:** Tích hợp Ma trận Eisenhower (Q1–Q4) và Mức năng lượng (HIGH/MEDIUM/LOW).
* **PB-2:** Quy trình Kết thúc ngày (EOD) tự động: tổng hợp thành tựu, tóm tắt ngày và kích hoạt trạng thái "OFF".
* **PB-2.1:** Tự động gom nhóm task tồn đọng và lập danh sách việc ưu tiên cho sáng hôm sau.
* **PB-3:** Dashboard thống kê hiệu suất thời gian thực, tự tìm và đề xuất giờ vàng Deep Work tối ưu.
* **PB-3.1:** Thanh Ngân sách năng lượng (Energy Budget) cảnh báo đỏ khi mức năng lượng $\le 20\%$.
* **PB-4:** Gợi ý "Việc nhanh 15 phút" khi phát hiện có khoảng trống thời gian bất ngờ.
* **PB-5:** Dashboard Bản đồ Tăng trưởng kỹ năng theo tuần kèm đồ thị thống kê thời gian thực.
* **PB-5.1:** Thuật toán phát hiện khoảng trống thời gian và đề xuất Time-boxing học tập tự tạo mới.
