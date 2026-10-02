import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wind, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MindfulnessUnbrickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUnbrick: () => void;
  soundEnabled: boolean;
}

export const MindfulnessUnbrickModal: React.FC<MindfulnessUnbrickModalProps> = ({
  isOpen,
  onClose,
  onConfirmUnbrick,
  soundEnabled,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [breathPhase, setBreathPhase] = useState<'Inhale...' | 'Hold...' | 'Exhale...'>('Inhale...');

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(10);
      return;
    }

    if (soundEnabled) {
      sounds.playBreatheTone();
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale...') return 'Hold...';
        if (prev === 'Hold...') return 'Exhale...';
        return 'Inhale...';
      });
    }, 3300);

    return () => {
      clearInterval(interval);
      clearInterval(breathInterval);
    };
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#FAF9F6] rounded-[36px] p-7 shadow-2xl z-10 border border-[#EBE7DF] text-center"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#55524B] hover:text-[#1E1D1B]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-full bg-[#EAE5DA] flex items-center justify-center text-[#3D3A34] mb-4">
            <Wind className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-[#1E1D1B] tracking-tight">
            Mindful Pause
          </h3>
          <p className="text-xs text-[#7A766D] mt-1 mb-6">
            Strict Mode is active. Take a conscious breath before returning to feeds.
          </p>

          {/* Breathing Visualizer */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center mb-6">
            <motion.div
              animate={{
                scale: breathPhase === 'Inhale...' ? 1.3 : breathPhase === 'Hold...' ? 1.3 : 0.85,
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 3.3, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-[#E3DDD1] border-2 border-[#D1CAB9]"
            />
            <div className="relative z-10 font-medium text-sm text-[#2A2926]">
              {breathPhase}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              disabled={secondsRemaining > 0}
              onClick={() => {
                onConfirmUnbrick();
                onClose();
              }}
              className={`w-full py-3.5 rounded-2xl text-sm font-semibold tracking-tight transition-all ${
                secondsRemaining === 0
                  ? 'bg-[#1F1E1D] hover:bg-[#33312D] text-white cursor-pointer shadow-md'
                  : 'bg-[#E3DFD5] text-[#8E8A81] cursor-not-allowed'
              }`}
            >
              {secondsRemaining > 0
                ? `Wait ${secondsRemaining}s to Unbrick`
                : 'Confirm Unbrick'}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-medium text-[#625E57] hover:text-[#1F1E1D] cursor-pointer"
            >
              Stay Focused (Keep Bricked)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
