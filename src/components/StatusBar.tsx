import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  theme?: 'light' | 'dark';
  showDynamicIsland?: boolean;
  showSafeAreaGuide?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  theme = 'light',
  showDynamicIsland = true,
  showSafeAreaGuide = false,
}) => {
  const [timeStr, setTimeStr] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 12-hour or 24-hour style e.g. "9:41"
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#1E1D1B]';
  const iconColor = isDark ? 'text-white' : 'text-[#1E1D1B]';
  const batteryBorder = isDark ? 'border-white/80' : 'border-[#1E1D1B]/80';
  const batteryFill = isDark ? 'bg-white' : 'bg-[#1E1D1B]';

  return (
    <div
      className={`relative w-full h-[59px] select-none pointer-events-none z-40 shrink-0 transition-colors duration-200 ${
        showSafeAreaGuide ? 'bg-blue-500/10' : ''
      }`}
      style={{ minHeight: '59px', height: '59px' }}
    >
      {/* Visual Safe Area Guide Indicator (when toggled) */}
      {showSafeAreaGuide && (
        <div className="absolute inset-0 border-b-2 border-dashed border-blue-500/80 pointer-events-none flex items-end justify-between px-3 pb-1">
          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-900/90 px-1.5 py-0.5 rounded shadow-xs">
            Top Safe Area: 59pt
          </span>
          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-900/90 px-1.5 py-0.5 rounded shadow-xs">
            Dynamic Island
          </span>
        </div>
      )}

      {/* Clock Display (Standard Apple HIG Left Alignment) */}
      <div className={`absolute left-8 top-[14px] text-[15px] font-semibold tracking-tight ${textColor} transition-colors duration-200`}>
        {timeStr}
      </div>

      {/* Dynamic Island Capsule (Centered, 126px x 37px, top 11px) */}
      {showDynamicIsland && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[11px] w-[126px] h-[37px] rounded-full bg-black shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center justify-between px-3 pointer-events-auto cursor-default group transition-transform hover:scale-[1.02]">
          {/* Ambient Sensor */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#181818] ring-1 ring-white/5" />
          
          {/* Subtle camera lens glare */}
          <div className="w-3 h-3 rounded-full bg-[#0d0d0d] ring-1 ring-white/10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1c2936]" />
          </div>
        </div>
      )}

      {/* Right Status Icons: Signal, Wi-Fi, Battery */}
      <div className={`absolute right-7 top-[15px] flex items-center gap-2 ${iconColor} transition-colors duration-200`}>
        {/* Cellular Signal Bars (4 Bars) */}
        <div className="flex items-end gap-[2px] h-[11px]">
          <div className={`w-[3px] h-[4px] rounded-[0.5px] ${batteryFill}`} />
          <div className={`w-[3px] h-[6px] rounded-[0.5px] ${batteryFill}`} />
          <div className={`w-[3px] h-[8.5px] rounded-[0.5px] ${batteryFill}`} />
          <div className={`w-[3px] h-[11px] rounded-[0.5px] ${batteryFill}`} />
        </div>

        {/* Wi-Fi Icon */}
        <Wifi className="w-[15px] h-[15px] stroke-[2.4]" />

        {/* Battery Icon (Outline + Fill + Cap) */}
        <div className="flex items-center">
          <div className={`w-[22px] h-[11.5px] rounded-[3.5px] border-[1.5px] ${batteryBorder} p-[1.5px] flex items-center`}>
            <div className={`h-full w-[85%] rounded-[1.5px] ${batteryFill}`} />
          </div>
          <div className={`w-[1.5px] h-[4.5px] rounded-r-[1px] ${batteryFill} -ml-[0.5px]`} />
        </div>
      </div>
    </div>
  );
};
