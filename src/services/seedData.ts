import { RequestItem, StaffMember } from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Rajesh Kumar',
    specialty: 'electrical',
    phone: '+91 94120 12345',
    email: 'rajesh.estate@iitr.ac.in',
    department: 'Estate & Works – Electrical Unit',
    activeJobsCount: 3,
    completedJobsCount: 42,
    status: 'on_job'
  },
  {
    id: 'staff_2',
    name: 'Suresh Verma',
    specialty: 'plumbing',
    phone: '+91 94120 23456',
    email: 'suresh.waterworks@iitr.ac.in',
    department: 'Estate & Works – Water Supply',
    activeJobsCount: 2,
    completedJobsCount: 56,
    status: 'available'
  },
  {
    id: 'staff_3',
    name: 'Amit Bisht',
    specialty: 'carpentry',
    phone: '+91 94120 34567',
    email: 'amit.carpentry@iitr.ac.in',
    department: 'Estate & Works – Carpentry Unit',
    activeJobsCount: 1,
    completedJobsCount: 29,
    status: 'available'
  },
  {
    id: 'staff_4',
    name: 'Vikram Singh',
    specialty: 'internet',
    phone: '+91 94120 45678',
    email: 'vikram.icc@iitr.ac.in',
    department: 'Institute Computer Center (ICC)',
    activeJobsCount: 2,
    completedJobsCount: 68,
    status: 'available'
  },
  {
    id: 'staff_5',
    name: 'Ramesh Chand',
    specialty: 'civil_works',
    phone: '+91 94120 56789',
    email: 'ramesh.civil@iitr.ac.in',
    department: 'Estate & Works – Civil Maintenance',
    activeJobsCount: 4,
    completedJobsCount: 31,
    status: 'on_job'
  }
];

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'FIX-2026-001',
    title: 'Ceiling Fan Regulator Stuck & Motor Humming',
    description: 'The ceiling fan regulator knob is completely stuck at level 5 speed. When switched on, there is a loud vibrating humming noise and strong vibration in the ceiling hook.',
    category: 'electrical',
    priority: 'high',
    status: 'in_progress',
    hostel: 'Rajendra Bhawan',
    block: 'Wing C',
    roomNumber: 'R-314',
    preferredAccessTime: 'afternoon',
    photos: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    ],
    residentId: 'user_student_1',
    residentName: 'Aarav Sharma',
    residentEnrollment: '22115042',
    residentPhone: '+91 98765 43210',
    residentEmail: 'aarav.sharma@me.iitr.ac.in',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Rajesh Kumar',
    assignedStaffPhone: '+91 94120 12345',
    assignedStaffRole: 'Senior Electrical Technician',
    createdAt: '2026-10-25T14:30:00Z',
    updatedAt: '2026-10-26T11:15:00Z',
    timeline: [
      {
        id: 'tl_1',
        timestamp: '2026-10-25T14:30:00Z',
        actorName: 'Aarav Sharma',
        actorRole: 'student',
        action: 'Request Submitted',
        note: 'Issue created by resident via portal with attached switchboard photo.'
      },
      {
        id: 'tl_2',
        timestamp: '2026-10-25T16:00:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Warden Review Approved',
        fromStatus: 'submitted',
        toStatus: 'under_review',
        note: 'High priority approved due to exam week study hours.'
      },
      {
        id: 'tl_3',
        timestamp: '2026-10-26T09:30:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Technician Assigned',
        fromStatus: 'under_review',
        toStatus: 'assigned',
        note: 'Dispatched to Rajesh Kumar (Electrical Wing).'
      },
      {
        id: 'tl_4',
        timestamp: '2026-10-26T11:15:00Z',
        actorName: 'Rajesh Kumar',
        actorRole: 'staff',
        action: 'Work Started on Site',
        fromStatus: 'assigned',
        toStatus: 'in_progress',
        note: 'Inspected switchboard. Stepped electronic regulator burnt; replaced with heavy-duty model. Inspecting fan capacitor now.'
      }
    ],
    comments: [
      {
        id: 'c_1',
        authorName: 'Aarav Sharma',
        authorRole: 'student',
        text: 'I have a test at 11 AM today. My roommate will be in the room from 1:30 PM to let the technician in.',
        createdAt: '2026-10-26T08:00:00Z',
        isInternalStaffOnly: false
      },
      {
        id: 'c_2',
        authorName: 'Rajesh Kumar',
        authorRole: 'staff',
        text: 'Noted. I will visit your room at 2:00 PM with the replacement parts.',
        createdAt: '2026-10-26T09:45:00Z',
        isInternalStaffOnly: false
      },
      {
        id: 'c_3',
        authorName: 'Rajesh Kumar',
        authorRole: 'staff',
        text: 'Internal Note: Capacitors from batch 10/25 are low in central store. Issued last spare unit for Rajendra C-Block.',
        createdAt: '2026-10-26T11:20:00Z',
        isInternalStaffOnly: true
      }
    ]
  },
  {
    id: 'FIX-2026-002',
    title: 'Severe Washroom Water Leakage & Slippery Floor',
    description: 'The cold water inlet pipe below the washbasin has developed a continuous leak. Water is accumulating near the room threshold creating slip hazard.',
    category: 'plumbing',
    priority: 'emergency',
    status: 'assigned',
    hostel: 'Cautley Bhawan',
    block: 'Block 2',
    roomNumber: '219',
    preferredAccessTime: 'anytime',
    photos: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80'
    ],
    residentId: 'user_cautley_1',
    residentName: 'Rohan Mehra',
    residentEnrollment: '23112019',
    residentPhone: '+91 98111 22334',
    residentEmail: 'rohan.mehra@ce.iitr.ac.in',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Suresh Verma',
    assignedStaffPhone: '+91 94120 23456',
    assignedStaffRole: 'Estate Plumber Lead',
    createdAt: '2026-10-27T08:10:00Z',
    updatedAt: '2026-10-27T08:45:00Z',
    timeline: [
      {
        id: 'tl_201',
        timestamp: '2026-10-27T08:10:00Z',
        actorName: 'Rohan Mehra',
        actorRole: 'student',
        action: 'Emergency Request Logged',
        note: 'Marked emergency due to water flooding room corridor.'
      },
      {
        id: 'tl_202',
        timestamp: '2026-10-27T08:45:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Fast-Track Assignment',
        fromStatus: 'submitted',
        toStatus: 'assigned',
        note: 'Assigned to Suresh Verma for immediate isolation valve shutdown.'
      }
    ],
    comments: [
      {
        id: 'c_201',
        authorName: 'Ramesh Supervisor',
        authorRole: 'admin',
        text: 'Emergency priority confirmed. Suresh is en route with plumbing tool kit.',
        createdAt: '2026-10-27T08:46:00Z',
        isInternalStaffOnly: false
      }
    ]
  },
  {
    id: 'FIX-2026-003',
    title: 'Damaged RJ45 LAN Wall Socket Pin Bent',
    description: 'The Ethernet wall port in room R-314 has broken internal copper pins. Campus wired internet will not establish link with my laptop.',
    category: 'internet',
    priority: 'normal',
    status: 'resolved',
    hostel: 'Rajendra Bhawan',
    block: 'Wing C',
    roomNumber: 'R-314',
    preferredAccessTime: 'evening',
    photos: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
    ],
    residentId: 'user_student_1',
    residentName: 'Aarav Sharma',
    residentEnrollment: '22115042',
    residentPhone: '+91 98765 43210',
    residentEmail: 'aarav.sharma@me.iitr.ac.in',
    assignedStaffId: 'staff_4',
    assignedStaffName: 'Vikram Singh',
    assignedStaffPhone: '+91 94120 45678',
    assignedStaffRole: 'ICC Network Technician',
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-23T17:30:00Z',
    resolvedAt: '2026-10-23T17:30:00Z',
    resolutionNotes: 'Replaced RJ45 keystone jack in wall faceplate and re-crimped Cat6 punch-down connector. Tested Gigabit link speed with Fluke cable tester; verified 940 Mbps throughput to campus core switch.',
    rating: 5,
    feedbackComment: 'Very fast turnaround by Vikram ji. Internet speed is rock solid now!',
    timeline: [
      {
        id: 'tl_301',
        timestamp: '2026-10-22T10:00:00Z',
        actorName: 'Aarav Sharma',
        actorRole: 'student',
        action: 'Request Submitted'
      },
      {
        id: 'tl_302',
        timestamp: '2026-10-22T12:00:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Assigned to ICC Team',
        fromStatus: 'submitted',
        toStatus: 'assigned'
      },
      {
        id: 'tl_303',
        timestamp: '2026-10-23T16:00:00Z',
        actorName: 'Vikram Singh',
        actorRole: 'staff',
        action: 'Work Started',
        fromStatus: 'assigned',
        toStatus: 'in_progress'
      },
      {
        id: 'tl_304',
        timestamp: '2026-10-23T17:30:00Z',
        actorName: 'Vikram Singh',
        actorRole: 'staff',
        action: 'Marked Resolved',
        fromStatus: 'in_progress',
        toStatus: 'resolved',
        note: 'New Cat6 keystone jack installed.'
      }
    ],
    comments: [
      {
        id: 'c_301',
        authorName: 'Vikram Singh',
        authorRole: 'staff',
        text: 'Tested cable continuity and verified ping to 10.0.0.1. Please test your connection and close the ticket if satisfied.',
        createdAt: '2026-10-23T17:35:00Z',
        isInternalStaffOnly: false
      }
    ]
  },
  {
    id: 'FIX-2026-004',
    title: 'Study Table Drawer Roller Rail Detached',
    description: 'The right side slider rail of the wooden study table drawer has detached. Ball bearings have fallen out and drawer cannot be pushed in.',
    category: 'carpentry',
    priority: 'normal',
    status: 'under_review',
    hostel: 'Kasturba Bhawan',
    block: 'Tower 2',
    roomNumber: 'K-408',
    preferredAccessTime: 'morning',
    photos: [
      'https://images.unsplash.com/photo-1580481077195-c9a92966e60b?auto=format&fit=crop&w=600&q=80'
    ],
    residentId: 'user_kb_1',
    residentName: 'Ananya Verma',
    residentEnrollment: '22118014',
    residentPhone: '+91 98222 33445',
    residentEmail: 'ananya.verma@ch.iitr.ac.in',
    createdAt: '2026-10-26T18:20:00Z',
    updatedAt: '2026-10-27T09:00:00Z',
    timeline: [
      {
        id: 'tl_401',
        timestamp: '2026-10-26T18:20:00Z',
        actorName: 'Ananya Verma',
        actorRole: 'student',
        action: 'Request Submitted'
      },
      {
        id: 'tl_402',
        timestamp: '2026-10-27T09:00:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Warden Verification Underway',
        fromStatus: 'submitted',
        toStatus: 'under_review',
        note: 'Pending batch assignment to carpentry supervisor Amit Bisht.'
      }
    ],
    comments: []
  },
  {
    id: 'FIX-2026-005',
    title: 'Moisture Dampness & Paint Flaking on Balcony Wall',
    description: 'Heavy seepage visible on the north exterior wall following last week rainfall. White efflorescence and plaster falling onto the floor.',
    category: 'civil_works',
    priority: 'low',
    status: 'submitted',
    hostel: 'Ganga Bhawan',
    block: 'West Wing',
    roomNumber: 'G-112',
    preferredAccessTime: 'afternoon',
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    residentId: 'user_ganga_1',
    residentName: 'Devansh Pandey',
    residentEnrollment: '24114008',
    residentPhone: '+91 97110 55667',
    residentEmail: 'devansh.p@ee.iitr.ac.in',
    createdAt: '2026-10-27T07:45:00Z',
    updatedAt: '2026-10-27T07:45:00Z',
    timeline: [
      {
        id: 'tl_501',
        timestamp: '2026-10-27T07:45:00Z',
        actorName: 'Devansh Pandey',
        actorRole: 'student',
        action: 'Request Submitted'
      }
    ],
    comments: []
  },
  {
    id: 'FIX-2026-006',
    title: 'Termite Dust Noticed Behind Bookshelf & Wardrobe Base',
    description: 'Fine wooden dust powdery residue appearing continuously under the built-in wardrobe corner. Suspecting active subterranean termite tunnel.',
    category: 'pest_control',
    priority: 'high',
    status: 'assigned',
    hostel: 'Jawahar Bhawan',
    block: 'Block B',
    roomNumber: 'J-204',
    preferredAccessTime: 'morning',
    photos: [],
    residentId: 'user_jawahar_1',
    residentName: 'Priya Iyer',
    residentEnrollment: '21111055',
    residentPhone: '+91 98450 77889',
    residentEmail: 'priya.iyer@bt.iitr.ac.in',
    assignedStaffId: 'staff_5',
    assignedStaffName: 'Ramesh Chand',
    assignedStaffPhone: '+91 94120 56789',
    assignedStaffRole: 'Estate Field Inspector',
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-10-26T14:00:00Z',
    timeline: [
      {
        id: 'tl_601',
        timestamp: '2026-10-25T11:00:00Z',
        actorName: 'Priya Iyer',
        actorRole: 'student',
        action: 'Request Submitted'
      },
      {
        id: 'tl_602',
        timestamp: '2026-10-26T14:00:00Z',
        actorName: 'Ramesh Supervisor',
        actorRole: 'admin',
        action: 'Assigned to Pest Agency Liaison',
        fromStatus: 'submitted',
        toStatus: 'assigned',
        note: 'Contractor agency scheduled for chemical injection drill.'
      }
    ],
    comments: [
      {
        id: 'c_601',
        authorName: 'Ramesh Chand',
        authorRole: 'staff',
        text: 'Chemical drill scheduled for Thursday morning 10 AM. Please keep books safely covered.',
        createdAt: '2026-10-26T15:10:00Z',
        isInternalStaffOnly: false
      }
    ]
  },
  {
    id: 'FIX-2026-007',
    title: 'Corridor Water Cooler Filter Replacement & Deep Clean',
    description: 'The drinking water cooler in 2nd floor corridor has poor cooling and water taste is earthy. Filter cartridge replacement required.',
    category: 'other',
    priority: 'normal',
    status: 'closed',
    hostel: 'Sarojini Bhawan',
    block: 'Block C',
    roomNumber: 'Corridor 2F',
    preferredAccessTime: 'anytime',
    photos: [],
    residentId: 'user_sarojini_1',
    residentName: 'Tanvi Nair',
    residentEnrollment: '22119020',
    residentPhone: '+91 98990 11223',
    residentEmail: 'tanvi.nair@ar.iitr.ac.in',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Suresh Verma',
    assignedStaffPhone: '+91 94120 23456',
    assignedStaffRole: 'Water Works Supervisor',
    createdAt: '2026-10-20T09:00:00Z',
    updatedAt: '2026-10-22T16:00:00Z',
    resolvedAt: '2026-10-22T14:00:00Z',
    closedAt: '2026-10-22T16:00:00Z',
    resolutionNotes: 'Dual stage sediment and activated carbon filter cartridges replaced. Stainless steel reservoir sterilized with food-grade ozone wash. TDS measured at 110 ppm.',
    rating: 5,
    feedbackComment: 'Water is clean and properly chilled now. Thank you!',
    timeline: [
      {
        id: 'tl_701',
        timestamp: '2026-10-20T09:00:00Z',
        actorName: 'Tanvi Nair',
        actorRole: 'student',
        action: 'Request Submitted'
      },
      {
        id: 'tl_702',
        timestamp: '2026-10-22T14:00:00Z',
        actorName: 'Suresh Verma',
        actorRole: 'staff',
        action: 'Maintenance Completed',
        fromStatus: 'in_progress',
        toStatus: 'resolved'
      },
      {
        id: 'tl_703',
        timestamp: '2026-10-22T16:00:00Z',
        actorName: 'Tanvi Nair',
        actorRole: 'student',
        action: 'Ticket Closed by Resident',
        fromStatus: 'resolved',
        toStatus: 'closed',
        note: 'Confirmed satisfied with 5-star rating.'
      }
    ],
    comments: []
  },
  {
    id: 'FIX-2026-008',
    title: 'Room Door Heavy Slamming - Hydraulic Closer Loose',
    description: 'The overhead pneumatic door closer is leaking oil and has lost damping. Door slams loudly with wind drafts, shaking adjacent wall panels.',
    category: 'carpentry',
    priority: 'low',
    status: 'in_progress',
    hostel: 'Govind Bhawan',
    block: 'Wing B',
    roomNumber: 'G-105',
    preferredAccessTime: 'afternoon',
    photos: [],
    residentId: 'user_govind_1',
    residentName: 'Kunal Joshi',
    residentEnrollment: '23116031',
    residentPhone: '+91 98330 44556',
    residentEmail: 'kunal.j@cs.iitr.ac.in',
    assignedStaffId: 'staff_3',
    assignedStaffName: 'Amit Bisht',
    assignedStaffPhone: '+91 94120 34567',
    assignedStaffRole: 'Carpentry Specialist',
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-27T10:00:00Z',
    timeline: [
      {
        id: 'tl_801',
        timestamp: '2026-10-26T12:00:00Z',
        actorName: 'Kunal Joshi',
        actorRole: 'student',
        action: 'Request Submitted'
      },
      {
        id: 'tl_802',
        timestamp: '2026-10-27T10:00:00Z',
        actorName: 'Amit Bisht',
        actorRole: 'staff',
        action: 'Began Door Fitting Adjustment',
        fromStatus: 'assigned',
        toStatus: 'in_progress'
      }
    ],
    comments: []
  }
];
