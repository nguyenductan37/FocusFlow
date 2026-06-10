import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Chronotype } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (chronotype: Chronotype) => void;
}

export default function ChronotypeSurveyModal({ isOpen, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const questions = [
    {
      q: "Khoảng thời gian nào bạn cảm thấy tỉnh táo và làm việc hiệu quả nhất?",
      options: [
        { label: "Sáng sớm (05:00 - 08:00)", points: 3 },
        { label: "Buổi sáng & Trưa (08:00 - 12:00)", points: 2 },
        { label: "Buổi chiều (13:00 - 17:00)", points: 1 },
        { label: "Chiều tối & Đêm (18:00 - 23:00)", points: 0 }
      ]
    },
    {
      q: "Nếu được tự do chọn giờ thức dậy để thoải mái nhất, bạn sẽ chọn mấy giờ?",
      options: [
        { label: "Rất sớm (05:00 - 06:30)", points: 3 },
        { label: "Bình thường (06:30 - 08:30)", points: 2 },
        { label: "Muộn (08:30 - 10:00)", points: 1 },
        { label: "Rất muộn (Sau 10:00)", points: 0 }
      ]
    },
    {
      q: "Bạn thường bắt đầu cảm thấy buồn ngủ và muốn đi ngủ vào lúc nào?",
      options: [
        { label: "Sớm (20:30 - 22:00)", points: 3 },
        { label: "Bình thường (22:00 - 23:30)", points: 2 },
        { label: "Muộn (23:30 - 01:00)", points: 1 },
        { label: "Rất muộn (Sau 01:00)", points: 0 }
      ]
    }
  ];

  const handleSelect = (points: number) => {
    const newScore = score + points;
    if (step < questions.length - 1) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      let result: Chronotype = 'THIRD_BIRD';
      if (newScore >= 7) result = 'EARLY_BIRD';
      else if (newScore <= 3) result = 'NIGHT_OWL';
      
      onComplete(result);
      setStep(0);
      setScore(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-6">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <div className="text-center pb-5 border-b border-gray-100 mb-5">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-xl text-gray-900">Khám Phá Nhịp Sinh Học</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">Câu hỏi {step + 1}/3</p>
        </div>
        <div className="space-y-4">
          <p className="font-semibold text-sm text-gray-800 text-center">{questions[step].q}</p>
          <div className="space-y-2">
            {questions[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt.points)}
                className="w-full text-left p-3 border border-gray-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition text-sm font-medium text-gray-700 cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
