import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Wrench, 
  PlusCircle, 
  Search, 
  Menu, 
  X, 
  LayoutDashboard, 
  ClipboardList, 
  Home,
  User,
  Shield,
  Briefcase
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      name: currentRole === 'student' ? 'My Requests' : 'All Requests', 
      path: '/requests', 
      icon: <ClipboardList className="w-4 h-4" /> 
    },
    { name: 'Quick Track', path: '/track', icon: <Search className="w-4 h-4" /> },
  ];

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <User className="w-3 h-3 text-emerald-600" />
            Resident
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Briefcase className="w-3 h-3 text-blue-600" />
            Staff
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
            <Shield className="w-3 h-3 text-purple-600" />
            Warden
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#7A1528] text-white flex items-center justify-center shadow-sm group-hover:bg-[#621323] transition-colors">
                <Wrench className="w-5 h-5 text-amber-300 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-stone-900 font-display">
                    IITR <span className="text-[#7A1528]">FixIt</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                    Estate Portal
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block -mt-0.5">
                  IIT Roorkee Room Maintenance
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'text-[#7A1528] bg-[#FDF2F4] font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: CTAs & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Report Issue CTA Button */}
            <Link
              to="/requests/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Report Issue</span>
            </Link>

            {/* Current Persona Card */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-bold text-stone-900 truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  {getRoleBadge()}
                </div>
                <p className="text-[11px] text-stone-500 truncate max-w-[170px]">
                  {currentUser.hostel ? `${currentUser.hostel} • ${currentUser.room}` : currentUser.department}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center font-bold text-xs text-[#7A1528] shadow-xs">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/requests/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A1528] text-white text-xs font-semibold rounded-lg"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <div className="text-xs font-bold text-stone-900">{currentUser.name}</div>
              <div className="text-[11px] text-stone-500">{currentUser.email}</div>
            </div>
            {getRoleBadge()}
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive(link.path)
                    ? 'text-[#7A1528] bg-[#FDF2F4]'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
