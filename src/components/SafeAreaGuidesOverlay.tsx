import React from 'react';

interface SafeAreaGuidesOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const SafeAreaGuidesOverlay: React.FC<SafeAreaGuidesOverlayProps> = ({
  isVisible,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between select-none">
      {/* Top Safe Area Zone (59pt) */}
      <div className="relative w-full h-[max(59px,env(safe-area-inset-top,59px))] bg-red-500/15 border-b-2 border-dashed border-red-500 flex flex-col items-center justify-start pt-1">
        {/* Dynamic Island Outline: 125 x 35 pt */}
        <div className="w-[125px] h-[35px] mt-1.5 rounded-full bg-black/80 border border-white/20 flex items-center justify-center shadow-lg">
          <span className="text-[9px] font-mono text-white/90">Dynamic Island</span>
        </div>
        <div className="absolute bottom-1 right-2 text-[10px] font-mono font-bold text-red-700 bg-white/80 px-1 rounded shadow-xs">
          Top Safe Area: 59pt (177px @3x)
        </div>
      </div>

      {/* Floating Center Badge with dismiss button */}
      <div className="w-full flex justify-center pointer-events-auto px-4 my-auto">
        <div className="bg-black/85 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold">
              Viewport: 440 × 956 pt (1320 × 2868 px @3x)
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
          >
            Hide Guides
          </button>
        </div>
      </div>

      {/* Bottom Safe Area Zone (34pt) */}
      <div className="relative w-full h-[max(34px,env(safe-area-inset-bottom,34px))] bg-red-500/15 border-t-2 border-dashed border-red-500 flex items-center justify-center">
        {/* Home Indicator */}
        <div className="w-[140px] h-[5px] rounded-full bg-black/70" />
        <div className="absolute top-1 right-2 text-[10px] font-mono font-bold text-red-700 bg-white/80 px-1 rounded shadow-xs">
          Bottom Safe Area: 34pt (102px @3x)
        </div>
      </div>
    </div>
  );
};
