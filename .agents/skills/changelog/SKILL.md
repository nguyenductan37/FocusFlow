---
name: changelog
description: "Hướng dẫn viết và cập nhật tệp CHANGELOG.md cho dự án FocusFlow theo quy chuẩn Semantic Versioning và cấu trúc Keep a Changelog."
---

# Quy Trình Viết và Cập Nhật Changelog

Skill này cung cấp các hướng dẫn chi tiết nhằm đảm bảo tệp `CHANGELOG.md` được ghi chép đồng bộ, chính xác và chuyên nghiệp theo chuẩn quốc tế.

## 1. Nguyên Tắc Cơ Bản
1. **Semantic Versioning (SemVer):** Đánh số phiên bản theo quy tắc `[MAJOR.MINOR.PATCH]`.
   * **MAJOR:** Thay đổi đột phá hoặc cấu trúc lại hệ thống (breaking changes).
   * **MINOR:** Thêm tính năng mới không làm ảnh hưởng đến tính tương thích ngược.
   * **PATCH:** Sửa lỗi, tối ưu hiệu năng hoặc tinh chỉnh nhỏ.
2. **Keep a Changelog:** Định dạng rõ ràng, dễ đọc cho cả con người và máy quét.
3. **Ngày phát hành:** Viết theo định dạng chuẩn ISO `YYYY-MM-DD` (ví dụ: `2026-06-11`).
4. **Ký tự danh sách:** Luôn sử dụng ký tự `* ` cho các gạch đầu dòng.

---

## 2. Cấu Trúc Định Dạng Một Phiên Bản

```markdown
## [MAJOR.MINOR.PATCH] - YYYY-MM-DD

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added
* [Danh sách tính năng mới được thêm vào]

### Changed
* [Danh sách thay đổi đối với logic hoặc tính năng hiện hữu]

### Deprecated
* [Danh sách tính năng cũ sắp bị loại bỏ trong tương lai]

### Removed
* [Danh sách tính năng đã bị xóa bỏ]

### Fixed
* [Danh sách lỗi, bug đã sửa]

### Security
* [Danh sách cải tiến liên quan tới bảo mật]
```

---

## 3. Các Phân Mục Thay Đổi Chuẩn
* **Added:** Cho các tính năng mới hoàn toàn.
* **Changed:** Cho những thay đổi cấu trúc, logic hoặc nâng cấp tính năng cũ.
* **Deprecated:** Nhắc nhở người dùng về các thành phần sẽ bị loại bỏ ở các bản sau.
* **Removed:** Cho các thành phần chính thức bị gỡ khỏi mã nguồn.
* **Fixed:** Cho bất kỳ lỗi lập trình hoặc sự cố giao diện nào đã được khắc phục.
* **Security:** Cho các cập nhật bảo mật hoặc vá lỗ hổng hệ thống.

---

## 4. Ví Dụ Mẫu Một Bản Cập Nhật

```markdown
## [1.8.0] - 2026-06-11

*Thông tin của một phiên bản đã chính thức phát hành.*

### Added

* **Tự Động Xếp Lịch Thông Minh (Smart Slot-Scheduling Nudge):**
  * **Thuật toán chấm điểm phối hợp (Hybrid Scoring System):** Mở rộng cơ chế gợi ý ra tất cả các danh mục (Làm việc, Học tập, Admin...). Tự động chấm điểm các task chưa xếp lịch dựa trên 3 tiêu chí: độ khớp thời lượng, mức ưu tiên Eisenhower, và mức độ khớp năng lượng với giờ vàng sinh học theo Chronotype của người dùng.
  * **Giao diện Dropdown & Xếp lịch tức thời:** Thẻ gợi ý hiển thị task tối ưu nhất cùng một menu dropdown cho phép người dùng thay đổi sang các task phù hợp khác. Bấm "Xếp lịch ngay" sẽ cập nhật trực tiếp thời gian bắt đầu của task được chọn mà không cần mở modal tạo mới.

### Fixed

* Khắc phục lỗi TypeScript `CATEGORY_NAMES` không khớp với định nghĩa của `TaskCategory` trong `BatchingNudgeCard.tsx`.
```
