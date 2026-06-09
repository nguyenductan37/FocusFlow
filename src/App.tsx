/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle,
  Coffee,
  Clock,
  LogOut,
  Moon,
  Plus,
  RefreshCw,
  Sparkles,
  Sun,
  Zap,
  BookOpen,
  CheckSquare,
  Trophy,
  Undo
} from 'lucide-react';
import { Task, TaskCategory, TaskStatus } from './types';
import { INITIAL_TASLES, getTodayDateString, getYesterdayDateString } from './utils/dummyData';
import TaskList from './components/TaskList';
import Scheduler from './components/Scheduler';
import EnergyBar from './components/EnergyBar';
import DecisionAssistant from './components/DecisionAssistant';
import ClosureModal from './components/ClosureModal';
import TaskFormModal from './components/TaskFormModal';
import GrowthDashboard from './components/GrowthDashboard';
import AIParsingBar from './components/AIParsingBar';
import { splitTaskIntoMicroSteps } from './utils/gemini';
import FocusOverlay from './components/FocusOverlay';
import { playFocusAlertSound } from './utils/focusUtils';

export default function App() {
  // ---- 1. CORE APPLICATION STATE ----
  const [tasks, setTasks] = useState<Task[]>([]);
  const [energyScore, setEnergyScore] = useState<number>(100);
  const [isOffMode, setIsOffMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'growth'>('dashboard');
  const [isSplittingTaskId, setIsSplittingTaskId] = useState<string | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Real-time local clock (for precise EOD boundary & tracking)
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Keep local clock updated precisely every second
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PB-F6: Trigger Focus Mode when time matches
  useEffect(() => {
    if (focusTask) return;
    
    const today = getTodayDateString();
    
    const scheduledTask = tasks.find(t => 
      t.due_date === today &&
      t.scheduled_at === currentTime &&
      t.status !== 'DONE' &&
      (t.category === 'Làm việc' || t.category === 'Học tập') &&
      (t.eisenhower_q === 'Q1' || t.eisenhower_q === 'Q2') &&
      (t.energy_level === 'HIGH' || t.energy_level === 'MEDIUM')
    );

    if (scheduledTask) {
      playFocusAlertSound();
      setFocusTask(scheduledTask);
    }
  }, [currentTime, tasks, focusTask]);

  // Modal Control States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isClosureOpen, setIsClosureOpen] = useState(false);

  // Fallbacks for Quick Creation
  const [defaultDuration, setDefaultDuration] = useState<number | undefined>(undefined);
  const [defaultHour, setDefaultHour] = useState<string | undefined>(undefined);
  const [defaultCategory, setDefaultCategory] = useState<TaskCategory | undefined>(undefined);

  // ---- 2. LOCAL STORAGE LIFECYCLE ----
  useEffect(() => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    const savedEnergy = localStorage.getItem('focusflow_energy');
    const savedOffMode = localStorage.getItem('focusflow_is_off_mode');

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks(INITIAL_TASLES);
      }
    } else {
      setTasks(INITIAL_TASLES);
    }

    if (savedEnergy) {
      setEnergyScore(Number(savedEnergy) || 100);
    } else {
      setEnergyScore(100);
    }

    if (savedOffMode) {
      setIsOffMode(savedOffMode === 'true');
    }
  }, []);

  // Sync helpers
  const saveTasksToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('focusflow_tasks', JSON.stringify(updatedTasks));
  };

  // ---- 4. HANDLERS AND EVENT ACTIONS ----

  // Task Creation and Updation
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed_at'> & { id?: string }) => {
    if (taskData.id) {
      // Edit mode
      const updated = tasks.map((t) => {
        if (t.id === taskData.id) {
          // Check if due_date was postponed
          let newPostponeCount = t.postpone_count || 0;
          if (taskData.due_date && t.due_date && taskData.due_date > t.due_date) {
            newPostponeCount += 1;
          }

          return {
            ...t,
            title: taskData.title,
            description: taskData.description,
            category: taskData.category,
            eisenhower_q: taskData.eisenhower_q,
            energy_level: taskData.energy_level,
            estimated_min: taskData.estimated_min,
            scheduled_at: taskData.scheduled_at,
            status: taskData.status,
            due_date: taskData.due_date,
            postpone_count: newPostponeCount,
          };
        }
        return t;
      });
      saveTasksToStorage(updated);
    } else {
      // New Task
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        category: taskData.category,
        eisenhower_q: taskData.eisenhower_q,
        energy_level: taskData.energy_level,
        estimated_min: taskData.estimated_min,
        scheduled_at: taskData.scheduled_at,
        due_date: taskData.due_date || getTodayDateString(),
      };
      saveTasksToStorage([...tasks, newTask]);
    }
    setTaskToEdit(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasksToStorage(updated);
    setTaskToEdit(null);
  };

  const handleUpdateTaskTime = (taskId: string, newTime: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, scheduled_at: newTime };
      }
      return t;
    });
    saveTasksToStorage(updated);
  };

  // Set Task back or forward to active & deplete/restore energy (AC-PB31-02)
  const handleToggleTaskComplete = (taskId: string) => {
    const match = tasks.find((t) => t.id === taskId);
    if (!match) return;

    const isNowDone = match.status !== 'DONE';
    const nextStatus: TaskStatus = isNowDone ? 'DONE' : 'TODO';

    // Update Energy Index correspondingly
    let energyDelta = 0;
    if (match.energy_level === 'HIGH') energyDelta = 15;
    else if (match.energy_level === 'MEDIUM') energyDelta = 8;
    else energyDelta = 3;

    setEnergyScore((current) => {
      const nextScore = isNowDone
        ? Math.max(0, current - energyDelta)
        : Math.min(100, current + energyDelta);
      
      localStorage.setItem('focusflow_energy', String(nextScore));
      return nextScore;
    });

    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: nextStatus,
          completed_at: isNowDone ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    saveTasksToStorage(updated);
  };

  const handleStartTaskInstantly = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: 'IN_PROGRESS' as const };
      }
      return t;
    });
    saveTasksToStorage(updated);
  };

  // Reset energy to 100% (AC-PB31-04)
  const handleTakeBreak = () => {
    setEnergyScore(100);
    localStorage.setItem('focusflow_energy', '100');
  };

  // Exit OFF Mode (AC-PB2-05)
  const handleExitOffMode = () => {
    setIsOffMode(false);
    localStorage.setItem('focusflow_is_off_mode', 'false');
  };

  // EOD closure confirmation (PB-2.1)
  const handleConfirmClosure = (tomorrowPlanIds: string[]) => {
    setIsOffMode(true);
    localStorage.setItem('focusflow_is_off_mode', 'true');
    setIsClosureOpen(false);

    // Build tomorrow date string
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    // Update selected tasks due dating and reset their hours
    const updated = tasks.map((t) => {
      if (tomorrowPlanIds.includes(t.id)) {
        return {
          ...t,
          due_date: tomorrowStr,
          status: 'TODO' as const,
          scheduled_at: undefined, // let them reschedule fresh!
          postpone_count: (t.postpone_count || 0) + 1,
        };
      }
      return t;
    });

    saveTasksToStorage(updated);
    alert('Đã đóng ngày hoàn thiện! Trạng thái OFF đã được kích hoạt. Hãy tận hưởng kỳ nghỉ ngắn ngắt kết nối tâm lý tốt nhất! 🌸');
  };

  // PB-F2: Split large deferred task into micro steps
  const handleSplitTask = async (taskId: string) => {
    const parentTask = tasks.find((t) => t.id === taskId);
    if (!parentTask) return;

    setIsSplittingTaskId(taskId);
    try {
      const microSteps = await splitTaskIntoMicroSteps(parentTask.title, parentTask.description);
      
      if (microSteps.length > 0) {
        const newTasks: Task[] = microSteps.map((step, index) => ({
          id: `t-split-${Date.now()}-${index}`,
          title: step.title,
          description: `Được rã nhỏ từ: ${parentTask.title}`,
          status: 'TODO' as const,
          category: parentTask.category,
          eisenhower_q: parentTask.eisenhower_q,
          energy_level: step.energy_level,
          estimated_min: step.estimated_min,
          due_date: parentTask.due_date,
        }));

        // Remove parent task and add new micro tasks
        const updatedTasks = [...tasks.filter((t) => t.id !== taskId), ...newTasks];
        saveTasksToStorage(updatedTasks);
      } else {
        alert('Không thể rã nhỏ task này. Vui lòng thử lại!');
      }
    } catch (error: any) {
      alert(`Có lỗi xảy ra khi rã nhỏ: ${error?.message || 'Vui lòng thử lại sau!'}`);
    } finally {
      setIsSplittingTaskId(null);
    }
  };

  // Handlers for FocusOverlay (PB-F6)
  const handleFocusComplete = (actualMin: number) => {
    if (!focusTask) return;
    const updated = tasks.map((t) => {
      if (t.id === focusTask.id) {
        return {
          ...t,
          status: 'DONE' as const,
          completed_at: new Date().toISOString(),
          actual_min: (t.actual_min || 0) + actualMin,
        };
      }
      return t;
    });
    saveTasksToStorage(updated);
    setFocusTask(null);
    setEnergyScore((curr) => Math.max(0, curr - 15)); // Drain energy after deep work
  };

  const handleFocusDefer = (reason: string) => {
    if (!focusTask) return;
    const updated = tasks.map((t) => {
      if (t.id === focusTask.id) {
        return {
          ...t,
          status: 'TODO' as const, // Reset to TODO
          postpone_count: (t.postpone_count || 0) + 1,
          postpone_reasons: [...(t.postpone_reasons || []), reason],
        };
      }
      return t;
    });
    saveTasksToStorage(updated);
    setFocusTask(null);
  };

  const handleOpenCreateWithPresets = (duration?: number, hour?: string) => {
    setDefaultDuration(duration);
    setDefaultHour(hour);
    // If hour was recommended for learning, pre-assign category to Study
    setDefaultCategory(hour ? 'Học tập' : 'Làm việc');
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // ---- 5. COMPUTED VALUES ----

  // Active uncompleted tasks for today
  const activeTasksToday = useMemo(() => {
    const todayStr = getTodayDateString();
    return tasks.filter((t) => t.status !== 'DONE' && (t.due_date === todayStr || !t.due_date));
  }, [tasks]);

  // Is EOD closure currently available? (AC-PB2-01)
  // Visible if NOT in Off Mode, AND either current Hour is after 17:00 (17:00 is min 1020) OR all active tasks are completed
  const isClosureActionAvailable = useMemo(() => {
    if (isOffMode) return false;
    
    // Check current local hours
    const [h, m] = currentTime.split(':').map(Number);
    const minsCurrent = h * 60 + m;
    const isPast17 = minsCurrent >= 17 * 60; // 17:00

    // Check if any unfinished task remains for today
    const hasUnfinished = activeTasksToday.length > 0;

    return isPast17 || !hasUnfinished;
  }, [isOffMode, currentTime, activeTasksToday]);

  const statsDoneCount = useMemo(() => tasks.filter((t) => t.status === 'DONE').length, [tasks]);
  const statsPendingCount = useMemo(() => tasks.filter((t) => t.status !== 'DONE').length, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 transition-colors duration-300">
      
      {/* Focus Mode Overlay (PB-F6) */}
      {focusTask && (
        <FocusOverlay
          task={focusTask}
          onComplete={handleFocusComplete}
          onDefer={handleFocusDefer}
        />
      )}

      {/* 🌸 OFF MODE OVERLAY WRAPPER BAR (AC-PB2-04) */}
      {isOffMode && (
        <div id="off-mode-floating-banner" className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-4 flex-wrap animate-fade-in">
          <Moon className="w-4 h-4 fill-white animate-spin-slow" />
          <span>BẠN ĐANG TRONG TRẠNG THÁI OFF CHỮA LÀNH (Đã đóng gói ngày làm việc). Cảnh báo & thông báo công việc đã được ngắt hoàn toàn.</span>
          <button
            id="btn-return-to-work"
            onClick={handleExitOffMode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-700 rounded-xl hover:bg-slate-50 transition font-sans font-bold cursor-pointer"
          >
            <Undo className="w-3.5 h-3.5" />
            Quay lại làm việc
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-100 py-3.5 px-6 sticky top-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          
          {/* Logo brand pairing Space Grotesk */}
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-4 h-4 text-yellow-300 fill-current animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-slate-900 leading-tight">FocusFlow</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">30s Priority Assistant</p>
            </div>
          </div>

          {/* Real-time Current Clock section */}
          <div className="p-2.5 bg-indigo-50/80 hover:bg-indigo-50 rounded-2xl flex items-center gap-2 text-xs transition duration-200 border border-indigo-100/50">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="font-mono text-indigo-500 font-bold uppercase tracking-wider">Giờ hiện tại:</span>
            <span className="font-mono text-indigo-700 font-extrabold text-xs px-2.5 py-1 bg-white border border-indigo-100/60 rounded-xl shadow-xs">
              {currentTime}
            </span>
            {currentTime >= '17:00' && (
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-lg uppercase font-mono animate-bounce-subtle">
                Sau 17h 🥐
              </span>
            )}
          </div>

          {/* Navigation Tab selection */}
          <nav className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              📆 Nhiệm Vụ & Lịch Trình
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'growth'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              📈 Tăng Trưởng Kỹ Năng
            </button>
          </nav>

        </div>
      </header>

      {/* PRIMARY WORKSPACE */}
      <main className="max-w-7xl mx-auto px-6 py-6 transition-all duration-300">
        
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left/Middle primary space : Task matric lists */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Promo Banner introduction */}
              <div className="p-6 bg-white border border-gray-150 rounded-3xl relative overflow-hidden shadow-xs transition-transform hover:scale-[1.002]">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-60" />
                <h2 className="font-display font-medium text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  Lập kế hoạch trong <span className="text-indigo-600 font-bold">30 giây</span>. Dứt điểm ngày không âu lo.
                </h2>
                <p className="text-xs text-gray-500 leading-normal max-w-xl mt-1.5">
                  FocusFlow đồng bộ hóa <strong>Ma trận ranh giới Eisenhower</strong> phối hợp với <strong>ngân sách năng lượng</strong>. Chống lại trì hoãn bằng quy trình đóng mốc ngày, bảo bọc sức khỏe tinh thần bền vững.
                </p>

                {/* Instant assistant floating panel */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Trợ lý đắc lực:</span>
                    <DecisionAssistant
                      tasks={tasks}
                      onStartTask={handleStartTaskInstantly}
                      onOpenCreateTask={handleOpenCreateWithPresets}
                    />
                  </div>

                  {/* 🌙 End of Day closures button trigger (AC-PB2-01) */}
                  {isClosureActionAvailable && (
                    <button
                      id="btn-trigger-closure"
                      onClick={() => setIsClosureOpen(true)}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-sans font-bold text-xs rounded-xl shadow-xs transition duration-200 cursor-pointer"
                    >
                      <Moon className="w-4 h-4 font-bold animate-bounce-subtle" />
                      Kết thúc ngày của tôi 🌌
                    </button>
                  )}
                </div>
              </div>

              {/* AI Auto-Triage Bar */}
              <AIParsingBar onTaskCreated={handleSaveTask} />

              {/* Task list Column widget */}
              <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4 flex-wrap gap-2">
                  <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                    Danh Sách Đầu Việc Đang Thực Thi
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>Đã xong: <strong className="text-emerald-600">{statsDoneCount}</strong></span>
                    <span>Chưa xong: <strong className="text-amber-600">{statsPendingCount}</strong></span>
                  </div>
                </div>

                <TaskList
                  tasks={tasks}
                  onToggleTaskComplete={handleToggleTaskComplete}
                  onSelectTaskToEdit={(t) => {
                    setTaskToEdit(t);
                    setIsTaskModalOpen(true);
                  }}
                  onOpenCreateTask={() => handleOpenCreateWithPresets()}
                  onSplitTask={handleSplitTask}
                  isSplittingTaskId={isSplittingTaskId}
                />
              </div>

              {/* Quick instructions / Info block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Zap className="text-rose-500 w-4 h-4" />, name: 'Q1: Khẩn & Trọng', desc: 'Có thời hạn dồn dập.' },
                  { icon: <BookOpen className="text-teal-500 w-4 h-4" />, name: 'Q2: Hoạch Định', desc: 'Học tập củng cố kĩ năng.' },
                  { icon: <Coffee className="text-gray-400 w-4 h-4" />, name: 'Trạng Thái OFF', desc: 'Giúp não ngắt kết nối dệt cơ chế hồi phục.' },
                ].map((item, index) => (
                  <div key={index} className="p-3 bg-white border border-gray-100 rounded-xl text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-gray-800">
                      {item.icon} {item.name}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Right sidebar column: Active schedulers and energy budget */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Energy bar tracker widget */}
              <EnergyBar
                currentScore={energyScore}
                onTakeBreak={handleTakeBreak}
              />

              {/* Day scheduled chronological view */}
              <Scheduler
                tasks={tasks}
                onUpdateTaskTime={handleUpdateTaskTime}
                onOpenCreateTask={(hour) => handleOpenCreateWithPresets(25, hour)}
                onSelectTaskToEdit={(t) => {
                  setTaskToEdit(t);
                  setIsTaskModalOpen(true);
                }}
              />

            </div>

          </div>
        ) : (
          // Tab 2: Performance Growth Dashboard
          <GrowthDashboard
            tasks={tasks}
          />
        )}
      </main>

      {/* --- FLOATING OR IN-MODAL DIALOG SYSTEMS --- */}

      {/* Task Creation FormModal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={taskToEdit}
        defaultDuration={defaultDuration}
        defaultHour={defaultHour}
        defaultCategory={defaultCategory}
      />

      {/* Closure EOD end of day wizard Panel (PB-2) */}
      <ClosureModal
        isOpen={isClosureOpen}
        tasks={tasks}
        onClose={() => setIsClosureOpen(false)}
        onConfirmClosure={handleConfirmClosure}
      />

      {/* Footer credits block without tech larping or online metadata Indicators */}
      <footer className="py-12 text-center text-xs text-gray-400 leading-normal max-w-xl mx-auto px-6 mt-12 border-t border-gray-100/50">
        <p className="font-medium text-gray-600 font-display">FocusFlow — Đảm bảo sức khỏe nhận thức của bạn hàng ngày.</p>
        <p className="text-[11px] mt-1">Khoa học Ma trận Eisenhower kết hợp chu trình củng cố năng lực & ngắt dọn ranh giới cá nhân.</p>
      </footer>

    </div>
  );
}
