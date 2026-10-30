import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, isValidIITREmail } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { DEMO_USERS, IITR_HOSTELS } from '../constants';
import { 
  Wrench, 
  UserCheck, 
  ShieldCheck, 
  Building, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Info,
  ShieldAlert,
  Home
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('campus@iitr2026');
  const [hostel, setHostel] = useState('Rajendra Bhawan');
  const [roomNumber, setRoomNumber] = useState('R-314');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read return URL from state if user was redirected from a protected route
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'staff' || roleParam === 'admin' || roleParam === 'student') {
      handleRoleSelect(roleParam as UserRole);
    }
  }, [location.search]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    // Preload representative email placeholder
    if (role === 'student') {
      setEmail('aarav.sharma@me.iitr.ac.in');
      setName('Aarav Sharma');
    } else if (role === 'staff') {
      setEmail('rajesh.estate@iitr.ac.in');
      setName('Rajesh Kumar');
    } else {
      setEmail('warden.rajendra@iitr.ac.in');
      setName('Dr. P. K. Sen');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your IIT Roorkee institutional email.');
      return;
    }

    if (!isValidIITREmail(email)) {
      setErrorMessage('Invalid domain: Please provide a valid IIT Roorkee email ending in @iitr.ac.in or @*.iitr.ac.in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = login(email, selectedRole, {
        name: name.trim() || undefined,
        hostel: selectedRole === 'student' ? hostel : undefined,
        room: selectedRole === 'student' ? roomNumber : undefined,
      });

      if (res.success) {
        success('Authentication Verified', `Logged in as ${selectedRole.toUpperCase()} • Welcome to IITR FixIt.`);
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
        error('Login Failed', res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    const res = login(demo.email, role, {
      name: demo.name,
      hostel: demo.hostel,
      room: demo.room,
      department: demo.department
    });
    if (res.success) {
      success('Instant Access Granted', `Logged in as ${demo.name} (${role.toUpperCase()})`);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header & Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-[#7A1528] text-white flex items-center justify-center shadow-md group-hover:bg-[#621323] transition-colors">
              <Wrench className="w-6 h-6 text-amber-300 transform -rotate-45" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-stone-900 font-display">
                IITR <span className="text-[#7A1528]">FixIt</span>
              </span>
              <p className="text-[11px] text-stone-500 font-medium">
                Estate & Works Directorate Portal
              </p>
            </div>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Single Sign-On (SSO) Portal
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Select your campus role and authenticate with your institutional email.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-6">
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Campus Persona
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'student'
                    ? 'bg-[#7A1528] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="truncate">Resident</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('staff')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'staff'
                    ? 'bg-[#7A1528] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span className="truncate">Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'admin'
                    ? 'bg-[#7A1528] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="truncate">Warden</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (optional) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'student' ? 'e.g. Aarav Sharma' : selectedRole === 'staff' ? 'e.g. Rajesh Kumar' : 'e.g. Dr. P. K. Sen'}
                className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
              />
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  IIT Roorkee Email Address <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">@*.iitr.ac.in</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={selectedRole === 'student' ? 'yourname@me.iitr.ac.in' : 'yourname@iitr.ac.in'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password / Passcode */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Campus Portal Password / SSO PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Student specific fields */}
            {selectedRole === 'student' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Hostel / Bhawan
                  </label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900"
                  >
                    {IITR_HOSTELS.map(h => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Room No.
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="R-314"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-stone-400 mt-2"
            >
              <span>{isSubmitting ? 'Verifying Credentials...' : `Sign in as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Presets */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#7A1528]" />
              <span>Instant Evaluator / Server Demo Accounts</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="w-full p-2.5 bg-stone-50 hover:bg-[#FDF2F4] border border-stone-200 hover:border-[#f9d0d9] rounded-xl text-left flex items-center justify-between text-xs transition-colors group"
              >
                <div>
                  <span className="font-bold text-stone-900 group-hover:text-[#7A1528]">
                    Aarav Sharma
                  </span>
                  <p className="text-[10px] text-stone-500">Student • Rajendra R-314 (aarav.sharma@me.iitr.ac.in)</p>
                </div>
                <span className="text-[10px] font-bold text-[#7A1528] bg-white px-2 py-0.5 rounded border border-stone-200">
                  Login ➔
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff')}
                className="w-full p-2.5 bg-stone-50 hover:bg-blue-50 border border-stone-200 hover:border-blue-200 rounded-xl text-left flex items-center justify-between text-xs transition-colors group"
              >
                <div>
                  <span className="font-bold text-stone-900 group-hover:text-blue-900">
                    Rajesh Kumar
                  </span>
                  <p className="text-[10px] text-stone-500">Staff • Electrical Wing (rajesh.estate@iitr.ac.in)</p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                  Login ➔
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full p-2.5 bg-stone-50 hover:bg-purple-50 border border-stone-200 hover:border-purple-200 rounded-xl text-left flex items-center justify-between text-xs transition-colors group"
              >
                <div>
                  <span className="font-bold text-stone-900 group-hover:text-purple-900">
                    Dr. P. K. Sen
                  </span>
                  <p className="text-[10px] text-stone-500">Warden / Admin • Estate Council (warden.rajendra@iitr.ac.in)</p>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                  Login ➔
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access Information */}
        <div className="text-center text-[11px] text-stone-400 space-y-1">
          <p>Indian Institute of Technology Roorkee • Estate & Works Directorate</p>
          <p>Strict Role Access Control: Students cannot access staff or warden panels and vice versa.</p>
        </div>
      </div>
    </div>
  );
};
