# IITR FixIt — Campus Room Maintenance & Repair Platform

> **“Campus maintenance, without the follow-up.”**  
> A centralized, transparent room repair and estate service portal engineered for students, research scholars, and residents of the **Indian Institute of Technology Roorkee (IIT Roorkee)**.

---

## 🏛️ Overview & Product Vision

In large residential university campuses like IIT Roorkee—with over 14 student bhawans, married scholar residences, and faculty quarters—traditional room maintenance often relied on paper registers, unrecorded verbal complaints, and manual follow-ups with hostel caretakers.

**IITR FixIt** transforms campus facility operations into an accountable, transparent university SaaS platform:
- **Instant Digital Reporting**: Residents log room issues in 60 seconds across 8 specialized trade categories with photo attachments and preferred inspection windows.
- **Human-Readable Ticket IDs**: Generates sequential readable IDs (e.g., `FIX-2026-001`).
- **6-Stage Lifecycle Tracking**: Real-time visual progress tracker from `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
- **Role-Aware Permissions**: Specialized views for **Residents/Students**, **Maintenance Staff**, and **Wardens/Estate Admins**.
- **Auditable History & Two-Way Dialogue**: Complete status transition timeline, resident-staff communication, and private internal staff work notes.
- **Zero API Keys Required**: Built-in `localStorage` persistence layer with reactive cross-tab state synchronization and complete preloaded seed data.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Type-safe components, functional hooks, strict typings |
| **Build & Tooling** | Vite 8 + `@tailwindcss/vite` | Sub-second HMR and instant production bundling |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS | IITR heritage maroon accents (`#7A1528`), warm off-white canvas (`#FAF9F6`), charcoal stone neutrals |
| **Routing** | React Router v7 (`react-router-dom`) | Declarative client-side routing with clean URL parameters |
| **Icons & Visuals** | Lucide Icons (`lucide-react`) | Pixel-crisp engineering and facilities iconography |
| **Data Visualization** | Recharts 3 | Responsive SVG charts for category volume, status donuts, trends, and hostel loads |
| **Data Layer & Storage** | LocalStorage Service Layer | Event-driven architecture with clean service abstraction ready for backend integration |

---

## 👥 Demo User Personas & Role Switcher

A persistent **Demo Mode Banner** at the top of the interface allows instant one-click switching between three user perspectives:

1. **Resident / Student (`Aarav Sharma`)**
   - **Affiliation**: Mechanical & Industrial Engineering (Enrollment: `22115042`)
   - **Room Location**: Rajendra Bhawan, Wing C, Room `R-314`
   - **Capabilities**: Submit new tickets, attach room photos, track 6-step progress, message technicians, reopen resolved tickets with a reason, and rate service (1–5 stars).

2. **Maintenance Staff (`Rajesh Kumar`)**
   - **Affiliation**: Estate & Works — Electrical Maintenance Unit
   - **Capabilities**: Work queue filterable by *My Assigned Jobs*, *Unassigned Pool*, and *High & Emergency*; claim unassigned jobs; transition to *In Progress*; write private internal technician notes; submit completion reports.

3. **Warden / Estate Administrator (`Dr. P. K. Sen`)**
   - **Affiliation**: Council of Wardens / Estate Directorate
   - **Capabilities**: Executive command center, real-time KPI metrics, Recharts visual analytics, priority overrides, technician workload reassignments, hostel management, and CSV report export.

---

## 🧭 Routes & Features

| Route | Page | Description |
|---|---|---|
| `/` | **Landing Page** | Value proposition, live metrics ticker, 4-step *How It Works*, trade category grid, SLA guarantees, and quick ticket ID lookup. |
| `/dashboard` | **Role Dashboard** | Role-aware router rendering the **Resident Dashboard**, **Technician Work Queue**, or **Warden Command Center** depending on active persona. |
| `/requests` | **Requests Directory** | Searchable, multi-filtered list and table view with filters for status, category, priority, hostel, and sort controls. |
| `/requests/new` | **Submit Request** | Form with category picker, hostel & room selectors, preferred access slots, drag-drop photo upload with sample campus photo presets, and emergency modal triggers. |
| `/requests/:id` | **Ticket Details** | Full audit timeline, 6-step visual tracker, photo lightbox, role-gated action buttons (Claim, Start, Resolve, Reopen, Rate), and discussion thread. |
| `/track` | **Quick Tracker** | Direct lookup page to inspect any ticket status without logging in or switching roles. |

---

## 🗄️ Clean Data Architecture & Backend Migration (Supabase / Postgres)

All storage logic is encapsulated within `src/services/storage.ts` and `src/services/requestService.ts`. UI components interact purely through standard typed interfaces:

```typescript
// Example: src/types/index.ts
export interface RequestItem {
  id: string; // e.g. FIX-2026-001
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  hostel: string;
  block: string;
  roomNumber: string;
  preferredAccessTime: PreferredAccessTime;
  photos: string[];
  residentId: string;
  residentName: string;
  residentPhone: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  timeline: RequestTimelineEvent[];
  comments: RequestComment[];
}
```

### Migrating to Supabase:
To replace `localStorage` with a real Supabase database:
1. Create a `requests` and `comments` table in PostgreSQL matching the interface above.
2. Replace the function bodies in `src/services/requestService.ts`:
   ```typescript
   // e.g. In requestService.ts:
   async getAllRequests(): Promise<RequestItem[]> {
     const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
     return data;
   }
   ```
3. Enable Supabase Realtime subscriptions in `RequestContext.tsx` for instant push updates across student and staff phones.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (Node 24 LTS verified)
- npm 10+

### Installation & Run

```bash
# 1. Clone repository
git clone <repo-url>
cd "community outreach"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# Visit http://127.0.0.1:5173/
```

### Production Build & Linting

```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## ⚠️ Demonstration Disclaimer

> **Disclaimer**: **IITR FixIt** is an educational, interactive software demonstration and prototype. It uses browser `localStorage` to simulate real-world university maintenance operations. It does not access, store, or modify actual student records or servers belonging to the Indian Institute of Technology Roorkee. All emergency contacts and staff numbers are placeholder demonstrations.
