import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Check, Bell, TrendingUp, DollarSign, ArrowUpRight, BarChart3, ShieldCheck } from 'lucide-react';
import { ScheduleItem, BrickMode } from '../types/brick';
import { sounds } from '../utils/audio';

interface ScheduleTabProps {
  schedules: ScheduleItem[];
  modes: BrickMode[];
  onUpdateSchedules: (schedules: ScheduleItem[]) => void;
  soundEnabled: boolean;
  subTab?: 'revenue' | 'advance';
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  schedules,
  modes,
  onUpdateSchedules,
  soundEnabled,
  subTab = 'revenue',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newModeId, setNewModeId] = useState(modes[0]?.id || 'no-socials');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const handleToggleSchedule = (id: string) => {
    if (soundEnabled) sounds.playClick();
    const updated = schedules.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    onUpdateSchedules(updated);
  };

  const handleDeleteSchedule = (id: string) => {
    if (soundEnabled) sounds.playClick();
    const updated = schedules.filter((s) => s.id !== id);
    onUpdateSchedules(updated);
  };

  const handleToggleDay = (dayIndex: number) => {
    if (soundEnabled) sounds.playClick();
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (soundEnabled) sounds.playClick();

    const newSchedule: ScheduleItem = {
      id: `sch-${Date.now()}`,
      name: newTitle.trim(),
      modeId: newModeId,
      days: selectedDays,
      startTime: newStartTime,
      endTime: newEndTime,
      enabled: true,
    };

    onUpdateSchedules([...schedules, newSchedule]);
    setIsAdding(false);
    setNewTitle('');
  };

  if (subTab === 'revenue') {
    return (
      <div className="w-full flex-1 px-6 py-2 space-y-5 select-none">
        {/* Tab Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
              Revenue
            </h2>
            <p className="text-xs text-[#7A766D] mt-0.5">
              Live ticketing yield, gross receipts & payout schedule
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E1D1B] text-white text-[11px] font-medium shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>+18.4%</span>
          </div>
        </div>

        {/* Hero Revenue Stat Card */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block">
                Total Gross Revenue
              </span>
              <div className="text-3xl font-extrabold text-[#1E1D1B] tracking-tight mt-1 font-mono">
                ฿148,500
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#F4F1EA] flex items-center justify-center text-[#1E1D1B]">
              <BarChart3 className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F2EFE8]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9C978D] tracking-wider block">
                Advance Deposits
              </span>
              <span className="text-sm font-bold text-[#1E1D1B] font-mono">
                ฿124,000
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#9C978D] tracking-wider block">
                Pending Settlement
              </span>
              <span className="text-sm font-bold text-amber-700 font-mono">
                ฿24,500
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Sales by Zone Card */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3.5">
          <h3 className="text-xs font-bold text-[#1E1D1B] uppercase tracking-wider">
            Sales Breakdown by Zone
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-[#1E1D1B] mb-1">
                <span>Zone A (VIP Gallery)</span>
                <span className="font-mono font-bold">฿54,000 (36%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EBE7DE] overflow-hidden">
                <div className="h-full bg-[#1E1D1B] rounded-full w-[36%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[#1E1D1B] mb-1">
                <span>Zone B (Acoustic Floor)</span>
                <span className="font-mono font-bold">฿42,000 (28%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EBE7DE] overflow-hidden">
                <div className="h-full bg-[#524E46] rounded-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[#1E1D1B] mb-1">
                <span>Zone C (Workshop Studio)</span>
                <span className="font-mono font-bold">฿28,000 (19%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EBE7DE] overflow-hidden">
                <div className="h-full bg-[#827D74] rounded-full w-[19%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Payout & Settlement Info */}
        <div className="p-4 rounded-2xl bg-[#E8E4D9]/80 border border-[#DBD6CA] flex items-start gap-3 text-xs text-[#5E5A52] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <div>
            <strong>Next Payout:</strong> Scheduled for Monday, Oct 5 via Bangkok Bank. Funds are automatically transferred upon concert completion.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 px-6 py-2 space-y-6 select-none">
      {/* Tab Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
            Advance
          </h2>
          <p className="text-xs text-[#7A766D] mt-0.5">
            Advance scheduling, automated routines & phone-free blocks
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-9 h-9 rounded-full bg-[#1E1D1B] text-white flex items-center justify-center hover:bg-[#383530] transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Form Accordion */}
      {isAdding && (
        <form
          onSubmit={handleSaveSchedule}
          className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#DDD9CE] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#1E1D1B]">New Auto-Brick Routine</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#7B776E] hover:underline"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block mb-1">
              Routine Title
            </label>
            <input
              type="text"
              placeholder="e.g. Evening Reading, Morning Routine"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F3EC] border border-[#DDD9CE] text-[#1E1D1B] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block mb-1">
              Target Mode
            </label>
            <select
              value={newModeId}
              onChange={(e) => setNewModeId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F3EC] border border-[#DDD9CE] text-[#1E1D1B] focus:outline-none"
            >
              {modes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.appsCount} apps blocked)
                </option>
              ))}
            </select>
          </div>

          {/* Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-[#F5F3EC] border border-[#DDD9CE] text-[#1E1D1B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block mb-1">
                End Time
              </label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-[#F5F3EC] border border-[#DDD9CE] text-[#1E1D1B] focus:outline-none"
              />
            </div>
          </div>

          {/* Days of week */}
          <div>
            <label className="text-[11px] font-semibold text-[#8C887F] uppercase tracking-wider block mb-1.5">
              Repeat Days
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES.map((name, idx) => {
                const isSelected = selectedDays.includes(idx);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleToggleDay(idx)}
                    className={`py-2 text-[11px] font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-[#1E1D1B] text-white'
                        : 'bg-[#F0EDE6] text-[#7A7770] hover:bg-[#E5E1D8]'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1E1D1B] text-white text-xs font-semibold tracking-wide hover:bg-[#35332E] transition-colors cursor-pointer"
          >
            Create Routine
          </button>
        </form>
      )}

      {/* Schedule Items List */}
      <div className="space-y-3">
        {schedules.map((schedule) => {
          const mode = modes.find((m) => m.id === schedule.modeId) || modes[0];

          return (
            <div
              key={schedule.id}
              className={`p-4 rounded-3xl transition-all border ${
                schedule.enabled
                  ? 'bg-[#FFFFFF] border-[#E3DFC] shadow-sm'
                  : 'bg-[#EDEAE1]/70 border-transparent opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E1D1B] tracking-tight">
                    {schedule.name}
                  </h3>
                  <div className="text-xs text-[#7A766E] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono font-medium">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-[#4A4740]">{mode?.name}</span>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => handleToggleSchedule(schedule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    schedule.enabled ? 'bg-[#1E1D1B]' : 'bg-[#D1CCC2]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      schedule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Day indicator dots & actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2EFE8]">
                <div className="flex items-center gap-1">
                  {DAY_NAMES.map((day, idx) => {
                    const isDayActive = schedule.days.includes(idx);
                    return (
                      <span
                        key={day}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isDayActive
                            ? 'bg-[#1E1D1B] text-white'
                            : 'bg-[#F2EFE8] text-[#9E9A91]'
                        }`}
                      >
                        {day[0]}
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="text-xs text-[#A84848] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routine Info Banner */}
      <div className="p-4 rounded-2xl bg-[#E8E4D9]/80 border border-[#DBD6CA] text-xs text-[#5E5A52] leading-relaxed">
        <strong>Auto-Brick Info:</strong> When scheduled times arrive, Brick automatically engages selected app restrictions. You can always override using your physical Brick or an emergency pass.
      </div>
    </div>
  );
};
