import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Check } from 'lucide-react';
import { EventItem } from '../types/event';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  isBooked: boolean;
  onToggleBook: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  isBooked,
  onToggleBook,
}) => {
  return (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div
          initial={{ y: '100%', opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 400) {
              onClose();
            }
          }}
          className="absolute inset-0 z-50 bg-[#FAF8F5] flex flex-col justify-between overflow-hidden shadow-2xl select-none"
        >
          {/* Top Grab Handle Area */}
          <div className="pt-[max(1rem,env(safe-area-inset-top))] pb-1 flex justify-center cursor-grab active:cursor-grabbing shrink-0">
            <div className="w-12 h-1.5 bg-[#D2CDC3] rounded-full" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 pt-1 pb-4 space-y-4">
            {/* Upper Event Image Card */}
            <div className="relative w-full aspect-[4/3] max-h-[300px] rounded-[28px] overflow-hidden shadow-sm bg-[#EBE7DE] border border-[#E7E2D7]">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Tag on Top-Left of Image */}
              <div className="absolute top-3.5 left-3.5 bg-[#201D1A]/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] font-light tracking-widest uppercase shadow-sm">
                {event.category || 'MINDFULNESS'}
              </div>

              {/* Close Button on Top-Right of Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close details"
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#262420] backdrop-blur-md flex items-center justify-center shadow-sm cursor-pointer transition-all active:scale-90"
              >
                <X className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            {/* Subtitle / Venue & Price Meta */}
            <div className="space-y-1 pt-0.5">
              <div className="text-[11px] font-normal text-[#8A857C] uppercase tracking-widest">
                {event.price || 'FREE RSVP'} · {event.zone || event.venue}
              </div>

              {/* Event Title */}
              <h1 className="text-2xl sm:text-[28px] font-normal text-[#1E1D1B] tracking-tight leading-snug">
                {event.title}
              </h1>
            </div>

            {/* Logistics Info Cards (Date & Time, Location) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Date & Time */}
              <div className="p-4 rounded-3xl bg-[#F4F1EA] border border-[#E7E2D7] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#7A756C] font-light">
                  <Calendar className="w-4 h-4 text-[#5E5A52] stroke-[1.6]" />
                  <span>Date & Time</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1E1D1B]">
                  {event.date}
                </div>
                <div className="text-[11px] text-[#7A756C] font-light">
                  {event.time}
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-3xl bg-[#F4F1EA] border border-[#E7E2D7] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-[#7A756C] font-light">
                  <MapPin className="w-4 h-4 text-[#5E5A52] stroke-[1.6]" />
                  <span>Location</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1E1D1B] truncate">
                  {event.venue}
                </div>
                <div className="text-[11px] text-[#7A756C] font-light truncate">
                  {event.location}
                </div>
              </div>
            </div>

            {/* About this Experience Card */}
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E7E2D7] space-y-2.5">
              <h2 className="text-xs font-semibold text-[#1E1D1B] uppercase tracking-wider">
                About this Experience
              </h2>
              <p className="text-xs text-[#6A665E] font-light leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Host Info Card */}
            <div className="p-4 rounded-3xl bg-[#F4F1EA] border border-[#E7E2D7] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#8C887F] font-light uppercase tracking-widest">
                  Hosted by
                </div>
                <div className="text-xs font-semibold text-[#1E1D1B]">{event.host.name}</div>
                <div className="text-[11px] text-[#7A766E] font-light">{event.host.role}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#E2DDD3] flex items-center justify-center font-normal text-xs text-[#3A3834] border border-[#D5D0C5]">
                {event.host.name[0]}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action CTA Button */}
          <div className="p-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5] to-transparent sticky bottom-0 z-20">
            <button
              onClick={() => onToggleBook(event.id)}
              className={`w-full py-4 rounded-[24px] text-sm font-normal tracking-wide transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                isBooked
                  ? 'bg-[#355B41] text-white hover:bg-[#2C4D36]'
                  : 'bg-[#1E1D1B] text-white hover:bg-[#2C2A26]'
              }`}
            >
              {isBooked ? (
                <>
                  <Check className="w-4 h-4 stroke-[2]" />
                  <span>Reserved · Tap to Cancel</span>
                </>
              ) : (
                <span>Reserve Spot ({event.price || 'Free RSVP'})</span>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
