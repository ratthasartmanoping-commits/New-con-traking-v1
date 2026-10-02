import heroTea from '../assets/images/hero_tea_meditation_1790521078902.jpg';
import heroArt from '../assets/images/hero_art_sculpture_1790521092278.jpg';
import heroSound from '../assets/images/hero_sound_bath_1790521105953.jpg';
import heroCeramic from '../assets/images/hero_ceramic_craft_1790521118785.jpg';

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  zone: string;
  description: string;
  imageUrl: string;
  spotsLeft: number;
  totalSpots: number;
  price: string;
  isArchived?: boolean;
  host: {
    name: string;
    role: string;
  };
}

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'evt-tea',
    title: 'Mindful Tea & Silence Gathering',
    category: 'Mindfulness',
    date: 'Saturday, Oct 4',
    time: '10:00 - 12:30',
    location: 'Kyoto Pavilion, Bangkok',
    venue: 'Quiet Garden Studio',
    zone: 'Zone A (Garden Seating)',
    description: 'An unplugged morning of sensory stillness and single-origin ceremonial tea tasting. Phones remain securely stored for the duration.',
    imageUrl: heroTea,
    spotsLeft: 4,
    totalSpots: 12,
    price: 'Free RSVP',
    host: {
      name: 'Nora Lindqvist',
      role: 'Tea Sommelier & Zen Practitioner',
    },
  },
  {
    id: 'evt-art',
    title: 'Monochrome Forms: Spatial Exhibition',
    category: 'Art & Design',
    date: 'Sunday, Oct 5',
    time: '14:00 - 18:00',
    location: 'Atelier Stone Gallery',
    venue: 'Main Hall A',
    zone: 'VIP Zone (Gallery Main)',
    description: 'Explore sculpted limestone installations and spatial light studies by contemporary minimalists in a phone-free viewing atmosphere.',
    imageUrl: heroArt,
    spotsLeft: 8,
    totalSpots: 25,
    price: 'Complimentary',
    host: {
      name: 'Marcus Vance',
      role: 'Curator & Architect',
    },
  },
  {
    id: 'evt-sound',
    title: 'Acoustic Sound Bath & Breathwork',
    category: 'Wellness',
    date: 'Wednesday, Oct 8',
    time: '19:00 - 20:30',
    location: 'The Sanctuary Studio',
    venue: 'Resonance Chamber',
    zone: 'Zone B (Acoustic Floor)',
    description: 'Immerse in deep acoustic vibrational frequencies from handcrafted Tibetan singing bowls, gongs, and ambient natural acoustics.',
    imageUrl: heroSound,
    spotsLeft: 2,
    totalSpots: 16,
    price: '$25 / Pass',
    host: {
      name: 'Evelyn Gray',
      role: 'Sound Healer',
    },
  },
  {
    id: 'evt-ceramic',
    title: 'Tactile Ceramic & Clay Workshop',
    category: 'Craftsmanship',
    date: 'Saturday, Oct 11',
    time: '13:00 - 16:30',
    location: 'Kanso Craft Studio',
    venue: 'Clay Workshop B',
    zone: 'Zone C (Workshop Studio)',
    description: 'A hands-on tactile pottery masterclass shaping neutral stoneware and porcelain vessels with organic textures.',
    imageUrl: heroCeramic,
    spotsLeft: 5,
    totalSpots: 10,
    price: '$45 (Materials included)',
    host: {
      name: 'Liam Chen',
      role: 'Master Ceramist',
    },
  },
];

export const ARCHIVE_EVENTS_DATA: EventItem[] = [
  {
    id: 'arch-1',
    title: 'Monochrome Light & Shadow Installation',
    category: 'Art & Design',
    date: 'Saturday, Sep 20',
    time: '16:00 - 19:00',
    location: 'Design Lab 01, Bangkok',
    venue: 'Studio Corridor',
    zone: 'Zone A (Studio Corridor)',
    description: 'An experimental study on ambient shadow, contrast, and tactile warm light in modern spatial architectural design.',
    imageUrl: heroArt,
    spotsLeft: 0,
    totalSpots: 18,
    price: 'Event Ended',
    isArchived: true,
    host: {
      name: 'Elena Rostova',
      role: 'Lighting Architect',
    },
  },
  {
    id: 'arch-2',
    title: 'Forest Sanctuary Acoustic Immersion',
    category: 'Wellness',
    date: 'Sunday, Sep 14',
    time: '08:00 - 11:00',
    location: 'Khao Yai Nature Deck',
    venue: 'Open Canopy Deck',
    zone: 'Balcony Zone (Canopy Deck)',
    description: 'Guided natural acoustic immersion and sensory breathing in serene forest canopy away from all digital notifications.',
    imageUrl: heroSound,
    spotsLeft: 0,
    totalSpots: 20,
    price: 'Event Ended',
    isArchived: true,
    host: {
      name: 'Kai Tanaka',
      role: 'Acoustic Ecologist',
    },
  },
];
