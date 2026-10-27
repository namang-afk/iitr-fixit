import React, { useState } from 'react';
import { RequestComment, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Lock, User, Shield, Wrench, AlertCircle } from 'lucide-react';

interface CommentSectionProps {
  comments: RequestComment[];
  onAddComment: (text: string, isInternal: boolean) => void;
  canAddComment?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  onAddComment,
  canAddComment = true 
}) => {
  const { currentRole, currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const isStaffOrAdmin = currentRole === 'staff' || currentRole === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim(), isInternal);
    setCommentText('');
    setIsInternal(false);
  };

  // Filter out internal comments for students
  const visibleComments = comments.filter(c => {
    if (c.isInternalStaffOnly && currentRole === 'student') {
      return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            <User className="w-2.5 h-2.5" /> Resident
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            <Wrench className="w-2.5 h-2.5" /> Staff
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
            <Shield className="w-2.5 h-2.5" /> Warden
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#7A1528]" />
          Communication & Updates ({visibleComments.length})
        </h4>
        {isStaffOrAdmin && (
          <span className="text-[11px] text-stone-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" />
            Internal notes visible to staff/warden only
          </span>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {visibleComments.length === 0 ? (
          <div className="p-6 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs">
            No messages posted yet. Use the message box below to ask questions or post updates.
          </div>
        ) : (
          visibleComments.map((comment) => {
            const date = new Date(comment.createdAt);
            const formatted = date.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={comment.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                  comment.isInternalStaffOnly
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                    : comment.authorRole === 'student'
                    ? 'bg-white border-stone-200 text-stone-900'
                    : 'bg-[#FDF2F4]/60 border-[#f9d0d9] text-stone-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">
                      {comment.authorName}
                    </span>
                    {getRoleBadge(comment.authorRole)}
                    {comment.isInternalStaffOnly && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                        <Lock className="w-2.5 h-2.5" /> Staff Work Note
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-600">
                    {formatted}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-stone-800">{comment.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment Input Form */}
      {canAddComment && (
        <form onSubmit={handleSubmit} className="pt-2">
          <div className="relative rounded-xl border border-stone-300 focus-within:border-[#7A1528] focus-within:ring-2 focus-within:ring-[#7A1528]/10 bg-white transition-all overflow-hidden shadow-xs">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                isInternal 
                  ? "Write an internal work note (parts ordered, inventory status, staff handover)..."
                  : `Post a public message to ${currentRole === 'student' ? 'maintenance staff' : 'the resident'}...`
              }
              className="w-full p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden resize-none"
            />

            <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-t border-stone-200">
              <div className="flex items-center gap-2">
                {isStaffOrAdmin && (
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-stone-700 select-none hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                    />
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Internal Note (Hidden from Resident)</span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  commentText.trim()
                    ? 'bg-[#7A1528] text-white hover:bg-[#621323] shadow-xs active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
