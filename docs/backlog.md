ID
Loại
Tiêu đề
User Story (tóm tắt)
Acceptance Criteria (trọng tâm)
Ưu tiên
SP (ước lượng sơ bộ)
Phụ thuộc
Trạng thái refine
Ghi chú chiến lược
PB-F1
Feature
Trợ lý Thiết lập Nhanh bằng AI (AI Auto-Triage Agent)
Là người dùng bận rộn, tôi muốn nhập ngôn ngữ tự nhiên để AI tự động phân loại, ước lượng thời gian, mức năng lượng và ma trận Eisenhower.
SC1: Nhập đầy đủ "Review tài liệu... lúc 14:30 trong 45 phút" → tạo task với tên, giờ bắt đầu, thời lượng 45', danh mục Làm việc, Eisenhower Q1/Q2, năng lượng HIGH. <br> SC2: Nhập "Học tiếng Anh giao tiếp" → gán mặc định: danh mục Học tập, thời lượng 25', Eisenhower Q2, năng lượng HIGH.
Cao
8
Cần tích hợp NLP (có thể dùng API hoặc model nhẹ)
🔄 Chưa refine (cần làm rõ độ chính xác của AI, xử lý ngôn ngữ tiếng Việt?)
MVP critical. Giảm friction tâm lý khi nhập task. Cần spike kỹ thuật về NLP.
PB-F2
Feature
Hệ thống Giới hạn Trì hoãn & Đổi góc nhìn (Anti-Doom-Pile)
Là người dùng hay trì hoãn, tôi muốn cảnh báo khi task bị dời quá 3 lần và được gợi ý chia nhỏ thành micro-steps.
SC1: Task có số lần trì hoãn ≥3 → hiển thị nhãn cam "Bị dời hạn quá 3 lần" + nút "Rã nhỏ bước hành động". <br> SC2: Click nút → tự động chia "Hoàn thành báo cáo thuế quý" thành 2 task: "Thu thập hóa đơn (10', LOW)" và "Mở mẫu tờ khai (15', MEDIUM)".
Cao
5
Cần logic đếm số lần thay đổi due date; cần quy tắc chia nhỏ (có thể rule-based ban đầu)
✅ Đã refine (AC rõ)
Giải quyết nỗi sợ task to. Có thể kết hợp với PB-F1 để AI đề xuất cách chia.
PB-F6
Feature
Khóa tập trung dựa trên Lịch trình (Schedule-based Focus Mode)
Là người dùng dễ xao nhãng, tôi muốn hệ thống tự động khóa giao diện và bật Pomodoro khi đến giờ task Deep Work đã lên lịch.
SC1: Đến 09:00 có task Deep Work (Q1/Q2, năng lượng HIGH) → tự động phát chuông, khóa chức năng khác, hiển thị Pomodoro 25'. <br> SC2: Người dùng cố thoát sớm → hiển thị lời khuyên, chỉ cho phép thoát nếu chọn hoãn kèm lý do.
Cao
8
Cần đồng bộ với lịch biểu (calendar), cần cơ chế khóa giao diện (extension/app)
🔄 Chưa refine (cần xác định phạm vi khóa: chỉ trong web app hay toàn thiết bị? Có dùng electron?)
Tăng tỷ lệ hoàn thành Deep Work. Cần làm rõ: "khóa" nghĩa là gì? (không cho chỉnh sửa task? hay chặn tab?)
PB-F3
Feature
Nhịp sinh học Cá nhân hóa (Chronobiology Profile)
Là người dùng muốn tối ưu theo khoa học, tôi muốn làm trắc nghiệm nhanh để xác định nhóm sinh học (cú đêm/sơn ca) và hệ thống tự động dịch khung giờ Deep Work phù hợp.
SC1: Trả lời 3 câu hỏi về thói quen ngủ → xác định "Cú đêm" hoặc "Sơn ca" + hiển thị đồ thị năng lượng 24h. <br> SC2: Nếu là Cú đêm → đề xuất Deep Work từ 20:00-22:00 thay vì 09:00-11:00 mặc định.
Trung bình
5
Cần nghiên cứu bộ câu hỏi (tham khảo MEQ), cần lưu profile người dùng
✅ Đã refine (AC rõ)
Tính cá nhân hóa mạnh. Có thể nâng cấp sau: dùng dữ liệu hành vi để tự động điều chỉnh thay vì chỉ trắc nghiệm.
PB-F4
Feature
Công cụ Decompression & Giấc ngủ Nhận thức buổi tối
Là người dùng khó ngắt suy nghĩ công việc, tôi muốn có "Brain Dump" buổi tối để trút lo lắng và chuyển sang chế độ OFF.
SC1: Sau 19:30 và hoàn thành EOD → nút "Khởi động chu trình xả hơi 3 phút" → mở giao diện tối, khung "Brain Dump: Trút bỏ lo toan". <br> SC2: Gõ xong nội dung → bấm "Đóng dòng suy nghĩ & Đi ngủ" → hiệu ứng tan biến, hướng dẫn thở 4-7-8, khóa chỉnh sửa task, chuyển sang OFF Mode.
Trung bình
3
Cần logic EOD (End of Day) đã có chưa? Cần tích hợp hẹn giờ thở
✅ Đã refine (AC chi tiết)
Đơn giản nhưng tác động tâm lý lớn. Có thể làm prototype nhanh.
PB-F5
Feature
Sắp xếp thông minh theo Cụm bối cảnh (Smart Category Batching)
Là người dùng có nhiều task vụn vặt, tôi muốn hệ thống tự đề xuất gom các task cùng danh mục (ví dụ Admin) vào một khung giờ để tránh chuyển đổi ngữ cảnh.
SC1: Có ≥3 task cùng danh mục Admin trong ngày → hiển thị đề xuất gom cụm. <br> SC2: Người dùng đồng ý → 3 task được xếp nối tiếp nhau trong 45', giải phóng các slot trống cho Deep Work.
Thấp
3
Cần thuật toán nhóm task theo danh mục, cần can thiệp vào scheduler
✅ Đã refine (AC rõ)
Nice to have. Có thể triển khai sau MVP. Tuy nhiên, nếu kết hợp với AI (PB-F1) thì sẽ mạnh.


---

Thông tin bổ sung cho PO (dựa trên tài liệu)

1. Các giả định & phụ thuộc kỹ thuật
- PB-F1 (AI Auto-Triage): Cần quyết định dùng OpenAI API hay tự huấn luyện mô hình nhẹ. Nên làm Spike (2-3 ngày) trước khi refine chi tiết.
- PB-F6 (Focus Mode): Cần xác định phạm vi "khóa giao diện". Nếu là PWA/web app, chỉ khóa trong tab trình duyệt. Nếu là desktop app (Electron), có thể can thiệp sâu hơn. PO cần thương lượng với team về kỳ vọng.
- PB-F3 (Chronobiology): Bộ câu hỏi nên dựa trên MEQ (Morningness-Eveningness Questionnaire) rút gọn. Có thể tham khảo ý kiến chuyên gia tâm lý.
  
2. Khuyến nghị về thứ tự phát triển (dựa trên giá trị & rủi ro)
Sprint
Nên đưa các item
Lý do
Sprint 1
PB-F1 (Auto-Triage) + PB-F2 (Anti-Doom-Pile)
Giải quyết nỗi đau lớn nhất: nhập task nhanh và không bị ngợp. PB-F1 có rủi ro kỹ thuật → cần làm sớm.
Sprint 2
PB-F6 (Focus Mode) + PB-F4 (Decompression)
Tăng khả năng hoàn thành task và cải thiện giấc ngủ – hai yếu tố then chốt cho bền vững.
Sprint 3
PB-F3 (Chronobiology)
Cá nhân hóa, có thể triển khai sau khi đã có người dùng thường xuyên.
Sprint 4+
PB-F5 (Batching)
Tính năng tiện ích, không phải MVP, có thể làm cuối hoặc bỏ qua nếu thiếu tài nguyên.

3. Các chỉ số PO cần theo dõi liên quan đến backlog này
- Tỷ lệ task được tạo qua AI Auto-Triage (PB-F1) → mục tiêu >70% người dùng active dùng tính năng này.
- Số lần sử dụng "Rã nhỏ bước hành động" (PB-F2) → nếu thấp, cần cải thiện UX hoặc kích hoạt cảnh báo sớm hơn (sau 2 lần dời).
- Số phiên Focus Mode tự động (PB-F6) vs số phiên bị bỏ qua → đo lường hiệu quả của việc khóa cưỡng chế.
  