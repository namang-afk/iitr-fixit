import React from 'react';
import { X, AlertTriangle, PhoneCall, ShieldAlert, Clock, Building } from 'lucide-react';
import { DEMO_EMERGENCY_CONTACTS } from '../../constants';

interface EmergencyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyNoticeModal: React.FC<EmergencyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full border border-rose-200 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top warning ribbon */}
        <div className="flex items-center gap-3 border-b border-rose-100 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              Campus Emergency Protocol
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                Immediate Action
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              For active sparks, fire risks, major water flooding, or structural danger
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning callout */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-5 text-xs text-rose-900 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Do not rely solely on digital portal submissions</span> during active hazards. Immediately alert your floor supervisor, hostel guard, or call the dedicated control desk numbers below.
          </div>
        </div>

        {/* Directory of Emergency Contacts */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Estate Emergency Helpdesks (Demonstration Placeholders)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_EMERGENCY_CONTACTS.map((contact, index) => (
              <div 
                key={index} 
                className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-rose-200 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs mb-1">
                  <Building className="w-3.5 h-3.5 text-[#7A1528]" />
                  <span>{contact.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7A1528] font-mono font-bold text-xs mb-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{contact.number}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <Clock className="w-3 h-3" />
                  <span>{contact.timing}</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1 italic border-t border-stone-200/60 pt-1">
                  {contact.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice of Demo */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-stone-700 text-[11px] mb-5">
          <strong>Note:</strong> Numbers shown above are placeholder demo contacts. In actual physical emergencies on Roorkee campus, please contact your hostel warden or security desk at Main Century Gate directly.
        </div>

        {/* Modal actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            I Understand — Proceed with Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
