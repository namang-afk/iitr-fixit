import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { 
  AUTHORIZED_STAFF_CREDENTIALS, 
  AUTHORIZED_WARDEN_CREDENTIAL, 
  verifyStaffCredentials, 
  verifyWardenCredentials,
  StudentAccount
} from '../constants/authCredentials';
import { 
  loadStoredSession, 
  saveStoredSession, 
  registerStudentAccount,
  verifyStudentCredentials,
  DATA_CHANGE_EVENT 
} from '../services/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  signupStudent: (data: Omit<StudentAccount, 'id' | 'role' | 'createdAt'>) => { success: boolean; error?: string };
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with stored session if exists, otherwise null
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
    password: string, 
    role: UserRole
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your IIT Roorkee institutional email ID.' };
    }

    if (!cleanPassword) {
      return { success: false, error: 'Please enter your account password.' };
    }

    if (!isValidIITREmail(cleanEmail)) {
      return { 
        success: false, 
        error: 'Access restricted: Please enter a valid IIT Roorkee institutional email ending in @iitr.ac.in or @*.iitr.ac.in.' 
      };
    }

    // Role-specific authentication
    if (role === 'staff') {
      const staffMember = AUTHORIZED_STAFF_CREDENTIALS.find(s => s.email.toLowerCase() === cleanEmail);
      if (!staffMember) {
        return { 
          success: false, 
          error: 'Unauthorized Staff ID: Staff access is restricted strictly to the 5 authorized estate staff accounts.' 
        };
      }

      if (staffMember.password !== cleanPassword) {
        return { 
          success: false, 
          error: 'Incorrect staff password. Please enter the assigned password for this staff member.' 
        };
      }

      const profile: UserProfile = {
        id: staffMember.id,
        name: staffMember.name,
        role: 'staff',
        email: staffMember.email,
        phone: staffMember.phone,
        department: staffMember.department
      };

      setCurrentUser(profile);
      saveStoredSession(profile);
      return { success: true };
    }

    if (role === 'admin') {
      if (cleanEmail !== AUTHORIZED_WARDEN_CREDENTIAL.email.toLowerCase()) {
        return { 
          success: false, 
          error: 'Unauthorized Warden ID: Chief Warden & Estate administration is restricted to authorized credentials.' 
        };
      }

      if (AUTHORIZED_WARDEN_CREDENTIAL.password !== cleanPassword) {
        return { 
          success: false, 
          error: 'Incorrect warden password. Access denied.' 
        };
      }

      const profile: UserProfile = {
        id: AUTHORIZED_WARDEN_CREDENTIAL.id,
        name: AUTHORIZED_WARDEN_CREDENTIAL.name,
        role: 'admin',
        email: AUTHORIZED_WARDEN_CREDENTIAL.email,
        phone: AUTHORIZED_WARDEN_CREDENTIAL.phone,
        department: AUTHORIZED_WARDEN_CREDENTIAL.department
      };

      setCurrentUser(profile);
      saveStoredSession(profile);
      return { success: true };
    }

    if (role === 'student') {
      const result = verifyStudentCredentials(cleanEmail, cleanPassword);
      if (!result.success || !result.student) {
        return { 
          success: false, 
          error: result.error || 'Invalid student credentials. If you have not registered yet, please click Sign Up.' 
        };
      }

      const student = result.student;
      const profile: UserProfile = {
        id: student.id,
        name: student.name,
        role: 'student',
        email: student.email,
        phone: student.phone,
        hostel: student.hostel,
        room: student.room,
        enrollmentNo: student.enrollmentNo,
        department: student.department
      };

      setCurrentUser(profile);
      saveStoredSession(profile);
      return { success: true };
    }

    return { success: false, error: 'Unknown role selected.' };
  };

  const signupStudent = (
    data: Omit<StudentAccount, 'id' | 'role' | 'createdAt'>
  ): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your IIT Roorkee institutional email ID.' };
    }

    if (!isValidIITREmail(cleanEmail)) {
      return { 
        success: false, 
        error: 'Please enter a valid IIT Roorkee email ending in @iitr.ac.in or @*.iitr.ac.in (e.g. name@me.iitr.ac.in).' 
      };
    }

    if (!data.name.trim()) {
      return { success: false, error: 'Please provide your full name.' };
    }

    if (!data.password || data.password.trim().length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (!data.hostel || !data.room) {
      return { success: false, error: 'Please provide your current Bhawan/Hostel and Room number.' };
    }

    const regResult = registerStudentAccount(data);
    if (!regResult.success || !regResult.student) {
      return { success: false, error: regResult.error || 'Failed to register student account.' };
    }

    const student = regResult.student;
    const profile: UserProfile = {
      id: student.id,
      name: student.name,
      role: 'student',
      email: student.email,
      phone: student.phone,
      hostel: student.hostel,
      room: student.room,
      enrollmentNo: student.enrollmentNo,
      department: student.department
    };

    setCurrentUser(profile);
    saveStoredSession(profile);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    saveStoredSession(null);
  };

  const currentRole = currentUser ? currentUser.role : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser,
        login,
        signupStudent,
        logout,
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
