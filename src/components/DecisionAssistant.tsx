/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarClock, Check, Play, Plus, Sparkles, X } from 'lucide-react';
import { Task } from '../types';

interface DecisionAssistantProps {
  tasks: Task[];
  onStartTask: (taskId: string) => void;
  onOpenCreateTask: (defaultDuration?: number) => void;
}

export default function DecisionAssistant({ tasks, onStartTask, onOpenCreateTask }: DecisionAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [recommended, setRecommended] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpenWithMinutes = (minutes: number) => {
    setSelectedMinutes(minutes);
    setLoading(true);
    setIsOpen(true);

    // AI suggestion simulation in under 1 second (AC-PB4-02)
    setTimeout(() => {
      // Filter todo or in_progress tasks with duration <= minutes
      const candidates = tasks.filter(
        (t) => (t.status === 'TODO' || t.status === 'IN_PROGRESS') && t.estimated_min <= minutes
      );

      // Score each candidate (Eisenhower priority matrix Q1=40, Q2=30, Q3=20, Q4=10) + energy + (1 / duration)
      const scored = candidates.map((t) => {
        let score = 0;
        if (t.eisenhower_q === 'Q1') score += 40;
        else if (t.eisenhower_q === 'Q2') score += 30;
        else if (t.eisenhower_q === 'Q3') score += 20;
        else score += 10;

        if (t.energy_level === 'HIGH') score += 5;
        else if (t.energy_level === 'MEDIUM') score += 3;
        else score += 1;

        // Give weight to task of similar duration as selected
        score += (1 / (t.estimated_min || 1)) * 5;

        return { task: t, score };
      });

      // Sort descendingly by score & fetch the top 2
      const top2 = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((wrapper) => wrapper.task);

      setRecommended(top2);
      setLoading(false);
    }, 250); // fast and snappy!
  };

  const getQuadrantLabel = (q: string) => {
    switch (q) {
      case 'Q1': return 'Quan trọng & Khẩn cấp';
      case 'Q2': return 'Quan trọng & Không khẩn cấp';
      case 'Q3': return 'Khẩn cấp & Ít quan trọng';
      default: return 'Ít quan trọng & Không khẩn cấp';
    }
  };

  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Học tập': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Admin': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-sky-50 text-sky-700 border-sky-100';
    }
  };

  return (
    <>
      {/* Absolute Trigger Buttons on Dashboard */}
      <div className="flex flex-wrap items-center gap-2">
        {[15, 30, 60].map((mins) => (
          <button
            key={mins}
            id={`btn-${mins}min-assistant`}
            onClick={() => handleOpenWithMinutes(mins)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-sans font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
            <span>Tôi có {mins}p</span>
          </button>
        ))}
      </div>

      {/* Suggestion Modal Panel - Rendered on Body level to avoid parent container transform-clipping (Vite layout bug) */}
      {isOpen && createPortal(
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 overflow-hidden"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-gray-900">Trợ Lý {selectedMinutes} Phút</h3>
                  <p className="text-xs text-gray-500 font-medium">Bí kíp dứt điểm các đầu việc nhanh gọn</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 px-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recommendations Content */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500 italic">Đang quẹt Ma trận ưu tiên...</p>
              </div>
            ) : recommended.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Dựa vào mức năng lượng và thứ tự khẩn cấp, đây là <strong>{recommended.length} việc tốt nhất</strong> để bạn xử lý ngay:
                </p>

                {recommended.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-50 hover:bg-slate-50 border border-gray-100 hover:border-indigo-100 rounded-2xl flex flex-col gap-2.5 transition active:scale-[0.99] group/card"
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getCategoryClass(task.category)}`}>
                        {task.category}
                      </span>
                      <span className="font-mono text-xs text-gray-500 font-semibold flex items-center gap-1">
                        ⏱️ {task.estimated_min}m
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="font-sans font-semibold text-gray-800 leading-tight group-hover/card:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-normal">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Tags Eisenhower & Energy */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-indigo-100/50 text-indigo-700 text-[10px] font-bold rounded-lg uppercase">
                        {task.eisenhower_q}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100/60 text-amber-700 text-[10px] font-bold rounded-lg uppercase">
                        ⚡ {task.energy_level}
                      </span>
                      <span className="text-[10px] text-gray-400 italic self-center ml-auto">
                        {getQuadrantLabel(task.eisenhower_q)}
                      </span>
                    </div>

                    {/* Start Button */}
                    <button
                      id={`btn-start-action-${task.id}`}
                      onClick={() => {
                        onStartTask(task.id);
                        setIsOpen(false);
                      }}
                      className="mt-1.5 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-600 hover:text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Khởi chạy đầu việc ngay
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              // Empty Fallback (AC-PB4-05)
              <div className="py-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Không tìm thấy task ngắn ≤ {selectedMinutes} phút</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                  Danh sách chưa có việc ngắn phù hợp để tối ưu khoảng thời rảnh này. Hãy gieo mầm một việc mới ngay!
                </p>
                <button
                  id="btn-quick-create-fallback"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCreateTask(selectedMinutes);
                  }}
                  className="mt-4 flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tạo nhanh task {selectedMinutes} phút
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
