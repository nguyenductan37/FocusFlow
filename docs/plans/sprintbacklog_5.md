# Tài Tài liệu Đặc tả Thiết kế Kỹ thuật Chức năng: Hệ Thống Dự Báo Quá Tải Nhận Thức (Cognitive Overload Predictor)

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, giao diện người dùng (UI/UX), thuật toán tính toán và phương án triển khai kỹ thuật cho tính năng **Dự báo quá tải nhận thức (Cognitive Overload Predictor)** trong Sprint 4 của dự án FocusFlow.

---

## 1. Phân tích Nghiệp vụ & Ý tưởng (Concept)
* **Vấn đề:** Khi làm việc trí óc cường độ cao, con người thường bỏ qua các dấu hiệu kiệt sức nhận thức (cognitive exhaustion) cho đến khi quá muộn. Điều này dẫn đến sự mất tập trung, mắc sai lầm, trì hoãn và giảm hiệu suất đáng kể.
* **Giải pháp:** Sử dụng chỉ số **Cognitive Load Index (CLI)** từ 0% đến 100% để phản ánh mức tải hoạt động của não bộ dựa trên các tương tác thời gian thực. Cảnh báo tĩnh khi CLI vượt quá 80% để nhắc nhở người dùng nghỉ ngơi giải lao.

---

## 2. Tiêu chí Acceptance Criteria (AC)

* **SC1: Giao diện thẻ kép trong EnergyBar:**
  * Thẻ `EnergyBar` hiển thị 2 thanh đo song song:
    1. **Năng lượng sinh học (Physical Energy):** Từ 0% - 100% (Thanh hiện tại).
    2. **Tải nhận thức (Cognitive Load):** Từ 0% - 100% (Thanh mới).
  * Mỗi thanh đều hiển thị giá trị số phần trăm rõ ràng và các biểu tượng tương ứng.
* **SC2: Đổi màu theo Ngưỡng cảnh báo (CLI Thresholds):**
  * **Mức an toàn (CLI < 50%):** Thanh tiến trình có màu xanh lá/xanh lam ôn hòa.
  * **Mức cảnh báo (50% <= CLI < 80%):** Thanh tiến trình chuyển sang màu vàng/cam.
  * **Mức nguy hiểm (CLI >= 80%):** 
    * Thanh tiến trình chuyển sang màu đỏ rực.
    * Xuất hiện dòng chữ cảnh báo nhấp nháy bên dưới thanh: *"Cảnh báo: Tải nhận thức quá cao! Hãy cân nhắc nghỉ giải lao."*
* **SC3: Quy tắc Tích lũy & Phục hồi CLI:**
  * CLI tăng lên khi người dùng thực hiện các hành động tiêu tốn năng lượng não bộ.
  * CLI giảm đi khi người dùng thực hiện các hoạt động nghỉ ngơi, phục hồi nhận thức.

---

## 3. Thuật toán & Cơ chế tính điểm CLI

### 3.1. Quy tắc Tăng / Giảm điểm CLI
Hệ thống sử dụng các quy tắc sau để tính toán CLI trong ngày (tối đa 100%, tối thiểu 0%):

| Hành động tương tác | Biến động CLI | Mô tả |
| :--- | :---: | :--- |
| **Chạy đồng hồ Pomodoro** | $+0.8\% / \text{phút}$ | Tăng dần mỗi phút khi đồng hồ Focus đang chạy. |
| **Hoàn thành Task HIGH energy** | $+10\%$ | Ghi nhận ngay khi task HIGH được đánh dấu DONE. |
| **Dời/Hoãn Task (Postpone)** | $+5\%$ | Ghi nhận khi dời due_date hoặc hủy phiên Focus. |
| **Nghỉ giải lao (Take Break)** | $-20\%$ | Giảm ngay lập tức khi người dùng click nghỉ ngơi. |
| **Đóng ngày EOD** | Reset về $0\%$ | Reset hoàn toàn để chuẩn bị cho ngày làm việc mới. |

---

## 4. Kế Hoạch Triển Khai Kỹ Thuật (Detailed Technical Implementation Plan)

### Giai đoạn 1: Khởi tạo Trạng thái CLI trong `App.tsx`
* **Mã nguồn bổ sung:**
  * Tạo state `cognitiveLoad` trong `src/App.tsx`:
    ```typescript
    const [cognitiveLoad, setCognitiveLoad] = useState<number>(() => {
      const saved = localStorage.getItem('focusflow_cognitive_load');
      return saved ? Number(saved) : 0;
    });
    ```
  * Tạo helper `updateCognitiveLoad(delta: number)`:
    ```typescript
    const updateCognitiveLoad = (delta: number) => {
      setCognitiveLoad(current => {
        const next = Math.max(0, Math.min(100, current + delta));
        localStorage.setItem('focusflow_cognitive_load', String(next));
        return next;
      });
    };
    ```

### Giai đoạn 2: Tích hợp logic CLI vào các luồng sự kiện
* **Pomodoro Running:**
  * Trong component `FocusOverlay.tsx` hoặc timer kiểm soát Pomodoro, mỗi khi thời gian đếm ngược trôi qua 1 phút (hoặc khi hoàn tất giây thứ 0 của mỗi phút), kích hoạt hàm callback để cộng $+0.8\%$ vào CLI.
  * Hoặc đơn giản, khi hoàn tất chu kỳ Pomodoro 25 phút, cộng dồn $+20\%$ vào CLI (tương đương 25 phút x 0.8%).
* **Hoàn thành Task:**
  * Trong `handleToggleTaskComplete`, nếu task được đánh dấu thành DONE và có `energy_level === 'HIGH'`, gọi `updateCognitiveLoad(10)`.
* **Hoãn/Dời Task:**
  * Trong `handleFocusDefer` (hủy phiên tập trung) hoặc khi tăng `postpone_count` của task, gọi `updateCognitiveLoad(5)`.
* **Nghỉ giải lao:**
  * Trong `handleTakeBreak` (khi nhấn nghỉ ngơi), gọi `updateCognitiveLoad(-20)`.
* **Đóng ngày EOD:**
  * Trong `handleConfirmClosure`, gọi `updateCognitiveLoad(-100)` để reset CLI về 0.

### Giai đoạn 3: Mở rộng component `EnergyBar.tsx`
* **Props thay đổi:**
  * Nhận thêm prop `cognitiveLoad: number`.
* **Giao diện HTML/CSS:**
  * Thêm một phân vùng hiển thị `Tải nhận thức` ngay bên dưới thanh năng lượng vật lý.
  * Logic hiển thị màu sắc của CLI progress bar:
    * `cognitiveLoad < 50`: `bg-emerald-500` (Xanh lá)
    * `50 <= cognitiveLoad < 80`: `bg-amber-500` (Cam nhạt)
    * `cognitiveLoad >= 80`: `bg-rose-500 animate-pulse` (Đỏ rực nhấp nháy)

---

## 5. Kế Hoạch Kiểm Thử (Manual Testing Plan)

### Kịch bản 1: Kiểm tra tính năng tích lũy điểm khi tải nhận thức tăng
**Mục tiêu:** Đảm bảo CLI tự động tăng khi làm các việc căng thẳng não bộ.
* **Bước 1:** Tìm một công việc (task) trong danh sách đang ở mức năng lượng là **HIGH** (Cao).
* **Bước 2:** Bấm vào biểu tượng Play để chạy bộ đếm thời gian (Pomodoro) cho task đó.
* **Bước 3:** Trên màn hình Pomodoro, nhấn vào **Nút Hoãn (Tôi muốn hoãn công việc này)**, điền lý do và xác nhận.
* **Bước 4:** Nhìn vào thanh "Tải Nhận Thức" trên cột bên phải, xác nhận chỉ số CLI tăng lên `5%`.
* **Bước 5:** Đánh dấu hoàn thành (DONE) một task **HIGH** khác. Xác nhận chỉ số CLI lập tức tăng thêm `10%`.

### Kịch bản 2: Kiểm tra cảnh báo quá tải (CLI > 80%) và chuyển đổi màu sắc
**Mục tiêu:** Đảm bảo hệ thống phát ra cảnh báo khi chỉ số chạm ngưỡng mệt mỏi.
* **Bước 1:** Đánh dấu hoàn thành (DONE) liên tiếp khoảng 7-8 task **HIGH** để đẩy điểm số CLI vượt mốc `50%`. Xác nhận thanh màu xanh lá chuyển sang màu cam.
* **Bước 2:** Đánh dấu hoàn thành thêm vài task HIGH nữa để CLI vượt mốc `80%`. Xác nhận thanh tiến trình đổi sang màu **đỏ rực nhấp nháy** và hiển thị khung cảnh báo *"Cảnh báo: Quá tải nhận thức!"*.

### Kịch bản 3: Kiểm tra tính năng giảm tải (Nghỉ ngơi)
**Mục tiêu:** Đảm bảo CLI giảm đi khi thực hiện các hoạt động xả stress.
* **Bước 1:** Khi thanh CLI đang đỏ và cảnh báo (giả sử > `80%`), nhấn vào nút **"Nghỉ giải lao (Reset Năng Lượng)"**.
* **Bước 2:** Xác nhận chỉ số CLI giảm đi `20%`. Thanh màu đỏ trở lại màu cam/xanh và khung cảnh báo đỏ biến mất.

### Kịch bản 4: Kiểm tra tính năng Reset qua ngày mới (EOD)
**Mục tiêu:** Đảm bảo CLI được đưa về `0%` chuẩn bị cho ngày làm việc tiếp theo.
* **Bước 1:** Nhấn vào nút **"Kết thúc ngày làm việc (EOD)"** (icon cái cửa).
* **Bước 2:** Xác nhận **"Bật chế độ OFF"**.
* **Bước 3:** Xác nhận CLI tự động trả về `0%`, thanh trạng thái trở về màu xanh lá hoàn toàn trống.
