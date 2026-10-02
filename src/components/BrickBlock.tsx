import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { sounds } from '../utils/audio';
import { ShieldCheck, Sparkles, Flame } from 'lucide-react';

interface BrickBlockProps {
  isBricked: boolean;
  onToggleBrick: () => void;
  soundEnabled: boolean;
  activeModeName: string;
  elapsedFocusSeconds: number;
}

export const BrickBlock: React.FC<BrickBlockProps> = ({
  isBricked,
  onToggleBrick,
  soundEnabled,
  activeModeName,
  elapsedFocusSeconds,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const controls = useAnimation();

  const HOLD_DURATION_MS = 900; // time to hold for activation

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) {
      return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  const handlePointerDown = () => {
    setIsPressing(true);
    startTimeRef.current = Date.now();
    if (soundEnabled) {
      sounds.playClick();
    }

    if (holdTimerRef.current) clearInterval(holdTimerRef.current);

    holdTimerRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdTimerRef.current!);
        holdTimerRef.current = null;
        triggerActivation();
      }
    }, 20);
  };

  const handlePointerUp = () => {
    if (!isPressing) return;
    setIsPressing(false);

    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // If released quickly, perform quick tap toggle
    const duration = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    setHoldProgress(0);
    startTimeRef.current = null;

    if (duration < 350) {
      triggerActivation();
    }
  };

  const triggerActivation = () => {
    setIsPressing(false);
    setHoldProgress(0);

    // Haptic if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isBricked ? [30, 40, 30] : [60]);
    }

    if (soundEnabled) {
      if (!isBricked) {
        sounds.playBrickThud();
      } else {
        sounds.playZenChime();
      }
    }

    // Trigger visual punch
    controls.start({
      scale: [0.94, 1.02, 1],
      transition: { duration: 0.35, ease: 'easeOut' },
    });

    onToggleBrick();
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none my-6">
      {/* Ambient background aura glow when bricked */}
      {isBricked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-8 rounded-[60px] bg-gradient-to-b from-[#E2DDD3]/50 to-[#D4CEC3]/40 blur-2xl pointer-events-none -z-10"
        />
      )}

      {/* Main 3D Brick Interactive Container */}
      <motion.div
        animate={controls}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative group cursor-pointer touch-manipulation focus:outline-none"
        style={{ perspective: 1000 }}
      >
        {/* Hold progress ring overlay */}
        {isPressing && holdProgress > 0 && (
          <div className="absolute -inset-4 z-20 pointer-events-none flex items-center justify-center">
            <svg className="w-[280px] h-[280px] -rotate-90">
              <circle
                cx="140"
                cy="140"
                r="130"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-[#C8C4B7]"
                strokeDasharray="816"
                strokeDashoffset={816 - (816 * holdProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* 3D Physical Brick Body */}
        <div
          className={`relative w-[210px] h-[210px] sm:w-[220px] sm:h-[220px] rounded-[48px] transition-all duration-200 ease-out ${
            isPressing ? 'translate-y-2' : isBricked ? 'translate-y-1' : 'translate-y-0 hover:-translate-y-1'
          }`}
          style={{
            // Multi-layered realistic 3D shadow replicating physical hardware
            boxShadow: isPressing
              ? '0 12px 24px -6px rgba(45, 42, 38, 0.18), 0 4px 8px -2px rgba(45, 42, 38, 0.12)'
              : isBricked
              ? '0 32px 55px -12px rgba(45, 42, 38, 0.22), 0 16px 28px -6px rgba(45, 42, 38, 0.14), inset 0 2px 3px rgba(255,255,255,0.8)'
              : '0 38px 65px -15px rgba(45, 42, 38, 0.24), 0 18px 32px -8px rgba(45, 42, 38, 0.16), 0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Base bottom 3D extrude bevel layer (Grey stone rim) */}
          <div
            className="absolute inset-0 rounded-[48px] bg-gradient-to-b from-[#A4A9AB] via-[#8E9396] to-[#73787A] transition-all duration-200"
            style={{
              transform: 'translateY(16px)',
              height: '100%',
              borderRadius: '48px',
            }}
          />

          {/* Top ceramic/stone face plate */}
          <div
            className={`relative w-full h-full rounded-[48px] border transition-colors duration-300 flex flex-col items-center justify-center overflow-hidden ${
              isBricked
                ? 'bg-gradient-to-b from-[#FAF9F5] via-[#F2EFE8] to-[#E9E5DB] border-[#FFFFFF]'
                : 'bg-gradient-to-b from-[#FAF9F6] via-[#F3F1EC] to-[#E6E3DB] border-[#FFFFFF]'
            }`}
            style={{
              boxShadow:
                'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.04), 0 4px 10px rgba(0,0,0,0.06)',
            }}
          >
            {/* Matte Stone subtle texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* Carved Corner Insets - Matching image.png design */}
            {/* Top-Left Corner Bracket */}
            <div className="absolute top-6 left-6 pointer-events-none">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path
                  d="M30 4H14C8.47715 4 4 8.47715 4 14V30"
                  stroke="#A8A49B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0px 1px 1px rgba(255,255,255,0.9)) drop-shadow(0px -1px 1px rgba(0,0,0,0.12))',
                  }}
                />
              </svg>
            </div>

            {/* Top-Right Corner Bracket */}
            <div className="absolute top-6 right-6 pointer-events-none">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path
                  d="M4 4H20C25.5228 4 30 8.47715 30 14V30"
                  stroke="#A8A49B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0px 1px 1px rgba(255,255,255,0.9)) drop-shadow(0px -1px 1px rgba(0,0,0,0.12))',
                  }}
                />
              </svg>
            </div>

            {/* Bottom-Left Corner Bracket */}
            <div className="absolute bottom-6 left-6 pointer-events-none">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path
                  d="M30 30H14C8.47715 30 4 25.5228 4 20V4"
                  stroke="#A8A49B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0px 1px 1px rgba(255,255,255,0.9)) drop-shadow(0px -1px 1px rgba(0,0,0,0.12))',
                  }}
                />
              </svg>
            </div>

            {/* Bottom-Right Corner Bracket */}
            <div className="absolute bottom-6 right-6 pointer-events-none">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path
                  d="M4 30H20C25.5228 30 30 25.5228 30 20V4"
                  stroke="#A8A49B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors duration-300"
                  style={{
                    filter: 'drop-shadow(0px 1px 1px rgba(255,255,255,0.9)) drop-shadow(0px -1px 1px rgba(0,0,0,0.12))',
                  }}
                />
              </svg>
            </div>

            {/* Center Engraved Typography / Status Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
              <span
                className={`font-mono text-2xl sm:text-[26px] font-bold tracking-[0.28em] uppercase transition-all duration-300 ${
                  isBricked ? 'text-[#3E3C38]' : 'text-[#8E8B82]'
                }`}
                style={{
                  textShadow:
                    '0px 1px 1px rgba(255, 255, 255, 0.9), 0px -1px 1px rgba(0, 0, 0, 0.15)',
                }}
              >
                BRICK
              </span>

              {/* Status Indicator Subtext when Active */}
              {isBricked ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#35332E]/8 text-[#3A3834] text-[11px] font-medium tracking-wide"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] animate-pulse" />
                  <span>{formatElapsedTime(elapsedFocusSeconds)}</span>
                </motion.div>
              ) : (
                <div className="h-4 mt-1">
                  {/* Subtle placeholder line to maintain balance */}
                  <span className="text-[10px] font-mono tracking-widest text-[#B5B1A8] opacity-60">
                    IDLE
                  </span>
                </div>
              )}
            </div>

            {/* Top Gloss Reflection */}
            <div className="absolute top-0 inset-x-8 h-12 bg-gradient-to-b from-white/40 to-transparent rounded-t-[40px] pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Tactile Tip / Hold Hint */}
      <div className="mt-3 text-[11px] text-[#9E9A90] font-normal transition-opacity duration-200">
        {isPressing ? 'Release to activate' : 'Tap or hold the physical brick'}
      </div>
    </div>
  );
};
