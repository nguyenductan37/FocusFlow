import { useEffect } from 'react';

/**
 * Hook to block page unload when focus mode is active.
 */
export function useFocusLock(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Hệ thống đang khóa tập trung. Bạn có chắc chắn muốn thoát và làm gián đoạn công việc?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);
}

/**
 * Plays a subtle alert sound using Web Audio API
 */
export function playFocusAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // C5 note frequency
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (error) {
    console.error("AudioContext not supported or blocked", error);
  }
}
