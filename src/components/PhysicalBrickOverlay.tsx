import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Check, Sparkles, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PhysicalBrickOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isCurrentlyBricked: boolean;
  soundEnabled: boolean;
}

export const PhysicalBrickOverlay: React.FC<PhysicalBrickOverlayProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isCurrentlyBricked,
  soundEnabled,
}) => {
  const [step, setStep] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (!isOpen) {
      setStep('scanning');
      return;
    }

    if (soundEnabled) {
      sounds.playClick();
    }

    const timer = setTimeout(() => {
      setStep('success');
      if (soundEnabled) {
        if (isCurrentlyBricked) {
          sounds.playZenChime();
        } else {
          sounds.playBrickThud();
        }
      }

      const closeTimer = setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);

      return () => clearTimeout(closeTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen, isCurrentlyBricked, soundEnabled, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-xs bg-[#FAF9F5] rounded-[36px] p-7 shadow-2xl z-10 border border-[#FAF9F5] text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#ECE8DF] flex items-center justify-center text-[#615D56]"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Physical Device Animation */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center mb-4">
            {step === 'scanning' ? (
              <>
                {/* Wave ripples */}
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-4 rounded-full bg-[#1E1D1B]/10 border border-[#1E1D1B]/20"
                />
                <motion.div
                  animate={{ scale: [1, 2.3], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                  className="absolute inset-4 rounded-full bg-[#1E1D1B]/10 border border-[#1E1D1B]/20"
                />
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#EDEAE1] border border-[#DDD8CD] shadow-md flex items-center justify-center text-[#1E1D1B]">
                  <span className="font-mono text-xs font-bold tracking-widest">
                    NFC
                  </span>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-[#3F684B] text-white flex items-center justify-center shadow-lg"
              >
                <Check className="w-9 h-9 stroke-[3]" />
              </motion.div>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#1E1D1B] tracking-tight">
            {step === 'scanning'
              ? 'Tapping Physical Brick...'
              : isCurrentlyBricked
              ? 'Device Unbricked!'
              : 'Device Bricked!'}
          </h3>

          <p className="text-xs text-[#7A766D] mt-1">
            {step === 'scanning'
              ? 'Hold top of phone near the Brick NFC target'
              : isCurrentlyBricked
              ? 'Distracting apps temporarily unlocked'
              : 'Focus session started. Enjoy your life offline.'}
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
