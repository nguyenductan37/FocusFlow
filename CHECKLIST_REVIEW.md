# CHECKLIST_REVIEW.md — Quy Trình & Danh Sách Đánh Giá Chất Lượng Code (Review Checklist)

Tài liệu này được xây dựng dựa trên đặc tả sản phẩm trong `SPEC.md` và mã nguồn thực tế của hệ thống **FocusFlow**. Mục đích của checklist này nhằm thiết lập bộ quy chuẩn nghiêm ngặt cho nhà phát triển và kiểm thử viên (QA/Code Reviewer) khi nghiệm thu mã nguồn, đảm bảo chất lượng kỹ thuật ổn định, an toàn và tối ưu hóa trước khi triển khai thực tế.

---

## Ⅰ. Tiêu Chí Kỹ Thuật Nền Tảng (Core Quality Guidelines)

Mọi thay đổi mã nguồn (Pull Request / Code Change) phải vượt qua 6 nhóm tiêu chí kỹ thuật chung dưới đây trước khi đi vào kiểm tra chi tiết các tính năng nghiệp vụ.

### 1. Kiểm thử Tính Đầy Đủ và Ràng Buộc Dữ Liệu (Validation Sufficiency)
- [ ] **Ràng buộc đầu vào của Form:**
  - Tiêu đề công việc (Task Title) không được để trống, không được chỉ chứa khoảng trắng, độ dài tối thiểu `≥ 2` ký tự và tối đa `≤ 100` ký tự.
  - Thời lượng ước tính (`estimated_min`) phải là số nguyên dương và có giới hạn trên hợp lý (ví dụ: `≤ 480` phút - 8 tiếng).
  - Khung giờ lên lịch (`start_hour`, `end_hour`) phải đúng định dạng `HH:MM` và thời gian bắt đầu luôn nhỏ hơn hoặc bằng thời gian kết thúc.
- [ ] **Phạm vi biên (Boundary Values):**
  - Mức năng lượng tiêu hao không chấp nhận các giá trị nằm ngoài danh sách định sẵn (`HIGH`, `MEDIUM`, `LOW`).
  - Ma trận Eisenhower chỉ chấp nhận chính xác 4 giá trị: `Q1`, `Q2`, `Q3`, `Q4`.
- [ ] **Mô hình hóa trạng thái (State Modeling):**
  - Đảm bảo trạng thái công việc (`status`) tuân thủ nghiêm ngặt theo enum đã định nghĩa (`TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`, `DEFERRED`).

### 2. Quản Lý Lỗi & Khả Năng Phục Hồi (Error Handling & Resilience)
- [ ] **Xử lý trạng thái rỗng (Zero States):**
  - Ứng dụng không bị vỡ giao diện (crash/blank screen) khi cơ sở dữ liệu hoặc `localStorage` rỗng hoàn toàn. Giao diện phải hiển thị các thông báo minh họa (Empty placeholders) thân thiện với người dùng.
- [ ] **Phục hồi lỗi luồng (Safe Failover):**
  - Các phép tính toán học (ví dụ: công thức chia tỷ lệ %, tính trung bình điểm kỹ năng) phải được bao bọc an toàn tránh lỗi chia cho 0 (`division by zero`), trả về `0` hoặc fallback mặc định.
- [ ] **Xử lý bất đồng bộ bảo mật:**
  - Các tác vụ lưu trữ bất đồng bộ hoặc can thiệp dữ liệu phải nằm trong khối `try/catch`. Trong môi trường frontend, các lỗi hệ thống sâu không được hiển thị nguyên văn lỗi kỹ thuật lên giao diện UI mà phải thay bằng lời khuyên cụ thể dễ hiểu.

### 3. Phòng Ngừa Việc Cố Định Giá Trị (Preventing Hardcoded Values)
- [ ] **Tham chiếu Biến Môi Trường (Environment Variables):**
  - Cấu hình server, API keys, cổng kết nối và các tham số vận hành của bên thứ ba tuyệt đối không được ghi tĩnh trong code mà phải thông qua biến môi trường (`process.env` hoặc `import.meta.env`).
- [ ] **Quy tắc cổng (Port Rule):**
  - Web Server (nếu có) phải sử dụng cổng động, mặc định cho container ingress là `PORT=3000` (không can thiệp cố định số cổng khác trong file cấu hình dev).
- [ ] **Không hardcode dữ liệu nghiệp vụ:**
  - Các hằng số vận hành (như ngưỡng năng lượng cảnh báo `≤ 20%`, các mốc Trợ lý `15`, `30`, `60` phút, giờ kích hoạt Off-Work `17:00`) phải được tổ chức thành các biến hằng chung (`/src/types.ts` hoặc `/src/utils/constants.ts`) thay vì viết lặp nhiều lần dưới dạng text tự do.

### 4. Kiểm Soát Log Nhạy Cảm (Sensitive Security Logs)
- [ ] **Rò rỉ thông tin cá nhân (PII Protection):**
  - Tuyệt đối không gọi `console.log()` hoặc ghi nhật ký hệ thống chứa thông tin người dùng như: email, tên người dùng, token truy cập, nhật ký hành vi mang tính nhạy cảm tư nhân.
- [ ] **Xóa bỏ Debug Metadata:**
  - Trước khi commit, phải rà soát xóa hoặc vô hiệu hóa tất cả các hàm in vết tạm thời (`console.clear`, `console.dir`, `console.debug`). Chỉ cho phép sử dụng log ghi lỗi nghiệp vụ ở tầng máy chủ kèm theo bộ định danh chung không cá nhân hóa.

### 5. Khả Năng Kiểm Thử Rời Rạc / Hàm Thuần Túy (Pure Functions & Testability)
- [ ] **Tách biệt Logic và Giao diện (Logic-View Segregation):**
  - Các thuật toán tính điểm ưu tiên ma trận Eisenhower, phát hiện xung đột lịch trình, tính khung giờ Deep Work vàng phải được lập trình dưới dạng **Pure Functions** (Hàm thuần túy, không có tác dụng phụ) nằm trong thư viện tiện ích `/src/utils/*`.
  - Input đầu vào của các hàm này phải là dữ liệu đầu vào thuần túy (Mảng tasks, đối tượng lịch trình), output trả về trực tiếp kết quả tính toán nhằm tạo điều kiện dễ dàng viết Unit Test mà không cần dựng Virtual DOM hay mock React States.
- [ ] **Cô lập Side-effects ở useEffect:**
  - Tránh viết các logic thay đổi dữ liệu nối tiếp nhau bên trong một vòng lặp `useEffect` không kiểm soát để triệt tiêu lỗi lặp render vô tận (infinite render-loops).

### 6. Đáp Ứng Mục Tiêu Tâm Lý Core (Goal Alignment)
- [ ] **Chống tê liệt ý chí:** Gợi ý Trợ lý thời gian ngắn phải đưa ra lựa chọn tối giản (tối đa 2 tác vụ) để não bộ phản hồi nhanh nhất.
- [ ] **Gỡ bỏ lo lắng tích lũy:** Trạng thái "Off" sau khi đóng gói ngày phải cắt đứt hoàn toàn việc hiển thị số lượng "việc nợ chưa hoàn thành" ở tiêu đề chính nhằm bảo vệ chu kỳ nghỉ ngơi lành mạnh.

---

## Ⅱ. Danh Sách Kiểm Duyệt Chi Tiết Theo Tiêu Chí Nghiệm Thu (Acceptance Criteria Mappings)

### EPIC 1 — Hệ Thống Ưu Tiên Động

#### PB-1 — Tái cấu trúc lịch trình tự động
- [ ] **AC-PB1-01 (Phát hiện xung đột lịch):**
  - [ ] Khi lập lịch cho một công việc mới: Thuật toán kiểm tra giao thọc thời gian có hoạt động không? `[Start_Time_A < End_Time_B] && [Start_Time_B < End_Time_A]`.
  - [ ] Giao diện có hiển thị dòng chữ hoặc bảng cảnh báo *"Phát hiện xung đột lịch"* rõ ràng, trực quan ngay lập tức (`≤ 2 giây`) hay không?
  - [ ] Code có bọc bảo vệ khi một trong các task không có giờ bắt đầu/giờ kết thúc (tránh crash ứng dụng do so sánh giá trị undefined)?
- [ ] **AC-PB1-02 (Cung cấp giải pháp dời lịch):**
  - [ ] Hệ thống có đề xuất ít nhất 1 phương án dịch chuyển khung giờ khả thi (ví dụ: dời task bị ảnh hưởng xuống ngay sau task vừa chèn vào) mà không tạo ra xung đột dây chuyền khác hay không?
  - [ ] Thuật toán dời lịch là một hàm độc lập, có xử lý trường hợp dời lịch lọt qua ngày hôm sau nếu ngày hiện tại đã kín lịch hay không?
- [ ] **AC-PB1-03 & AC-PB1-04 (Xác nhận dời lịch):**
  - [ ] Nút "Xác nhận dời lịch" hoạt động đúng hành vi cập nhật tập hợp tasks.
  - [ ] Sau khi xác nhận, toàn bộ các thuộc tính giờ của danh sách tasks cập nhật đồng bộ lên giao diện và bảng lịch trình Scheduler mà không cần tải lại trang.
- [ ] **AC-PB1-05 (Bỏ qua & Điều chỉnh thủ công):**
  - [ ] Người dùng có thể nhấn từ chối dời lịch, tắt thông báo xung đột, và thực hiện sửa đổi giờ của task thủ công trên ô lịch trình hoặc form chỉnh sửa thông thường.

#### PB-1.1 — Phân loại Eisenhower & Mức năng lượng
- [ ] **AC-PB11-01 & AC-PB11-02 (Phân hệ Gán nhãn):**
  - [ ] Form tạo task và sửa task có chứa đầy đủ trường lựa chọn Ma trận Eisenhower (Q1, Q2, Q3, Q4) và Mức năng lượng (Cao, Trung bình, Thấp) dưới dạng tuyển chọn cố định (radio/select).
  - [ ] Trạng thái lưu trữ của từng task có giữ nguyên vẹn hai cấu trúc này trong `localStorage` sau khi lưu hay không?
- [ ] **AC-PB11-03 (Trực quan hóa Nhãn dữ liệu):**
  - [ ] Điểm nhận diện Eisenhower (Q1-Q4) và mức năng lượng được phong cách hóa bằng màu sắc chuyên biệt có độ tương phản cao, dễ đọc, bố trí gọn gàng trên từng thẻ task trong danh sách.
- [ ] **AC-PB11-04 (Cơ chế Lọc thông minh):**
  - [ ] Bộ lọc lọc theo Ma trận Eisenhower hoạt động độc lập hoặc lọc phối hợp (AND) song song với bộ lọc mức năng lượng mà không bị chồng chéo dữ liệu hay hiển thị sai lệch.
- [ ] **AC-PB11-05 (Gợi ý mặc định):**
  - [ ] Khi mở form tạo mới, giá trị mặc định cho Eisenhower (như Q2) và Năng lượng (như Trung bình) được tự động điền sẵn để tối thiểu hóa số thao tác nhấp chuột cho người dùng.

---

### EPIC 2 — Cơ Chế Đóng Gói (Closure)

#### PB-2 — Quy trình Kết thúc ngày (Off-Work)
- [ ] **AC-PB2-01 (Điều kiện xuất hiện nút):**
  - [ ] Nút "Kết thúc ngày" (hoặc "Off-Work Wizard") chỉ xuất hiện khi đáp ứng đúng 1 trong 2 điều kiện:
    - Thời gian hiện tại của hệ thống từ sau `17:00` hàng ngày.
    - Hoặc toàn bộ danh sách task trong ngày hiện tại đã chuyển sang trạng thái `DONE`.
  - [ ] Logic lấy thời gian thực hiện tại dùng hàm an toàn, tương thích múi giờ nội địa địa phương.
- [ ] **AC-PB2-02 (Bảng tóm tắt ngày):**
  - [ ] Giao diện hiển thị bảng tổng kết rõ ràng: Số lượng task hoàn thành, số lượng task dời lại, và highlight những task thuộc ô Q1/Q2 đã giải quyết xuất sắc dưới dạng khen ngợi.
- [ ] **AC-PB2-03 & AC-PB2-04 (Chế độ Không làm việc - "Off" mode):**
  - [ ] Sau khi nhấn xác nhận hoàn tất quy trình kết thúc ngày, toàn bộ hệ thống phải chuyển sang giao diện tĩnh lặng: hiển thị badge "OFF Mode" tinh tế.
  - [ ] Hệ thống loại bỏ việc hiển thị số lượng nhiệm vụ "nợ nần" dở dang hoặc chuyển giao diện sang chế độ xoa dịu tinh thần để giảm thiểu áp lực tâm lý.
- [ ] **AC-PB2-05 (Thoát chế độ "Off"):**
  - [ ] Cung cấp nút hoặc cơ chế trực quan để người dùng tắt chế độ Tĩnh Lặng và mở lại ngày làm việc bình thường bất kỳ lúc khi họ tự nguyện bắt đầu lại.

#### PB-2.1 — Tóm tắt và lên kế hoạch sáng hôm sau
- [ ] **AC-PB21-01 & AC-PB21-02 (Sắp xếp danh mục tồn đọng):**
  - [ ] Quy trình kết thúc ngày tự động quét và thu gom tất cả task đang dở dang ở trạng thái `TODO` và `IN_PROGRESS`.
  - [ ] Thuật toán sắp xếp danh sách tồn đọng này bám sát thứ tự ma trận Eisenhower: `Q1 → Q2 → Q3 → Q4`.
- [ ] **AC-PB21-03 (Chốt 5 tác vụ tiêu điểm):**
  - [ ] Cắt lát đề xuất tối đa đúng 5 task có mức ưu tiên cao nhất từ danh sách sắp xếp trên đưa vào khung lập kế hoạch cho sáng ngày mai.
- [ ] **AC-PB21-04 (Tùy chỉnh kế hoạch ngày mai):**
  - [ ] Người dùng hoàn toàn có quyền xóa bỏ bớt, thay đổi trật tự sắp xếp danh sách 5 việc này ngay trên cửa sổ kết thúc ngày trước khi nhấn nút "Xác nhận đóng gói ngày".

---

### EPIC 3 — Khớp Lệnh Năng Lượng

#### PB-3 — Nhận diện khung giờ hiệu suất cao (Peak Hours)
- [ ] **AC-PB3-01 (Hệ thống ghi vết ngầm):**
  - [ ] Mỗi khi một công việc được bấm chuyển trạng thái thành `DONE`, hệ thống tự động ghi nhận chính xác mốc thời gian hoàn thành công việc (`completedAt` timestamp) vào thuộc tính của task.
- [ ] **AC-PB3-02 & AC-PB3-03 (Giả lập dữ liệu & Tính toán khung giờ vàng):**
  - [ ] Thiết lập sẵn bộ dữ liệu lịch sử demo (giả lập hoàn thành task của 7 ngày trước đó) để người dùng có thể trải nghiệm tính năng này ngay lập tức.
  - [ ] Thuật toán phân tích phải tìm ra khoảng thời gian (theo khối giờ cụ thể như 09:00-11:00 hoặc 14:00-16:00) có mật độ hoàn thành tác vụ cao nhất để hiển thị đề xuất.
- [ ] **AC-PB3-04 (Ưu tiên khớp lệnh Deep Work):**
  - [ ] Luồng đề xuất khung giờ vàng Deep Work cho ngày mai tự động ghép các task thuộc diện Năng lượng = Cao kết hợp với phân nhóm Eisenhower = Q1 hoặc Q2 vào khung giờ hiệu quả này.
- [ ] **AC-PB3-05 (Minh bạch lý do):**
  - [ ] Hiển thị dòng phân tích giải thích cụ thể lý do đề xuất, ví dụ: *"Dựa trên lịch sử hiệu quả, bạn thường dứt điểm các tác vụ nặng tốt nhất vào lúc 09:00 - 11:00"*.

#### PB-3.1 — Quản lý ngân sách năng lượng
- [ ] **AC-PB31-01 (Giao diện hiển thị thanh năng lượng):**
  - [ ] Thanh năng lượng tinh thần được bố trí dễ thấy ở đầu trang, thể hiện tỷ lệ phần trăm trực quan từ `0%` đến `100%`.
- [ ] **AC-PB31-02 (Cơ chế tiêu thụ năng lượng thực tế):**
  - [ ] Khi người dùng hoàn thành một tác vụ có mức năng lượng được gán là "Cao" (`HIGH`), ngân sách năng lượng tinh thần trong ngày sụt giảm theo một lượng thích ứng (ví dụ: trừ `30%` mỗi task).
- [ ] **AC-PB31-03 (Cảnh báo chống kiệt sức):**
  - [ ] Khi ngân sách năng lượng đạt mức nguy khốn `≤ 20%`: Hệ thống hiển thị ngay thông điệp cảnh báo hữu ích kêu gọi người dùng nghỉ ngơi, uống nước hoặc chỉ chọn các tác vụ nhẹ nhàng.
- [ ] **AC-PB31-04 (Đặt lại - Reset năng lượng):**
  - [ ] Nút khôi phục năng lượng *"Tôi đã nghỉ ngơi/Nạp đầy năng lượng"* hoạt động bình thường, giúp đặt lại chỉ số năng lượng cơ bản về `100%` để tiếp tục chu trình làm việc mới.

---

### EPIC 4 — Trợ Lý Ra Quyết Định

#### PB-4 — Trợ lý tối ưu hóa khoảng trống thời gian
- [ ] **AC-PB4-01 (Khả năng truy cập cố định):**
  - [ ] Bảng điều khiển Trợ lý có hiển thị cố định các nút tiện ích nhanh tương ứng cho 3 mốc thời gian trống: **"Tôi có 15 phút"**, **"Tôi có 30 phút"**, và **"Tôi có 60 phút"** hay không?
- [ ] **AC-PB4-02 (Phản hồi tức thì):**
  - [ ] Thao tác bấm nút kích hoạt xử lý gợi ý đảm bảo mượt mà, thời gian phản hồi hiển thị kết quả từ phía hệ thống diễn ra trong `≤ 1 giây`.
- [ ] **AC-PB4-03 (Giới hạn đề xuất tinh gọn):**
  - [ ] Hệ thống chỉ hiển thị tối đa chuẩn xác `2 task` thỏa mãn thời lượng ước tính (`estimated_min`) nhỏ hơn hoặc bằng mốc thời gian rảnh được chọn tương ứng (15, 30, hoặc 60 phút).
- [ ] **AC-PB4-04 (Hàm xếp hạng ưu tiên):**
  - [ ] Kiểm tra cơ chế xếp hạng của trợ lý: Phải ưu tiên các task chưa hoàn thành có thời lượng phù hợp gần nhất với mốc thời gian chọn kết hợp xếp hạng theo chiều ma trận Eisenhower giảm dần (`Q1 > Q2 > Q3 > Q4`).
- [ ] **AC-PB4-05 (Fallback thông minh):**
  - [ ] Nếu bộ lọc không tìm ra task nào có thời lượng ước lượng đủ ngắn: Hệ thống hiển thị thông báo dịu mắt thông tin *"Không tìm thấy task ngắn..."* kèm theo nút tạo việc nhanh cho mốc thời gian tương ứng.
- [ ] **AC-PB4-06 (Báo danh trực tiếp & Cân nhắc hiển thị Portal):**
  - [ ] Người dùng phải bấm được nút kích hoạt trực tiếp trạng thái "Bắt đầu làm việc" (`IN_PROGRESS`) hoặc "Hoàn thành" trực tiếp trên cửa sổ gợi ý chỉ với 1 nhấp chuột.
  - [ ] **Quy tắc React Portal chống lỗi che khuất:** Kiểm tra kỹ xem Modal Gợi ý có được bao bọc và render thông qua `createPortal` gắn thẳng lên lớp `document.body` để loại bỏ dứt điểm lỗi nhấp nháy, lồng trang (render loop/Vite iframe nested layouts) hay không.

---

### EPIC 5 — Bản Đồ Tăng Trưởng

#### PB-5 — Bảng kiểm soát tiến bộ kỹ năng
- [ ] **AC-PB5-01 (Mô hình trực quan hóa bằng SVG):**
  - [ ] Biểu đồ thể hiện tỷ lệ % năng lực phân phối theo ba nhóm tác vụ chính: Làm việc (Work), Học tập (Learning), Admin hoạt động mượt mà, hiển thị rõ ràng, nét vẽ chuẩn bằng SVG hoặc thư viện d3/recharts.
- [ ] **AC-PB5-02 (Lọc theo lịch sử thời gian):**
  - [ ] Hệ thống tổng hợp dữ liệu theo tuần tuần hoàn và hỗ trợ chuyển đổi linh hoạt xem dữ liệu trong vòng ít nhất là 4 tuần gần nhất.
- [ ] **AC-PB5-03 (Chỉ báo tăng trưởng tương đối):**
  - [ ] Tính toán chính xác tỷ suất tăng tiến điểm kỹ năng so với tuần kề cận trước đó và hiển thị màu sắc biểu tượng trực quan (màu xanh cho tăng lên `%`, đỏ khi suy giảm hoặc giữ màu trung tính).
- [ ] **AC-PB5-04 (Tốc độ tải bảng):**
  - [ ] Bảng Growth Dashboard kết xuất giao diện trực quan hoàn tất trong vòng dưới `2 giây` dựa trên nguồn dữ liệu lưu trữ đã nạp trong ngày.

#### PB-5.1 — Tự động Time-boxing học tập
- [ ] **AC-PB51-01 (Quét khe hở lịch trình):**
  - [ ] Ứng dụng tự động tìm kiếm các khoảng thời gian trống kéo dài `≥ 20 phút` hiển thị trong biểu đồ lịch trình hàng ngày của người làm việc.
- [ ] **AC-PB51-02 (Chèn lịch phát triển bản thân):**
  - [ ] Gợi ý chèn đè các khoảng thời gian Học tập ngắn có nghĩa vào các slot trống này, với định hướng ưu tiên vào các buổi sáng tỉnh táo.
- [ ] **AC-PB51-03 (Hồi đáp nhanh của người dùng):**
  - [ ] Gửi đề xuất trực tiếp tới người dùng, họ có thể nhanh chóng nhấn *"Xác nhận"* (tự động điền đầy task vào ô lịch) hoặc *"Bỏ qua"* chỉ trong một lần chạm màn hình.
- [ ] **AC-PB51-04 (Chặn làm phiền):**
  - [ ] Nếu người dùng nhấn nút "Bỏ qua" gợi ý chèn học tập đủ 3 lần liên tiếp: Hệ thống tự động ghi nhận trạng thái và ngừng đưa ra lời khuyên mới trong cả khoảng thời gian còn lại của ngày hôm đó để bảo vệ không gian tự do trí óc của họ.

---

## Ⅲ. Danh Sách Kiểm Tra Phi Phiên Bản / Phi Chức Năng (Non-Functional Requirements Checklist)

- [ ] **Hiệu năng đáp ứng cực độ:**
  - `localStorage` truy xuất dữ liệu trung bình không gây trễ giao diện.
  - Thời gian render giao diện khi lọc và tìm kiếm gần như tức thời.
- [ ] **Độ an toàn dữ liệu nội địa:**
  - Không có dòng log rò rỉ mã nội bộ hay token mật.
  - Sử dụng cơ chế lưu trữ nội bộ sạch sẽ, an toàn khỏi sự can thiệp ngoài phiên làm việc.
- [ ] **Thích ứng hiển thị (Mobile responsive):**
  - Giao diện có tỷ lệ căn lề cân đối trên màn hình Desktop rộng lẫn màn hình thiết bị di động nhỏ hẹp dọc (`viewport: 375px`).
  - Các nút có vùng chạm tương tác tối thiểu từ `44px x 44px` trở lên.
- [ ] **Cân đối độ tương phản màu sắc (Accessibility):**
  - Tất cả các nhãn văn bản, đặc biệt là các nhãn mức năng lượng và các loại Ma trận ưu tiên Eisenhower, đạt tỷ lệ tương phản tối thiểu `>= 4.5:1` (theo chuẩn thiết kế dễ tiếp cận WCAG 2.1 AA) để bảo bọc đôi mắt cho người thường xuyên làm việc về đêm.
