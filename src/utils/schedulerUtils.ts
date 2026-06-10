import { Task, TaskCategory, TaskStatus, Chronotype } from '../types';

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

  // 2. Lấy danh sách các khoảng thời gian bận từ các task khác (chỉ tính task trong ngày hôm nay)
  const busySlots: { start: number; end: number }[] = tasks
    .filter(t => t.status !== 'DONE' && t.scheduled_at)
    .map(t => {
      const [h, m] = t.scheduled_at!.split(':').map(Number);
      const start = h + m / 60;
      const end = start + (t.estimated_min || 25) / 60;
      return { start, end };
    });

  // 3. Quét tìm khe trống từ thời gian hiện tại (hoặc 08:00) đến 21:00
  const [currH, currM] = currentTimeStr.split(':').map(Number);
  const startScan = Math.max(8, currH + Math.ceil(currM / 10) * 10 / 60); // Bắt đầu quét từ mốc làm tròn 10 phút
  const endScan = 22.0; // Quét tới 22h tối
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
  
  // Prevent infinite loops just in case, bounded by end
  for (let t = start; t + duration <= end; t += step) {
    let hasConflict = false;
    
    // Check trùng lịch task khác
    // Conflict occurs if [t, t+duration) overlaps with [busy.start, busy.end)
    // Overlap condition: max(start1, start2) < min(end1, end2)
    for (const busy of busySlots) {
      const overlapStart = Math.max(t, busy.start);
      const overlapEnd = Math.min(t + duration, busy.end);
      if (overlapStart < overlapEnd) {
        hasConflict = true;
        break;
      }
    }
    
    // Check trùng giờ vàng
    if (!hasConflict) {
      for (const avoid of avoidSlots) {
        const overlapStart = Math.max(t, avoid.start);
        const overlapEnd = Math.min(t + duration, avoid.end);
        if (overlapStart < overlapEnd) {
          hasConflict = true;
          break;
        }
      }
    }

    if (!hasConflict) return t;
  }
  return null;
}
