import { create } from 'zustand';
import { UserProfile } from '../types';
import { getItem, setItem, removeItem } from '../services/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'hs_auth_session';

const DEFAULT_ADMIN: UserProfile = {
  name: 'rohit hambire',
  shopName: 'Lakshmi Gold Testing',
  role: 'ADMINISTRATOR',
  mobile: '7879404501',
  subscriptionDaysRemaining: 7845,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getItem<UserProfile | null>(AUTH_STORAGE_KEY, DEFAULT_ADMIN),
  isAuthenticated: !!getItem<UserProfile | null>(AUTH_STORAGE_KEY, DEFAULT_ADMIN),

  login: async (mobile: string, password: string) => {
    // Support test account
    if (mobile === '7879404501' && password === '12345') {
      setItem(AUTH_STORAGE_KEY, DEFAULT_ADMIN);
      set({ user: DEFAULT_ADMIN, isAuthenticated: true });
      return { success: true, message: 'Login successful' };
    }
    // General test login
    if (mobile && password) {
      const user: UserProfile = {
        name: 'Authorized User',
        shopName: 'Lakshmi Gold Testing',
        role: 'ADMINISTRATOR',
        mobile,
        subscriptionDaysRemaining: 365,
      };
      setItem(AUTH_STORAGE_KEY, user);
      set({ user, isAuthenticated: true });
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid mobile number or password' };
  },

  logout: () => {
    removeItem(AUTH_STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));

