import { RequestItem, StaffMember, UserProfile, UserRole } from '../types';
import { INITIAL_REQUESTS, INITIAL_STAFF } from './seedData';
import { StudentAccount, DEFAULT_STUDENT_ACCOUNT, DEFAULT_STUDENT_ACCOUNTS } from '../constants/authCredentials';

const STORAGE_KEYS = {
  REQUESTS: 'iitr_fixit_requests_v1',
  STAFF: 'iitr_fixit_staff_v1',
  ACTIVE_ROLE: 'iitr_fixit_active_role_v1',
  SESSION_USER: 'iitr_fixit_session_user_v1',
  REGISTERED_STUDENTS: 'iitr_fixit_registered_students_v1',
};

// Event name for syncing state within same window/tab
export const DATA_CHANGE_EVENT = 'iitr_fixit_data_changed';

export function notifyDataChange() {
  window.dispatchEvent(new CustomEvent(DATA_CHANGE_EVENT));
}

export function loadStoredRequests(): RequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load stored requests, restoring seed data:', error);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: RequestItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    notifyDataChange();
  } catch (error) {
    console.error('Failed to save requests to localStorage:', error);
  }
}

export function loadStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load stored staff, restoring seed data:', error);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }
}

export function saveStoredStaff(staff: StaffMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    notifyDataChange();
  } catch (error) {
    console.error('Failed to save staff to localStorage:', error);
  }
}

export function loadStoredSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_USER);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveStoredSession(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, user.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
    }
    notifyDataChange();
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function loadStoredRole(): UserRole {
  try {
    const session = loadStoredSession();
    if (session?.role) {
      return session.role;
    }
    const role = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole;
    if (role === 'student' || role === 'staff' || role === 'admin') {
      return role;
    }
    return 'student';
  } catch {
    return 'student';
  }
}

export function saveStoredRole(role: UserRole): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    notifyDataChange();
  } catch (error) {
    console.error('Failed to save role:', error);
  }
}

export function loadRegisteredStudents(): StudentAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_STUDENTS);
    let list: StudentAccount[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        list = [];
      }
    }

    // Always ensure default student accounts (Naman Gupta, Muntazir, Manikanta, Aarav Sharma) are loaded across all browsers
    let modified = false;
    for (const def of DEFAULT_STUDENT_ACCOUNTS) {
      const exists = list.some(s => s.email.toLowerCase() === def.email.toLowerCase());
      if (!exists) {
        list.push(def);
        modified = true;
      }
    }

    if (modified || !raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(list));
    }
    return list;
  } catch (error) {
    console.error('Failed to load registered students:', error);
    return DEFAULT_STUDENT_ACCOUNTS;
  }
}

export function saveRegisteredStudents(students: StudentAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(students));
    notifyDataChange();
  } catch (error) {
    console.error('Failed to save registered students:', error);
  }
}

export function registerStudentAccount(
  data: Omit<StudentAccount, 'id' | 'role' | 'createdAt'>
): { success: boolean; error?: string; student?: StudentAccount } {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const students = loadRegisteredStudents();

    const existingIndex = students.findIndex(s => s.email.toLowerCase() === cleanEmail);
    if (existingIndex !== -1) {
      // If student already exists, update their record and password so they are never locked out
      students[existingIndex] = {
        ...students[existingIndex],
        ...data,
        email: cleanEmail
      };
      saveRegisteredStudents(students);
      return { success: true, student: students[existingIndex] };
    }

    const newStudent: StudentAccount = {
      ...data,
      id: `user_student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'student',
      email: cleanEmail,
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    saveRegisteredStudents(students);
    return { success: true, student: newStudent };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed.' };
  }
}

export function verifyStudentCredentials(
  email: string, 
  password: string
): { success: boolean; error?: string; student?: StudentAccount; notFound?: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const students = loadRegisteredStudents();
  const student = students.find(s => s.email.toLowerCase() === cleanEmail);

  if (!student) {
    return { 
      success: false, 
      notFound: true,
      error: 'No registered resident found with this email. Please click "Sign Up" to register.' 
    };
  }

  if (student.password !== password.trim()) {
    return { 
      success: false, 
      error: 'Incorrect password. Please verify and try again, or sign up with a new password to reset it.' 
    };
  }

  return { success: true, student };
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
  localStorage.setItem(STORAGE_KEYS.REGISTERED_STUDENTS, JSON.stringify(DEFAULT_STUDENT_ACCOUNTS));
  localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'student');
  notifyDataChange();
}
