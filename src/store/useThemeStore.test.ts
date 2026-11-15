import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

class LocalStorageMock {
  store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

const mockLocalStorage = new LocalStorageMock();

const classListSet = new Set<string>();
const mockDocument = {
  documentElement: {
    classList: {
      add: (c: string) => classListSet.add(c),
      remove: (c: string) => classListSet.delete(c),
      contains: (c: string) => classListSet.has(c),
    },
    style: {
      colorScheme: '',
      setProperty: vi.fn(),
    },
  },
};

describe('useThemeStore (Color Modes & Dynamic Appearance)', () => {
  let useThemeStore: typeof import('./useThemeStore').useThemeStore;
  let resolveIsDark: typeof import('./useThemeStore').resolveIsDark;
  let settingsService: typeof import('../services/settingsService').settingsService;

  beforeAll(async () => {
    (globalThis as any).localStorage = mockLocalStorage;
    (globalThis as any).document = mockDocument;
    (globalThis as any).window = {
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    };

    const themeModule = await import('./useThemeStore');
    useThemeStore = themeModule.useThemeStore;
    resolveIsDark = themeModule.resolveIsDark;
    const settingsModule = await import('../services/settingsService');
    settingsService = settingsModule.settingsService;
  });

  beforeEach(() => {
    mockLocalStorage.clear();
    classListSet.clear();
    useThemeStore.getState().resetTheme();
  });

  it('initializes with default system mode and navy_yellow preset', () => {
    const state = useThemeStore.getState();
    expect(state.preset).toBe('navy_yellow');
    expect(state.colorMode).toBe('system');
  });

  it('correctly switches to dark mode and applies dark class to DOM', () => {
    useThemeStore.getState().setColorMode('dark');
    const state = useThemeStore.getState();

    expect(state.colorMode).toBe('dark');
    expect(state.resolvedMode).toBe('dark');
    expect(classListSet.has('dark')).toBe(true);
    expect(classListSet.has('light')).toBe(false);

    // Verify persistence
    const saved = settingsService.getSettings();
    expect(saved.color_mode).toBe('dark');
    expect(mockLocalStorage.getItem('hs_color_mode')).toBe('dark');
  });

  it('correctly switches to light mode and removes dark class from DOM', () => {
    useThemeStore.getState().setColorMode('dark');
    expect(classListSet.has('dark')).toBe(true);

    useThemeStore.getState().setColorMode('light');
    const state = useThemeStore.getState();

    expect(state.colorMode).toBe('light');
    expect(state.resolvedMode).toBe('light');
    expect(classListSet.has('dark')).toBe(false);
    expect(classListSet.has('light')).toBe(true);

    const saved = settingsService.getSettings();
    expect(saved.color_mode).toBe('light');
  });

  it('cycles through color modes: light -> dark -> system -> light', () => {
    useThemeStore.getState().setColorMode('light');
    expect(useThemeStore.getState().colorMode).toBe('light');

    const mode1 = useThemeStore.getState().cycleColorMode();
    expect(mode1).toBe('dark');
    expect(useThemeStore.getState().colorMode).toBe('dark');

    const mode2 = useThemeStore.getState().cycleColorMode();
    expect(mode2).toBe('system');
    expect(useThemeStore.getState().colorMode).toBe('system');

    const mode3 = useThemeStore.getState().cycleColorMode();
    expect(mode3).toBe('light');
    expect(useThemeStore.getState().colorMode).toBe('light');
  });

  it('resolves dark mode correctly according to mode and media query', () => {
    expect(resolveIsDark('dark')).toBe(true);
    expect(resolveIsDark('light')).toBe(false);

    (globalThis as any).window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    expect(resolveIsDark('system')).toBe(true);
  });

  it('resets theme to system mode and navy yellow default', () => {
    useThemeStore.getState().setColorMode('dark');
    useThemeStore.getState().setPreset('classic_maroon');

    expect(useThemeStore.getState().preset).toBe('classic_maroon');
    expect(useThemeStore.getState().colorMode).toBe('dark');

    useThemeStore.getState().resetTheme();

    const state = useThemeStore.getState();
    expect(state.preset).toBe('navy_yellow');
    expect(state.colorMode).toBe('system');
    expect(settingsService.getSettings().color_mode).toBe('system');
  });
});
