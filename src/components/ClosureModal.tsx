/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle2, ChevronRight, Moon, Sparkles, X, Sun, LogOut } from 'lucide-react';
import { Task } from '../types';

interface ClosureModalProps {
  isOpen: boolean;
  tasks: Task[];
  onClose: () => void;
  onConfirmClosure: (tomorrowPlanTaskIds: string[]) => void;
}

export default function ClosureModal({ isOpen, tasks, onClose, onConfirmClosure }: ClosureModalProps) {
  // Compute Done vs Deferred
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === 'DONE'), [tasks]);
  const unresolvedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'DONE')
      .sort((a, b) => {
        // Priority sorted: Q1 > Q2 > Q3 > Q4
        const map: Record<string, number> = { Q1: 4, Q2: 3, Q3: 2, Q4: 1 };
        return (map[b.eisenhower_q] || 0) - (map[a.eisenhower_q] || 0);
      });
  }, [tasks]);

  // Tomorrow Plan Suggestions: Top 5 priority tasks (AC-PB21-03)
  const [tomorrowPlanIds, setTomorrowPlanIds] = useState<string[]>(() => {
    return unresolvedTasks.slice(0, 5).map((t) => t.id);
  });

  const toggleSelectTomorrowTask = (taskId: string) => {
    if (tomorrowPlanIds.includes(taskId)) {
      setTomorrowPlanIds(tomorrowPlanIds.filter((id) => id !== taskId));
    } else {
      setTomorrowPlanIds([...tomorrowPlanIds, taskId]);
    }
  };

  // Find Q1/Q2 achievements for highlight praise (AC-PB2-02)
  const highlights = useMemo(() => {
    return doneTasks.filter((t) => t.eisenhower_q === 'Q1' || t.eisenhower_q === 'Q2');
  }, [doneTasks]);

  if (!isOpen) return null;

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

        {/* Dynamic Greetings header */}
        <div className="text-center pb-5 border-b border-gray-100 mb-5">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
            <Moon className="w-6 h-6 fill-indigo-500 animate-pulse" />
          </div>
          <h3 className="font-sans font-bold text-xl text-gray-900">Quy Trình Kết Thúc Ngày</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Xác lập ranh giới tâm lý tốt lành giữa công việc và cuộc sống tư nhân
          </p>
        </div>

        {/* 🏆 Section 1: End of Day Summary Reports (AC-PB2-02) */}
        <div className="space-y-4 mb-6">
          <h4 className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wider">
            📊 Tóm tắt thành quả hôm nay
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
              <span className="block font-mono text-2xl font-black text-emerald-600">{doneTasks.length}</span>
              <span className="text-[11px] text-emerald-800 font-semibold uppercase">Hoàn thành</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
              <span className="block font-mono text-2xl font-black text-slate-600">{unresolvedTasks.length}</span>
              <span className="text-[11px] text-slate-700 font-semibold uppercase">Tồn đọng dời lại</span>
            </div>
          </div>

          {/* Highlights Achievement Praise */}
          {highlights.length > 0 ? (
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 text-indigo-800 rounded-2xl text-xs space-y-1.5">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-spin-slow" />
                Thành tựu nổi bật của bạn:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700 font-medium">
                {highlights.slice(0, 2).map((h) => (
                  <li key={h.id}>
                    Đã xuất sắc dứt điểm việc đỉnh cao Q1/Q2: <strong>&quot;{h.title}&quot;</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-100 text-gray-600 rounded-xl text-xs">
              Mọi trải nghiệm đều là bài học quý giá. Ngày mai chắc chắn sẽ còn bùng nổ hơn nữa!
            </div>
          )}
        </div>

        {/* 🌅 Section 2: Tomorrow Planning (AC-PB21-01 to 04) */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Lập kế hoạch dứt điểm sáng mai (Tối đa 5 việc)
            </h4>
            <span className="text-[10px] text-gray-400 font-medium">Q1 → Q2 ưu tiên cao nhất</span>
          </div>

          <div className="max-h-[180px] overflow-y-auto space-y-2 border border-gray-100 p-2 rounded-2xl scrollbar-thin">
            {unresolvedTasks.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs italic">
                Tuyệt vời, bạn không còn việc nào tồn đọng ngày hôm nay!
              </div>
            ) : (
              unresolvedTasks.map((task) => {
                const isSelected = tomorrowPlanIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleSelectTomorrowTask(task.id)}
                    className={`flex items-center gap-3 p-2.5 border rounded-xl cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <span className="block w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    <div className="flex-1 truncate">
                      <span className="font-mono text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.25 rounded font-black mr-2">
                        {task.eisenhower_q}
                      </span>
                      <span>{task.title}</span>
                    </div>

                    <span className="text-[10px] text-gray-400 italic">⏱️ {task.estimated_min}m</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Action buttons: Enter OFF Mode */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 font-semibold text-xs rounded-xl cursor-pointer"
          >
            Hủy và xem lại lịch
          </button>
          <button
            id="btn-confirm-closure-off"
            onClick={() => {
              onConfirmClosure(tomorrowPlanIds);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Nhận tóm tắt & Kích hoạt OFF Mode 🌸
          </button>
        </div>

      </div>
    </div>
  );
}
