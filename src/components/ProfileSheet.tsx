import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pencil, Star, Share2, BarChart2, Check, User, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  sounds: any;
  userEmail: string;
  createdCount: number;
  securedCount: number;
  missedCount: number;
  totalRevenue: string;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  sounds,
  userEmail,
  createdCount,
  securedCount,
  missedCount,
  totalRevenue,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile data
  const [name, setName] = useState('Ali Grids');
  const [skills, setSkills] = useState(['Figma', 'Framer', 'UI/UX Design']);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) sounds.playClick();
    
    // Copy fake portfolio link
    try {
      navigator.clipboard.writeText('https://aligrids.design');
    } catch {}
    
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);

    // Mini confetti burst for delightful feedback
    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#386447', '#2C523A', '#DDD9D0'],
      });
    } catch {}
  };

  const handleGetInTouch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) sounds.playZenChime();
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 3000);

    // Confetti celebration
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#386447', '#DDD9D0', '#1A1918'],
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (soundEnabled) sounds.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-[#1A1918]/60 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 z-55 bg-[#ECE9E2] rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col pointer-events-auto border-t border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minimal Clean Handle Indicator */}
            <div 
              className="w-full pt-4 pb-2 flex justify-center cursor-pointer"
              onClick={() => {
                if (soundEnabled) sounds.playClick();
                onClose();
              }}
            >
              <div className="w-12 h-1.5 bg-neutral-400/40 rounded-full hover:bg-neutral-400/60 transition-colors" />
            </div>

            {/* Main Premium Card Content (Direct replica of the design) */}
            <div className="px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-3 flex flex-col gap-6">
              
              {/* Header Info Block */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Clean Vector Profile Icon on the left */}
                  <div className="relative w-16 h-16 rounded-full border border-neutral-300/50 bg-white/70 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-8 h-8 text-neutral-600" />
                    {/* Active Status Green Dot */}
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border border-[#ECE9E2] shadow-sm" />
                  </div>

                  {/* Name and Designation (Logged-in Email) */}
                  <div className="flex flex-col min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="font-bold text-xl text-[#1A1918] bg-white/40 border border-neutral-300 rounded px-2 py-0.5 outline-none focus:border-neutral-400 max-w-[160px]"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-bold text-xl text-[#1A1918] tracking-tight leading-tight truncate">{name}</h3>
                    )}
                    <p className="text-xs text-neutral-500 font-medium break-all">{userEmail || 'visitor@example.com'}</p>
                  </div>
                </div>

                {/* Top-Right Pencil Edit Button */}
                <button
                  onClick={() => {
                    if (soundEnabled) sounds.playClick();
                    setIsEditing(!isEditing);
                  }}
                  aria-label="Edit Profile"
                  className={`w-11 h-11 rounded-full border border-neutral-300/60 shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                    isEditing ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white/40 hover:bg-white/80 text-neutral-800'
                  }`}
                >
                  {isEditing ? <Check className="w-[18px] h-[18px]" /> : <Pencil className="w-[18px] h-[18px]" />}
                </button>
              </div>

              {/* Skills Row */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-semibold text-neutral-800 bg-[#E3DEC9]/50 px-4 py-1.5 rounded-full border border-white/20 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Key Metrics Row (Created, Secured/Missed, Total Revenue) */}
              <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/30 py-4 px-2 flex items-center justify-around shadow-xs">
                {/* Metric 1: Created Events */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-neutral-900 font-bold text-lg">{createdCount}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1.5 text-center leading-none">Created</span>
                </div>

                <div className="w-[1px] h-8 bg-neutral-300/50" />

                {/* Metric 2: Secured vs Missed */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-neutral-900 font-bold text-lg">{securedCount}/{missedCount}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1.5 text-center leading-none">Secured/Missed</span>
                </div>

                <div className="w-[1px] h-8 bg-neutral-300/50" />

                {/* Metric 3: Gross Revenue */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-neutral-900 font-bold text-lg">{totalRevenue}</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1.5 text-center leading-none">Revenue</span>
                </div>
              </div>

              {/* Footer Controls Row */}
              <div className="flex items-center gap-3">
                {/* 1. Large Black "Get in touch" Pill Button */}
                <button
                  onClick={handleGetInTouch}
                  disabled={isTouched}
                  className={`flex-1 h-12 rounded-full font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center ${
                    isTouched 
                      ? 'bg-emerald-800 text-white' 
                      : 'bg-[#1A1918] hover:bg-neutral-800 text-white'
                  }`}
                >
                  {isTouched ? 'Inquiry Sent! ✨' : 'Get in touch'}
                </button>

                {/* 2. Visualizer Audio Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) sounds.playZenChime();
                  }}
                  title="Play Zen Chime"
                  className="w-12 h-12 rounded-full bg-white/40 hover:bg-white/80 text-neutral-800 border border-neutral-300/60 shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                >
                  <BarChart2 className="w-[18px] h-[18px]" />
                </button>

                {/* 3. Share Button with Clipboard Copy */}
                <button
                  onClick={handleShare}
                  title="Share Portfolio"
                  className="w-12 h-12 rounded-full bg-white/40 hover:bg-white/80 text-neutral-800 border border-neutral-300/60 shadow-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer relative"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-10 bg-neutral-900 text-white text-[10px] py-1 px-2.5 rounded-md shadow-md pointer-events-none whitespace-nowrap font-medium"
                      >
                        Copied Link!
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                  <Share2 className="w-[18px] h-[18px]" />
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
