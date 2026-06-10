/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EisenhowerQuadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type EnergyLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'DEFERRED';

export type TaskCategory = 'Làm việc' | 'Học tập' | 'Admin';

export type Chronotype = 'EARLY_BIRD' | 'NIGHT_OWL' | 'THIRD_BIRD' | null;

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  eisenhower_q: EisenhowerQuadrant;
  energy_level: EnergyLevel;
  estimated_min: number;       // Thời lượng dự tính (phút)
  actual_min?: number;         // Thời lượng thực tế (phút)
  scheduled_at?: string;       // Giờ bắt đầu dạng hàng ngày (ví dụ: "09:00" hoặc "14:30")
  completed_at?: string;       // Timestamp khi hoàn thành
  due_date?: string;           // Ngày cần làm (YYYY-MM-DD)
  postpone_count?: number;     // Số lần task bị dời due_date sang ngày khác
  postpone_reasons?: string[]; // Lý do hoãn task (PB-F6)
}

export interface EnergyStatus {
  currentScore: number;       // 0 - 100%
  completedHighTasksToday: number;
  isWarned: boolean;
}

export interface DayClosure {
  id: string;
  date: string;                // YYYY-MM-DD
  tasks_done: number;
  tasks_deferred: number;
  highlights: string[];
  closureTime: string;         // ISO String
}
