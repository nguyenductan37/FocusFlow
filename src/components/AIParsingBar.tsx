/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { parseNaturalLanguageTask } from '../utils/gemini';
import { Task, Chronotype } from '../types';

interface AIParsingBarProps {
  chronotype?: Chronotype | null;
  onTaskCreated: (taskData: Omit<Task, 'id' | 'completed_at'> & { id?: string }) => void;
}

export default function AIParsingBar({ chronotype, onTaskCreated }: AIParsingBarProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Gọi thư viện AI để trích xuất thông tin
      const parsedTask = await parseNaturalLanguageTask(inputText, chronotype);

      // Nếu thành công, đóng gói lại và gọi hàm lưu
      // Đảm bảo các thuộc tính required đều có mặt
      onTaskCreated({
        title: parsedTask.title || 'Task tạo từ AI',
        description: parsedTask.description,
        category: parsedTask.category || 'Làm việc',
        eisenhower_q: parsedTask.eisenhower_q || 'Q2',
        energy_level: parsedTask.energy_level || 'MEDIUM',
        estimated_min: parsedTask.estimated_min || 25,
        scheduled_at: parsedTask.scheduled_at,
        status: 'TODO',
        due_date: parsedTask.due_date,
      });

      // Reset UI & hiện Toast nhỏ
      setInputText('');
      setSuccessMsg(`Đã tạo: "${parsedTask.title}"`);

      // Ẩn success msg sau 4 giây
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);

    } catch (error: any) {
      setErrorMsg(error?.message || 'Không thể phân tích. Vui lòng thử cách diễn đạt khác!');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <div className="w-full bg-white border border-indigo-100 rounded-3xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Background Gradient for aesthetic */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -z-10 pointer-events-none" />

      <div className="flex flex-col gap-3">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full"
        >
          {/* AI Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            )}
          </div>

          {/* Input field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="Nhập công việc (VD: Review code lúc 15:00 trong 30p)..."
            className="w-full pl-12 pr-14 py-4 bg-slate-50/50 border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-sm font-medium outline-hidden transition-all disabled:opacity-60 placeholder:text-gray-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-all cursor-pointer shadow-md disabled:shadow-none"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>

        {/* Feedback Messages */}
        {errorMsg && (
          <p className="text-xs font-bold text-rose-500 px-2 animate-fade-in">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-xs font-bold text-emerald-600 px-2 animate-fade-in flex items-center gap-1.5">
            <span>🎉</span> {successMsg}
          </p>
        )}

        {/* Quick Suggestions (visible when empty & not loading) */}
        {!inputText && !isProcessing && !successMsg && !errorMsg && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Gợi ý nhanh:</span>
            {[
              "Học tiếng Anh giao tiếp",
              "Viết báo cáo tài chính lúc 14h trong 45p"
            ].map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="text-[10px] px-2.5 py-1 bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium transition cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
