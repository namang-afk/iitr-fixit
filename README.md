# IITR FixIt — Campus Room Maintenance & Repair Platform

> **“Campus maintenance, without the follow-up.”**  
> A centralized, transparent room repair and estate service portal engineered for students, research scholars, and residents of the **Indian Institute of Technology Roorkee (IIT Roorkee)**.

---

## 🏛️ Overview & Product Vision

In large residential university campuses like IIT Roorkee—with over 15 student bhawans (including Rajiv Bhawan), married scholar residences, and faculty quarters—traditional room maintenance often relied on paper registers, unrecorded verbal complaints, and manual follow-ups with hostel caretakers.

**IITR FixIt** transforms campus facility operations into an accountable, transparent university SaaS platform:
- **Institutional Single Sign-On (SSO)**: Users authenticate using their official IIT Roorkee email address (`@iitr.ac.in` or `@*.iitr.ac.in`).
- **Strict Role-Based Access Control (RBAC)**: Separate authorization levels for **Students / Residents**, **Maintenance Staff**, and **Wardens / Estate Administrators**. Students cannot access warden or staff administrative screens, and vice versa.
- **Instant Digital Reporting**: Residents log room issues in 60 seconds across 8 specialized trade categories with photo attachments and preferred inspection windows.
- **Human-Readable Ticket IDs**: Generates sequential readable IDs (e.g., `FIX-2026-001`).
- **6-Stage Lifecycle Tracking**: Real-time visual progress tracker from `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
- **Auditable History & Two-Way Dialogue**: Complete status transition timeline, resident-staff communication, and private internal staff work notes.
- **Production Server Ready**: Bundled with SPA rewrite rules for **Vercel**, **Netlify**, **Render**, **Nginx**, and **Docker**.

---

## 🔐 Authentication & Strict Role-Based Access Control (RBAC)

The platform enforces campus access boundaries:

| Role | Authorized Email Patterns | Authorized Views | Prohibited Views |
|---|---|---|---|
| **Resident / Student** | `*.iitr.ac.in` (e.g. `aarav.sharma@me.iitr.ac.in`) | `/student`, `/dashboard`, `/requests/new`, `/requests`, `/requests/:id`, `/track` | `/warden`, `/admin`, `/staff`, technician reassignment, internal staff notes |
| **Maintenance Staff** | `*.estate@iitr.ac.in` or `*@iitr.ac.in` (e.g. `rajesh.estate@iitr.ac.in`) | `/staff`, `/dashboard`, `/requests`, `/requests/:id`, `/track` | `/student`, `/warden`, `/admin`, creating complaints (`/requests/new`) |
| **Warden / Administrator** | `warden.*@iitr.ac.in` or `*@iitr.ac.in` (e.g. `warden.rajendra@iitr.ac.in`) | `/warden`, `/admin`, `/dashboard`, `/requests/new`, `/requests`, `/requests/:id`, `/track` | Cannot act as technician on work queue claim actions |

### Route Protection Architecture
- All protected routes are wrapped with `<ProtectedRoute allowedRoles={[...]}>`.
- If an unauthenticated user attempts to access any dashboard or ticket, they are automatically redirected to `/login` with their return target saved in history state.
- If an authenticated user attempts to access an unauthorized portal (e.g. a student navigating to `/warden` or `/staff`), they receive a clean **403 Access Restricted** page indicating their current session role and the required authorization, along with a 1-click **Switch Account** option.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Type-safe components, functional hooks, strict typings |
| **Build & Tooling** | Vite 8 + `@tailwindcss/vite` | Sub-second HMR and instant production bundling |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS | IITR heritage maroon accents (`#7A1528`), warm off-white canvas (`#FAF9F6`), charcoal stone neutrals |
| **Routing** | React Router v7 (`react-router-dom`) | Declarative client-side routing with clean URL parameters and RBAC guards |
| **Icons & Visuals** | Lucide Icons (`lucide-react`) | Pixel-crisp engineering and facilities iconography |
| **Data Visualization** | Recharts 3 | Responsive SVG charts for category volume, status donuts, trends, and hostel loads |
| **Data Layer & Storage** | LocalStorage Service Layer | Event-driven architecture with clean service abstraction ready for backend integration |
| **Deployment Targets** | Vercel, Netlify, Nginx, Docker | Production configs included (`vercel.json`, `_redirects`, `nginx.conf`, `Dockerfile`) |

---

## 🌐 Hosting on Production Servers

### Option 1: Vercel (Recommended — 2 Minutes)
1. Push your repository to GitHub: `https://github.com/namang-afk/iitr-fixit`
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository `namang-afk/iitr-fixit`.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy**.
> **Note**: SPA rewrites are already configured in [`vercel.json`](./vercel.json).

---

### Option 2: Netlify
1. Go to [netlify.com](https://app.netlify.com/) and choose **"Import from Git"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy Site**.
> **Note**: SPA route redirects are already configured in [`public/_redirects`](./public/_redirects).

---

### Option 3: VPS / Campus Linux Server (Nginx)
If hosting on an IIT Roorkee server or Ubuntu/Debian VPS:
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Copy the contents of `dist/` to your web root (e.g. `/var/www/iitr-fixit`):
   ```bash
   sudo cp -r dist/* /var/www/iitr-fixit/
   ```
3. Copy [`nginx.conf`](./nginx.conf) to `/etc/nginx/sites-available/iitr-fixit`:
   ```nginx
   server {
       listen 80;
       server_name fixit.iitr.ac.in;

       root /var/www/iitr-fixit;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
4. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/iitr-fixit /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

---

### Option 4: Docker Container
Run anywhere with Docker:
```bash
# 1. Build Docker image
docker build -t iitr-fixit .

# 2. Run container on port 80
docker run -d -p 80:80 --name iitr-fixit-app iitr-fixit

# Access at http://localhost
```

---

## 👥 Authorized Credentials & Student Registration

> **Security Protocol**: All passwords must be entered manually by the user (no automatic password prefilling). Staff and Warden accounts are strictly restricted to the generated credentials below.

### 🎓 Students / Residents: Self Sign Up
- Students can create an account using **Sign Up as Student** on `/login?mode=signup` with their official `@*.iitr.ac.in` email and Bhawan/room details.
- **Pre-Registered Student (for quick testing)**:
  - **Email**: `aarav.sharma@me.iitr.ac.in`
  - **Password**: `Student@IITR1`
  - **Location**: Rajendra Bhawan, `R-314`

### 🔧 Exactly 5 Generated Staff Accounts (Estate & Works Directorate)
Staff access is strictly restricted to these 5 accounts and their generated passwords:
1. **Electrical & Power**: `rajesh.estate@iitr.ac.in` — Password: `Staff@Elec1`
2. **Plumbing & Water**: `suresh.waterworks@iitr.ac.in` — Password: `Staff@Plumb2`
3. **Carpentry & Furniture**: `amit.carpentry@iitr.ac.in` — Password: `Staff@Carp3`
4. **Internet & LAN / ICC**: `vikram.icc@iitr.ac.in` — Password: `Staff@Net4`
5. **Civil Maintenance**: `ramesh.civil@iitr.ac.in` — Password: `Staff@Civil5`

### 🏛️ Exactly 1 Generated Warden Account (Chief Warden & Estate Directorate)
Warden administrative access is strictly restricted to:
- **Officer Name**: Ramesh Supervisor
- **Email**: `warden.rajendra@iitr.ac.in`
- **Password**: `Warden@IITR2026`
- **Role**: Executive command center, technician reassignments, SLA monitoring, and hostel loads.

---

## 🧭 Application Routes

| Route | Page | Description | Access |
|---|---|---|---|
| `/` | **Landing Page** | Value proposition, live metrics ticker, 4-step *How It Works*, trade category grid, SLA guarantees, and role portals. | Public |
| `/login` | **Campus SSO Login** | Institutional IITR email authentication with role selection tabs. | Public |
| `/track` | **Quick Tracker** | Direct lookup page to inspect any ticket status by Ticket ID without logging in. | Public |
| `/dashboard` | **Unified Dashboard** | Automatically routes authenticated users to their authorized role dashboard. | Authenticated |
| `/student` | **Resident Dashboard** | Student room tickets, repair timelines, and quick issue submission. | Student Only |
| `/staff` | **Staff Work Queue** | Assigned jobs, unassigned pool, emergency jobs, and resolution forms. | Staff Only |
| `/warden` / `/admin` | **Command Center** | Executive KPI metrics, Recharts visual analytics, technician dispatches. | Warden/Admin Only |
| `/requests` | **Requests Directory** | Searchable, multi-filtered list and table view with status and priority filters. | Authenticated |
| `/requests/new` | **Submit Request** | Form with category picker, hostel & room selectors, preferred access slots, and photos. | Student & Admin |
| `/requests/:id` | **Ticket Details** | Full audit timeline, 6-step visual tracker, photo lightbox, role-gated action buttons. | Authenticated |
| `/unauthorized` | **403 Forbidden** | Intercepts unauthorized cross-role navigation attempts. | Public/Guarded |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ (Node 24 LTS verified)
- npm 10+

### Development Server
```bash
# 1. Clone repository
git clone https://github.com/namang-afk/iitr-fixit.git
cd iitr-fixit

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser: http://127.0.0.1:5173/
```

### Production Build & Preview
```bash
# Build production bundle with TypeScript checks
npm run build

# Preview production build locally
npm run preview
```

---

## ⚠️ Demonstration Disclaimer

> **Disclaimer**: **IITR FixIt** is an educational, interactive software demonstration and prototype. It uses browser `localStorage` to simulate real-world university maintenance operations. It does not access, store, or modify actual student records or servers belonging to the Indian Institute of Technology Roorkee. All emergency contacts and staff numbers are placeholder demonstrations.
