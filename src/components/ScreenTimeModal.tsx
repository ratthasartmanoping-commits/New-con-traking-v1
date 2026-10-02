import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, ArrowDownRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import { ActivityDay } from '../types/brick';

interface ScreenTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayData: ActivityDay;
}

export const ScreenTimeModal: React.FC<ScreenTimeModalProps> = ({
  isOpen,
  onClose,
  todayData,
}) => {
  if (!isOpen) return null;

  const hours = Math.floor(todayData.screenTimeMinutes / 60);
  const minutes = todayData.screenTimeMinutes % 60;

  const brickedHours = Math.floor(todayData.brickedMinutes / 60);
  const brickedMinutes = todayData.brickedMinutes % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[85dvh] bg-[#FAF9F6] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col z-10 overflow-hidden border border-[#EBE7DF]"
        >
          {/* Grab Handle */}
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-10 h-1.5 bg-[#D8D4CA] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-[#ECE7DD]">
            <div>
              <span className="text-xs font-semibold text-[#8A867E] uppercase tracking-wider">
                Screen Time Analytics
              </span>
              <h3 className="text-xl font-bold text-[#1E1D1B] tracking-tight">
                Today's Overview
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#55524B] hover:text-[#1E1D1B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 py-5 space-y-6">
            {/* Top Metric Highlight Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F2EFE8] border border-[#E4DFD6]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#7C786F]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Total Screen Time</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1E1D1B] mt-1 tracking-tight font-mono">
                  {hours}h {minutes}m
                </div>
                <div className="text-[11px] text-[#A24848] flex items-center gap-1 mt-1 font-medium">
                  <span>+18% from yesterday</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBE7DC] border border-[#DDD8CD]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#5E5A52]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3F684B]" />
                  <span>Time Saved (Bricked)</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1E1D1B] mt-1 tracking-tight font-mono">
                  {brickedHours}h {brickedMinutes}m
                </div>
                <div className="text-[11px] text-[#3F684B] flex items-center gap-1 mt-1 font-medium">
                  <ArrowDownRight className="w-3 h-3" />
                  <span>Reclaimed for focus</span>
                </div>
              </div>
            </div>

            {/* Pickups / Interactions */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#ECE8DF]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0EDE5] flex items-center justify-center text-[#524E46]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1D1B]">Daily Phone Pickups</div>
                  <div className="text-[11px] text-[#858178]">Avg. 1 pickup every 12 mins</div>
                </div>
              </div>
              <div className="text-lg font-bold font-mono text-[#1E1D1B]">
                {todayData.pickups}{' '}
                <span className="text-xs font-normal text-[#8A867E]">times</span>
              </div>
            </div>

            {/* Apps Breakdown Bars */}
            <div>
              <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider mb-3">
                App & Category Breakdown
              </div>

              <div className="space-y-3">
                {todayData.appsBreakdown.map((app) => {
                  const appHrs = Math.floor(app.minutes / 60);
                  const appMins = app.minutes % 60;
                  const percentage = Math.round(
                    (app.minutes / todayData.screenTimeMinutes) * 100
                  );

                  return (
                    <div
                      key={app.name}
                      className="p-3 rounded-xl bg-white border border-[#EAE6DD]"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1E1D1B]">{app.name}</span>
                        <span className="text-xs font-mono font-semibold text-[#3C3A35]">
                          {appHrs > 0 ? `${appHrs}h ` : ''}
                          {appMins}m{' '}
                          <span className="text-[10px] text-[#8C887F] font-normal">
                            ({percentage}%)
                          </span>
                        </span>
                      </div>
                      {/* Bar */}
                      <div className="w-full h-2 bg-[#EFECE5] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: '#4A463F',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zen Affirmation */}
            <div className="p-4 rounded-2xl bg-[#EBE7DC]/80 border border-[#DDD8CD] text-center">
              <p className="text-xs text-[#524E47] italic">
                “Your attention is your most precious currency. Spend it where it truly matters.”
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#ECE7DD] bg-[#FAF9F6]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#1F1E1D] hover:bg-[#33312D] text-white text-sm font-semibold tracking-tight transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
