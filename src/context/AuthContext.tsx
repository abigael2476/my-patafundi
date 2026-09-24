import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { CURRENT_USER, DEMO_FUNDI_USER, DEMO_OWNER_USER } from '../data/mockData';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    pass: string,
    role?: UserRole,
    fundiData?: {
      category?: string;
      categoryId?: string;
      experienceYears?: number;
      hourlyRate?: number;
      estimatedPrice?: number;
      nationalId?: string;
      locationName?: string;
      bio?: string;
      skills?: string[];
    }
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, pass: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await ApiService.loginUser(email, pass);
      if (res && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (e: any) {
      if (e.message?.includes('Network') || e.message?.includes('Failed to fetch')) {
        if (email.includes('fundi') || role === 'fundi') {
          setUser(DEMO_FUNDI_USER);
        } else {
          setUser({
            ...CURRENT_USER,
            email: email || CURRENT_USER.email,
            role: role || 'client',
          });
        }
        setIsAuthenticated(true);
        return true;
      }
      throw e;
    }
    return false;
  };

  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    pass: string,
    role: UserRole = 'client',
    fundiData?: {
      category?: string;
      categoryId?: string;
      experienceYears?: number;
      hourlyRate?: number;
      estimatedPrice?: number;
      nationalId?: string;
      locationName?: string;
      bio?: string;
      skills?: string[];
    }
  ): Promise<boolean> => {
    try {
      const res = await ApiService.registerUser({
        name: fullName,
        email,
        phone,
        password: pass,
        role,
        ...fundiData,
      });

      if (res && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (e: any) {
      if (e.message?.includes('Network') || e.message?.includes('Failed to fetch')) {
        const cleanName = fullName || 'New User';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=081E45&color=FF7A00&bold=true`;

        setUser({
          id: 'u_' + Date.now(),
          name: cleanName,
          email: email || 'user@patafundi.com',
          phone: phone || '+254 700 000 000',
          avatar: avatarUrl,
          address: 'Nairobi, Kenya',
          role: role,
          fundiId: role === 'fundi' ? 'f_' + Date.now().toString().slice(-6) : undefined,
        });

        setIsAuthenticated(true);
        return true;
      }
      throw e;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    if (newRole === 'client') {
      setUser({ ...CURRENT_USER, role: 'client' });
    } else if (newRole === 'fundi') {
      setUser({ ...DEMO_FUNDI_USER });
    } else if (newRole === 'owner') {
      setUser({ ...DEMO_OWNER_USER });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
