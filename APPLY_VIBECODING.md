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

## 📑 Quy Trình Vibe Coding Áp Dụng Cho Các Tính Năng Tiếp Theo

Từ nay về sau, mọi thay đổi, viết tiếp tính năng mới phục vụ người dùng đều bắt buộc tuân theo biểu mẫu bốn bước:

1.  **PLAN (Kế hoạch):** Mô tả rõ ràng mục tiêu, phân tích cơ chế và kiến trúc dữ liệu bị ảnh hưởng.
2.  **DOC (Tài liệu):** Cập nhật tài liệu thiết kế đặc tả (`SPEC.md` hoặc các file tài liệu nghiệp vụ) trước khi chạm vào mã nguồn chính.
3.  **BUILD (Xây dựng):** Viết mã sạch, giải thích trực diện, tuân thủ TypeScript, loại bỏ hardcoded và log nhạy cảm.
4.  **TEST (Kiểm thử):** Chạy và xác thực thông qua linter và compiler nhằm bảo vệ ứng dụng khỏi sập đổ.

*Nhật ký này sẽ được cập nhật liên tục 100% ứng với mỗi chu trình nâng cấp phần mềm.*
