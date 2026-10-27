export type UserRole = 'student' | 'staff' | 'admin';

export type RequestStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export type RequestPriority = 'low' | 'normal' | 'high' | 'emergency';

export type RequestCategory = 
  | 'electrical' 
  | 'plumbing' 
  | 'carpentry' 
  | 'internet' 
  | 'cleaning' 
  | 'pest_control' 
  | 'civil_works' 
  | 'other';

export type PreferredAccessTime = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface RequestTimelineEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  note?: string;
  fromStatus?: RequestStatus;
  toStatus?: RequestStatus;
}

export interface RequestComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
  isInternalStaffOnly?: boolean;
}

export interface RequestItem {
  id: string; // e.g. FIX-2026-001
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  hostel: string;
  block: string;
  roomNumber: string;
  preferredAccessTime: PreferredAccessTime;
  photos: string[];
  
  // Resident details
  residentId: string;
  residentName: string;
  residentEnrollment: string;
  residentPhone: string;
  residentEmail: string;

  // Assignment details
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignedStaffRole?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;

  // Feedback & Resolution
  resolutionNotes?: string;
  rating?: number; // 1 to 5
  feedbackComment?: string;

  // Activity
  timeline: RequestTimelineEvent[];
  comments: RequestComment[];
}

export interface StaffMember {
  id: string;
  name: string;
  specialty: RequestCategory;
  phone: string;
  email: string;
  department: string;
  activeJobsCount: number;
  completedJobsCount: number;
  status: 'available' | 'on_job' | 'off_duty';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  hostel?: string;
  room?: string;
  enrollmentNo?: string;
  department?: string;
  avatarUrl?: string;
}

export interface FilterOptions {
  search: string;
  status: string;
  category: string;
  priority: string;
  hostel: string;
  assignedToMe?: boolean;
  sortBy: 'date_desc' | 'date_asc' | 'priority_desc' | 'status';
}

export interface CategoryMeta {
  id: RequestCategory;
  name: string;
  description: string;
  icon: string;
  slaHours: number;
  examples: string[];
}
