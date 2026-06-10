# Kế Hoạch Ý Tưởng Tính Năng Mới: Sinh Vật Nhịp Sinh Học & Dự Báo Quá Tải Nhận Thức

Tài liệu này phác thảo chi tiết ý tưởng, cơ chế hoạt động và đánh giá tính khả thi cho hai tính năng mang tính cá nhân hóa và game hóa (Gamification) cao thuộc dự án FocusFlow.

---

## 1. Sinh Vật Nhịp Sinh Học (Gamified Bio-Pet)

### 1.1. Ý tưởng (Concept)
* **Tên gợi ý:** Bio-Companion (Focus Pet).
* **Mô tả:** Hệ thống cung cấp một sinh vật ảo (Pet) đại diện cho nhịp sinh học và năng lượng tinh thần của người dùng. Pet sẽ thay đổi hình thái, biểu cảm và trạng thái sức khỏe dựa trên thói quen làm việc thực tế của người dùng đối chiếu với nhịp sinh học đã khảo sát (Sơn Ca, Cú Đêm, Chim Bồ Câu).
* **Mục tiêu:** Tăng tính tương tác (retention), tạo động lực tâm lý tích cực (positive reinforcement) để người dùng duy trì lối sống và lịch trình làm việc lành mạnh.

### 1.2. Cách hoạt động (Mechanics)
* **Hình thái tiến hóa:**
  * **Sơn Ca (Early Bird):** Chú chim non màu vàng chanh năng động.
  * **Cú Đêm (Night Owl):** Chú cú nhỏ màu xanh lam đêm sâu sắc.
  * **Chim Bồ Câu (Third Bird):** Chú chim bồ câu màu lục nhạt ôn hòa.
* **Hệ thống Trạng thái (States):**
  * **Trạng thái Khỏe mạnh (Active):** Khi người dùng làm việc (chạy Pomodoro hoặc hoàn thành task HIGH energy) đúng Khung giờ vàng sinh học. Pet sẽ hiển thị hiệu ứng vui tươi, phát sáng nhẹ.
  * **Trạng thái Mệt mỏi (Fatigued):** Khi người dùng làm việc quá giờ ngủ sinh học (ví dụ: Sơn ca làm việc sau 22h, Cú đêm làm việc sau 01:00 sáng) hoặc làm việc liên tục quá 3 tiếng không nghỉ ngơi. Pet sẽ chuyển sang tư thế nằm, mắt lờ đờ hoặc ngáp ngủ.
  * **Trạng thái Thư giãn (Decompressing):** Khi người dùng thực hiện chu trình xả hơi tối (Decompression) hoặc nghỉ ngơi 5 phút (Take Break). Pet sẽ chuyển sang trạng thái thiền hoặc ngủ say.
* **Hệ thống Điểm số & Tiến hóa:** Hoàn thành công việc đúng giờ vàng tích lũy "Bio-XP". Đạt mốc XP nhất định sẽ giúp Pet tiến hóa lớn hơn hoặc mở khóa các phụ kiện trang trí (tổ chim, nến ngủ, tách trà).

### 1.3. Đánh giá mức độ triển khai (Feasibility)
* **Độ phức tạp:** **Trung bình (Medium)**.
* **Công nghệ áp dụng:** 
  * Sử dụng các hình vẽ SVG động (CSS Keyframes Animation) để thay đổi biểu cảm và tư thế của Pet mà không làm nặng ứng dụng (không cần WebGL hay Canvas nặng).
  * State của Pet được đồng bộ trực tiếp từ `localStorage` cùng với dữ liệu Chronotype và trạng thái làm việc thực tế của ứng dụng.
* **Rủi ro:** Cần thiết kế đồ họa SVG tinh gọn để đảm bảo tính thẩm mỹ cao mà không tốn nhiều công sức dựng hình.

---

## 2. Hệ Thống Dự Báo Mức Độ Quá Tải Nhận Thức (Cognitive Overload Predictor)

### 2.1. Ý tưởng (Concept)
* **Mô tả:** Công cụ đo lường và dự báo mức độ kiệt sức tinh thần (Cognitive Fatigue) của người dùng theo thời gian thực dựa trên các tương tác của họ với danh sách task và đồng hồ tập trung.
* **Mục tiêu:** Cảnh báo sớm nguy cơ mất tập trung hoặc kiệt sức (burnout), chủ động điều hướng người dùng nghỉ ngơi trước khi hiệu suất làm việc giảm mạnh.

### 2.2. Cách hoạt động (Algorithm & Rules)
* **Chỉ số Tải nhận thức (Cognitive Load Index - CLI):** Được tính bằng phần trăm từ 0% đến 100% dựa trên các tham số thời gian thực:
  * **Cộng điểm (+):**
    * Mỗi phút chạy Pomodoro liên tục: $+0.8\%$.
    * Hoàn thành task HIGH energy: $+10\%$.
    * Đổi lịch dời task (Procrastination Event): $+5\%$ (tăng áp lực tâm lý do tích lũy công việc).
  * **Trừ điểm (-):**
    * Thực hiện nghỉ giải lao (Take Break): $-20\%$ lập tức.
    * Sau khi hoàn tất chu trình xả hơi tối (Decompression): Reset CLI về $0\%$ cho ngày hôm sau.
    * Thời gian không hoạt động (Idle time) ngoài giờ vàng: $-5\%$ mỗi tiếng.
* **Các ngưỡng cảnh báo:**
  * **CLI < 50% (Mức An toàn):** Trạng thái hoạt động bình thường.
  * **CLI từ 50% - 80% (Cảnh báo Tải cao):** Giao diện cảnh báo nhẹ nhàng, khuyên dùng việc nhỏ (LOW energy) hoặc chuẩn bị nghỉ ngơi.
  * **CLI > 80% (Quá tải nhận thức):** Kích hoạt cảnh báo nổi bật. Nếu cố tình bắt đầu task HIGH energy mới hoặc Pomodoro tiếp theo, hệ thống sẽ đề xuất một "Micro-break" 2 phút tự động (ví dụ: bài tập thở sâu hoặc nhìn xa ra ngoài cửa sổ).

### 2.3. Đánh giá mức độ triển khai (Feasibility)
* **Độ phức tạp:** **Thấp đến Trung bình (Low - Medium)**.
* **Công nghệ áp dụng:** 
  * Hoàn toàn sử dụng các thuật toán tính toán logic phía Client (JS/TS) dựa trên lịch sử tương tác task.
  * Sử dụng một thanh đo trạng thái (Radial Progress Bar hoặc Wave animation) trên Dashboard để người dùng dễ quan sát.
* **Rủi ro:** Cần tinh chỉnh lại các hệ số nhân/chia điểm CLI qua thử nghiệm thực tế để đảm bảo chỉ số phản ánh chính xác cảm giác mệt mỏi của người dùng, tránh gây phiền nhiễu do cảnh báo quá thường xuyên.
