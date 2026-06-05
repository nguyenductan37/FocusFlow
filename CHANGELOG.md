# CHANGELOG.md

Tất cả thay đổi đáng chú ý của dự án FocusFlow được ghi lại tại đây.  
Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] — 2026-06

### Improved
- **AC-PB5-02 & AC-PB5-03 (Cải tiến - Tăng trưởng kĩ năng):** Cải tiến thuật toán & đồ thị Bản đồ Tăng trưởng. Thay thế chỉ số tĩnh của "Tuần này" thành dữ liệu tổng hợp thời gian thực từ các đầu việc đã hoàn tất (`status === 'DONE'`). Tích hợp công thức tính Điểm tiến độ kĩ năng chuẩn hóa theo từng đầu việc cụ thể: $Score_{Task} = Effort Factor \times Duration In Hours \times Strategy Weight$ (trong đó hệ số nỗ lực HIGH=4.0, MEDIUM=2.0, LOW=1.0; trọng số ma trận Q2=1.5, Q1=1.2, Q3=0.8, Q4=0.3) cùng cơ chế so sánh tỷ suất tăng tiến tương đối so với tuần trước tránh tuyệt đối lỗi chia cho 0. Hiển thị bảng mô tả chi tiết công thức đẹp đẽ trực quan ngay dưới Legend.
- **AC-PB31-04 (Cải tiến):** Điều chỉnh cơ chế phục hồi thể trạng tại `handleTakeBreak`. Khi người dùng click nút, chỉ số % ngân sách năng lượng tinh thần sẽ lập tức reset nạp đầy về đúng 100% thay vì cộng dồn +20% như trước. Đổi nhãn nút tương ứng trong `EnergyBar` thành: `"Tôi đã nghỉ ngơi (100%)"` để người dùng dễ kiểm soát.
- **AC-PB51-03 & AC-PB51-04 (Cải tiến):** Bổ sung nút `"Bỏ qua"` với phong cách màu trắng sữa trực quan bên sườn nút `"Chèn học tập ngay"` trên Ribbon Đề xuất Time-boxing học tập thuộc cấu phần `Scheduler`. Tích hợp quy chuẩn đóng tắt thông báo: lưu trữ số lượng click từ chối (`studyIgnoreCount`) vào `localStorage`; khi nhấn "Bỏ qua" đủ 3 lần, hệ thống nhận diện và ẩn hoàn toàn hộp gợi ý suốt phần còn lại của ngày.

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
