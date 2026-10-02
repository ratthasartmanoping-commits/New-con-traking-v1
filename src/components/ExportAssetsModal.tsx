import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Smartphone,
  Layers,
  Sparkles,
  Check,
  Eye,
  Sliders,
  Maximize2,
  FileImage,
  Info
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ExportAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showSafeAreaGuides: boolean;
  onToggleSafeAreaGuides: (enabled: boolean) => void;
  soundEnabled?: boolean;
}

type IconTheme = 'charcoal' | 'cream' | 'jade';

export const ExportAssetsModal: React.FC<ExportAssetsModalProps> = ({
  isOpen,
  onClose,
  showSafeAreaGuides,
  onToggleSafeAreaGuides,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'screen' | 'icons' | 'specs'>('screen');
  const [screenExportType, setScreenExportType] = useState<'clean' | 'guides' | 'device'>('clean');
  const [selectedTheme, setSelectedTheme] = useState<IconTheme>('charcoal');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger feedback
  const triggerSound = () => {
    if (soundEnabled) sounds.playClick();
  };

  // Render icon preview canvas
  useEffect(() => {
    if (!isOpen || activeTab !== 'icons') return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 360; // preview size
    canvas.width = size;
    canvas.height = size;

    drawBrickIconOnCanvas(ctx, size, selectedTheme);
  }, [isOpen, activeTab, selectedTheme]);

  // Helper: Draw Brick App Icon on canvas
  const drawBrickIconOnCanvas = (
    ctx: CanvasRenderingContext2D,
    size: number,
    theme: IconTheme
  ) => {
    ctx.clearRect(0, 0, size, size);

    // Color definitions
    let bgGradient: [string, string];
    let brickFill: string;
    let dotFill: string;
    let accentCut: string;

    if (theme === 'charcoal') {
      bgGradient = ['#282624', '#161514'];
      brickFill = '#ECE9E2';
      dotFill = '#22201E';
      accentCut = '#22201E';
    } else if (theme === 'cream') {
      bgGradient = ['#F5F2EB', '#E7E2D6'];
      brickFill = '#2C2A26';
      dotFill = '#ECE9E2';
      accentCut = '#ECE9E2';
    } else {
      bgGradient = ['#243329', '#152119'];
      brickFill = '#E4EADF';
      dotFill = '#1C2920';
      accentCut = '#1C2920';
    }

    // Outer rounded squircle base
    const r = size * 0.22;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.clip();

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, bgGradient[0]);
    bgGrad.addColorStop(1, bgGradient[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Inner subtle bevel shadow & highlight
    ctx.lineWidth = size * 0.015;
    ctx.strokeStyle = theme === 'charcoal' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)';
    ctx.stroke();

    // Main Brick Block
    const bw = size * 0.46;
    const bh = size * 0.46;
    const bx = (size - bw) / 2;
    const by = (size - bh) / 2;
    const br = size * 0.09;

    // Drop shadow under brick
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = size * 0.07;
    ctx.shadowOffsetY = size * 0.035;

    ctx.fillStyle = brickFill;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, br);
    ctx.fill();
    ctx.restore();

    // Brick roof arch / cutout
    const archW = bw * 0.38;
    const archH = bh * 0.22;
    const archX = bx + (bw - archW) / 2;
    const archY = by + bh * 0.22;
    ctx.fillStyle = accentCut;
    ctx.beginPath();
    ctx.roundRect(archX, archY, archW, archH, archH / 2);
    ctx.fill();

    // 3 Tactile Dots
    const dotRadius = bw * 0.058;
    const dotY = by + bh * 0.68;
    const dotSpacing = bw / 4;

    ctx.fillStyle = dotFill;
    for (let i = 1; i <= 3; i++) {
      const dotX = bx + dotSpacing * i;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Helper: Trigger PNG download from Canvas
  const downloadCanvasAsPNG = (canvas: HTMLCanvasElement, filename: string) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  // Export specific Icon resolution
  const handleExportIcon = (dimension: number, label: string) => {
    triggerSound();
    setIsExporting(true);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = dimension;
    exportCanvas.height = dimension;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    drawBrickIconOnCanvas(ctx, dimension, selectedTheme);

    const filename = `brick-icon-${dimension}x${dimension}-3x-${selectedTheme}.png`;
    downloadCanvasAsPNG(exportCanvas, filename);

    setExportSuccessMessage(`ดาวน์โหลด ${label} (${dimension}x${dimension}px) เรียบร้อยแล้ว`);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMessage(null);
    }, 2200);
  };

  // Export All Icons bundle
  const handleExportAllIcons = () => {
    triggerSound();
    setIsExporting(true);

    const sizes = [
      { dim: 180, name: '180x180-3x' },
      { dim: 120, name: '120x120-3x' },
      { dim: 60, name: '60x60-3x' },
      { dim: 1024, name: '1024x1024-master' },
    ];

    sizes.forEach((item, index) => {
      setTimeout(() => {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = item.dim;
        exportCanvas.height = item.dim;
        const ctx = exportCanvas.getContext('2d');
        if (ctx) {
          drawBrickIconOnCanvas(ctx, item.dim, selectedTheme);
          downloadCanvasAsPNG(
            exportCanvas,
            `brick-icon-${item.name}-${selectedTheme}.png`
          );
        }
      }, index * 250);
    });

    setExportSuccessMessage('ดาวน์โหลดไอคอนทุกขนาด (@3x 180px, 120px, 60px, 1024px) เรียบร้อย');
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMessage(null);
    }, 2500);
  };

  // Export Full Screen Mockup @3x (1320 x 2868 px)
  const handleExportScreenMockup = () => {
    triggerSound();
    setIsExporting(true);

    // Exact iPhone 16 Pro Max specifications:
    // 440 x 956 pt @3x = 1320 x 2868 px
    const targetW = 1320;
    const targetH = 2868;

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color: #DDD9D0
    ctx.fillStyle = '#DDD9D0';
    ctx.fillRect(0, 0, targetW, targetH);

    // Safe Area offsets at @3x:
    // 59 pt * 3 = 177 px
    // 34 pt * 3 = 102 px
    const safeTop = 177;
    const safeBottom = 102;

    // Card Surface Area
    const cardTop = 0;
    const cardBottom = targetH - 240; // Nav bar height: 80pt * 3 = 240px
    const cardRadius = 144; // 48pt * 3

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, cardTop, targetW, cardBottom, [0, 0, cardRadius, cardRadius]);
    ctx.fillStyle = '#ECE9E2';
    ctx.shadowColor = 'rgba(40, 36, 30, 0.16)';
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 24;
    ctx.fill();
    ctx.restore();

    // Top Segmented Bar mockup (Event / Archive)
    const pillW = 440;
    const pillH = 135;
    const pillX = 72;
    const pillY = safeTop + 132; // padded below safe area
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();

    // Active pill inside
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(pillX + 6, pillY + 6, pillW / 2 - 6, pillH - 12, (pillH - 12) / 2);
    ctx.fill();

    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1E1D1B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Event', pillX + pillW / 4, pillY + pillH / 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Archive', pillX + (pillW * 3) / 4, pillY + pillH / 2);
    ctx.restore();

    // Profile Avatar Circle
    const avatarR = 66;
    const avatarX = targetW - 72 - avatarR;
    const avatarY = pillY + pillH / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('R', avatarX, avatarY);
    ctx.restore();

    // Event Card Sample in Center
    const cardX = 72;
    const cardY = pillY + pillH + 72;
    const cardW = targetW - 144;
    const cardH = 1550;
    ctx.save();
    ctx.fillStyle = '#1A1918';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 84);
    ctx.clip();
    ctx.fill();

    // Card Image gradient & placeholder
    const cardGrad = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
    cardGrad.addColorStop(0, '#2F3C35');
    cardGrad.addColorStop(0.5, '#1B2420');
    cardGrad.addColorStop(1, '#0F1512');
    ctx.fillStyle = cardGrad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Event Title
    ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mindful Tea & Silence', cardX + 64, cardY + cardH - 360);

    ctx.font = '36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('Saturday 14:00 • Sukhumvit 49 Zen Space', cardX + 64, cardY + cardH - 260);

    // Booked Badge
    ctx.fillStyle = '#3A6447';
    ctx.beginPath();
    ctx.roundRect(cardX + 64, cardY + cardH - 170, 260, 80, 40);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ BOOKED', cardX + 194, cardY + cardH - 120);
    ctx.restore();

    // Bottom Navigation Bar (4 icons)
    const navY = targetH - 240;
    const navH = 240;
    const navTabs = ['Events', 'Schedule', 'Activity', 'Settings'];
    const tabW = targetW / 4;

    navTabs.forEach((tab, i) => {
      const tx = tabW * i + tabW / 2;
      const ty = navY + 75;
      ctx.fillStyle = i === 0 ? '#1E1D1B' : '#75726B';
      ctx.beginPath();
      ctx.arc(tx, ty, 20, 0, Math.PI * 2);
      ctx.fill();

      if (i === 0) {
        ctx.fillStyle = '#1E1D1B';
        ctx.fillRect(tx - 6, ty + 40, 12, 12);
      }
    });

    // Dynamic Island at Top: 375 x 105 px @3x
    const islandW = 375;
    const islandH = 105;
    const islandX = (targetW - islandW) / 2;
    const islandY = 36;
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(islandX, islandY, islandW, islandH, islandH / 2);
    ctx.fill();
    ctx.restore();

    // Home Indicator at Bottom: 420 x 15 px @3x
    const homeW = 420;
    const homeH = 15;
    const homeX = (targetW - homeW) / 2;
    const homeY = targetH - 45;
    ctx.save();
    ctx.fillStyle = 'rgba(30, 29, 27, 0.85)';
    ctx.beginPath();
    ctx.roundRect(homeX, homeY, homeW, homeH, homeH / 2);
    ctx.fill();
    ctx.restore();

    // If "Guides" mode, draw technical Safe Area overlays
    if (screenExportType === 'guides') {
      ctx.save();

      // Top Safe Area Tint (59pt * 3 = 177px)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, 0, targetW, safeTop);

      // Top Guide Line
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 12]);
      ctx.beginPath();
      ctx.moveTo(0, safeTop);
      ctx.lineTo(targetW, safeTop);
      ctx.stroke();

      // Bottom Safe Area Tint (34pt * 3 = 102px)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, targetH - safeBottom, targetW, safeBottom);

      // Bottom Guide Line
      ctx.beginPath();
      ctx.moveTo(0, targetH - safeBottom);
      ctx.lineTo(targetW, targetH - safeBottom);
      ctx.stroke();

      // Labels
      ctx.setLineDash([]);
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`TOP SAFE AREA: 59pt (177px @3x)`, 40, safeTop - 24);
      ctx.fillText(`BOTTOM SAFE AREA: 34pt (102px @3x)`, 40, targetH - safeBottom + 40);
      ctx.fillText(`VIEWPORT: 440 x 956 pt (1320 x 2868 px @3x)`, 40, safeTop + 50);

      ctx.restore();
    }

    const filename = `brick-mockup-440x956pt-3x-${screenExportType}.png`;
    downloadCanvasAsPNG(canvas, filename);

    setExportSuccessMessage(`ส่งออกภาพ 1320 × 2868 px (@3x) สำเร็จแล้ว!`);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccessMessage(null);
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg bg-[#ECE9E2] rounded-[36px] border border-[#DDD9D0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#DDD9D0] flex items-center justify-between bg-[#ECE9E2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E1D1B] flex items-center justify-center text-white">
                <FileImage className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1D1B] tracking-tight">
                  Export @3x & Safe Area Tool
                </h3>
                <p className="text-[11px] text-[#7A766D] font-mono">
                  440 × 956 pt (1320 × 2868 px @3x)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                triggerSound();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-[#1E1D1B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="px-6 pt-3 pb-2 flex gap-2">
            {[
              { id: 'screen', label: 'Screen Mockup @3x', icon: Smartphone },
              { id: 'icons', label: 'App Icons @3x', icon: Sparkles },
              { id: 'specs', label: 'Safe Area Specs', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerSound();
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1D1B] text-white shadow-xs'
                      : 'bg-[#DDD9D0]/70 text-[#5C5951] hover:bg-[#DDD9D0]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
            {/* TAB 1: SCREEN MOCKUP EXPORT */}
            {activeTab === 'screen' && (
              <div className="space-y-4">
                {/* Resolution & Specs Summary Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#DDD9D0] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8C887F] uppercase tracking-wider">
                      Export Resolution
                    </span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      1320 × 2868 px (@3x)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F2EFE8]">
                    <div className="bg-[#F8F7F4] p-2.5 rounded-xl">
                      <div className="text-[10px] text-[#8C887F] font-semibold">VIEWPORT DISPLAY</div>
                      <div className="font-mono font-bold text-[#1E1D1B]">440 × 956 pt</div>
                      <div className="text-[10px] text-[#A09C94]">iPhone 16 Pro Max standard</div>
                    </div>
                    <div className="bg-[#F8F7F4] p-2.5 rounded-xl">
                      <div className="text-[10px] text-[#8C887F] font-semibold">SAFE AREA INSETS</div>
                      <div className="font-mono font-bold text-[#1E1D1B]">Top 59pt / Bot 34pt</div>
                      <div className="text-[10px] text-[#A09C94]">177px / 102px @3x</div>
                    </div>
                  </div>
                </div>

                {/* Render Mode Selectors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E1D1B] tracking-tight">
                    Export Style:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'clean', label: 'Clean Render', desc: 'Safe area padded' },
                      { id: 'guides', label: 'Technical Guides', desc: 'Overlaid safe zone lines' },
                      { id: 'device', label: 'Device Mockup', desc: 'Dynamic island + home bar' },
                    ].map((mode) => {
                      const isSelected = screenExportType === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            triggerSound();
                            setScreenExportType(mode.id as any);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1E1D1B] bg-white shadow-xs'
                              : 'border-transparent bg-[#E2DED6] hover:bg-[#D8D4CC]'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#1E1D1B]">{mode.label}</div>
                          <div className="text-[10px] text-[#7A766D] leading-tight mt-0.5">
                            {mode.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Safe Area Guide Toggle */}
                <div className="p-3.5 rounded-2xl bg-[#E2DED6] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-[#1E1D1B]" />
                    <div>
                      <div className="text-xs font-bold text-[#1E1D1B]">
                        Live Safe Area Overlay on Screen
                      </div>
                      <div className="text-[10px] text-[#7A766D]">
                        Show red guideline markers on the active app view
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerSound();
                      onToggleSafeAreaGuides(!showSafeAreaGuides);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      showSafeAreaGuides ? 'bg-[#1E1D1B]' : 'bg-[#C7C3B9]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        showSafeAreaGuides ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Export Button */}
                <button
                  disabled={isExporting}
                  onClick={handleExportScreenMockup}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1E1D1B] hover:bg-[#32302D] active:scale-98 text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isExporting
                      ? 'กำลังประมวลผลไฟล์ @3x...'
                      : 'ดาวน์โหลดภาพหน้าจอ @3x (1320 × 2868 px PNG)'}
                  </span>
                </button>
              </div>
            )}

            {/* TAB 2: APP ICONS EXPORT */}
            {activeTab === 'icons' && (
              <div className="space-y-4">
                {/* Icon Theme Selector & Live Preview */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#DDD9D0]">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-black/10">
                    <canvas
                      ref={previewCanvasRef}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-bold text-[#1E1D1B]">
                      Brick Minimalist App Icon
                    </div>
                    <div className="text-[11px] text-[#7A766D]">
                      Tactile brick geometry with recessed detent indicators
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      {[
                        { id: 'charcoal', label: 'Charcoal', color: '#1A1918' },
                        { id: 'cream', label: 'Cream', color: '#ECE9E2' },
                        { id: 'jade', label: 'Zen Jade', color: '#1F2A24' },
                      ].map((th) => (
                        <button
                          key={th.id}
                          onClick={() => {
                            triggerSound();
                            setSelectedTheme(th.id as any);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            selectedTheme === th.id
                              ? 'border-[#1E1D1B] bg-[#1E1D1B] text-white'
                              : 'border-[#DDD9D0] bg-[#F4F1EA] text-[#55524B]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: th.color }}
                          />
                          <span>{th.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available iOS Resolutions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1E1D1B]">
                    ส่งออกไอคอนตามความละเอียดมาตรฐาน Apple iOS:
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExportIcon(180, 'iPhone App Icon @3x')}
                      className="p-3 rounded-xl bg-white border border-[#DDD9D0] hover:border-[#1E1D1B] text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E1D1B]">iPhone App Icon</span>
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          @3x
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#7A766D] mt-0.5">
                        180 × 180 px (60pt @3x)
                      </div>
                      <div className="text-[10px] text-[#A09C94] mt-1">iOS Home Screen icon</div>
                    </button>

                    <button
                      onClick={() => handleExportIcon(1024, 'App Store Master Icon')}
                      className="p-3 rounded-xl bg-white border border-[#DDD9D0] hover:border-[#1E1D1B] text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E1D1B]">App Store Master</span>
                        <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          HD
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#7A766D] mt-0.5">
                        1024 × 1024 px
                      </div>
                      <div className="text-[10px] text-[#A09C94] mt-1">Full Master Artwork</div>
                    </button>

                    <button
                      onClick={() => handleExportIcon(120, 'Spotlight Icon @3x')}
                      className="p-3 rounded-xl bg-white border border-[#DDD9D0] hover:border-[#1E1D1B] text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E1D1B]">Spotlight / Settings</span>
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          @3x
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#7A766D] mt-0.5">
                        120 × 120 px (40pt @3x)
                      </div>
                      <div className="text-[10px] text-[#A09C94] mt-1">System Search & Settings</div>
                    </button>

                    <button
                      onClick={() => handleExportIcon(60, 'Notification Icon @3x')}
                      className="p-3 rounded-xl bg-white border border-[#DDD9D0] hover:border-[#1E1D1B] text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E1D1B]">Notification Icon</span>
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          @3x
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#7A766D] mt-0.5">
                        60 × 60 px (20pt @3x)
                      </div>
                      <div className="text-[10px] text-[#A09C94] mt-1">iOS Lock Screen alerts</div>
                    </button>
                  </div>
                </div>

                {/* Batch Download All Icons */}
                <button
                  disabled={isExporting}
                  onClick={handleExportAllIcons}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1E1D1B] hover:bg-[#32302D] active:scale-98 text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>ดาวน์โหลดชุดไอคอนทุกขนาดครบเซ็ต (180, 120, 60, 1024px)</span>
                </button>
              </div>
            )}

            {/* TAB 3: SAFE AREA SPECS & DETAILS */}
            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-[#DDD9D0] space-y-3">
                  <div className="text-xs font-bold text-[#1E1D1B] flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>Apple Human Interface Guidelines (iPhone 16 Pro Max)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                      <span className="text-[#7A766D]">Logical Viewport</span>
                      <span className="font-mono font-bold text-[#1E1D1B]">440 × 956 pt</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                      <span className="text-[#7A766D]">Render Resolution (@3x)</span>
                      <span className="font-mono font-bold text-emerald-800">1320 × 2868 px</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                      <span className="text-[#7A766D]">Top Safe Area Inset</span>
                      <span className="font-mono font-bold text-[#1E1D1B]">
                        59 pt (177 px @3x)
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                      <span className="text-[#7A766D]">Dynamic Island Area</span>
                      <span className="font-mono font-bold text-[#1E1D1B]">
                        125 × 35 pt (375 × 105 px @3x)
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[#F2EFE8]">
                      <span className="text-[#7A766D]">Bottom Safe Area Inset</span>
                      <span className="font-mono font-bold text-[#1E1D1B]">
                        34 pt (102 px @3x)
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5">
                      <span className="text-[#7A766D]">Home Indicator Size</span>
                      <span className="font-mono font-bold text-[#1E1D1B]">
                        140 × 5 pt (420 × 15 px @3x)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E2DED6] text-[11px] text-[#5C5951] leading-relaxed">
                  💡 <strong>Safe Area Handling:</strong> ภายในแอปพลิเคชันได้ตั้งค่าระยะ Margin และ Padding ด้านบนเป็น <code>max(59px, env(safe-area-inset-top))</code> และด้านล่างเป็น <code>max(34px, env(safe-area-inset-bottom))</code> เพื่อให้ปุ่ม หัวเรื่อง และเนวิเกชันบาร์หลบพ้น Dynamic Island และแถบ Home Indicator อย่างสมบูรณ์แบบทั้งบนตัวเครื่องจริงและในการส่งออกไฟล์ @3x
                </div>
              </div>
            )}

            {/* Success toast */}
            {exportSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>{exportSuccessMessage}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
