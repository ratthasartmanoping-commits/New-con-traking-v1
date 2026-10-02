import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Check, X, UserPlus, Upload, Receipt, FileCheck, Trash2, Ticket } from 'lucide-react';
import { EventItem, EVENTS_DATA, ARCHIVE_EVENTS_DATA } from '../types/event';
import { EventFormSheet } from './EventFormSheet';
import { sounds } from '../utils/audio';
import { AutoMarqueeText } from './AutoMarqueeText';

interface EventsViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  bookedEventIds: string[];
  onToggleBook: (eventId: string) => void;
  soundEnabled: boolean;
  onOpenProfile?: () => void;
  onCreateEvent?: (newEvent: EventItem) => void;
  onArchiveEvent: (eventId: string) => void;
  onRestoreEvent: (eventId: string) => void;
  tabMode: 'events' | 'archive';
  setTabMode: (mode: 'events' | 'archive') => void;
  selectedEvent?: EventItem | null;
  onCloseDetail?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onSelectEvent,
  bookedEventIds,
  onToggleBook,
  soundEnabled,
  onOpenProfile,
  onCreateEvent,
  onArchiveEvent,
  onRestoreEvent,
  tabMode,
  setTabMode,
  selectedEvent = null,
  onCloseDetail,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFormSheetOpen, setIsFormSheetOpen] = useState<boolean>(false);
  const [isInviteExpanded, setIsInviteExpanded] = useState<boolean>(false);
  const [isInviteCopied, setIsInviteCopied] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Uploaded documents state (slip and confirmation document per event)
  const [uploadedDocs, setUploadedDocs] = useState<
    Record<string, { slipUrl?: string; slipName?: string; confirmUrl?: string; confirmName?: string }>
  >({});
  const slipInputRef = useRef<HTMLInputElement>(null);
  const confirmInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsInviteExpanded(false);
    setIsInviteCopied(false);
  }, [selectedEvent?.id]);

  const [initialCount] = useState(events.length);
  const [isPressing, setIsPressing] = useState(false);
  const longPressTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = React.useRef<boolean>(false);

  // Auto-focus on the newly created event when length increases!
  useEffect(() => {
    if (tabMode === 'events' && events.length > initialCount) {
      setCurrentIndex(events.length - 1);
    }
  }, [events.length, initialCount]);

  const activeDataSet = tabMode === 'events' ? events.filter(e => !e.isArchived) : events.filter(e => e.isArchived);
  const activeIdx = activeDataSet.length > 0 ? ((currentIndex % activeDataSet.length) + activeDataSet.length) % activeDataSet.length : 0;
  const [lastIdx, setLastIdx] = useState(activeIdx);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  useEffect(() => {
    if (activeIdx !== lastIdx) {
      setSlideDirection(activeIdx >= lastIdx ? 'right' : 'left');
      setLastIdx(activeIdx);
    }
  }, [activeIdx, lastIdx]);

  const activeEvent = activeDataSet[activeIdx] || activeDataSet[0] || null;
  const isDetailMode = Boolean(selectedEvent);
  const currentDisplayEvent = selectedEvent || activeEvent;
  const isCurrentBooked = currentDisplayEvent ? bookedEventIds.includes(currentDisplayEvent.id) : false;
  const isPendingConfirmation = tabMode === 'events' && isCurrentBooked;

  const getEventStatus = (event: EventItem) => {
    const isBooked = bookedEventIds.includes(event.id);
    if (tabMode === 'archive' || event.isArchived) {
      return {
        label: 'Missed',
        color: 'bg-red-950/70 text-red-300 border-red-500/40',
        textColor: 'text-red-400',
        dotColor: 'bg-red-400',
      };
    }
    if (isBooked) {
      return {
        label: 'Pending Confirmation',
        color: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
        textColor: 'text-amber-300',
        dotColor: 'bg-amber-300',
      };
    }
    return {
      label: 'Upcoming',
      color: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
      textColor: 'text-sky-300',
      dotColor: 'bg-sky-300',
    };
  };

  const handleNext = () => {
    if (activeDataSet.length === 0 || isDetailMode) return;
    if (soundEnabled) sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % activeDataSet.length);
  };

  const handlePrev = () => {
    if (activeDataSet.length === 0 || isDetailMode) return;
    if (soundEnabled) sounds.playClick();
    setCurrentIndex((prev) => (prev - 1 + activeDataSet.length) % activeDataSet.length);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFormSheetOpen) return;
      if (e.key === 'Escape' && isDetailMode && onCloseDetail) {
        onCloseDetail();
      } else if (!isDetailMode) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          handleNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          handlePrev();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDataSet.length, isFormSheetOpen, isDetailMode, onCloseDetail]);

  const handlePressStart = (e: React.PointerEvent) => {
    if (!activeEvent || tabMode === 'archive' || isDetailMode) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isLongPressTriggeredRef.current = false;
    setIsPressing(true);

    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      setIsPressing(false);
      
      // Perform Archive / Missed Action!
      if (soundEnabled) sounds.playZenChime();
      onArchiveEvent(activeEvent.id);
      
      setCurrentIndex(0);
    }, 800); // 800ms threshold
  };

  const handlePressEnd = (e: React.PointerEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    const wasPressing = isPressing;
    setIsPressing(false);

    if (wasPressing && !isLongPressTriggeredRef.current && activeEvent) {
      if (soundEnabled) sounds.playClick();
      onToggleBook(activeEvent.id);
    }
  };

  const handleRestorePressStart = (e: React.PointerEvent) => {
    if (!activeEvent || tabMode !== 'archive' || isDetailMode) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isLongPressTriggeredRef.current = false;
    setIsPressing(true);

    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      setIsPressing(false);
      
      // Perform Restore / Redo Action!
      if (soundEnabled) sounds.playZenChime();
      onRestoreEvent(activeEvent.id);
      setCurrentIndex(0);
    }, 800);
  };

  const handleRestorePressEnd = (e: React.PointerEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    const wasPressing = isPressing;
    setIsPressing(false);

    if (wasPressing && !isLongPressTriggeredRef.current && activeEvent) {
      if (soundEnabled) sounds.playClick();
      onSelectEvent(activeEvent);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'slip' | 'confirm') => {
    const file = e.target.files?.[0];
    if (!file || !currentDisplayEvent) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedDocs((prev) => ({
        ...prev,
        [currentDisplayEvent.id]: {
          ...prev[currentDisplayEvent.id],
          [type === 'slip' ? 'slipUrl' : 'confirmUrl']: reader.result as string,
          [type === 'slip' ? 'slipName' : 'confirmName']: file.name,
        },
      }));
      if (soundEnabled) sounds.playZenChime();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveDoc = (e: React.MouseEvent, type: 'slip' | 'confirm') => {
    e.stopPropagation();
    if (!currentDisplayEvent) return;
    if (soundEnabled) sounds.playClick();
    setUploadedDocs((prev) => ({
      ...prev,
      [currentDisplayEvent.id]: {
        ...prev[currentDisplayEvent.id],
        [type === 'slip' ? 'slipUrl' : 'confirmUrl']: undefined,
        [type === 'slip' ? 'slipName' : 'confirmName']: undefined,
      },
    }));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isFormSheetOpen || isDetailMode) return; // Prevent gesture triggers while sheet/detail is open
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isFormSheetOpen || isDetailMode) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    // Detect Vertical Swipe Up (diffY > 40 & vertical delta > horizontal delta)
    if (diffY > 40 && Math.abs(diffY) > Math.abs(diffX)) {
      if (soundEnabled) sounds.playClick();
      setIsFormSheetOpen(true);
    } else if (diffX > 45) {
      handleNext();
    } else if (diffX < -45) {
      handlePrev();
    } else if (Math.hypot(diffX, diffY) < 12) {
      // Tap on image or non-button surface
      const target = e.target as HTMLElement;
      if (!target.closest('button') && activeEvent) {
        if (soundEnabled) sounds.playClick();
        onSelectEvent(activeEvent);
      }
    }
    setTouchStart(null);
  };

  const cancelLongPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setIsPressing(false);
  };

  return (
    <div
      className="relative w-full h-full flex-1 flex flex-col justify-between select-none overflow-hidden group touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 100% Full-Bleed Image spanning background */}
      <div className="absolute inset-0 w-full h-full bg-[#1A1918]">
        {currentDisplayEvent ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tabMode}-${currentDisplayEvent.id}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: isDetailMode ? 1.04 : 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => {
                if (!isFormSheetOpen && !isDetailMode) onSelectEvent(currentDisplayEvent);
              }}
              className={`absolute inset-0 w-full h-full ${!isDetailMode ? 'cursor-pointer' : ''}`}
            >
              {/* Full frame photo */}
              <img
                src={currentDisplayEvent.imageUrl}
                alt={currentDisplayEvent.title}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                  tabMode === 'archive' ? 'grayscale-[20%] brightness-90' : ''
                }`}
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic Gradient overlays that deepen smoothly when expanding */}
              <motion.div
                animate={{
                  backgroundColor: isDetailMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0)',
                }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#1C1B1A] flex flex-col items-center justify-center p-8">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        )}
      </div>

      {/* Conditionally Render: Normal Carousel Bottom Bar vs Expanded Detail View inside the photo */}
      <AnimatePresence mode="wait">
        {!isDetailMode ? (
          <motion.div
            key="carousel-controls"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full h-full flex flex-col justify-between"
          >
            {/* Clickable Image Viewport Area: Tap anywhere on photo to open details */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!isFormSheetOpen && !isDetailMode && activeEvent) {
                  if (soundEnabled) sounds.playClick();
                  onSelectEvent(activeEvent);
                }
              }}
              title="Tap to view event details"
              className="flex-1 w-full cursor-pointer"
            />

            {/* Bottom Content Area Floating Directly Over Image */}
            <div className="relative z-10 px-6 sm:px-7 pb-[max(5.75rem,calc(env(safe-area-inset-bottom,0px)+4.75rem))] pt-2 flex flex-col items-center space-y-3.5">
              {activeEvent ? (
                <>
                  {/* Status Pill Badge */}
                  <div className="w-full flex justify-start">
                    {(() => {
                      const status = getEventStatus(activeEvent);
                      return (
                        <span className={`px-3.5 py-1 rounded-full backdrop-blur-md text-[11px] font-light tracking-widest uppercase border shadow-sm flex items-center gap-1.5 ${status.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          <span>{status.label}</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* Event Info Details */}
                  <div
                    onClick={() => {
                      if (!isFormSheetOpen) onSelectEvent(activeEvent);
                    }}
                    className="w-full text-white space-y-1.5 cursor-pointer text-left active:opacity-90"
                  >
                    <div className="flex items-center flex-wrap gap-2.5 text-xs font-light text-white/90 tracking-wide">
                      {/* Overlapping circular avatars stack matching the user design exactly */}
                      <div className="flex items-center -space-x-2 shrink-0 mr-1.5">
                        {/* Avatar 1: Host/Creator 'N' */}
                        <div className="w-6.5 h-6.5 rounded-full bg-[#FAF8F5] border-2 border-black/70 text-[#1E1D1B] text-[10px] flex items-center justify-center font-bold relative z-30 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                          {activeEvent.host.name[0]}
                        </div>

                        {/* Avatar 2: 'Yo' (You) */}
                        <div className="w-6.5 h-6.5 rounded-full bg-[#2E543A] border-2 border-black/70 text-white text-[9px] flex items-center justify-center font-bold relative z-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                          Yo
                        </div>

                        {/* Avatar 3: 'SK' */}
                        <div className="w-6.5 h-6.5 rounded-full bg-[#1D3241] border-2 border-black/70 text-white text-[9px] flex items-center justify-center font-bold relative z-10 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                          SK
                        </div>

                        {/* Avatar 4: '+X' */}
                        <div className="w-6.5 h-6.5 rounded-full bg-[#131211] border-2 border-black/70 text-white text-[9px] flex items-center justify-center font-bold relative z-0 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                          +{Math.max(1, (activeEvent.totalSpots - activeEvent.spotsLeft) - 2)}
                        </div>
                      </div>

                      {/* Transparent plain text with date information */}
                      <div className="flex items-center gap-1.5 text-white/95 font-light drop-shadow-md">
                        <Calendar className="w-3.5 h-3.5 opacity-90 stroke-[1.5] shrink-0 text-white" />
                        <span>{activeEvent.date}</span>
                        <span className="opacity-50">·</span>
                        <span>{activeEvent.time}</span>
                      </div>
                    </div>

                    <div className="w-full py-0.5">
                      <AutoMarqueeText
                        text={activeEvent.title}
                        className="text-2xl sm:text-[26px] font-light tracking-wide leading-snug drop-shadow-md text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5 text-white/75 font-light">
                      <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                        <MapPin className="w-3.5 h-3.5 text-white/90 shrink-0 stroke-[1.5]" />
                        <span className="truncate tracking-wide">{activeEvent.venue}</span>
                      </div>

                      <span className="text-[11px] font-light tracking-wider bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white/90">
                        {activeEvent.zone || activeEvent.venue}
                      </span>
                    </div>
                  </div>

                  {/* Minimalist Carousel Dots Indicator */}
                  <div className="flex items-center gap-1.5 pt-0.5 relative">
                    {activeDataSet.map((_, idx) => {
                      const isActive = activeIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (soundEnabled) sounds.playClick();
                            setCurrentIndex(idx);
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                          className="relative py-1 px-0.5 cursor-pointer flex items-center justify-center touch-manipulation focus:outline-none"
                        >
                          {isActive ? (
                            <motion.div
                              layoutId="activeSlidePillDot"
                              className="h-1.5 w-5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                              style={{
                                transformOrigin: 'center center',
                              }}
                              animate={{
                                scaleX: [1, 0.3, 0.3, 1.15, 0.95, 1],
                                scaleY: [1, 1, 1, 0.92, 1.04, 1],
                              }}
                              transition={{
                                layout: { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 },
                                scaleX: { duration: 0.46, times: [0, 0.2, 0.5, 0.8, 0.92, 1], ease: 'easeInOut' },
                                scaleY: { duration: 0.46, times: [0, 0.2, 0.5, 0.8, 0.92, 1], ease: 'easeInOut' },
                              }}
                            />
                          ) : (
                            <span className="block w-1.5 h-1.5 rounded-full bg-white/35 hover:bg-white/60 transition-colors" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="w-full text-center space-y-3 py-10 text-white">
                  <h3 className="text-xl font-light tracking-wide text-white/95">All Quiet & Silent</h3>
                  <p className="text-xs font-light text-white/70 max-w-xs mx-auto leading-relaxed">
                    {tabMode === 'events' 
                      ? 'All events are scheduled or archived. Enjoy your phone-free moments!' 
                      : 'No archived events yet.'}
                  </p>
                </div>
              )}

              {/* Primary Action Button */}
              {activeEvent ? (
                tabMode === 'events' ? (
                  <button
                    onPointerDown={handlePressStart}
                    onPointerUp={handlePressEnd}
                    onPointerCancel={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    className={`w-full h-[54px] sm:h-[58px] rounded-full flex items-center justify-center font-normal tracking-wide text-[15px] sm:text-[16px] cursor-pointer shadow-lg active:scale-[0.98] touch-manipulation select-none transition-all ${
                      isPressing
                        ? 'bg-red-950/90 text-white border border-red-500 scale-[0.98] duration-[800ms]'
                        : isCurrentBooked
                        ? 'bg-[#3A6447] text-white border border-[#4C7D5B]/80 duration-200'
                        : 'bg-[#FAF9F5]/95 text-[#1E1D1B] border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.15)] duration-200'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isPressing ? (
                        <motion.span
                          key="pressing"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2 font-normal animate-pulse"
                        >
                          <span>Keep holding to mark as Missed...</span>
                        </motion.span>
                      ) : isCurrentBooked ? (
                        <motion.span
                          key="booked"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2 font-normal tracking-wide"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Tickets Secured (Tap to undo)</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="font-light tracking-wide"
                        >
                          Tap if Got Tickets (Hold if Missed)
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                ) : (
                  <button
                    onPointerDown={handleRestorePressStart}
                    onPointerUp={handleRestorePressEnd}
                    onPointerCancel={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    className={`w-full h-[54px] sm:h-[58px] rounded-full flex items-center justify-center font-normal tracking-wide text-[15px] sm:text-[16px] cursor-pointer shadow-lg active:scale-[0.98] touch-manipulation select-none transition-all ${
                      isPressing
                        ? 'bg-emerald-950/90 text-white border border-emerald-500 scale-[0.98] duration-[800ms]'
                        : 'bg-white/25 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 duration-200'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isPressing ? (
                        <motion.span
                          key="restoring"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2 font-normal animate-pulse text-emerald-300"
                        >
                          <span>Restoring to Events...</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="font-light tracking-wide"
                        >
                          Hold to Restore (Tap for Details)
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )
              ) : null}
            </div>
          </motion.div>
        ) : (
          /* Expanded Detail View: Displayed directly inside the expanded event photo! */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-20 w-full h-full flex flex-col justify-between overflow-y-auto px-5 sm:px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            {/* Top Bar: Category Tag or Creator & Attendee Stack in single row, Grab Handle, and Close (X) Button */}
            <div className="relative flex items-center justify-between pt-1 pb-3 shrink-0 min-h-[48px]">
              {/* Top-Left: Creator Profile Icon + Attendee Stack in the SAME single row for all events & statuses */}
              <div className="z-10 flex items-center">
                <motion.div
                  key={`detail-host-pill-${currentDisplayEvent.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) sounds.playClick();
                    setIsInviteExpanded((prev) => !prev);
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center bg-[#201D1A]/85 backdrop-blur-md pl-1 pr-1.5 py-1 rounded-full border border-white/20 shadow-md cursor-pointer select-none active:scale-[0.98] transition-colors hover:bg-[#201D1A]/95 overflow-hidden origin-left"
                  title={isInviteExpanded ? 'Tap to collapse' : 'Tap to invite friends'}
                >
                  {/* Event Creator Profile Avatar (No crown - Anchored on the left) */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FAF8F5] via-[#E8E2D6] to-[#D5CEC0] border border-white/90 shadow-sm flex items-center justify-center text-[#2A2723] font-semibold text-xs shrink-0 relative z-20"
                    title={`Host: ${currentDisplayEvent.host.name}`}
                  >
                    {currentDisplayEvent.host.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </motion.div>

                  {/* Expandable Attendee Section: Unfurls and expands frame out to the right without reflow or stutter */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    transition={{
                      width: { duration: 0.32, ease: [0.33, 1, 0.68, 1] },
                      opacity: { duration: 0.22, ease: 'easeOut' },
                    }}
                    className="flex items-center overflow-hidden shrink-0"
                  >
                    <div className="flex items-center min-w-max flex-nowrap pr-0.5">
                      {/* Subtle vertical separator */}
                      <span className="w-px h-3.5 bg-white/20 shrink-0 mx-1 relative z-20" />

                      {/* Attendee Profiles Stacked in the SAME row */}
                      <div className="flex items-center -space-x-1.5 shrink-0 relative z-20">
                        {/* You (Joined / Reserved) */}
                        <div
                          className="w-5.5 h-5.5 rounded-full bg-[#355B41] border-[1.5px] border-white text-white flex items-center justify-center text-[8px] font-medium shadow-sm relative z-30"
                          title="You (Reserved)"
                        >
                          You
                        </div>

                        {/* Attendee 1 */}
                        <div
                          className="w-5.5 h-5.5 rounded-full bg-[#E2DDD3] border-[1.5px] border-white text-[#2C2A26] flex items-center justify-center text-[8px] font-medium shadow-sm relative z-20"
                          title="Sarah K."
                        >
                          SK
                        </div>

                        {/* Attendee 2 */}
                        <div
                          className="w-5.5 h-5.5 rounded-full bg-[#C8C1B4] border-[1.5px] border-white text-[#24221D] flex items-center justify-center text-[8px] font-medium shadow-sm relative z-10"
                          title="Kenji T."
                        >
                          KT
                        </div>

                        {/* Extra Attendees Count */}
                        <div
                          className="w-5.5 h-5.5 rounded-full bg-black/85 backdrop-blur-md border-[1.5px] border-white text-white/90 flex items-center justify-center text-[7.5px] font-medium shadow-sm relative z-0"
                          title="More Attendees Joined"
                        >
                          +{Math.max(1, (currentDisplayEvent.totalSpots - currentDisplayEvent.spotsLeft) - 2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sliding Invite Badge: Hidden under avatars, slides out to the right when tapped */}
                  <AnimatePresence>
                    {isInviteExpanded && (
                      <motion.div
                        key="invite-slide-tag"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{
                          width: { duration: 0.28, ease: [0.33, 1, 0.68, 1] },
                          opacity: { duration: 0.18, ease: 'easeOut' },
                        }}
                        className="overflow-hidden flex items-center shrink-0"
                      >
                        <div className="min-w-max flex-nowrap ml-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (soundEnabled) sounds.playClick();
                              setIsInviteCopied(true);
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(window.location.href);
                              }
                              setTimeout(() => setIsInviteCopied(false), 2000);
                            }}
                            className="flex items-center gap-1.5 pl-2 pr-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <UserPlus className="w-3 h-3 text-emerald-400 stroke-[2]" />
                            <span className="text-[11px] font-medium tracking-wide text-white">
                              {isInviteCopied ? 'Link Copied!' : 'Invite'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Close (X) Button */}
              <div className="z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) sounds.playClick();
                    if (onCloseDetail) onCloseDetail();
                  }}
                  aria-label="Close details"
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#262420] backdrop-blur-md flex items-center justify-center shadow-sm cursor-pointer transition-all active:scale-90"
                >
                  <X className="w-4 h-4 stroke-[1.8]" />
                </button>
              </div>
            </div>

            {/* Middle Section: Slid UP Title & Meta, followed by details matching the picture */}
            <div className="space-y-4 pt-1 pb-6 flex-1">
              {/* Event Status (Frameless / No Border) */}
              <div className="space-y-1">
                {(() => {
                  const status = getEventStatus(currentDisplayEvent);
                  return (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest drop-shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                      <span className={status.textColor}>{status.label}</span>
                    </div>
                  );
                })()}

                {/* Event Title - Single line AutoMarqueeText scrolling to show full text and bouncing back */}
                <div className="w-full py-0.5">
                  <AutoMarqueeText
                    text={currentDisplayEvent.title}
                    className="text-2xl sm:text-[28px] font-normal text-white tracking-tight leading-snug drop-shadow-md"
                  />
                </div>
              </div>

              {/* Logistics Info Cards (Date & Time, Location) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Date & Time */}
                <div className="p-4 rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A756C] font-light">
                    <Calendar className="w-4 h-4 text-[#5E5A52] stroke-[1.6]" />
                    <span>Date & Time</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1E1D1B]">
                    {currentDisplayEvent.date}
                  </div>
                  <div className="text-[11px] text-[#7A756C] font-light">
                    {currentDisplayEvent.time}
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A756C] font-light">
                    <MapPin className="w-4 h-4 text-[#5E5A52] stroke-[1.6]" />
                    <span>Location</span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1E1D1B] truncate">
                    {currentDisplayEvent.venue}
                  </div>
                  <div className="text-[11px] text-[#7A756C] font-light truncate">
                    {currentDisplayEvent.location}
                  </div>
                </div>
              </div>

              {/* If status is "Pending Confirmation" or "Confirmed": show 2 horizontal cards (Slip on top, Confirmation below) */}
              {isPendingConfirmation || isCurrentBooked ? (
                <div className="flex flex-col gap-2.5">
                  {/* Hidden file inputs */}
                  <input
                    type="file"
                    ref={slipInputRef}
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'slip')}
                  />
                  <input
                    type="file"
                    ref={confirmInputRef}
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'confirm')}
                  />

                  {/* Top Horizontal Card: Payment Slip */}
                  <div
                    onClick={() => slipInputRef.current?.click()}
                    className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:bg-white active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4 text-[#2C2A26] stroke-[1.8]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="uppercase tracking-wider text-[11px] font-semibold text-[#1E1D1B]">
                            Payment Slip
                          </span>
                          {uploadedDocs[currentDisplayEvent.id]?.slipUrl && (
                            <span className="text-[10px] text-[#2C2A26] font-medium flex items-center gap-0.5">
                              <Check className="w-3 h-3 text-[#2C2A26]" /> Attached
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A756C] font-light truncate">
                          {uploadedDocs[currentDisplayEvent.id]?.slipUrl
                            ? uploadedDocs[currentDisplayEvent.id]?.slipName || 'payment_slip.jpg'
                            : 'Attach transfer proof'}
                        </div>
                      </div>
                    </div>

                    {/* Right Action: Button with text on left and icon on right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {uploadedDocs[currentDisplayEvent.id]?.slipUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              slipInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 text-[11px] text-[#1E1D1B] font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <span>Replace</span>
                            <Upload className="w-3.5 h-3.5 text-[#2C2A26] stroke-[1.8]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveDoc(e, 'slip')}
                            className="p-1.5 text-[#7A756C] hover:text-red-600 transition-colors"
                            title="Remove Slip"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#2C2A26]" />
                          </button>
                        </div>
                      ) : (
                        <div className="px-3.5 py-1.5 rounded-full border border-dashed border-black/25 bg-black/[0.03] group-hover:border-black/50 group-hover:bg-black/5 text-[11px] text-[#1E1D1B] font-medium flex items-center gap-1.5 transition-colors">
                          <span>Upload Slip</span>
                          <Upload className="w-3.5 h-3.5 text-[#2C2A26] stroke-[1.8]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Horizontal Card: Confirmation Doc */}
                  <div
                    onClick={() => confirmInputRef.current?.click()}
                    className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:bg-white active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4 text-[#2C2A26] stroke-[1.8]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="uppercase tracking-wider text-[11px] font-semibold text-[#1E1D1B]">
                            Confirmation Doc
                          </span>
                          {uploadedDocs[currentDisplayEvent.id]?.confirmUrl && (
                            <span className="text-[10px] text-[#2C2A26] font-medium flex items-center gap-0.5">
                              <Check className="w-3 h-3 text-[#2C2A26]" /> Attached
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A756C] font-light truncate">
                          {uploadedDocs[currentDisplayEvent.id]?.confirmUrl
                            ? uploadedDocs[currentDisplayEvent.id]?.confirmName || 'confirmation_doc.pdf'
                            : 'Attach confirmation pass'}
                        </div>
                      </div>
                    </div>

                    {/* Right Action: Button with text on left and icon on right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {uploadedDocs[currentDisplayEvent.id]?.confirmUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 text-[11px] text-[#1E1D1B] font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <span>Replace</span>
                            <Upload className="w-3.5 h-3.5 text-[#2C2A26] stroke-[1.8]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveDoc(e, 'confirm')}
                            className="p-1.5 text-[#7A756C] hover:text-red-600 transition-colors"
                            title="Remove Doc"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#2C2A26]" />
                          </button>
                        </div>
                      ) : (
                        <div className="px-3.5 py-1.5 rounded-full border border-dashed border-black/25 bg-black/[0.03] group-hover:border-black/50 group-hover:bg-black/5 text-[11px] text-[#1E1D1B] font-medium flex items-center gap-1.5 transition-colors">
                          <span>Upload Pass</span>
                          <Upload className="w-3.5 h-3.5 text-[#2C2A26] stroke-[1.8]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* About this Experience Card for other statuses */
                <div className="p-5 rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-lg space-y-2.5">
                  <h2 className="text-xs font-semibold text-[#1E1D1B] uppercase tracking-wider">
                    About this Experience
                  </h2>
                  <p className="text-xs text-[#524E47] font-light leading-relaxed">
                    {currentDisplayEvent.description}
                  </p>
                </div>
              )}

              {/* Ticket Details Card */}
              {(() => {
                const isConfirmedDocUploaded = Boolean(uploadedDocs[currentDisplayEvent.id]?.confirmUrl);
                return (
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-white/60 shadow-lg space-y-3.5">
                    <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center">
                          <Ticket className="w-3.5 h-3.5 text-[#2C2A26] stroke-[1.8]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-[#1E1D1B] uppercase tracking-wider">
                            Ticket Details
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-black/5 text-[9.5px] font-mono text-[#5E5A52] tracking-wider uppercase">
                        {isConfirmedDocUploaded ? currentDisplayEvent.id.toUpperCase() : 'PENDING PASS'}
                      </span>
                    </div>

                    {/* Ticket Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Order No.
                        </div>
                        <div className="font-mono font-medium text-[#1E1D1B] text-[11px] mt-0.5">
                          {isConfirmedDocUploaded
                            ? `#ORD-${currentDisplayEvent.id.replace('evt-', '').toUpperCase()}-8492`
                            : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Ticket Ref.
                        </div>
                        <div className="font-mono font-medium text-[#1E1D1B] text-[11px] mt-0.5">
                          {isConfirmedDocUploaded
                            ? `TKT-2026-${currentDisplayEvent.id.replace('evt-', '').toUpperCase()}`
                            : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Price
                        </div>
                        <div className="font-semibold text-[#1E1D1B] text-[11px] mt-0.5">
                          {isConfirmedDocUploaded ? (currentDisplayEvent.price || 'Free RSVP') : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Zone
                        </div>
                        <div
                          className="font-medium text-[#1E1D1B] text-[11px] truncate mt-0.5"
                          title={isConfirmedDocUploaded ? (currentDisplayEvent.zone || 'Main Zone A') : '-'}
                        >
                          {isConfirmedDocUploaded ? (currentDisplayEvent.zone || 'Main Zone A') : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Row / Seat
                        </div>
                        <div className="font-medium text-[#1E1D1B] text-[11px] mt-0.5">
                          {isConfirmedDocUploaded ? 'Row 02 · Seat 08' : '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-wider">
                          Show Date
                        </div>
                        <div
                          className="font-medium text-[#1E1D1B] text-[11px] truncate mt-0.5"
                          title={isConfirmedDocUploaded ? `${currentDisplayEvent.date}, ${currentDisplayEvent.time}` : '-'}
                        >
                          {isConfirmedDocUploaded ? currentDisplayEvent.date : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Sticky Bottom Action CTA Button */}
            <div className="pt-2 sticky bottom-0 z-30 pb-1 shrink-0">
              <button
                onClick={() => {
                  if (soundEnabled) sounds.playClick();
                  onToggleBook(currentDisplayEvent.id);
                }}
                className={`w-full py-4 rounded-[24px] text-sm font-normal tracking-wide transition-all cursor-pointer shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isCurrentBooked
                    ? 'bg-[#355B41] text-white hover:bg-[#2C4D36]'
                    : 'bg-[#1E1D1B] text-white hover:bg-[#2C2A26]'
                }`}
              >
                {isCurrentBooked ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2]" />
                    <span>Reserved · Tap to Cancel</span>
                  </>
                ) : (
                  <span>Reserve Spot ({currentDisplayEvent.price || 'Free RSVP'})</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Up Event Form Sheet */}
      {activeEvent && (
        <EventFormSheet
          isOpen={isFormSheetOpen}
          onClose={() => setIsFormSheetOpen(false)}
          event={activeEvent}
          isBooked={isCurrentBooked}
          onToggleBook={onToggleBook}
          soundEnabled={soundEnabled}
          onCreateEvent={onCreateEvent}
        />
      )}
    </div>
  );
};
