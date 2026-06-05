/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Award, BarChart3, Brain, CheckSquare, Clock, ArrowUpRight, TrendingUp, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Task } from '../types';
import { MOCK_HISTORIC_WEEKS } from '../utils/dummyData';

interface GrowthDashboardProps {
  tasks: Task[];
}

export default function GrowthDashboard({ tasks }: GrowthDashboardProps) {
  const [showFormula, setShowFormula] = useState(false);
  // 📈 1. Ratio computation (Work vs Study vs Admin) (AC-PB5-01)
  const statsByCategory = useMemo(() => {
    // We compute hours based on completed tasks
    const completed = tasks.filter((t) => t.status === 'DONE');
    
    let workMin = 0;
    let studyMin = 0;
    let adminMin = 0;

    completed.forEach((t) => {
      const duration = t.estimated_min || 15;
      if (t.category === 'Làm việc') workMin += duration;
      else if (t.category === 'Học tập') studyMin += duration;
      else if (t.category === 'Admin') adminMin += duration;
    });

    const totalMin = workMin + studyMin + adminMin || 1; // avoid divide by zero

    return {
      workHrs: Number((workMin / 60).toFixed(1)),
      studyHrs: Number((studyMin / 60).toFixed(1)),
      adminHrs: Number((adminMin / 60).toFixed(1)),
      workPct: Math.round((workMin / totalMin) * 100),
      studyPct: Math.round((studyMin / totalMin) * 100),
      adminPct: Math.round((adminMin / totalMin) * 100),
      totalHrs: Number((totalMin / 60).toFixed(1)),
    };
  }, [tasks]);

  // ⏱️ 2. Deep Work high productivity peak hour calculations (AC-PB3-01 to 05)
  const completedHistoryWithDates = useMemo(() => {
    return tasks.filter((t) => t.status === 'DONE' && t.completed_at);
  }, [tasks]);

  const peakHourRecommendation = useMemo(() => {
    // Minimum 7 days or we can offer simulation (AC-PB3-02)
    // For testing and beautiful demos, if they simulate, we immediately show the result
    const logsCount = completedHistoryWithDates.length;
    
    if (logsCount < 4) {
      return {
        hasEnoughData: false,
        msg: `Cần hoàn thành thêm ${4 - logsCount} việc có ghi nhận thời gian để tính giờ tối ưu chuẩn nhất.`,
        suggestedHour: '09:00 - 11:00',
        reason: 'Khung giờ sinh học chuẩn khuyên dùng.',
      };
    }

    // Tally completion hours
    const hourCounts: Record<number, number> = {};
    completedHistoryWithDates.forEach((t) => {
      try {
        const dateObj = new Date(t.completed_at!);
        const hour = dateObj.getUTCHours() + 7; // Vietnam GMT+7 Offset
        const localizedHour = hour % 24;
        hourCounts[localizedHour] = (hourCounts[localizedHour] || 0) + 1;
      } catch (err) {
        // Fallback
      }
    });

    // Find hour with maximum completion ticks
    let maxHour = 9; // default to 9 AM
    let maxCount = 0;
    Object.keys(hourCounts).forEach((h) => {
      const hr = Number(h);
      if (hourCounts[hr] > maxCount) {
        maxCount = hourCounts[hr];
        maxHour = hr;
      }
    });

    const endHour = (maxHour + 2) % 24;
    const formatTime = (hr: number) => `${String(hr).padStart(2, '0')}:00`;

    return {
      hasEnoughData: true,
      msg: `Phân tích thành công từ ${logsCount} đầu việc đa tần suất.`,
      suggestedHour: `${formatTime(maxHour)} - ${formatTime(endHour)}`,
      reason: `Bạn đã thực hiện ${maxCount} việc trong mốc giờ này. Sóng não của bạn hoạt động bùng nổ nhất tại đây.`,
    };
  }, [completedHistoryWithDates]);

  // 🔥 Scan and extract at most 2 uncompleted high energy and high-priority (Q1/Q2) tasks (AC-PB3-04)
  const suggestedDeepWorkTasks = useMemo(() => {
    return tasks
      .filter(
        (t) =>
          t.status !== 'DONE' &&
          t.energy_level === 'HIGH' &&
          (t.eisenhower_q === 'Q1' || t.eisenhower_q === 'Q2')
      )
      .slice(0, 2);
  }, [tasks]);

  // 📈 Calculation of real current week summary statistics based on user's tasks (AC-PB5-03)
  const realCurrentWeekStats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === 'DONE');
    let workMin = 0;
    let studyMin = 0;
    let adminMin = 0;
    let totalScore = 0;

    completedTasks.forEach((t) => {
      const duration = t.estimated_min || 15;
      if (t.category === 'Làm việc') workMin += duration;
      else if (t.category === 'Học tập') studyMin += duration;
      else if (t.category === 'Admin') adminMin += duration;

      // Calculate score based on: Score_Task = Effort_Factor (Energy) * Duration_In_Hours * Strategy_Weight (Eisenhower)
      // Duration in hours
      const durationInHours = duration / 60;

      // Effort Factor based on Energy
      let effortFactor = 1.0;
      if (t.energy_level === 'HIGH') effortFactor = 4.0;
      else if (t.energy_level === 'MEDIUM') effortFactor = 2.0;
      else if (t.energy_level === 'LOW') effortFactor = 1.0;

      // Strategy Weight based on Eisenhower Matrix
      let strategyWeight = 1.0;
      if (t.eisenhower_q === 'Q2') strategyWeight = 1.5;
      else if (t.eisenhower_q === 'Q1') strategyWeight = 1.2;
      else if (t.eisenhower_q === 'Q3') strategyWeight = 0.8;
      else if (t.eisenhower_q === 'Q4') strategyWeight = 0.3;

      const taskScore = effortFactor * durationInHours * strategyWeight;
      totalScore += taskScore;
    });

    const workHrs = Number((workMin / 60).toFixed(1));
    const studyHrs = Number((studyMin / 60).toFixed(1));
    const adminHrs = Number((adminMin / 60).toFixed(1));
    const score = Number(totalScore.toFixed(1));

    return {
      weekLabel: 'Tuần này',
      'Làm việc': workHrs,
      'Học tập': studyHrs,
      'Admin': adminHrs,
      score,
    };
  }, [tasks]);

  // Combine dynamic current week with historical past weeks (AC-PB5-02 & AC-PB5-03)
  const historicWeeksData = useMemo(() => {
    const pastWeeks = MOCK_HISTORIC_WEEKS.slice(0, 3);
    return [...pastWeeks, realCurrentWeekStats];
  }, [realCurrentWeekStats]);

  // Compute standard growth rate comparing this week's score with the previous week (AC-PB5-03)
  const growthRate = useMemo(() => {
    const lastWeekScore = historicWeeksData[2]?.score || 0;
    const thisWeekScore = historicWeeksData[3]?.score || 0;

    if (lastWeekScore === 0) {
      if (thisWeekScore > 0) return { pct: 100, isPositive: true, isNeutral: false };
      return { pct: 0, isPositive: false, isNeutral: true };
    }

    const diff = thisWeekScore - lastWeekScore;
    const pct = Number(((diff / lastWeekScore) * 100).toFixed(1));

    return {
      pct: Math.abs(pct),
      isPositive: pct > 0,
      isNeutral: pct === 0,
    };
  }, [historicWeeksData]);

  // 📊 SVG Layout computation for historic Weeks
  const maxWeeklyHourSum = useMemo(() => {
    let maxVal = 10;
    historicWeeksData.forEach((w) => {
      const sum = w['Làm việc'] + w['Học tập'] + w['Admin'];
      if (sum > maxVal) maxVal = sum;
    });
    return maxVal;
  }, [historicWeeksData]);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Module 1: Peak Productivity Hours (Epic 3 - PB-3) */}
        <div id="peak-hours-widget" className="md:col-span-1 p-5 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Brain className="w-4 h-4" />
            </div>
            <h4 className="font-sans font-bold text-sm text-gray-800">Khung giờ Deep Work tối ưu</h4>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
            <span className="text-[9px] bg-indigo-600 text-white font-mono font-bold px-1.5 py-0.5 rounded absolute right-2 top-2 uppercase">
              AI Suggestion
            </span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">MỐC HỆ THỐNG ĐỀ XUẤT</p>
            <h3 className="font-mono text-xl font-bold text-indigo-600">
              {peakHourRecommendation.suggestedHour}
            </h3>
            <p className="text-xs text-gray-700 leading-normal font-medium mt-1">
              {peakHourRecommendation.reason}
            </p>
          </div>

          <div className="text-[11px] text-gray-500 space-y-1.5 leading-relaxed bg-indigo-50/40 p-3 rounded-lg border border-indigo-100/50">
            <p className="font-semibold text-indigo-900">🔬 Phân tích tiến trình:</p>
            <p>{peakHourRecommendation.msg}</p>
            <p className="italic text-[10px]">*Hệ thống tự động ghi nhận ngầm khi bạn đánh dấu hoàn thành nhiệm vụ.</p>
          </div>

          {/* 🔥 Proposed Deep Work Tasks (AC-PB3-04) */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h5 className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>🔥</span> Tác vụ Deep Work đề xuất
            </h5>
            
            {suggestedDeepWorkTasks.length > 0 ? (
              <div className="space-y-2">
                {suggestedDeepWorkTasks.map((t) => (
                  <div key={t.id} className="p-3 bg-red-50/25 hover:bg-red-50/40 border border-red-100/20 hover:border-red-100/40 rounded-xl transition duration-205 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-sans font-bold text-xs text-slate-800 line-clamp-2">
                        {t.title}
                      </span>
                      <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        t.eisenhower_q === 'Q1' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {t.eisenhower_q}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold font-mono">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                        {t.category}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-extrabold text-[9px] translate-y-[0.5px]">
                        ⚡ HIGH ENERGY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-gray-200 rounded-xl p-3.5 text-center">
                <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold">
                  Hãy tạo hoặc sửa đổi phân loại thêm nhiệm vụ sâu (**Năng lượng Cao, Q1 & Q2**) để hệ thống lên biểu đồ và đề xuất vào khung giờ vàng của bạn!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: 4-Week SVG Chart (Epic 5 - PB-5) */}
        <div id="chart-historic-weeks" className="md:col-span-2 p-5 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-800">Biểu đồ Tăng trưởng Kỹ năng</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Thống kê tích lũy 4 tuần (Làm việc vs Học tập vs Admin)</p>
              </div>
            </div>
            
            {/* Week Comparison Score (AC-PB5-03) */}
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl shadow-2xs border ${
                growthRate.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : growthRate.isNeutral
                    ? 'bg-slate-50 text-slate-600 border-slate-100'
                    : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                <ArrowUpRight className={`w-3 h-3 ${!growthRate.isPositive && 'rotate-90'}`} />
                {growthRate.isPositive ? '+' : ''}{growthRate.isNeutral ? '' : (growthRate.isPositive ? '' : '-')}{growthRate.pct}% so với tuần trước
              </span>
              <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-extrabold text-right">Điểm tiến độ kỹ năng</p>
            </div>
          </div>
 
          {/* SVG Custom Gorgeous Stacked Bar Chart */}
          <div className="relative pt-2">
            <div className="flex justify-between items-end h-44 border-b border-gray-100 pb-2">
              {historicWeeksData.map((w, idx) => {
                const total = Number((w['Làm việc'] + w['Học tập'] + w['Admin']).toFixed(1));
                const hWork = (w['Làm việc'] / maxWeeklyHourSum) * 100;
                const hStudy = (w['Học tập'] / maxWeeklyHourSum) * 100;
                const hAdmin = (w['Admin'] / maxWeeklyHourSum) * 100;
 
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-help">
                    {/* Tooltip on hover */}
                    <div className="absolute top-0 opacity-0 group-hover/bar:opacity-100 bg-slate-900 text-white text-[10px] py-2 px-3 rounded-xl transition-opacity flex flex-col gap-1 font-mono font-bold z-10 shadow-lg border border-slate-700 text-left">
                      <span className="text-yellow-400 font-sans font-bold">🎯 {w.weekLabel}</span>
                      <span className="text-indigo-300">📈 Điểm kĩ năng: {w.score}</span>
                      <span className="border-t border-slate-800 my-0.5" />
                      <span>💼 Work: {w['Làm việc']}h</span>
                      <span>📚 Study: {w['Học tập']}h</span>
                      <span>⚙️ Admin: {w['Admin']}h</span>
                    </div>
 
                    {/* Stacked bar */}
                    <div className="w-8 flex flex-col justify-end h-32 rounded-lg overflow-hidden gap-[1px]">
                      {/* Admin block */}
                      <div className="bg-amber-400 hover:brightness-105 transition-all" style={{ height: `${hAdmin}%` }} title={`Admin: ${w['Admin']}h`} />
                      {/* Study block */}
                      <div className="bg-teal-500 hover:brightness-105 transition-all" style={{ height: `${hStudy}%` }} title={`Học tập: ${w['Học tập']}h`} />
                      {/* Work block */}
                      <div className="bg-indigo-600 hover:brightness-105 transition-all" style={{ height: `${hWork}%` }} title={`Làm việc: ${w['Làm việc']}h`} />
                    </div>
 
                    {/* Meta stats */}
                    <span className="font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">{total}h</span>
                    <span className="text-[10px] text-gray-600 font-bold">{w.weekLabel}</span>
                  </div>
                );
              })}
            </div>
 
            {/* Legend & Formula */}
            <div className="pt-4 border-t border-gray-100/80 space-y-3">
              <div className="flex items-center justify-between gap-4 flex-wrap pt-1 text-[11px] font-bold text-gray-600">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 bg-indigo-600 rounded-sm" /> 💼 Làm việc
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 bg-teal-500 rounded-sm" /> 📚 Học tập
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-sm" /> ⚙️ Admin (Vặt)
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowFormula(!showFormula)}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 active:scale-98 text-indigo-700 text-[11px] font-bold rounded-xl transition shadow-3xs cursor-pointer border border-indigo-100/40"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-650" />
                  {showFormula ? 'Ẩn công thức tính điểm' : 'Xem công thức tính điểm'}
                  {showFormula ? <ChevronUp className="w-3.5 h-3.5 ml-0.5 text-indigo-550" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-indigo-550" />}
                </button>
              </div>
              
              {showFormula && (
                <div className="text-[11px] leading-relaxed text-slate-600 bg-indigo-50/50 border border-indigo-100/40 p-4.5 rounded-2xl max-w-xl mx-auto space-y-3.5 shadow-2xs">
                  <div className="text-center space-y-1">
                    <p className="font-bold text-indigo-950 flex items-center justify-center gap-1.5 text-xs">
                      <span>⚡</span> Thuật toán Điểm Tăng Trưởng Kỹ Năng Tự Động (Weekly Skill Score)
                    </p>
                    <code className="inline-block bg-white border border-indigo-150 py-1.5 px-4 rounded-xl text-indigo-700 font-mono font-black text-xs shadow-3xs">
                      Score_Task = Effort_Factor × Duration_In_Hours × Strategy_Weight
                    </code>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] pt-1">
                    <div className="bg-white/80 border border-slate-100 p-2 rounded-xl space-y-1">
                      <p className="font-bold text-gray-700 uppercase tracking-wider text-[9px]">💡 1. Hệ số Năng lượng (Effort Factor)</p>
                      <ul className="list-disc pl-3.5 space-y-0.5 font-medium text-gray-500">
                        <li>⚡ Mức Cao (HIGH): <span className="font-bold text-indigo-600">4.0đ</span>/giờ</li>
                        <li>⚡ Trung bình (MEDIUM): <span className="font-bold text-indigo-600">2.0đ</span>/giờ</li>
                        <li>⚡ Mức Thấp (LOW): <span className="font-bold text-indigo-600">1.0đ</span>/giờ</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/80 border border-slate-100 p-2 rounded-xl space-y-1">
                      <p className="font-bold text-gray-700 uppercase tracking-wider text-[9px]">🎯 2. Trọng số Chiến lược (Strategy Weight)</p>
                      <ul className="list-disc pl-3.5 space-y-0.5 font-medium text-gray-500">
                        <li>🟦 Ô Q2 (Chiến lược): <span className="font-bold text-teal-600">x1.5</span> (Điểm thưởng cao)</li>
                        <li>🟥 Ô Q1 (Khủng hoảng): <span className="font-bold text-rose-600">x1.2</span> (+20%)</li>
                        <li>🟨 Ô Q3 (Chen ngang): <span className="font-bold text-amber-600">x0.8</span> (-20%)</li>
                        <li>🟩 Ô Q4 (Phân tâm): <span className="font-bold text-slate-600">x0.3</span> (Hạ điểm)</li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-indigo-500 font-semibold italic text-center leading-normal pt-1 border-t border-indigo-150/50">
                    *Công việc được đổi từ phút thành giờ (Duration_In_Hours = phút / 60). Mô hình giúp định hướng người dùng giải quyết các tác vụ có chiều sâu (HIGH) và thúc đẩy công việc mang tinh chất chiến lược nằm tại ô Q2!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Category breakdown circles / lines */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-xs">
        <h4 className="font-sans font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
          📊 Phân phối hiệu suất thực tế (Hôm nay)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: '💼 LÀM VIỆC', time: statsByCategory.workHrs, pct: statsByCategory.workPct, color: 'bg-indigo-600' },
            { label: '📚 HỌC TẬP', time: statsByCategory.studyHrs, pct: statsByCategory.studyPct, color: 'bg-teal-500' },
            { label: '⚙️ ADMIN / VẶT', time: statsByCategory.adminHrs, pct: statsByCategory.adminPct, color: 'bg-amber-400' },
          ].map((cat, index) => (
            <div key={index} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{cat.label}</p>
                <h5 className="font-sans font-black text-gray-800 text-base mt-0.5">{cat.time}h</h5>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-black text-gray-700">{cat.pct || 0}%</span>
                {/* Visual bar mini indicator */}
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 bg-gray-50 border border-gray-100">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct || 0}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
