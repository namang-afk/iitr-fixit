import { 
  RequestItem, 
  RequestStatus, 
  RequestPriority, 
  RequestTimelineEvent, 
  RequestComment, 
  StaffMember, 
  UserRole,
  FilterOptions
} from '../types';
import { 
  loadStoredRequests, 
  saveStoredRequests, 
  loadStoredStaff, 
  saveStoredStaff,
  resetAllDataToDefault 
} from './storage';

export const requestService = {
  // Fetch all requests
  getAllRequests(): RequestItem[] {
    return loadStoredRequests();
  },

  // Fetch single request by ID
  getRequestById(id: string): RequestItem | undefined {
    const list = loadStoredRequests();
    return list.find(r => r.id.toLowerCase() === id.trim().toLowerCase());
  },

  // Generate unique readable ticket ID like FIX-2026-009
  generateNextTicketId(): string {
    const list = loadStoredRequests();
    const currentYear = new Date().getFullYear();
    const prefix = `FIX-${currentYear}-`;
    
    // Find highest numerical suffix
    let maxNum = 0;
    list.forEach(item => {
      if (item.id.startsWith(prefix)) {
        const numPart = parseInt(item.id.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(3, '0')}`;
  },

  // Create new request
  createRequest(data: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'status'> & { priority: RequestPriority }): RequestItem {
    const requests = loadStoredRequests();
    const now = new Date().toISOString();
    const id = this.generateNextTicketId();

    const initialTimeline: RequestTimelineEvent = {
      id: `tl_${Date.now()}`,
      timestamp: now,
      actorName: data.residentName,
      actorRole: 'student',
      action: 'Request Submitted',
      note: `Ticket created for ${data.hostel}, Room ${data.roomNumber}. Priority set to ${data.priority.toUpperCase()}.`,
      toStatus: 'submitted'
    };

    const newRequest: RequestItem = {
      ...data,
      id,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      timeline: [initialTimeline],
      comments: []
    };

    requests.unshift(newRequest);
    saveStoredRequests(requests);
    return newRequest;
  },

  // Update status with audit timeline entry
  updateStatus(
    id: string, 
    newStatus: RequestStatus, 
    actorName: string, 
    actorRole: UserRole, 
    note?: string,
    resolutionNotes?: string
  ): RequestItem {
    const requests = loadStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Request with ID ${id} not found.`);
    }

    const current = requests[index];
    const prevStatus = current.status;
    const now = new Date().toISOString();

    const timelineEvent: RequestTimelineEvent = {
      id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
      actorName,
      actorRole,
      action: `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`,
      note: note || (resolutionNotes ? `Resolution: ${resolutionNotes}` : `Progress updated by ${actorName}`),
      fromStatus: prevStatus,
      toStatus: newStatus
    };

    const updated: RequestItem = {
      ...current,
      status: newStatus,
      updatedAt: now,
      timeline: [timelineEvent, ...current.timeline]
    };

    if (newStatus === 'resolved') {
      updated.resolvedAt = now;
      if (resolutionNotes) {
        updated.resolutionNotes = resolutionNotes;
      }
    } else if (newStatus === 'closed') {
      updated.closedAt = now;
    }

    requests[index] = updated;
    saveStoredRequests(requests);
    return updated;
  },

  // Assign staff member to request
  assignStaff(id: string, staffId: string, actorName: string, actorRole: UserRole): RequestItem {
    const requests = loadStoredRequests();
    const staffList = loadStoredStaff();

    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Request with ID ${id} not found.`);

    const staff = staffList.find(s => s.id === staffId);
    if (!staff) throw new Error(`Staff member with ID ${staffId} not found.`);

    const current = requests[index];
    const now = new Date().toISOString();
    const newStatus: RequestStatus = current.status === 'submitted' || current.status === 'under_review' 
      ? 'assigned' 
      : current.status;

    const timelineEvent: RequestTimelineEvent = {
      id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
      actorName,
      actorRole,
      action: `Assigned to ${staff.name}`,
      note: `Work order dispatched to ${staff.name} (${staff.department}). Contact: ${staff.phone}`,
      fromStatus: current.status,
      toStatus: newStatus
    };

    const updated: RequestItem = {
      ...current,
      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
      assignedStaffPhone: staff.phone,
      assignedStaffRole: staff.department,
      status: newStatus,
      updatedAt: now,
      timeline: [timelineEvent, ...current.timeline]
    };

    // Update staff activeJobsCount
    staff.activeJobsCount += 1;
    saveStoredStaff(staffList);

    requests[index] = updated;
    saveStoredRequests(requests);
    return updated;
  },

  // Update request priority (Admin/Warden override)
  updatePriority(id: string, newPriority: RequestPriority, actorName: string, actorRole: UserRole, reason?: string): RequestItem {
    const requests = loadStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found.`);

    const current = requests[index];
    const prevPriority = current.priority;
    const now = new Date().toISOString();

    const timelineEvent: RequestTimelineEvent = {
      id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
      actorName,
      actorRole,
      action: `Priority changed from ${prevPriority.toUpperCase()} to ${newPriority.toUpperCase()}`,
      note: reason || `Priority calibrated by ${actorRole === 'admin' ? 'Warden' : 'Estate Staff'}.`
    };

    const updated: RequestItem = {
      ...current,
      priority: newPriority,
      updatedAt: now,
      timeline: [timelineEvent, ...current.timeline]
    };

    requests[index] = updated;
    saveStoredRequests(requests);
    return updated;
  },

  // Add comment to request
  addComment(id: string, text: string, authorName: string, authorRole: UserRole, isInternalStaffOnly = false): RequestComment {
    const requests = loadStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found.`);

    const now = new Date().toISOString();
    const newComment: RequestComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      authorName,
      authorRole,
      text: text.trim(),
      createdAt: now,
      isInternalStaffOnly
    };

    requests[index].comments.push(newComment);
    requests[index].updatedAt = now;
    saveStoredRequests(requests);
    return newComment;
  },

  // Resident reopens a resolved request
  reopenRequest(id: string, reason: string, actorName: string, actorRole: UserRole): RequestItem {
    const requests = loadStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found.`);

    const current = requests[index];
    const now = new Date().toISOString();

    const timelineEvent: RequestTimelineEvent = {
      id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now,
      actorName,
      actorRole,
      action: 'Request Reopened by Resident',
      note: `Resident reported issue persists: "${reason}"`,
      fromStatus: current.status,
      toStatus: 'under_review'
    };

    const updated: RequestItem = {
      ...current,
      status: 'under_review',
      resolvedAt: undefined,
      closedAt: undefined,
      updatedAt: now,
      timeline: [timelineEvent, ...current.timeline]
    };

    requests[index] = updated;
    saveStoredRequests(requests);
    return updated;
  },

  // Submit resident rating and feedback
  submitFeedback(id: string, rating: number, comment?: string): RequestItem {
    const requests = loadStoredRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found.`);

    const current = requests[index];
    const now = new Date().toISOString();

    const updated: RequestItem = {
      ...current,
      rating,
      feedbackComment: comment,
      status: 'closed', // providing feedback finalizes and closes
      closedAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: now,
          actorName: current.residentName,
          actorRole: 'student',
          action: 'Feedback Submitted & Ticket Closed',
          note: `Resident provided a ${rating}/5 rating.${comment ? ` Feedback: "${comment}"` : ''}`,
          fromStatus: current.status,
          toStatus: 'closed'
        },
        ...current.timeline
      ]
    };

    requests[index] = updated;
    saveStoredRequests(requests);
    return updated;
  },

  // Fetch all staff
  getAllStaff(): StaffMember[] {
    return loadStoredStaff();
  },

  // Reset everything to seed defaults
  resetDefaults(): void {
    resetAllDataToDefault();
  },

  // Filter and sort requests
  filterRequests(requests: RequestItem[], filters: FilterOptions, currentRole: UserRole, currentUserId: string, currentUserEmail?: string): RequestItem[] {
    return requests.filter(item => {
      // Role scope: if student and "assignedToMe", not applicable, but students can view all their requests or all campus requests
      if (filters.assignedToMe) {
        if (currentRole === 'staff') {
          // If staff, match assignedStaffId or specialty
          const staffList = loadStoredStaff();
          const me = staffList[0]; // demo staff Rajesh Kumar
          if (item.assignedStaffId !== me.id) return false;
        } else if (currentRole === 'student') {
          // For student, assignedToMe means submitted by me (checks ID or matching student email)
          const matchesId = item.residentId === currentUserId;
          const matchesEmail = Boolean(currentUserEmail && item.residentEmail?.toLowerCase() === currentUserEmail.toLowerCase());
          if (!matchesId && !matchesEmail) return false;
        }
      }

      // Search term (ID, title, description, room, hostel, residentName, staffName)
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matches = 
          item.id.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.hostel.toLowerCase().includes(query) ||
          item.roomNumber.toLowerCase().includes(query) ||
          item.residentName.toLowerCase().includes(query) ||
          (item.assignedStaffName && item.assignedStaffName.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (item.status !== filters.status) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (item.category !== filters.category) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'all') {
        if (item.priority !== filters.priority) return false;
      }

      // Hostel filter
      if (filters.hostel && filters.hostel !== 'all') {
        if (item.hostel.toLowerCase() !== filters.hostel.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filters.sortBy === 'priority_desc') {
        const weight: Record<RequestPriority, number> = { emergency: 4, high: 3, normal: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      if (filters.sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  }
};
