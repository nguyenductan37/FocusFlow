# Tài liệu Phân tích & Đặc tả Kỹ thuật Chức năng PB-F4: Công cụ Decompression & Giấc ngủ Nhận thức buổi tối

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, luồng trải nghiệm người dùng (UX) và phương án triển khai kỹ thuật cho công cụ xả hơi buổi tối (Decompression Tool) trong Sprint 2.

---

## 1. Phân tích Nghiệp vụ (Requirements Analysis)

*   **Vấn đề:** Sau khi kết thúc ngày làm việc (EOD), não bộ người dùng thường vẫn ở trạng thái kích thích (Hyper-arousal). Họ liên tục suy nghĩ về các task chưa xong hoặc lo lắng cho ngày mai, dẫn đến khó ngủ và suy giảm khả năng phục hồi năng lượng tinh thần.
*   **Giải pháp:** 
    1.  *Brain Dump (Trút bỏ lo toan):* Cung cấp một không gian tối giản để người dùng viết ra mọi lo lắng, suy nghĩ công việc rồi cho chúng "tan biến" về mặt thị giác.
    2.  *Bài tập thở 4-7-8:* Hướng dẫn nhịp thở khoa học để kích hoạt hệ thần kinh phó giao cảm (Parasympathetic nervous system), giảm nhịp tim và đưa cơ thể vào trạng thái sẵn sàng nghỉ ngơi.
    3.  *OFF Mode cưỡng chế:* Khóa chặt các tương tác sửa đổi task sau khi hoàn thành chu trình để người dùng không quay lại làm việc trong đêm.

---

## 2. Tiêu chí kích hoạt & Giao diện (Trigger Conditions)

*   **Điều kiện hiển thị nút kích hoạt:**
    *   Giờ hiện tại là sau **19:30** (`currentTime >= '19:30'`).
    *   Người dùng **đã xác nhận Đóng ngày (EOD)** (trạng thái `isOffMode === true`).
    *   Người dùng **chưa hoàn thành chu trình Decompression** trong ngày hôm nay (kiểm tra `decompression_last_date !== today`).
*   **Nút kích hoạt:** Hiển thị trên thanh banner OFF Mode hoặc khu vực Dashboard với nhãn: `🌙 Khởi động chu trình xả hơi 3 phút để đi ngủ`.

---

## 3. Các bước trong Chu trình Decompression (Steps Workflow)

### Bước 1: Brain Dump (Trút bỏ lo toan)
*   **Giao diện:** Toàn màn hình chuyển sang màu tối dịu nhẹ (Tone màu Slate-950 hoặc Midnight Blue), lọc hoàn toàn ánh sáng xanh.
*   **Nội dung:** Ô nhập văn bản lớn không có viền với câu hỏi gợi mở: *"Đang có điều gì làm bạn bận tâm hoặc lo lắng về công việc?"*.
*   **Hiệu ứng:** Khi người dùng nhập xong và bấm nút **"Đóng dòng suy nghĩ & Đi ngủ"**, toàn bộ đoạn văn bản vừa nhập sẽ chuyển sang hiệu ứng mờ dần và tan biến (fade-out / particle dissolve) bằng thư viện `motion`.

### Bước 2: Bài tập thở 4-7-8 (Mindful Breathing)
Ngay sau khi văn bản biến mất, màn hình chuyển sang hướng dẫn tập thở với 1 vòng tròn hoạt họa co giãn:
1.  **Hít vào (Inhale - 4 giây):** Vòng tròn mở rộng dần từ nhỏ lên lớn. Chữ hiển thị: *"Hít vào bằng mũi..."*.
2.  **Giữ hơi (Hold - 7 giây):** Vòng tròn giữ nguyên kích thước tối đa và phát sáng nhẹ. Chữ hiển thị: *"Giữ hơi thở..."*.
3.  **Thở ra (Exhale - 8 giây):** Vòng tròn thu nhỏ từ từ về kích thước ban đầu. Chữ hiển thị: *"Thở ra chậm rãi qua miệng..."*.

*Chu kỳ này lặp lại đúng 4 lần (tổng cộng khoảng 76 giây).*

### Bước 3: Lời chúc ngủ ngon & Khóa OFF Mode
*   Hiển thị thông điệp nhẹ nhàng: *"Chúc bạn có một giấc ngủ ngon và phục hồi năng lượng thật tốt. Hẹn gặp lại vào ngày mai!"*.
*   Nhấn nút "Tắt màn hình" sẽ đóng overlay.
*   **Khóa cứng ứng dụng:** Giao diện ứng dụng lúc này sẽ ẩn toàn bộ danh sách task và nút "Quay lại làm việc", thay vào đó hiển thị banner chúc ngủ ngon. Trạng thái khóa chỉ được giải phóng vào sáng hôm sau (sau 05:00 sáng).

---

## 4. Thiết kế Kỹ thuật chi tiết

### 4.1. Cập nhật Lưu trữ (Local Storage)
Cần lưu trữ thêm trường để theo dõi ngày hoàn tất chu trình xả hơi gần nhất:
*   Key: `focusflow_decompression_date` (Định dạng: `YYYY-MM-DD`).

### 4.2. Giao diện Vòng tròn Thở (CSS & Motion)
Sử dụng thư viện `motion` có sẵn để tạo hiệu ứng co giãn mượt mà:
```tsx
const circleVariants = {
  inhale: { scale: 1.8, transition: { duration: 4, ease: "easeInOut" } },
  hold: { scale: 1.8, filter: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))", transition: { duration: 7 } },
  exhale: { scale: 1.0, transition: { duration: 8, ease: "easeInOut" } }
};
```

---

## 5. Kế hoạch hiện thực hóa (Các Bước Code)

- [ ] **Bước 1:** Tạo component `DecompressionOverlay.tsx` quản lý giao diện tối giản, ô nhập Brain Dump và animation bài tập thở 4-7-8.
- [ ] **Bước 2:** Bổ sung trạng thái `decompressionDate` trong `App.tsx` để theo dõi tiến trình làm sạch não bộ cuối ngày.
- [ ] **Bước 3:** Tạo banner hoặc nút bấm kích hoạt chu trình tại trang chủ khi đủ điều kiện thời gian (>19:30) và đã đóng ngày.
- [ ] **Bước 4:** Xử lý hiệu ứng khóa tương tác cứng (Hard OFF Lock) khi hoàn thành chu trình để ngăn chặn hoàn toàn việc xem hay sửa task trước 05:00 sáng hôm sau.
- [ ] **Bước 5:** Tích hợp nhạc thiền tần số thấp tự phát bằng Web Audio API (tương tự PB-F6) để tăng hiệu quả thư giãn.
