/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Plus, Trash2, CheckCircle, Circle, Edit2, Play, Info, AlertTriangle } from 'lucide-react';
import { EisenhowerQuadrant, EnergyLevel, Task, TaskCategory, TaskStatus } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTaskComplete: (taskId: string) => void;
  onSelectTaskToEdit: (task: Task) => void;
  onOpenCreateTask: () => void;
  onSplitTask?: (taskId: string) => void;
  isSplittingTaskId?: string | null;
}

export default function TaskList({
  tasks,
  onToggleTaskComplete,
  onSelectTaskToEdit,
  onOpenCreateTask,
  onSplitTask,
  isSplittingTaskId,
}: TaskListProps) {
  const [filterQuarter, setFilterQuarter] = useState<EisenhowerQuadrant | 'ALL'>('ALL');
  const [filterEnergy, setFilterEnergy] = useState<EnergyLevel | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ACTIVE_ONLY'>('ACTIVE_ONLY');

  // Compute filtered items (AC-PB11-04)
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchQuarter = filterQuarter === 'ALL' || t.eisenhower_q === filterQuarter;
      const matchEnergy = filterEnergy === 'ALL' || t.energy_level === filterEnergy;
      const matchCategory = filterCategory === 'ALL' || t.category === filterCategory;
      
      let matchStatus = true;
      if (filterStatus === 'ACTIVE_ONLY') {
        matchStatus = t.status !== 'DONE';
      } else {
        matchStatus = t.status === filterStatus;
      }

      return matchQuarter && matchEnergy && matchCategory && matchStatus;
    });
  }, [tasks, filterQuarter, filterEnergy, filterCategory, filterStatus]);

  const getQuadrantLabel = (q: string) => {
    switch (q) {
      case 'Q1': return 'Q1: Quan trọng/Khẩn cấp';
      case 'Q2': return 'Q2: Quan trọng/Không khẩn';
      case 'Q3': return 'Q3: Khẩn cấp/Ít quan trọng';
      default: return 'Q4: Ít khẩn/Ít quan trọng';
    }
  };

  const getQuadrantColor = (q: string) => {
    switch (q) {
      case 'Q1': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'Q2': return 'bg-teal-50 border-teal-200 text-teal-700';
      case 'Q3': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getEnergyBadge = (lvl: string) => {
    switch (lvl) {
      case 'HIGH': return '⚡ Cao (Deep Work)';
      case 'MEDIUM': return '⚡ Trung bình';
      default: return '⚡ Thấp (Admin)';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Học tập': return '📚';
      case 'Admin': return '⚙️';
      default: return '💼';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Filters Hub Card (AC-PB11-04) */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-sans font-bold text-xs uppercase tracking-wider">Bộ lọc thông minh Ma trận</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Quarter filter */}
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Ma trận Eisenhower</label>
            <select
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value as any)}
              className="w-full bg-white border border-gray-100 p-2 rounded-xl font-medium"
            >
              <option value="ALL">Tất cả các ô</option>
              <option value="Q1">Q1: Khẩn & Quan trọng</option>
              <option value="Q2">Q2: Quan trọng, Ko khẩn</option>
              <option value="Q3">Q3: Khẩn, Ít quan trọng</option>
              <option value="Q4">Q4: Ít khẩn, Ít q.trọng</option>
            </select>
          </div>

          {/* Energy filter */}
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Cấp năng lượng</label>
            <select
              value={filterEnergy}
              onChange={(e) => setFilterEnergy(e.target.value as any)}
              className="w-full bg-white border border-gray-100 p-2 rounded-xl font-medium"
            >
              <option value="ALL">Mọi mức năng lượng</option>
              <option value="HIGH">Cao (Deep Work)</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Thấp (Admin)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Danh mục</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="w-full bg-white border border-gray-100 p-2 rounded-xl font-medium"
            >
              <option value="ALL">Tất cả danh mục</option>
              <option value="Làm việc">💼 Làm việc</option>
              <option value="Học tập">📚 Học tập</option>
              <option value="Admin">⚙️ Admin / Vặt</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Trạng thái việc</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-white border border-gray-100 p-2 rounded-xl font-medium"
            >
              <option value="ACTIVE_ONLY">Đầu việc Chưa xong</option>
              <option value="TODO">Chưa bắt đầu (TODO)</option>
              <option value="IN_PROGRESS">Đang tiến hành (IN PROGRESS)</option>
              <option value="BLOCKED">Bị chặn (BLOCKED)</option>
              <option value="DEFERRED">Đã dời ngày (DEFERRED)</option>
              <option value="DONE">Hoàn thành (DONE)</option>
            </select>
          </div>
        </div>

        {/* Clear filter triggers */}
        {(filterQuarter !== 'ALL' || filterEnergy !== 'ALL' || filterCategory !== 'ALL' || filterStatus !== 'ACTIVE_ONLY') && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilterQuarter('ALL');
                setFilterEnergy('ALL');
                setFilterCategory('ALL');
                setFilterStatus('ACTIVE_ONLY');
              }}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold underline cursor-pointer"
            >
              Xóa các bộ lọc đang áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Primary list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2">
          <p className="text-xs text-gray-500 font-bold">
            Hiển thị {filteredTasks.length} trên tổng {tasks.length} đầu việc
          </p>
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tạo Task Mới
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-white">
            Chưa tìm thấy công việc nào thỏa mãn bộ lọc hiện tại.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'DONE';
              return (
                <div
                  key={task.id}
                  id={`task-item-${task.id}`}
                  className={`p-4 bg-white border border-gray-100 hover:border-indigo-150 rounded-2xl flex items-start gap-3 transition shadow-[0_2px_6px_rgba(0,0,0,0.015)] group relative ${
                    isDone ? 'opacity-65' : ''
                  }`}
                >
                  {/* Mark Completion trigger checkmark */}
                  <button
                    id={`btn-complete-${task.id}`}
                    onClick={() => onToggleTaskComplete(task.id)}
                    className="p-0.5 mt-0.5 rounded-full hover:bg-slate-50 transition cursor-pointer"
                    title={isDone ? 'Mở lại task' : 'Đánh dấu Hoàn thành'}
                  >
                    {isDone ? (
                      <CheckCircle2Modified className="w-5 h-5 text-emerald-500 fill-emerald-50 bg-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 hover:text-indigo-600" />
                    )}
                  </button>

                  {/* Body textual content */}
                  <div className="flex-1 space-y-1.5 min-w-0" onClick={() => onSelectTaskToEdit(task)}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" title={task.category}>
                        {getCategoryIcon(task.category)}
                      </span>
                      <h4 className={`font-sans font-semibold text-xs text-slate-800 leading-snug truncate cursor-pointer hover:text-indigo-600 transition-colors ${isDone ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </h4>
                      {task.scheduled_at && (
                        <span className="font-mono text-[10px] bg-indigo-50 px-1.5 py-0.25 rounded text-indigo-600 font-bold uppercase">
                          🕒 {task.scheduled_at}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className={`text-[11px] text-gray-500 leading-normal line-clamp-2 ${isDone ? 'line-through text-gray-400' : ''}`}>
                        {task.description}
                      </p>
                    )}

                    {/* Meta Indicators row (AC-PB11-03) */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-lg uppercase ${getQuadrantColor(task.eisenhower_q)}`}>
                        {getQuadrantLabel(task.eisenhower_q)}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-bold rounded-lg">
                        {getEnergyBadge(task.energy_level)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium font-mono ml-auto">
                        ⏱️ {task.estimated_min}phút
                      </span>
                    </div>

                    {/* Warning badge & split button (PB-F2) */}
                    {task.postpone_count && task.postpone_count >= 3 && !isDone && (
                      <div className="mt-2.5 p-2 bg-orange-50/80 border border-orange-100 rounded-lg flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Bị dời hạn {task.postpone_count} lần
                        </span>
                        {onSplitTask && (
                          <button
                            onClick={() => onSplitTask(task.id)}
                            disabled={isSplittingTaskId === task.id}
                            className="px-2 py-1 bg-white hover:bg-orange-100 border border-orange-200 text-orange-600 text-[10px] font-bold rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                          >
                            {isSplittingTaskId === task.id ? '⏳ Đang rã nhỏ...' : '🧩 Rã nhỏ bước hành động'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Absolute Edit button triggers */}
                  <button
                    id={`btn-edit-${task.id}`}
                    onClick={() => onSelectTaskToEdit(task)}
                    className="p-1 px-1.5 bg-gray-50 hover:bg-slate-100 text-gray-400 hover:text-gray-600 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Light miniature replacement wrapper
function CheckCircle2Modified(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
