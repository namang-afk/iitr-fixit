import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RequestItem, 
  RequestStatus, 
  RequestPriority, 
  RequestComment, 
  StaffMember, 
  FilterOptions 
} from '../types';
import { requestService } from '../services/requestService';
import { DATA_CHANGE_EVENT } from '../services/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface RequestContextType {
  requests: RequestItem[];
  staffMembers: StaffMember[];
  isLoading: boolean;
  refreshRequests: () => void;
  createRequest: (data: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'status'> & { priority: RequestPriority }) => RequestItem;
  updateStatus: (id: string, newStatus: RequestStatus, note?: string, resolutionNotes?: string) => RequestItem;
  assignStaff: (id: string, staffId: string) => RequestItem;
  updatePriority: (id: string, newPriority: RequestPriority, reason?: string) => RequestItem;
  addComment: (id: string, text: string, isInternalStaffOnly?: boolean) => RequestComment;
  reopenRequest: (id: string, reason: string) => RequestItem;
  submitFeedback: (id: string, rating: number, comment?: string) => RequestItem;
  resetDemoData: () => void;
  getRequestById: (id: string) => RequestItem | undefined;
  getFilteredRequests: (filters: FilterOptions) => RequestItem[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRole, currentUser } = useAuth();
  const { success, error, info } = useToast();

  const [requests, setRequests] = useState<RequestItem[]>(() => requestService.getAllRequests());
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => requestService.getAllStaff());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshRequests = useCallback(() => {
    setIsLoading(true);
    try {
      const allReqs = requestService.getAllRequests();
      const allStaff = requestService.getAllStaff();
      setRequests(allReqs);
      setStaffMembers(allStaff);
    } catch (err) {
      console.error('Failed refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleSync = () => {
      refreshRequests();
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener(DATA_CHANGE_EVENT, handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener(DATA_CHANGE_EVENT, handleSync);
    };
  }, [refreshRequests]);

  const createRequest = useCallback((
    data: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'status'> & { priority: RequestPriority }
  ): RequestItem => {
    try {
      const created = requestService.createRequest(data);
      refreshRequests();
      success('Ticket Submitted Successfully', `Ticket #${created.id} logged for ${created.hostel} ${created.roomNumber}.`);
      return created;
    } catch (err: any) {
      error('Failed to submit request', err.message || 'Please check all required fields.');
      throw err;
    }
  }, [refreshRequests, success, error]);

  const updateStatus = useCallback((
    id: string, 
    newStatus: RequestStatus, 
    note?: string,
    resolutionNotes?: string
  ): RequestItem => {
    try {
      const actorName = currentUser?.name || 'Estate Official';
      const actorRole = currentRole || 'staff';
      const updated = requestService.updateStatus(id, newStatus, actorName, actorRole, note, resolutionNotes);
      refreshRequests();
      success('Status Updated', `Request #${id} is now ${newStatus.replace('_', ' ').toUpperCase()}.`);
      return updated;
    } catch (err: any) {
      error('Failed to update status', err.message);
      throw err;
    }
  }, [currentUser?.name, currentRole, refreshRequests, success, error]);

  const assignStaff = useCallback((id: string, staffId: string): RequestItem => {
    try {
      const actorName = currentUser?.name || 'Warden';
      const actorRole = currentRole || 'admin';
      const updated = requestService.assignStaff(id, staffId, actorName, actorRole);
      refreshRequests();
      success('Technician Assigned', `Dispatched to ${updated.assignedStaffName}.`);
      return updated;
    } catch (err: any) {
      error('Failed to assign technician', err.message);
      throw err;
    }
  }, [currentUser?.name, currentRole, refreshRequests, success, error]);

  const updatePriority = useCallback((id: string, newPriority: RequestPriority, reason?: string): RequestItem => {
    try {
      const actorName = currentUser?.name || 'Estate Supervisor';
      const actorRole = currentRole || 'admin';
      const updated = requestService.updatePriority(id, newPriority, actorName, actorRole, reason);
      refreshRequests();
      info('Priority Updated', `Ticket #${id} set to ${newPriority.toUpperCase()} priority.`);
      return updated;
    } catch (err: any) {
      error('Failed to update priority', err.message);
      throw err;
    }
  }, [currentUser?.name, currentRole, refreshRequests, info, error]);

  const addComment = useCallback((id: string, text: string, isInternalStaffOnly = false): RequestComment => {
    try {
      const actorName = currentUser?.name || 'Campus Member';
      const actorRole = currentRole || 'student';
      const comment = requestService.addComment(id, text, actorName, actorRole, isInternalStaffOnly);
      refreshRequests();
      success('Comment Posted', isInternalStaffOnly ? 'Internal staff work note added.' : 'Update sent to resident.');
      return comment;
    } catch (err: any) {
      error('Failed to post comment', err.message);
      throw err;
    }
  }, [currentUser?.name, currentRole, refreshRequests, success, error]);

  const reopenRequest = useCallback((id: string, reason: string): RequestItem => {
    try {
      const actorName = currentUser?.name || 'Resident';
      const actorRole = currentRole || 'student';
      const updated = requestService.reopenRequest(id, reason, actorName, actorRole);
      refreshRequests();
      info('Request Reopened', `Ticket #${id} returned to Under Review.`);
      return updated;
    } catch (err: any) {
      error('Failed to reopen request', err.message);
      throw err;
    }
  }, [currentUser?.name, currentRole, refreshRequests, info, error]);

  const submitFeedback = useCallback((id: string, rating: number, comment?: string): RequestItem => {
    try {
      const updated = requestService.submitFeedback(id, rating, comment);
      refreshRequests();
      success('Thank you for your feedback!', `Rating of ${rating}/5 recorded and ticket closed.`);
      return updated;
    } catch (err: any) {
      error('Failed to submit feedback', err.message);
      throw err;
    }
  }, [refreshRequests, success, error]);

  const resetDemoData = useCallback(() => {
    requestService.resetDefaults();
    refreshRequests();
    info('Demo Data Reset', 'Fresh sample requests and staff records have been restored.');
  }, [refreshRequests, info]);

  const getRequestById = useCallback((id: string) => {
    return requests.find(r => r.id.toLowerCase() === id.trim().toLowerCase());
  }, [requests]);

  const getFilteredRequests = useCallback((filters: FilterOptions) => {
    return requestService.filterRequests(
      requests, 
      filters, 
      currentRole || 'student', 
      currentUser?.id || ''
    );
  }, [requests, currentRole, currentUser?.id]);

  return (
    <RequestContext.Provider
      value={{
        requests,
        staffMembers,
        isLoading,
        refreshRequests,
        createRequest,
        updateStatus,
        assignStaff,
        updatePriority,
        addComment,
        reopenRequest,
        submitFeedback,
        resetDemoData,
        getRequestById,
        getFilteredRequests
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = (): RequestContextType => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};
