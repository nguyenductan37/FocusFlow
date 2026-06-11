# Tài liệu Đặc tả Thiết kế Kỹ thuật Chức năng: Tiêu diệt Task Bóng Tối & Trang bị Linh Vật (Slay the Shadow Tasks & Pet Gear)

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, luồng trải nghiệm người dùng (UX), cấu trúc dữ liệu, và thuật toán xử lý kỹ thuật cho tính năng **Tiêu diệt Task Bóng Tối (Slay the Shadow Tasks)** trong Sprint 5 (mã sự kiện PB-F7) của dự án FocusFlow.

---

## 1. Phân Tích Nghiệp Vụ & Ý Tưởng (Concept)
* **Vấn đề:** Các task bị trì hoãn nhiều lần (Doom Pile) tạo ra áp lực tâm lý vô hình, khiến người dùng sợ hãi và càng trì hoãn thêm. Việc rã nhỏ task bằng AI giúp giảm friction, nhưng vẫn cần một động lực tích cực kích thích để người dùng bắt tay thực hiện ngay.
* **Giải pháp:** Game hóa (Gamification) bằng cách biến các task trì hoãn này thành "Quái vật bóng tối". Khi người dùng hoàn thành toàn bộ các mảnh vỡ (task con), quái vật bị tiêu diệt, mang lại Bio-XP lớn và mở khóa các phụ kiện dũng sĩ độc quyền cho linh vật đồng hành (Bio-Companion).

---

## 2. Tiêu chí Acceptance Criteria (AC)

* **SC1: Giao diện thẻ Task Con (Shadow Steps):**
  * Các task con được rã từ task trì hoãn $\ge 3$ lần sẽ hiển thị viền màu tím nhạt nhấp nháy (`border-purple-300 shadow-pulse`).
  * Có nhãn dán màu tím `👾 Mảnh vỡ bóng tối` và biểu tượng thanh kiếm chéo `⚔️` cạnh tiêu đề task.
  * Hiển thị banner tiến trình chiến đấu chung ở đầu danh sách nhiệm vụ: `👾 Đang bao vây Quái vật bóng tối (${category}) — Tiến độ: ${completed}/${total} mảnh` kèm thanh tiến trình màu tím.

* **SC2: Trạng thái chiến đấu của Linh Vật (Bio-Pet Battle Mode):**
  * Khi tồn tại bất kỳ task con bóng tối nào chưa làm trong ngày hôm nay, linh vật chuyển sang trạng thái "Chiến đấu".
  * Thiết kế mắt của Pet chuyển sang dạng tập trung nghiêm túc (lông mày xếch nhẹ).
  * Vòng tròn chứa Pet phát sáng tím nhịp điệu (`shadow-[0_0_15px_rgba(168,85,247,0.5)]`).
  * Câu thoại bong bóng đổi sang chủ đề cảnh giác: *"Hãy cùng dọn dẹp các mảnh vỡ bóng tối!"*.

* **SC3: Quy tắc nhận thưởng & Mở khóa Phụ kiện:**
  * Hoàn thành mỗi task con bóng tối: Cộng $+20$ Bio-XP cơ bản cho Pet.
  * Hoàn thành **mảnh vỡ cuối cùng** của nhóm (Tất cả task con cùng `parentId` đều `DONE`):
    * Kích hoạt hiệu ứng chúc mừng Victory nổi bật trên màn hình.
    * Thưởng thêm $+50$ Bio-XP.
    * Tự động mở khóa ngẫu nhiên một trong ba phụ kiện: **Kiếm đồ chơi (`toy_sword`)**, **Khiên gỗ (`wooden_shield`)**, hoặc **Vương miện dũng sĩ (`hero_crown`)**.

* **SC4: Tủ đồ trang bị của Pet:**
  * Trong Popover thông số của Pet, bổ sung phần "⚔️ Trang bị dũng sĩ" chứa danh sách 3 phụ kiện.
  * Người dùng có thể click chọn trang bị/tháo bỏ các phụ kiện đã mở khóa.
  * Phụ kiện được chọn sẽ hiển thị chính xác đè lên SVG của Pet.

---

## 3. Thay đổi Cấu trúc Dữ liệu (Data Model)

Bổ sung các thuộc tính vào `src/types.ts`:

```typescript
export interface Task {
  // ... các trường hiện tại ...
  parentId?: string;         // ID của task cha ban đầu trước khi bị xóa
  isShadowStep?: boolean;    // Đánh dấu là task mảnh vỡ bóng tối
}

export interface BioPetState {
  level: number;
  xp: number;
  name?: string;
  unlockedAccessories?: string[]; // Danh sách các ID phụ kiện đã mở khóa
  equippedAccessories?: string[];  // Danh sách các ID phụ kiện đang trang bị
}
```

---

## 4. Đặc tả Lập trình & Phác thảo SVG Phụ kiện

### 4.1. SVG Phụ kiện trong `BioPetWidget.tsx`
Các hình vẽ SVG phụ kiện sẽ được đặt ở vị trí tuyệt đối (absolute overlay) hoặc nhúng trực tiếp vào trong SVG gốc của từng Pet để đảm bảo di chuyển nhịp nhàng cùng hoạt họa gốc:

* **Kiếm gỗ (`toy_sword`):**
  * Tọa độ hiển thị: Phía cánh trái/bên trái của Pet.
  * SVG vẽ: `<g id="toy-sword" fill="#A16207" stroke="#78350F" strokeWidth="1.5">` vẽ một lưỡi kiếm nhỏ màu nâu gỗ và chuôi kiếm màu vàng.
* **Khiên gỗ (`wooden_shield`):**
  * Tọa độ hiển thị: Phía cánh phải/bên phải của Pet.
  * SVG vẽ: `<g id="wooden-shield" fill="#B45309" stroke="#78350F" strokeWidth="1.5">` vẽ một hình tròn hoặc hình khiên có họa tiết sọc chéo.
* **Vương miện (`hero_crown`):**
  * Tọa độ hiển thị: Phía trên đỉnh đầu của Pet.
  * SVG vẽ: `<g id="hero-crown" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5">` vẽ vương miện 3 chóp màu vàng đính ngọc đỏ.

---

## 5. Kế hoạch Hiện thực hóa (Implementation Plan)

- [ ] **Bước 1:** Cập nhật các kiểu dữ liệu `Task` và `BioPetState` tại `src/types.ts`.
- [ ] **Bước 2:** Chỉnh sửa hàm `handleSplitTask` trong `src/App.tsx` để gán `parentId` và `isShadowStep: true` cho tất cả các task con mới được tạo ra.
- [ ] **Bước 3:** Chỉnh sửa hàm `handleToggleTaskComplete` trong `src/App.tsx`:
    * Kiểm tra nếu task con cuối cùng của nhóm `parentId` hoàn thành.
    * Thực hiện cộng $+50$ XP và mở khóa phụ kiện ngẫu nhiên mới chưa có trong tủ đồ.
- [ ] **Bước 4:** Cập nhật `src/components/TaskList.tsx` để thay đổi phong cách hiển thị thẻ Task Con và thêm Banner tiến độ nhóm task.
- [ ] **Bước 5:** Nâng cấp `src/components/BioPetWidget.tsx` để:
    * Lấy danh sách `tasks` qua props để kiểm tra trạng thái Chiến đấu (đổi hoạt họa mắt).
    * Thêm giao diện Closet hiển thị/trang bị phụ kiện trong Popover.
    * Nhúng các nhóm hình vẽ SVG của phụ kiện lên cơ thể Pet.
- [ ] **Bước 6:** Thiết lập âm thanh chiến thắng thông qua Web Audio API khi tiêu diệt thành công toàn bộ mảnh vỡ.

---

## 6. Kế hoạch Kiểm thử (Manual Testing Plan)

* **Kịch bản 1 (Tạo và Hiển thị):**
  * Tạo task có postpone_count = 3 $\rightarrow$ nút "🧩 Rã nhỏ" xuất hiện.
  * Bấm nút $\rightarrow$ kiểm tra xem 3 task con mới có viền phát sáng tím, nhãn `👾 Mảnh vỡ bóng tối`, và banner tiến trình hiện ở đầu danh sách.
  * Kiểm tra Pet có chuyển sang viền tím nhấp nháy, lông mày chiến đấu và thay đổi câu thoại cảnh giác không.
* **Kịch bản 2 (Hoàn thành một phần):**
  * Tích DONE 1 task con $\rightarrow$ Banner tiến độ cập nhật `1/3 mảnh`. Pet vẫn giữ trạng thái chiến đấu.
* **Kịch bản 3 (Tiêu diệt hoàn toàn - Victory):**
  * Tích DONE cả 2 task con còn lại $\rightarrow$ Banner biến mất. Hệ thống hiện thông báo Victory, Pet được cộng Bio-XP và mở khóa 1 phụ kiện (ví dụ: Kiếm gỗ). Pet trở lại biểu cảm hiền hòa bình thường.
* **Kịch bản 4 (Trang bị phụ kiện):**
  * Nhấn vào Pet để mở Popover $\rightarrow$ Nhấp chọn trang bị "Kiếm gỗ" $\rightarrow$ Xác nhận hình ảnh thanh kiếm gỗ nhỏ xuất hiện trên cơ thể Pet.
