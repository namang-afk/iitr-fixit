import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../constants';
import { loadStoredRole, saveStoredRole, DATA_CHANGE_EVENT } from '../services/storage';

interface AuthContextType {
  currentRole: UserRole;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  isStudent: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadStoredRole());

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = loadStoredRole();
      if (stored !== currentRole) {
        setCurrentRole(stored);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(DATA_CHANGE_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(DATA_CHANGE_EVENT, handleStorageChange);
    };
  }, [currentRole]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    saveStoredRole(role);
  };

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.student;

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        isStudent: currentRole === 'student',
        isStaff: currentRole === 'staff',
        isAdmin: currentRole === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
