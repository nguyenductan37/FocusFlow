# Tài liệu Đặc tả Thiết kế Kỹ thuật & Hiện thực hóa: Tối Ưu Hóa Tự Động Xếp Lịch Thông Minh (Smart Slot-Scheduling Nudge)

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, thuật toán chấm điểm, thiết kế tương tác người dùng (UI/UX) và kế hoạch hiện thực hóa cho tính năng **Tự động xếp lịch thông minh (Smart Slot-Scheduling Nudge)** thuộc Sprint 8 của dự án FocusFlow.

---

## 1. Phân Tích Nghiệp Vụ & Ý Tưởng (Concept)

### 1.1 Vấn đề hiện tại
* Trong file `Scheduler.tsx`, cơ chế đề xuất chèn lịch học (`studySlotProposal`) hoạt động theo nguyên lý **"luôn tạo mới"**. Khi phát hiện một khoảng trống thời gian trống trong ngày, hệ thống hiển thị thẻ gợi ý và mở Modal để tạo một task `Học tập` mới.
* Hạn chế: Nếu người dùng đã có sẵn các nhiệm vụ chưa lên lịch cụ thể (unscheduled tasks) trong danh sách việc cần làm của ngày hôm nay, việc hệ thống đề xuất tạo mới sẽ làm gia tăng số lượng công việc trùng lặp, gây lo âu tích lũy và tăng ma sát trải nghiệm người dùng (phải gõ lại tiêu đề, mô tả).

### 1.2 Giải pháp cải tiến (Smart Slot-Scheduling Nudge)
Mở rộng cơ chế gợi ý ra **tất cả các danh mục** (Làm việc, Học tập, Admin...) kết hợp với thuật toán khớp nối thông minh:
1. **Phát hiện khoảng trống:** Giữ nguyên cơ chế quét các gap thời gian trống $\ge 20$ phút hoặc thời điểm sau task cuối cùng trong ngày (trước 17:00).
2. **Khớp nối thông minh:**
   * **Nếu có task chưa xếp lịch:** Chạy thuật toán chấm điểm hỗn hợp (Eisenhower + Mức năng lượng theo giờ sinh học + Thời lượng). Đề xuất task có điểm cao nhất vào khe trống. Hiển thị Dropdown chứa các ứng viên khác để người dùng thay đổi nếu muốn. Click "Xếp lịch ngay" sẽ gán giờ bắt đầu trực tiếp cho task.
   * **Nếu không có task chưa xếp lịch:** Chuyển về chế độ dự phòng (Fallback) gợi ý chèn học tập/tạo mới như cũ.
3. **Cơ chế ẩn thông minh (Dynamic Dismiss):** Khi người dùng nhấn "Bỏ qua", hệ thống chỉ ẩn gợi ý cho mốc giờ trống đó. Khi lịch trình thay đổi và tạo ra một khe trống khác, gợi ý sẽ xuất hiện trở lại để hỗ trợ tiếp.

---

## 2. Tiêu chí Acceptance Criteria (AC)

Bổ sung/cập nhật chi tiết các tiêu chí nghiệm thu cho nhóm PB-5.1:

* **AC-PB51-01 (Phát hiện khe trống):** Hệ thống tự động phát hiện khoảng trống $\ge 20$ phút trong ngày hoặc khoảng trống cuối chiều trước 17:00.
* **AC-PB51-02-v2 (Thuật toán chấm điểm phối hợp):** Hệ thống lọc tất cả các task chưa xếp lịch (`!scheduled_at`, `due_date === today`, trạng thái khác `DONE`/`DEFERRED`) và tính điểm dựa trên độ khớp thời lượng (Duration Fit), Eisenhower priority ($Q1 > Q2 > Q3 > Q4$), và độ khớp nhịp sinh học (HIGH energy vào giờ vàng, LOW energy ngoài giờ vàng).
* **AC-PB51-03-v2 (Giao diện Dropdown & Xếp lịch tức thời):**
  * Thẻ gợi ý hiển thị tên task có điểm cao nhất kèm theo một Dropdown cho phép đổi sang các task phù hợp khác.
  * Nút hành động đổi thành **"Xếp lịch ngay"**. Khi click, cập nhật trực tiếp trường `scheduled_at` của task được chọn mà không mở Modal.
* **AC-PB51-04-v2 (Ẩn gợi ý linh hoạt):** Khi người dùng click "Bỏ qua", gợi ý cho mốc thời gian đó sẽ ẩn đi. Nếu có khe trống mới xuất hiện hoặc thay đổi lịch trình, gợi ý sẽ tự động hiện lại.
* **AC-PB51-05-v2 (Chế độ dự phòng):** Nếu không có task chưa xếp lịch nào trong ngày, hệ thống gợi ý tạo mới một task học tập để củng cố kỹ năng.

---

## 3. Thiết Kế Chi Tiết Kỹ Thuật (Technical Spec)

### 3.1 Thuật toán chấm điểm trong `Scheduler.tsx`
Khung giờ vàng sinh học của người dùng được xác định dựa trên `chronotype`:
* **EARLY_BIRD:** 08:00 - 11:00
* **NIGHT_OWL:** 20:00 - 22:00
* **Mặc định (Chim bồ câu/khác):** 09:00 - 11:00 và 14:00 - 16:00

Công thức chấm điểm cho từng task chưa xếp lịch:
```typescript
let score = 0;

// 1. Độ khớp thời lượng (Duration Fit)
if (task.estimated_min <= slotDuration) {
  score += 50;
} else {
  score -= 20; // Trừ điểm nếu task dài hơn khe trống
}

// 2. Mức độ quan trọng (Eisenhower)
if (task.eisenhower_q === 'Q1') score += 40;
else if (task.eisenhower_q === 'Q2') score += 35;
else if (task.eisenhower_q === 'Q3') score += 20;
else if (task.eisenhower_q === 'Q4') score += 10;

// 3. Khớp năng lượng sinh học (Bio-hour Alignment)
const startHour = parseInt(slotTime.split(':')[0], 10);
const isGoldenHour = checkIsGoldenHour(startHour, chronotype);

if (isGoldenHour) {
  if (task.energy_level === 'HIGH') score += 30;
  else if (task.energy_level === 'MEDIUM') score += 15;
  else if (task.energy_level === 'LOW') score += 5;
} else {
  if (task.energy_level === 'LOW') score += 20;
  else if (task.energy_level === 'MEDIUM') score += 10;
  else if (task.energy_level === 'HIGH') score -= 10;
}
```

### 3.2 Quản lý State cục bộ trong `Scheduler.tsx`
* `selectedTaskId`: ID của task đang được hiển thị trong thẻ đề xuất (mặc định là task điểm cao nhất, thay đổi khi người dùng chọn từ Dropdown).
* `dismissedSlot`: Chuỗi dạng `"HH:MM"` lưu mốc thời gian của khe trống bị bỏ qua. Gợi ý sẽ ẩn nếu `slotTime === dismissedSlot`.

---

## 4. Kế Hoạch Hiện Thực Hóa (Implementation Plan)

- [x] **Bước 1: Thiết lập cấu trúc đặc tả** (Tài liệu này)
- [x] **Bước 2: Cập nhật component `Scheduler.tsx`**
  - Bổ sung type và prop `onScheduleUnscheduledTask`
  - Viết helper function `checkIsGoldenHour(hour, chronotype)`
  - Cập nhật `studySlotProposal` useMemo để lọc, chấm điểm và trả về danh sách các task khả thi xếp theo điểm số từ cao đến thấp.
  - Thêm state `selectedTaskId` và `dismissedSlot`
  - Đồng bộ `selectedTaskId` khi `studySlotProposal` thay đổi slot
  - Sửa đổi giao diện render của hộp thoại đề xuất chèn học tập, tích hợp thẻ Dropdown chọn nhanh các task khác và gọi handler khi nhấn "Xếp lịch ngay".
- [x] **Bước 3: Cập nhật `App.tsx`**
  - Truyền hàm `handleUpdateTaskTime` làm prop `onScheduleUnscheduledTask` vào component `<Scheduler />`.
- [ ] **Bước 4: Kiểm thử thủ công (Manual Testing)**
  - Thực hiện kịch bản kiểm thử tích hợp trên trình duyệt để xác thực.

---

## 5. Kịch Bản Kiểm Thử Thủ Công (Manual Testing Plan)

### Kịch bản 1: Có sẵn task chưa xếp lịch
1. Truy cập ứng dụng tại `http://localhost:3000`.
2. Tạo 1 task mới có danh mục là **"Làm việc"**, mức độ ưu tiên **Q1**, năng lượng **HIGH**, thời lượng **30 phút**, và **không điền giờ bắt đầu** (để trống).
3. Đảm bảo lịch trình có một khe trống (ví dụ: giải quyết các xung đột lịch trình hiện có nếu có).
4. Quan sát thẻ gợi ý màu xanh lá cây ở đầu danh sách Scheduler:
   * Thẻ phải ghi nhận có khoảng trống và gợi ý trực tiếp nhiệm vụ vừa tạo: *"Bạn có nhiệm vụ Làm việc '...' chưa xếp lịch. Gợi ý xếp vào lúc..."*.
   * Dropdown phải hiển thị nhiệm vụ này và các nhiệm vụ khả thi khác.
5. Nhấn nút **"Xếp lịch ngay"**.
6. Xác nhận:
   * Thẻ gợi ý biến mất hoặc chuyển sang gợi ý khe trống tiếp theo.
   * Nhiệm vụ đó xuất hiện chính xác tại mốc giờ được đề cử trong danh sách lịch trình trong ngày.

### Kịch bản 2: Bỏ qua gợi ý linh hoạt
1. Tạo một task chưa xếp lịch tương tự như kịch bản 1.
2. Khi thẻ gợi ý xuất hiện tại mốc giờ `HH:MM`, nhấn **"Bỏ qua"**.
3. Xác nhận thẻ gợi ý bị ẩn đi.
4. Kéo thả hoặc thay đổi giờ của một task khác trên lịch trình để tạo ra một khoảng trống mới tại thời điểm khác.
5. Xác nhận thẻ gợi ý tự động hiển thị trở lại đề xuất xếp lịch vào khoảng trống mới.
