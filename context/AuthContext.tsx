import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TeamMember } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: TeamMember | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
        const storedUser = sessionStorage.getItem('taskflow_user');
        if (storedUser) {
          // Verify user still exists in DB
          const members = await api.getMembers();
          const parsed = JSON.parse(storedUser);
          const freshUser = members.find(m => m.id === parsed.id);
          if (freshUser) {
              setUser(freshUser);
          } else {
              sessionStorage.removeItem('taskflow_user');
          }
        }
        setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
        const members = await api.getMembers();
        const foundUser = members.find(m => m.email === email);
        
        if (foundUser && foundUser.password === pass) {
            setUser(foundUser);
            sessionStorage.setItem('taskflow_user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    } catch (e) {
        console.error("Login failed", e);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};