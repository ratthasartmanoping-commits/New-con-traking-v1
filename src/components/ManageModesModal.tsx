import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Check, Trash2, ShieldAlert, Sparkles, Smartphone, Globe, Lock } from 'lucide-react';
import { BrickMode, BlockedItem } from '../types/brick';
import { sounds } from '../utils/audio';

interface ManageModesModalProps {
  isOpen: boolean;
  onClose: () => void;
  modes: BrickMode[];
  activeModeId: string;
  onSelectMode: (modeId: string) => void;
  onUpdateModes: (updatedModes: BrickMode[]) => void;
  soundEnabled: boolean;
}

export const ManageModesModal: React.FC<ManageModesModalProps> = ({
  isOpen,
  onClose,
  modes,
  activeModeId,
  onSelectMode,
  onUpdateModes,
  soundEnabled,
}) => {
  const [selectedEditModeId, setSelectedEditModeId] = useState<string>(activeModeId);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newModeName, setNewModeName] = useState('');
  const [newModeDesc, setNewModeDesc] = useState('');
  const [newBlockedName, setNewBlockedName] = useState('');
  const [newBlockedType, setNewBlockedType] = useState<'app' | 'website'>('app');

  const currentMode = modes.find((m) => m.id === selectedEditModeId) || modes[0];

  const handleToggleItem = (itemId: string) => {
    if (soundEnabled) sounds.playClick();
    const updated = modes.map((m) => {
      if (m.id !== currentMode.id) return m;
      const updatedItems = m.blockedItems.map((item) =>
        item.id === itemId ? { ...item, blocked: !item.blocked } : item
      );
      const apps = updatedItems.filter((i) => i.type === 'app' && i.blocked).length;
      const webs = updatedItems.filter((i) => i.type === 'website' && i.blocked).length;
      return {
        ...m,
        blockedItems: updatedItems,
        appsCount: apps,
        websitesCount: webs,
      };
    });
    onUpdateModes(updated);
  };

  const handleAddBlockedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedName.trim()) return;
    if (soundEnabled) sounds.playClick();

    const newItem: BlockedItem = {
      id: `custom-${Date.now()}`,
      name: newBlockedName.trim(),
      category: 'other',
      icon: newBlockedType === 'app' ? 'smartphone' : 'globe',
      type: newBlockedType,
      blocked: true,
    };

    const updated = modes.map((m) => {
      if (m.id !== currentMode.id) return m;
      const updatedItems = [...m.blockedItems, newItem];
      const apps = updatedItems.filter((i) => i.type === 'app' && i.blocked).length;
      const webs = updatedItems.filter((i) => i.type === 'website' && i.blocked).length;
      return {
        ...m,
        blockedItems: updatedItems,
        appsCount: apps,
        websitesCount: webs,
      };
    });

    onUpdateModes(updated);
    setNewBlockedName('');
  };

  const handleCreateNewMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModeName.trim()) return;
    if (soundEnabled) sounds.playClick();

    const newMode: BrickMode = {
      id: `custom-mode-${Date.now()}`,
      name: newModeName.trim(),
      description: newModeDesc.trim() || 'Custom detox preset',
      iconName: 'Sparkles',
      appsCount: 3,
      websitesCount: 2,
      strictMode: false,
      isCustom: true,
      blockedItems: [
        { id: `c-1-${Date.now()}`, name: 'Instagram', category: 'social', icon: 'camera', type: 'app', blocked: true },
        { id: `c-2-${Date.now()}`, name: 'TikTok', category: 'social', icon: 'video', type: 'app', blocked: true },
        { id: `c-3-${Date.now()}`, name: 'Mobile Games', category: 'entertainment', icon: 'gamepad', type: 'app', blocked: true },
        { id: `c-4-${Date.now()}`, name: 'reddit.com', category: 'social', icon: 'globe', type: 'website', blocked: true },
        { id: `c-5-${Date.now()}`, name: 'news.com', category: 'news', icon: 'globe', type: 'website', blocked: true },
      ],
    };

    const updated = [...modes, newMode];
    onUpdateModes(updated);
    setSelectedEditModeId(newMode.id);
    setIsCreatingNew(false);
    setNewModeName('');
    setNewModeDesc('');
  };

  const handleDeleteMode = (modeId: string) => {
    if (modes.length <= 1) return;
    if (soundEnabled) sounds.playClick();
    const updated = modes.filter((m) => m.id !== modeId);
    onUpdateModes(updated);
    if (selectedEditModeId === modeId) {
      setSelectedEditModeId(updated[0].id);
    }
    if (activeModeId === modeId) {
      onSelectMode(updated[0].id);
    }
  };

  const handleToggleStrictMode = () => {
    if (soundEnabled) sounds.playClick();
    const updated = modes.map((m) =>
      m.id === currentMode.id ? { ...m, strictMode: !m.strictMode } : m
    );
    onUpdateModes(updated);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Drawer Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[88dvh] bg-[#FAF9F5] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col z-10 overflow-hidden border border-[#EBE7DF]"
        >
          {/* Grab Handle */}
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-10 h-1.5 bg-[#D8D4CA] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-[#ECE7DD]">
            <div>
              <h3 className="text-lg font-bold text-[#1E1D1B] tracking-tight">
                Manage Modes
              </h3>
              <p className="text-xs text-[#7B776E]">
                Customize apps and websites blocked in each state
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#55524B] hover:text-[#1E1D1B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="overflow-y-auto px-6 py-4 space-y-5">
            {/* Mode Selector Horizontal Carousel */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
                  Select Preset Mode
                </span>
                <button
                  onClick={() => setIsCreatingNew(!isCreatingNew)}
                  className="text-xs font-semibold text-[#1F1E1D] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Mode</span>
                </button>
              </div>

              {/* Create new mode inline panel */}
              {isCreatingNew && (
                <form
                  onSubmit={handleCreateNewMode}
                  className="mb-3 p-3.5 rounded-2xl bg-[#ECE7DC] border border-[#DDD8CD] space-y-2.5"
                >
                  <div className="text-xs font-bold text-[#2A2926]">Create Custom Mode</div>
                  <input
                    type="text"
                    placeholder="Mode Name (e.g. Reading Time, Family Meal)"
                    value={newModeName}
                    onChange={(e) => setNewModeName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#D5D0C4] text-[#1E1D1B] focus:outline-none focus:ring-1 focus:ring-[#8C887F]"
                  />
                  <input
                    type="text"
                    placeholder="Short description"
                    value={newModeDesc}
                    onChange={(e) => setNewModeDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-[#D5D0C4] text-[#1E1D1B] focus:outline-none focus:ring-1 focus:ring-[#8C887F]"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#67635C] bg-[#DDD8CD]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1F1E1D]"
                    >
                      Save Preset
                    </button>
                  </div>
                </form>
              )}

              {/* Mode list buttons */}
              <div className="grid grid-cols-2 gap-2">
                {modes.map((mode) => {
                  const isCurrentActive = activeModeId === mode.id;
                  const isCurrentlyEditing = selectedEditModeId === mode.id;

                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        if (soundEnabled) sounds.playClick();
                        setSelectedEditModeId(mode.id);
                      }}
                      className={`relative p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                        isCurrentlyEditing
                          ? 'bg-[#FFFFFF] border-[#1F1E1D] shadow-sm'
                          : 'bg-[#F0EDE5] border-transparent hover:bg-[#EAE6DD]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-bold text-[#1E1D1B] tracking-tight">
                          {mode.name}
                        </span>
                        {isCurrentActive && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1F1E1D] text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7A766D] mt-1 line-clamp-1">
                        {mode.appsCount} apps · {mode.websitesCount} sites
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Set as Active Mode CTA */}
            {activeModeId !== currentMode.id && (
              <button
                onClick={() => {
                  if (soundEnabled) sounds.playClick();
                  onSelectMode(currentMode.id);
                }}
                className="w-full py-2.5 rounded-xl bg-[#1F1E1D] text-white text-xs font-semibold tracking-wide hover:bg-[#33312D] transition-colors"
              >
                Apply "{currentMode.name}" as Current Mode
              </button>
            )}

            {/* Mode configuration section */}
            <div className="p-4 rounded-2xl bg-[#F2EFE8] border border-[#E3DFC] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#1F1E1D]">
                    {currentMode.name} Settings
                  </h4>
                  <p className="text-xs text-[#7B776E]">{currentMode.description}</p>
                </div>

                {currentMode.isCustom && (
                  <button
                    onClick={() => handleDeleteMode(currentMode.id)}
                    className="p-1.5 text-[#A34545] hover:bg-[#EAE5DC] rounded-lg transition-colors"
                    title="Delete Mode"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Strict Mode Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD3]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#66625A]" />
                  <div>
                    <div className="text-xs font-semibold text-[#1F1E1D]">Strict Mode</div>
                    <div className="text-[11px] text-[#7E7A71]">
                      Requires mindful breathing to unbrick
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleStrictMode}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    currentMode.strictMode ? 'bg-[#1F1E1D]' : 'bg-[#D1CCC2]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      currentMode.strictMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Blocked Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8C887F] uppercase tracking-wider">
                  Blocked Apps & Websites ({currentMode.blockedItems.filter((i) => i.blocked).length})
                </span>
              </div>

              <div className="space-y-1.5">
                {currentMode.blockedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE6DD] hover:border-[#D5D0C6] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#F0EDE6] flex items-center justify-center text-[#55524B]">
                        {item.type === 'app' ? (
                          <Smartphone className="w-3.5 h-3.5" />
                        ) : (
                          <Globe className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#1E1D1B]">{item.name}</div>
                        <div className="text-[10px] text-[#8C887F] capitalize">
                          {item.type} · {item.category}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        item.blocked
                          ? 'bg-[#1F1E1D] text-white'
                          : 'border border-[#D1CCC2] bg-white'
                      }`}
                    >
                      {item.blocked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom App/Website to this mode */}
              <form onSubmit={handleAddBlockedItem} className="mt-3 flex gap-2">
                <div className="flex rounded-xl bg-[#EBE7DF] p-0.5">
                  <button
                    type="button"
                    onClick={() => setNewBlockedType('app')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                      newBlockedType === 'app'
                        ? 'bg-white text-[#1F1E1D] shadow-xs'
                        : 'text-[#6D6962]'
                    }`}
                  >
                    App
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBlockedType('website')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                      newBlockedType === 'website'
                        ? 'bg-white text-[#1F1E1D] shadow-xs'
                        : 'text-[#6D6962]'
                    }`}
                  >
                    URL
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={newBlockedType === 'app' ? 'e.g. Threads, BeReal' : 'e.g. youtube.com'}
                  value={newBlockedName}
                  onChange={(e) => setNewBlockedName(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-[#D5D0C6] text-[#1E1D1B] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#E2DDD3] hover:bg-[#D5D0C5] text-[#1E1D1B] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
          </div>

          {/* Footer Done */}
          <div className="p-4 border-t border-[#ECE7DD] bg-[#FAF9F5]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#1F1E1D] hover:bg-[#33312D] text-white text-sm font-semibold tracking-tight transition-colors shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
