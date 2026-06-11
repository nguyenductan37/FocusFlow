# Kế Hoạch Ý Tưởng Tính Năng Mới: Sinh Vật Nhịp Sinh Học & Dự Báo Quá Tải Nhận Thức

Tài liệu này phác thảo chi tiết ý tưởng, cơ chế hoạt động và đánh giá tính khả thi cho hai tính năng mang tính cá nhân hóa và game hóa (Gamification) cao thuộc dự án FocusFlow.

---

## 📅 Phiên Thảo Luận: 2026-06-10 (Hôm qua)

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

---

## 📅 Phiên Thảo Luận: 2026-06-11 (Hôm nay)

### 3. Nhóm Ý Tưởng: Game Hóa (Gamification)

#### 3.1. Bản Đồ Phiêu Lưu Nhận Thức (Cognitive Quest Map)
* **Mô tả:** Thay vì chỉ hiển thị điểm XP và level thông thường, mỗi tuần người dùng sẽ cùng Pet "thám hiểm" trên một bản đồ hành trình phiêu lưu dạng SVG cuộn mượt mà.
* **Cơ chế:** Mỗi bước đi tương đương với điểm Bio-XP tích lũy được trong ngày. Khi đi qua các vùng đất sinh học (ví dụ: *Thung lũng Sơn Ca*, *Đầm lầy Trì Hoãn*, *Đỉnh núi Tập Trung*), người dùng có cơ hội mở khóa các cột mốc lịch sử, nhận "Huy hiệu Nhận thức" hoặc các tài nguyên để xây dựng ngôi nhà ảo cho Pet (Focus Cabin).
* **Tính khả thi:** Trung bình (Medium) - Chủ yếu xử lý giao diện bản đồ SVG và lưu trữ tọa độ bước đi.

#### 3.2. Đấu Trường Tập Trung (Focus Guild / Shadow Boss Battle)
* **Mô tả:** Biến việc chạy Pomodoro thành một trận chiến săn Boss lớn cùng tổ đội ảo.
* **Cơ chế:** Mỗi tuần, hệ thống sinh ra một "Boss Trì Hoãn Khổng Lồ" (ví dụ: *Quái thú Facebook*, *Chúa tể Youtube*). Người dùng chạy Pomodoro để tạo ra "sức mạnh tấn công" (Damage) tiêu diệt Boss. Tiêu diệt Boss sẽ nhận trang phục giới hạn.
* **Tính khả thi:** Cao (High) - Cần xử lý cơ chế Boss tự động và hoạt họa phức tạp hơn.

### 4. Nhóm Ý Tưởng: Khoa Học Nhận Thức (Cognitive Science)

#### 4.1. Nhật Ký Nhịp Điệu Sinh Học Tự Học (Chrono-Analytics Curve)
* **Mô tả:** Hệ thống theo dõi hiệu suất thực tế của người dùng theo thời gian thực (thời gian tích DONE, hiệu suất Pomodoro, mức năng lượng tự đánh giá) để vẽ lại biểu đồ năng lượng cá nhân hóa thực tế.
* **Cơ chế:** Sau 7 ngày, AI đối chiếu biểu đồ lý thuyết (Chronotype ban đầu) với biểu đồ thực tế của người dùng để đưa ra gợi ý: *"Mặc dù bạn thuộc nhóm Sơn Ca, nhưng hiệu suất thực tế của bạn lại cao nhất lúc 14:00. Hệ thống đề xuất cập nhật lại khung giờ vàng của bạn."*
* **Tính khả thi:** Trung bình - Thấp (Low-Medium) - Cần thuật toán thu thập dữ liệu thời gian thực và vẽ đồ thị so sánh trực quan.

#### 4.2. Trình Phục Hồi Nhận Thức Chủ Động (Active Cognitive Restorer)
* **Mô tả:** Khi chỉ số quá tải nhận thức (CLI) vượt ngưỡng 80% (mức đỏ rực nhấp nháy), hệ thống đề xuất một "Micro-break" 2 phút để hạ nhiệt tinh thần trước khi cho phép bắt đầu Pomodoro tiếp theo.
* **Cơ chế:** Kích hoạt giao diện nghỉ ngơi nhanh với bài tập ngắn kèm nhạc sóng não Binaural Beats giảm stress (thở thư giãn co giãn vòng tròn, bài tập bảo vệ mắt, hoặc viết nhanh điều gây xao nhãng để AI xóa tan đi).
* **Tính khả thi:** Thấp (Low) - Dễ tích hợp trực tiếp vào logic CLI hiện tại.

### 5. Nhóm Ý Tưởng: Quản Lý Công Việc Thông Minh (Smart Task Management)

#### 5.1. Auto-Pilot Time Boxing (AI Tự Động Lên Lịch Trình)
* **Mô tả:** Người dùng chỉ cần nhập danh sách việc cần làm. AI (Gemini) sẽ tự động phân bổ toàn bộ công việc vào các block thời gian trống trong ngày một cách tối ưu.
* **Cơ chế:** Sắp xếp task HIGH energy vào Khung giờ vàng sinh học, gom các task LOW energy thành cụm (Batching) vào cuối buổi chiều, và tự động chèn các khoảng nghỉ đệm (Buffer time) 5-10 phút giữa các task lớn để tránh tăng CLI quá nhanh.
* **Tính khả thi:** Cao (High) - Cần prompt Gemini trả về JSON chính xác và xử lý va chạm giờ.

#### 5.2. Trợ Lý Phát Hiện Điểm Nghẽn Công Việc (AI Bottleneck Finder)
* **Mô tả:** Tự động phát hiện các task bị trì hoãn dai dẳng hoặc bị gắn nhãn `BLOCKED` để đưa ra giải pháp gỡ rối bằng AI.
* **Cơ chế:** Khi một task bị dời lịch nhiều ngày, AI sẽ phân tích nội dung và đưa ra gợi ý giải pháp: tách nhỏ task, bổ sung tài liệu cần thiết, hoặc cảnh báo nếu task quá mơ hồ.
* **Tính khả thi:** Trung bình (Medium).
