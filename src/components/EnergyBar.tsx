/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coffee, ShieldAlert, Sparkles, Zap, BrainCircuit } from 'lucide-react';

interface EnergyBarProps {
  currentScore: number;
  cognitiveLoad: number;
  onTakeBreak: () => void;
}

export default function EnergyBar({ currentScore, cognitiveLoad, onTakeBreak }: EnergyBarProps) {
  // Determine color based on score
  const getColorClass = (score: number) => {
    if (score > 60) return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    if (score > 20) return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    return 'bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]';
  };

  const getStatusText = (score: number) => {
    if (score > 60) return 'Phong độ đỉnh cao. Sẵn sàng cho Deep Work!';
    if (score > 20) return 'Năng lượng trung bình. Thích hợp cho công việc nhẹ.';
    return 'Cạn kiệt năng lượng! Hãy nghỉ ngơi ngay lập tức.';
  };

  const getCognitiveColor = (load: number) => {
    if (load >= 80) return 'bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]';
    if (load >= 50) return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
  };

  return (
    <div id="energy-bar-widget" className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs transition-all duration-300">
      
      {/* 1. Năng Lượng Thể Chất (Physical Energy) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <span className="font-sans font-medium text-sm text-gray-700">Ngân sách Năng lượng</span>
          </div>
          <span className="font-mono text-sm font-semibold text-gray-800">{currentScore}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out-back ${getColorClass(currentScore)}`}
            style={{ width: `${currentScore}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-500 italic max-w-[250px] leading-relaxed">
          {getStatusText(currentScore)}
        </p>
      </div>

      {/* 2. Tải Nhận Thức (Cognitive Load) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${cognitiveLoad >= 80 ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="font-sans font-medium text-sm text-gray-700">Tải Nhận Thức (CLI)</span>
          </div>
          <span className={`font-mono text-sm font-semibold ${cognitiveLoad >= 80 ? 'text-rose-600' : 'text-gray-800'}`}>
            {Math.round(cognitiveLoad)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out-back ${getCognitiveColor(cognitiveLoad)}`}
            style={{ width: `${cognitiveLoad}%` }}
          />
        </div>
      </div>

      {/* Warning Alert for Cognitive Overload */}
      {cognitiveLoad >= 80 && (
        <div className="flex items-start gap-2.5 p-3 mb-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl animate-bounce-subtle">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-rose-800">Cảnh báo: Quá tải nhận thức!</p>
            <p className="opacity-90 mt-0.5">Sức ép lên não bộ đang rất cao. Hãy cân nhắc nhấp nút nghỉ giải lao bên dưới.</p>
          </div>
        </div>
      )}

      {/* Bottom control */}
      <div className="flex items-center justify-end mt-2 pt-3 border-t border-gray-100">
        <button
          id="btn-take-break"
          onClick={onTakeBreak}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-600 text-xs font-semibold rounded-xl transition-all"
        >
          <Coffee className="w-3.5 h-3.5" />
          Nghỉ giải lao (Reset Năng Lượng)
        </button>
      </div>
    </div>
  );
}
