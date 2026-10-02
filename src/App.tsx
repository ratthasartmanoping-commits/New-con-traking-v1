import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronUp, MapPin, Calendar, Check, Mail, User, LogOut } from 'lucide-react';
import { BottomNav, TabType } from './components/BottomNav';
import { EventsView } from './components/EventsView';
import { ScheduleTab } from './components/ScheduleTab';
import { ActivityTab } from './components/ActivityTab';
import { SettingsTab } from './components/SettingsTab';
import { PhysicalBrickOverlay } from './components/PhysicalBrickOverlay';
import { ProfileSheet } from './components/ProfileSheet';
import {
  DEFAULT_MODES,
  DEFAULT_SCHEDULES,
  DEFAULT_ACTIVITY_DATA,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { BrickMode, ScheduleItem, ActivityDay, UserSettings } from './types/brick';
import { EventItem, EVENTS_DATA, ARCHIVE_EVENTS_DATA } from './types/event';
import heroTea from './assets/images/hero_tea_meditation_1790521078902.jpg';
import heroArt from './assets/images/hero_art_sculpture_1790521092278.jpg';
import heroSound from './assets/images/hero_sound_bath_1790521105953.jpg';
import heroCeramic from './assets/images/hero_ceramic_craft_1790521118785.jpg';
import { sounds } from './utils/audio';
import { saveUserData, loadUserData } from './lib/firebase';

const refreshEventImages = (items: EventItem[]): EventItem[] => {
  return items.map(item => {
    if (item.id === 'evt-tea') return { ...item, imageUrl: heroTea };
    if (item.id === 'evt-art') return { ...item, imageUrl: heroArt };
    if (item.id === 'evt-sound') return { ...item, imageUrl: heroSound };
    if (item.id === 'evt-ceramic') return { ...item, imageUrl: heroCeramic };
    if (item.id === 'arch-1') return { ...item, imageUrl: heroArt };
    if (item.id === 'arch-2') return { ...item, imageUrl: heroSound };
    return item;
  });
};

export default function App() {
  // State management with localStorage persistence
  const [modes, setModes] = useState<BrickMode[]>(() => {
    try {
      const saved = localStorage.getItem('brick_modes');
      return saved ? JSON.parse(saved) : DEFAULT_MODES;
    } catch {
      return DEFAULT_MODES;
    }
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('brick_schedules');
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULES;
    } catch {
      return DEFAULT_SCHEDULES;
    }
  });

  const [activityData, setActivityData] = useState<ActivityDay[]>(() => {
    try {
      const saved = localStorage.getItem('brick_activity');
      return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY_DATA;
    } catch {
      return DEFAULT_ACTIVITY_DATA;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('brick_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Booked Events state
  const [bookedEventIds, setBookedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('booked_event_ids');
      return saved ? JSON.parse(saved) : ['evt-tea'];
    } catch {
      return ['evt-tea'];
    }
  });

  // Dynamic events list state
  const [events, setEvents] = useState<EventItem[]>(() => {
    const defaultEvents = [...EVENTS_DATA, ...ARCHIVE_EVENTS_DATA];
    try {
      const saved = localStorage.getItem('brick_events');
      if (saved) {
        const parsed: EventItem[] = JSON.parse(saved);
        // Refresh and map images to current hashed URL paths
        return refreshEventImages(parsed);
      }
      return defaultEvents;
    } catch {
      return defaultEvents;
    }
  });

  // Auth & Login Screen state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('brick_is_logged_in');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [isLoginSlideUp, setIsLoginSlideUp] = useState<boolean>(false);
  const [loginTouchStartY, setLoginTouchStartY] = useState<number | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [loginEmailInput, setLoginEmailInput] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginShowSuccess, setLoginShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('brick_is_logged_in', JSON.stringify(isLoggedIn));
    } catch {}
  }, [isLoggedIn]);

  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('brick_user_email') || '';
    } catch {
      return '';
    }
  });

  // Load user data from Firebase Firestore when user logs in or app mounts
  useEffect(() => {
    async function fetchFirebaseData() {
      if (isLoggedIn && userEmail) {
        const remoteData = await loadUserData(userEmail);
        if (remoteData) {
          if (remoteData.events) setEvents(refreshEventImages(remoteData.events));
          if (remoteData.schedules) setSchedules(remoteData.schedules);
          if (remoteData.activityData) setActivityData(remoteData.activityData);
          if (remoteData.settings) setSettings(remoteData.settings);
          if (remoteData.bookedEventIds) setBookedEventIds(remoteData.bookedEventIds);
          if (remoteData.modes) setModes(remoteData.modes);
        }
      }
    }
    fetchFirebaseData();
  }, [isLoggedIn, userEmail]);

  // Unified real-time sync back to Firebase Firestore with an elegant 800ms debounce
  useEffect(() => {
    if (isLoggedIn && userEmail) {
      const delayDebounceFn = setTimeout(() => {
        saveUserData(userEmail, {
          events,
          schedules,
          activityData,
          settings,
          bookedEventIds,
          modes
        });
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [isLoggedIn, userEmail, events, schedules, activityData, settings, bookedEventIds, modes]);

  const handleGoogleLogin = () => {
    if (settings.soundEnabled) sounds.playClick();
    // 1. Close modal and slide bottom buttons down (image expands back fully)
    setIsLoginSlideUp(false);
    setIsEmailModalOpen(false);
    
    // 2. Wait 450ms for the slide/stretch animation to settle completely first
    setTimeout(() => {
      setIsLoggingIn(true);
      
      // 3. After 1.4s, trigger chime sound, confetti and success checkmark
      setTimeout(() => {
        if (settings.soundEnabled) sounds.playZenChime();
        try {
          confetti({
            particleCount: 50,
            spread: 75,
            origin: { y: 0.75 },
            colors: ['#3A6447', '#4285F4', '#34A853', '#FBBC05', '#EA4335'],
          });
        } catch {}
        setLoginShowSuccess(true);
        
        // 4. After 0.8s of success screen, complete login to fade into app dashboard
        setTimeout(() => {
          const email = 'google_user@gmail.com';
          setUserEmail(email);
          try {
            localStorage.setItem('brick_user_email', email);
          } catch {}
          setIsLoggedIn(true);
          setIsLoggingIn(false);
          setLoginShowSuccess(false);
        }, 800);
      }, 1400);
    }, 450);
  };

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.soundEnabled) sounds.playClick();
    // 1. Close modal and slide bottom buttons down (image expands back fully)
    setIsLoginSlideUp(false);
    setIsEmailModalOpen(false);

    // 2. Wait 450ms for the slide/stretch animation to settle completely first
    setTimeout(() => {
      setIsLoggingIn(true);

      // 3. After 1.4s, trigger chime sound, confetti and success checkmark
      setTimeout(() => {
        if (settings.soundEnabled) sounds.playZenChime();
        try {
          confetti({
            particleCount: 50,
            spread: 75,
            origin: { y: 0.75 },
            colors: ['#386447', '#2C523A', '#4285F4', '#34A853'],
          });
        } catch {}
        setLoginShowSuccess(true);

        // 4. After 0.8s of success screen, complete login to fade into app dashboard
        setTimeout(() => {
          const email = loginEmailInput.trim() || 'visitor@example.com';
          setUserEmail(email);
          try {
            localStorage.setItem('brick_user_email', email);
          } catch {}
          setIsLoggedIn(true);
          setIsLoggingIn(false);
          setLoginShowSuccess(false);
        }, 800);
      }, 1400);
    }, 450);
  };

  const handleSignOut = () => {
    if (settings.soundEnabled) sounds.playClick();
    setIsLoggedIn(false);
    setIsLoginSlideUp(false);
    setUserEmail('');
    try {
      localStorage.removeItem('brick_user_email');
    } catch {}
  };

  // App Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [tabMode, setTabMode] = useState<'events' | 'archive'>('events');
  const [scheduleSubTab, setScheduleSubTab] = useState<'revenue' | 'advance'>('revenue');
  const [activitySubTab, setActivitySubTab] = useState<'all' | 'daily'>('all');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'detail'>('general');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isPhysicalScanOpen, setIsPhysicalScanOpen] = useState(false);
  const [isDailyExpanded, setIsDailyExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  useEffect(() => {
    setIsDailyExpanded(false);
  }, [activeTab, activitySubTab]);

  const isFullScreen = Boolean(
    selectedEvent || (activeTab === 'activity' && activitySubTab === 'daily' && isDailyExpanded)
  );

  // Synchronize background-color and theme-color dynamically to prevent any mobile browser border
  useEffect(() => {
    const isDark = activeTab === 'events' || !isLoggedIn;
    const bgColor = isDark ? '#1A1918' : '#FAF9F6';
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.style.backgroundColor = bgColor;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', bgColor);
    }
  }, [activeTab, isLoggedIn]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brick_schedules', JSON.stringify(schedules));
    } catch {}
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem('brick_activity', JSON.stringify(activityData));
    } catch {}
  }, [activityData]);

  useEffect(() => {
    try {
      localStorage.setItem('brick_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('booked_event_ids', JSON.stringify(bookedEventIds));
    } catch {}
  }, [bookedEventIds]);

  useEffect(() => {
    try {
      localStorage.setItem('brick_events', JSON.stringify(events));
    } catch {}
  }, [events]);

  const handleToggleBook = (eventId: string) => {
    if (settings.soundEnabled) sounds.playClick();
    if (bookedEventIds.includes(eventId)) {
      setBookedEventIds((prev) => prev.filter((id) => id !== eventId));
    } else {
      setBookedEventIds((prev) => [...prev, eventId]);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#3A6447', '#A39F95', '#DFDBD2'],
        });
      } catch {}
    }
  };

  const handleArchiveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, isArchived: true } : evt))
    );
  };

  const handleRestoreEvent = (eventId: string) => {
    if (settings.soundEnabled) sounds.playZenChime();
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, isArchived: false } : evt))
    );
  };

  const handleResetData = () => {
    if (confirm('Reset all data to default presets?')) {
      setModes(DEFAULT_MODES);
      setSchedules(DEFAULT_SCHEDULES);
      setActivityData(DEFAULT_ACTIVITY_DATA);
      setSettings(DEFAULT_SETTINGS);
      setBookedEventIds(['evt-tea']);
      setEvents([...EVENTS_DATA, ...ARCHIVE_EVENTS_DATA]);
      if (settings.soundEnabled) sounds.playZenChime();
    }
  };

  return (
    <div className={`app w-full h-full min-h-dvh h-dvh flex flex-col justify-between font-sans select-none overflow-hidden m-0 p-0 ${activeTab === 'events' || !isLoggedIn ? 'bg-[#1A1918]' : 'bg-[#FAF9F6]'}`}>
      {/* Main Content View - Flex Column with flex-1 and overflow-hidden */}
      <div
        onTouchStart={!isLoggedIn && !isLoggingIn ? (e) => setLoginTouchStartY(e.touches[0].clientY) : undefined}
        onTouchEnd={!isLoggedIn && !isLoggingIn ? (e) => {
          if (loginTouchStartY === null) return;
          const deltaY = loginTouchStartY - e.changedTouches[0].clientY;
          if (deltaY > 25) {
            if (settings.soundEnabled) sounds.playClick();
            setIsLoginSlideUp(true);
          } else if (deltaY < -25) {
            setIsLoginSlideUp(false);
          }
          setLoginTouchStartY(null);
        } : undefined}
        className={`flex-1 w-full min-h-0 relative flex flex-col justify-between overflow-hidden z-10 ${activeTab === 'events' || !isLoggedIn ? 'bg-[#1A1918]' : 'bg-[#FAF9F6]'}`}
      >
          {!isLoggedIn || isLoggingIn ? (
            /* Login Screen Cover View (Matching user uploaded design) */
            <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#1A1918]">
              {/* Full-bleed Japanese Tea Gathering Photo */}
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
                alt="Mindful Tea & Silence Gathering"
                className="absolute inset-0 w-full h-full object-cover opacity-90 scale-105"
              />

              {/* Dark Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

              {/* Empty top spacing */}
              <div />

              {/* Clean loading / success animation overlay */}
              {isLoggingIn && (
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[6px] z-50 flex flex-col items-center justify-center space-y-4 text-white animate-fadeIn">
                  {!loginShowSuccess ? (
                    <div className="flex flex-col items-center space-y-4 animate-scaleUp">
                      {/* Beautiful glowing Zen spin spinner */}
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 w-full h-full rounded-full border-[3px] border-emerald-500/20" />
                        <div className="absolute inset-0 w-full h-full rounded-full border-[3px] border-t-emerald-400 border-r-emerald-500/40 animate-spin" />
                        <div className="w-5 h-5 rounded-full bg-emerald-500/35 animate-ping" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-semibold tracking-wider text-emerald-300">กำลังลงชื่อเข้าใช้...</p>
                        <p className="text-[11px] text-neutral-400 font-light">กรุณารอสักครู่เพื่อเข้าสู่ระบบ Presets</p>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="flex flex-col items-center space-y-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500 border border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.5)] flex items-center justify-center">
                        <Check className="w-9 h-9 text-white stroke-[3] animate-scaleUp" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-base font-bold tracking-wider text-emerald-300">ยินดีต้อนรับกลับมา</p>
                        <p className="text-[11px] text-neutral-300 font-light">ลงชื่อเข้าใช้งานสำเร็จ</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Minimal Clean Bottom Handle */}
              {!isLoggingIn && (
                <div className="relative z-20 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] flex flex-col items-center text-white">
                  <button
                    onClick={() => {
                      if (settings.soundEnabled) sounds.playClick();
                      setIsLoginSlideUp(true);
                    }}
                    className="active:scale-95 text-white/95 hover:text-white font-medium text-xs sm:text-sm tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group py-2 px-4 drop-shadow-md"
                  >
                    <ChevronUp className="w-5 h-5 text-emerald-300 animate-bounce group-hover:-translate-y-1 transition-transform" />
                    <span>Swipe Up to Sign In</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex flex-col justify-between"
            >
              {/* Persistent Top Floating Header Area across ALL tabs */}
              <motion.div
                animate={{
                  y: selectedEvent ? -100 : 0,
                  opacity: selectedEvent ? 0 : 1,
                }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="absolute left-0 right-0 z-30 px-6 sm:px-7 flex items-center justify-between pointer-events-none"
                style={{
                  top: '2%',
                  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
                }}
              >
            {/* Left Segmented Pill Switcher or Back Button */}
            {isDailyExpanded && activeTab === 'activity' && activitySubTab === 'daily' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (settings.soundEnabled) sounds.playClick();
                  setIsDailyExpanded(false);
                }}
                className="h-11 sm:h-12 px-4 rounded-full bg-black/75 hover:bg-black/85 active:scale-95 border border-white/20 shadow-xl flex items-center gap-1.5 text-white font-medium text-xs tracking-wider transition-all pointer-events-auto cursor-pointer group isolate"
                title="Exit Fullscreen"
              >
                <ChevronLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>
            ) : (
              <div className="h-11 sm:h-12 p-0.5 rounded-full bg-black/70 border border-white/25 shadow-xl flex items-center pointer-events-auto relative isolate">
                {activeTab === 'settings' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setSettingsSubTab('general');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        settingsSubTab === 'general' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {settingsSubTab === 'general' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>General</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setSettingsSubTab('detail');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        settingsSubTab === 'detail' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {settingsSubTab === 'detail' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Detail</span>
                    </button>
                  </>
                ) : activeTab === 'schedule' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setScheduleSubTab('revenue');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        scheduleSubTab === 'revenue' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {scheduleSubTab === 'revenue' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Revenue</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setScheduleSubTab('advance');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        scheduleSubTab === 'advance' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {scheduleSubTab === 'advance' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Advance</span>
                    </button>
                  </>
                ) : activeTab === 'activity' ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setActivitySubTab('all');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        activitySubTab === 'all' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {activitySubTab === 'all' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>All</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setActivitySubTab('daily');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        activitySubTab === 'daily' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {activitySubTab === 'daily' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Daily</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setActiveTab('events');
                        setTabMode('events');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        activeTab === 'events' && tabMode === 'events' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {activeTab === 'events' && tabMode === 'events' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Event</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (settings.soundEnabled) sounds.playClick();
                        setActiveTab('events');
                        setTabMode('archive');
                      }}
                      className={`relative z-10 h-10 sm:h-11 w-20 sm:w-24 rounded-full text-xs tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                        activeTab === 'events' && tabMode === 'archive' ? 'text-[#1E1D1B] font-medium' : 'text-white/85 hover:text-white font-normal'
                      }`}
                    >
                      {activeTab === 'events' && tabMode === 'archive' && (
                        <motion.div
                          layoutId="switcherActiveBg"
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span>Archive</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Profile Menu Capsule (Single continuous container sliding down absolutely to prevent Event/Archive from shifting) */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 pointer-events-auto shrink-0 z-45">
              <motion.div
                initial={false}
                animate={{
                  height: isProfileMenuOpen ? (window.innerWidth < 640 ? 144 : 156) : (window.innerWidth < 640 ? 44 : 48),
                  backgroundColor: isProfileMenuOpen ? "rgba(26, 25, 24, 0.95)" : "rgba(0, 0, 0, 0.7)",
                  borderColor: isProfileMenuOpen ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-11 sm:w-12 rounded-full border shadow-2xl flex flex-col items-center overflow-hidden isolate"
              >
                {/* 1. Profile Avatar (The Trigger) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (settings.soundEnabled) sounds.playClick();
                    setIsProfileMenuOpen((prev) => !prev);
                  }}
                  aria-label="Toggle Profile Menu"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center overflow-hidden shrink-0 relative"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-full" />
                </button>

                {/* Vertical Divider / Spacer when open */}
                {isProfileMenuOpen && (
                  <div className="w-5 h-[1px] bg-white/20 my-1 animate-fadeIn shrink-0" />
                )}

                {/* Menu Action Icons (Slide down inside same capsule) */}
                <div className="flex flex-col items-center gap-2.5 py-1 shrink-0">
                  {/* Action 1: Open the Slide-Up Profile Sheet */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (settings.soundEnabled) sounds.playClick();
                      setIsProfileSheetOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    title="User Profile Card"
                    className="w-8 h-8 rounded-full hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-white/90 hover:text-white"
                  >
                    <User className="w-[18px] h-[18px]" />
                  </button>

                  {/* Action 2: Sign Out */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (settings.soundEnabled) sounds.playClick();
                      handleSignOut();
                      setIsProfileMenuOpen(false);
                    }}
                    title="Sign Out"
                    className="w-8 h-8 rounded-full hover:bg-red-500/10 active:scale-90 transition-all flex items-center justify-center cursor-pointer text-red-300 hover:text-red-400"
                  >
                    <LogOut className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Viewport Content based on active Tab */}
          {activeTab === 'events' && (
            <EventsView
              events={events}
              onSelectEvent={(event) => {
                if (settings.soundEnabled) sounds.playClick();
                setSelectedEvent(event);
              }}
              bookedEventIds={bookedEventIds}
              onToggleBook={handleToggleBook}
              soundEnabled={settings.soundEnabled}
              onOpenProfile={() => setActiveTab('settings')}
              onCreateEvent={(newEvent) => {
                setEvents((prev) => [...prev, newEvent]);
              }}
              onArchiveEvent={handleArchiveEvent}
              onRestoreEvent={handleRestoreEvent}
              tabMode={tabMode}
              setTabMode={setTabMode}
              selectedEvent={selectedEvent}
              onCloseDetail={() => setSelectedEvent(null)}
            />
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="flex-1 flex flex-col overflow-y-auto pb-[calc(env(safe-area-inset-bottom,0px)+72px)] bg-[#FAF9F6]" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px + 2dvh)' }}>
              <ScheduleTab
                schedules={schedules}
                modes={modes}
                onUpdateSchedules={setSchedules}
                soundEnabled={settings.soundEnabled}
                subTab={scheduleSubTab}
              />
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="flex-1 flex flex-col overflow-y-auto pb-[calc(env(safe-area-inset-bottom,0px)+72px)] bg-[#FAF9F6]" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px + 2dvh)' }}>
              <ActivityTab
                activityData={activityData}
                onOpenDayDetails={() => {}}
                subTab={activitySubTab}
                isExpanded={isDailyExpanded}
                onToggleExpand={() => setIsDailyExpanded((prev) => !prev)}
              />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col overflow-y-auto pb-[calc(env(safe-area-inset-bottom,0px)+72px)] bg-[#FAF9F6]" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px + 2dvh)' }}>
              <SettingsTab
                settings={settings}
                onUpdateSettings={setSettings}
                onSimulatePhysicalScan={() => setIsPhysicalScanOpen(true)}
                onResetData={handleResetData}
                subTab={settingsSubTab}
                onSignOut={handleSignOut}
              />
            </div>
          )}
            </motion.div>
          )}
        </div>

        {/* Transparent Bottom Navigation Overlay */}
        {isLoggedIn && (
          <motion.div
            animate={{
              y: isFullScreen ? 100 : 0,
              opacity: isFullScreen ? 0 : 1,
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none select-none"
          >
            <BottomNav
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              onSoundTrigger={() => {
                if (settings.soundEnabled) sounds.playClick();
              }}
            />
          </motion.div>
        )}

        {/* Login Slide-Up Bottom Sheet Modal */}
        <AnimatePresence>
          {!isLoggedIn && isLoginSlideUp && (
            <>
              {/* Dimmed Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLoginSlideUp(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 pointer-events-auto"
              />
              {/* Sheet Card - Flush to the bottom edge of the app */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#FAF9F5] rounded-t-[32px] sm:rounded-t-[36px] rounded-b-none shadow-[0_-8px_30px_rgba(0,0,0,0.25)] p-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1rem))] flex flex-col items-center space-y-3 pointer-events-auto m-0"
              >
                <div className="w-10 h-1 bg-[#D8D4CA] rounded-full mb-1" />
                <h3 className="text-base font-medium text-[#1E1D1B] tracking-wide">Sign in to Brick</h3>

                {/* Email Login Button */}
                <button
                  onClick={() => {
                    if (settings.soundEnabled) sounds.playClick();
                    setIsEmailModalOpen(true);
                  }}
                  className="w-full max-w-sm py-3.5 px-5 rounded-full bg-[#386447] hover:bg-[#2C523A] active:scale-98 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-emerald-400/30 group"
                >
                  <Mail className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                  <span>Sign in with Email</span>
                </button>

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full max-w-sm py-3.5 px-5 rounded-full bg-[#1E1D1B] hover:bg-black active:scale-98 text-white font-medium text-xs sm:text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer group border border-white/20"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button
                  onClick={() => setIsLoginSlideUp(false)}
                  className="text-xs text-[#7A766D] hover:text-[#1E1D1B] font-medium transition-colors pt-1 cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modals & Overlays */}
        <PhysicalBrickOverlay
          isOpen={isPhysicalScanOpen}
          onClose={() => setIsPhysicalScanOpen(false)}
          onSuccess={() => {}}
          isCurrentlyBricked={false}
          soundEnabled={settings.soundEnabled}
        />

        {/* Profile Card Bottom Sheet */}
        <ProfileSheet
          isOpen={isProfileSheetOpen}
          onClose={() => setIsProfileSheetOpen(false)}
          soundEnabled={settings.soundEnabled}
          sounds={sounds}
          userEmail={userEmail}
          createdCount={events.filter((e) => !e.isArchived).length}
          securedCount={bookedEventIds.length}
          missedCount={events.filter((e) => e.isArchived).length}
          totalRevenue="฿148,500"
        />

        {/* Email Login Modal */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#ECE9E2] p-6 rounded-3xl shadow-2xl border border-white/40 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1E1D1B]">Sign in with Email</h3>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-xs text-[#7A766D] hover:text-[#1E1D1B] font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleEmailLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#7A766D] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-[#DDD9CE] text-[#1E1D1B] focus:outline-none focus:ring-2 focus:ring-[#386447]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-[#386447] hover:bg-[#2C523A] active:scale-98 text-white font-medium text-xs tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Mail className="w-4 h-4 text-emerald-200" />
                  <span>Continue with Email</span>
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
