import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, TrendingDown, Clock, Smartphone, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { ActivityDay } from '../types/brick';
import { sounds } from '../utils/audio';

interface ActivityTabProps {
  activityData: ActivityDay[];
  onOpenDayDetails: (day: ActivityDay) => void;
  subTab?: 'all' | 'daily';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({
  activityData,
  onOpenDayDetails,
  subTab = 'all',
  isExpanded = false,
  onToggleExpand,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(3); // Default to Thu (index 3)
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrevWeek = () => {
    sounds.playClick();
    setDirection(-1);
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    sounds.playClick();
    setDirection(1);
    setWeekOffset((prev) => prev + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNextWeek();
    } else if (diff < -45) {
      handlePrevWeek();
    }
    setTouchStartX(null);
  };

  // Base date starting Monday, Sep 21, 2026
  const weekDays = useMemo(() => {
    const baseMonday = new Date(2026, 8, 21); // Month 8 = September
    baseMonday.setDate(baseMonday.getDate() + weekOffset * 7);

    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(baseMonday);
      d.setDate(baseMonday.getDate() + idx);
      return {
        dateObj: d,
        dayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayFull: d.toLocaleDateString('en-US', { weekday: 'long' }),
        dateNum: d.getDate(),
        monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
        monthFull: d.toLocaleDateString('en-US', { month: 'long' }),
        year: d.getFullYear(),
      };
    });
  }, [weekOffset]);

  const monthHeading = useMemo(() => {
    if (weekDays.length === 0) return '';
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    if (firstDay.monthFull === lastDay.monthFull) {
      return `${firstDay.monthFull} ${firstDay.year}`;
    }
    if (firstDay.year === lastDay.year) {
      return `${firstDay.monthShort} – ${lastDay.monthShort} ${firstDay.year}`;
    }
    return `${firstDay.monthShort} ${firstDay.year} – ${lastDay.monthShort} ${lastDay.year}`;
  }, [weekDays]);

  const totalBrickedMinutes = activityData.reduce((acc, curr) => acc + curr.brickedMinutes, 0);
  const totalScreenMinutes = activityData.reduce((acc, curr) => acc + curr.screenTimeMinutes, 0);
  
  const totalBrickedHrs = Math.floor(totalBrickedMinutes / 60);
  const totalBrickedMins = totalBrickedMinutes % 60;

  const currentDay = activityData[selectedDayIdx] || activityData[0];

  const maxMinutesInWeek = Math.max(
    ...activityData.map((d) => Math.max(d.screenTimeMinutes, d.brickedMinutes))
  );

  if (subTab === 'daily') {
    return (
      <div className="w-full flex-1 px-6 py-2 space-y-5 select-none">
        {/* Month Header with Navigation Chevrons */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="p-1.5 rounded-full text-[#7A766D] hover:text-[#1E1D1B] hover:bg-black/5 active:scale-95 transition-all"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1E1D1B]">
              {monthHeading}
            </span>
            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setDirection(weekOffset > 0 ? -1 : 1);
                  setWeekOffset(0);
                }}
                className="px-2 py-0.5 rounded-full bg-black/5 text-[10px] text-[#7A766D] hover:text-[#1E1D1B] font-medium"
              >
                Today
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextWeek}
            className="p-1.5 rounded-full text-[#7A766D] hover:text-[#1E1D1B] hover:bg-black/5 active:scale-95 transition-all"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Top Weekly Date Pill Strip with Swipe Gesture & Animated Transition */}
        <div
          className="relative overflow-hidden py-1 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={weekOffset}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 60 : -60,
                  opacity: 0,
                  scale: 0.98,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -60 : 60,
                  opacity: 0,
                  scale: 0.98,
                  transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex items-center justify-between gap-1.5 sm:gap-2"
            >
              {weekDays.map((item, idx) => {
                const isSelected = selectedDayIdx === idx;

                return (
                  <button
                    key={item.dayShort}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedDayIdx(idx);
                    }}
                    className={`flex-1 flex flex-col items-center justify-between py-2.5 px-1 h-[78px] sm:h-[84px] rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'bg-white text-[#1A1916] scale-[1.02] border border-white font-semibold z-10'
                        : 'bg-[#262826]/75 backdrop-blur-md text-white/90 border border-white/10 hover:bg-[#262826]/90'
                    }`}
                    title={`${item.dayFull}, ${item.monthShort} ${item.dateNum}`}
                  >
                    {/* Top Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#1A1916]' : 'bg-white/40'
                      }`}
                    />

                    {/* Day Name */}
                    <span
                      className={`text-[10.5px] sm:text-[11px] font-normal leading-none transition-colors ${
                        isSelected ? 'text-[#1A1916] font-medium' : 'text-white/70'
                      }`}
                    >
                      {item.dayShort}
                    </span>

                    {/* Date Number */}
                    <span
                      className={`text-sm sm:text-base leading-none transition-colors ${
                        isSelected ? 'text-[#1A1916] font-bold' : 'text-white font-semibold'
                      }`}
                    >
                      {item.dateNum}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
              Daily Focus
            </h2>
            <p className="text-xs text-[#7A766D] mt-0.5">
              Today's hourly focus blocks, screen time & pickups
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#1E1D1B] text-white text-[11px] font-mono">
            {weekDays[selectedDayIdx]?.dayFull || currentDay.day}
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm grid grid-cols-2 gap-4">
          <div className="border-r border-[#F0ECE2] pr-2">
            <span className="text-[10px] font-semibold text-[#8C887F] uppercase tracking-wider block">
              Offline Focus
            </span>
            <div className="text-2xl font-extrabold text-[#3F684B] font-mono mt-1">
              {Math.floor(currentDay.brickedMinutes / 60)}h {currentDay.brickedMinutes % 60}m
            </div>
            <span className="text-[11px] text-[#7A766D] mt-0.5 block">
              Target: 4h 00m (Achieved)
            </span>
          </div>

          <div className="pl-2">
            <span className="text-[10px] font-semibold text-[#8C887F] uppercase tracking-wider block">
              Active Screen Time
            </span>
            <div className="text-2xl font-extrabold text-[#1E1D1B] font-mono mt-1">
              {Math.floor(currentDay.screenTimeMinutes / 60)}h {currentDay.screenTimeMinutes % 60}m
            </div>
            <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">
              -35% vs daily avg
            </span>
          </div>
        </div>

        {/* Daily Sessions Timeline */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1E1D1B] uppercase tracking-wider">
            Today's Focus Timeline
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F6F4ED]">
              <div className="w-8 h-8 rounded-xl bg-[#1E1D1B] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#1E1D1B]">Morning Deep Work</div>
                <div className="text-[11px] text-[#7A766D]">09:00 - 11:30 · 2h 30m phone bricked</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Completed
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F6F4ED]">
              <div className="w-8 h-8 rounded-xl bg-[#1E1D1B] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#1E1D1B]">Afternoon Concentration</div>
                <div className="text-[11px] text-[#7A766D]">14:00 - 16:30 · 2h 30m phone bricked</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Completed
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DC]">
              <div className="w-8 h-8 rounded-xl bg-[#8A857B] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#1E1D1B]">Night Unplug & Wind-down</div>
                <div className="text-[11px] text-[#7A766D]">21:00 - 23:00 · 2h 00m scheduled</div>
              </div>
              <span className="text-[10px] font-bold text-[#7A766D] bg-[#EFECE5] px-2 py-0.5 rounded-full">
                Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Daily Pickups & Interruptions */}
        <div className="p-4 rounded-2xl bg-[#EBE7DD]/80 border border-[#DDD8CC] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#1E1D1B]" />
            <span className="text-[#3A3834] font-medium">Daily Device Pickups</span>
          </div>
          <span className="font-mono font-bold text-[#1E1D1B] text-sm">18 times</span>
        </div>

        {/* Faint Down Arrow Indicator at the bottom edge */}
        {onToggleExpand && !isExpanded && (
          <div className="w-full flex flex-col items-center justify-center pt-1 pb-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                onToggleExpand();
              }}
              className="group p-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-30 hover:opacity-80"
              title="Expand to Fullscreen"
            >
              <ChevronDown className="w-6 h-6 text-[#1E1D1B] stroke-[2] animate-bounce" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex-1 px-6 py-2 space-y-6 select-none">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
          All Activity
        </h2>
        <p className="text-xs text-[#7A766D] mt-0.5">
          Weekly history, total detox milestones and reclaimed time
        </p>
      </div>

      {/* Streak Hero Card */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F0ECE2] flex items-center justify-center text-[#2A2926]">
            <Flame className="w-6 h-6 text-[#A05C2C]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
              Detox Streak
            </div>
            <div className="text-2xl font-extrabold text-[#1E1D1B] font-mono">
              7 Days <span className="text-xs font-normal text-[#5A5750]">Active</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
            Reclaimed
          </div>
          <div className="text-lg font-bold font-mono text-[#3F684B]">
            +{totalBrickedHrs}h {totalBrickedMins}m
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider block">
              This Week's Balance
            </span>
            <span className="text-sm font-bold text-[#1E1D1B]">
              Focus (Dark) vs Screen Time (Light)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-[#7C786F]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#1E1D1B]" />
              <span>Bricked</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D5D0C6]" />
              <span>Screen</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 pb-2 border-b border-[#F0EDE6]">
          {activityData.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            const brickedHeightPct = (day.brickedMinutes / maxMinutesInWeek) * 100;
            const screenHeightPct = (day.screenTimeMinutes / maxMinutesInWeek) * 100;

            return (
              <button
                key={day.day}
                onClick={() => setSelectedDayIdx(idx)}
                className="group flex flex-col items-center justify-end h-full gap-1 cursor-pointer focus:outline-none"
              >
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Bricked Bar */}
                  <div
                    className={`w-2.5 sm:w-3 rounded-t-md transition-all duration-300 ${
                      isSelected ? 'bg-[#1E1D1B]' : 'bg-[#403D37] opacity-80 group-hover:opacity-100'
                    }`}
                    style={{ height: `${Math.max(8, brickedHeightPct)}%` }}
                  />
                  {/* Screen Time Bar */}
                  <div
                    className={`w-2.5 sm:w-3 rounded-t-md transition-all duration-300 ${
                      isSelected ? 'bg-[#A8A49B]' : 'bg-[#D6D2C8] group-hover:bg-[#C2BEB4]'
                    }`}
                    style={{ height: `${Math.max(8, screenHeightPct)}%` }}
                  />
                </div>

                <span
                  className={`text-[11px] font-semibold mt-1 transition-colors ${
                    isSelected ? 'text-[#1E1D1B] font-bold underline' : 'text-[#8E8B83]'
                  }`}
                >
                  {day.dayShort}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Quick Card */}
        <div
          onClick={() => onOpenDayDetails(currentDay)}
          className="mt-4 p-3.5 rounded-2xl bg-[#F6F4ED] flex items-center justify-between cursor-pointer hover:bg-[#EFECE3] transition-colors"
        >
          <div>
            <div className="text-xs font-bold text-[#1E1D1B]">
              {currentDay.day} ({currentDay.date})
            </div>
            <div className="text-[11px] text-[#7C786F]">
              Bricked: <strong className="font-mono text-[#1E1D1B]">{Math.floor(currentDay.brickedMinutes / 60)}h {currentDay.brickedMinutes % 60}m</strong> · Screen: <span className="font-mono">{Math.floor(currentDay.screenTimeMinutes / 60)}h {currentDay.screenTimeMinutes % 60}m</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C887F]" />
        </div>
      </div>

      {/* Reclaimed Achievements */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
          Milestones
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3DFC] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBE7DC] flex items-center justify-center text-[#2A2926]">
            <Trophy className="w-5 h-5 text-[#8F6A33]" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-[#1E1D1B]">Zen Master (Level 3)</div>
            <div className="text-[11px] text-[#7A766D]">Saved over 25 hours from mindless feeds</div>
          </div>
          <span className="text-[11px] font-bold text-[#3F684B] bg-[#E7EFE9] px-2.5 py-1 rounded-full">
            Unlocked
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3DFC] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBE7DC] flex items-center justify-center text-[#2A2926]">
            <TrendingDown className="w-5 h-5 text-[#2A2926]" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-[#1E1D1B]">Impulse Control</div>
            <div className="text-[11px] text-[#7A766D]">-42% phone pickups after 8:00 PM</div>
          </div>
          <span className="text-[11px] font-bold text-[#3F684B] bg-[#E7EFE9] px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
