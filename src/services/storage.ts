import { RequestItem, StaffMember, UserRole } from '../types';
import { INITIAL_REQUESTS, INITIAL_STAFF } from './seedData';

const STORAGE_KEYS = {
  REQUESTS: 'iitr_fixit_requests_v1',
  STAFF: 'iitr_fixit_staff_v1',
  ACTIVE_ROLE: 'iitr_fixit_active_role_v1',
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

export function loadStoredRole(): UserRole {
  try {
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

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'student');
  notifyDataChange();
}
