import React from 'react';
import { motion } from 'motion/react';

export type TabType = 'events' | 'schedule' | 'activity' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onSoundTrigger?: () => void;
}

// Custom Brick Event Icon (Thinner stroke)
const BrickEventIcon: React.FC<{ isActive: boolean; isDark?: boolean }> = ({ isActive, isDark }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-[28px] h-[28px] transition-colors duration-200 ${
      isActive
        ? isDark ? 'text-white' : 'text-[#1E1D1B]'
        : isDark ? 'text-white/45 group-hover:text-white/75' : 'text-[#75726B] group-hover:text-[#42403B]'
    }`}
  >
    <path
      d="M14 3.6C14.7 3.6 15.5 3.9 16.0 4.4L23.0 11.0C23.7 11.7 24.2 12.7 24.2 13.8V19.8C24.2 21.9 22.5 23.6 20.4 23.6H7.6C5.5 23.6 3.8 21.9 3.8 19.8V13.8C3.8 12.7 4.3 11.7 5.0 11.0L12.0 4.4C12.5 3.9 13.3 3.6 14 3.6Z"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.8" cy="16.8" r="1.1" fill="currentColor" />
    <circle cx="14" cy="16.8" r="1.1" fill="currentColor" />
    <circle cx="18.2" cy="16.8" r="1.1" fill="currentColor" />
  </svg>
);

// Custom Brick Schedule Icon (Thinner stroke)
const BrickScheduleIcon: React.FC<{ isActive: boolean; isDark?: boolean }> = ({ isActive, isDark }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-[28px] h-[28px] transition-colors duration-200 ${
      isActive
        ? isDark ? 'text-white' : 'text-[#1E1D1B]'
        : isDark ? 'text-white/45 group-hover:text-white/75' : 'text-[#75726B] group-hover:text-[#42403B]'
    }`}
  >
    <circle
      cx="14"
      cy="13.8"
      r="10.2"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
    />
    <path
      d="M9.4 15.3L14 12.4V15.3L18.6 12.4"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Custom Brick Activity Icon (Thinner stroke)
const BrickActivityIcon: React.FC<{ isActive: boolean; isDark?: boolean }> = ({ isActive, isDark }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-[28px] h-[28px] transition-colors duration-200 ${
      isActive
        ? isDark ? 'text-white' : 'text-[#1E1D1B]'
        : isDark ? 'text-white/45 group-hover:text-white/75' : 'text-[#75726B] group-hover:text-[#42403B]'
    }`}
  >
    <rect
      x="3.8"
      y="3.8"
      width="20.4"
      height="20.0"
      rx="4.8"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3.8"
      y1="9.2"
      x2="24.2"
      y2="9.2"
      stroke="currentColor"
      strokeWidth={isActive ? '1.3' : '1.0'}
      strokeLinecap="round"
    />
    <line
      x1="9.2"
      y1="17.2"
      x2="18.8"
      y2="17.2"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
      strokeLinecap="round"
    />
  </svg>
);

// Custom Brick Settings Icon (Thinner stroke)
const BrickSettingsIcon: React.FC<{ isActive: boolean; isDark?: boolean }> = ({ isActive, isDark }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-[28px] h-[28px] transition-colors duration-200 ${
      isActive
        ? isDark ? 'text-white' : 'text-[#1E1D1B]'
        : isDark ? 'text-white/45 group-hover:text-white/75' : 'text-[#75726B] group-hover:text-[#42403B]'
    }`}
  >
    <path
      d="M14.26 2.3h-.52a2.4 2.4 0 0 0-2.4 2.4v.2a2.4 2.4 0 0 1-1.2 2.08l-.52.3a2.4 2.4 0 0 1-2.4 0l-.18-.1a2.4 2.4 0 0 0-3.28.88l-.26.45a2.4 2.4 0 0 0 .88 3.28l.18.11a2.4 2.4 0 0 1 1.2 2.07v.62a2.4 2.4 0 0 1-1.2 2.09l-.18.1a2.4 2.4 0 0 0-.88 3.28l.26.45a2.4 2.4 0 0 0 3.28.88l.18-.1a2.4 2.4 0 0 1 2.4 0l.52.3a2.4 2.4 0 0 1 1.2 2.08v.2a2.4 2.4 0 0 0 2.4 2.4h.52a2.4 2.4 0 0 0 2.4-2.4v-.2a2.4 2.4 0 0 1 1.2-2.08l.52-.3a2.4 2.4 0 0 1 2.4 0l.18.1a2.4 2.4 0 0 0 3.28-.88l.26-.45a2.4 2.4 0 0 0-.88-3.28l-.18-.1a2.4 2.4 0 0 1-1.2-2.09v-.62a2.4 2.4 0 0 1 1.2-2.07l.18-.11a2.4 2.4 0 0 0 .88-3.28l-.26-.45a2.4 2.4 0 0 0-3.28-.88l-.18.1a2.4 2.4 0 0 1-2.4 0l-.52-.3a2.4 2.4 0 0 1-1.2-2.08v-.2a2.4 2.4 0 0 0-2.4-2.4z"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="14"
      cy="13.9"
      r="3.6"
      stroke="currentColor"
      strokeWidth={isActive ? '1.4' : '1.1'}
    />
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onSoundTrigger,
}) => {
  const isDark = activeTab === 'events';

  const tabs: {
    id: TabType;
    icon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'events',
      icon: (isActive) => <BrickEventIcon isActive={isActive} isDark={isDark} />,
    },
    {
      id: 'schedule',
      icon: (isActive) => <BrickScheduleIcon isActive={isActive} isDark={isDark} />,
    },
    {
      id: 'activity',
      icon: (isActive) => <BrickActivityIcon isActive={isActive} isDark={isDark} />,
    },
    {
      id: 'settings',
      icon: (isActive) => <BrickSettingsIcon isActive={isActive} isDark={isDark} />,
    },
  ];

  return (
    <nav className="w-full select-none bg-transparent border-none pointer-events-none p-0 m-0 pb-0 translate-y-[5%]">
      <div className="w-full max-w-md mx-auto h-[44px] px-6 sm:px-8 flex items-end justify-between pointer-events-auto pb-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                onSoundTrigger?.();
                onChangeTab(tab.id);
              }}
              aria-label={tab.id}
              className="group relative flex flex-col items-center justify-center h-full px-2 cursor-pointer transition-all focus:outline-none active:scale-90 active:opacity-75 touch-manipulation"
            >
              <div className="h-[26px] w-[26px] flex items-center justify-center">
                {tab.icon(isActive)}
              </div>

              {/* Sliding Active Indicator Square/Dot */}
              <div className="h-1.5 flex items-center justify-center mt-0.5 relative w-5">
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActiveDot"
                    className={`w-1.5 h-1.5 rounded-[1px] ${
                      isDark ? 'bg-white' : 'bg-[#1E1D1B]'
                    }`}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                      mass: 0.7,
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
