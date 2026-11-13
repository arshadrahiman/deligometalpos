import React from 'react';
import { useThemeStore, THEME_PRESETS, ThemePreset, ThemeColors } from '../../store/useThemeStore';
import { useUIStore } from '../../store/useUIStore';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Save,
  Layers,
  Eye,
  Sliders,
} from 'lucide-react';

interface ThemeConfigSectionProps {
  onSave?: () => void;
}

export const ThemeConfigSection: React.FC<ThemeConfigSectionProps> = ({ onSave }) => {
  const { preset, colors, setPreset, setColor, resetTheme, saveTheme } = useThemeStore();
  const { showToast } = useUIStore();

  const handlePresetSelect = (key: ThemePreset) => {
    setPreset(key);
    showToast(`Switched to "${THEME_PRESETS[key].name}"!`, 'success');
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColor(key, value);
  };

  const handleSaveTheme = () => {
    saveTheme();
    showToast('Theme colors saved and applied across the entire ERP!', 'success');
    if (onSave) onSave();
  };

  const handleReset = () => {
    resetTheme();
    showToast('Theme reset to Navy Blue & Yellow default', 'info');
  };

  return (
    <div className="space-y-6">
      {/* 1. Overview Banner */}
      <div className="rounded-xl p-4 border border-brand-primary/20 bg-brand-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-brand-primary text-brand-secondary flex items-center justify-center shrink-0 shadow-sm">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">
              THEME & COLOR CONFIGURATION (थीम एवं रंग)
            </h3>
            <p className="text-xs text-slate-500">
              Switch color presets or customize exact primary Navy Blue and Yellow tones with live real-time sync
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>
          <button
            type="button"
            onClick={handleSaveTheme}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-primary text-brand-secondary text-xs font-bold rounded-lg hover:bg-brand-primary-dark transition-colors shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {/* 2. Theme Presets Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-brand-primary" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Pre-tuned Color Presets (तैयार कलर थीम्स)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
            const info = THEME_PRESETS[key];
            const isSelected = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetSelect(key)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-primary bg-white shadow-md ring-2 ring-brand-primary/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Active check pill */}
                {isSelected && (
                  <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center text-xs shadow-xs">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-xs text-slate-900">{info.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {info.description}
                  </p>
                </div>

                {/* Swatch Strip */}
                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-100">
                  <span
                    className="h-5 w-7 rounded-md shadow-xs border border-black/10"
                    style={{ backgroundColor: info.colors.primary }}
                    title={`Primary: ${info.colors.primary}`}
                  />
                  <span
                    className="h-5 w-7 rounded-md shadow-xs border border-black/10"
                    style={{ backgroundColor: info.colors.primaryDark }}
                    title={`Primary Dark: ${info.colors.primaryDark}`}
                  />
                  <span
                    className="h-5 w-7 rounded-md shadow-xs border border-black/10"
                    style={{ backgroundColor: info.colors.accent }}
                    title={`Accent: ${info.colors.accent}`}
                  />
                  <span
                    className="h-5 w-7 rounded-md shadow-xs border border-black/10"
                    style={{ backgroundColor: info.colors.nav }}
                    title={`Navbar: ${info.colors.nav}`}
                  />
                  <span
                    className="h-5 w-7 rounded-md shadow-xs border border-black/10"
                    style={{ backgroundColor: info.colors.surface }}
                    title={`Surface: ${info.colors.surface}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Custom Color Pickers */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-brand-primary" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Dynamic Color Palette Controls (कस्टम रंग सम्पादक)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Navy */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Primary Brand Color (Navy Blue)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#0f2744"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Buttons, Active Tabs & Headings</span>
          </div>

          {/* Primary Dark */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Primary Dark (Deep Navy)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.primaryDark}
                onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.primaryDark}
                onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                placeholder="#0a192f"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Hover states & Dark borders</span>
          </div>

          {/* Primary Light */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Primary Light (Navy Tint)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.primaryLight}
                onChange={(e) => handleColorChange('primaryLight', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.primaryLight}
                onChange={(e) => handleColorChange('primaryLight', e.target.value)}
                placeholder="#1e3a5f"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Secondary badges & gradients</span>
          </div>

          {/* Secondary Yellow */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Secondary / Accent Color (Yellow)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="#ffd700"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Stock pill, Gold highlights, Logos</span>
          </div>

          {/* Secondary Dark */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Accent Hover (Deep Yellow)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.accentDark}
                onChange={(e) => handleColorChange('accentDark', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.accentDark}
                onChange={(e) => handleColorChange('accentDark', e.target.value)}
                placeholder="#eab308"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Accent hover & active borders</span>
          </div>

          {/* Navigation Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Top Navigation Bar (Header)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.nav}
                onChange={(e) => handleColorChange('nav', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.nav}
                onChange={(e) => handleColorChange('nav', e.target.value)}
                placeholder="#0a192f"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Sticky Navbar & Modal Headers</span>
          </div>

          {/* Surface */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Surface Background (पृष्ठभूमि)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors.surface}
                onChange={(e) => handleColorChange('surface', e.target.value)}
                className="h-9 w-12 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
              />
              <input
                type="text"
                value={colors.surface}
                onChange={(e) => handleColorChange('surface', e.target.value)}
                placeholder="#f0f4f9"
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 uppercase"
              />
            </div>
            <span className="text-[10px] text-slate-400">Application background canvas</span>
          </div>
        </div>
      </div>

      {/* 4. Live Interactive UI Component Preview */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-brand-primary" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Live Interactive Theme Preview (लाइव प्रिव्यू)
          </h4>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-brand-surface space-y-4">
          {/* Mini Nav Preview */}
          <div className="bg-brand-nav text-white p-3 rounded-lg flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded bg-brand-primary text-brand-secondary flex items-center justify-center font-black text-xs shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-none">
                  Deligo Technologies ERP
                </span>
                <span className="text-[9px] text-slate-300">Live Navy Blue & Yellow Navigation</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-brand-secondary text-slate-900 font-extrabold text-[11px] shadow-xs">
                Stock (469.009 gm)
              </span>
              <span className="px-2 py-0.5 bg-brand-primary text-brand-secondary font-bold text-[10px] rounded border border-brand-secondary/40">
                Active
              </span>
            </div>
          </div>

          {/* Component Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Primary Action Button */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Button</span>
              <button
                type="button"
                className="w-full py-2 px-3 bg-brand-primary text-brand-secondary font-bold rounded-lg hover:bg-brand-primary-dark transition-colors shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Transaction</span>
              </button>
            </div>

            {/* Accent Yellow Button */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Accent Yellow Button</span>
              <button
                type="button"
                className="w-full py-2 px-3 bg-brand-secondary text-slate-900 font-extrabold rounded-lg hover:bg-brand-secondary-dark transition-colors shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bhavcut Conversion</span>
              </button>
            </div>

            {/* Badges & Tags */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status Indicators</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-brand-primary text-white rounded text-[10px] font-bold">
                  Navy Tag
                </span>
                <span className="px-2 py-0.5 bg-brand-secondary text-slate-900 rounded text-[10px] font-black">
                  Yellow Gold
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
