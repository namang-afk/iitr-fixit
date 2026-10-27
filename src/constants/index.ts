import { CategoryMeta, RequestCategory, RequestPriority, RequestStatus, UserProfile } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'electrical',
    name: 'Electrical & Power',
    description: 'Tube lights, switches, fans, sockets, tripping MCB, or cooler points',
    icon: 'Zap',
    slaHours: 24,
    examples: ['Ceiling fan humming/not rotating', 'Flickering LED tube light', 'Burnt 16A power socket', 'Room MCB tripping frequently']
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Water Supply',
    description: 'Leaking taps, washbasin drainage, flush tanks, geyser issues, or showers',
    icon: 'Droplets',
    slaHours: 24,
    examples: ['Continuous tap dripping', 'Washbasin drain pipe blocked', 'Geyser water not heating', 'Toilet flush valve broken']
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Furniture',
    description: 'Broken study table, chair, door lock, cupboard hinge, window latch, or bed frame',
    icon: 'Hammer',
    slaHours: 48,
    examples: ['Door lock cylinder jammed', 'Cupboard hinge loose', 'Study chair wheel broken', 'Window shutter latch missing']
  },
  {
    id: 'internet',
    name: 'Internet & LAN / Wi-Fi',
    description: 'Damaged RJ45 LAN port, low Wi-Fi signal in room, IP conflict, or authentication',
    icon: 'Wifi',
    slaHours: 12,
    examples: ['Wall RJ45 Ethernet port cracked', 'Wi-Fi gateway unreachable', 'Frequent packet drops during lectures', 'MAC address re-binding needed']
  },
  {
    id: 'cleaning',
    name: 'Housekeeping & Sanitation',
    description: 'Room deep cleaning, corridor dustbins, washroom hygiene, or debris clearance',
    icon: 'Sparkles',
    slaHours: 24,
    examples: ['Stagnant water near doorway', 'Deep cleaning after hostel shifting', 'Dustbin overflow in corridor', 'Cobweb removal from high ceiling']
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    description: 'Termite infestation, mosquitoes, insects, bird netting, or stray animal containment',
    icon: 'Bug',
    slaHours: 48,
    examples: ['Termite dust on study bookshelf', 'High mosquito breeding in balcony', 'Wasp nest near window sill', 'Need room spray treatment']
  },
  {
    id: 'civil_works',
    name: 'Civil Works & Masonry',
    description: 'Wall plaster peeling, roof dampness, broken floor tile, or water seepage',
    icon: 'Building2',
    slaHours: 72,
    examples: ['Ceiling dampness/leakage after rain', 'Cracked floor tile causing tripping', 'Loose balcony railing', 'Wall paint peeling off']
  },
  {
    id: 'other',
    name: 'Other Facilities',
    description: 'Curtain rods, common room equipment, water cooler, or miscellaneous hostel issues',
    icon: 'HelpCircle',
    slaHours: 48,
    examples: ['Corridor water cooler filter dirty', 'Curtain bracket fallen off', 'Common room TV remote issue', 'Gym equipment loose bolt']
  }
];

export const STATUS_META: Record<RequestStatus, { label: string; bg: string; text: string; border: string; step: number; description: string }> = {
  submitted: {
    label: 'Submitted',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    step: 1,
    description: 'Request successfully logged and queued for estate intake'
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    step: 2,
    description: 'Reviewed by hostel supervisor / warden; determining department priority'
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    step: 3,
    description: 'Work order dispatched to specialized estate technician'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    step: 4,
    description: 'Technician on-site or procuring necessary parts & fixtures'
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    step: 5,
    description: 'Repair work completed; awaiting resident inspection and feedback'
  },
  closed: {
    label: 'Closed',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    step: 6,
    description: 'Ticket finalized and archived in estate records'
  }
};

export const PRIORITY_META: Record<RequestPriority, { label: string; bg: string; text: string; border: string; sla: string; description: string }> = {
  low: {
    label: 'Low',
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    sla: '3 – 5 Days',
    description: 'Minor aesthetic or non-urgent issues not impacting daily study or sleep'
  },
  normal: {
    label: 'Normal',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    sla: '24 – 48 Hours',
    description: 'Standard maintenance issues requiring prompt routine repair'
  },
  high: {
    label: 'High',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    sla: 'Within 24 Hours',
    description: 'Significant inconvenience such as total fan failure in summer or water choke'
  },
  emergency: {
    label: 'Emergency',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    sla: 'Immediate (< 2 Hours)',
    description: 'Safety hazards, electrical sparking, main pipe bursts, or security lockouts'
  }
};

export const IITR_HOSTELS = [
  { id: 'rajendra', name: 'Rajendra Bhawan', type: 'Boys Hostel', capacity: 750, wings: ['Wing A', 'Wing B', 'Wing C', 'Wing D'] },
  { id: 'cautley', name: 'Cautley Bhawan', type: 'Boys Hostel', capacity: 600, wings: ['Block 1', 'Block 2', 'Block 3'] },
  { id: 'ganga', name: 'Ganga Bhawan', type: 'Boys Hostel', capacity: 550, wings: ['East Wing', 'West Wing'] },
  { id: 'govind', name: 'Govind Bhawan', type: 'Boys Hostel', capacity: 620, wings: ['Wing A', 'Wing B', 'Wing C'] },
  { id: 'jawahar', name: 'Jawahar Bhawan', type: 'Boys Hostel', capacity: 700, wings: ['Block A', 'Block B', 'Block C'] },
  { id: 'radhakrishnan', name: 'Radhakrishnan Bhawan', type: 'Boys Hostel', capacity: 650, wings: ['Wing 1', 'Wing 2', 'Wing 3'] },
  { id: 'ravindra', name: 'Ravindra Bhawan', type: 'Boys Hostel', capacity: 720, wings: ['Block A', 'Block B'] },
  { id: 'azad', name: 'Azad Bhawan', type: 'Boys Hostel', capacity: 600, wings: ['Wing A', 'Wing B'] },
  { id: 'malviya', name: 'Malviya Bhawan', type: 'Boys Hostel', capacity: 580, wings: ['East Block', 'West Block'] },
  { id: 'kasturba', name: 'Kasturba Bhawan', type: 'Girls Hostel', capacity: 800, wings: ['Tower 1', 'Tower 2', 'Tower 3'] },
  { id: 'sarojini', name: 'Sarojini Bhawan', type: 'Girls Hostel', capacity: 750, wings: ['Block A', 'Block B', 'Block C'] },
  { id: 'indira', name: 'Indira Bhawan', type: 'Girls Hostel', capacity: 600, wings: ['Wing 1', 'Wing 2'] },
  { id: 'vigyan_kunj', name: 'Vigyan Kunj', type: 'Married Scholars & PG', capacity: 350, wings: ['Block A', 'Block B'] },
  { id: 'an_khosla', name: 'A.N. Khosla Bhawan', type: 'International Scholars', capacity: 200, wings: ['Main Block'] }
];

export const ACCESS_TIME_SLOTS = [
  { id: 'morning', label: 'Morning (09:00 AM – 12:00 PM)', hint: 'Ideal before lab hours or classes' },
  { id: 'afternoon', label: 'Afternoon (12:00 PM – 04:00 PM)', hint: 'Lunch break window' },
  { id: 'evening', label: 'Evening (04:00 PM – 07:00 PM)', hint: 'After classroom sessions' },
  { id: 'anytime', label: 'Anytime (Resident or Roommate present)', hint: 'Technician may visit whenever dispatched' }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'user_student_1',
    name: 'Aarav Sharma',
    role: 'student',
    email: 'aarav.sharma@me.iitr.ac.in',
    phone: '+91 98765 43210',
    hostel: 'Rajendra Bhawan',
    room: 'R-314',
    enrollmentNo: '22115042',
    department: 'Mechanical & Industrial Engineering'
  },
  staff: {
    id: 'user_staff_1',
    name: 'Rajesh Kumar',
    role: 'staff',
    email: 'rajesh.estate@iitr.ac.in',
    phone: '+91 94120 12345',
    department: 'Estate & Works – Electrical Unit'
  },
  admin: {
    id: 'user_admin_1',
    name: 'Dr. P. K. Sen',
    role: 'admin',
    email: 'warden.rajendra@iitr.ac.in',
    phone: '+91 94129 99888',
    department: 'Council of Wardens / Estate Directorate'
  }
};

export const DEMO_EMERGENCY_CONTACTS = [
  {
    title: 'Estate Electrical Control Substation',
    number: '+91 1332 284000 (Demo Placeholder)',
    timing: '24x7 Emergency Desk',
    note: 'For high voltage sparking, power blackout, smoke or burning smell'
  },
  {
    title: 'Central Water Works & Plumbing',
    number: '+91 1332 284001 (Demo Placeholder)',
    timing: '06:00 AM – 10:00 PM Daily',
    note: 'For burst water lines, continuous overhead tank overflow, or severe washroom flooding'
  },
  {
    title: 'Chief Security Officer Main Gate',
    number: '+91 1332 284111 (Demo Placeholder)',
    timing: '24x7 Campus Security',
    note: 'For locked door emergency, hazard cordon, or physical safety assistance'
  },
  {
    title: 'Institute Health Centre (Dispensary)',
    number: '+91 1332 284222 (Demo Placeholder)',
    timing: '24x7 Ambulance / Emergency Ward',
    note: 'For personal injury, cuts, burns, or urgent medical transport'
  }
];

export const PRESET_MOCK_PHOTOS = [
  {
    id: 'photo_tap',
    label: 'Leaking Brass Tap & Basin',
    category: 'plumbing',
    url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo_switch',
    label: 'Burnt Power Socket Plate',
    category: 'electrical',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo_lan',
    label: 'Damaged RJ45 LAN Wall Port',
    category: 'internet',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo_chair',
    label: 'Broken Study Chair Wheel',
    category: 'carpentry',
    url: 'https://images.unsplash.com/photo-1580481077195-c9a92966e60b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo_wall',
    label: 'Wall Moisture & Peeling Paint',
    category: 'civil_works',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  }
];
