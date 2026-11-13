import { create } from 'zustand';
import { settingsService } from '../services/settingsService';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  nav: string;
  surface: string;
}

export type ThemePreset =
  | 'navy_yellow'
  | 'royal_blue'
  | 'deep_ocean'
  | 'midnight'
  | 'classic_maroon'
  | 'custom';

export interface PresetInfo {
  name: string;
  description: string;
  colors: ThemeColors;
}

export const THEME_PRESETS: Record<ThemePreset, PresetInfo> = {
  navy_yellow: {
    name: 'Navy Blue & Yellow (Default)',
    description: 'Executive navy blue with bullion yellow accents and dark navy navigation',
    colors: {
      primary: '#0f2744',
      primaryDark: '#0a192f',
      primaryLight: '#1e3a5f',
      accent: '#ffd700',
      accentDark: '#eab308',
      nav: '#0a192f',
      surface: '#f0f4f9',
    },
  },
  royal_blue: {
    name: 'Royal Navy & Canary Yellow',
    description: 'Vibrant modern royal navy paired with sharp high-contrast yellow',
    colors: {
      primary: '#1e3a8a',
      primaryDark: '#172554',
      primaryLight: '#2563eb',
      accent: '#facc15',
      accentDark: '#ca8a04',
      nav: '#172554',
      surface: '#f8fafc',
    },
  },
  deep_ocean: {
    name: 'Deep Ocean & Amber Gold',
    description: 'Aquatic deep ocean sapphire paired with warm amber gold highlights',
    colors: {
      primary: '#0c4a6e',
      primaryDark: '#082f49',
      primaryLight: '#0284c7',
      accent: '#fbbf24',
      accentDark: '#d97706',
      nav: '#082f49',
      surface: '#f0f9ff',
    },
  },
  midnight: {
    name: 'Midnight Navy & High-Vis Yellow',
    description: 'High contrast ultra-dark navy body with bright neon yellow highlights',
    colors: {
      primary: '#111827',
      primaryDark: '#030712',
      primaryLight: '#1f2937',
      accent: '#eab308',
      accentDark: '#a16207',
      nav: '#030712',
      surface: '#f9fafb',
    },
  },
  classic_maroon: {
    name: 'Classic Maroon & Gold (Legacy)',
    description: 'Original bullion trade burgundy red & gold bullion',
    colors: {
      primary: '#8d2c24',
      primaryDark: '#6e211b',
      primaryLight: '#b91c1c',
      accent: '#ffd700',
      accentDark: '#d4af37',
      nav: '#302929',
      surface: '#f4f6f9',
    },
  },
  custom: {
    name: 'Custom Palette',
    description: 'Fully custom user-selected hex colors for your shop brand',
    colors: {
      primary: '#0f2744',
      primaryDark: '#0a192f',
      primaryLight: '#1e3a5f',
      accent: '#ffd700',
      accentDark: '#eab308',
      nav: '#0a192f',
      surface: '#f0f4f9',
    },
  },
};

export function hexToRgb(hex: string): string {
  let clean = (hex || '').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return '15, 39, 68';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

export function applyThemeToDOM(colors: ThemeColors) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--brand-primary', colors.primary);
  root.style.setProperty('--brand-primary-rgb', hexToRgb(colors.primary));
  root.style.setProperty('--brand-primary-dark', colors.primaryDark);
  root.style.setProperty('--brand-primary-dark-rgb', hexToRgb(colors.primaryDark));
  root.style.setProperty('--brand-primary-light', colors.primaryLight);
  root.style.setProperty('--brand-primary-light-rgb', hexToRgb(colors.primaryLight));

  root.style.setProperty('--brand-secondary', colors.accent);
  root.style.setProperty('--brand-secondary-rgb', hexToRgb(colors.accent));
  root.style.setProperty('--brand-secondary-dark', colors.accentDark);
  root.style.setProperty('--brand-secondary-dark-rgb', hexToRgb(colors.accentDark));

  root.style.setProperty('--brand-nav', colors.nav);
  root.style.setProperty('--brand-nav-rgb', hexToRgb(colors.nav));

  root.style.setProperty('--brand-surface', colors.surface);
}

interface ThemeState {
  preset: ThemePreset;
  colors: ThemeColors;
  setPreset: (preset: ThemePreset) => void;
  setColor: <K extends keyof ThemeColors>(key: K, value: string) => void;
  setColors: (colors: Partial<ThemeColors>) => void;
  saveTheme: () => void;
  resetTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  preset: 'navy_yellow',
  colors: THEME_PRESETS.navy_yellow.colors,

  initTheme: () => {
    try {
      const settings = settingsService.getSettings();
      const preset = settings.theme_preset || 'navy_yellow';
      const colors: ThemeColors = {
        primary: settings.primary_color || THEME_PRESETS[preset]?.colors.primary || '#0f2744',
        primaryDark: settings.primary_dark || THEME_PRESETS[preset]?.colors.primaryDark || '#0a192f',
        primaryLight: settings.primary_light || THEME_PRESETS[preset]?.colors.primaryLight || '#1e3a5f',
        accent: settings.accent_color || THEME_PRESETS[preset]?.colors.accent || '#ffd700',
        accentDark: settings.accent_dark || THEME_PRESETS[preset]?.colors.accentDark || '#eab308',
        nav: settings.nav_color || THEME_PRESETS[preset]?.colors.nav || '#0a192f',
        surface: settings.surface_color || THEME_PRESETS[preset]?.colors.surface || '#f0f4f9',
      };
      set({ preset, colors });
      applyThemeToDOM(colors);
    } catch {
      applyThemeToDOM(THEME_PRESETS.navy_yellow.colors);
    }
  },

  setPreset: (preset: ThemePreset) => {
    const presetColors = THEME_PRESETS[preset].colors;
    set({ preset, colors: { ...presetColors } });
    applyThemeToDOM(presetColors);

    // Persist to extra settings immediately
    settingsService.updatePartial({
      theme_preset: preset,
      primary_color: presetColors.primary,
      primary_dark: presetColors.primaryDark,
      primary_light: presetColors.primaryLight,
      accent_color: presetColors.accent,
      accent_dark: presetColors.accentDark,
      nav_color: presetColors.nav,
      surface_color: presetColors.surface,
    });
  },

  setColor: (key, value) => {
    const current = get().colors;
    const updated = { ...current, [key]: value };
    set({ preset: 'custom', colors: updated });
    applyThemeToDOM(updated);

    // Persist
    settingsService.updatePartial({
      theme_preset: 'custom',
      primary_color: updated.primary,
      primary_dark: updated.primaryDark,
      primary_light: updated.primaryLight,
      accent_color: updated.accent,
      accent_dark: updated.accentDark,
      nav_color: updated.nav,
      surface_color: updated.surface,
    });
  },

  setColors: (partialColors) => {
    const current = get().colors;
    const updated = { ...current, ...partialColors };
    set({ preset: 'custom', colors: updated });
    applyThemeToDOM(updated);

    settingsService.updatePartial({
      theme_preset: 'custom',
      primary_color: updated.primary,
      primary_dark: updated.primaryDark,
      primary_light: updated.primaryLight,
      accent_color: updated.accent,
      accent_dark: updated.accentDark,
      nav_color: updated.nav,
      surface_color: updated.surface,
    });
  },

  saveTheme: () => {
    const { preset, colors } = get();
    settingsService.updatePartial({
      theme_preset: preset,
      primary_color: colors.primary,
      primary_dark: colors.primaryDark,
      primary_light: colors.primaryLight,
      accent_color: colors.accent,
      accent_dark: colors.accentDark,
      nav_color: colors.nav,
      surface_color: colors.surface,
    });
    applyThemeToDOM(colors);
  },

  resetTheme: () => {
    const defaultColors = THEME_PRESETS.navy_yellow.colors;
    set({ preset: 'navy_yellow', colors: defaultColors });
    applyThemeToDOM(defaultColors);
    settingsService.updatePartial({
      theme_preset: 'navy_yellow',
      primary_color: defaultColors.primary,
      primary_dark: defaultColors.primaryDark,
      primary_light: defaultColors.primaryLight,
      accent_color: defaultColors.accent,
      accent_dark: defaultColors.accentDark,
      nav_color: defaultColors.nav,
      surface_color: defaultColors.surface,
    });
  },
}));

// Apply immediately on load
if (typeof window !== 'undefined') {
  useThemeStore.getState().initTheme();
}
