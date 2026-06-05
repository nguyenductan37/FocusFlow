/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_TASLES: Task[] = [
  {
    id: 't1',
    title: 'Gửi báo cáo định kỳ cho đối tác VIP',
    description: 'Báo cáo tổng hợp số liệu KPIs Marketing tháng trước kèm đề xuất tối ưu ngân sách.',
    status: 'TODO',
    category: 'Làm việc',
    eisenhower_q: 'Q1',
    energy_level: 'MEDIUM',
    estimated_min: 30,
    scheduled_at: '10:00',
    due_date: getTodayDateString(),
  },
  {
    id: 't2',
    title: 'Nghiên cứu System Design & Sharding Database',
    description: 'Học chương 4 sách Designing Data-Intensive Applications.',
    status: 'TODO',
    category: 'Học tập',
    eisenhower_q: 'Q2',
    energy_level: 'HIGH',
    estimated_min: 45,
    scheduled_at: '09:30', // Overlaps with t1 (09:30 + 45m = 10:15, which overlaps with 10:00)! Perfect to demonstrate PB-1
    due_date: getTodayDateString(),
  },
  {
    id: 't3',
    title: 'Trả lời email từ nhà thầu phụ',
    description: 'Thống nhất chi phí phát sinh thiết kế Landing page.',
    status: 'TODO',
    category: 'Admin',
    eisenhower_q: 'Q3',
    energy_level: 'LOW',
    estimated_min: 15,
    due_date: getTodayDateString(),
  },
  {
    id: 't4',
    title: 'Lên outline bài viết review sách Deep Work',
    description: 'Tóm tắt 3 quy tắc vàng của Cal Newport để đăng blog cá nhân.',
    status: 'TODO',
    category: 'Học tập',
    eisenhower_q: 'Q2',
    energy_level: 'HIGH',
    estimated_min: 15, // Suitable for the "Tôi có 15 phút" Assistant
    due_date: getTodayDateString(),
  },
  {
    id: 't5',
    title: 'Đăng ký dọn rác email & unsubscribe newsletter thừa',
    description: 'Lọc hòm thư dọn dẹp dung lượng Google Drive.',
    status: 'TODO',
    category: 'Admin',
    eisenhower_q: 'Q4',
    energy_level: 'LOW',
    estimated_min: 10, // Suitable for "Tôi có 15 phút"
    due_date: getTodayDateString(),
  },
  // Some pre-completed mock tasks historical for the analytics dashboard
  {
    id: 'h1',
    title: 'Họp kick-off sprint mới với sản phẩm',
    status: 'DONE',
    category: 'Làm việc',
    eisenhower_q: 'Q1',
    energy_level: 'HIGH',
    estimated_min: 60,
    completed_at: `${getTodayDateString()}T09:15:00.000Z`,
    due_date: getTodayDateString(),
  },
  {
    id: 'h2',
    title: 'Đọc tài liệu React Server Components',
    status: 'DONE',
    category: 'Học tập',
    eisenhower_q: 'Q2',
    energy_level: 'MEDIUM',
    estimated_min: 30,
    completed_at: `${getTodayDateString()}T14:45:00.000Z`,
    due_date: getTodayDateString(),
  }
];

// Historical statistics for Growth Dashboard (PB-4 & PB-5, configured with updated Task Skill Scores)
export const MOCK_HISTORIC_WEEKS = [
  {
    weekLabel: '3 tuần trước',
    'Làm việc': 12, // hours
    'Học tập': 6,
    'Admin': 4,
    score: 14.2,
  },
  {
    weekLabel: '2 tuần trước',
    'Làm việc': 14,
    'Học tập': 8,
    'Admin': 3,
    score: 16.8,
  },
  {
    weekLabel: 'Tuần trước',
    'Làm việc': 13,
    'Học tập': 7,
    'Admin': 2,
    score: 15.5,
  },
  {
    weekLabel: 'Tuần này',
    'Làm việc': 8,
    'Học tập': 6,
    'Admin': 2,
    score: 12.5,
  },
];
