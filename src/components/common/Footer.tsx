import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Heart, ExternalLink, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#7A1528] text-white flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4 text-amber-300 transform -rotate-45" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight font-display">
                IITR <span className="text-[#ec7591]">FixIt</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                Portal v2.6
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              A centralized campus room maintenance and repair management portal for students, research scholars, and residents of the Indian Institute of Technology Roorkee (IIT Roorkee). Designed for clear tracking and zero follow-ups.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span>Demonstration software prototype. Not connected to IIT Roorkee live LDAP / ERP.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link to="/requests/new" className="hover:text-white transition-colors">
                  Report Room Problem
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-white transition-colors">
                  My Active Requests
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Role Dashboard
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track by Ticket ID
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Support */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Service Guidelines</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Normal SLA: 24–48 Hours</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Emergency: Immediate dispatch</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Estate Office: 09:00 - 17:30</span>
              </li>
              <li className="pt-2">
                <a 
                  href="https://www.iitr.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition-colors"
                >
                  <span>IIT Roorkee Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} IITR FixIt • Designed with campus care for IIT Roorkee residents.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Built with React, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
