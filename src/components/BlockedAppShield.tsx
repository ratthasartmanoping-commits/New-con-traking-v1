import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Sparkles, BookOpen, Coffee, Sun } from 'lucide-react';

interface BlockedAppShieldProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  activeModeName: string;
}

export const BlockedAppShield: React.FC<BlockedAppShieldProps> = ({
  isOpen,
  onClose,
  appName,
  activeModeName,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Darkened Screen backdrop simulating OS App Interception */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1A1918]/90 backdrop-blur-md"
        />

        {/* Intercept Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#F5F3EC] rounded-[36px] p-8 shadow-2xl z-10 border border-[#FAF9F5] text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E5E1D7] flex items-center justify-center text-[#55524B] hover:text-[#1E1D1B]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Minimal Icon */}
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#EBE7DD] border border-[#DDD8CD] flex items-center justify-center text-[#2F2E2B] mb-5 shadow-inner">
            <span className="font-mono text-xl font-bold tracking-widest">BRK</span>
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7C786F] block mb-1">
            {activeModeName} Active
          </span>

          <h3 className="text-2xl font-extrabold text-[#1E1D1B] tracking-tight mb-2">
            {appName} is Bricked
          </h3>

          <p className="text-xs text-[#6F6B62] leading-relaxed mb-6">
            This app is locked to protect your attention and mental clarity. Tap your physical Brick device to unlock.
          </p>

          {/* Alternative ideas */}
          <div className="p-4 rounded-2xl bg-[#EBE7DD] text-left space-y-2 mb-6">
            <div className="text-[11px] font-bold text-[#35332E] uppercase tracking-wider">
              Do this instead:
            </div>
            <div className="flex items-center gap-2 text-xs text-[#524E47]">
              <Coffee className="w-3.5 h-3.5" />
              <span>Drink a glass of cold water</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#524E47]">
              <Sun className="w-3.5 h-3.5" />
              <span>Look out a window into the distance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#524E47]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read 5 pages of a physical book</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#1F1E1D] hover:bg-[#33312D] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Put Down Phone
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
