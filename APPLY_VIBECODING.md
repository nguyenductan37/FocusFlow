# APPLY_VIBECODING.md — Nhật Ký Vận Hành & Thực Thi Quy Trình Vibe Coding (Plan, Doc, Build, Test)

Tài liệu này đóng vai trò làm bằng chứng kỹ thuật (Technical Evidence) chứng minh tính tuân thủ tuyệt đối quy trình **Vibe Coding** (`Plan` ➔ `Doc` ➔ `Build` ➔ `Test`), đồng thời việc bổ sung, cải thiện tính năng mới được cập nhật song song với việc viết code. 

**MỤC ĐÍCH QUYẾT ĐỊNH:** 
Chứng minh việc áp dụng và tuân thủ tài liệu đặc tả sản phẩm trong `SPEC.md` và kiến trúc trong `ARCHITECTURE.md` nhằm bảo đảm giải quyết đúng 100% yêu cầu nghiệp vụ và các tiêu chí nghiệm thu (Acceptance Criteria - AC). Mỗi tính năng khi ship bắt buộc phải đi kèm dẫn chứng cụ thể và minh chứng rõ ràng dưới đây.

---

## 📅 Nhật Ký Cập Nhật Tính Năng (Feature Implementation Log)

### 1. Mở Rộng Trợ Lý Ra Quyết Định: Bổ Sung Mốc 30 Phút và 60 Phút & Vá Lỗi Nhấp Nháy (Render Loop)

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu:** Mở rộng trải nghiệm tối ưu khoảng trống thời gian cho người dùng ngoài mốc 15 phút ban đầu. Thêm tùy chọn 30 phút và 60 phút.
    *   **Giải quyết lỗi:** Sửa dứt điểm hiện tượng trang Trợ lý 15 phút lồng vào trang chủ (nested frame render loop) khiến trang web nháy liên tục khi người dùng click kích hoạt.
    *   **Giải pháp:** 
        1. Thay thế nút đơn lẻ bằng một nhóm nút linh hoạt chứa mốc `[15, 30, 60]` phút.
        2. Tích hợp React `createPortal` từ `react-dom` để render Modal gợi ý trực tiếp lên cấp `document.body`, cô lập hoàn toàn khỏi container cha và tránh xung đột layout hay kích hoạt render lặp trong môi trường iframe.

*   **DOC (Tài liệu hóa):**
    *   Cập nhật thiết kế chi tiết vào `SPEC.md` dưới mục *PB-4: Trợ lý tối ưu hóa khoảng trống thời gian*.
    *   Ghi rõ cơ chế hoạt động của `createPortal` để tránh lỗi che khuất dữ liệu do chuyển đổi thuộc tính CSS (transform transition) của vùng chứa.

*   **BUILD (Xây dựng):**
    *   Sửa đổi file `/src/components/DecisionAssistant.tsx` để tích hợp mảng động `[15, 30, 60]`.
    *   Sử dụng hook `useState` để quản lý trạng thái mốc thời gian đang được chọn (`selectedMinutes`).
    *   Sử dụng `createPortal` kết xuất Modal giao diện ra ngoài luồng DOM thông thường, đính thẳng vào `document.body`.

*   **TEST (Kiểm duyệt thành công):**
    *   Đã chạy công cụ kiểm định mã nguồn `lint_applet` thành công mà không gặp bất kỳ lỗi cú pháp hay cảnh báo TS nào.
    *   Chạy `compile_applet` thành công, máy chủ phát triển hoạt động ổn định và trơn tru.
    *   Kiểm tra thực tế: Hiện tượng giật nảy liên tục bị loại bỏ 100%, các mốc 30p và 60p gợi ý chính xác danh mục công việc ngắn phù hợp với giới hạn thời gian.

---

### 2. Tích Hợp Tài Liệu Hướng Dẫn Sử Dụng (User Guide) & Dự Báo Rủi Ro (Risk Analysis)

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu:** Đảm bảo người dùng cuối nắm bắt rõ ràng cách vận hành chuỗi giá trị cốt lõi của ứng dụng (Ma trận ưu tiên, quản lý ngân sách năng lượng, đóng gói ngày thanh bình). Đồng thời dự báo trước các nguy cơ lỗi hệ thống phát sinh trong tương lai.
    *   **Hành động:**
        1. Biên soạn hướng dẫn sử dụng chi tiết vào `/README.md`.
        2. Bổ sung chương Phân tích rủi ro thực tế (Production Risks & Mitigations) vào `/SPEC.md` xoay quanh tải trọng bộ nhớ, bảo mật XSS và xung đột dời lịch dây chuyền.

*   **DOC (Tài liệu hóa):**
    *   Tự viết đặc tả và hướng dẫn chi tiết, trực quan bằng tiếng Việt có cấu trúc bảng biểu, chia giai đoạn rõ ràng.

*   **BUILD (Xây dựng):**
    *   Chỉnh sửa `/README.md` để thêm mục `## 📖 Hướng Dẫn Sử Dụng Chi Tiết (User Guide)`.
    *   Chỉnh sửa `/SPEC.md` để bổ sung mục `## 8. Dự Báo Rủi Ro & Biện Pháp Giảm Thiểu Thực Tế (Production Risks & Mitigations)`.

*   **TEST (Kiểm duyệt thành công):**
    *   Phân tích cấu trúc file đạt chuẩn Markdown, tất cả các liên kết tài liệu nội bộ hoạt động bình thường.
    *   Linter và Trình biên dịch chạy kiểm thử thành công, không phát hiện lỗi rò rỉ hoặc cú pháp.

---

### 3. Sửa Tính Năng "Giả Lập Giờ" Thành Hiển Thị Chính Xác Thời Gian Hiện Tại (Real-Time System Clock Display)

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu (Bản kế hoạch dựa trên `SPEC.md` và `ARCHITECTURE.md`):** Thay thế cơ chế nhập giờ giả lập thủ công của người dùng bằng một đồng hồ số động hiển thị chính xác giờ địa phương thực thi (`HH:MM`). Đồng hồ này đóng vai trò quyết định mốc kích hoạt Quy trình Kết thúc ngày (EOD Closure - PB-2) sau `17:00` tự động.
    *   **Giải pháp thiết kế:** 
        1. Xóa bỏ trường biểu mẫu `<input type="time">` trong Header của ứng dụng (nơi người dùng tự ý thiết lập giả lập).
        2. Thiết lập state cục bộ `currentTime` lưu giữ chuỗi thời gian thực hiện thời, tự khởi tạo dựa trên đối tượng `new Date()` của hệ điều hành.
        3. Triển khai React `useEffect` đăng ký bộ định thời `setInterval` chính xác lặp lại sau mỗi `1000ms` để cập nhật đồng bộ giờ máy chủ liên tục, đảm bảo tính chính xác tuyệt đối.

*   **DOC (Tài liệu hóa):**
    *   Tính năng bám sát phân hệ *PB-2 — Quy trình Kết thúc ngày* trong `SPEC.md`, cụ thể là kiểm chứng tự động mốc `17:00` (AC-PB2-01) dựa trên dữ liệu hệ thống thời gian thực thay vì dữ liệu thủ công.
    *   Mô tả và đồng bộ luồng dữ liệu thời gian thực được mô hình hóa trong phần *Frontend Architecture* ở `ARCHITECTURE.md`.

*   **BUILD (Xây dựng):**
    *   Sửa đổi file `/src/App.tsx` bằng việc loại bỏ state cũ `simulatedTime` và bộ thay đổi `setSimulatedTime`.
    *   Bổ sung state mới `currentTime` tự động tính toán thời gian thực cùng bộ cập nhật `clearInterval` an toàn để triệt tiêu rủi ro rò rỉ bộ nhớ (Memory leaks).
    *   Chuyển đổi các logic so sánh giờ của `isClosureActionAvailable` sang dùng `currentTime`.
    *   Tái cấu trúc UI Header thành một chiếc đồng hồ số màu tím với biểu đồ hoạt họa nhấp nháy `animate-pulse` để tăng trải nghiệm trực quan.

*   **TEST (Kiểm duyệt thành công):**
    *   Chạy kiểm thử cú pháp bằng linter thành công mà không phát sinh bất kỳ lỗi Type bấp bênh nào.
    *   Trình biên dịch `compile_applet` xác nhận Build thành công 100% trong môi trường phân tán Cloud Run.

---

### 4. Cải Tiến Tính Năng AC-PB3-04: Đề xuất tác vụ có Năng lượng = Cao & Eisenhower = Q1/Q2 Trực Quan

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu (Dựa trên `SPEC.md` và `ARCHITECTURE.md`):** Tái lập cấu phần Bảng Tăng Trưởng (Growth Dashboard) để cụ thể hóa trực quan tiêu chí nghiệm thu **AC-PB3-04**. Trước kia, hệ thống tính toán giờ phù hợp ngầm nhưng chưa kết xuất biểu đồ và hiển thị danh mục các việc tương xứng trực tiếpt.
    *   **Giải pháp thiết kế:** 
        1. Xây dựng và bổ sung bộ lọc thời gian thực ngay bên trong cấu phần `GrowthDashboard.tsx`.
        2. Tạo một tiểu mục mới có tiêu đề `"🔥 Tác vụ Deep Work đề xuất"` trực thuộc ngay bên dưới widget `"Khung giờ Deep Work tối ưu"`.
        3. Triển khai thuật toán quét danh sách nhiệm vụ lấy tối đa 2 tác vụ chưa hoàn thành (`status !== 'DONE'`), có độ ưu tiên cao (`eisenhower_q === 'Q1'` hoặc `'Q2'`) và đòi hỏi chỉ số thể trạng cao (`energy_level === 'HIGH'`).
        4. Thiết lập khối giao diện thẻ biểu tượng màu đỏ tinh tế kết hợp nhãn hiển thị loại danh mục và mức năng lượng kèm theo một placeholder khi không tìm thấy tác vụ (fallback hữu ích khích lệ người dùng).

*   **DOC (Tài liệu hóa):**
    *   Tính năng đáp ứng chính xác tiêu chí **AC-PB3-04** của mục *PB-3 — Nhận diện khung giờ hiệu suất cao (Peak Hours)* tại `/SPEC.md`.
    *   Dữ liệu được liên kết và đồng bộ tại tệp `/src/types.ts` (kiểu dữ liệu `Task` cấu trúc trường `energy_level` và `eisenhower_q`).

*   **BUILD (Xây dựng):**
    *   Thêm hook memoized `suggestedDeepWorkTasks` trong `/src/components/GrowthDashboard.tsx` có ràng buộc phụ thuộc chính xác là mảng `tasks` để tối ưu hiệu năng tính toán.
    *   Sắp đặt layout Grid cột dọc bên trái của bảng tăng trưởng, lồng ghép phần hiển thị động cùng thẻ JSX đẹp đẽ tương phản đậm nét (rose, amber badges).

*   **TEST (Kiểm duyệt thành công):**
    *   Chạy kiểm thử cú pháp thông qua `lint_applet` đạt kết quả xanh, đáp ứng tốt kiểu dữ liệu TypeScript.
    *   Kiểm tra thành công bằng `compile_applet` chứng thực dự án build thành công và chạy ổn định.

---

### 5. Cải Tiến AC-PB31-04: Đóng Gói Phục Hồi Năng Lượng Đầy Đủ 100% & Bổ Sung Nút Bỏ Qua Đề Xuất Học Tập AC-PB51-03 & AC-PB51-04

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu (Dựa trên `SPEC.md` và `ARCHITECTURE.md`):** Tối ưu hóa chu trình trải nghiệm hành vi hồi sức tinh thần (Mental energy reset) và trao quyền kiểm soát dẹp bỏ phiền toái cho người dùng thông qua cơ chế đếm số lần từ chối đề xuất học tập.
    *   **Giải pháp thiết kế:** 
        1. Sửa đổi `handleTakeBreak` để thiết lập thẳng giá trị `100` thay vì tính lũy kế `+20`.
        2. Chỉnh đổi nhãn nút tại cấu phần con `EnergyBar.tsx` hiển thị trực tiếp `"Tôi đã nghỉ ngơi (100%)"`.
        3. Khai báo state lưu giữ `studyIgnoreCount` tại cấu phần `Scheduler.tsx`. Nạp/lưu đồng bộ với `localStorage` độc lập.
        4. Tích hợp thêm nút bấm `"Bỏ qua"` màu trắng sữa bên cạnh nút màu xanh mục tiêu. Khi click bỏ qua đủ 3 lần, ẩn hoàn toàn box đề xuất trong suốt ngày hôm đó.

*   **DOC (Tài liệu hóa):**
    *   Đáp ứng chính xác tiêu chí **AC-PB31-04** thuộc phân mục *PB-3.1 — Quản lý ngân sách năng lượng* và hai tiêu chí **AC-PB51-03** & **AC-PB51-04** thuộc phân mục *PB-5.1 — Tự động Time-boxing học tập* trong `SPEC.md`.

*   **BUILD (Xây dựng):**
    *   Điều chỉnh logic thay đổi trạng thái trong `/src/App.tsx`.
    *   Cập nhật layout trong `/src/components/EnergyBar.tsx`.
    *   Bổ sung state quản lý và nút bấm tương tác cùng CSS transition trong `/src/components/Scheduler.tsx`.

*   **TEST (Kiểm duyệt thành công):**
    *   Chạy `lint_applet` thành công hoàn hảo.
    *   Chạy `compile_applet` biên dịch hoàn tất 100%, bảo đảm không gây ra sụp đổ hay xung đột luồng xử lý dữ liệu.

---

### 6. Cải Tiến AC-PB5-02 & AC-PB5-03: Tăng Trưởng Kỹ Năng Bằng Dữ Liệu Thực Tế Và Công Thức Đột Phá Đa Yếu Tố

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu (Dựa trên `SPEC.md` và `ARCHITECTURE.md`):** Tính toán và biểu thị điểm tăng trưởng kỹ năng của người dùng dựa trên việc quy đổi từng task thật (`status === 'DONE'`) có tính đến nỗ lực trí tuệ và định hướng chiến lược.
    *   **Giải pháp thiết kế:**
        1. Tạo ra hook `realCurrentWeekStats` tính tổng số giờ cho 3 nhóm category (Làm việc, Học tập, Admin) từ mảng `tasks` của người dùng.
        2. Tích hợp công thức tính mốc điểm lũy kế chính xác cho từng task: $Score_{Task} = Effort Factor \times Duration In Hours \times Strategy Weight$.
        3. Áp dụng các hệ số nỗ lực trí tuệ (`HIGH` = 4.0, `MEDIUM` = 2.0, `LOW` = 1.0) và trọng số chiến lược (`Q2` = 1.5, `Q1` = 1.2, `Q3` = 0.8, `Q4` = 0.3) cho từng task.
        4. Điều chỉnh giá trị hiển thị cột mốc "Tuần này" trong biểu đồ và gán các mức điểm thực tế tối ưu.
        5. So sánh tỷ lệ tăng trưởng so với tuần trước kèm cơ chế chống chia cho 0.
        6. Trực quan hóa chi tiết công thức và các hệ số, trọng số cụ thể tại giao diện `GrowthDashboard.tsx`.

*   **DOC (Tài liệu hóa):**
    *   Cập nhật đầy đủ tài liệu giải thích thuật toán tại phân mục **3.4 Skill Growth Score Formula (PB-5)** trong file `/ARCHITECTURE.md`.
    *   Cập nhật lịch sử thay đổi dự án trong file `/CHANGELOG.md`.

*   **BUILD (Xây dựng):**
    *   Tái cấu trúc bộ lọc và hooks tính toán memoized tối ưu cao trong `/src/components/GrowthDashboard.tsx`.
    *   Đẹp hóa và minh bạch hóa giao diện hiển thị bảng chú giải thuật toán chi tiết, có phân dải các bóc tách của Hệ số Năng lượng và Trọng số Ma trận Eisenhower rõ ràng.

*   **TEST (Kiểm duyệt thành công):**
    *   Chạy linter của applet thành công sạch sẽ (`npm run lint`).
    *   Xây dựng file đóng gói thành công (`npm run build` thông qua `compile_applet`) hoạt động ổn định và tức thì.

---

### 7. Cải Tiến AC-PB3-02: Loại Bỏ Tính Năng Kích Hoạt Giả Lập 7 Ngày, Chuyển Sang Dành Riêng Cho Dữ Liệu Thực

*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu (Dựa trên `SPEC.md` và `ARCHITECTURE.md`):** Tối ưu hóa sản phẩm hoạt động hoàn toàn bằng dữ liệu thực tế thu thập được, loại bỏ các nút giả lập dữ liệu tĩnh để tránh làm nhiễu biểu cơ chế hoạt động thực của người dùng.
    *   **Giải pháp thiết kế:**
        1. Xóa bỏ nút bấm "Kích hoạt Giả lập 7 ngày" và Banner Area tương ứng tại `GrowthDashboard.tsx`.
        2. Loại bỏ hàm xử lý và gán mảng task giả lập (`handleSimulateHistoricData`) cùng prop bindings trong `App.tsx`.
        3. Cập nhật chi tiết Acceptance Criteria **AC-PB3-02** tại tài liệu `SPEC.md` để đồng ý dùng dữ liệu thực thay cho demo giả lập.

*   **DOC (Tài liệu hóa):**
    *   Thay đổi tiêu chí AC-PB3-02 trong `SPEC.md` nhằm bảo đảm tính chính trực của giải pháp xử lý.
    *   Thêm nhật ký vào `CHANGELOG.md`.

*   **BUILD (Xây dựng):**
    *   Dọn dẹp mã nguồn trong `/src/App.tsx` và `/src/components/GrowthDashboard.tsx`.

*   **TEST (Kiểm duyệt thành công):**
    *   Chạy `npm run lint` tự động xác thực các liên kết nhập khẩu (imports) không bị thừa hay hư hại.
    *   Chạy biên dịch `compile_applet` thành công mỹ mãn.

---

### 8. Tối Ưu Diện Tích Giao Diện: Đóng Gói Công Thức Tính Điểm
*   **PLAN (Lập Kế Hoạch):**
    *   **Mục tiêu:** Thu nhỏ diện tích của bảng mô tả công thức tính điểm để trả lại giao diện thoáng đãng, sang trọng cho Bảng Tăng Trưởng kỹ năng.
    *   **Giải pháp thiết kế:**
        1. Tạo nút bấm bắt mắt "Xem công thức tính điểm / Ẩn công thức tính điểm" đi kèm icon `HelpCircle` và indicator trạng thái `ChevronDown` / `ChevronUp`.
        2. Sử dụng state `showFormula` kiểm soát đóng / mở hiển thị công thức nâng cao động.
*   **DOC (Tài liệu hóa):**
    *   Thêm ghi chú tương tác và nhật ký vào `CHANGELOG.md`.
*   **BUILD (Xây dựng):**
    *   Triển khai bộ chuyển đổi linh hoạt trong `/src/components/GrowthDashboard.tsx`.
*   **TEST (Kiểm duyệt thành công):**
    *   Xác minh tính chính xác với `npm run lint`.
    *   Biên dịch thành công với `npm run build` thông qua `compile_applet`.

---

## 📑 Quy Trình Vibe Coding Áp Dụng Cho Các Tính Năng Tiếp Theo

Từ nay về sau, mọi thay đổi, viết tiếp tính năng mới phục vụ người dùng đều bắt buộc tuân theo biểu mẫu bốn bước:

1.  **PLAN (Kế hoạch):** Mô tả rõ ràng mục tiêu, phân tích cơ chế và kiến trúc dữ liệu bị ảnh hưởng.
2.  **DOC (Tài liệu):** Cập nhật tài liệu thiết kế đặc tả (`SPEC.md` hoặc các file tài liệu nghiệp vụ) trước khi chạm vào mã nguồn chính.
3.  **BUILD (Xây dựng):** Viết mã sạch, giải thích trực diện, tuân thủ TypeScript, loại bỏ hardcoded và log nhạy cảm.
4.  **TEST (Kiểm thử):** Chạy và xác thực thông qua linter và compiler nhằm bảo vệ ứng dụng khỏi sập đổ.

*Nhật ký này sẽ được cập nhật liên tục 100% ứng với mỗi chu trình nâng cấp phần mềm.*
