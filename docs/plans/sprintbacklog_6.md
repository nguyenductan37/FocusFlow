# Tài liệu Đặc tả Thiết kế Kỹ thuật Chức năng: Sắp xếp thông minh theo Cụm bối cảnh (Smart Category Batching)

Tài liệu này đặc tả chi tiết về mặt nghiệp vụ, giao diện người dùng (UI/UX), thuật toán sắp xếp và phương án triển khai kỹ thuật cho tính năng **Gom nhóm thông minh theo danh mục (Smart Category Batching)** trong Sprint 4 (mã sự kiện PB-F5) của dự án FocusFlow.

---

## 1. Phân tích Nghiệp vụ & Ý tưởng (Concept)
* **Vấn đề:** Chuyển đổi qua lại giữa các công việc thuộc các danh mục khác nhau (ví dụ: đang viết code rồi dừng lại trả lời email, sau đó lại nhảy sang dọn dẹp) làm lãng phí năng lượng tinh thần lớn của não bộ (Context-switching cost).
* **Giải pháp:** Tự động phát hiện khi trong ngày có các nhóm công việc tương đồng và đề xuất dồn tất cả chúng vào một khoảng thời gian trống cố định ngoài giờ vàng để giải quyết liền mạch, giữ cho các khung giờ vàng hoàn toàn trống phục vụ cho Deep Work.

---

## 2. Tiêu chí Acceptance Criteria (AC)

* **SC1: Kích hoạt gợi ý gom lịch (Detection & UI Display):**
  * Hệ thống tự động quét danh sách task chưa hoàn thành trong ngày hôm nay.
  * Nếu phát hiện có $\ge 3$ task thuộc cùng một danh mục (ví dụ: `Học tập`, `Làm việc`, `Cá nhân`...) chưa được thực hiện, một Banner gợi ý tối ưu lịch trình sẽ xuất hiện trên Dashboard.
  * Banner hiển thị: Tên danh mục, số lượng task, và khoảng thời gian bắt đầu đề xuất (ví dụ: `15:30`).
* **SC2: Nút hành động trên Banner:**
  * Nút **"Đồng ý gom lịch"**: Cập nhật lại thời gian xếp liền kề các task thuộc nhóm và ẩn banner.
  * Nút **"Bỏ qua"**: Ẩn tạm thời banner trong ngày hôm đó (hoặc cho đến khi có sự thay đổi về danh sách task).
* **SC3: Quy tắc tìm vị trí thời gian trống lý tưởng:**
  * Khe thời gian trống đề xuất phải đủ chứa tổng thời gian của toàn bộ cụm task ($D = \sum d_i$ phút).
  * Khe này **không được trùng** với bất kỳ task nào khác đã xếp lịch.
  * Khe này **nên tránh** khung giờ vàng sinh học của người dùng (nếu đã làm trắc nghiệm Chronotype).
  * Nếu không tìm được khe lý tưởng tránh giờ vàng, hệ thống tự động fallback tìm khe trống bất kỳ.

---

## 3. Thiết kế Thuật toán gom nhóm & tìm vị trí trống (Slot Finder)

### 3.1. Thuật toán tìm giờ bắt đầu tối ưu (`findOptimalStartTime`)
Được viết bằng TypeScript thực thi phía Client:
```typescript
interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  duration: number; // số phút
  scheduled_at?: string; // định dạng "HH:MM"
  status: TaskStatus;
}

export function findOptimalStartTime(
  tasks: Task[], 
  durationNeeded: number, 
  chronotype: Chronotype | null, 
  currentTimeStr: string
): string | null {
  // 1. Định nghĩa các khoảng giờ vàng cần tránh
  const goldenHours: { start: number; end: number }[] = [];
  if (chronotype === 'EARLY_BIRD') {
    goldenHours.push({ start: 8, end: 11 });
  } else if (chronotype === 'NIGHT_OWL') {
    goldenHours.push({ start: 20, end: 22 });
  } else if (chronotype === 'THIRD_BIRD') {
    goldenHours.push({ start: 9, end: 11.5 });
    goldenHours.push({ start: 15, end: 17 });
  }

  // 2. Lấy danh sách các khoảng thời gian bận từ các task khác
  const busySlots: { start: number; end: number }[] = tasks
    .filter(t => t.status !== 'DONE' && t.scheduled_at)
    .map(t => {
      const [h, m] = t.scheduled_at!.split(':').map(Number);
      const start = h + m / 60;
      const end = start + (t.duration || 25) / 60;
      return { start, end };
    });

  // 3. Quét tìm khe trống từ thời gian hiện tại (hoặc 08:00) đến 21:00
  const [currH, currM] = currentTimeStr.split(':').map(Number);
  const startScan = Math.max(8, currH + Math.ceil(currM / 10) * 10 / 60); // Bắt đầu quét từ mốc làm tròn 10 phút tiếp theo
  const endScan = 21.0; 
  const neededHours = durationNeeded / 60;

  // Thử tìm khe trống tránh giờ vàng trước
  let bestSlotStart = scanForFreeSlot(startScan, endScan, neededHours, busySlots, goldenHours);
  
  // Nếu không tìm thấy, thử tìm khe trống bất kỳ (chấp nhận lấn giờ vàng)
  if (bestSlotStart === null) {
    bestSlotStart = scanForFreeSlot(startScan, endScan, neededHours, busySlots, []);
  }

  if (bestSlotStart === null) return null;

  // Chuyển đổi điểm giờ thập phân về định dạng "HH:MM"
  const resH = Math.floor(bestSlotStart);
  const resM = Math.round((bestSlotStart - resH) * 60);
  return `${String(resH).padStart(2, '0')}:${String(resM).padStart(2, '0')}`;
}

function scanForFreeSlot(
  start: number, 
  end: number, 
  duration: number, 
  busySlots: { start: number; end: number }[],
  avoidSlots: { start: number; end: number }[]
): number | null {
  const step = 10 / 60; // Quét nhảy bước 10 phút một lần
  for (let t = start; t + duration <= end; t += step) {
    let hasConflict = false;
    
    // Check trùng lịch task khác
    for (const busy of busySlots) {
      if (!(t + duration <= busy.start || t >= busy.end)) {
        hasConflict = true;
        break;
      }
    }
    
    // Check trùng giờ vàng
    for (const avoid of avoidSlots) {
      if (!(t + duration <= avoid.start || t >= avoid.end)) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) return t;
  }
  return null;
}
```

---

## 4. Kế Hoạch Triển Khai Kỹ Thuật (Detailed Technical Implementation Plan)

### Giai đoạn 1: Xây dựng hàm Helper thuật toán
* **File tạo mới:** `src/utils/schedulerUtils.ts`
* **Nhiệm vụ:** Viết các hàm phân tích danh sách task, tìm kiếm các cụm danh mục có $\ge 3$ task chưa làm và chạy hàm `findOptimalStartTime` để đưa ra giờ hẹn hợp lý nhất.

### Giai đoạn 2: Phát triển Component `BatchingNudgeCard.tsx`
* **File tạo mới:** `src/components/BatchingNudgeCard.tsx`
* **Nhiệm vụ:**
  * Nhận các props:
    * `category: TaskCategory`
    * `taskCount: number`
    * `proposedTime: string`
    * `onAccept: () => void`
    * `onDismiss: () => void`
  * Render giao diện Banner có màu sắc Indigo ấm, biểu tượng chiếc bóng đèn, dòng thông tin mô tả chi tiết, và hai nút hành động "Đồng ý" / "Bỏ qua".

### Giai đoạn 3: Tích hợp logic vào `App.tsx`
* **Mã nguồn tích hợp:**
  * Thêm state quản lý việc bỏ qua gợi ý trong ngày:
    ```typescript
    const [dismissedBatches, setDismissedBatches] = useState<string[]>([]);
    ```
  * Thêm hàm xử lý hành động gom lịch `handleApplyBatch(category: TaskCategory, startTime: string)`:
    * Lọc các task chưa hoàn thành trong ngày hôm nay thuộc danh mục đó.
    * Sắp xếp lại lịch trình: cập nhật `scheduled_at` cho từng task theo phương án nối tiếp nhau bắt đầu từ `startTime`.
    * Lưu lại vào `localStorage` và cập nhật lại giao diện.
  * Đặt component `<BatchingNudgeCard>` lên trên khu vực Scheduler trong màn hình Dashboard.

---

## 5. Kế Hoạch Kiểm Thử (Manual Testing Plan)

* **Test Case 1 (Hiển thị Banner tự động):**
  * Tạo mới 3 task chưa làm trong ngày hôm nay có cùng danh mục là `Học tập`.
  * Xác nhận Banner tối ưu hóa hiệu suất xuất hiện phía trên Scheduler với nội dung đề xuất chính xác.
* **Test Case 2 (Đồng ý Gom lịch):**
  * Nhấn nút **"Đồng ý gom lịch"** trên Banner.
  * Xác nhận trên danh sách Lịch trình (Timeline), cả 3 task đó đã được xếp liền kề nhau bắt đầu đúng giờ được đề xuất.
* **Test Case 3 (Bỏ qua đề xuất):**
  * Tạo 3 task cùng danh mục, nhấn nút **"Bỏ qua"**.
  * Xác nhận Banner ẩn đi lập tức và không làm xáo trộn lịch trình của bạn.
