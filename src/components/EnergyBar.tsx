/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coffee, ShieldAlert, Sparkles, Zap } from 'lucide-react';

interface EnergyBarProps {
  currentScore: number;
  onTakeBreak: () => void;
}

export default function EnergyBar({ currentScore, onTakeBreak }: EnergyBarProps) {
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

  return (
    <div id="energy-bar-widget" className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xs transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
            <Zap className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="font-sans font-medium text-sm text-gray-700">Ngân sách Năng lượng</span>
        </div>
        <span className="font-mono text-sm font-semibold text-gray-800">{currentScore}%</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out-back ${getColorClass(currentScore)}`}
          style={{ width: `${currentScore}%` }}
        />
      </div>

      {/* Warning Alert if <= 20% */}
      {currentScore <= 20 && (
        <div className="flex items-start gap-2.5 p-3 mb-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl animate-bounce-subtle">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Cảnh báo kiệt sức (≤ 20%)</p>
            <p className="opacity-90">Hệ thống khuyên bạn nên dừng lại, phục hồi sức khỏe bằng việc đi dạo hoặc nghỉ ngắn.</p>
          </div>
        </div>
      )}

      {/* Bottom control & dynamic status message */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-gray-500 italic max-w-[200px] leading-relaxed">
          {getStatusText(currentScore)}
        </p>

        <button
          id="btn-take-break"
          onClick={onTakeBreak}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-600 text-xs font-semibold rounded-xl transition-all"
        >
          <Coffee className="w-3.5 h-3.5" />
          Tôi đã nghỉ ngơi (100%)
        </button>
      </div>
    </div>
  );
}
