/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Info, Layers, Trash2, X, Zap } from 'lucide-react';
import { EisenhowerQuadrant, EnergyLevel, Task, TaskCategory, TaskStatus } from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed_at'> & { id?: string }) => void;
  onDelete?: (taskId: string) => void;
  taskToEdit?: Task | null;
  defaultDuration?: number;
  defaultHour?: string;
  defaultCategory?: TaskCategory;
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  taskToEdit,
  defaultDuration,
  defaultHour,
  defaultCategory,
}: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Làm việc');
  const [eisenhowerQ, setEisenhowerQ] = useState<EisenhowerQuadrant>('Q2');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('MEDIUM');
  const [estimatedMin, setEstimatedMin] = useState(30);
  const [scheduledAt, setScheduledAt] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');

  // Handle initializing or editing
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setCategory(taskToEdit.category);
        setEisenhowerQ(taskToEdit.eisenhower_q);
        setEnergyLevel(taskToEdit.energy_level);
        setEstimatedMin(taskToEdit.estimated_min || 30);
        setScheduledAt(taskToEdit.scheduled_at || '');
        setStatus(taskToEdit.status);
        setDueDate(taskToEdit.due_date || '');
      } else {
        // Reset to default presets or props
        setTitle('');
        setDescription('');
        setCategory(defaultCategory || 'Làm việc');
        setEisenhowerQ('Q2'); // preset defaults (AC-PB11-05)
        setEnergyLevel('MEDIUM');
        setEstimatedMin(defaultDuration || 30);
        setScheduledAt(defaultHour || '');
        setStatus('TODO');
        setDueDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, taskToEdit, defaultDuration, defaultHour, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      eisenhower_q: eisenhowerQ,
      energy_level: energyLevel,
      estimated_min: Number(estimatedMin) || 15,
      scheduled_at: scheduledAt || undefined,
      status,
      due_date: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-sans font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4">
          {taskToEdit ? '✏️ Cập Nhật Nhiệm Vụ' : '➕ Tạo Nhiệm Vụ Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên công việc *</label>
            <input
              type="text"
              required
              placeholder="VD: Viết code landing page, Đọc sách..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium outline-hidden transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mô tả công việc</label>
            <textarea
              placeholder="Ghi chú chi tiết hoặc tài liệu đính kèm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 rounded-xl text-sm font-medium outline-hidden transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium"
              >
                <option value="Làm việc">💼 Làm việc</option>
                <option value="Học tập">📚 Học tập</option>
                <option value="Admin">⚙️ Admin / Vặt</option>
              </select>
            </div>

            {/* Estimated minutes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ước tính (Phút)</label>
              <input
                type="number"
                min={1}
                max={480}
                value={estimatedMin}
                onChange={(e) => setEstimatedMin(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          {/* Eisenhower quadrants (AC-PB11-01) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center justify-between">
              <span>Ma trận Eisenhower</span>
              <span className="text-[10px] text-indigo-500 font-bold lowercase italic flex items-center gap-0.5">
                <Info className="w-3 h-3" /> Q1=Khẩn + Quan trọng
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'Q1', title: 'Q1: Khẩn & Quan trọng', desc: 'Làm ngay lập tức' },
                { key: 'Q2', title: 'Q2: Quan trọng, Không khẩn', desc: 'Học tập & Hoạch định' },
                { key: 'Q3', title: 'Q3: Khẩn, Ít quan trọng', desc: 'Ủy quyền / Làm nhanh' },
                { key: 'Q4', title: 'Q4: Ít khẩn & Ít quan trọng', desc: 'Xem xét loại bỏ' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setEisenhowerQ(item.key as EisenhowerQuadrant)}
                  className={`p-2.5 border rounded-xl cursor-pointer transition select-none ${
                    eisenhowerQ === item.key
                      ? 'bg-indigo-50/70 border-indigo-500 text-indigo-900 font-semibold'
                      : 'bg-slate-50 border-gray-100 hover:bg-slate-100 text-gray-600'
                  }`}
                >
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Energy Level (AC-PB11-02) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Năng lượng tiêu tố
              </label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium"
              >
                <option value="HIGH">🔥 Cao (Sáng tạo/Deep Work)</option>
                <option value="MEDIUM">⚡ Trung bình (Shallow Work)</option>
                <option value="LOW">🥱 Thấp (Admin/Thủ tục)</option>
              </select>
            </div>

            {/* Scheduled Start Hour */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Giờ bắt đầu (Nếu có)
              </label>
              <input
                type="time"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status (If edit mode) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium"
              >
                <option value="TODO">Chưa làm (TODO)</option>
                <option value="IN_PROGRESS">Đang làm (IN PROGRESS)</option>
                <option value="BLOCKED">Bị chặn (BLOCKED)</option>
                <option value="DEFERRED">Dời ngày (DEFERRED)</option>
                <option value="DONE">Hoàn thành (DONE)</option>
              </select>
            </div>

            {/* Due date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hạn ngày</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl text-sm font-medium font-mono"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            {taskToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(taskToEdit.id);
                  onClose();
                }}
                className="px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl hover:text-rose-700 transition font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa Task
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
