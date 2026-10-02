import React from 'react';
import { motion } from 'motion/react';

interface HeaderBarProps {
  todayScreenTimeStr: string;
  onOpenScreenTime: () => void;
  isBricked: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  todayScreenTimeStr,
  onOpenScreenTime,
}) => {
  return (
    <div className="w-full flex flex-col items-center pt-6 pb-2 px-7 select-none">
      {/* Screen Time Badge / Pill matching image.png */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpenScreenTime}
        className="group relative flex items-center justify-center px-6 py-2.5 rounded-2xl bg-[#EBE8E0]/90 hover:bg-[#E5E2DA] border border-[#FAF9F5]/80 transition-all duration-200 cursor-pointer shadow-[0_4px_16px_-4px_rgba(40,36,30,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]"
      >
        <span className="text-sm sm:text-base font-bold text-[#1C1B19] tracking-tight">
          {todayScreenTimeStr}{' '}
          <span className="font-normal text-[#75726B] ml-1">today</span>
        </span>
      </motion.button>
    </div>
  );
};
