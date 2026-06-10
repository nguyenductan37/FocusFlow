import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, XCircle, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { Task } from '../types';
import { useFocusLock } from '../utils/focusUtils';

interface FocusOverlayProps {
  task: Task;
  onComplete: (actualMin: number) => void;
  onDefer: (reason: string) => void;
}

const DEFER_REASONS = [
  'Kiệt sức / Mệt mỏi',
  'Có việc đột xuất khẩn cấp',
  'Bị phân tâm / Mất tập trung',
  'Lý do khác (Tự nhập...)'
];

export default function FocusOverlay({ task, onComplete, onDefer }: FocusOverlayProps) {
  // Lock the browser tab
  useFocusLock(true);

  const INITIAL_SECONDS = 25 * 60; // 25 minutes
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDeferForm, setShowDeferForm] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  // Audio Context for ambient sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Ambient Noise Generator (Brown noise / Rain-like)
  useEffect(() => {
    if (!isMuted) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2; // 2 seconds of buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown noise
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for gain
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.1; // Low volume rain sound
      gainNodeRef.current = gain;

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(0);
      noiseNodeRef.current = noise;

      return () => {
        noise.stop();
        noise.disconnect();
        ctx.close();
      };
    }
  }, [isMuted]);

  const handleComplete = () => {
    setIsPlaying(false);
    const actualMin = Math.round((INITIAL_SECONDS - timeLeft) / 60);
    onComplete(actualMin > 0 ? actualMin : 1);
  };

  const handleDeferSubmit = (reason: string) => {
    const finalReason = reason === 'Lý do khác (Tự nhập...)' ? customReason : reason;
    if (!finalReason.trim()) {
      alert('Vui lòng nhập lý do cụ thể!');
      return;
    }
    onDefer(finalReason);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-2xl px-6 py-12 flex flex-col items-center relative">
        
        {/* Ambient Sound Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-0 right-6 p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          title="Bật/tắt âm thanh tập trung"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-indigo-400" />}
        </button>

        <h2 className="text-slate-400 font-medium tracking-widest uppercase mb-4 text-sm">
          Phiên Tập Trung Hiện Tại
        </h2>
        
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-8 max-w-xl leading-tight">
          {task.title}
        </h1>

        {/* Timer */}
        <div className="text-7xl md:text-9xl font-mono font-bold text-white mb-10 tracking-tighter tabular-nums drop-shadow-2xl">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button
            onClick={handleComplete}
            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105"
            title="Đánh dấu hoàn thành sớm"
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Defer Action */}
        {!showDeferForm ? (
          <button
            onClick={() => {
              setIsPlaying(false);
              setShowDeferForm(true);
            }}
            className="mt-8 text-sm text-slate-500 hover:text-rose-400 transition flex items-center gap-2 group"
          >
            <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Tôi muốn hoãn công việc này
          </button>
        ) : (
          <div className="mt-4 p-6 bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4">
            <h3 className="text-white font-medium mb-4 text-center">Tại sao bạn lại muốn bỏ cuộc?</h3>
            <div className="space-y-2 mb-4">
              {DEFER_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleDeferSubmit(r)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white transition text-sm"
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Nhập lý do khác..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 mb-4"
            />
            {customReason && (
              <button
                onClick={() => handleDeferSubmit('Lý do khác (Tự nhập...)')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition shadow-lg shadow-rose-600/20"
              >
                Xác nhận Hoãn
              </button>
            )}
            <button
              onClick={() => {
                setShowDeferForm(false);
                setIsPlaying(true);
              }}
              className="w-full mt-2 py-3 bg-transparent text-slate-400 hover:text-white text-sm transition"
            >
              Thôi, tôi sẽ tiếp tục làm!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
