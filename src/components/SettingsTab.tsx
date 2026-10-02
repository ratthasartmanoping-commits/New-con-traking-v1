import React, { useState } from 'react';
import { Volume2, VolumeX, Smartphone, ShieldCheck, Key, RefreshCw, Sparkles, Check, Globe, HelpCircle, LogOut, FileImage, Layers, Maximize, Download } from 'lucide-react';
import { UserSettings } from '../types/brick';
import { sounds } from '../utils/audio';

interface SettingsTabProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onSimulatePhysicalScan: () => void;
  onResetData: () => void;
  subTab?: 'general' | 'detail';
  onSignOut?: () => void;
  onOpenExportModal?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onSimulatePhysicalScan,
  onResetData,
  subTab = 'general',
  onSignOut,
  onOpenExportModal,
}) => {
  const [showPairModal, setShowPairModal] = useState(false);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    if (next) sounds.playClick();
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleHaptic = () => {
    if (settings.soundEnabled) sounds.playClick();
    onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled });
  };

  const handleResetPasses = () => {
    if (settings.soundEnabled) sounds.playClick();
    onUpdateSettings({ ...settings, emergencyPassesRemaining: 3 });
  };

  const handleLanguageChange = (lang: 'en' | 'th') => {
    if (settings.soundEnabled) sounds.playClick();
    onUpdateSettings({ ...settings, language: lang });
  };

  const handleThemeChange = (tone: 'cream' | 'stone' | 'minimal-white') => {
    if (settings.soundEnabled) sounds.playClick();
    onUpdateSettings({ ...settings, themeTone: tone });
  };

  if (subTab === 'general') {
    return (
      <div className="w-full flex-1 px-6 py-2 space-y-6 select-none">
        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
            General Settings
          </h2>
          <p className="text-xs text-[#7A766D] mt-0.5">
            App sounds, tactile vibration, language and aesthetic themes
          </p>
        </div>

        {/* Sound & Haptics */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-4">
          <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
            Tactile Experience
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#383530]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#8C887F]" />
              )}
              <div>
                <div className="text-xs font-bold text-[#1E1D1B]">Mechanical Click & Thud</div>
                <div className="text-[11px] text-[#7E7A71]">Real sound synthesis for physical feedback</div>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.soundEnabled ? 'bg-[#1E1D1B]' : 'bg-[#D1CCC2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic vibration */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F2EFE8]">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#383530]" />
              <div>
                <div className="text-xs font-bold text-[#1E1D1B]">Haptic Vibration</div>
                <div className="text-[11px] text-[#7E7A71]">Subtle tactile buzz on lock & unlock</div>
              </div>
            </div>

            <button
              onClick={toggleHaptic}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                settings.hapticEnabled ? 'bg-[#1E1D1B]' : 'bg-[#D1CCC2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
          <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
            Language / ภาษา
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                settings.language === 'en'
                  ? 'bg-[#1E1D1B] text-white shadow-xs'
                  : 'bg-[#F0EDE6] text-[#55524B] hover:bg-[#E6E2D8]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('th')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                settings.language === 'th'
                  ? 'bg-[#1E1D1B] text-white shadow-xs'
                  : 'bg-[#F0EDE6] text-[#55524B] hover:bg-[#E6E2D8]'
              }`}
            >
              ภาษาไทย (Thai)
            </button>
          </div>
        </div>

        {/* Aesthetic Tone */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
          <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
            Minimalist Tone Theme
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'cream', label: 'Warm Cream', color: '#ECEAE4' },
                { id: 'stone', label: 'Matte Grey', color: '#E5E4E0' },
                { id: 'minimal-white', label: 'Clean White', color: '#F7F6F2' },
              ] as const
            ).map((t) => {
              const isSelected = settings.themeTone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1E1D1B] bg-white shadow-xs'
                      : 'border-transparent bg-[#F0EDE6] hover:bg-[#E6E2D8]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 mb-1"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="text-[11px] font-bold text-[#1E1D1B]">{t.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Fullscreen & PWA Mode Guide */}
        <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFECE5] flex items-center justify-center text-[#232220]">
                <Maximize className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
                  Mobile Fullscreen & PWA
                </div>
                <div className="text-sm font-bold text-[#1E1D1B]">
                  โหมดแสดงผลเต็มหน้าจอไร้ขอบ
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              100dvh Active
            </span>
          </div>

          <p className="text-[11px] text-[#7E7A71] leading-relaxed">
            ระบบตั้งค่า Viewport (100dvh + viewport-fit=cover) และ PWA Manifest (display: fullscreen) เรียบร้อยแล้ว หากเปิดใน Safari หรือ Chrome บนมือถือแล้วยังมีแถบเมนูบราวเซอร์:
          </p>

          <div className="p-3 rounded-2xl bg-[#F6F5F2] border border-[#E8E5DD] space-y-2 text-[11px] text-[#42403B]">
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#1E1D1B] shrink-0">iOS Safari:</span>
              <span>แตะปุ่ม <strong>แชร์ (Share)</strong> ด้านล่าง แล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)"</strong> เพื่อใช้งานเต็มจอ 100% ไร้แถบ URL</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#1E1D1B] shrink-0">Android Chrome:</span>
              <span>แตะเมนู <strong>3 จุด (⋮)</strong> แล้วเลือก <strong>"เพิ่มลงในหน้าจอหลัก"</strong> หรือ <strong>"ติดตั้งแอป"</strong></span>
            </div>
          </div>

          {typeof document !== 'undefined' && document.fullscreenEnabled && (
            <button
              onClick={() => {
                if (settings.soundEnabled) sounds.playClick();
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2C523A] hover:bg-[#23432F] active:scale-98 text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize className="w-3.5 h-3.5 text-emerald-200" />
              <span>เปิด/ปิด โหมดเต็มหน้าจอ (Fullscreen Browser)</span>
            </button>
          )}
        </div>

        {/* Export & Resolution @3x Card */}
        {onOpenExportModal && (
          <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFECE5] flex items-center justify-center text-[#232220]">
                  <FileImage className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
                    Export Assets @3x & Safe Area
                  </div>
                  <div className="text-sm font-bold text-[#1E1D1B]">
                    440 × 956 pt (1320 × 2868 px)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                iOS Retina
              </span>
            </div>

            <p className="text-[11px] text-[#7E7A71] leading-relaxed">
              ส่งออกภาพหน้าจอจำลอง (Mockup) และชุดไอคอนมาตรฐาน iOS ที่ความละเอียด @3x พร้อมเว้น Safe Area ด้านบน 59pt (Dynamic Island) และด้านล่าง 34pt (Home Bar)
            </p>

            <button
              onClick={() => {
                if (settings.soundEnabled) sounds.playClick();
                onOpenExportModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E1D1B] hover:bg-[#35332E] active:scale-98 text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5 text-amber-200" />
              <span>เปิดเครื่องมือส่งออกไฟล์ภาพ & ไอคอน @3x</span>
            </button>
          </div>
        )}

        {/* Account & Sign Out */}
        {onSignOut && (
          <div className="pt-1">
            <button
              onClick={onSignOut}
              className="w-full py-3 px-4 rounded-2xl bg-stone-200/80 hover:bg-stone-300/80 active:scale-98 text-[#1E1D1B] font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 border border-stone-300/60 shadow-xs"
            >
              <LogOut className="w-4 h-4 text-stone-700" />
              <span>Sign Out & Return to Lock Screen</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Detail view
  return (
    <div className="w-full flex-1 px-6 py-2 space-y-6 select-none">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E1D1B] tracking-tight">
          System & Device Detail
        </h2>
        <p className="text-xs text-[#7A766D] mt-0.5">
          Hardware pairing, NFC security key, battery health and device specs
        </p>
      </div>

      {/* Hardware Brick Pairing Card */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFECE5] flex items-center justify-center text-[#232220]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
                Physical Device
              </div>
              <div className="text-sm font-bold text-[#1E1D1B]">
                {settings.brickSerialNumber}
              </div>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#3F684B] bg-[#E7EFE9] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3F684B] animate-pulse" />
            Paired
          </span>
        </div>

        <div className="pt-2 border-t border-[#F2EFE8] flex gap-2">
          <button
            onClick={onSimulatePhysicalScan}
            className="flex-1 py-2.5 rounded-xl bg-[#1E1D1B] hover:bg-[#35332E] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            Simulate Physical NFC Tap
          </button>
        </div>
      </div>

      {/* Device Technical Specifications */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
        <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
          Technical Specifications
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Firmware Version</span>
            <span className="font-mono font-bold text-[#1E1D1B]">v2.4.1-build88</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">NFC Chip Protocol</span>
            <span className="font-mono font-bold text-[#1E1D1B]">ISO/IEC 14443-A</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Battery Health</span>
            <span className="font-mono font-bold text-emerald-700">94% (Good)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#7E7A71]">Encryption Standard</span>
            <span className="font-mono font-bold text-[#1E1D1B]">AES-256-GCM</span>
          </div>
        </div>
      </div>

      {/* Screen & Viewport Geometry Specifications */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
            Screen & Safe Area Specs
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            iPhone 16 Pro Max
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Viewport (Logical)</span>
            <span className="font-mono font-bold text-[#1E1D1B]">440 × 956 pt</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Render Scale (@3x)</span>
            <span className="font-mono font-bold text-[#1E1D1B]">1320 × 2868 px</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Top Safe Area</span>
            <span className="font-mono font-bold text-[#1E1D1B]">59 pt (177 px @3x)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F2EFE8]">
            <span className="text-[#7E7A71]">Dynamic Island</span>
            <span className="font-mono font-bold text-[#1E1D1B]">125 × 35 pt (375 × 105 px)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#7E7A71]">Bottom Safe Area</span>
            <span className="font-mono font-bold text-[#1E1D1B]">34 pt (102 px @3x)</span>
          </div>
        </div>

        {onOpenExportModal && (
          <div className="pt-2 border-t border-[#F2EFE8]">
            <button
              onClick={() => {
                if (settings.soundEnabled) sounds.playClick();
                onOpenExportModal();
              }}
              className="w-full py-2.5 rounded-xl bg-[#1E1D1B] hover:bg-[#35332E] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FileImage className="w-3.5 h-3.5 text-amber-200" />
              <span>ส่งออกไฟล์ภาพ & ไอคอน @3x</span>
            </button>
          </div>
        )}
      </div>

      {/* Emergency Passes */}
      <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E3DFC] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#383530]" />
            <div>
              <div className="text-xs font-bold text-[#1E1D1B]">Emergency Passes</div>
              <div className="text-[11px] text-[#7E7A71]">
                Unbrick without physical device ({settings.emergencyPassesRemaining}/3 left)
              </div>
            </div>
          </div>
          <button
            onClick={handleResetPasses}
            className="text-xs font-semibold text-[#1E1D1B] hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Reset Data Option & Sign Out */}
      <div className="pt-2 space-y-2">
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="w-full py-3 px-4 rounded-2xl bg-stone-200/80 hover:bg-stone-300/80 active:scale-98 text-[#1E1D1B] font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 border border-stone-300/60 shadow-xs"
          >
            <LogOut className="w-4 h-4 text-stone-700" />
            <span>Sign Out & Return to Lock Screen</span>
          </button>
        )}
        <button
          onClick={onResetData}
          className="w-full py-3 rounded-2xl bg-[#EDEAE2] hover:bg-[#E2DDD3] text-[#7A3E3E] text-xs font-semibold tracking-wide transition-colors cursor-pointer"
        >
          Reset All Modes & Default Data
        </button>
      </div>
    </div>
  );
};
