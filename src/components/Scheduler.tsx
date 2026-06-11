/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { AlertCircle, ArrowRight, Calendar, Check, Clock, Plus, HelpCircle, Zap } from 'lucide-react';
import { Task, Chronotype } from '../types';
import { getTodayDateString } from '../utils/dummyData';

interface SchedulerProps {
  tasks: Task[];
  chronotype?: Chronotype;
  onUpdateTaskTime: (taskId: string, newTime: string) => void;
  onOpenCreateTask: (defaultHour?: string) => void;
  onSelectTaskToEdit: (task: Task) => void;
  onScheduleUnscheduledTask?: (taskId: string, scheduledTime: string) => void;
}

// Utility functions to calculate times
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  return h * 60 + m;
}

export function minutesToTimeString(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function Scheduler({ tasks, chronotype, onUpdateTaskTime, onOpenCreateTask, onSelectTaskToEdit, onScheduleUnscheduledTask }: SchedulerProps) {
  // Local state for Smart Slot-Scheduling Nudge (PB-5.1)
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [dismissedSlot, setDismissedSlot] = React.useState<string | null>(null);

  // Extract scheduled non-done tasks for clashing computations
  const scheduledTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'DONE' && t.status !== 'DEFERRED' && t.scheduled_at)
      .sort((a, b) => timeStringToMinutes(a.scheduled_at!) - timeStringToMinutes(b.scheduled_at!));
  }, [tasks]);

  // Find all conflicts (overlapping scheduled times)
  const conflicts = useMemo(() => {
    const list: Array<{ taskA: Task; taskB: Task; suggestion: string }> = [];
    
    for (let i = 0; i < scheduledTasks.length; i++) {
      const tA = scheduledTasks[i];
      const startA = timeStringToMinutes(tA.scheduled_at!);
      const endA = startA + tA.estimated_min;

      for (let j = i + 1; j < scheduledTasks.length; j++) {
        const tB = scheduledTasks[j];
        const startB = timeStringToMinutes(tB.scheduled_at!);
        
        if (startB < endA) {
          // We have a clashing overlap!
          // Suggest setting tB to immediately follow tA (endA)
          const suggestionTime = minutesToTimeString(endA);
          list.push({
            taskA: tA,
            taskB: tB,
            suggestion: suggestionTime,
          });
        }
      }
    }
    return list;
  }, [scheduledTasks]);

  // Find educational time slots for PB-5.1 (Time-boxing học tập tự động)
  // Gaps of >= 20 mins between scheduled tasks or in morning slot
  const studySlotProposal = useMemo(() => {
    let targetSlot: string | null = null;
    let slotDuration = 30;
    let reason = '';

    if (scheduledTasks.length === 0) {
      // If no scheduled tasks, suggest morning at 9:00
      targetSlot = '09:00';
      slotDuration = 25;
      reason = 'Lịch sáng còn trống hoàn hảo';
    } else {
      // Try to find gaps >= 20 mins
      for (let i = 0; i < scheduledTasks.length - 1; i++) {
        const tA = scheduledTasks[i];
        const endA = timeStringToMinutes(tA.scheduled_at!) + tA.estimated_min;
        const startB = timeStringToMinutes(scheduledTasks[i + 1].scheduled_at!);
        const gap = startB - endA;

        if (gap >= 20) {
          targetSlot = minutesToTimeString(endA);
          slotDuration = Math.min(gap, 45);
          reason = `Khoảng trống ${gap} phút giữa các nhiệm vụ`;
          break;
        }
      }

      if (!targetSlot) {
        // Otherwise find slot after the last scheduled task
        const lastTask = scheduledTasks[scheduledTasks.length - 1];
        const endLast = timeStringToMinutes(lastTask.scheduled_at!) + lastTask.estimated_min;
        if (endLast < 17 * 60) { // before 17:00
          targetSlot = minutesToTimeString(endLast);
          slotDuration = 30;
          reason = 'Khung giờ rảnh cuối chiều trước giờ nghỉ';
        }
      }
    }

    if (!targetSlot) return null;

    // Search for all unscheduled tasks for today
    const todayStr = getTodayDateString();
    const unscheduledTasks = tasks.filter(t => 
      !t.scheduled_at && 
      t.status !== 'DONE' && 
      t.status !== 'DEFERRED' &&
      t.due_date === todayStr
    );

    if (unscheduledTasks.length > 0) {
      const startHour = parseInt(targetSlot.split(':')[0], 10);
      let isGoldenHour = false;
      if (chronotype === 'EARLY_BIRD') {
        isGoldenHour = startHour >= 8 && startHour < 11;
      } else if (chronotype === 'NIGHT_OWL') {
        isGoldenHour = startHour >= 20 && startHour < 22;
      } else {
        isGoldenHour = (startHour >= 9 && startHour < 11) || (startHour >= 14 && startHour < 16);
      }

      // Scoring algorithm to find the best matched task
      const scoredTasks = unscheduledTasks.map(task => {
        let score = 0;
        
        // 1. Duration Fit
        if (task.estimated_min <= slotDuration) score += 50;
        else score -= 20;
        
        // 2. Eisenhower Priority
        if (task.eisenhower_q === 'Q1') score += 40;
        else if (task.eisenhower_q === 'Q2') score += 35;
        else if (task.eisenhower_q === 'Q3') score += 20;
        else if (task.eisenhower_q === 'Q4') score += 10;
        
        // 3. Bio-hour Alignment
        if (isGoldenHour) {
          if (task.energy_level === 'HIGH') score += 30;
          else if (task.energy_level === 'MEDIUM') score += 15;
          else if (task.energy_level === 'LOW') score += 5;
        } else {
          if (task.energy_level === 'LOW') score += 20;
          else if (task.energy_level === 'MEDIUM') score += 10;
          else if (task.energy_level === 'HIGH') score -= 10;
        }
        
        return { task, score };
      });

      // Sort by score descending
      const candidates = scoredTasks.sort((a, b) => b.score - a.score).map(s => s.task);

      return {
        slot: targetSlot,
        duration: slotDuration,
        reason,
        matchedTask: candidates[0],
        candidates
      };
    }

    return {
      slot: targetSlot,
      duration: slotDuration,
      reason
    };
  }, [scheduledTasks, tasks, chronotype]);

  // Find chronobiology nudges (PB-F3)
  const chronotypeNudges = useMemo(() => {
    if (!chronotype) return [];
    
    let goldenStart = 9;
    let goldenEnd = 17;
    let fallbackTime = '09:00';
    let msg = '';
    
    if (chronotype === 'EARLY_BIRD') {
      goldenStart = 8; goldenEnd = 11;
      fallbackTime = '09:00';
      msg = 'Sơn Ca';
    } else if (chronotype === 'NIGHT_OWL') {
      goldenStart = 20; goldenEnd = 22;
      fallbackTime = '20:00';
      msg = 'Cú Đêm';
    } else {
      goldenStart = 9; goldenEnd = 11;
      fallbackTime = '09:30';
      msg = 'Chim Bồ Câu';
    }

    const nudges: Array<{ task: Task; suggestion: string; reason: string }> = [];
    
    for (const t of scheduledTasks) {
      if (t.energy_level === 'HIGH' && (t.eisenhower_q === 'Q1' || t.eisenhower_q === 'Q2')) {
        const startMins = timeStringToMinutes(t.scheduled_at!);
        const h = Math.floor(startMins / 60);
        // if the scheduled hour is completely outside the golden hours
        if (h < goldenStart || h > goldenEnd) {
          nudges.push({
            task: t,
            suggestion: fallbackTime,
            reason: `Bạn đang xếp lịch Deep Work vào giờ thấp điểm sinh học. Nên dời sang khung giờ vàng của ${msg} (${goldenStart}h-${goldenEnd}h).`
          });
        }
      }
    }
    return nudges;
  }, [scheduledTasks, chronotype]);

  const handleApplyResolution = (taskId: string, targetTime: string) => {
    onUpdateTaskTime(taskId, targetTime);
  };

  const getEisenhowerColor = (q: string) => {
    switch (q) {
      case 'Q1': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Q2': return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'Q3': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const activeProposedTask = studySlotProposal?.candidates?.find(t => t.id === selectedTaskId) || studySlotProposal?.matchedTask;
  const isNudgeVisible = studySlotProposal && studySlotProposal.slot !== dismissedSlot;

  return (
    <div className="space-y-6">
      
      {/* ⚠️ Conflict Warnings Area (AC-PB1-01) */}
      {conflicts.length > 0 && (
        <div id="conflict-alerts-container" className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-3 transition-all duration-300">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 animate-bounce-subtle" />
            <h4 className="font-sans font-bold text-sm">Phát hiện xung đột lịch ({conflicts.length})</h4>
          </div>

          <div className="divide-y divide-rose-100 space-y-2.5">
            {conflicts.map((conf, index) => (
              <div key={index} className="pt-2 text-xs text-rose-700 font-medium">
                <p className="leading-relaxed">
                  Nhiệm vụ <strong>&quot;{conf.taskB.title}&quot;</strong> clashing chèn giờ với{' '}
                  <strong>&quot;{conf.taskA.title}&quot;</strong> ({conf.taskA.scheduled_at} + {conf.taskA.estimated_min}m).
                </p>

                {/* Reschedule Suggestion Block (AC-PB1-02) */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 p-3 bg-white/95 border border-rose-200 rounded-xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 font-bold" />
                    <span>Chúng tôi gợi ý dời <strong>&quot;{conf.taskB.title}&quot;</strong> sang:</span>
                    <span className="font-mono bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-600 font-bold">
                      {conf.suggestion}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-apply-suggestion-${conf.taskB.id}`}
                      onClick={() => handleApplyResolution(conf.taskB.id, conf.suggestion)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🦉 Chronobiology Nudges (PB-F3) */}
      {chronotypeNudges.length > 0 && (
        <div id="chronobiology-alerts-container" className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3 transition-all duration-300">
          <div className="flex items-center gap-2 text-amber-800">
            <Zap className="w-5 h-5 shrink-0 text-amber-500 animate-pulse" />
            <h4 className="font-sans font-bold text-sm">Gợi ý Nhịp Sinh Học ({chronotypeNudges.length})</h4>
          </div>

          <div className="divide-y divide-amber-100/60 space-y-2.5">
            {chronotypeNudges.map((nudge, index) => (
              <div key={index} className="pt-2 text-xs text-amber-900 font-medium">
                <p className="leading-relaxed">
                  Nhiệm vụ <strong>&quot;{nudge.task.title}&quot;</strong>: {nudge.reason}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 p-3 bg-white/95 border border-amber-200/60 rounded-xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-amber-500 font-bold" />
                    <span>Chuyển sang giờ đề xuất:</span>
                    <span className="font-mono bg-amber-100/50 px-1.5 py-0.5 rounded text-amber-700 font-bold">
                      {nudge.suggestion}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApplyResolution(nudge.task.id, nudge.suggestion)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Chuyển lịch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📚 Smart Slot-Scheduling Nudge (PB-5.1) */}
      {isNudgeVisible && studySlotProposal && (
        <div id="education-timebox-container" className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3 animate-fade-in">
          <div className="p-1.5 bg-teal-600 text-white rounded-lg mt-0.5 shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs text-left">
            <h5 className="font-bold text-teal-900">Gợi ý xếp lịch thông minh</h5>
            
            {activeProposedTask ? (
              <div className="mt-1">
                <p className="text-teal-700 mb-2 leading-relaxed">
                  Phát hiện khoảng trống {studySlotProposal.duration} phút lúc <strong className="font-mono">{studySlotProposal.slot}</strong> ({studySlotProposal.reason}). Bạn muốn xếp lịch cho nhiệm vụ này chứ?
                </p>
                <select 
                  className="w-full mb-3 p-2 bg-white border border-teal-200 rounded-lg text-teal-900 font-medium shadow-sm outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  value={activeProposedTask.id}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                  {studySlotProposal.candidates?.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.category}] {c.title} ({c.estimated_min}m)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-teal-700 mt-1 mb-2">
                {studySlotProposal.reason}. Đề xuất củng cố kỹ năng lúc <strong className="font-mono">{studySlotProposal.slot}</strong> ({studySlotProposal.duration} phút).
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <button
                id="btn-confirm-timebox"
                onClick={() => {
                  if (activeProposedTask) {
                    onScheduleUnscheduledTask?.(activeProposedTask.id, studySlotProposal.slot);
                    setDismissedSlot(null);
                    setSelectedTaskId(null);
                  } else {
                    onOpenCreateTask(studySlotProposal.slot);
                  }
                }}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-all shadow-sm"
              >
                {activeProposedTask ? 'Xếp lịch ngay' : 'Tạo lịch học mới'}
              </button>

              <button
                id="btn-ignore-timebox"
                onClick={() => {
                  setDismissedSlot(studySlotProposal.slot);
                  setSelectedTaskId(null);
                }}
                className="px-4 py-1.5 bg-white hover:bg-teal-50 text-teal-700 text-[11px] font-bold rounded-lg cursor-pointer border border-teal-200 transition-colors"
                title="Bỏ qua khe trống này"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Calendar List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            Lịch Trình Trong Ngày
          </h4>
          <span className="text-xs text-gray-500 font-medium font-mono">24-Hour Day view</span>
        </div>

        {scheduledTasks.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            Chưa có công việc nào được hẹn giờ hôm nay. Hãy kéo/edit để gán giờ bắt đầu.
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-4">
            {scheduledTasks.map((task) => {
              const startMin = timeStringToMinutes(task.scheduled_at!);
              const endMin = startMin + task.estimated_min;
              const endTimeStr = minutesToTimeString(endMin);

              return (
                <div key={task.id} className="relative group/timeline-item">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full transition-transform group-hover/timeline-item:scale-125" />

                  <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 rounded-xl transition cursor-pointer" onClick={() => onSelectTaskToEdit(task)}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 flex items-center gap-1">
                          {task.scheduled_at} <ArrowRight className="w-3 h-3 text-gray-400" /> {endTimeStr}
                        </span>
                        <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-lg uppercase ${getEisenhowerColor(task.eisenhower_q)}`}>
                          {task.eisenhower_q}
                        </span>
                      </div>

                      <h5 className="font-sans font-semibold text-gray-800 text-xs leading-tight">
                        {task.title}
                      </h5>

                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        ⏱️ Ước lượng: {task.estimated_min}phút • {task.category}
                      </p>
                    </div>

                    {/* Manual Offset controls for Fine Tuning (AC-PB1-05) */}
                    <div className="flex flex-col items-end gap-1.5 opacity-40 group-hover/timeline-item:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <button
                          title="Hẹn lùi 15 phút"
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = timeStringToMinutes(task.scheduled_at!);
                            onUpdateTaskTime(task.id, minutesToTimeString(Math.max(0, current - 15)));
                          }}
                          className="p-1 bg-white hover:bg-slate-200 border border-gray-200 text-gray-600 rounded text-[9px] font-bold"
                        >
                          -15m
                        </button>
                        <button
                          title="Hẹn muộn 15 phút"
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = timeStringToMinutes(task.scheduled_at!);
                            onUpdateTaskTime(task.id, minutesToTimeString(current + 15));
                          }}
                          className="p-1 bg-white hover:bg-slate-200 border border-gray-200 text-gray-600 rounded text-[9px] font-bold"
                        >
                          +15m
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
