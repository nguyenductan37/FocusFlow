import React from 'react';
import { Sun, Moon, Activity } from 'lucide-react';
import { Chronotype } from '../types';

interface Props {
  chronotype: Chronotype;
  onRetake: () => void;
}

export default function ChronobiologyCard({ chronotype, onRetake }: Props) {
  if (!chronotype) return null;

  const config = {
    EARLY_BIRD: {
      title: "Nhóm Sơn Ca (Early Bird)",
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      desc: "Hiệu suất của bạn đạt đỉnh cao nhất vào buổi sáng.",
      goldenHours: ["08:00 - 11:00", "15:00 - 17:00"],
      color: "from-amber-100 to-orange-50",
      stroke: "#f59e0b",
      path: "M 0 50 Q 20 50, 30 10 T 60 40 T 90 90 T 100 90"
    },
    NIGHT_OWL: {
      title: "Nhóm Cú Đêm (Night Owl)",
      icon: <Moon className="w-6 h-6 text-indigo-500" />,
      desc: "Hiệu suất của bạn đạt đỉnh cao nhất vào cuối ngày.",
      goldenHours: ["20:00 - 22:00", "14:30 - 16:30"],
      color: "from-indigo-100 to-slate-50",
      stroke: "#6366f1",
      path: "M 0 90 Q 20 90, 40 80 T 70 20 T 90 40 T 100 40"
    },
    THIRD_BIRD: {
      title: "Nhóm Chim Bồ Câu (Third Bird)",
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      desc: "Bạn có nhịp sinh học tiêu chuẩn, năng lượng ổn định giữa ngày.",
      goldenHours: ["09:00 - 11:30", "15:00 - 17:00"],
      color: "from-emerald-100 to-teal-50",
      stroke: "#10b981",
      path: "M 0 70 Q 20 70, 40 20 T 60 50 T 80 80 T 100 80"
    }
  };

  const current = config[chronotype];

  return (
    <div className={`p-5 bg-gradient-to-br ${current.color} border border-white/50 rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/60 rounded-xl shadow-xs backdrop-blur-sm">
            {current.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{current.title}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{current.desc}</p>
          </div>
        </div>
        <button onClick={onRetake} className="text-[10px] uppercase font-bold text-gray-500 hover:text-gray-800 bg-white/50 px-2 py-1 rounded-lg cursor-pointer">
          Làm lại
        </button>
      </div>

      <div className="mt-auto p-4 bg-white/40 rounded-xl border border-white/40">
        <h4 className="text-xs font-bold text-gray-800 mb-2">Đồ thị Năng lượng 24h</h4>
        <div className="w-full h-20 relative">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <path d={current.path} fill="none" stroke={current.stroke} strokeWidth="3" strokeLinecap="round" className="drop-shadow-md" />
          </svg>
          <div className="absolute inset-0 flex justify-between items-end text-[9px] text-gray-500 font-medium px-1 -bottom-4">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-bold text-gray-800 mb-2">✨ Giờ Vàng Deep Work (Đề xuất)</h4>
        <div className="flex gap-2 flex-wrap">
          {current.goldenHours.map((hour, idx) => (
            <span key={idx} className="text-[11px] font-bold bg-white text-gray-800 px-2.5 py-1 rounded-xl shadow-xs border border-gray-100">
              {hour}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
