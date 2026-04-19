import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserState } from '../types';
import { mockAuth, mockFirestore } from '../lib/mockFirebase';

interface UserContextType {
  user: UserState | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<UserState>) => Promise<void>;
  toggleFavorite: (toolId: string) => Promise<void>;
  addToRecent: (toolId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (mockAuth.isAuthenticated()) {
      const userData = await mockFirestore.getUser('user_123');
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async () => {
    setLoading(true);
    await mockAuth.login('email');
    await refreshUser();
  };

  const logout = async () => {
    await mockAuth.logout();
    setUser(null);
  };

  const updateUser = async (partial: Partial<UserState>) => {
    if (!user) return;
    const updated = await mockFirestore.updateUser(user.userId, partial);
    setUser(updated);
  };

  const toggleFavorite = async (toolId: string) => {
    if (!user) return;
    const updated = await mockFirestore.addToFavorites(user.userId, toolId);
    setUser(updated);
  };

  const addToRecent = async (toolId: string) => {
    if (!user) return;
    const updated = await mockFirestore.addToRecent(user.userId, toolId);
    setUser(updated);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser, toggleFavorite, addToRecent, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};