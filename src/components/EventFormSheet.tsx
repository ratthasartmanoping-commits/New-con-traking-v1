import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { X, Share2, Check, Sparkles, Clock, Music, Globe, Calendar, Layers, Upload, Plus, Copy, SlidersHorizontal, MapPin } from 'lucide-react';
import { EventItem } from '../types/event';
import { sounds } from '../utils/audio';

interface EventFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  isBooked: boolean;
  onToggleBook: (eventId: string) => void;
  soundEnabled: boolean;
  onCreateEvent?: (newEvent: EventItem) => void;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  selected: boolean;
}

const initialContactsList: Contact[] = [
  { id: '1', name: 'Chris', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '2', name: 'Rhonda', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '3', name: 'David', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '4', name: 'John', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '5', name: 'James', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '6', name: 'Kathy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '7', name: 'Jerry', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '8', name: 'Patricia', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '9', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', selected: false },
  { id: '10', name: 'Judith', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80', selected: false },
];

const textVariants: Variants = {
  initial: (dir: 'left' | 'right') => ({
    x: dir === 'right' ? 32 : -32,
    opacity: 0,
    filter: 'blur(4px)',
    scale: 0.95,
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: (dir: 'left' | 'right') => ({
    x: dir === 'right' ? -32 : 32,
    opacity: 0,
    filter: 'blur(4px)',
    scale: 0.95,
  }),
};

export const EventFormSheet: React.FC<EventFormSheetProps> = ({
  isOpen,
  onClose,
  event,
  isBooked,
  onToggleBook,
  soundEnabled,
  onCreateEvent,
}) => {
  const [formMode, setFormMode] = useState<'rsvp' | 'create'>('rsvp');
  const [isShareView, setIsShareView] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(initialContactsList);
  const [copied, setCopied] = useState(false);
  const [shareSent, setShareSent] = useState(false);

  // Date & Time Picker state
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(() => Math.floor(new Date().getMinutes() / 15) * 15);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  // Animation direction for rolling digits
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Cover image upload state
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag state for horizontal dial swiping
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseX, setMouseX] = useState<number>(0);

  // Focus Event Form State (RSVP mode - ALL FIELDS START COMPLETELY EMPTY)
  const [concertName, setConcertName] = useState('');
  const [ticketWebsite, setTicketWebsite] = useState('');
  const [customWebsite, setCustomWebsite] = useState('');
  const [showDateText, setShowDateText] = useState('');
  const [zone, setZone] = useState('');
  const [venue, setVenue] = useState('');
  const [customVenue, setCustomVenue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // New Event Proposal state (Create mode - ALL FIELDS START COMPLETELY EMPTY)
  const [newTitle, setNewTitle] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newCustomWebsite, setNewCustomWebsite] = useState('');
  const [newShowDate, setNewShowDate] = useState('');
  const [newZone, setNewZone] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newCustomVenue, setNewCustomVenue] = useState('');
  const [newCoverImageUrl, setNewCoverImageUrl] = useState('');
  const [createSubmitted, setCreateSubmitted] = useState(false);

  // Ensure ALL input fields, image uploads, and contact selections are COMPLETELY EMPTY/UNSELECTED on open or reset
  useEffect(() => {
    if (isOpen) {
      setIsShareView(false);
      setFormMode('rsvp');
      setCopied(false);
      setShareSent(false);
      setContacts(initialContactsList.map(c => ({ ...c, selected: false })));

      setConcertName('');
      setTicketWebsite('');
      setCustomWebsite('');
      setShowDateText('');
      setZone('');
      setVenue('');
      setCustomVenue('');
      setCoverImageUrl('');
      
      setNewTitle('');
      setNewWebsite('');
      setNewCustomWebsite('');
      setNewShowDate('');
      setNewZone('');
      setNewVenue('');
      setNewCustomVenue('');
      setNewCoverImageUrl('');
      
      setSubmitted(false);
      setCreateSubmitted(false);
    }
  }, [isOpen]);

  const handleSwitchMode = (mode: 'rsvp' | 'create') => {
    if (soundEnabled) sounds.playClick();
    setFormMode(mode);
    setConcertName('');
    setTicketWebsite('');
    setCustomWebsite('');
    setShowDateText('');
    setZone('');
    setVenue('');
    setCustomVenue('');
    setCoverImageUrl('');

    setNewTitle('');
    setNewWebsite('');
    setNewCustomWebsite('');
    setNewShowDate('');
    setNewZone('');
    setNewVenue('');
    setNewCustomVenue('');
    setNewCoverImageUrl('');
    
    setSubmitted(false);
    setCreateSubmitted(false);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      if (formMode === 'rsvp') {
        setCoverImageUrl(newUrl);
      } else {
        setNewCoverImageUrl(newUrl);
      }
      if (soundEnabled) sounds.playZenChime();
    }
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const selected = new Date(e.target.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      
      const diffTime = selected.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      
      if (diffDays >= 0) {
        setDayOffset(diffDays);
      }
      setPickerMode('date');

      // Format date for the Target Date input field
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formatted = `${months[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`;
      if (formMode === 'rsvp') {
        setShowDateText(formatted);
      } else {
        setNewShowDate(formatted);
      }

      if (soundEnabled) sounds.playZenChime();
    }
  };

  const getFormattedDate = (offset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offset);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (offset === 0) return `Today, ${months[target.getMonth()]} ${target.getDate()}`;
    if (offset === 1) return `Tomorrow, ${months[target.getMonth()]} ${target.getDate()}`;
    return `${days[target.getDay()]}, ${months[target.getMonth()]} ${target.getDate()}`;
  };

  const formattedTimeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  
  const currentShowDate = formMode === 'rsvp'
    ? (showDateText || `${getFormattedDate(dayOffset)} · ${formattedTimeString}`)
    : (newShowDate || `${getFormattedDate(dayOffset)} · ${formattedTimeString}`);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) sounds.playZenChime();

    if (onCreateEvent) {
      const generatedId = `evt-custom-${Date.now()}`;
      const finalVenue = (venue === 'custom' ? customVenue : venue) || event.venue;
      const newEvent: EventItem = {
        id: generatedId,
        title: concertName || event.title,
        category: event.category || 'Focus Gathering',
        date: getFormattedDate(dayOffset),
        time: formattedTimeString,
        location: 'Thailand',
        venue: finalVenue,
        zone: zone || 'Zone A (Main Seating)',
        description: event.description || 'A dynamically scheduled focus and offline connection event with peers.',
        imageUrl: coverImageUrl || event.imageUrl,
        spotsLeft: 8,
        totalSpots: 12,
        price: 'Free RSVP',
        host: event.host || {
          name: 'Me',
          role: 'Event Host',
        },
      };
      onCreateEvent(newEvent);
    }

    if (!isBooked) {
      onToggleBook(event.id);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) sounds.playZenChime();

    if (onCreateEvent) {
      const generatedId = `evt-custom-${Date.now()}`;
      const newEvent: EventItem = {
        id: generatedId,
        title: newTitle || 'Custom Unplugged Event',
        category: 'Focus Gathering',
        date: newShowDate || getFormattedDate(dayOffset),
        time: formattedTimeString,
        location: 'Thailand',
        venue: (newVenue === 'custom' ? newCustomVenue : newVenue) || 'Quiet Session Room',
        zone: 'Zone A (Main Seating)',
        description: 'A dynamically scheduled focus and offline connection event with peers.',
        imageUrl: newCoverImageUrl || event.imageUrl,
        spotsLeft: 8,
        totalSpots: 12,
        price: 'Free RSVP',
        host: {
          name: 'Me',
          role: 'Event Host',
        },
      };
      onCreateEvent(newEvent);
    }

    setCreateSubmitted(true);
    setTimeout(() => {
      setCreateSubmitted(false);
      onClose();
    }, 1800);
  };

  // Toggle Share View
  const handleToggleShareView = () => {
    if (soundEnabled) sounds.playClick();
    if (!isShareView) {
      setContacts(contacts.map(c => ({ ...c, selected: false })));
    }
    setIsShareView(!isShareView);
  };

  const toggleContactSelect = (id: string) => {
    if (soundEnabled) sounds.playClick();
    setContacts(contacts.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleCopyUrl = async () => {
    if (soundEnabled) sounds.playZenChime();
    try {
      await navigator.clipboard.writeText('https://marinabudarina.design');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendShare = () => {
    if (soundEnabled) sounds.playZenChime();
    setShareSent(true);
    setTimeout(() => {
      setShareSent(false);
      onClose();
    }, 1500);
  };

  // Current active numerical step
  const activeStep = pickerMode === 'date'
    ? dayOffset
    : Math.floor((selectedHour * 60 + selectedMinute) / 15);

  const updateStep = (delta: number) => {
    const newDir = delta > 0 ? 'right' : 'left';
    setSlideDirection(newDir);
    if (soundEnabled) sounds.playClick();

    if (pickerMode === 'date') {
      setDayOffset((prev) => Math.max(0, Math.min(60, prev + delta)));
    } else {
      setSelectedMinute((prevMin) => {
        let totalMin = selectedHour * 60 + prevMin + delta * 15;
        if (totalMin < 0) totalMin = 0;
        if (totalMin > 23 * 60 + 45) totalMin = 23 * 60 + 45;
        setSelectedHour(Math.floor(totalMin / 60));
        return totalMin % 60;
      });
    }
  };

  // Gesture handlers for dragging the dial left/right
  const handleDialTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleDialTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = dragStartX - currentX;
    
    if (Math.abs(diffX) > 14) {
      const delta = diffX > 0 ? 1 : -1;
      updateStep(delta);
      setDragStartX(currentX);
    }
  };

  const handleDialTouchEnd = () => {
    setDragStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setMouseX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const diffX = mouseX - e.clientX;
    if (Math.abs(diffX) > 14) {
      const delta = diffX > 0 ? 1 : -1;
      updateStep(delta);
      setMouseX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Centered tick offsets relative to activeStep (-14 to +14)
  const visibleOffsets = [-14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const currentCover = formMode === 'rsvp' ? coverImageUrl : newCoverImageUrl;
  const currentTitleDisplay = formMode === 'rsvp' ? (concertName || 'Concert Name') : (newTitle || 'New Concert');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center select-none overflow-hidden">
          {/* Hardware-accelerated smooth backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => {
              if (soundEnabled) sounds.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/25 backdrop-blur-md transform-gpu will-change-[opacity]"
          />

          {/* Semi-Transparent Translucent White Glass Slide-Up Card */}
          <motion.div
            variants={{
              initial: { y: '100%' },
              animate: { 
                y: 0,
                transition: { type: 'spring', damping: 32, stiffness: 320 }
              },
              exit: { 
                y: '100%',
                transition: { type: 'spring', damping: 36, stiffness: 260 } 
              }
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-[76px] sm:top-[80px] -bottom-[160px] pb-[160px] w-full max-w-lg bg-white/20 sm:bg-white/25 backdrop-blur-2xl rounded-t-[38px] shadow-[0_-12px_45px_rgba(0,0,0,0.35)] flex flex-col z-10 overflow-hidden border-t border-x border-white/40 text-white transform-gpu will-change-transform"
          >
            {/* Top Grab Bar Handle */}
            <div
              onClick={() => {
                if (soundEnabled) sounds.playClick();
                onClose();
              }}
              className="pt-3 pb-1 flex justify-center cursor-pointer group active:opacity-70"
            >
              <div className="w-12 h-1 bg-white/50 group-hover:bg-white/80 rounded-full transition-colors" />
            </div>

            {/* Header Bar */}
            <div className="px-6 py-2 flex items-center justify-between">
              <button
                onClick={handleToggleShareView}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm ${
                  isShareView
                    ? 'bg-white text-[#1E1D1B] border-white shadow-md'
                    : 'bg-white/20 hover:bg-white/30 border-white/25 text-white'
                }`}
                title={isShareView ? 'Back to Event' : 'Share Event'}
              >
                <Share2 className="w-4 h-4 stroke-[1.8]" />
              </button>

              <div className="flex items-center justify-center">
                <span className="text-sm font-medium text-white tracking-wide drop-shadow-xs">
                  {isShareView 
                    ? 'Share with Friends' 
                    : (formMode === 'rsvp' ? 'Create Event' : 'Propose Event')}
                </span>
              </div>

              <button
                onClick={() => {
                  if (soundEnabled) sounds.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                <X className="w-4.5 h-4.5 stroke-[1.8]" />
              </button>
            </div>

            {/* Body Content - Toggles smoothly between Share View and Form View */}
            <AnimatePresence mode="wait">
              {isShareView ? (
                /* Share with Friends View (Matching Image 2) */
                <motion.div
                  key="shareView"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-6 py-3 space-y-5 text-white flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Heading */}
                    <div className="text-center space-y-1 pt-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Share with Friends
                      </h2>
                      <p className="text-xs text-white/80 font-light">
                        Learning is more effective when you connect with friends!
                      </p>
                    </div>

                    {/* URL Pill Box */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner gap-3">
                      <span className="text-xs text-white/95 truncate font-mono select-all flex-1">
                        https://marinabudarina.design
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUrl}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0 active:scale-95"
                        title="Copy Link"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Share to Contacts Section */}
                    <div className="space-y-3 pt-1">
                      <h3 className="text-xs font-semibold text-white tracking-wide">
                        Share to contacts
                      </h3>

                      {/* 5-Column Avatar Grid */}
                      <div className="grid grid-cols-5 gap-3.5 sm:gap-4 py-1">
                        {contacts.map((contact) => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() => toggleContactSelect(contact.id)}
                            className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                          >
                            <div className="relative">
                              <img
                                src={contact.avatar}
                                alt={contact.name}
                                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover transition-all duration-200 ${
                                  contact.selected
                                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black/20 shadow-md scale-105'
                                    : 'ring-1 ring-white/30 opacity-80 group-hover:opacity-100'
                                }`}
                              />
                              {contact.selected && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md ring-1 ring-white">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span className="text-[11px] font-light text-white truncate max-w-[56px] text-center">
                              {contact.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Standard Event Form View */
                <motion.div
                  key="formView"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto px-6 py-2 space-y-4"
                >
                  {/* Main Central Display: Date & Time Picker */}
                  <div className="flex flex-col items-center justify-center pt-1 pb-1 space-y-2.5">
                    {/* Date / Time Selector Toggle */}
                    <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (soundEnabled) sounds.playClick();
                          setPickerMode('date');
                        }}
                        className={`px-3.5 py-0.5 rounded-full text-[11px] font-light tracking-wide transition-all ${
                          pickerMode === 'date' ? 'bg-white text-[#1E1D1B] font-normal shadow-sm' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Select Date
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (soundEnabled) sounds.playClick();
                          setPickerMode('time');
                        }}
                        className={`px-3.5 py-0.5 rounded-full text-[11px] font-light tracking-wide transition-all ${
                          pickerMode === 'time' ? 'bg-white text-[#1E1D1B] font-normal shadow-sm' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Select Time
                      </button>
                    </div>

                    {/* Animated Rolling Digits / Numbers Display */}
                    <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
                      <AnimatePresence mode="popLayout" custom={slideDirection}>
                        <motion.div
                          key={`${pickerMode}-${dayOffset}-${selectedHour}-${selectedMinute}`}
                          custom={slideDirection}
                          variants={textVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                          className="text-2xl sm:text-3xl font-light tracking-tight text-white flex items-baseline justify-center gap-2 drop-shadow-md"
                        >
                          {pickerMode === 'date' ? (
                            <>
                              <span className="font-normal">{getFormattedDate(dayOffset)}</span>
                              <span className="text-base sm:text-lg font-light text-white/75">· {formattedTimeString}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-normal">{formattedTimeString}</span>
                              <span className="text-base sm:text-lg font-light text-white/75">· {getFormattedDate(dayOffset)}</span>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Physical Centered Sliding Ruler Scale Track */}
                    <div
                      onTouchStart={handleDialTouchStart}
                      onTouchMove={handleDialTouchMove}
                      onTouchEnd={handleDialTouchEnd}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="w-full h-12 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x select-none py-1"
                    >
                      {/* Center Fixed Indicator Line */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="w-[3.5px] h-8 bg-white rounded-full shadow-[0_0_14px_rgba(255,255,255,0.95)]" />
                      </div>

                      {/* Horizontal Ticks Bar centered around current active step */}
                      <div className="flex items-center justify-center gap-[16px] sm:gap-[18px] z-10">
                        {visibleOffsets.map((offset) => {
                          const isCenter = offset === 0;
                          const tickValue = activeStep + offset;
                          const isEven = Math.abs(tickValue) % 2 === 0;
                          const distance = Math.abs(offset);

                          let opacity = 0.85;
                          if (isCenter) opacity = 1;
                          else if (distance > 10) opacity = 0.25;
                          else if (distance > 6) opacity = 0.5;
                          else if (distance > 3) opacity = 0.75;

                          return (
                            <div
                              key={offset}
                              className="flex items-center justify-center shrink-0 w-[2px]"
                            >
                              <motion.div
                                animate={{
                                  height: isCenter ? 28 : isEven ? 18 : 12,
                                  opacity: opacity,
                                  scale: isCenter ? 1.15 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={`rounded-full ${
                                  isCenter
                                    ? 'w-[3.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                                    : isEven
                                    ? 'w-[2px] bg-white'
                                    : 'w-[1px] bg-white/75'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Middle Dual Segmented Summary Card */}
                  <div className="w-full p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/20 shadow-md flex items-center justify-between gap-3 relative">
                    {/* Hidden File Input for Image Upload */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />

                    {/* Left Side: Upload Event Cover Image */}
                    <div
                      onClick={() => {
                        if (soundEnabled) sounds.playClick();
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group active:opacity-80 transition-opacity"
                      title="Upload Event Cover Photo"
                    >
                      <div className="relative shrink-0">
                        {currentCover ? (
                          <img
                            src={currentCover}
                            alt="Event Cover"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/15 ring-2 ring-white/30 shadow-sm flex items-center justify-center text-white/80 group-hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5 stroke-[2]" />
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-medium text-white truncate flex items-center gap-1 group-hover:text-white/90">
                          <span>{currentTitleDisplay}</span>
                          <Upload className="w-3 h-3 text-white/70 group-hover:text-white stroke-[2]" />
                        </h4>
                        <p className="text-[11px] font-light text-white/70 truncate">
                          {currentCover ? 'Tap to change cover' : 'Tap to upload cover'}
                        </p>
                      </div>
                    </div>

                    {/* Center Divider Line */}
                    <div className="w-[1px] h-8 bg-white/25 shrink-0" />

                    {/* Right Side: Select Show Date & Time (Native mobile date picker overlay) */}
                    <div className="flex-1 min-w-0 pl-1 cursor-pointer group active:opacity-80 transition-opacity relative">
                      {/* Invisible native HTML5 date input overlaying the entire right side box for instant mobile touch trigger */}
                      <input
                        type="date"
                        onChange={handleNativeDateChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30 touch-manipulation"
                        title="Select date"
                      />
                      <div className="flex items-center gap-1 text-xs font-medium text-white truncate group-hover:text-white/90">
                        <Clock className="w-3 h-3 text-white/90 shrink-0" />
                        <span className="truncate">{formattedTimeString}</span>
                      </div>
                      <p className="text-[11px] font-light text-white/70 truncate group-hover:text-white/90 flex items-center gap-1">
                        <span className="truncate">{getFormattedDate(dayOffset)}</span>
                        <Calendar className="w-3 h-3 text-white/60 shrink-0 inline-block" />
                      </p>
                    </div>
                  </div>

                  {/* Interactive Concert Ticketing Form Fields */}
                  {formMode === 'rsvp' ? (
                    submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/30 text-center space-y-2 my-2 shadow-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-[#1E1D1B] flex items-center justify-center mx-auto shadow-lg">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h3 className="text-base font-normal text-white">Concert Details Saved</h3>
                        <p className="text-xs text-white/80 font-light">
                          {concertName || 'Concert'} · {zone || 'All Zones'} ({currentShowDate})
                        </p>
                      </motion.div>
                    ) : (
                      <form id="rsvpForm" onSubmit={handleRsvpSubmit} className="space-y-3 pt-1">
                        {/* Field 1: Concert Name */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                            <Music className="w-3 h-3 text-white" />
                            <span>Concert Name *</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={concertName}
                            onChange={(e) => setConcertName(e.target.value)}
                            placeholder="Enter concert name..."
                            className="w-full h-11 px-4 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                          />
                        </div>

                        {/* Field 2 & 2.5 Side-by-Side: Ticketing Website & Venue */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Field 2: Ticketing Website */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                              <Globe className="w-3 h-3 text-white" />
                              <span>Ticketing Website *</span>
                            </label>
                            <select
                              required
                              value={ticketWebsite}
                              onChange={(e) => {
                                setTicketWebsite(e.target.value);
                                if (soundEnabled) sounds.playClick();
                              }}
                              className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner cursor-pointer"
                            >
                              <option value="" disabled className="bg-[#2A2826] text-white/50">Select Ticketing Website...</option>
                              <option value="www.ticketmelon.com" className="bg-[#2A2826] text-white">www.ticketmelon.com</option>
                              <option value="www.thaiticketmajor.com" className="bg-[#2A2826] text-white">www.thaiticketmajor.com</option>
                              <option value="www.eventpop.me" className="bg-[#2A2826] text-white">www.eventpop.me</option>
                              <option value="www.allticket.com" className="bg-[#2A2826] text-white">www.allticket.com</option>
                              <option value="www.ticketmaster.com" className="bg-[#2A2826] text-white">www.ticketmaster.com</option>
                              <option value="custom" className="bg-[#2A2826] text-white">Other / Custom URL...</option>
                            </select>
                          </div>

                          {/* Field 2.5: Venue (สถานที่จัด) */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                              <MapPin className="w-3 h-3 text-white" />
                              <span>Venue * (สถานที่จัด)</span>
                            </label>
                            <select
                              required
                              value={venue}
                              onChange={(e) => {
                                setVenue(e.target.value);
                                if (soundEnabled) sounds.playClick();
                              }}
                              className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner cursor-pointer"
                            >
                              <option value="" disabled className="bg-[#2A2826] text-white/50">Select Venue...</option>
                              <option value="Impact Arena, Muang Thong Thani" className="bg-[#2A2826] text-white">Impact Arena (อิมแพ็ค อารีน่า)</option>
                              <option value="Thunder Dome, Muang Thong Thani" className="bg-[#2A2826] text-white">Thunder Dome (ธันเดอร์โดม)</option>
                              <option value="UOB Live, Emsphere" className="bg-[#2A2826] text-white">UOB Live, Emsphere (ยูโอบี ไลฟ์)</option>
                              <option value="Rajamangala National Stadium" className="bg-[#2A2826] text-white">Rajamangala Stadium (ราชมังคลาฯ)</option>
                              <option value="Union Hall, Union Mall" className="bg-[#2A2826] text-white">Union Hall (ยูเนี่ยน ฮอลล์)</option>
                              <option value="BITEC Bangna" className="bg-[#2A2826] text-white">BITEC Bangna (ไบเทค บางนา)</option>
                              <option value="QSNCC" className="bg-[#2A2826] text-white">QSNCC (ศูนย์ฯ สิริกิติ์)</option>
                              <option value="Lido Connect" className="bg-[#2A2826] text-white">Lido Connect (ลิโด คอนเน็คท์)</option>
                              <option value="Centerpoint Studio Lasalle" className="bg-[#2A2826] text-white">Centerpoint Studio (เซ็นเตอร์พอยท์)</option>
                              <option value="Search Studio Ramkhamhaeng" className="bg-[#2A2826] text-white">Search Studio (เสิร์ช สตูดิโอ)</option>
                              <option value="custom" className="bg-[#2A2826] text-white">Other / Specify... (สถานที่อื่น ๆ)</option>
                            </select>
                          </div>
                        </div>

                        {ticketWebsite === 'custom' && (
                          <motion.input
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            type="text"
                            required
                            value={customWebsite}
                            onChange={(e) => setCustomWebsite(e.target.value)}
                            placeholder="Enter website URL (e.g. www.example.com)..."
                            className="w-full h-10 px-4 mt-1.5 rounded-xl bg-black/35 border border-white/30 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                          />
                        )}

                        {venue === 'custom' && (
                          <motion.input
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            type="text"
                            required
                            value={customVenue}
                            onChange={(e) => setCustomVenue(e.target.value)}
                            placeholder="Enter custom venue name (ระบุสถานที่จัดเอง)..."
                            className="w-full h-10 px-4 mt-1.5 rounded-xl bg-black/35 border border-white/30 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                          />
                        )}

                        {/* Field 3 & 4 Side-by-Side in the same row: Target Date & Zone */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Field 3: Target Date with Calendar Touch Trigger */}
                          <div className="space-y-1 relative">
                            <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                              <Calendar className="w-3 h-3 text-white" />
                              <span>Target Date *</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={showDateText}
                                onChange={(e) => setShowDateText(e.target.value)}
                                placeholder="Select date..."
                                className="w-full h-11 pl-3.5 pr-8 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner truncate cursor-pointer"
                              />
                              <Calendar className="w-3.5 h-3.5 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              {/* Transparent Native Date Picker overlay for touch / tap */}
                              <input
                                type="date"
                                onChange={handleNativeDateChange}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 touch-manipulation"
                                title="Select date"
                              />
                            </div>
                          </div>

                          {/* Field 4: Zone with "All Zones" option */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                              <Layers className="w-3 h-3 text-white" />
                              <span>Zone *</span>
                            </label>
                            <select
                              required
                              value={zone}
                              onChange={(e) => {
                                setZone(e.target.value);
                                if (soundEnabled) sounds.playClick();
                              }}
                              className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner truncate cursor-pointer"
                            >
                              <option value="" disabled className="bg-[#2A2826] text-white/50">Select Zone...</option>
                              <option value="All Zones" className="bg-[#2A2826] text-white font-medium">All Zones (ทั้งหมด)</option>
                              <option value="Zone A (VIP)" className="bg-[#2A2826] text-white">Zone A (VIP)</option>
                              <option value="Zone B (Standing)" className="bg-[#2A2826] text-white">Zone B (Standing)</option>
                              <option value="Zone C (Seated)" className="bg-[#2A2826] text-white">Zone C (Seated)</option>
                              <option value="Zone D (Regular)" className="bg-[#2A2826] text-white">Zone D (Regular)</option>
                              <option value="General Admission" className="bg-[#2A2826] text-white">General Admission</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    )
                  ) : createSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/30 text-center space-y-2 my-2 shadow-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-white text-[#1E1D1B] flex items-center justify-center mx-auto shadow-lg">
                        <Sparkles className="w-5 h-5 stroke-[2]" />
                      </div>
                      <h3 className="text-base font-normal text-white">Concert Proposal Submitted</h3>
                      <p className="text-xs text-white/80 font-light">
                        Our team will review and approve your proposal.
                      </p>
                    </motion.div>
                  ) : (
                    <form id="createForm" onSubmit={handleCreateSubmit} className="space-y-3 pt-1">
                      {/* Field 1: New Concert Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                          <Music className="w-3 h-3 text-white" />
                          <span>Concert Name *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Enter new concert name..."
                          className="w-full h-11 px-4 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                        />
                      </div>

                      {/* Field 2 & 2.5 Side-by-Side: Ticketing Website & Venue */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Field 2: Ticketing Website */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                            <Globe className="w-3 h-3 text-white" />
                            <span>Ticketing Website *</span>
                          </label>
                          <select
                            required
                            value={newWebsite}
                            onChange={(e) => {
                              setNewWebsite(e.target.value);
                              if (soundEnabled) sounds.playClick();
                            }}
                            className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#2A2826] text-white/50">Select Ticketing Website...</option>
                            <option value="www.ticketmelon.com" className="bg-[#2A2826] text-white">www.ticketmelon.com</option>
                            <option value="www.thaiticketmajor.com" className="bg-[#2A2826] text-white">www.thaiticketmajor.com</option>
                            <option value="www.eventpop.me" className="bg-[#2A2826] text-white">www.eventpop.me</option>
                            <option value="www.allticket.com" className="bg-[#2A2826] text-white">www.allticket.com</option>
                            <option value="www.ticketmaster.com" className="bg-[#2A2826] text-white">www.ticketmaster.com</option>
                            <option value="custom" className="bg-[#2A2826] text-white">Other / Custom URL...</option>
                          </select>
                        </div>

                        {/* Field 2.5: Venue (สถานที่จัด) */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                            <MapPin className="w-3 h-3 text-white" />
                            <span>Venue * (สถานที่จัด)</span>
                          </label>
                          <select
                            required
                            value={newVenue}
                            onChange={(e) => {
                              setNewVenue(e.target.value);
                              if (soundEnabled) sounds.playClick();
                            }}
                            className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#2A2826] text-white/50">Select Venue...</option>
                            <option value="Impact Arena, Muang Thong Thani" className="bg-[#2A2826] text-white">Impact Arena (อิมแพ็ค อารีน่า)</option>
                            <option value="Thunder Dome, Muang Thong Thani" className="bg-[#2A2826] text-white">Thunder Dome (ธันเดอร์โดม)</option>
                            <option value="UOB Live, Emsphere" className="bg-[#2A2826] text-white">UOB Live, Emsphere (ยูโอบี ไลฟ์)</option>
                            <option value="Rajamangala National Stadium" className="bg-[#2A2826] text-white">Rajamangala Stadium (ราชมังคลาฯ)</option>
                            <option value="Union Hall, Union Mall" className="bg-[#2A2826] text-white">Union Hall (ยูเนี่ยน ฮอลล์)</option>
                            <option value="BITEC Bangna" className="bg-[#2A2826] text-white">BITEC Bangna (ไบเทค บางนา)</option>
                            <option value="QSNCC" className="bg-[#2A2826] text-white">QSNCC (ศูนย์ฯ สิริกิติ์)</option>
                            <option value="Lido Connect" className="bg-[#2A2826] text-white">Lido Connect (ลิโด คอนเน็คท์)</option>
                            <option value="Centerpoint Studio Lasalle" className="bg-[#2A2826] text-white">Centerpoint Studio (เซ็นเตอร์พอยท์)</option>
                            <option value="Search Studio Ramkhamhaeng" className="bg-[#2A2826] text-white">Search Studio (เสิร์ช สตูดิโอ)</option>
                            <option value="custom" className="bg-[#2A2826] text-white">Other / Specify... (สถานที่อื่น ๆ)</option>
                          </select>
                        </div>
                      </div>

                      {newWebsite === 'custom' && (
                        <motion.input
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          required
                          value={newCustomWebsite}
                          onChange={(e) => setNewCustomWebsite(e.target.value)}
                          placeholder="Enter website URL (e.g. www.example.com)..."
                          className="w-full h-10 px-4 mt-1.5 rounded-xl bg-black/35 border border-white/30 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                        />
                      )}

                      {newVenue === 'custom' && (
                        <motion.input
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          required
                          value={newCustomVenue}
                          onChange={(e) => setNewCustomVenue(e.target.value)}
                          placeholder="Enter custom venue name (ระบุสถานที่จัดเอง)..."
                          className="w-full h-10 px-4 mt-1.5 rounded-xl bg-black/35 border border-white/30 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner"
                        />
                      )}

                      {/* Field 3 & 4 Side-by-Side in the same row: Target Date & Zone */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Field 3: Target Date with Calendar Touch Trigger */}
                        <div className="space-y-1 relative">
                          <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                            <Calendar className="w-3 h-3 text-white" />
                            <span>Target Date *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={newShowDate}
                              onChange={(e) => setNewShowDate(e.target.value)}
                              placeholder="Select date..."
                              className="w-full h-11 pl-3.5 pr-8 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white placeholder-white/50 outline-none transition-colors shadow-inner truncate cursor-pointer"
                            />
                            <Calendar className="w-3.5 h-3.5 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {/* Transparent Native Date Picker overlay for touch / tap */}
                            <input
                              type="date"
                              onChange={handleNativeDateChange}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 touch-manipulation"
                              title="Select date"
                            />
                          </div>
                        </div>

                        {/* Field 4: Zone with "All Zones" option */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-light text-white flex items-center gap-1.5 drop-shadow-xs">
                            <Layers className="w-3 h-3 text-white" />
                            <span>Zone *</span>
                          </label>
                          <select
                            required
                            value={newZone}
                            onChange={(e) => {
                              setNewZone(e.target.value);
                              if (soundEnabled) sounds.playClick();
                            }}
                            className="w-full h-11 px-3 rounded-xl bg-black/25 border border-white/25 focus:border-white text-xs text-white outline-none transition-colors font-light shadow-inner truncate cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#2A2826] text-white/50">Select Zone...</option>
                            <option value="All Zones" className="bg-[#2A2826] text-white font-medium">All Zones (ทั้งหมด)</option>
                            <option value="Zone A (VIP)" className="bg-[#2A2826] text-white">Zone A (VIP)</option>
                            <option value="Zone B (Standing)" className="bg-[#2A2826] text-white">Zone B (Standing)</option>
                            <option value="Zone C (Seated)" className="bg-[#2A2826] text-white">Zone C (Seated)</option>
                            <option value="Zone D (Regular)" className="bg-[#2A2826] text-white">Zone D (Regular)</option>
                            <option value="General Admission" className="bg-[#2A2826] text-white">General Admission</option>
                          </select>
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Primary Action Button (Fixed position across both Share and Form views) */}
            <div className="p-6 pt-2 pb-6 bg-transparent">
              {isShareView ? (
                <button
                  type="button"
                  onClick={handleSendShare}
                  className="w-full h-14 bg-white hover:bg-white/95 active:bg-white/85 text-[#1E1D1B] rounded-full font-medium text-base shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center tracking-wide active:scale-[0.98] touch-manipulation"
                >
                  {shareSent ? 'Invited!' : 'Invite'}
                </button>
              ) : formMode === 'rsvp' ? (
                <button
                  type="submit"
                  form="rsvpForm"
                  onClick={(e) => {
                    if (submitted) {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                  className="w-full h-14 bg-white hover:bg-white/95 active:bg-white/85 text-[#1E1D1B] rounded-full font-medium text-base shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center tracking-wide active:scale-[0.98] touch-manipulation"
                >
                  {submitted ? 'Done' : 'Save'}
                </button>
              ) : (
                <button
                  type="submit"
                  form="createForm"
                  onClick={(e) => {
                    if (createSubmitted) {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                  className="w-full h-14 bg-white hover:bg-white/95 active:bg-white/85 text-[#1E1D1B] rounded-full font-medium text-base shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center tracking-wide active:scale-[0.98] touch-manipulation"
                >
                  {createSubmitted ? 'Done' : 'Save'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
