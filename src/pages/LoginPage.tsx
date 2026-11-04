import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, isValidIITREmail } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { IITR_HOSTELS } from '../constants';
import { 
  Wrench, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  User,
  ShieldAlert
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signupStudent } = useAuth();
  const { success, error } = useToast();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign in form state - ABSOLUTELY NO AUTOMATIC / PREFILLED PASSWORDS
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupHostel, setSignupHostel] = useState('Rajendra Bhawan');
  const [signupRoom, setSignupRoom] = useState('');
  const [signupEnrollment, setSignupEnrollment] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read return URL from state if user was redirected from a protected route
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const modeParam = params.get('mode');

    if (modeParam === 'signup') {
      setAuthMode('signup');
    } else if (roleParam === 'staff' || roleParam === 'admin' || roleParam === 'student') {
      setSelectedRole(roleParam as UserRole);
      setAuthMode('signin');
    }
  }, [location.search]);

  // When changing roles, clear password and error message
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPassword('');
    setErrorMessage('');
  };

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your IIT Roorkee institutional email ID.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (!isValidIITREmail(email)) {
      setErrorMessage('Invalid domain: Please provide a valid IIT Roorkee email ending in @iitr.ac.in or @*.iitr.ac.in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = login(email, password, selectedRole);

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

  // Handle Student Sign Up submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (!signupEmail.trim()) {
      setErrorMessage('Please enter your IIT Roorkee institutional email ID.');
      return;
    }

    if (!isValidIITREmail(signupEmail)) {
      setErrorMessage('Invalid domain: Student accounts must use an IIT Roorkee email ending in @iitr.ac.in or @*.iitr.ac.in (e.g. name@me.iitr.ac.in).');
      return;
    }

    if (!signupHostel.trim() || !signupRoom.trim()) {
      setErrorMessage('Please specify your current Bhawan/Hostel and Room number.');
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = signupStudent({
        name: signupName.trim(),
        email: signupEmail.trim(),
        hostel: signupHostel,
        room: signupRoom.trim(),
        enrollmentNo: signupEnrollment.trim() || undefined,
        phone: signupPhone.trim() || '+91 98765 00000',
        password: signupPassword.trim()
      });

      if (res.success) {
        success('Registration Successful', `Welcome ${signupName}! Your resident account has been created.`);
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your details.');
        error('Registration Failed', res.error);
      }
    } finally {
      setIsSubmitting(false);
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
              {authMode === 'signin' ? 'Campus Portal Authentication' : 'New Resident Registration'}
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              {authMode === 'signin' 
                ? 'Sign in using your institutional IIT Roorkee credentials.' 
                : 'Students and campus residents can register their room profile below.'}
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Bar */}
        <div className="flex rounded-2xl p-1 bg-stone-200/70 border border-stone-300 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
              setPassword('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#7A1528]" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* MODE 1: SIGN IN FORM */}
          {authMode === 'signin' && (
            <div className="space-y-6">
              {/* Role Tabs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Role
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

                <p className="text-[11px] text-stone-500 mt-2">
                  {selectedRole === 'student' && 'Students can log in with their registered account or create a new resident account.'}
                  {selectedRole === 'staff' && 'Maintenance technicians authenticate with their authorized staff credentials.'}
                  {selectedRole === 'admin' && 'Wardens & Estate Administrators authenticate with official administration credentials.'}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
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
                      placeholder={
                        selectedRole === 'student' 
                          ? 'e.g. yourname@me.iitr.ac.in' 
                          : selectedRole === 'staff' 
                          ? 'e.g. staff.id@iitr.ac.in' 
                          : 'warden.rajendra@iitr.ac.in'
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password - ABSOLUTELY NO AUTOMATIC PASSWORDS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-stone-400 mt-2"
                >
                  <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Student Sign Up Link prompt */}
              {selectedRole === 'student' && (
                <div className="pt-2 text-center text-xs text-stone-600">
                  <span>Don't have an account yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#7A1528] hover:underline"
                  >
                    Sign Up as a Student / Resident ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: STUDENT SIGN UP FORM */}
          {authMode === 'signup' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <UserPlus className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>
                  Register with your Bhawan room details to log maintenance complaints and track repair progress.
                </span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Rohan Gupta"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* IITR Email */}
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
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. rohan.gupta@cs.iitr.ac.in"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Hostel & Room */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Hostel / Bhawan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={signupHostel}
                      onChange={(e) => setSignupHostel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528]"
                    >
                      {IITR_HOSTELS.map(h => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Room Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={signupRoom}
                      onChange={(e) => setSignupRoom(e.target.value)}
                      placeholder="e.g. R-214 or B-105"
                      className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528]"
                    />
                  </div>
                </div>

                {/* Enrollment & Phone (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Enrollment / Student ID
                    </label>
                    <input
                      type="text"
                      value={signupEnrollment}
                      onChange={(e) => setSignupEnrollment(e.target.value)}
                      placeholder="e.g. 23115088"
                      className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528]"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-8 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:bg-white focus:border-[#7A1528] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Registration */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-stone-400 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering Account...' : 'Create Resident Account & Enter Portal'}</span>
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-stone-600">
                <span>Already have a registered resident account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setSelectedRole('student');
                    setErrorMessage('');
                  }}
                  className="font-bold text-[#7A1528] hover:underline"
                >
                  Sign In here ➔
                </button>
              </div>
            </div>
          )}
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
