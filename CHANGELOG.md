# CHANGELOG.md

Tất cả thay đổi đáng chú ý của dự án FocusFlow được ghi lại tại đây.  
Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] — 2026-06

### Added
- **PB-4 (Mở rộng):** Tích hợp thêm các mốc thời gian rảnh mới bao gồm **30 phút** và **60 phút** (bên cạnh mốc 15 phút) vào bộ lọc thông minh của Trợ Lý Ra Quyết Định (Decision Assistant) giúp linh hoạt bám sát mọi biến động trong lịch trình.
- **Tài liệu hướng dẫn:** Cấu trúc và triển khai thành công chương hướng dẫn sử dụng toàn diện (User Guide) trong file `README.md` giúp người dùng nhanh chóng làm quen chiến thuật ma trận Eisenhower, ngân sách năng lượng hay kết thúc ngày làm việc tĩnh lặng.

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
