import { UserProfile, UserRole } from '../types';

export interface StaffCredential {
  id: string;
  name: string;
  email: string;
  password: string; // Strictly generated authorized password
  department: string;
  specialty: string;
  phone: string;
}

export interface WardenCredential {
  id: string;
  name: string;
  email: string;
  password: string; // Strictly generated authorized password
  department: string;
  phone: string;
}

export interface StudentAccount extends UserProfile {
  password: string;
  createdAt: string;
}

// Exactly 5 Authorized Staff Credentials for Estate & Works Maintenance
export const AUTHORIZED_STAFF_CREDENTIALS: StaffCredential[] = [
  {
    id: 'staff_1',
    name: 'Rajesh Kumar',
    email: 'rajesh.estate@iitr.ac.in',
    password: 'Staff@Elec1',
    department: 'Estate & Works – Electrical Unit',
    specialty: 'Electrical & Power',
    phone: '+91 94120 12345'
  },
  {
    id: 'staff_2',
    name: 'Suresh Verma',
    email: 'suresh.waterworks@iitr.ac.in',
    password: 'Staff@Plumb2',
    department: 'Estate & Works – Water Supply',
    specialty: 'Plumbing & Water Supply',
    phone: '+91 94120 23456'
  },
  {
    id: 'staff_3',
    name: 'Amit Bisht',
    email: 'amit.carpentry@iitr.ac.in',
    password: 'Staff@Carp3',
    department: 'Estate & Works – Carpentry Unit',
    specialty: 'Carpentry & Furniture',
    phone: '+91 94120 34567'
  },
  {
    id: 'staff_4',
    name: 'Vikram Singh',
    email: 'vikram.icc@iitr.ac.in',
    password: 'Staff@Net4',
    department: 'Institute Computer Center (ICC)',
    specialty: 'Internet & LAN / Wi-Fi',
    phone: '+91 94120 45678'
  },
  {
    id: 'staff_5',
    name: 'Ramesh Chand',
    email: 'ramesh.civil@iitr.ac.in',
    password: 'Staff@Civil5',
    department: 'Estate & Works – Civil Maintenance',
    specialty: 'Civil Works & Masonry',
    phone: '+91 94120 56789'
  }
];

// Exactly 1 Authorized Warden Credential
export const AUTHORIZED_WARDEN_CREDENTIAL: WardenCredential = {
  id: 'user_admin_1',
  name: 'Ramesh Supervisor',
  email: 'warden.rajendra@iitr.ac.in',
  password: 'Warden@IITR2026',
  department: 'Chief Warden & Estate Supervisor / Directorate',
  phone: '+91 94129 99888'
};

// Default seed student account (allows testing existing sample tickets)
export const DEFAULT_STUDENT_ACCOUNT: StudentAccount = {
  id: 'user_student_1',
  name: 'Aarav Sharma',
  role: 'student',
  email: 'aarav.sharma@me.iitr.ac.in',
  password: 'Student@IITR1',
  phone: '+91 98765 43210',
  hostel: 'Rajendra Bhawan',
  room: 'R-314',
  enrollmentNo: '22115042',
  department: 'Mechanical & Industrial Engineering',
  createdAt: '2026-01-01T00:00:00.000Z'
};

// Staff validation helper
export function verifyStaffCredentials(email: string, password: string): StaffCredential | null {
  const cleanEmail = email.trim().toLowerCase();
  const staff = AUTHORIZED_STAFF_CREDENTIALS.find(s => s.email.toLowerCase() === cleanEmail);
  if (!staff) return null;
  if (staff.password !== password.trim()) return null;
  return staff;
}

// Warden validation helper
export function verifyWardenCredentials(email: string, password: string): WardenCredential | null {
  const cleanEmail = email.trim().toLowerCase();
  if (AUTHORIZED_WARDEN_CREDENTIAL.email.toLowerCase() !== cleanEmail) return null;
  if (AUTHORIZED_WARDEN_CREDENTIAL.password !== password.trim()) return null;
  return AUTHORIZED_WARDEN_CREDENTIAL;
}

