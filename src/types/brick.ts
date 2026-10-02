export interface BlockedItem {
  id: string;
  name: string;
  category: 'social' | 'entertainment' | 'work' | 'shopping' | 'news' | 'other';
  icon: string;
  type: 'app' | 'website';
  blocked: boolean;
}

export interface BrickMode {
  id: string;
  name: string;
  description: string;
  iconName: string;
  appsCount: number;
  websitesCount: number;
  blockedItems: BlockedItem[];
  strictMode: boolean;
  isCustom?: boolean;
}

export interface ScheduleItem {
  id: string;
  name: string;
  modeId: string;
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  enabled: boolean;
}

export interface ActivityDay {
  day: string;
  dayShort: string;
  date: string;
  screenTimeMinutes: number;
  brickedMinutes: number;
  pickups: number;
  appsBreakdown: { name: string; minutes: number; color: string }[];
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  strictHoldSeconds: number;
  pairedPhysicalBrick: boolean;
  brickSerialNumber: string;
  themeTone: 'cream' | 'stone' | 'minimal-white';
  language: 'en' | 'th';
  emergencyPassesRemaining: number;
}
