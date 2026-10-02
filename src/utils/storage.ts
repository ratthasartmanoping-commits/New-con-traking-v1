import { BrickMode, ScheduleItem, ActivityDay, UserSettings } from '../types/brick';

export const DEFAULT_MODES: BrickMode[] = [
  {
    id: 'no-socials',
    name: 'No Socials',
    description: 'Silences all endless-scroll feeds and dopamine loops.',
    iconName: 'MessageSquareOff',
    appsCount: 4,
    websitesCount: 3,
    strictMode: true,
    blockedItems: [
      { id: 'app-ig', name: 'Instagram', category: 'social', icon: 'camera', type: 'app', blocked: true },
      { id: 'app-tiktok', name: 'TikTok', category: 'social', icon: 'video', type: 'app', blocked: true },
      { id: 'app-x', name: 'X / Twitter', category: 'social', icon: 'twitter', type: 'app', blocked: true },
      { id: 'app-fb', name: 'Facebook', category: 'social', icon: 'facebook', type: 'app', blocked: true },
      { id: 'web-reddit', name: 'reddit.com', category: 'social', icon: 'globe', type: 'website', blocked: true },
      { id: 'web-threads', name: 'threads.net', category: 'social', icon: 'globe', type: 'website', blocked: true },
      { id: 'web-yt-shorts', name: 'youtube.com/shorts', category: 'entertainment', icon: 'globe', type: 'website', blocked: true },
    ],
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    description: 'Total focus. Only essential productivity tools allowed.',
    iconName: 'Briefcase',
    appsCount: 8,
    websitesCount: 6,
    strictMode: true,
    blockedItems: [
      { id: 'app-ig', name: 'Instagram', category: 'social', icon: 'camera', type: 'app', blocked: true },
      { id: 'app-tiktok', name: 'TikTok', category: 'social', icon: 'video', type: 'app', blocked: true },
      { id: 'app-x', name: 'X / Twitter', category: 'social', icon: 'twitter', type: 'app', blocked: true },
      { id: 'app-yt', name: 'YouTube', category: 'entertainment', icon: 'play', type: 'app', blocked: true },
      { id: 'app-netflix', name: 'Netflix', category: 'entertainment', icon: 'film', type: 'app', blocked: true },
      { id: 'app-discord', name: 'Discord', category: 'social', icon: 'message-circle', type: 'app', blocked: true },
      { id: 'app-games', name: 'Mobile Games', category: 'entertainment', icon: 'gamepad-2', type: 'app', blocked: true },
      { id: 'app-shopee', name: 'Shopping Apps', category: 'shopping', icon: 'shopping-bag', type: 'app', blocked: true },
      { id: 'web-reddit', name: 'reddit.com', category: 'social', icon: 'globe', type: 'website', blocked: true },
      { id: 'web-news', name: 'news.ycombinator.com', category: 'news', icon: 'globe', type: 'website', blocked: true },
      { id: 'web-twitter', name: 'x.com', category: 'social', icon: 'globe', type: 'website', blocked: true },
    ],
  },
  {
    id: 'sleep-tight',
    name: 'Sleep Tight',
    description: 'Keep your bedroom a phone-free sanctuary for restful sleep.',
    iconName: 'Moon',
    appsCount: 12,
    websitesCount: 10,
    strictMode: true,
    blockedItems: [
      { id: 'app-all-social', name: 'All Social Media', category: 'social', icon: 'users', type: 'app', blocked: true },
      { id: 'app-email', name: 'Work Email & Slack', category: 'work', icon: 'mail', type: 'app', blocked: true },
      { id: 'app-stream', name: 'Streaming & Video', category: 'entertainment', icon: 'tv', type: 'app', blocked: true },
      { id: 'app-browser', name: 'Web Browsers', category: 'other', icon: 'compass', type: 'app', blocked: true },
    ],
  },
  {
    id: 'study-session',
    name: 'Study Session',
    description: 'Eliminate digital temptations while preparing and reading.',
    iconName: 'BookOpen',
    appsCount: 6,
    websitesCount: 4,
    strictMode: false,
    blockedItems: [
      { id: 'app-ig', name: 'Instagram', category: 'social', icon: 'camera', type: 'app', blocked: true },
      { id: 'app-tiktok', name: 'TikTok', category: 'social', icon: 'video', type: 'app', blocked: true },
      { id: 'app-yt', name: 'YouTube', category: 'entertainment', icon: 'play', type: 'app', blocked: true },
      { id: 'app-games', name: 'Games', category: 'entertainment', icon: 'gamepad', type: 'app', blocked: true },
      { id: 'web-reddit', name: 'reddit.com', category: 'social', icon: 'globe', type: 'website', blocked: true },
    ],
  },
];

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sch-1',
    name: 'Work Focus Hours',
    modeId: 'deep-work',
    days: [1, 2, 3, 4, 5], // Mon-Fri
    startTime: '09:00',
    endTime: '17:30',
    enabled: true,
  },
  {
    id: 'sch-2',
    name: 'Bedtime Unplug',
    modeId: 'sleep-tight',
    days: [0, 1, 2, 3, 4, 5, 6], // Everyday
    startTime: '22:30',
    endTime: '07:00',
    enabled: true,
  },
  {
    id: 'sch-3',
    name: 'Weekend Screen Fast',
    modeId: 'no-socials',
    days: [0, 6], // Sun, Sat
    startTime: '13:00',
    endTime: '18:00',
    enabled: false,
  },
];

export const DEFAULT_ACTIVITY_DATA: ActivityDay[] = [
  {
    day: 'Monday',
    dayShort: 'M',
    date: 'Sep 21',
    screenTimeMinutes: 240, // 4h 00m
    brickedMinutes: 380, // 6h 20m
    pickups: 42,
    appsBreakdown: [
      { name: 'Instagram', minutes: 75, color: '#E1306C' },
      { name: 'Safari', minutes: 55, color: '#007AFF' },
      { name: 'YouTube', minutes: 60, color: '#FF0000' },
      { name: 'Messages', minutes: 30, color: '#34C759' },
      { name: 'Others', minutes: 20, color: '#8E8E93' },
    ],
  },
  {
    day: 'Tuesday',
    dayShort: 'T',
    date: 'Sep 22',
    screenTimeMinutes: 310, // 5h 10m
    brickedMinutes: 310,
    pickups: 56,
    appsBreakdown: [
      { name: 'TikTok', minutes: 110, color: '#000000' },
      { name: 'X / Twitter', minutes: 80, color: '#1DA1F2' },
      { name: 'YouTube', minutes: 70, color: '#FF0000' },
      { name: 'Others', minutes: 50, color: '#8E8E93' },
    ],
  },
  {
    day: 'Wednesday',
    dayShort: 'W',
    date: 'Sep 23',
    screenTimeMinutes: 190, // 3h 10m
    brickedMinutes: 450, // 7h 30m
    pickups: 34,
    appsBreakdown: [
      { name: 'Slack', minutes: 90, color: '#4A154B' },
      { name: 'Notion', minutes: 60, color: '#000000' },
      { name: 'Instagram', minutes: 25, color: '#E1306C' },
      { name: 'Others', minutes: 15, color: '#8E8E93' },
    ],
  },
  {
    day: 'Thursday',
    dayShort: 'T',
    date: 'Sep 24',
    screenTimeMinutes: 220,
    brickedMinutes: 420,
    pickups: 39,
    appsBreakdown: [
      { name: 'Instagram', minutes: 60, color: '#E1306C' },
      { name: 'YouTube', minutes: 70, color: '#FF0000' },
      { name: 'Safari', minutes: 50, color: '#007AFF' },
      { name: 'Others', minutes: 40, color: '#8E8E93' },
    ],
  },
  {
    day: 'Friday',
    dayShort: 'F',
    date: 'Sep 25',
    screenTimeMinutes: 280,
    brickedMinutes: 360,
    pickups: 61,
    appsBreakdown: [
      { name: 'TikTok', minutes: 100, color: '#000000' },
      { name: 'Netflix', minutes: 90, color: '#E50914' },
      { name: 'X / Twitter', minutes: 50, color: '#1DA1F2' },
      { name: 'Others', minutes: 40, color: '#8E8E93' },
    ],
  },
  {
    day: 'Saturday',
    dayShort: 'S',
    date: 'Sep 26',
    screenTimeMinutes: 150, // 2h 30m
    brickedMinutes: 520, // 8h 40m
    pickups: 22,
    appsBreakdown: [
      { name: 'Camera', minutes: 45, color: '#34C759' },
      { name: 'Maps', minutes: 40, color: '#FF9500' },
      { name: 'Spotify', minutes: 45, color: '#1DB954' },
      { name: 'Others', minutes: 20, color: '#8E8E93' },
    ],
  },
  {
    day: 'Sunday',
    dayShort: 'S',
    date: 'Today',
    screenTimeMinutes: 771, // 12h 51m (Matching the exact image "12h 51m today")
    brickedMinutes: 290, // 4h 50m
    pickups: 74,
    appsBreakdown: [
      { name: 'Instagram', minutes: 245, color: '#E1306C' },
      { name: 'TikTok', minutes: 190, color: '#000000' },
      { name: 'YouTube', minutes: 160, color: '#FF0000' },
      { name: 'X / Twitter', minutes: 110, color: '#1DA1F2' },
      { name: 'Others', minutes: 66, color: '#8E8E93' },
    ],
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  strictHoldSeconds: 3,
  pairedPhysicalBrick: true,
  brickSerialNumber: 'BRK-8942-A',
  themeTone: 'cream',
  language: 'en',
  emergencyPassesRemaining: 3,
};
