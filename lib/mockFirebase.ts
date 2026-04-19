import { UserState, Tool } from '../types';
import { TOOLS } from '../data/tools';

const STORAGE_KEY = 'devtools_user_v1';
const AUTH_KEY = 'devtools_auth_v1';

const INITIAL_STATE: UserState = {
  userId: 'user_123',
  favorites: [],
  recentlyUsed: [],
  suggestedWorksets: [],
  devToolbox: {
    isEnabled: false,
    layout: []
  },
  worksets: [
    { id: 'ws-default', name: 'General', tools: ['json-formatter'] }
  ],
  customization: {
    theme: 'dark',
    layout: 'grid',
    clipboardMonitoring: false
  },
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const mockAuth = {
  login: async (method: 'google' | 'email') => {
    return new Promise<{ uid: string }>((resolve) => {
      setTimeout(() => {
        localStorage.setItem(AUTH_KEY, 'true');
        resolve({ uid: 'user_123' });
      }, 800);
    });
  },
  logout: async () => {
    return new Promise<void>((resolve) => {
      localStorage.removeItem(AUTH_KEY);
      resolve();
    });
  },
  isAuthenticated: () => !!localStorage.getItem(AUTH_KEY)
};

export const mockFirestore = {
  getUser: async (uid: string): Promise<UserState> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    
    // Create new if not exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    return INITIAL_STATE;
  },
  
  updateUser: async (uid: string, partial: Partial<UserState>) => {
    const current = await mockFirestore.getUser(uid);
    const updated = { ...current, ...partial, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Helper for array updates
  addToFavorites: async (uid: string, toolId: string) => {
    const user = await mockFirestore.getUser(uid);
    let favs = user.favorites;
    if (favs.includes(toolId)) {
      favs = favs.filter(id => id !== toolId);
    } else {
      favs = [...favs, toolId];
    }
    return mockFirestore.updateUser(uid, { favorites: favs });
  },

  addToRecent: async (uid: string, toolId: string) => {
    const user = await mockFirestore.getUser(uid);
    let recent = user.recentlyUsed.filter(id => id !== toolId);
    recent.unshift(toolId);
    if (recent.length > 10) recent.pop();
    return mockFirestore.updateUser(uid, { recentlyUsed: recent });
  }
};