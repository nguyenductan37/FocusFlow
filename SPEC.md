# SPEC.md — Product Requirements & Acceptance Criteria

**Dự án:** FocusFlow  
**Phiên bản:** MVP v1.0  
**Cập nhật lần cuối:** 2026-06  

---

## Mục lục

1. [Tổng quan Hệ thống](#1-tổng quan-hệ-thống)
2. [Epic 1 — Hệ thống Ưu tiên Động](#2-epic-1--hệ-thống-ưu-tiên-động)
3. [Epic 2 — Cơ chế Đóng gói (Closure)](#3-epic-2--cơ-chế-đóng-gói-closure)
4. [Epic 3 — Khớp lệnh Năng lượng](#4-epic-3--khớp-lệnh-năng lượng)
5. [Epic 4 — Trợ lý Ra quyết định](#5-epic-4--trợ-lý-ra-quyết-định)
6. [Epic 5 — Bản đồ Tăng trưởng](#6-epic-5--bản-đồ-tăng-trưởng)
7. [Non-Functional Requirements](#7-non-functional-requirements)

---

## 1. Tổng quan Hệ thống

### 1.1 Mục đích

FocusFlow giải quyết ba nỗi đau tâm lý cốt lõi:

1. **Tê liệt ra quyết định** — Không biết nên làm việc gì bây giờ
2. **Lo lắng tích lũy** — Cảm giác luôn còn việc chưa xong, kể cả ngoài giờ làm
3. **Lãng phí tiềm năng** — Không tận dụng được khoảng thời gian nhỏ và không thấy được sự tiến bộ

### 1.2 Định nghĩa trạng thái công việc

| Trạng thái | Mô tả |
|-----------|-------|
| `TODO` | Chưa bắt đầu |
| `IN_PROGRESS` | Đang thực hiện |
| `BLOCKED` | Bị chặn bởi yếu tố bên ngoài |
| `DONE` | Hoàn thành |
| `DEFERRED` | Dời sang ngày khác |

### 1.3 Định nghĩa mức độ ưu tiên

- **Ô Eisenhower:** Quan trọng-Khẩn cấp (Q1), Quan trọng-Không khẩn cấp (Q2), Không quan trọng-Khẩn cấp (Q3), Không quan trọng-Không khẩn cấp (Q4)
- **Mức năng lượng:** Cao (Deep Work), Trung bình (Shallow Work), Thấp (Admin)

---

## 2. Epic 1 — Hệ thống Ưu tiên Động

> *Giúp người dùng luôn có một danh sách nhiệm vụ được ưu tiên chính xác, kể cả khi kế hoạch thay đổi.*

---

### PB-1 — Tái cấu trúc lịch trình tự động

**User Story:**  
> Là người dùng, tôi muốn hệ thống tự động tái cấu trúc lịch trình khi có sự kiện đột xuất, để tôi không bị mất kiểm soát khi kế hoạch thay đổi.

**Độ ưu tiên:** Cao | **Story Points:** 8 | **Sprint:** 2

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB1-01 | Khi một task mới được thêm vào và trùng giờ với task hiện tại, hệ thống hiển thị cảnh báo "Phát hiện xung đột lịch" trong ≤ 2 giây. | Hoàn thành |
| AC-PB1-02 | Hệ thống gợi ý ít nhất 1 phương án dời lịch khả thi cho task bị xung đột. | Hoàn thành |
| AC-PB1-03 | Người dùng có thể nhấn nút "Xác nhận" để áp dụng phương án gợi ý. | Hoàn thành |
| AC-PB1-04 | Sau khi xác nhận, lịch được cập nhật và không còn xung đột nào trong ngày. | Hoàn thành |
| AC-PB1-05 | Người dùng có thể từ chối gợi ý và tự điều chỉnh lịch thủ công. | Hoàn thành |

**Value:** Giảm Stress, duy trì sự chủ động trong môi trường nhiễu loạn.

---

### PB-1.1 — Phân loại Eisenhower & Mức năng lượng

**User Story:**  
> Là người dùng, tôi muốn hệ thống phân loại công việc theo Ma trận Eisenhower kết hợp mức năng lượng cần thiết, để tôi không chọn nhầm việc khó vào lúc mệt mỏi.

**Độ ưu tiên:** Cao | **Story Points:** 5 | **Sprint:** 1

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB11-01 | Mỗi task có thể được gán vào đúng 1 trong 4 ô Eisenhower (Q1/Q2/Q3/Q4). | Hoàn thành |
| AC-PB11-02 | Mỗi task có thể được gán 1 trong 3 mức năng lượng: Cao / Trung / Thấp. | Hoàn thành |
| AC-PB11-03 | Nhãn Eisenhower và mức năng lượng hiển thị rõ ràng trong danh sách task. | Hoàn thành |
| AC-PB11-04 | Người dùng có thể lọc danh sách task theo ô Eisenhower và/hoặc mức năng lượng. | Hoàn thành |
| AC-PB11-05 | Khi tạo task mới, hệ thống không bắt buộc nhập nhãn nhưng gợi ý giá trị mặc định. | Hoàn thành |

**Value:** Tối ưu hóa hiệu suất, tránh kiệt sức.

---

## 3. Epic 2 — Cơ chế Đóng gói (Closure)

> *Tạo ranh giới tâm lý rõ ràng giữa giờ làm và giờ nghỉ.*

---

### PB-2 — Quy trình Kết thúc ngày

**User Story:**  
> Là người dùng, tôi muốn có một quy trình "Kết thúc ngày" tự động, để tâm trí tôi được giải tỏa khỏi công việc khi rời văn phòng.

**Độ ưu tiên:** Cao | **Story Points:** 3 | **Sprint:** 3

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB2-01 | Nút "Kết thúc ngày" hiển thị cố định sau 17:00 hoặc khi người dùng hoàn thành tất cả task trong ngày. | Hoàn thành |
| AC-PB2-02 | Nhấn "Kết thúc ngày" hiển thị màn hình tóm tắt: số task hoàn thành, số task dời lại, highlight thành tích nổi bật. | Hoàn thành |
| AC-PB2-03 | Sau khi xác nhận tóm tắt, hệ thống chuyển sang trạng thái "Off" — tắt toàn bộ thông báo công việc. | Hoàn thành |
| AC-PB2-04 | Trạng thái "Off" được hiển thị rõ ràng trên giao diện (badge/icon đặc biệt). | Hoàn thành |
| AC-PB2-05 | Người dùng có thể thoát trạng thái "Off" thủ công bất kỳ lúc nào. | Hoàn thành |

**Value:** Ngắt kết nối tâm lý, xóa bỏ "nợ tâm lý".

---

### PB-2.1 — Tóm tắt và lên kế hoạch sáng hôm sau

**User Story:**  
> Là người dùng, tôi muốn hệ thống tóm tắt các việc tồn đọng và tự động đề xuất ưu tiên cho sáng hôm sau, để tôi không phải suy nghĩ về việc "phải làm gì" khi vừa ngủ dậy.

**Độ ưu tiên:** Trung | **Story Points:** 3 | **Sprint:** 3

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB21-01 | Khi kết thúc ngày, hệ thống tự động liệt kê toàn bộ task có trạng thái `TODO` và `IN_PROGRESS` chưa hoàn thành. | Hoàn thành |
| AC-PB21-02 | Danh sách task tồn đọng được sắp xếp theo thứ tự ưu tiên: Q1 → Q2 → Q3 → Q4. | Hoàn thành |
| AC-PB21-03 | Màn hình "Kế hoạch ngày mai" hiển thị tối đa 5 task ưu tiên cao nhất cho ngày hôm sau. | Hoàn thành |
| AC-PB21-04 | Người dùng có thể chỉnh sửa thứ tự hoặc loại bỏ task khỏi danh sách đề xuất trước khi xác nhận. | Hoàn thành |

**Value:** Bắt đầu ngày mới với định hướng rõ ràng.

---

## 4. Epic 3 — Khớp lệnh Năng lượng

> *Tối ưu hóa hiệu suất bằng cách khớp nhiệm vụ với chu kỳ năng lượng cá nhân.*

---

### PB-3 — Nhận diện khung giờ hiệu suất cao

**User Story:**  
> Là người dùng, tôi muốn hệ thống nhận diện khung giờ hiệu suất cao nhất của mình, để nó đề xuất thực hiện các công việc khó (Deep Work) vào thời điểm tôi tỉnh táo nhất.

**Độ ưu tiên:** Cao | **Story Points:** 13 | **Sprint:** 5

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB3-01 | Hệ thống ghi nhận timestamp hoàn thành của mỗi task (ngầm, không yêu cầu thao tác thêm từ người dùng). | Hoàn thành |
| AC-PB3-02 | Sau khi có ≥ 7 ngày dữ liệu, hệ thống tính toán khung giờ hoàn thành task nhiều nhất. (Phát triển: cho phép demo với dữ liệu giả lập có sẵn tiện lợi, kèm theo ghi nhân thực tế). | Hoàn thành |
| AC-PB3-03 | Hệ thống gợi ý ít nhất 1 khung giờ "Deep Work" được đề xuất cho ngày hôm sau. | Hoàn thành |
| AC-PB3-04 | Gợi ý Deep Work ưu tiên các task có mức năng lượng = Cao và ô Eisenhower = Q1 hoặc Q2. | Hoàn thành |
| AC-PB3-05 | Người dùng có thể xem lý do gợi ý ("Bạn thường làm tốt nhất lúc 9:00–11:00"). | Hoàn thành |

**Value:** Tăng chất lượng đầu ra công việc (Deep Work).

---

### PB-3.1 — Hiển thị ngân sách năng lượng

**User Story:**  
> Là người dùng, tôi muốn hệ thống đo lường và hiển thị "ngân sách năng lượng" còn lại trong ngày, để tôi biết khi nào nên dừng lại hoặc giảm cường độ.

**Độ ưu tiên:** Trung | **Story Points:** 5 | **Sprint:** 5

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB31-01 | Thanh "Ngân sách Năng lượng" hiển thị ở header/sidebar, thể hiện % năng lượng còn lại (0–100%). | Hoàn thành |
| AC-PB31-02 | Mức năng lượng giảm theo số task Cao đã hoàn thành trong ngày theo công thức có thể cấu hình. | Hoàn thành |
| AC-PB31-03 | Khi năng lượng ≤ 20%, hệ thống hiển thị thông báo "Khuyên bạn nghỉ ngơi hoặc chuyển sang task nhẹ hơn". | Hoàn thành |
| AC-PB31-04 | Người dùng có thể reset ngân sách năng lượng sau khi ghi nhận đã nghỉ ngơi. | Hoàn thành |

**Value:** Bảo vệ sức khỏe tinh thần bền vững.

---

## 5. Epic 4 — Trợ lý Ra quyết định

> *Loại bỏ hoàn toàn trạng thái tê liệt khi có khoảng thời gian ngắn.*

---

### PB-4 — Gợi ý "Việc 15 phút"

**User Story:**  
> Là người dùng, khi có khoảng trống thời gian bất ngờ (15–30 phút), tôi muốn hệ thống chỉ hiển thị 1–2 nhiệm vụ phù hợp nhất, để tôi không lãng phí thời gian vào việc lướt điện thoại.

**Độ ưu tiên:** Cao | **Story Points:** 5 | **Sprint:** 1

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB4-01 | Nút "Tôi có 15 phút" hiển thị cố định và luôn truy cập được từ màn hình chính. | Hoàn thành |
| AC-PB4-02 | Nhấn nút, hệ thống hiển thị gợi ý trong ≤ 1 giây. | Hoàn thành |
| AC-PB4-03 | Chỉ hiển thị tối đa 2 task có thời lượng ước tính ≤ 15 phút. | Hoàn thành |
| AC-PB4-04 | Thuật toán ưu tiên task có thời lượng ngắn nhất + ô Eisenhower cao nhất (Q1 > Q2 > Q3 > Q4). | Hoàn thành |
| AC-PB4-05 | Nếu không có task nào ≤ 15 phút, hiển thị thông báo "Không có task ngắn — thêm task mới?" kèm nút tạo nhanh. | Hoàn thành |
| AC-PB4-06 | Người dùng có thể bắt đầu task ngay từ màn hình gợi ý (1 tap/click). | Hoàn thành |

**Value:** Loại bỏ sự tê liệt, tối đa hóa thời gian chết.

---

## 6. Epic 5 — Bản đồ Tăng trưởng

> *Biến công việc hàng ngày thành bằng chứng của sự phát triển.*

---

### PB-5 — Dashboard Tiến bộ Kỹ năng

**User Story:**  
> Là người dùng, tôi muốn hệ thống trực quan hóa sự tiến bộ trong kỹ năng chuyên môn, để tôi thấy được sự cân bằng giữa làm việc và học tập.

**Độ ưu tiên:** Thấp | **Story Points:** 8 | **Sprint:** 4

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB5-01 | Dashboard hiển thị biểu đồ tỷ lệ % thời gian theo danh mục: Làm việc / Học tập / Admin. | Hoàn thành |
| AC-PB5-02 | Dữ liệu được tổng hợp theo tuần và có thể xem lịch sử 4 tuần gần nhất. | Hoàn thành |
| AC-PB5-03 | Chỉ số "Điểm tiến bộ kỹ năng" tuần này được so sánh với tuần trước (tăng/giảm %). | Hoàn thành |
| AC-PB5-04 | Dashboard load trong ≤ 2 giây với dữ liệu thực. | Hoàn thành |

**Value:** Giảm lo âu, tạo động lực phát triển bản thân.

---

### PB-5.1 — Time-boxing học tập tự động

**User Story:**  
> Là người dùng, tôi muốn hệ thống tự động chèn các khoảng thời gian học tập ngắn vào lịch trình hàng ngày, để việc phát triển bản thân trở thành một thói quen tự nhiên.

**Độ ưu tiên:** Trung | **Story Points:** 5 | **Sprint:** 4

**Acceptance Criteria:**

| ID | Tiêu chí | Trạng thái |
|----|----------|:---:|
| AC-PB51-01 | Hệ thống tự động phát hiện khoảng trống ≥ 20 phút trong lịch ngày. | Hoàn thành |
| AC-PB51-02 | Hệ thống đề xuất chèn 1 task "Học tập" vào khoảng trống phù hợp nhất (ưu tiên giờ buổi sáng). | Hoàn thành |
| AC-PB51-03 | Người dùng nhận thông báo gợi ý và có thể "Xác nhận" hoặc "Bỏ qua" trong 1 tap/click. | Hoàn thành |
| AC-PB51-04 | Nếu người dùng bỏ qua 3 lần liên tiếp, hệ thống không gợi ý thêm trong ngày đó. | Hoàn thành |

**Value:** Hình thành thói quen bền vững.

---

## 7. Non-Functional Requirements

| NFR | Yêu cầu |
|-----|---------|
| **Hiệu năng** | API response ≤ 300ms (p95); Trang load ≤ 2 giây trên 4G |
| **Khả dụng** | Uptime ≥ 99.5% trong giờ cao điểm (7:00–22:00) |
| **Bảo mật** | Xác thực JWT, mã hóa dữ liệu cá nhân at-rest (AES-256) |
| **Khả năng mở rộng** | Hỗ trợ ≤ 1,000 người dùng đồng thời ở MVP |
| **Tương thích** | Chrome, Safari, Firefox (2 phiên bản mới nhất); Mobile-responsive |
| **Accessibility** | WCAG 2.1 AA — Contrast ratio ≥ 4.5:1 |
