# Tài liệu Đặc tả Thiết kế Kỹ thuật Chức năng: Sinh Vật Nhịp Sinh Học (Bio-Companion)

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, giao diện người dùng (UI/UX), công thức thăng cấp và phương án triển khai kỹ thuật cho tính năng **Sinh vật nhịp sinh học (Bio-Companion)** trong Sprint 4 của dự án FocusFlow.

---

## 1. Phân tích Nghiệp vụ & Ý tưởng (Concept)
* **Vấn đề:** Việc duy trì kỷ luật làm việc theo nhịp sinh học đôi khi khô khan và dễ bị người dùng bỏ qua sau một thời gian ngắn.
* **Giải pháp:** Game hóa (Gamification) bằng cách đưa vào một sinh vật ảo đồng hành (Bio-Companion) ngay trên màn hình. Sinh vật này phản ánh sức khỏe sinh học của chính người dùng: phát triển khi làm việc đúng giờ vàng, mệt mỏi khi làm việc quá giờ ngủ, và vui mừng khi người dùng hoàn thành các cột mốc năng suất.

---

## 2. Tiêu chí Acceptance Criteria (AC)

* **SC1: Trạng thái chưa khảo sát (Trứng Sinh Học):**
  * Khi người dùng chưa làm trắc nghiệm nhịp sinh học, sinh vật hiển thị ở dạng một quả trứng màu tím nhạt lắc lư.
  * Click vào quả trứng hiển thị bong bóng thoại: *"Hấp dẫn quá! Hãy bấm vào tôi để ấp nở nhé!"* kèm nút **"Bắt đầu trắc nghiệm"** mở modal khảo sát.
* **SC2: Hình thái theo Nhóm sinh học (Hatch States):**
  * Sau khi hoàn thành khảo sát, quả trứng sẽ nở ra sinh vật tương ứng:
    * **Sơn Ca (Early Bird):** Chú chim nhỏ màu vàng chanh nhấp nhô nhẹ nhàng.
    * **Cú Đêm (Night Owl):** Chú cú màu xanh lam phồng xẹp êm dịu.
    * **Chim Bồ Câu (Third Bird):** Chú chim bồ câu màu lục nhạt nghiêng đầu ngơ ngác.
* **SC3: Trạng thái Sức khỏe sinh học (Health States):**
  * **Khỏe mạnh (Active):** Hiển thị khi làm việc đúng Khung giờ vàng sinh học. Pet nhảy nhót vui tươi.
  * **Mệt mỏi (Fatigued):** Hiển thị khi người dùng làm việc quá giờ ngủ sinh học (Sơn Ca sau 22h, Cú Đêm sau 01:00 sáng, Bồ Câu sau 23:00) hoặc chạy liên tục 3 chu kỳ Pomodoro không giải lao. Pet nằm dài, nhắm mắt kèm ký tự "Zzz".
  * **Thư giãn (Decompressing):** Hiển thị khi kích hoạt trạng thái Nghỉ ngơi (Break) hoặc chế độ Decompression tối. Pet khoanh chân thiền hoặc đắp chăn ngủ sâu.
* **SC4: Hệ thống Điểm số Bio-XP & Cấp độ:**
  * Cộng điểm cho các hành động tích cực, nhân đôi (x2) khi làm đúng Khung giờ vàng.
  * Khi tích lũy đủ XP, Pet sẽ thăng cấp (Level Up) kèm hiệu ứng pháo hoa chúc mừng nhỏ tại bong bóng thoại.

---

## 3. Quản lý Trạng thái & Logic Tính điểm Bio-XP

### 3.1. Cấu trúc lưu trữ dữ liệu (LocalStorage)
Trạng thái Pet được lưu trữ dưới key `focusflow_pet_state` với định dạng:
```typescript
export interface BioPetState {
  level: number;
  xp: number;
  lastActionDate: string; // Định dạng YYYY-MM-DD để tránh hack điểm trong ngày
}
```

### 3.2. Công thức thăng cấp
Điểm cần để thăng cấp tiếp theo:
$$XP_{Max} = Level \times 100$$
Khi $XP \ge XP_{Max}$, tăng $Level$ thêm 1, đồng thời đặt $XP = XP - XP_{Max}$.

### 3.3. Bảng quy đổi điểm Bio-XP
| Hành động của người dùng | Điểm cơ bản (XP) | Nhân đôi trong Giờ Vàng (XP) |
| :--- | :---: | :---: |
| Hoàn thành 1 Task bất kỳ | +20 | +40 |
| Hoàn thành 1 chu kỳ Pomodoro (25 phút) | +15 | +30 |
| Nhấp chọn nghỉ ngơi "Take Break" (100%) | +5 | Không áp dụng |
| Hoàn thành tổng kết cuối ngày (EOD) | +25 | Không áp dụng |

---

## 4. Thiết kế Giao diện & CSS Animations (SVG)

Component `BioPetWidget.tsx` được hiển thị ở vị trí `fixed bottom-6 right-6 z-50` với cấu trúc SVG inline:

### 4.1. Hoạt họa CSS `@keyframes`
```css
/* Trứng lắc lư nhẹ */
@keyframes egg-wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Sơn Ca bay nhấp nhô */
@keyframes bird-fly {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Cú Đêm thở phồng xẹp */
@keyframes owl-breath {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 4.2. Giao diện Popover thông số & Bong bóng thoại
* **Bong bóng thoại (Tooltip):** Xuất hiện phía trên Pet, tự động ẩn sau 4 giây. Hiển thị các câu thoại động viên ngẫu nhiên phù hợp với trạng thái sức khỏe của Pet.
* **Bảng chỉ số chi tiết:** Khi nhấn vào Pet, mở rộng Popover hiển thị:
  * Tên Pet tự đặt (ví dụ: "Sơn Ca Nhỏ").
  * Level hiện tại và thanh tiến trình `Progress Bar` thể hiện $XP / XP_{Max}$.
  * Trạng thái sinh học (ví dụ: 🟢 Đang tràn đầy năng lượng / 🟡 Cần nghỉ ngơi).

---

## 5. Kế Hoạch Triển Khai Kỹ Thuật (Detailed Technical Implementation Plan)

### Giai đoạn 1: Mở rộng Types & Cấu trúc Dữ liệu
* **File cần chỉnh sửa:** `src/types.ts`
* **Mã nguồn bổ sung:**
  ```typescript
  export interface BioPetState {
    level: number;
    xp: number;
    name?: string;
  }
  ```

### Giai đoạn 2: Phát triển Component `BioPetWidget.tsx`
* **File cần tạo mới:** `src/components/BioPetWidget.tsx`
* **Đặc tả logic hiển thị:**
  * Chấp nhận các props:
    * `chronotype: Chronotype | null`
    * `petState: BioPetState`
    * `onRenamePet: (newName: string) => void`
    * `onStartSurvey: () => void`
  * **Xử lý đồ họa SVG:**
    * Sử dụng SVG thuần làm các hình minh họa cho: Quả trứng (`Egg`), Sơn ca (`Early Bird`), Cú đêm (`Night Owl`), và Chim bồ câu (`Third Bird`).
    * Nhúng các style CSS `@keyframes` động trực tiếp vào file hoặc sử dụng Tailwind utility classes (`animate-bounce`, `animate-pulse`, `animate-wiggle` tùy biến) để điều khiển nhịp thở/lắc lư của Pet.
  * **Trạng thái mệt mỏi:** 
    * Nếu thời gian hiện tại nằm trong giờ ngủ của nhóm sinh học đã chọn, chuyển mắt Pet thành dạng híp hoặc nhắm nghiền (`- -` hoặc `x x`) và hiển thị các chữ "Zzz" động bay lên.
  * **Bong bóng thoại & Popover Chỉ số:**
    * Nhấp chuột vào Pet để chuyển đổi ẩn/hiện popover thông số.
    * Hiển thị thanh tiến trình XP dạng: `(XP / (Level * 100)) * 100%`.
    * Cung cấp một ô nhập liệu nhỏ (`input`) cho phép người dùng đổi tên Pet trực tiếp.

### Giai đoạn 3: Tích hợp Quản lý XP vào `App.tsx`
* **File cần chỉnh sửa:** `src/App.tsx`
* **Đặc tả logic tích hợp:**
  * Khởi tạo state `petState` lấy từ `localStorage.getItem('focusflow_pet_state')` với fallback mặc định `{ level: 1, xp: 0, name: 'Linh Vật' }`.
  * Hàm `updatePetXp(amount: number)`:
    * Kiểm tra xem thời gian thực tế có nằm trong giờ vàng của nhóm sinh học hiện tại không:
      * **EARLY_BIRD:** 08:00 - 11:00
      * **NIGHT_OWL:** 20:00 - 22:00
      * **THIRD_BIRD:** 09:00 - 11:30 hoặc 15:00 - 17:00
    * Nếu thuộc giờ vàng, nhân đôi (x2) điểm XP đầu vào.
    * Tích lũy XP, kiểm tra xem có vượt mốc `level * 100` không. Nếu vượt, tăng `level` lên 1, kích hoạt thông báo chúc mừng trên bong bóng thoại, và lưu lại state mới vào `localStorage`.
  * **Điểm nối (Hooks):**
    * Trong `handleToggleComplete`: Gọi `updatePetXp(20)` khi một task chuyển sang `DONE`.
    * Trong Pomodoro Timer completion: Gọi `updatePetXp(15)` khi hoàn thành 25 phút.
    * Trong `handleTakeBreak`: Gọi `updatePetXp(5)`.
    * Trong `handleEodComplete`: Gọi `updatePetXp(25)`.

### Giai đoạn 4: Đưa Pet lên Giao Diện
* **File cần chỉnh sửa:** `src/App.tsx`
* Đưa component `<BioPetWidget>` vào cuối layout chính (ngay dưới phần footer/tabs) để Pet đồng hành cùng người dùng trên tất cả các chế độ xem của FocusFlow.

---

## 6. Kế Hoạch Kiểm Thử (Manual Testing Plan)
* **Test Case 1 (Hatching):** Chạy ứng dụng khi chưa làm trắc nghiệm sinh học → Xác nhận hiển thị Quả Trứng lắc lư. Bấm vào trứng → hiển thị thông điệp mời gọi và nút "Bắt đầu trắc nghiệm" hoạt động.
* **Test Case 2 (Golden Hour XP):** Chọn nhóm sinh học "Cú đêm" (vàng từ 20:00-22:00).
  * Đổi giờ hệ thống hoặc tạo task hoàn thành lúc 21:00 → Kiểm tra điểm cộng là +40 XP (được nhân đôi).
  * Hoàn thành task lúc 10h sáng → Kiểm tra điểm cộng là +20 XP (điểm cơ bản).
* **Test Case 3 (Level Up):** Hoàn thành liên tục các task để điểm XP vượt ngưỡng 100 → Kiểm tra Pet tăng lên Level 2 và thanh tiến trình reset mượt mà.
* **Test Case 4 (Fatigue State):** Đổi giờ hiện tại sang 23:30 (vượt giờ đi ngủ của Sơn Ca) → Xác nhận Sơn Ca chuyển sang hoạt họa nhắm mắt ngủ gật kèm chữ Zzz.
