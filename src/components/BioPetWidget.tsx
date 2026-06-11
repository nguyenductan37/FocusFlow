import React, { useState, useEffect } from 'react';
import { BioPetState, Chronotype, Task } from '../types';
import { Sparkles, Edit2, Check, Moon } from 'lucide-react';

interface BioPetWidgetProps {
  chronotype: Chronotype;
  petState: BioPetState;
  onRenamePet: (newName: string) => void;
  onStartSurvey: () => void;
  tasks: Task[];
  onUpdateAccessories: (equipped: string[]) => void;
  cognitiveLoad: number;
}

export default function BioPetWidget({ 
  chronotype, 
  petState, 
  onRenamePet, 
  onStartSurvey,
  tasks,
  onUpdateAccessories,
  cognitiveLoad
}: BioPetWidgetProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(petState.name || 'Linh Vật');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isFatigued, setIsFatigued] = useState(false);

  // Check if there are active shadow steps
  const hasActiveShadowSteps = tasks?.some(t => t.isShadowStep && t.status !== 'DONE') || false;

  // Áp đặt trạng thái mệt mỏi ngay lập tức nếu Tải nhận thức >= 80 (Derived state an toàn hơn)
  const isCurrentlyFatigued = isFatigued || cognitiveLoad >= 80;

  // Sync pet name
  useEffect(() => {
    setTempName(petState.name || 'Linh Vật');
  }, [petState.name]);

  // Check fatigue status based on time or high cognitive load
  useEffect(() => {
    const checkFatigue = () => {
      if (!chronotype) return;
      
      // Quá tải nhận thức -> Thú cưng mệt mỏi ngay lập tức
      if (cognitiveLoad >= 80) {
        setIsFatigued(true);
        return;
      }

      const now = new Date();
      const h = now.getHours();
      
      let tired = false;
      if (chronotype === 'EARLY_BIRD') {
        tired = h >= 22 || h < 5;
      } else if (chronotype === 'NIGHT_OWL') {
        tired = h >= 1 && h < 7;
      } else if (chronotype === 'THIRD_BIRD') {
        tired = h >= 23 || h < 6;
      }
      setIsFatigued(tired);
    };

    checkFatigue();
    const interval = setInterval(checkFatigue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [chronotype, cognitiveLoad]);

  const handleRenameSubmit = () => {
    if (tempName.trim()) {
      onRenamePet(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handlePetClick = () => {
    if (!chronotype) {
      onStartSurvey();
      return;
    }
    setShowPopover(!showPopover);
  };

  const handlePetHover = () => {
    if (!chronotype) {
      setSpeechBubble('Hãy nhấp vào tôi để ấp nở nhé!');
    } else {
      if (hasActiveShadowSteps) {
        const phrases = [
          'Tôi cảm nhận được nguồn năng lượng trì hoãn! Hãy dọn dẹp các mảnh vỡ!',
          'Hãy tiêu diệt các mảnh vỡ bóng tối!',
          'Cố lên dũng sĩ, tôi đang yểm trợ bạn!',
          'Hãy cùng dọn dẹp các mảnh vỡ bóng tối!'
        ];
        setSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)]);
      } else if (isCurrentlyFatigued) {
        const phrases = ['Tôi buồn ngủ quá...', 'Zzz... Khò khò...', 'Bạn đã nghỉ ngơi chưa?'];
        setSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)]);
      } else {
        const phrases = ['Chào bạn!', 'Hãy cùng tập trung nhé!', 'Hôm nay là một ngày tuyệt vời!', 'Cố lên!'];
        setSpeechBubble(phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }
  };

  const handlePetLeave = () => {
    setSpeechBubble(null);
  };

  const xpMax = petState.level * 100;
  const xpPercent = Math.min(100, Math.max(0, (petState.xp / xpMax) * 100));

  const renderEgg = () => (
    <svg viewBox="0 0 100 100" className="w-16 h-16 origin-bottom animate-wiggle">
      {/* Egg Base */}
      <path d="M 50 90 C 20 90 20 50 35 25 C 45 10 55 10 65 25 C 80 50 80 90 50 90 Z" fill="#E9D5FF" />
      {/* Spots */}
      <circle cx="40" cy="70" r="4" fill="#D8B4FE" />
      <circle cx="60" cy="65" r="6" fill="#D8B4FE" />
      <circle cx="50" cy="45" r="5" fill="#D8B4FE" />
    </svg>
  );

  const renderEarlyBird = () => {
    const isEquipped = (accId: string) => petState.equippedAccessories?.includes(accId);
    return (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isCurrentlyFatigued ? 'opacity-80' : 'animate-bounce-subtle'}`}>
        {/* Body */}
        <circle cx="50" cy="60" r="30" fill="#FDE047" />
        {/* Wings */}
        <path d="M 25 55 Q 15 65 25 75 Z" fill="#FACC15" />
        <path d="M 75 55 Q 85 65 75 75 Z" fill="#FACC15" />
        {/* Eyes & Brows */}
        {hasActiveShadowSteps ? (
          <>
            <path d="M 32 43 L 44 47" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 68 43 L 56 47" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="40" cy="52" r="4" fill="#854D0E" />
            <circle cx="60" cy="52" r="4" fill="#854D0E" />
          </>
        ) : isCurrentlyFatigued ? (
          <>
            <path d="M 35 50 Q 40 45 45 50" fill="none" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
            <path d="M 55 50 Q 60 45 65 50" fill="none" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy="50" r="4" fill="#854D0E" />
            <circle cx="60" cy="50" r="4" fill="#854D0E" />
          </>
        )}
        {/* Beak */}
        <path d="M 45 58 L 55 58 L 50 65 Z" fill="#F97316" />

        {/* Accessories */}
        {isEquipped('toy_sword') && (
          <g id="eb-toy-sword">
            <rect x="18" y="45" width="4" height="20" rx="1" fill="#A16207" stroke="#78350F" strokeWidth="1" transform="rotate(-15, 20, 55)" />
            <rect x="14" y="58" width="12" height="3" rx="0.5" fill="#D97706" stroke="#78350F" strokeWidth="1" transform="rotate(-15, 20, 55)" />
            <rect x="19" y="65" width="2" height="5" fill="#78350F" transform="rotate(-15, 20, 55)" />
          </g>
        )}
        {isEquipped('wooden_shield') && (
          <g id="eb-wooden-shield">
            <circle cx="78" cy="62" r="9" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="78" cy="62" r="6" fill="none" stroke="#F97316" strokeWidth="1" />
            <line x1="78" y1="53" x2="78" y2="71" stroke="#78350F" strokeWidth="1" />
            <line x1="69" y1="62" x2="87" y2="62" stroke="#78350F" strokeWidth="1" />
          </g>
        )}
        {isEquipped('hero_crown') && (
          <g id="eb-hero-crown">
            <path d="M 38 32 L 40 22 L 46 27 L 50 20 L 54 27 L 60 22 L 62 32 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="50" cy="21" r="1.5" fill="#EF4444" />
            <circle cx="40" cy="23" r="1" fill="#3B82F6" />
            <circle cx="60" cy="23" r="1" fill="#3B82F6" />
          </g>
        )}
      </svg>
    );
  };

  const renderNightOwl = () => {
    const isEquipped = (accId: string) => petState.equippedAccessories?.includes(accId);
    return (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isCurrentlyFatigued ? 'opacity-80' : 'animate-pulse'}`}>
        {/* Body */}
        <path d="M 20 80 C 20 30 80 30 80 80 Z" fill="#6366F1" />
        {/* Ears */}
        <path d="M 25 40 L 20 20 L 40 30 Z" fill="#4F46E5" />
        <path d="M 75 40 L 80 20 L 60 30 Z" fill="#4F46E5" />
        {/* Eyes */}
        <circle cx="35" cy="55" r="12" fill="#E0E7FF" />
        <circle cx="65" cy="55" r="12" fill="#E0E7FF" />
        {hasActiveShadowSteps ? (
          <>
            <path d="M 25 40 L 42 48" stroke="#312E81" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 75 40 L 58 48" stroke="#312E81" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="35" cy="55" r="5" fill="#312E81" />
            <circle cx="65" cy="55" r="5" fill="#312E81" />
          </>
        ) : isCurrentlyFatigued ? (
          <>
            <path d="M 28 55 H 42" stroke="#312E81" strokeWidth="4" strokeLinecap="round" />
            <path d="M 58 55 H 72" stroke="#312E81" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="35" cy="55" r="5" fill="#312E81" />
            <circle cx="65" cy="55" r="5" fill="#312E81" />
          </>
        )}
        {/* Beak */}
        <path d="M 47 62 L 53 62 L 50 68 Z" fill="#FBBF24" />

        {/* Accessories */}
        {isEquipped('toy_sword') && (
          <g id="no-toy-sword">
            <rect x="14" y="55" width="4" height="20" rx="1" fill="#A16207" stroke="#78350F" strokeWidth="1" transform="rotate(-20, 16, 65)" />
            <rect x="10" y="68" width="12" height="3" rx="0.5" fill="#D97706" stroke="#78350F" strokeWidth="1" transform="rotate(-20, 16, 65)" />
            <rect x="15" y="75" width="2" height="5" fill="#78350F" transform="rotate(-20, 16, 65)" />
          </g>
        )}
        {isEquipped('wooden_shield') && (
          <g id="no-wooden-shield">
            <circle cx="82" cy="70" r="9" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="82" cy="70" r="6" fill="none" stroke="#F97316" strokeWidth="1" />
            <line x1="82" y1="61" x2="82" y2="79" stroke="#78350F" strokeWidth="1" />
            <line x1="73" y1="70" x2="91" y2="70" stroke="#78350F" strokeWidth="1" />
          </g>
        )}
        {isEquipped('hero_crown') && (
          <g id="no-hero-crown">
            <path d="M 38 28 L 40 18 L 46 23 L 50 16 L 54 23 L 60 18 L 62 28 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="50" cy="17" r="1.5" fill="#EF4444" />
            <circle cx="40" cy="19" r="1" fill="#3B82F6" />
            <circle cx="60" cy="19" r="1" fill="#3B82F6" />
          </g>
        )}
      </svg>
    );
  };

  const renderThirdBird = () => {
    const isEquipped = (accId: string) => petState.equippedAccessories?.includes(accId);
    return (
      <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isCurrentlyFatigued ? 'opacity-80' : ''}`} style={{ transform: isCurrentlyFatigued ? 'none' : 'rotate(5deg)' }}>
        {/* Body */}
        <ellipse cx="50" cy="65" rx="25" ry="30" fill="#86EFAC" />
        {/* Head */}
        <circle cx="50" cy="35" r="20" fill="#86EFAC" />
        {/* Eyes & brows */}
        {hasActiveShadowSteps ? (
          <>
            <path d="M 33 22 L 45 27" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 67 22 L 55 27" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="42" cy="32" r="3" fill="#14532D" />
            <circle cx="62" cy="32" r="3" fill="#14532D" />
          </>
        ) : isCurrentlyFatigued ? (
          <>
            <path d="M 40 32 H 48" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
            <path d="M 58 32 H 66" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="42" cy="32" r="3" fill="#14532D" />
            <circle cx="62" cy="32" r="3" fill="#14532D" />
          </>
        )}
        {/* Beak */}
        <path d="M 48 38 L 56 38 L 52 44 Z" fill="#F59E0B" />
        {/* Wings */}
        <path d="M 25 60 Q 15 70 28 80 Z" fill="#4ADE80" />
        <path d="M 75 60 Q 85 70 72 80 Z" fill="#4ADE80" />

        {/* Accessories */}
        {isEquipped('toy_sword') && (
          <g id="tb-toy-sword">
            <rect x="20" y="50" width="4" height="20" rx="1" fill="#A16207" stroke="#78350F" strokeWidth="1" transform="rotate(-15, 22, 60)" />
            <rect x="16" y="63" width="12" height="3" rx="0.5" fill="#D97706" stroke="#78350F" strokeWidth="1" transform="rotate(-15, 22, 60)" />
            <rect x="21" y="70" width="2" height="5" fill="#78350F" transform="rotate(-15, 22, 60)" />
          </g>
        )}
        {isEquipped('wooden_shield') && (
          <g id="tb-wooden-shield">
            <circle cx="78" cy="65" r="9" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="78" cy="65" r="6" fill="none" stroke="#F97316" strokeWidth="1" />
            <line x1="78" y1="56" x2="78" y2="74" stroke="#78350F" strokeWidth="1" />
            <line x1="69" y1="65" x2="87" y2="65" stroke="#78350F" strokeWidth="1" />
          </g>
        )}
        {isEquipped('hero_crown') && (
          <g id="tb-hero-crown">
            <path d="M 38 18 L 40 8 L 46 13 L 50 6 L 54 13 L 60 8 L 62 18 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="50" cy="7" r="1.5" fill="#EF4444" />
            <circle cx="40" cy="9" r="1" fill="#3B82F6" />
            <circle cx="60" cy="9" r="1" fill="#3B82F6" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Speech Bubble */}
      {speechBubble && !showPopover && (
        <div className="mb-2 bg-white text-slate-700 px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-medium animate-fade-in relative max-w-[150px] text-center">
          {speechBubble}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
        </div>
      )}

      {/* Popover */}
      {showPopover && chronotype && (
        <div className="mb-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 p-4 animate-fade-in origin-bottom-right">
          <div className="flex justify-between items-start mb-3">
            {isEditingName ? (
              <div className="flex items-center gap-1 w-full bg-slate-50 rounded-lg p-1">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 outline-hidden px-1"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                />
                <button onClick={handleRenameSubmit} className="p-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h4 className="font-bold text-slate-800 text-sm truncate">{petState.name || 'Linh Vật'}</h4>
                <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Cấp độ</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Lv. {petState.level}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>XP: {petState.xp}</span>
                <span>{xpMax}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              {isCurrentlyFatigued ? (
                <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Cần nghỉ ngơi</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tràn đầy năng lượng</span>
                </div>
              )}
            </div>

            {/* Accessories Closet section */}
            <div className="pt-2.5 border-t border-slate-100 space-y-2">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">⚔️ Trang bị dũng sĩ</span>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'toy_sword', name: 'Kiếm đồ chơi ⚔️' },
                  { id: 'wooden_shield', name: 'Khiên gỗ 🛡️' },
                  { id: 'hero_crown', name: 'Vương miện dũng sĩ 👑' }
                ].map(acc => {
                  const isUnlocked = petState.unlockedAccessories?.includes(acc.id);
                  const isEquipped = petState.equippedAccessories?.includes(acc.id);
                  
                  return (
                    <div key={acc.id} className="flex items-center justify-between">
                      <span className={`font-medium ${isUnlocked ? 'text-slate-700' : 'text-slate-400 italic'}`}>
                        {!isUnlocked && '🔒 '}{acc.name}
                      </span>
                      {isUnlocked && (
                        <button
                          onClick={() => {
                            const currentEquipped = petState.equippedAccessories || [];
                            const newEquipped = isEquipped
                              ? currentEquipped.filter(id => id !== acc.id)
                              : [...currentEquipped, acc.id];
                            onUpdateAccessories(newEquipped);
                          }}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                            isEquipped 
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isEquipped ? 'Tháo ra' : 'Trang bị'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pet Container */}
      <div 
        className={`relative w-20 h-20 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${
          hasActiveShadowSteps 
            ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse' 
            : ''
        }`}
        onClick={handlePetClick}
        onMouseEnter={handlePetHover}
        onMouseLeave={handlePetLeave}
      >
        {isCurrentlyFatigued && (
          <div className="absolute -top-2 right-1 text-slate-400 animate-fade-out-up">
            <Moon className="w-4 h-4" />
          </div>
        )}
        
        {!chronotype && renderEgg()}
        {chronotype === 'EARLY_BIRD' && renderEarlyBird()}
        {chronotype === 'NIGHT_OWL' && renderNightOwl()}
        {chronotype === 'THIRD_BIRD' && renderThirdBird()}
      </div>
    </div>
  );
}
