import React from 'react';

interface HomeIndicatorProps {
  theme?: 'light' | 'dark';
  showSafeAreaGuide?: boolean;
}

export const HomeIndicator: React.FC<HomeIndicatorProps> = ({
  theme = 'light',
  showSafeAreaGuide = false,
}) => {
  const isDark = theme === 'dark';
  const barBg = isDark ? 'bg-white/50 hover:bg-white/80' : 'bg-[#1E1D1B]/40 hover:bg-[#1E1D1B]/70';

  return (
    <div
      className={`relative w-full h-[34px] select-none pointer-events-none flex items-center justify-center shrink-0 z-40 ${
        showSafeAreaGuide ? 'bg-blue-500/10' : ''
      }`}
      style={{ minHeight: '34px', height: '34px' }}
    >
      {/* Visual Safe Area Guide Indicator (when toggled) */}
      {showSafeAreaGuide && (
        <div className="absolute inset-0 border-t-2 border-dashed border-blue-500/80 pointer-events-none flex items-start justify-between px-3 pt-1">
          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-900/90 px-1.5 py-0.5 rounded shadow-xs">
            Bottom Safe Area: 34pt
          </span>
          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-900/90 px-1.5 py-0.5 rounded shadow-xs">
            Home Bar (138 × 5 pt)
          </span>
        </div>
      )}

      {/* iOS Home Indicator Bar (138px x 5px centered at bottom-2) */}
      <div
        className={`w-[138px] h-[5px] rounded-full transition-colors duration-200 pointer-events-auto cursor-pointer ${barBg}`}
      />
    </div>
  );
};
