import React from 'react';
import { Lightbulb, Check, X } from 'lucide-react';
import { TaskCategory } from '../types';

interface BatchingNudgeCardProps {
  category: TaskCategory;
  taskCount: number;
  proposedTime: string;
  onAccept: () => void;
  onDismiss: () => void;
}

const CATEGORY_NAMES: Record<TaskCategory, string> = {
  'Học tập': 'Học tập',
  'Làm việc': 'Làm việc',
  'Phát triển bản thân': 'Phát triển bản thân',
  'Sức khỏe': 'Sức khỏe',
  'Cá nhân': 'Cá nhân',
};

export default function BatchingNudgeCard({
  category,
  taskCount,
  proposedTime,
  onAccept,
  onDismiss
}: BatchingNudgeCardProps) {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl"></div>
      
      <div className="flex items-start gap-3 pl-2">
        <div className="p-2 bg-white rounded-xl shadow-xs text-indigo-500 mt-0.5">
          <Lightbulb className="w-5 h-5 fill-indigo-100" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Tối ưu hóa bối cảnh 💡</h3>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            Hệ thống phát hiện bạn có <strong>{taskCount} việc</strong> thuộc nhóm <strong>{CATEGORY_NAMES[category]}</strong> hôm nay. Bạn có muốn gom chúng lại làm liên tục vào lúc <span className="font-bold text-indigo-600 bg-indigo-100/50 px-1.5 py-0.5 rounded">{proposedTime}</span> để tránh phân tâm nhận thức?
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onAccept}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200"
            >
              <Check className="w-3.5 h-3.5" />
              Đồng ý gom lịch
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 px-3 py-2 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Bỏ qua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
