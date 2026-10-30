import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../constants';
import { 
  loadStoredSession, 
  saveStoredSession, 
  DATA_CHANGE_EVENT 
} from '../services/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, customDetails?: Partial<UserProfile>) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isStudent: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to validate IITR institutional email format
export function isValidIITREmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  // Accepts name@iitr.ac.in, name@dept.iitr.ac.in, etc.
  const iitrRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?iitr\.ac\.in$/i;
  return iitrRegex.test(trimmed);
}

// Derive a clean full name from email prefix (e.g. 'priya.sharma' -> 'Priya Sharma')
function formatNameFromEmail(email: string): string {
  const prefix = email.split('@')[0] || 'IITR Resident';
  const parts = prefix.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return 'IITR Member';
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored session if exists, otherwise null (unauthenticated by default for real portal feel)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadStoredSession());

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = loadStoredSession();
      setCurrentUser(stored);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(DATA_CHANGE_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(DATA_CHANGE_EVENT, handleStorageChange);
    };
  }, []);

  const login = (
    email: string, 
    role: UserRole, 
    customDetails?: Partial<UserProfile>
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your official IIT Roorkee email address.' };
    }

    if (!isValidIITREmail(cleanEmail)) {
      return { 
        success: false, 
        error: 'Access restricted: Please use an authorized IIT Roorkee institutional email (e.g. yourname@iitr.ac.in or student@dept.iitr.ac.in).' 
      };
    }

    // Check if matches known demo records for automatic rich profile hydration
    let profile: UserProfile;

    if (role === 'student' && cleanEmail === DEMO_USERS.student.email.toLowerCase()) {
      profile = { ...DEMO_USERS.student };
    } else if (role === 'staff' && cleanEmail === DEMO_USERS.staff.email.toLowerCase()) {
      profile = { ...DEMO_USERS.staff };
    } else if (role === 'admin' && cleanEmail === DEMO_USERS.admin.email.toLowerCase()) {
      profile = { ...DEMO_USERS.admin };
    } else {
      // Dynamic profile construction for custom IITR email
      const generatedName = customDetails?.name?.trim() || formatNameFromEmail(cleanEmail);
      profile = {
        id: `user_${role}_${Date.now()}`,
        name: generatedName,
        role: role,
        email: cleanEmail,
        phone: customDetails?.phone || '+91 98765 00000',
        hostel: role === 'student' ? (customDetails?.hostel || 'Rajendra Bhawan') : undefined,
        room: role === 'student' ? (customDetails?.room || 'R-101') : undefined,
        enrollmentNo: role === 'student' ? (customDetails?.enrollmentNo || '23115000') : undefined,
        department: role !== 'student' 
          ? (customDetails?.department || (role === 'staff' ? 'Estate & Works Maintenance' : 'Council of Wardens')) 
          : 'Department of Architecture and Planning',
        ...customDetails
      };
    }

    setCurrentUser(profile);
    saveStoredSession(profile);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    saveStoredSession(null);
  };

  const switchRole = (role: UserRole) => {
    // If user wants to switch role directly using presets:
    const preset = DEMO_USERS[role] || DEMO_USERS.student;
    setCurrentUser(preset);
    saveStoredSession(preset);
  };

  const currentRole = currentUser ? currentUser.role : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser,
        login,
        logout,
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
