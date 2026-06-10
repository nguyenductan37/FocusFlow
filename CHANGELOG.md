# CHANGELOG.md

Tất cả thay đổi đáng chú ý của dự án FocusFlow được ghi lại tại đây.  
Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.6.0] — 2026-06-10

### Added
- **Sinh Vật Nhịp Sinh Học (Bio-Companion) & Cá Nhân Hóa Tên Ứng Dụng:**
  - *Phân tích nghiệp vụ:* Nhằm tăng tính tương tác, tạo động lực tâm lý tích cực để duy trì lối sống lành mạnh và tránh cảm giác nhàm chán khi thực hiện lịch trình làm việc. Đồng thời tối ưu hóa tính nhận diện thương hiệu của ứng dụng.
  - *Tiêu chí AC:*
    - SC1: Hiển thị quả trứng lắc lư khi chưa làm trắc nghiệm sinh học. Nhấp vào quả trứng hiển thị bong bóng thoại và nút hướng dẫn mở modal trắc nghiệm.
    - SC2: Nở ra linh vật Sơn Ca (vàng nhấp nhô), Cú Đêm (xanh lam phồng xẹp), hoặc Bồ Câu (lục nhạt nghiêng đầu) sau khi khảo sát hoàn tất.
    - SC3: Chuyển sang trạng thái mệt mỏi (ngái ngủ kèm chữ "Zzz" bay lên và icon Mặt Trăng) khi làm việc quá giờ ngủ sinh học.
    - SC4: Tích lũy điểm Bio-XP từ mọi hành động lành mạnh (Xong việc, chạy Pomodoro, Take Break, EOD), nhân đôi (x2) điểm khi làm việc trong khung giờ vàng sinh học. Cho phép đổi tên linh vật trực tiếp.
    - SC5: Hiển thị tiêu đề tab trình duyệt của ứng dụng là "FocusFlow".
  - *Triển khai kỹ thuật:*
    - Định nghĩa cấu trúc dữ liệu `BioPetState` trong `src/types.ts`.
    - Xây dựng component `BioPetWidget.tsx` sử dụng SVG thuần vẽ tạo hình linh vật và xử lý hoạt họa (wobble, bounce, breath) qua CSS `@keyframes` để tối ưu hóa hiệu năng client-side.
    - Tích hợp logic tính điểm `updatePetXp` vào các hàm xử lý sự kiện trung tâm trong `App.tsx` và đồng bộ trạng thái thăng cấp qua `localStorage` (key `focusflow_pet_state`).
    - Cập nhật thẻ `<title>` trong `index.html` thành "FocusFlow".

## [1.5.0] — 2026-06-10

### Added
- **Khảo sát Nhịp sinh học (Chronotype Survey) & Đồ thị Năng lượng Sinh học 24h:**
  - *Phân tích nghiệp vụ:* Mỗi cá nhân có đồng hồ sinh học khác nhau (Sơn Ca, Cú Đêm, hay Chim Bồ Câu). Việc áp đặt khung giờ tập trung cố định dễ gây mệt mỏi và giảm hiệu suất. Giải pháp là cung cấp khảo sát nhanh để cá nhân hóa lịch trình theo nhịp sinh học tự nhiên.
  - *Tiêu chí AC:* 
    - SC1: Trắc nghiệm 3 câu hỏi MEQ rút gọn tại tab "Tăng Trưởng Kỹ Năng" để phân loại chính xác nhóm Sơn ca (Early Bird), Cú đêm (Night Owl), hoặc Chim bồ câu (Third Bird).
    - SC2: Hiển thị đồ thị năng lượng 24 giờ trực quan vẽ bằng SVG mô tả rõ các điểm đỉnh (Peak) và đáy (Trough).
  - *Triển khai kỹ thuật:* 
    - Xây dựng component `ChronotypeSurveyModal.tsx` để chấm điểm và lưu trạng thái vào `localStorage` dưới key `focusflow_chronotype`.
    - Tạo component `ChronobiologyCard.tsx` vẽ đồ thị SVG `<path>` mượt mà theo phương trình hình sin mô phỏng mức năng lượng thay đổi theo thời gian của từng nhóm sinh học.
- **Hệ thống Gợi ý Lịch trình Thông minh (Smart Scheduler Nudges):**
  - *Phân tích nghiệp vụ:* Tránh việc người dùng lên lịch các công việc đòi hỏi tập trung cao (Deep Work) vào thời điểm năng lượng sinh học ở mức đáy (mệt mỏi/uể oải).
  - *Tiêu chí AC:* Kích hoạt cảnh báo (Nudge) khi xếp task HIGH energy và Q1/Q2 nằm ngoài khung giờ vàng sinh học. Hỗ trợ nút chuyển nhanh sang giờ vàng chỉ bằng 1-click.
  - *Triển khai kỹ thuật:* Tích hợp Nudge Engine vào `Scheduler.tsx` để so khớp giờ hẹn của task với khung giờ vàng của nhóm sinh học. Khi vi phạm, render banner cảnh báo màu vàng kèm nút `Chuyển lịch` gọi hàm callback `onUpdateTaskTime`.
- **Trích xuất AI Tối ưu theo Sinh học (AIParsingBar Integration):**
  - *Phân tích nghiệp vụ:* Tận dụng AI để tự động tối ưu hóa lịch trình ngay từ khâu tạo task bằng ngôn ngữ tự nhiên.
  - *Tiêu chí AC:* Nếu người dùng không nhập thời gian cụ thể cho task HIGH energy, AI sẽ tự động gán vào khung giờ vàng sinh học tương ứng.
  - *Triển khai kỹ thuật:* Mở rộng hàm `parseNaturalLanguageTask` trong `gemini.ts` để nhận tham số `chronotype`. Bổ sung chỉ dẫn (system context) vào prompt của Gemini 2.5 Flash để tự động điền giá trị `scheduled_at` tương ứng với giờ vàng của Sơn Ca (08:00 - 11:00), Cú Đêm (20:00 - 22:00), hoặc Bồ Câu (09:00 - 11:30) khi tạo task nặng năng lượng.

## [1.4.0] — 2026-06-09

### Added
- **Trợ lý thêm công việc thông minh bằng AI:** Thêm thanh nhập liệu tự nhiên trên trang chủ. Người dùng chỉ cần gõ nội dung công việc bằng tiếng Việt thông thường (ví dụ: "Họp phòng lúc 2h chiều"), hệ thống sẽ tự động nhận diện và điền sẵn tiêu đề, thời lượng, mức độ ưu tiên và giờ hẹn phù hợp.
- **Hệ thống ngăn ngừa dồn ứ công việc (Anti-Doom-Pile):** Giúp người dùng giải quyết việc lớn bị trì hoãn nhiều lần. Khi một công việc bị đổi lịch quá 3 lần, hệ thống sẽ hiện cảnh báo màu cam kèm nút "Rã nhỏ bước hành động". Nhấn nút này, trí tuệ nhân tạo sẽ chia công việc lớn đó thành 2-3 đầu việc siêu nhỏ, dễ làm (chỉ mất 5-15 phút) để người dùng bắt tay vào làm ngay mà không bị nản.
- **Tính năng tự động hóa và xử lý AI ngầm:** Xây dựng bộ xử lý thông minh để kết nối, truyền tải thông tin và chuyển đổi yêu cầu của người dùng thành các cấu trúc công việc cụ thể.

### Changed
- **Nâng cấp độ ổn định của hệ thống:** Cải tiến cơ chế kết nối với trí tuệ nhân tạo để tránh làm sập hay treo ứng dụng ngay cả khi chưa thiết lập khóa kết nối (API Key). Hệ thống sẽ chạy bình thường các tính năng cơ bản và chỉ hiện thông báo nhắc nhở khi dùng đến tính năng thông minh.
- **Cập nhật tài liệu dự án:** Hoàn thiện kế hoạch phát triển chi tiết cho các giai đoạn tiếp theo để dễ dàng theo dõi tiến độ.
- **Mở rộng thông tin công việc:** Cho phép hệ thống lưu trữ thêm số lần trì hoãn và lý do dời lịch của từng công việc để phục vụ cho việc thống kê, đánh giá hiệu quả cá nhân.

## [1.3.0] — 2026-06

### Improved
- **AC-PB5-02 & AC-PB5-03 (Cải tiến - Tăng trưởng kĩ năng):** Cải tiến thuật toán & đồ thị Bản đồ Tăng trưởng. Thay thế chỉ số tĩnh của "Tuần này" thành dữ liệu tổng hợp thời gian thực từ các đầu việc đã hoàn tất (`status === 'DONE'`). Tích hợp công thức tính Điểm tiến độ kĩ năng chuẩn hóa theo từng đầu việc cụ thể: $Score_{Task} = Effort Factor \times Duration In Hours \times Strategy Weight$ (trong đó hệ số nỗ lực HIGH=4.0, MEDIUM=2.0, LOW=1.0; trọng số ma trận Q2=1.5, Q1=1.2, Q3=0.8, Q4=0.3) cùng cơ chế so sánh tỷ suất tăng tiến tương đối so với tuần trước tránh tuyệt đối lỗi chia cho 0. Hiển thị bảng mô tả chi tiết công thức đẹp đẽ trực quan ngay dưới Legend.
- **AC-PB31-04 (Cải tiến):** Điều chỉnh cơ chế phục hồi thể trạng tại `handleTakeBreak`. Khi người dùng click nút, chỉ số % ngân sách năng lượng tinh thần sẽ lập tức reset nạp đầy về đúng 100% thay vì cộng dồn +20% như trước. Đổi nhãn nút tương ứng trong `EnergyBar` thành: `"Tôi đã nghỉ ngơi (100%)"` để người dùng dễ kiểm soát.
- **AC-PB51-03 & AC-PB51-04 (Cải tiến):** Bổ sung nút `"Bỏ qua"` với phong cách màu trắng sữa trực quan bên sườn nút `"Chèn học tập ngay"` trên Ribbon Đề xuất Time-boxing học tập thuộc cấu phần `Scheduler`. Tích hợp quy chuẩn đóng tắt thông báo: lưu trữ số lượng click từ chối (`studyIgnoreCount`) vào `localStorage`; khi nhấn "Bỏ qua" đủ 3 lần, hệ thống nhận diện và ẩn hoàn toàn hộp gợi ý suốt phần còn lại của ngày.
- **AC-PB3-02 (Cải tiến - Loại bỏ giả lập):** Loại bỏ hoàn toàn nút bấm và chức năng giả lập dữ liệu lịch sử ("Kích hoạt Giả lập 7 ngày") để hướng tới sản phẩm thuần dữ liệu thật của người dùng. Hệ thống tự động tính toán khung giờ tối ưu (Peak hours) cũng như biểu đồ trực quan dựa 100% trên dữ liệu thao tác hoàn thành task (DONE) thực tế từ LocalStorage mà không vi phạm các tiêu chuẩn kỹ thuật trong SPEC.md.
- **Tối ưu hóa Diện tích Giao diện (Bản đồ Tăng trưởng):** Ẩn bớt bảng bóc tách công thức toán học tính điểm tăng trưởng chi tiết dưới một nút bấm tương tác (`Xem công thức tính điểm`), giúp giao diện gọn gàng, tăng cường độ tập trung trực quan vào biểu đồ và số liệu lịch sử thực tế của bản thân người dùng.

---

## [1.2.0] — 2026-06

### Improved
- **AC-PB3-04 (Cải tiến):** Thiết lập và tích hợp trực quan khu vực "Tác vụ Deep Work đề xuất" ngay bên dưới widget "Khung giờ Deep Work tối ưu" trong Bảng Tăng Trưởng (Growth Dashboard). Cấu phần tự động lọc thời gian thực tối đa 2 tác vụ chưa hoàn thành thỏa mãn đồng thời: mức năng lượng là HIGH và thuộc ô ma trận Eisenhower Q1 hoặc Q2, kèm theo fallback hướng dẫn tạo/phân loại thân thiện.

---

## [1.1.1] — 2026-06

### Changed
- **PB-2 (Cải tiến):** Loại bỏ tính năng "giả lập giờ" điều chỉnh thủ công bằng form nhập liệu, tích hợp bộ đồng hồ số động lấy từ thời gian hệ thống thực tế (`HH:MM`) cập nhật chính xác mỗi giây. Giúp quy chuẩn Kết thúc ngày (EOD) vận hành hoàn hảo, chính trực dựa trên hệ thống thực.

---

## [1.1.0] — 2026-06

### Added
- **PB-4 (Mở rộng):** Tích hợp thêm các mốc thời gian rảnh mới bao gồm **30 phút** và **60 phút** (bên cạnh mốc 15 phút) vào bộ lọc thông minh của Trợ Lý Ra Quyết Định (Decision Assistant) giúp linh hoạt bám sát mọi biến động trong lịch trình.
- **Tài liệu hướng dẫn:** Cấu trúc và triển khai thành công chương hướng dẫn sử dụng toàn diện (User Guide) trong file `README.md` giúp người dùng nhanh chóng làm quen chiến thuật ma trận Eisenhower, ngân sách năng lượng hay kết thúc ngày làm việc tĩnh lặng.
- **Tài liệu vận hành & Review:** Biên soạn `CHECKLIST_REVIEW.md` làm tài liệu kiểm định chất lượng bám sát từng tiêu chí nghiệm thu (Acceptance Criteria) và đề xuất bộ dự báo rủi ro & biện pháp giảm thiểu thực tế (Production Risks & Mitigations) trong `SPEC.md`.
- **Quy trình Vibe Coding:** Áp dụng bắt buộc quy trình Vibe Coding chuẩn (Plan, Doc, Build, Test) và tạo lập kho đối chứng `APPLY_VIBECODING.md` để ghi nhận bằng chứng phát triển an toàn.

### Fixed
- **PB-4 (Sửa lỗi):** Khắc phục lỗi xung đột giao diện nhấp nháy liên tục (render loop / iframe nested layouts) khi bấm kích hoạt Trợ Lý Ra Quyết Định bằng việc chuyển đổi cơ chế render Modal sang `createPortal` gắn vào `document.body`.

---

## [1.0.0] — 2026-06

### Added
- **PB-1:** Hệ thống tự động tái cấu trúc lịch trình khi xảy ra xung đột thời gian, hiển thị cảnh báo tức thì, gợi ý dời lịch và áp dụng 1-click.
- **PB-1.1:** Tích hợp Ma trận Eisenhower (Q1–Q4) và Phân bổ Mức năng lượng (Cao / Trung bình / Thấp) cho toàn bộ các Task.
- **PB-2:** Quy trình "Kết thúc ngày" tự động (End of Day Summary), hiển thị tóm tắt, thành tựu nổi bật và kích hoạt trạng thái "Off" ngắt kết nối thông báo hoàn toàn.
- **PB-2.1:** Tổng hợp task tồn đọng và tự lập kế hoạch ưu tiên sáng hôm sau vô cùng nhanh chóng.
- **PB-3:** Tự động thống kê, phân tích dữ liệu hiệu suất của người dùng theo thời gian thực để gợi ý giờ "Deep Work" và khớp lệnh tối ưu.
- **PB-3.1:** Tích hợp bộ đo hiển thị "Ngân sách năng lượng" thông minh (Energy Budget), cảnh báo thông minh khi rơi xuống mức thấp ≤ 20%.
- **PB-4:** Gợi ý "Việc 15 phút" tối ưu hóa thời gian trống bất ngờ chỉ trong 1 chạm truy xuất từ Dashboard chính.
- **PB-5:** Dashboard trực quan hóa tăng trưởng kỹ năng của người dùng theo các tuần với các biểu đồ thống kê thời gian phân loại chân thực.
- **PB-5.1:** Thuật toán phát hiện khoảng trống thời gian và đề xuất hoạt động học tập (Time-boxing học tập) hiệu quả.

---

## Quy ước đặt tên version

| Segment | Ý nghĩa |
|---------|---------|
| MAJOR   | Breaking change hoặc ra mắt Epic mới hoàn chỉnh |
| MINOR   | Hoàn thành 1 Sprint (thêm feature không phá vỡ) |
| PATCH   | Bug fix, cải thiện hiệu năng, UX tweak nhỏ |
