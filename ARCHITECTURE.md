# ARCHITECTURE.md — Kiến trúc Hệ thống FocusFlow

**Phiên bản:** 1.0  
**Cập nhật lần cuối:** 2026-06  

---

## 1. Tổng quan Kiến trúc

FocusFlow trong môi trường AI Studio ban đầu được phát triển dưới dạng một ứng dụng **React Client-Side SPA (Single Page Application)** chất lượng cao với State Management và Offline Storage bền vững qua `localStorage`.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│              React SPA (TypeScript + Tailwind)          │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                      STATE ENGINE                       │
│             React Hooks & Context Providers             │
│   ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│   │ Task State   │  │ Schedule Svc │  │ Analytics   │  │
│   └──────────────┘  └──────────────┘  └─────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    PERSISTENCE                          │
│                    LocalStorage                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Cấu trúc thư mục

```
src/
├── types.ts          # Định nghĩa kiểu dữ liệu đồng bộ
├── App.tsx           # Entry point chính chứa Router & Layout
├── index.css         # Import Tailwind CSS v4 & custom font
├── main.tsx          # React StrictMode bootstrap
└── components/       # Các component phân rã theo Epic
    ├── Dashboard.tsx # Trang chủ chính
    ├── TaskList.tsx  # CRUD & Ma trận Eisenhower
    ├── Scheduler.tsx # Lịch trình chi tiết ngày & phát hiện xung đột
    ├── Decision.tsx  # Trợ lý khẩn cấp "Tôi có 15 phút"
    ├── Closure.tsx   # Quy trình kết thúc ngày "End of Day"
    ├── Analytics.tsx # Dashboard tiến bộ kỹ năng & hiệu suất
    └── EnergyBar.tsx # Hiển thị Ngân sách Năng lượng
```

### 2.2 Các trạng thái lưu trữ chính (Local State & Cache)

Ứng dụng lưu trữ các thực thể thông tin sau vào `localStorage` của trình duyệt:
- `focusflow_tasks`: Danh sách các công việc.
- `focusflow_energy`: Điểm số năng lượng hôm nay (0-100%).
- `focusflow_is_off`: Trạng thái "Off" của người dùng khi đã kết thúc ngày làm việc.
- `focusflow_closure_history`: Nhật ký các ngày đóng gói thành công.

---

## 3. Các thuật toán cốt lõi

### 3.1 Quick Action Algorithm (PB-4)

```typescript
// Trích xuất từ Trợ lý "Tôi có 15 phút"
function recommendTasks(tasks: Task[], availableMinutes: number = 15): Task[] {
  const candidates = tasks.filter(
    t => (t.status === 'TODO' || t.status === 'IN_PROGRESS') &&
         t.estimated_min <= availableMinutes
  );
  
  return candidates
    .map(t => {
      let score = 0;
      // Trọng số Ma trận Eisenhower (Q1: 40, Q2: 30, Q3: 20, Q4: 10)
      if (t.eisenhower_q === 'Q1') score += 40;
      else if (t.eisenhower_q === 'Q2') score += 30;
      else if (t.eisenhower_q === 'Q3') score += 20;
      else score += 10;
      
      // Trọng số Mức năng lượng (High: 5, Medium: 3, Low: 1)
      if (t.energy_level === 'HIGH') score += 5;
      else if (t.energy_level === 'MEDIUM') score += 3;
      else score += 1;
      
      // Trọng số ưu tiên task ngắn gọn
      score += (1 / (t.estimated_min || 1)) * 5;
      
      return { task: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(wrapper => wrapper.task);
}
```

### 3.2 Conflict Detection Algorithm (PB-1)

Khi thêm hoặc sửa một task có xác định `scheduled_at` và `estimated_min`, hệ thống sẽ chạy:
1. Tính toán khoảng thời gian chồng lấn `[start, end]`.
2. Truy xuất các task khác xem có task nào trong ngày bị giao thoa thời gian không.
3. Nếu phát hiện giao thoa, báo động ngay trạng thái "Phát hiện xung đột lịch" và thực hiện tìm kiếm một khe trống (Slot) đủ lớn từ mốc hiện tại để đưa ra phương án dời lịch đề xuất tốt nhất.

### 3.3 Energy Score Model (PB-3.1)

Mỗi khi một công việc được người dùng chuyển sang hoàn thành (`DONE`), một lượng năng lượng ảo sẽ bị tiêu hao:
- `HIGH` energy task: Tiêu tốn `15` điểm.
- `MEDIUM` energy task: Tiêu tốn `8` điểm.
- `LOW` energy task: Tiêu tốn `3` điểm.

Khi người dùng thực hiện kích hoạt nút "Tôi đã nghỉ ngơi" hoặc đóng lịch làm việc, điểm năng lượng hồi lại `20` điểm (giới hạn tối đa là `100` điểm). Hệ thống hiển thị cảnh báo nghỉ ngơi nếu điểm năng lượng rơi xuống dưới `20%`.
