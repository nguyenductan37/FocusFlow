# TEST_CHECKLIST.md — Danh sách Kiểm thử theo Acceptance Criteria

**Dự án:** FocusFlow  
**Phiên bản:** MVP v1.0  

**Ký hiệu trạng thái:**  
`[P]` Pass &nbsp;|&nbsp; `[F]` Fail &nbsp;|&nbsp; `[S]` Skip

---

## Sprint 1

### PB-4 — Trợ lý Ra quyết định "15 phút"

#### AC-PB4-01: Nút "Tôi có 15 phút" luôn hiển thị

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-01-1 | Nút hiển thị trên màn hình chính khi đã đăng nhập | UI | 1. Đăng nhập. 2. Vào màn hình Dashboard. | Nút "Tôi có 15 phút" hiển thị, không bị ẩn bởi bất kỳ element nào. | `[P]` |
| T-PB4-01-2 | Nút hiển thị khi không có task nào | UI | 1. Đăng nhập với tài khoản rỗng (0 task). 2. Vào Dashboard. | Nút vẫn hiển thị. | `[P]` |
| T-PB4-01-3 | Nút hiển thị trên mobile (viewport 375px) | Responsive | 1. Mở Chrome DevTools, set 375px. 2. Vào Dashboard. | Nút không bị cắt, đủ kích thước tap (≥ 44px). | `[P]` |

---

#### AC-PB4-02: Hệ thống phản hồi trong ≤ 1 giây

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-02-1 | Response time khi có task hợp lệ | Performance | 1. Có ≥ 3 task ≤ 15 phút. 2. Nhấn nút. 3. Đo thời gian từ click đến khi gợi ý xuất hiện. | Gợi ý xuất hiện trong ≤ 1000ms. | `[P]` |
| T-PB4-02-2 | Response time khi không có task hợp lệ | Performance | 1. Đảm bảo không có task ≤ 15 phút. 2. Nhấn nút. 3. Đo thời gian. | Thông báo "Không có task ngắn" xuất hiện trong ≤ 1000ms. | `[P]` |

---

#### AC-PB4-03: Hiển thị tối đa 2 task

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-03-1 | Có đúng 1 task ≤ 15 phút | Boundary | 1. Tạo 1 task với estimated_min = 10. 2. Nhấn nút. | Hiển thị đúng 1 task. | `[P]` |
| T-PB4-03-2 | Có đúng 2 task ≤ 15 phút | Normal | 1. Tạo 2 task ≤ 15 phút. 2. Nhấn nút. | Hiển thị đúng 2 task. | `[P]` |
| T-PB4-03-3 | Có ≥ 5 task ≤ 15 phút | Boundary | 1. Tạo 5 task ≤ 15 phút. 2. Nhấn nút. | **Chỉ hiển thị 2 task**, không hiển thị 3 hay nhiều hơn. | `[P]` |

---

#### AC-PB4-04: Thuật toán ưu tiên đúng

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-04-1 | Task Q1 được ưu tiên hơn Q2 | Algorithm | 1. Tạo task A: Q2, 10 phút. 2. Tạo task B: Q1, 12 phút. 3. Nhấn nút. | Task B (Q1) xuất hiện đầu tiên trong gợi ý. | `[P]` |
| T-PB4-04-2 | Khi cùng quadrant, task ngắn hơn được ưu tiên | Algorithm | 1. Tạo task A: Q1, 15 phút. 2. Tạo task B: Q1, 8 phút. 3. Nhấn nút. | Task B (8 phút) xuất hiện đầu tiên. | `[P]` |
| T-PB4-04-3 | Task DONE không được gợi ý | Filter | 1. Tạo task A: Q1, 5 phút, status=DONE. 2. Tạo task B: Q3, 10 phút, status=TODO. 3. Nhấn nút. | Chỉ hiển thị task B. | `[P]` |

---

#### AC-PB4-05: Fallback khi không có task ngắn

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-05-1 | Không có task ≤ 15 phút | Edge case | 1. Chỉ có task với estimated_min ≥ 30. 2. Nhấn nút. | Hiển thị thông báo "Không có task ngắn" và nút "Tạo task mới". | `[P]` |
| T-PB4-05-2 | Không có task nào | Edge case | 1. Xóa hết task. 2. Nhấn nút. | Hiển thị thông báo "Không có task ngắn" và nút "Tạo task mới". | `[P]` |

---

#### AC-PB4-06: Bắt đầu task từ màn hình gợi ý

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB4-06-1 | Tap/click task để bắt đầu | UX | 1. Nhấn nút "Tôi có 15 phút". 2. Nhấn vào task gợi ý. | Task chuyển sang trạng thái IN_PROGRESS ngay lập tức, không cần thao tác thêm. | `[P]` |
| T-PB4-06-2 | Task không mất khỏi danh sách nếu không bắt đầu | UX | 1. Mở gợi ý. 2. Đóng modal không nhấn gì. 3. Mở lại gợi ý. | Task vẫn xuất hiện trong gợi ý lần sau. | `[P]` |

---

### PB-1.1 — Phân loại Eisenhower & Mức năng lượng

#### AC-PB11-01 & AC-PB11-02: Gán nhãn task

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB11-01-1 | Gán Q1 cho task | UI | 1. Tạo task mới. 2. Chọn "Q1 — Quan trọng & Khẩn cấp". 3. Lưu. | Task hiển thị nhãn Q1 trong danh sách. | `[P]` |
| T-PB11-01-2 | Thay đổi quadrant sau khi tạo | Edit | 1. Tạo task với Q2. 2. Vào chi tiết task. 3. Đổi sang Q3. 4. Lưu. | Task cập nhật nhãn Q3 ngay lập tức. | `[P]` |
| T-PB11-02-1 | Gán mức năng lượng "Cao" | UI | 1. Mở form task. 2. Chọn mức năng lượng "Cao". 3. Lưu. | Task hiển thị icon/nhãn năng lượng Cao. | `[P]` |
| T-PB11-02-2 | Không thể gán 2 mức năng lượng cùng lúc | Validation | 1. Mở form task. 2. Thử chọn cả "Cao" và "Trung". | Chỉ 1 lựa chọn được active. Radio button behavior. | `[P]` |

---

#### AC-PB11-03: Nhãn hiển thị rõ trong danh sách

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB11-03-1 | Nhãn hiển thị trong Task List | UI | 1. Tạo task với Q2, năng lượng Trung. 2. Xem danh sách task. | Nhãn Q2 và icon năng lượng Trung hiển thị mà không cần mở chi tiết. | `[P]` |
| T-PB11-03-2 | Task không có nhãn vẫn hiển thị bình thường | UI | 1. Tạo task không gán nhãn. 2. Xem danh sách. | Task hiển thị không có nhãn, không bị lỗi UI. | `[P]` |

---

#### AC-PB11-04: Lọc theo nhãn

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB11-04-1 | Lọc theo Q1 | Filter | 1. Có task Q1, Q2, Q3. 2. Kích hoạt filter Q1. | Chỉ hiển thị task Q1. | `[P]` |
| T-PB11-04-2 | Lọc kết hợp Q2 + Năng lượng Cao | Filter | 1. Có nhiều task với nhãn khác nhau. 2. Filter Q2 VÀ Năng lượng Cao. | Chỉ hiển thị task thỏa mãn cả 2 điều kiện. | `[P]` |
| T-PB11-04-3 | Xóa filter hiển thị lại toàn bộ | Filter | 1. Đang áp dụng filter. 2. Nhấn "Xóa filter". | Toàn bộ task hiển thị lại. | `[P]` |

---

#### AC-PB11-05: Giá trị mặc định khi tạo task

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB11-05-1 | Tạo task không chọn nhãn vẫn thành công | Validation | 1. Mở form tạo task. 2. Chỉ nhập title. 3. Lưu. | Task được tạo thành công, không báo lỗi bắt buộc nhập nhãn. | `[P]` |
| T-PB11-05-2 | Form gợi ý giá trị mặc định | UX | 1. Mở form tạo task mới. | Trường Eisenhower và Năng lượng có placeholder hoặc giá trị mặc định được chọn sẵn (ví dụ: Q2, Trung). | `[P]` |

---

## Sprint 2

### PB-1 — Tái cấu trúc lịch trình tự động

#### AC-PB1-01: Phát hiện xung đột trong ≤ 2 giây

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB1-01-1 | Task mới trùng hoàn toàn giờ task cũ | Normal | 1. Có task A: 9:00–10:00. 2. Thêm task B: 9:00–10:00. 3. Đo thời gian hiển thị cảnh báo. | Cảnh báo "Phát hiện xung đột lịch" xuất hiện trong ≤ 2 giây. | `[P]` |
| T-PB1-01-2 | Task mới chồng một phần giờ task cũ | Edge case | 1. Có task A: 9:00–10:00. 2. Thêm task B: 9:30–10:30. | Cảnh báo xuất hiện. | `[P]` |
| T-PB1-01-3 | Task mới không trùng giờ nào | Negative | 1. Có task A: 9:00–10:00. 2. Thêm task B: 10:00–11:00. | Không có cảnh báo xung đột. | `[P]` |

---

#### AC-PB1-02 & AC-PB1-03: Gợi ý và xác nhận dời lịch

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB1-02-1 | Gợi ý có slot khả thi | Algorithm | 1. Gây xung đột. 2. Xem gợi ý. | Gợi ý hiển thị ít nhất 1 slot dời lịch hợp lý (có đủ thời gian trống). | `[P]` |
| T-PB1-02-2 | Không còn slot khả thi trong ngày | Edge case | 1. Lịch đầy kín. 2. Gây xung đột. | Thông báo "Không tìm được slot phù hợp hôm nay" và gợi ý dời sang ngày mai. | `[P]` |
| T-PB1-03-1 | Nhấn "Xác nhận" áp dụng gợi ý | UX | 1. Xem gợi ý. 2. Nhấn "Xác nhận". | Lịch được cập nhật theo gợi ý, cảnh báo đóng lại. | `[P]` |

---

#### AC-PB1-04 & AC-PB1-05: Sau xác nhận và điều chỉnh thủ công

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB1-04-1 | Lịch không còn xung đột sau xác nhận | Verification | 1. Xác nhận gợi ý. 2. Xem lịch ngày. | Không còn task nào bị chồng chéo thời gian. | `[P]` |
| T-PB1-05-1 | Từ chối gợi ý và điều chỉnh thủ công | UX | 1. Xem gợi ý. 2. Nhấn "Bỏ qua". 3. Kéo-thả/chỉnh giờ task sang slot khác. | Gợi ý đóng lại; người dùng có thể tự điều chỉnh; thay đổi thủ công được lưu. | `[P]` |

---

## Sprint 3

### PB-2 — Quy trình Kết thúc ngày

#### AC-PB2-01: Nút "Kết thúc ngày" xuất hiện đúng lúc

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB2-01-1 | Hiển thị sau 17:00 | Time-based | 1. Thay đổi thiết lập giờ giả lập thành 17:01. | Nút "Kết thúc ngày" hiển thị. | `[P]` |
| T-PB2-01-2 | Hiển thị khi hoàn thành tất cả task | Trigger | 1. Có 3 task trong ngày. 2. Đánh dấu cả 3 là DONE. | Nút "Kết thúc ngày" xuất hiện dù chưa 17:00. | `[P]` |
| T-PB2-01-3 | Không hiển thị trước 17:00 khi còn task | Negative | 1. Giờ là 15:00. 2. Vẫn còn task chưa xong. | Nút không xuất hiện. | `[P]` |

---

#### AC-PB2-02 & AC-PB2-03: Màn hình tóm tắt và trạng thái Off

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB2-02-1 | Tóm tắt hiển thị đúng số task | Data | 1. Hoàn thành 4 task, dời 2 task. 2. Nhấn "Kết thúc ngày". | Màn hình tóm tắt hiển thị: "4 task hoàn thành, 2 task dời lại". | `[P]` |
| T-PB2-02-2 | Highlight thành tích nổi bật | UX | 1. Có ít nhất 1 task Q1 được hoàn thành. 2. Mở tóm tắt. | Task Q1 được highlight hoặc mention đặc biệt. | `[P]` |
| R-05 | Khóa thông báo / Badge Off | Functional | 1. Xác nhận kết thúc ngày. 2. Kích hoạt trạng thái Off. | Hiển thị badge OFF xinh xắn trên thanh tiêu đề và ẩn dời mốc thông báo công việc. | `[P]` |

---

## Sprint 4 & Sprint 5

### PB-5 — Dashboard Tiến bộ Kỹ năng & Khung giờ Deep Work

| # | Test Case | Loại | Bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|-----------|------|----------------|------------------|-----------|
| T-PB5-01-1 | Biểu đồ % thời gian | Data Viz | 1. Xem tab Dashboard Growth. | Hiển thị biểu đồ phân bố giờ Làm việc / Học tập / Admin trực quan dạng SVG tuyệt vời. | `[P]` |
| T-PB3-02-2 | Nhận diện giờ Deep Work | Logic | 1. Bấm nút giả lập dữ liệu lịch sử hoặc tự hoàn thành task. | Hệ thống phân tích nhanh và rút ra mốc Deep Work khuyên dùng của người dùng. | `[P]` |
| T-PB31-01-1 | Ngân sách năng lượng hoạt động | Logic | 1. Hoàn thành task khó hoặc nhấn "Tôi đã nghỉ ngơi". | Thanh phần trăm phản hồi tức thời từ 0-100%, có thông báo khuyên nghỉ khi xuống dưới 20%. | `[P]` |
