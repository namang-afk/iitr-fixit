import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6] # blank layout

    # Colors
    MAROON = RGBColor(122, 21, 40)       # #7A1528 IIT Roorkee Heritage Maroon
    LIGHT_MAROON = RGBColor(253, 242, 244)# #FDF2F4 Tint
    CHARCOAL = RGBColor(28, 25, 23)      # #1C1917
    MUTED = RGBColor(100, 95, 90)        # #645F5A
    WHITE = RGBColor(255, 255, 255)
    BG_WARM = RGBColor(250, 249, 246)    # #FAF9F6
    CARD_BORDER = RGBColor(226, 222, 216)
    AMBER = RGBColor(217, 119, 6)
    EMERALD = RGBColor(16, 122, 87)
    BLUE = RGBColor(29, 78, 216)

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_WARM
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title, subtitle=None):
        # Header banner bar
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.5), Inches(0.15), Inches(0.8))
        bar.fill.solid()
        bar.fill.fore_color.rgb = MAROON
        bar.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(1.1), Inches(0.4), Inches(10.5), Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = 'Arial'
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = CHARCOAL

        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.name = 'Arial'
            p2.font.size = Pt(13)
            p2.font.color.rgb = MUTED
            p2.space_before = Pt(4)

        # Slide Number Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.6), Inches(0.5), Inches(0.95), Inches(0.4))
        badge.fill.solid()
        badge.fill.fore_color.rgb = WHITE
        badge.line.color.rgb = CARD_BORDER
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = f"{slide_num} / 8"
        p_b.font.name = 'Arial'
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = MAROON
        p_b.alignment = PP_ALIGN.CENTER

    def add_card(slide, left, top, width, height, bg_color=WHITE, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # =========================================================================
    # SLIDE 1: TOPIC & GROUP INTRODUCTION
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Accent Top Banner
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.35))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = MAROON
    top_bar.line.fill.background()

    # Main Card
    main_card = add_card(s1, Inches(1.2), Inches(1.0), Inches(10.933), Inches(5.6))
    
    # Text Frame
    tb = s1.shapes.add_textbox(Inches(1.7), Inches(1.3), Inches(10.0), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "COMMUNITY OUTREACH PROJECT • IIT ROORKEE"
    p0.font.name = 'Arial'
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = MAROON
    p0.space_after = Pt(12)

    p1 = tf.add_paragraph()
    p1.text = "IITR FixIt"
    p1.font.name = 'Arial'
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = CHARCOAL

    p2 = tf.add_paragraph()
    p2.text = "A Centralized Room Maintenance & Facility Repair Platform for Campus Residents"
    p2.font.name = 'Arial'
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = MAROON
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "“Campus maintenance, without the follow-up.”"
    p3.font.name = 'Arial'
    p3.font.size = Pt(14)
    p3.font.italic = True
    p3.font.color.rgb = MUTED
    p3.space_after = Pt(28)

    # Divider
    p_div = tf.add_paragraph()
    p_div.text = "—" * 40
    p_div.font.color.rgb = CARD_BORDER
    p_div.space_after = Pt(14)

    p4 = tf.add_paragraph()
    p4.text = "Project Team & Academic Details:"
    p4.font.name = 'Arial'
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = CHARCOAL

    p5 = tf.add_paragraph()
    p5.text = "• Course: Community Outreach Project\n• Institution: Indian Institute of Technology Roorkee (IIT Roorkee)\n• Target Group: 12,000+ Students across 15 Bhawans, Maintenance Technicians & Wardens\n• Live Deployment: https://iitr-fixit.vercel.app"
    p5.font.name = 'Arial'
    p5.font.size = Pt(12)
    p5.font.color.rgb = MUTED
    p5.space_before = Pt(6)

    # =========================================================================
    # SLIDE 2: MOTIVATION AND SIGNIFICANCE
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, 2, "Motivation & Significance", "Why a modernized digital maintenance ecosystem is crucial for IIT Roorkee")

    # 3 Column Cards
    col_w = Inches(3.64)
    gap = Inches(0.35)
    start_x = Inches(0.8)
    top_y = Inches(1.8)
    card_h = Inches(5.0)

    # Card 1: The Problem
    add_card(s2, start_x, top_y, col_w, card_h)
    tb = s2.shapes.add_textbox(start_x + Inches(0.3), top_y + Inches(0.3), col_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE PROBLEM"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = MAROON
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Physical Registers & Verbal Complaints"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    bullets1 = [
        "Unrecorded Grievances: Over 15 student bhawans relied on paper registers with zero tracking.",
        "Zero Real-Time Visibility: Students had no idea if a carpenter, electrician, or plumber was assigned.",
        "Lost Accountability: Verbal requests to guards/caretakers frequently forgotten or dropped.",
        "Repetitive Manual Follow-ups: Students wasted hours physically visiting caretaker offices."
    ]
    for b in bullets1:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED
        p.space_after = Pt(8)

    # Card 2: Motivation
    x2 = start_x + col_w + gap
    add_card(s2, x2, top_y, col_w, card_h)
    tb = s2.shapes.add_textbox(x2 + Inches(0.3), top_y + Inches(0.3), col_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE MOTIVATION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Quality of Campus Living"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    bullets2 = [
        "Dignity of Living: A comfortable, functioning room environment is foundational for academic excellence.",
        "Health & Safety: Resolving short circuits, sanitary blockages, and water leakages prevents serious hazards.",
        "Resource Conservation: Timely fixing of leaking taps and running flush valves saves thousands of liters of clean water daily.",
        "Technician Respect: Giving estate staff clear task queues and recognition for their hard work."
    ]
    for b in bullets2:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED
        p.space_after = Pt(8)

    # Card 3: Significance
    x3 = x2 + col_w + gap
    add_card(s2, x3, top_y, col_w, card_h)
    tb = s2.shapes.add_textbox(x3 + Inches(0.3), top_y + Inches(0.3), col_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE SIGNIFICANCE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Digital Governance at IITR"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    bullets3 = [
        "Campus-Wide Accountability: Every transition has an immutable timestamp, actor, and remarks.",
        "Service Level Agreements (SLAs): Strict resolution targets (Emergency <2 hrs, High <24 hrs, Normal 24–48 hrs).",
        "Warden Oversight: Administration gets birds-eye visibility into bottlenecks across all hostels.",
        "Continuous Feedback Loop: Residents sign off with 1–5 star ratings and can reopen unresolved tickets."
    ]
    for b in bullets3:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 3: RELEVANCE AND POTENTIAL COMMUNITY IMPACT
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, 3, "Relevance & Potential Community Impact", "Empowering 12,000+ residents, estate maintenance workers, and hostel administration")

    # 4 Key Impact Metric Blocks on top
    stat_w = Inches(2.7)
    stat_gap = Inches(0.3)
    for i, (val, label, sub) in enumerate([
        ("15 Bhawans", "Unified Coverage", "Rajiv, Rajendra, Kasturba, Ganga & more"),
        ("< 2 Hours", "Emergency Response", "Sparks, line bursts, urgent lockouts"),
        ("100% Audit", "Accountability", "Permanent ticket ID & transition history"),
        ("5 Divisions", "Specialized Units", "Electrical, Plumbing, Civil, Carpentry, ICC")
    ]):
        x_st = Inches(0.8) + i * (stat_w + stat_gap)
        c = add_card(s3, x_st, Inches(1.8), stat_w, Inches(1.3), WHITE)
        tb = s3.shapes.add_textbox(x_st + Inches(0.2), Inches(1.9), stat_w - Inches(0.4), Inches(1.1))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = val
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = MAROON
        p.alignment = PP_ALIGN.CENTER
        p2 = tf.add_paragraph()
        p2.text = label
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = CHARCOAL
        p2.alignment = PP_ALIGN.CENTER
        p3 = tf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(9)
        p3.font.color.rgb = MUTED
        p3.alignment = PP_ALIGN.CENTER

    # 2 Big Cards: Student Community vs Campus Administration
    c_w = Inches(5.7)
    c_y = Inches(3.4)
    c_h = Inches(3.4)

    # Left: Student Resident Community
    add_card(s3, Inches(0.8), c_y, c_w, c_h)
    tb = s3.shapes.add_textbox(Inches(1.1), c_y + Inches(0.3), c_w - Inches(0.6), c_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "IMPACT ON STUDENTS & CAMPUS RESIDENTS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = MAROON
    p.space_after = Pt(10)

    bullets_st = [
        "Effortless Digital Filing: Report room repairs in under 60 seconds with photos & preferred time slots.",
        "Live Progress Transparency: Real-time 6-stage tracker from Under Review to Resolved.",
        "Direct Technician Communication: Discuss issues directly with assigned staff without middlemen.",
        "Reopen Mechanism: If a repair fails or issue persists, one-click reopening ensures work is completed.",
        "Zero Lost Requests: Eliminates physical register tears, ink spills, and unrecorded conversations."
    ]
    for b in bullets_st:
        p = tf.add_paragraph()
        p.text = "✓ " + b
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # Right: Maintenance Staff & Wardens
    add_card(s3, Inches(6.8), c_y, c_w, c_h)
    tb = s3.shapes.add_textbox(Inches(7.1), c_y + Inches(0.3), c_w - Inches(0.6), c_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "IMPACT ON ESTATE WORKERS & WARDENS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BLUE
    p.space_after = Pt(10)

    bullets_ad = [
        "Organized Technician Work Queue: 5 specialized trade units receive auto-prioritized work orders.",
        "Private Work Notes: Technicians log internal repair observations separate from resident chat.",
        "Executive Command Center: Chief Warden (Ramesh Supervisor) monitors real-time SLA adherence.",
        "Hostel-by-Hostel Analytics: Identify aging infrastructure clusters across all 15 bhawans.",
        "Preventive Budgeting: Historical data reveals recurring failure patterns (e.g. monsoon dampness, geyser valves)."
    ]
    for b in bullets_ad:
        p = tf.add_paragraph()
        p.text = "✓ " + b
        p.font.size = Pt(11)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 4: PROPOSED SOLUTION AND INNOVATION
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, 4, "Proposed Solution & Innovation", "Key architectural pillars and technical breakthroughs of IITR FixIt")

    # 4 Innovation Pillars
    p_w = Inches(5.7)
    p_h = Inches(2.35)
    gap_x = Inches(0.3)
    gap_y = Inches(0.3)

    pillars = [
        ("1. Institutional Email SSO & Domain Security", 
         "Enforces official @iitr.ac.in and departmental subdomains (@me.iitr.ac.in, @cs.iitr.ac.in). External emails are blocked to ensure verified campus affiliation.", 
         MAROON, Inches(0.8), Inches(1.8)),
        ("2. Strict Role-Based Access Control (RBAC)", 
         "Students self-register with Bhawan/room details; Staff (5 fixed division accounts) and Warden (1 central administrative account) have strictly guarded portals with 403 Forbidden interceptors.", 
         BLUE, Inches(6.8), Inches(1.8)),
        ("3. 6-Stage Lifecycle Tracking & Transparency", 
         "Sequential progression: Submitted ➔ Under Review ➔ Assigned ➔ In Progress ➔ Resolved ➔ Closed. Residents view assigned technician name, contact, and completion notes.", 
         EMERALD, Inches(0.8), Inches(4.45)),
        ("4. Dual-Track Communication & Accountability", 
         "Direct resident-technician messaging combined with internal staff work notes. Features verified 1–5 star sign-off and an immediate ticket reopening mechanism.", 
         AMBER, Inches(6.8), Inches(4.45))
    ]

    for title, desc, col, x, y in pillars:
        add_card(s4, x, y, p_w, p_h)
        tb = s4.shapes.add_textbox(x + Inches(0.3), y + Inches(0.25), p_w - Inches(0.6), p_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(4)

    # =========================================================================
    # SLIDE 5: PROJECT EXECUTION (PART 1: ARCHITECTURE & TECH STACK)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, 5, "Project Execution (Part 1: Architecture & Tech Stack)", "Modern, reactive, type-safe full-stack frontend architecture")

    # 3 Section Cards
    col3_w = Inches(3.64)
    c_y = Inches(1.8)
    c_h = Inches(5.0)

    # 1. Tech Stack
    add_card(s5, Inches(0.8), c_y, col3_w, c_h)
    tb = s5.shapes.add_textbox(Inches(1.1), c_y + Inches(0.3), col3_w - Inches(0.6), c_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "FRONTEND & TOOLS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = MAROON
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Production Technology Stack"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    t_items = [
        "React 19 & TypeScript: Component modularity, functional hooks, and strict type safety.",
        "Vite 8 Build Engine: Sub-second hot module reloading & 790ms optimized production builds.",
        "Tailwind CSS v4: Custom IIT Roorkee maroon (#7A1528) palette, responsive breakpoints.",
        "React Router v7: Declarative routing with protected route guards and deep-link handling.",
        "Recharts 3: Interactive SVG visual analytics for category volume, status donuts, & hostel loads."
    ]
    for item in t_items:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # 2. Data Architecture
    x2 = Inches(0.8) + col3_w + Inches(0.35)
    add_card(s5, x2, c_y, col3_w, c_h)
    tb = s5.shapes.add_textbox(x2 + Inches(0.3), c_y + Inches(0.3), col3_w - Inches(0.6), c_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "DATA PERSISTENCE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = BLUE
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Zero-Key Offline & Server Ready"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    d_items = [
        "LocalStorage Service Layer: Works out-of-the-box without requiring external API keys.",
        "Cross-Tab State Sync: Custom event bus (`iitr_fixit_data_changed`) guarantees instant synchronization across roles.",
        "Clean Service Abstraction: Clean repository pattern in `requestService.ts` ready for PostgreSQL / Supabase migration.",
        "Preloaded Seed Dataset: Realistic sample tickets across electrical, plumbing, carpentry, and internet.",
        "Audit Trail Logging: Immutable event arrays recording actor, timestamp, and status diff."
    ]
    for item in d_items:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # 3. Server Deployment
    x3 = x2 + col3_w + Inches(0.35)
    add_card(s5, x3, c_y, col3_w, c_h)
    tb = s5.shapes.add_textbox(x3 + Inches(0.3), c_y + Inches(0.3), col3_w - Inches(0.6), c_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "HOSTING & DEPLOYMENT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.space_after = Pt(10)

    p = tf.add_paragraph()
    p.text = "Production Server Readiness"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(12)

    h_items = [
        "Live Vercel Deployment: Deployed globally with SSL at https://iitr-fixit.vercel.app.",
        "Vercel SPA Rewrites: Configured via `vercel.json` to prevent 404 errors on deep route reloads.",
        "Netlify Support: Included `_redirects` rule for multi-platform flexibility.",
        "Campus Nginx Config: Production `nginx.conf` with gzip compression and static asset caching.",
        "Docker Containerization: Multi-stage `Dockerfile` (Node 20 Alpine builder + Nginx Alpine runner)."
    ]
    for item in h_items:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 6: PROJECT EXECUTION (PART 2: ROLE IMPLEMENTATION & SECURITY)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, 6, "Project Execution (Part 2: Role Implementation & Security)", "Strict role-based portals, confidential credentials, and security architecture")

    # 3 Horizontal Cards: Student, Staff, Warden
    row_w = Inches(11.733)
    row_h = Inches(1.5)
    gap_r = Inches(0.2)

    # Row 1: Student
    add_card(s6, Inches(0.8), Inches(1.8), row_w, row_h)
    tb = s6.shapes.add_textbox(Inches(1.1), Inches(1.9), row_w - Inches(0.6), row_h - Inches(0.2))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "STUDENT & RESIDENT PORTAL (/student, /requests/new)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p2 = tf.add_paragraph()
    p2.text = "• Self-Registration: Any resident can sign up using their official IITR email, Bhawan (Rajiv, Rajendra, Kasturba, etc.), and room number.\n• Capabilities: 60-second issue submission, photo uploads, preferred inspection time slots, live ticket timeline, messaging technician, and 1-click reopening.\n• Security Guard: Strictly blocked from viewing staff work queues, technician reassignments, or warden command features."
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = CHARCOAL
    p2.space_before = Pt(4)

    # Row 2: Staff
    add_card(s6, Inches(0.8), Inches(3.5), row_w, row_h)
    tb = s6.shapes.add_textbox(Inches(1.1), Inches(3.6), row_w - Inches(0.6), row_h - Inches(0.2))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "ESTATE MAINTENANCE STAFF PORTAL (/staff)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = BLUE
    p2 = tf.add_paragraph()
    p2.text = "• 5 Strictly Generated Accounts: Electrical (Rajesh Kumar), Plumbing (Suresh Verma), Carpentry (Amit Bisht), Internet/ICC (Vikram Singh), Civil (Ramesh Chand).\n• Confidential Authentication: Passwords must be typed manually; cannot self-register; login restricted strictly to authorized staff credentials.\n• Capabilities: Claim unassigned jobs, transition tickets to 'In Progress', write private internal technician notes, submit verified resolution reports."
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = CHARCOAL
    p2.space_before = Pt(4)

    # Row 3: Warden
    add_card(s6, Inches(0.8), Inches(5.2), row_w, row_h)
    tb = s6.shapes.add_textbox(Inches(1.1), Inches(5.3), row_w - Inches(0.6), row_h - Inches(0.2))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "WARDEN & ESTATE COMMAND CENTER (/warden, /admin)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = MAROON
    p2 = tf.add_paragraph()
    p2.text = "• Chief Warden Account: Authenticated under officer Ramesh Supervisor (warden.rajendra@iitr.ac.in).\n• Executive Oversight: Campus-wide KPI dashboard, resolution time averages, Recharts category and status distributions, and hostel load comparisons across all 15 Bhawans.\n• Action Controls: Dispatch technicians, override priority levels, inspect emergency alerts, and export complete ticket logs to CSV."
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = CHARCOAL
    p2.space_before = Pt(4)

    # =========================================================================
    # SLIDE 7: STUDENT ENGAGEMENT AND COMMUNITY INVOLVEMENT
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, 7, "Student Engagement & Community Involvement", "Bridging residents, estate workers, and campus leadership into a collaborative community")

    # 3 Pillars of Engagement
    card_w = Inches(3.64)
    card_h = Inches(5.0)

    # Pillar 1
    add_card(s7, Inches(0.8), Inches(1.8), card_w, card_h)
    tb = s7.shapes.add_textbox(Inches(1.1), Inches(2.1), card_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. RESIDENT EMPOWERMENT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = MAROON
    p.space_after = Pt(8)

    p = tf.add_paragraph()
    p.text = "Active Participatory Living"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(10)

    e1 = [
        "Self-Service Independence: Students report problems directly from their laptops or phones without chasing caretakers.",
        "Accountability Power: 1–5 star ratings ensure quality repair standards across rooms.",
        "Reopen Safety Net: Prevents technicians from marking tickets resolved prematurely.",
        "Emergency Assurance: Clear guidelines and immediate escalation for hazardous emergencies (sparks, floods, gas)."
    ]
    for item in e1:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # Pillar 2
    add_card(s7, Inches(4.8), Inches(1.8), card_w, card_h)
    tb = s7.shapes.add_textbox(Inches(5.1), Inches(2.1), card_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. COMMUNITY RESPECT"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = BLUE
    p.space_after = Pt(8)

    p = tf.add_paragraph()
    p.text = "Humanizing Estate Staff"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(10)

    e2 = [
        "Direct Name & Role Visibility: Students see exactly who is visiting (e.g. Rajesh Kumar, Electrical Specialist).",
        "Mutual Coordination: Residents specify preferred visit slots (morning, afternoon, evening) so staff don't face locked rooms.",
        "Two-Way Messaging: Clarify parts needed before arriving on-site, saving wasted trips across the 365-acre campus.",
        "Dignity of Labor: Shifts perceptions from unorganized labor to accountable campus engineering professionals."
    ]
    for item in e2:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # Pillar 3
    add_card(s7, Inches(8.8), Inches(1.8), card_w, card_h)
    tb = s7.shapes.add_textbox(Inches(9.1), Inches(2.1), card_w - Inches(0.6), card_h - Inches(0.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "3. INSTITUTIONAL TRUST"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p.space_after = Pt(8)

    p = tf.add_paragraph()
    p.text = "Data-Driven Transparency"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = CHARCOAL
    p.space_after = Pt(10)

    e3 = [
        "Eradicating Bureaucracy: Eliminates friction and blame games between caretakers, wardens, and students.",
        "Transparent SLA Adherence: Both residents and administration see if tickets are resolved within campus standards.",
        "Student Representative Input: Bhawan maintenance secretaries can review building-specific issues during meetings.",
        "Campus Sustainability: Proactive infrastructure care fosters a sense of shared civic responsibility for IIT Roorkee facilities."
    ]
    for item in e3:
        p = tf.add_paragraph()
        p.text = "• " + item
        p.font.size = Pt(10.5)
        p.font.color.rgb = MUTED
        p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 8: THANK YOU & CONCLUSION
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)

    # Accent Top Banner
    top_bar = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.35))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = MAROON
    top_bar.line.fill.background()

    card_thank = add_card(s8, Inches(1.2), Inches(1.0), Inches(10.933), Inches(5.6))
    tb = s8.shapes.add_textbox(Inches(1.8), Inches(1.4), Inches(9.8), Inches(5.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "COMMUNITY OUTREACH • CONCLUSION"
    p0.font.name = 'Arial'
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = MAROON
    p0.space_after = Pt(12)

    p1 = tf.add_paragraph()
    p1.text = "Thank You!"
    p1.font.name = 'Arial'
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = CHARCOAL

    p2 = tf.add_paragraph()
    p2.text = "IITR FixIt — Transforming Campus Living Through Accountable Technology"
    p2.font.name = 'Arial'
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = MAROON
    p2.space_after = Pt(18)

    # 3 Summary Highlights
    p3 = tf.add_paragraph()
    p3.text = "Key Project Takeaways:"
    p3.font.name = 'Arial'
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = CHARCOAL

    p4 = tf.add_paragraph()
    p4.text = "1. Replaced unrecorded paper registers across 15 Bhawans with an accountable, 6-stage digital workflow.\n2. Built strict role-based access control protecting residents, 5 estate maintenance units, and warden administration.\n3. Deployed a live, accessible, and interactive production system without requiring API keys or ongoing server costs.\n4. Fostered mutual respect, transparency, and civic participation between students and campus maintenance workers."
    p4.font.name = 'Arial'
    p4.font.size = Pt(11.5)
    p4.font.color.rgb = MUTED
    p4.space_before = Pt(6)
    p4.space_after = Pt(20)

    # Links Box
    p_links = tf.add_paragraph()
    p_links.text = "🌐 Live Application: https://iitr-fixit.vercel.app\n💻 GitHub Source Code: https://github.com/namang-afk/iitr-fixit\n❓ Questions, Demonstrations & Discussion"
    p_links.font.name = 'Arial'
    p_links.font.size = Pt(12)
    p_links.font.bold = True
    p_links.font.color.rgb = MAROON

    output_path = "IITR_FixIt_Community_Outreach_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at {output_path}")

if __name__ == '__main__':
    create_deck()
