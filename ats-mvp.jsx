import { useState, useMemo } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --bg2: #161b27;
    --bg3: #1e2535;
    --bg4: #252d40;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
    --text: #e8eaf0;
    --text2: #8b92a8;
    --text3: #555e78;
    --accent: #4f8ef7;
    --accent2: #3b72d9;
    --accent-soft: rgba(79,142,247,0.12);
    --teal: #2dd4b4;
    --teal-soft: rgba(45,212,180,0.12);
    --amber: #f59e0b;
    --amber-soft: rgba(245,158,11,0.12);
    --red: #f87171;
    --red-soft: rgba(248,113,113,0.12);
    --green: #4ade80;
    --green-soft: rgba(74,222,128,0.12);
    --purple: #a78bfa;
    --purple-soft: rgba(167,139,250,0.12);
    --coral: #fb923c;
    --coral-soft: rgba(251,146,60,0.12);
    --radius: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --font: 'DM Sans', sans-serif;
    --mono: 'DM Mono', monospace;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 4px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar { width: 220px; flex-shrink: 0; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 0; }
  .sidebar-logo { padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-logo-mark { display: flex; align-items: center; gap: 10px; }
  .logo-img { height: 36px; width: auto; object-fit: contain; }
  .logo-text { font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: var(--text3); font-family: var(--mono); letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px; }

  .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .nav-section-label { font-size: 10px; font-family: var(--mono); letter-spacing: 1px; text-transform: uppercase; color: var(--text3); padding: 10px 10px 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--radius); cursor: pointer; color: var(--text2); font-size: 13px; font-weight: 400; transition: all 0.15s; margin-bottom: 1px; }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: var(--accent-soft); color: var(--accent); font-weight: 500; }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--accent); color: white; font-size: 10px; font-family: var(--mono); padding: 1px 6px; border-radius: 20px; }
  .nav-badge.amber { background: var(--amber); }
  .nav-badge.red { background: var(--red); }

  .sidebar-user { padding: 14px 16px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--accent); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: var(--accent); flex-shrink: 0; }
  .user-name { font-size: 12px; font-weight: 500; color: var(--text); }
  .user-role { font-size: 10px; color: var(--text3); font-family: var(--mono); }
  .role-switch { margin-left: auto; background: var(--bg4); border: none; color: var(--text3); font-size: 10px; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-family: var(--mono); }
  .role-switch:hover { color: var(--text); background: var(--border2); }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }
  .page-header { padding: 24px 28px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; color: var(--text); }
  .page-sub { font-size: 13px; color: var(--text2); margin-top: 3px; }
  .page-content { padding: 20px 28px 40px; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: var(--radius); font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font); }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); }
  .btn-danger { background: var(--red-soft); color: var(--red); border: 1px solid rgba(248,113,113,0.2); }
  .btn-danger:hover { background: rgba(248,113,113,0.2); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn-icon { padding: 7px; border-radius: var(--radius); background: var(--bg3); border: 1px solid var(--border); color: var(--text2); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .btn-icon:hover { background: var(--bg4); color: var(--text); }

  /* CARDS */
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  .card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .card-body { padding: 20px; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 20px; font-family: var(--mono); }
  .badge-blue { background: var(--accent-soft); color: var(--accent); }
  .badge-teal { background: var(--teal-soft); color: var(--teal); }
  .badge-amber { background: var(--amber-soft); color: var(--amber); }
  .badge-red { background: var(--red-soft); color: var(--red); }
  .badge-green { background: var(--green-soft); color: var(--green); }
  .badge-purple { background: var(--purple-soft); color: var(--purple); }
  .badge-coral { background: var(--coral-soft); color: var(--coral); }
  .badge-gray { background: rgba(255,255,255,0.05); color: var(--text2); }

  /* TABLES */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 11px; font-family: var(--mono); letter-spacing: 0.5px; text-transform: uppercase; color: var(--text3); padding: 10px 16px; border-bottom: 1px solid var(--border); font-weight: 400; }
  td { padding: 13px 16px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text2); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  td.strong { color: var(--text); font-weight: 500; }

  /* FORMS */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 6px; display: block; }
  .form-input, .form-select, .form-textarea { width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius); color: var(--text); font-size: 13px; padding: 9px 12px; font-family: var(--font); transition: border 0.15s; outline: none; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-select option { background: var(--bg3); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius-xl); width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow); }
  .modal-lg { max-width: 720px; }
  .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-size: 16px; font-weight: 600; letter-spacing: -0.3px; }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .modal-close { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 20px; line-height: 1; padding: 2px; }
  .modal-close:hover { color: var(--text); }

  /* STATS */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 20px; }
  .stat-label { font-size: 11px; font-family: var(--mono); letter-spacing: 0.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; }
  .stat-value { font-size: 28px; font-weight: 600; letter-spacing: -1px; color: var(--text); }
  .stat-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }
  .stat-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }

  /* PIPELINE KANBAN */
  .kanban { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
  .kanban-col { flex-shrink: 0; width: 220px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); display: flex; flex-direction: column; }
  .kanban-col-header { padding: 12px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .kanban-col-title { font-size: 12px; font-weight: 600; color: var(--text); }
  .kanban-col-count { font-size: 11px; font-family: var(--mono); background: var(--bg4); color: var(--text3); padding: 2px 7px; border-radius: 10px; }
  .kanban-col-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .kanban-card { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; cursor: pointer; transition: all 0.15s; }
  .kanban-card:hover { border-color: var(--border2); background: var(--bg4); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
  .kanban-card-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
  .kanban-card-job { font-size: 11px; color: var(--text3); }
  .kanban-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .kanban-card-days { font-size: 10px; font-family: var(--mono); color: var(--text3); }
  .kanban-stage-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* SCORECARD */
  .score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .score-label { font-size: 13px; color: var(--text2); }
  .score-stars { display: flex; gap: 4px; }
  .score-star { width: 28px; height: 28px; border-radius: 6px; background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: all 0.1s; color: var(--text3); }
  .score-star.active { background: var(--amber-soft); border-color: var(--amber); color: var(--amber); }
  .score-star:hover { border-color: var(--amber); color: var(--amber); }

  /* OFFER */
  .offer-steps { display: flex; align-items: center; gap: 0; margin-bottom: 24px; }
  .offer-step { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text3); }
  .offer-step.active { color: var(--accent); }
  .offer-step.done { color: var(--teal); }
  .offer-step-num { width: 24px; height: 24px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; font-family: var(--mono); flex-shrink: 0; }
  .offer-step-done-icon { width: 24px; height: 24px; border-radius: 50%; background: var(--teal-soft); border: 1px solid var(--teal); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .offer-connector { flex: 1; height: 1px; background: var(--border); margin: 0 8px; }

  /* TABS */
  .tabs { display: flex; gap: 2px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 3px; width: fit-content; }
  .tab { padding: 6px 16px; border-radius: 6px; font-size: 13px; color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .tab.active { background: var(--bg4); color: var(--text); font-weight: 500; }
  .tab:hover:not(.active) { color: var(--text); }

  /* SEARCH + FILTER */
  .toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); }
  .search-input { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); color: var(--text); font-size: 13px; padding: 8px 12px 8px 34px; font-family: var(--font); outline: none; width: 220px; }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--text3); }

  /* MISC */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-state-icon { font-size: 36px; margin-bottom: 12px; }
  .empty-state-text { font-size: 14px; }
  .tag { display: inline-flex; align-items: center; font-size: 11px; font-family: var(--mono); background: var(--bg4); color: var(--text2); padding: 3px 8px; border-radius: 4px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .dot-green { background: var(--green); }
  .dot-amber { background: var(--amber); }
  .dot-red { background: var(--red); }
  .dot-blue { background: var(--accent); }
  .dot-gray { background: var(--text3); }
  .activity-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 5px; flex-shrink: 0; }
  .activity-text { font-size: 12px; color: var(--text2); }
  .activity-time { font-size: 11px; color: var(--text3); margin-top: 2px; font-family: var(--mono); }
  .mini-bar { height: 6px; border-radius: 3px; background: var(--bg4); overflow: hidden; margin-top: 6px; }
  .mini-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
  .source-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .source-name { font-size: 12px; color: var(--text2); }
  .source-count { font-size: 12px; font-family: var(--mono); color: var(--text3); }
  .chip { display: inline-flex; align-items: center; gap: 5px; background: var(--bg3); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; font-size: 11px; color: var(--text2); }
  .chip-remove { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 14px; line-height: 1; display: flex; align-items: center; }

  .alert { padding: 12px 16px; border-radius: var(--radius); font-size: 13px; display: flex; gap: 10px; align-items: flex-start; }
  .alert-info { background: var(--accent-soft); border: 1px solid rgba(79,142,247,0.2); color: var(--accent); }
  .alert-amber { background: var(--amber-soft); border: 1px solid rgba(245,158,11,0.2); color: var(--amber); }
  .alert-green { background: var(--green-soft); border: 1px solid rgba(74,222,128,0.2); color: var(--green); }
  .candidate-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
  .stage-progress { display: flex; align-items: center; gap: 3px; }
  .stage-pip { height: 4px; border-radius: 2px; flex: 1; background: var(--bg4); }
  .stage-pip.filled { background: var(--accent); }
  .stage-pip.current { background: var(--amber); }
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const STAGES = ["Applied","HR Screening","HM Review","1st Interview","Technical Interview","Final Interview","Offer","Hired","Rejected","On Hold"];
const PIPELINE_STAGES = STAGES.slice(0, 7);

// Real Karm team
const TEAM = [
  { email: "islam.ahmed@karmsolar.com",     fullName: "Islam Ahmed",     initials: "IA", color: "#4f8ef7" },
  { email: "mohi.mohsen@karmsolar.com",     fullName: "Mohi Mohsen",     initials: "MM", color: "#2dd4b4" },
  { email: "samia.salaheldin@karmsolar.com",fullName: "Samia Salaheldin",initials: "SS", color: "#a78bfa" },
  { email: "ahmed.farid@karmsolar.com",     fullName: "Ahmed Farid",     initials: "AF", color: "#fb923c" },
  { email: "aya.osman@karmsolar.com",       fullName: "Aya Osman",       initials: "AO", color: "#f87171" },
  { email: "heba.selim@karmsolar.com",      fullName: "Heba Selim",      initials: "HS", color: "#4ade80" },
  { email: "hussien.magdy@karmsolar.com",   fullName: "Hussien Magdy",   initials: "HM", color: "#f59e0b" },
  { email: "nada.khamis@karmsolar.com",     fullName: "Nada Khamis",     initials: "NK", color: "#38bdf8" },
  { email: "omar.elsheemy@karmsolar.com",   fullName: "Omar El-Sheemy",  initials: "OE", color: "#e879f9" },
  { email: "yara.rashad@karmsolar.com",     fullName: "Yara Rashad",     initials: "YR", color: "#34d399" },
];

// ── ROLE PERMISSIONS MAP ──────────────────────────────────────────────────────
const ROLE_PERMISSIONS = {
  "HR Admin":       { canSeeAll: true,  canApproveOffer: false, canManageUsers: true  },
  "Recruiter":      { canSeeAll: false, canApproveOffer: false, canManageUsers: false },
  "Hiring Manager": { canSeeAll: false, canApproveOffer: false, canManageUsers: false },
  "Interviewer":    { canSeeAll: false, canApproveOffer: false, canManageUsers: false },
  "CEO/Approver":   { canSeeAll: true,  canApproveOffer: true,  canManageUsers: false },
};
const ROLE_LIST = Object.keys(ROLE_PERMISSIONS);
const DEFAULT_ROLE_ASSIGNMENTS = { "HR Admin": 9, "Recruiter": 0, "Hiring Manager": 1, "Interviewer": 3, "CEO/Approver": 6 };

// localStorage helpers
const LS = {
  get: (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  clear: () => { ["karm_jobs","karm_candidates","karm_applications","karm_scorecards","karm_offers","karm_interviews","karm_roles"].forEach(k => { try { localStorage.removeItem(k); } catch {} }); },
};

const ENTITIES = ["HoldCo. (UK)", "Sub HoldCo. (NL)", "Karm Egypt", "Karm Cyprus", "Karm Tunisia"];
const DEPARTMENTS = [
  "CEO Office",
  "Logistics",
  "Finance",
  "HR",
  "Generation",
  "O&M Office",
  "Business Development",
  "Investment",
  "KB - Construction",
  "Management",
  "Distribution",
  "KB - KAL",
  "Procurement",
  "Technical Office",
  "Compliance",
  "Digital Transformation",
  "Legal Affairs",
  "Operations",
  "HSE",
  "Sand",
  "Facility Management",
];
const JOB_FAMILIES = [
  "Top Management",
  "Middle Management",
  "Staff",
  "Blue Collar - Technicians",
];

const SOURCES = ["LinkedIn", "Referral", "Wuzzuf", "Indeed", "Direct Application", "Headhunt", "Recruitment Agency"];

const initJobs = [
  { id: 1, title: "Senior Solar Engineer", dept: "Technical Office", entity: "Karm Egypt", positionType: "Manpower", status: "Open", level: "Staff", headcount: 2, openDate: "2025-04-01", recruiter: "Islam Ahmed", hiringManager: "Mohi Mohsen", description: "Lead technical solar system design.", salaryMin: 35000, salaryMax: 50000 },
  { id: 2, title: "Business Development Manager", dept: "Business Development", entity: "Karm Cyprus", positionType: "Additional R.", status: "Open", level: "Middle Management", headcount: 1, openDate: "2025-03-15", recruiter: "Islam Ahmed", hiringManager: "Yara Rashad", description: "Drive commercial partnerships.", salaryMin: 45000, salaryMax: 65000 },
  { id: 3, title: "O&M Technician", dept: "O&M Office", entity: "Karm Egypt", positionType: "Manpower", status: "Open", level: "Blue Collar - Technicians", headcount: 3, openDate: "2025-04-10", recruiter: "Islam Ahmed", hiringManager: "Mohi Mohsen", description: "Maintain solar installations.", salaryMin: 8000, salaryMax: 14000 },
  { id: 4, title: "Financial Controller", dept: "Finance", entity: "Sub HoldCo. (NL)", positionType: "Replacement", status: "Draft", level: "Middle Management", headcount: 1, openDate: "2025-04-20", recruiter: "Islam Ahmed", hiringManager: "Yara Rashad", description: "Oversee financial operations.", salaryMin: 40000, salaryMax: 55000 },
  { id: 5, title: "HR Supervisor", dept: "HR", entity: "Karm Egypt", positionType: "Manpower", status: "Closed", level: "Staff", headcount: 1, openDate: "2025-02-01", recruiter: "Islam Ahmed", hiringManager: "Yara Rashad", description: "Support HR operations.", salaryMin: 18000, salaryMax: 26000 },
];

const initCandidates = [
  { id: 1, name: "Ahmed Kamel", email: "a.kamel@gmail.com", phone: "+20 100 111 2233", nationality: "Egyptian", source: "LinkedIn", cvUrl: "#", addedDate: "2025-04-05", tags: ["solar", "engineer"], color: "#4f8ef7" },
  { id: 2, name: "Sara El-Sayed", email: "sara.elsayed@outlook.com", phone: "+20 112 333 4455", nationality: "Egyptian", source: "Referral", cvUrl: "#", addedDate: "2025-03-20", tags: ["business", "commercial"], color: "#2dd4b4" },
  { id: 3, name: "Omar Hassan", email: "o.hassan@proton.me", phone: "+20 101 555 6677", nationality: "Egyptian", source: "Wuzzuf", cvUrl: "#", addedDate: "2025-04-12", tags: ["technician", "o&m"], color: "#a78bfa" },
  { id: 4, name: "Nadia Ibrahim", email: "nadia.ibrahim@gmail.com", phone: "+20 100 777 8899", nationality: "Egyptian", source: "Headhunt", cvUrl: "#", addedDate: "2025-04-08", tags: ["finance", "controller"], color: "#f59e0b" },
  { id: 5, name: "Khaled Mostafa", email: "k.mostafa@yahoo.com", phone: "+20 112 999 0011", nationality: "Egyptian", source: "LinkedIn", cvUrl: "#", addedDate: "2025-04-15", tags: ["solar", "senior"], color: "#fb923c" },
  { id: 6, name: "Laila Farouk", email: "laila.f@gmail.com", phone: "+20 100 222 3344", nationality: "Egyptian", source: "Direct Application", cvUrl: "#", addedDate: "2025-04-02", tags: ["commercial", "bd"], color: "#f87171" },
  { id: 7, name: "Youssef Tawfik", email: "y.tawfik@outlook.com", phone: "+20 101 444 5566", nationality: "Egyptian", source: "Referral", cvUrl: "#", addedDate: "2025-04-18", tags: ["o&m", "maintenance"], color: "#4ade80" },
];

const initApplications = [
  { id: 1, candidateId: 1, jobId: 1, stage: "Technical Interview", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-05", notes: "Strong technical background, 5 yrs exp", daysInStage: 3 },
  { id: 2, candidateId: 2, jobId: 2, stage: "Final Interview", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-03-20", notes: "Excellent communication skills", daysInStage: 1 },
  { id: 3, candidateId: 3, jobId: 3, stage: "HR Screening", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-12", notes: "Good technical fit", daysInStage: 2 },
  { id: 4, candidateId: 4, jobId: 2, stage: "1st Interview", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-08", notes: "CFA qualified", daysInStage: 5 },
  { id: 5, candidateId: 5, jobId: 1, stage: "HM Review", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-15", notes: "Promising profile", daysInStage: 2 },
  { id: 6, candidateId: 6, jobId: 2, stage: "Applied", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-18", notes: "", daysInStage: 1 },
  { id: 7, candidateId: 7, jobId: 3, stage: "Applied", status: "Active", recruiter: "Islam Ahmed", appliedDate: "2025-04-18", notes: "", daysInStage: 1 },
];

const initScorecards = [
  { id: 1, applicationId: 1, interviewerId: "Mohi Mohsen", interviewType: "Technical Interview", knowledge: 5, attitude: 4, feedback: 4, recommendation: "Hire", notes: "Excellent technical depth. Strong on PV system design.", submittedDate: "2025-04-18" },
  { id: 2, applicationId: 2, interviewerId: "Yara Rashad", interviewType: "Final Interview", knowledge: 4, attitude: 5, feedback: 5, recommendation: "Hire", notes: "Great culture fit, very articulate.", submittedDate: "2025-04-19" },
];

const initOffers = [
  { id: 1, applicationId: 2, salary: 58000, currency: "EGP", startDate: "2025-06-01", status: "Pending Approval", createdBy: "Heba Selim", approvalNote: "", createdDate: "2025-04-20" },
];

const initInterviews = [
  { id: 1, applicationId: 1, type: "Technical Interview", scheduledAt: "2025-04-22 10:00", format: "In-person", interviewerId: "Ahmed Farid", status: "Scheduled" },
  { id: 2, applicationId: 2, type: "Final Interview", scheduledAt: "2025-04-21 14:00", format: "Video call", interviewerId: "Yara Rashad", status: "Completed" },
  { id: 3, applicationId: 4, type: "1st Interview", scheduledAt: "2025-04-23 11:00", format: "In-person", interviewerId: "Mohi Mohsen", status: "Scheduled" },
];

// ── ICONS (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    jobs: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    candidates: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    pipeline: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="8" rx="1"/></svg>,
    interviews: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    offers: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    star: "⭐",
  };
  return icons[name] || null;
};

// ── STAGE BADGE COLORS ────────────────────────────────────────────────────────
const stageBadge = (stage) => {
  const map = {
    "Applied": "badge-gray",
    "HR Screening": "badge-blue",
    "HM Review": "badge-purple",
    "1st Interview": "badge-teal",
    "Technical Interview": "badge-teal",
    "Final Interview": "badge-coral",
    "Offer": "badge-amber",
    "Hired": "badge-green",
    "Rejected": "badge-red",
    "On Hold": "badge-gray",
  };
  return map[stage] || "badge-gray";
};

const stageColor = (stage) => {
  const map = {
    "Applied": "#555e78",
    "HR Screening": "#4f8ef7",
    "HM Review": "#a78bfa",
    "1st Interview": "#2dd4b4",
    "Technical Interview": "#2dd4b4",
    "Final Interview": "#fb923c",
    "Offer": "#f59e0b",
    "Hired": "#4ade80",
    "Rejected": "#f87171",
    "On Hold": "#555e78",
  };
  return map[stage] || "#555e78";
};

const jobStatusBadge = (s) => s === "Open" ? "badge-green" : s === "Draft" ? "badge-amber" : "badge-gray";

const POSITION_TYPES = ["Manpower", "Additional R.", "Replacement"];

const positionTypeBadge = (t) => {
  if (t === "Additional R.") return "badge-coral";
  if (t === "Replacement") return "badge-amber";
  return "badge-blue";
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

const stageIndex = (stage) => PIPELINE_STAGES.indexOf(stage);

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [currentRole, setCurrentRole] = useState("HR Admin");
  const [modal, setModal] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Persisted state — survives reloads and code changes
  const [jobs, setJobsRaw]               = useState(() => LS.get("karm_jobs", initJobs));
  const [candidates, setCandidatesRaw]   = useState(() => LS.get("karm_candidates", initCandidates));
  const [applications, setApplicationsRaw] = useState(() => LS.get("karm_applications", initApplications));
  const [scorecards, setScorecardsRaw]   = useState(() => LS.get("karm_scorecards", initScorecards));
  const [offers, setOffersRaw]           = useState(() => LS.get("karm_offers", initOffers));
  const [interviews, setInterviewsRaw]   = useState(() => LS.get("karm_interviews", initInterviews));
  const [roleAssignments, setRoleAssignmentsRaw] = useState(() => LS.get("karm_roles", DEFAULT_ROLE_ASSIGNMENTS));

  // Persisting setters
  const persist = (key, setter) => (updater) => {
    setter(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      LS.set(key, next);
      return next;
    });
  };
  const setJobs         = persist("karm_jobs", setJobsRaw);
  const setCandidates   = persist("karm_candidates", setCandidatesRaw);
  const setApplications = persist("karm_applications", setApplicationsRaw);
  const setScorecards   = persist("karm_scorecards", setScorecardsRaw);
  const setOffers       = persist("karm_offers", setOffersRaw);
  const setInterviews   = persist("karm_interviews", setInterviewsRaw);
  const setRoleAssignments = persist("karm_roles", setRoleAssignmentsRaw);

  // Build ROLES_CONFIG dynamically from roleAssignments
  const ROLES_CONFIG = {};
  Object.entries(roleAssignments).forEach(([role, idx]) => {
    ROLES_CONFIG[role] = { ...TEAM[idx], ...ROLE_PERMISSIONS[role] };
  });
  const roleConfig = ROLES_CONFIG[currentRole] || { ...TEAM[9], ...ROLE_PERMISSIONS["HR Admin"] };

  const resetAllData = () => {
    LS.clear();
    setJobsRaw(initJobs);
    setCandidatesRaw(initCandidates);
    setApplicationsRaw(initApplications);
    setScorecardsRaw(initScorecards);
    setOffersRaw(initOffers);
    setInterviewsRaw(initInterviews);
    setRoleAssignmentsRaw(DEFAULT_ROLE_ASSIGNMENTS);
    setShowResetConfirm(false);
  };

  const openModal = (type, data = {}) => setModal({ type, data });
  const closeModal = () => setModal(null);

  const openJobs        = jobs.filter(j => j.status === "Open").length;
  const pendingOffers   = offers.filter(o => o.status === "Pending Approval").length;
  const pendingScorecards = interviews.filter(i => i.status === "Scheduled").length;

  const nav = [
    { id: "dashboard",  label: "Dashboard",        icon: "dashboard" },
    { id: "jobs",       label: "Job Requisitions",  icon: "jobs",       badge: openJobs },
    { id: "candidates", label: "Candidates",        icon: "candidates" },
    { id: "pipeline",   label: "Pipeline",          icon: "pipeline" },
    { id: "interviews", label: "Interviews",        icon: "interviews", badge: pendingScorecards, badgeColor: "amber" },
    { id: "offers",     label: "Offers",            icon: "offers",     badge: pendingOffers, badgeColor: "red" },
  ];
  if (currentRole === "HR Admin") nav.push({ id: "settings", label: "Settings", icon: "settings" });

  const pages = { dashboard: DashboardPage, jobs: JobsPage, candidates: CandidatesPage, pipeline: PipelinePage, interviews: InterviewsPage, offers: OffersPage, settings: SettingsPage };
  const PageComponent = pages[page] || DashboardPage;

  const ctx = { jobs, setJobs, candidates, setCandidates, applications, setApplications, scorecards, setScorecards, offers, setOffers, interviews, setInterviews, roleAssignments, setRoleAssignments, ROLES_CONFIG, openModal, closeModal, currentRole, roleConfig, stageIndex };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <img className="logo-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAHyElEQVR42u3aa2xUxxUA4DOPe+96d7VrvIBx7DVGwdgYYxsDtVIRhSghaWnqVJHSUCU8kiiiVX9UKaVJSkyqEqqklKgJkZpKJBB+ligUgqKkwZHMSziNeRYaArUhWT+o2cX27n3sfczpj6ErgxCspVStxNwf1vpqfHe+OWfOnLVNHntiFUEBt8eFhHKC4vYBAwCF2+xSYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAVWYAX+74PJbQImABQAAQIARCQioIhArn8OIYQQcvM7/79gREREOdoDMAmhACFEqulOOGYzBk4OEGGcx/d9z/PGa4MgyOfzQvyP/xbNi9FyzhERg8AmdBoGiz2/XvgxIUaN0EAkdnxG498pC/7RTbw8cB1QAEAikaCUZjIZAKCUOo4Tj8cTiUQ6nTZNk9JbLDQhRC7xN36xxqZmAnjz966sqoqGw8M5c07g/yzvLBR+aQBRF6aOmjPT//rW8NeRmU3n7moPek+A5wBhALDuVy/cf/99+z7pBADTNFtaWn79UkfDnIaDBw/5vk8plaFmjMk1ldmOiPJOEASFXSBXBxEppfL1dT8+kQ1JikrpvGVl8/lKFD/J22WAOY/kOR2ox/Pfpn1z9WzYu+eTnfdkLpElKwgKAAQAXdcMXaecmqZZV1f3izXPBkHw2mt/GBsb833fsiw59Ww26/s+51yCKaWWZbmeZxgGY4wQIge7rss59zzPtm3f903TlAthWZbv+xMqDbyYQZlMZgzgcc+dSjDr0ux0ceyhK9kKFoCri5DmaXX74Lsf7jj701e/mn2XOLmflEQDIQghtmVXVVY+/9xaIXDjb18ZHBxkjCWTyfb27zfOaRBCHDp8+MyZL1Ysf+L993cd6e7u6FjXua+zubm5tXXetm3vUkpbW1v2fLD3h48+mkxW9fb2ffTxx319F37wcHvrvHkC8PTp07t27R4ZGZGb7psBEwAPMYE4DwPXJ85k/Ntj1pQ7lzTTxmyQPpf5KE8yZ5YaJdnhur7zfbNa6ckuBKSUuq5bVlb23PO/LCkpefV3m3p7e3VdSyaTHS+ui8ViPUePZseyDyx5YOnSpbqmxUvjQmDdrFn1dXUAkEqlhoaGGuc2trW1tbW12bY9PHx5wYL5LS3N6XS6vLw8lUqVxku/8+CD1cnqDS9vLH7DFxXhAGAK4hQU4JFUQ47PaFhkzSZHX4HyNm3GfUeH3wtC2Ht3gEM2hVLgOgCgEKFQaM3Pn01WVf15587u7s+mTpmSM80fLVsWi8XeeOPNfZ2dAKSiYtpL6zsqKqZ5ngeAMnU3bdp8/MQJ0zSbmpuEEGfPfvn7zZtHR8ce+t7SVatWlpeXv7Nt+969HyYSZWvXrmlomD27vr74iRPhcLiYI6DYcxgBhIAgRC7NsCtKmsnAASvTI3rfY5dPg1ZCfd9lJamqGjLUh36eEOq6XiwWq62dKYS4e9Gi6dOrs6Y5adKkpqa5Fy9+dfDw4Wg0OmlSaSqV6vz0U0IIAiKiYRiDg4NHjx3n/Go1opQe6e4eGrqkaVrX/gNyG3d17Q+FjP6Bgc8/70HEskRZ8acdLXLQGIEAAAEp08bsi3DnI+GaR+iCF/ujBrpjwJhmUpdG0MkhEFm3AHH79h3btr9bUVHx1JOrRBAQAMaYZVmAKGsS5zyfzwMAwauFx7Isztn4akop5VyTVQoRgyCglFJKZKmTB1jxXQ0tJrYcIE3ZWc4iDsYuR/tzh7rdI30LV3WXuUPmSU4jVJgjofphGoELp0AzEJEzhgBdXV179nxw4OChhQsXPtze3j8wcO78+dramZWVd6TTmdHREULo/PnzCzsQEeHaE1i+Lnwdd4Bdc9N1Xdd1i9nJRe1hGbLdmjFHs+oP00v1xpmyPeczexGRaVHgdmywpCf8dPbYXzEzSIwIIFJGCSG6ruu6vnXr29XVyZUrl588derure9s3Lhh/fqOXbv+ksvm7r178dy5jQDAOJMHL6Psum50fOgYY+OztxDhp55+cnJZ4o9v/emWcS4qpQVACPGflL0VCcFlet8OVns2HhGRKA3HLaf83NQv8i+cO/Ol+Gw3GBFABADLti3T8oOAc26a5pYtb165MvLj1c/0Xbjwmw0v9/f3r1yxfPXqZzzPe/31LZZliUAggOM4Tt4pYDzPc/J53/MLCsu2bdu+OvXCAD+oqZ5eU1NDgCDcIshk2eMrivxfSwLgANwBYrHt12KglwYjk8Nfl9b2hGZfHO4jvT2ghQqDDcOQHaVMQt/3Q6FQKBRyHDubzXHOI+EwAmSzWQCIx+O+7/u+H41GhQgsy5a5ahiGYRiO47iuK0MXjUYBIJfLjR9gWZYQQrbrN48wEjoBsMwHF8ClJIxoeCgIt0rC4I5prgNGGMZtISEEArD/9MxyNkIIxphMyyAQhEChnZLJKWdc6LQFIgpBKS0wZMtZ6CgRUQhBx73LLeoRoXxCragA0AB0gQLA1giArzsjQBkaEbh21eQsx1cjSZVTBAB58MiSI+8DAOe8UKJk0pJrW6jrBsg6P6GPGRMDy6ItH08RAAjKGnOjHLluHjf59poqPZGH3PCO+hWPAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAiuwAivwDa5/A5CMFu2/vFfHAAAAAElFTkSuQmCC" alt="Karm." />
              <div><div className="logo-sub">ATS · Karm Group</div></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {nav.map(item => (
              <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                <Icon name={item.icon} />
                {item.label}
                {item.badge > 0 && <span className={`nav-badge ${item.badgeColor || ""}`}>{item.badge}</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: roleConfig.color + "22", borderColor: roleConfig.color, color: roleConfig.color }}>{roleConfig.initials}</div>
            <div>
              <div className="user-name">{roleConfig.fullName}</div>
              <div className="user-role">{currentRole}</div>
            </div>
            <button className="role-switch" onClick={() => setRoleModal(true)}>Switch</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <PageComponent {...ctx} />
        </main>

        {/* MODALS */}
        {modal && <ModalRouter modal={modal} closeModal={closeModal} ctx={ctx} />}

        {/* ROLE SWITCHER — now shows who is assigned to each role */}
        {roleModal && (
          <div className="modal-overlay" onClick={() => setRoleModal(false)}>
            <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Switch view role</div>
                <button className="modal-close" onClick={() => setRoleModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>View the system from any role's perspective.</p>
                {ROLE_LIST.map(role => {
                  const cfg = ROLES_CONFIG[role];
                  return (
                    <div key={role} onClick={() => { setCurrentRole(role); setRoleModal(false); setPage("dashboard"); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius)", cursor: "pointer", border: `1px solid ${currentRole === role ? cfg.color + "66" : "var(--border)"}`, background: currentRole === role ? cfg.color + "11" : "transparent", marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: cfg.color + "22", border: `1px solid ${cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.initials}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{cfg.fullName}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{role}</div>
                      </div>
                      {currentRole === role && <div style={{ marginLeft: "auto", color: cfg.color }}><Icon name="check" size={14} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESET CONFIRM */}
        {showResetConfirm && (
          <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
            <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><div className="modal-title">Reset all data?</div><button className="modal-close" onClick={() => setShowResetConfirm(false)}>×</button></div>
              <div className="modal-body">
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>This will delete all jobs, candidates, applications, scorecards, offers, and interviews and restore the sample data.</p>
                <p style={{ fontSize: 12, color: "var(--red)" }}>This cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowResetConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={resetAllData}>Yes, reset everything</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── MODAL ROUTER ──────────────────────────────────────────────────────────────
function ModalRouter({ modal, closeModal, ctx }) {
  const M = {
    addJob: AddJobModal,
    addCandidate: AddCandidateModal,
    viewCandidate: ViewCandidateModal,
    scorecard: ScorecardModal,
    addOffer: AddOfferModal,
    viewOffer: ViewOfferModal,
    scheduleInterview: ScheduleInterviewModal,
    moveStage: MoveStageModal,
  };
  const Component = M[modal.type];
  if (!Component) return null;
  return <Component data={modal.data} closeModal={closeModal} ctx={ctx} />;
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardPage({ jobs, candidates, applications, offers, interviews, scorecards, currentRole, roleConfig, openModal }) {
  const openJobs = jobs.filter(j => j.status === "Open").length;
  const activeApps = applications.filter(a => a.status === "Active").length;
  const hiredApps = applications.filter(a => a.stage === "Hired").length;
  const pendingOffers = offers.filter(o => o.status === "Pending Approval").length;

  const stageCount = {};
  PIPELINE_STAGES.forEach(s => { stageCount[s] = applications.filter(a => a.stage === s && a.status === "Active").length; });

  const sourceCount = {};
  candidates.forEach(c => { sourceCount[c.source] = (sourceCount[c.source] || 0) + 1; });
  const topSources = Object.entries(sourceCount).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(...Object.values(sourceCount), 1);

  const recentActivities = [
    { text: "Sara El-Sayed moved to Final Interview", time: "2h ago", color: "#4f8ef7" },
    { text: "Offer created for Sara El-Sayed (Job: BDM)", time: "3h ago", color: "#f59e0b" },
    { text: "Ahmed Kamel scorecard submitted by Mohi Mohsen", time: "5h ago", color: "#2dd4b4" },
    { text: "New candidate: Youssef Tawfik added (O&M Technician)", time: "8h ago", color: "#a78bfa" },
    { text: "Financial Controller req opened by Yara Rashad", time: "1d ago", color: "#fb923c" },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Good morning, {roleConfig.fullName.split(" ")[0]} — here's what's happening today</div>
        </div>
        {(currentRole === "HR Admin" || currentRole === "Recruiter") && (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => openModal("addCandidate")}><Icon name="plus" size={14} /> Add Candidate</button>
            <button className="btn btn-primary" onClick={() => openModal("addJob")}><Icon name="plus" size={14} /> New Requisition</button>
          </div>
        )}
      </div>
      <div className="page-content">

        {/* STATS */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-label">Open requisitions</div>
            <div className="stat-value">{openJobs}</div>
            <div className="stat-sub"><span className="dot dot-green" /> {openJobs} across 2 entities</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active candidates</div>
            <div className="stat-value">{activeApps}</div>
            <div className="stat-sub"><span className="dot dot-blue" /> In pipeline now</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending offers</div>
            <div className="stat-value" style={{ color: pendingOffers > 0 ? "var(--amber)" : "var(--text)" }}>{pendingOffers}</div>
            <div className="stat-sub"><span className="dot dot-amber" /> Awaiting CEO approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Hires this month</div>
            <div className="stat-value" style={{ color: "var(--teal)" }}>{hiredApps}</div>
            <div className="stat-sub"><span className="dot dot-green" /> Total confirmed</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* PIPELINE FUNNEL */}
          <div className="card" style={{ gridColumn: "span 2" }}>
            <div className="card-header"><div className="card-title">Pipeline by stage</div></div>
            <div className="card-body">
              {PIPELINE_STAGES.map(stage => {
                const count = stageCount[stage] || 0;
                const pct = Math.round((count / Math.max(activeApps, 1)) * 100);
                return (
                  <div key={stage} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: stageColor(stage), display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "var(--text2)" }}>{stage}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)" }}>{count} candidate{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="mini-bar">
                      <div className="mini-bar-fill" style={{ width: `${pct}%`, background: stageColor(stage) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="card">
            <div className="card-header"><div className="card-title">Recent activity</div></div>
            <div className="card-body" style={{ padding: "12px 20px" }}>
              {recentActivities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* OPEN REQS */}
          <div className="card">
            <div className="card-header"><div className="card-title">Open requisitions</div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Role</th><th>Entity</th><th>Candidates</th><th>Status</th></tr></thead>
                <tbody>
                  {jobs.filter(j => j.status === "Open").map(j => {
                    const appCount = applications.filter(a => a.jobId === j.id && a.status === "Active").length;
                    return (
                      <tr key={j.id}>
                        <td className="strong">{j.title}</td>
                        <td><span className="tag">{j.entity}</span></td>
                        <td style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{appCount}</td>
                        <td><span className={`badge ${jobStatusBadge(j.status)}`}>{j.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOURCE BREAKDOWN */}
          <div className="card">
            <div className="card-header"><div className="card-title">Candidate sources</div></div>
            <div className="card-body">
              {topSources.map(([source, count]) => (
                <div key={source} style={{ marginBottom: 12 }}>
                  <div className="source-row">
                    <span className="source-name">{source}</span>
                    <span className="source-count">{count} candidate{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="mini-bar">
                    <div className="mini-bar-fill" style={{ width: `${(count / maxSource) * 100}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HIRES PER DEPARTMENT */}
        {(() => {
          const hiredByDept = {};
          applications.filter(a => a.stage === "Hired").forEach(a => {
            const job = jobs.find(j => j.id === a.jobId);
            if (job) hiredByDept[job.dept] = (hiredByDept[job.dept] || 0) + 1;
          });
          // Also count from initApplications for demo data richness
          const deptEntries = Object.entries(hiredByDept).sort((a, b) => b[1] - a[1]);
          const maxHires = Math.max(...deptEntries.map(([,n]) => n), 1);
          return (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <div className="card-title">Total hires by department</div>
                <span className="badge badge-green">{applications.filter(a => a.stage === "Hired").length} total hired</span>
              </div>
              {deptEntries.length === 0 ? (
                <div className="card-body" style={{ textAlign: "center", color: "var(--text3)", padding: "32px" }}>
                  No hires recorded yet — move candidates to the Hired stage to see data here.
                </div>
              ) : (
                <div className="card-body">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px 24px" }}>
                    {deptEntries.map(([dept, count]) => (
                      <div key={dept}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>{dept}</span>
                          <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--teal)", fontWeight: 600 }}>{count}</span>
                        </div>
                        <div className="mini-bar">
                          <div className="mini-bar-fill" style={{ width: `${(count / maxHires) * 100}%`, background: "var(--teal)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </>
  );
}

// ── JOBS PAGE ─────────────────────────────────────────────────────────────────
// ── EXCEL EXPORT UTILITY ──────────────────────────────────────────────────────
function exportToCSV(filename, headers, rows) {
  const escape = (val) => {
    const s = val == null ? "" : String(val);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map(row => row.map(escape).join(",")),
  ].join("\n");
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel Arabic/special char support
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportButton({ onClick }) {
  const [flash, setFlash] = useState(false);
  const handle = () => {
    onClick();
    setFlash(true);
    setTimeout(() => setFlash(false), 1800);
  };
  return (
    <button
      className="btn btn-ghost"
      onClick={handle}
      style={flash ? { borderColor: "var(--green)", color: "var(--green)", background: "var(--green-soft)" } : {}}
    >
      {flash
        ? <><Icon name="check" size={14} /> Exported!</>
        : <><Icon name="download" size={14} /> Export Excel</>}
    </button>
  );
}


// ── MANPOWER PLAN IMPORTER ────────────────────────────────────────────────────
function ManpowerPlanImporter({ closeModal, jobs, setJobs }) {
  const [phase, setPhase] = useState("drop"); // drop | parsing | review | done
  const [dragOver, setDragOver] = useState(false);
  const [parsedJobs, setParsedJobs] = useState([]);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const readFile = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    if (file.name.endsWith(".csv") || file.type === "text/csv" || file.type === "text/plain") {
      reader.onload = () => res({ text: reader.result, type: "text" });
      reader.onerror = rej;
      reader.readAsText(file);
    } else {
      // For xlsx/xls read as base64 for Claude document API
      reader.onload = () => res({ b64: reader.result.split(",")[1], type: "binary", name: file.name, mime: file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      reader.onerror = rej;
      reader.readAsDataURL(file);
    }
  });

  const parseWithClaude = async (file) => {
    const fileData = await readFile(file);
    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are an HR data extraction assistant for Karm Group. Extract job requisitions from the uploaded manpower plan file.

Return ONLY a valid JSON array with no extra text, no markdown fences. Each object must follow this exact structure:
{
  "title": "Job title",
  "dept": "Department name — must be one of: ${DEPARTMENTS.join(", ")}",
  "entity": "Entity — must be one of: ${ENTITIES.join(", ")}",
  "positionType": "Position type — must be one of: Manpower, Additional R., Replacement",
  "level": "Job family — must be one of: ${JOB_FAMILIES.join(", ")}",
  "headcount": 1,
  "salaryMin": 0,
  "salaryMax": 0,
  "status": "Open",
  "description": "Brief role description if available"
}

Rules:
- If department doesn't match exactly, pick the closest one from the allowed list
- If entity doesn't match, default to "Karm Egypt"
- If position type doesn't match, default to "Manpower"
- If job family/level doesn't match, default to "Staff"
- If headcount is missing, default to 1
- If salary is missing, use 0
- Return ONLY the JSON array, starting with [ and ending with ]`;

    let messages;
    if (fileData.type === "text") {
      messages = [{ role: "user", content: `Extract all job requisitions from this manpower plan data:\n\n${fileData.text.slice(0, 12000)}` }];
    } else {
      messages = [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: fileData.mime, data: fileData.b64 } },
          { type: "text", text: "Extract all job requisitions from this manpower plan file." }
        ]
      }];
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system: systemPrompt, messages })
    });

    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return parsed.map((j, i) => ({
      ...j,
      id: `import_${Date.now()}_${i}`,
      openDate: today,
      recruiter: "Islam Ahmed",
      hiringManager: "",
      positionType: POSITION_TYPES.includes(j.positionType) ? j.positionType : "Manpower",
      headcount: parseInt(j.headcount) || 1,
      salaryMin: parseFloat(j.salaryMin) || 0,
      salaryMax: parseFloat(j.salaryMax) || 0,
      status: j.status || "Open",
      _selected: true,
      _error: null,
    }));
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;
    setError("");
    setPhase("parsing");
    try {
      const result = await parseWithClaude(file);
      if (!result.length) throw new Error("No jobs found in file");
      setParsedJobs(result);
      setPhase("review");
    } catch (e) {
      setError("Could not parse the file. Make sure it's a valid Excel or CSV manpower plan.");
      setPhase("drop");
    }
  };

  const updateJob = (id, field, value) => {
    setParsedJobs(prev => prev.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const toggleSelect = (id) => {
    setParsedJobs(prev => prev.map(j => j.id === id ? { ...j, _selected: !j._selected } : j));
  };

  const confirmImport = () => {
    setImporting(true);
    const toImport = parsedJobs.filter(j => j._selected).map(({ id, _selected, _error, ...j }) => ({
      ...j,
      id: Date.now() + Math.random(),
    }));
    setJobs(prev => [...prev, ...toImport]);
    setPhase("done");
    setImporting(false);
  };

  const selectedCount = parsedJobs.filter(j => j._selected).length;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" style={{ maxWidth: 820 }} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {phase === "drop" && "📋 Import Manpower Plan"}
              {phase === "parsing" && "🤖 Reading your manpower plan..."}
              {phase === "review" && `Review ${parsedJobs.length} extracted positions`}
              {phase === "done" && "✅ Import complete"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
              {phase === "drop" && "Upload your approved manpower plan — Excel or CSV"}
              {phase === "review" && `${selectedCount} of ${parsedJobs.length} selected for import`}
            </div>
          </div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>

        <div className="modal-body">

          {/* DROP ZONE */}
          {phase === "drop" && (
            <div>
              {error && <div className="alert alert-amber" style={{ marginBottom: 16 }}><Icon name="alert" size={14} />{error}</div>}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => document.getElementById("mp-file-input").click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border2)"}`,
                  borderRadius: "var(--radius-lg)",
                  background: dragOver ? "var(--accent-soft)" : "var(--bg3)",
                  padding: "52px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 14 }}>📊</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                  Drop your manpower plan here
                </div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
                  Supports Excel (.xlsx, .xls) and CSV files
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "white", padding: "9px 22px", borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500 }}>
                  <Icon name="plus" size={14} /> Browse file
                </div>
              </div>
              <input id="mp-file-input" type="file" accept=".xlsx,.xls,.csv,.txt" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />

              {/* Expected format hint */}
              <div className="card">
                <div className="card-header"><div className="card-title">Expected file format</div></div>
                <div className="card-body" style={{ padding: "12px 20px" }}>
                  <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>Claude will intelligently read your file regardless of exact column names. For best results, your file should contain columns similar to:</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                      <thead>
                        <tr style={{ background: "var(--bg3)" }}>
                          {["Job Title", "Department", "Entity", "Position Type", "Job Family", "Headcount", "Salary Min", "Salary Max", "Status"].map(h => (
                            <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: "var(--text3)", fontFamily: "var(--mono)", borderBottom: "1px solid var(--border)", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Solar Engineer", "Technical Office", "Karm Egypt", "Manpower", "Staff", "2", "30000", "45000", "Open"],
                          ["BD Manager", "Business Development", "Karm Cyprus", "Additional R.", "Middle Management", "1", "50000", "70000", "Open"],
                          ["O&M Technician", "O&M Office", "Karm Egypt", "Replacement", "Blue Collar - Technicians", "4", "8000", "12000", "Open"],
                        ].map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "7px 10px", color: "var(--text2)", borderBottom: "1px solid var(--border)" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10 }}>
                    ✦ Column names don't need to match exactly — Claude will figure out what each column means automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PARSING */}
          {phase === "parsing" && (
            <div style={{ textAlign: "center", padding: "52px 24px" }}>
              <div style={{ fontSize: 44, marginBottom: 20, display: "inline-block", animation: "spin 1.2s linear infinite" }}>⚙️</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Reading your manpower plan with Claude AI</div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>Extracting job titles, departments, entities, and headcount...</div>
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
            </div>
          )}

          {/* REVIEW */}
          {phase === "review" && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                <Icon name="alert" size={14} />
                <span>Review the extracted positions below. Deselect any you don't want to import, and edit any field directly.</span>
              </div>

              {/* Select all / deselect all */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setParsedJobs(p => p.map(j => ({ ...j, _selected: true })))}>Select all</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setParsedJobs(p => p.map(j => ({ ...j, _selected: false })))}>Deselect all</button>
                </div>
                <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>{selectedCount} / {parsedJobs.length} selected</span>
              </div>

              <div style={{ maxHeight: 440, overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, background: "var(--bg2)", zIndex: 1 }}>
                    <tr>
                      <th style={{ width: 36, padding: "10px 12px", textAlign: "center", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11 }}>✓</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>JOB TITLE</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>DEPARTMENT</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>ENTITY</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>POSITION TYPE</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>JOB FAMILY</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>HC</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text3)", fontSize: 11, fontFamily: "var(--mono)" }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedJobs.map(job => (
                      <tr key={job.id} style={{ opacity: job._selected ? 1 : 0.4, transition: "opacity 0.15s" }}>
                        <td style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
                          <input type="checkbox" checked={job._selected} onChange={() => toggleSelect(job.id)} style={{ accentColor: "var(--accent)", width: 15, height: 15, cursor: "pointer" }} />
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <input
                            className="form-input"
                            style={{ padding: "5px 8px", fontSize: 12, minWidth: 160 }}
                            value={job.title}
                            onChange={e => updateJob(job.id, "title", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <select className="form-select" style={{ padding: "5px 8px", fontSize: 12 }} value={job.dept} onChange={e => updateJob(job.id, "dept", e.target.value)}>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <select className="form-select" style={{ padding: "5px 8px", fontSize: 12 }} value={job.entity} onChange={e => updateJob(job.id, "entity", e.target.value)}>
                            {ENTITIES.map(en => <option key={en}>{en}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <select className="form-select" style={{ padding: "5px 8px", fontSize: 12 }} value={job.positionType || "Manpower"} onChange={e => updateJob(job.id, "positionType", e.target.value)}>
                            {POSITION_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <select className="form-select" style={{ padding: "5px 8px", fontSize: 12 }} value={job.level} onChange={e => updateJob(job.id, "level", e.target.value)}>
                            {JOB_FAMILIES.map(f => <option key={f}>{f}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <input
                            className="form-input"
                            type="number"
                            min="1"
                            style={{ padding: "5px 8px", fontSize: 12, width: 60 }}
                            value={job.headcount}
                            onChange={e => updateJob(job.id, "headcount", parseInt(e.target.value) || 1)}
                          />
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border)" }}>
                          <select className="form-select" style={{ padding: "5px 8px", fontSize: 12 }} value={job.status} onChange={e => updateJob(job.id, "status", e.target.value)}>
                            <option>Open</option><option>Draft</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DONE */}
          {phase === "done" && (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                {selectedCount} position{selectedCount !== 1 ? "s" : ""} imported successfully
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>
                All positions are now visible in the Job Requisitions tab.
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          {phase === "drop" && <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>}
          {phase === "parsing" && <button className="btn btn-ghost" disabled style={{ opacity: 0.4 }}>Reading file...</button>}
          {phase === "review" && (
            <>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-ghost" onClick={() => setPhase("drop")}>← Back</button>
              <button className="btn btn-primary" onClick={confirmImport} disabled={selectedCount === 0 || importing}>
                <Icon name="check" size={14} />
                Import {selectedCount} position{selectedCount !== 1 ? "s" : ""}
              </button>
            </>
          )}
          {phase === "done" && <button className="btn btn-primary" onClick={closeModal}>Done</button>}
        </div>
      </div>
    </div>
  );
}

function JobsPage({ jobs, setJobs, applications, currentRole, openModal }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterEntity, setFilterEntity] = useState("All");
  const [showImporter, setShowImporter] = useState(false);

  const filtered = jobs.filter(j =>
    (filterStatus === "All" || j.status === filterStatus) &&
    (filterEntity === "All" || j.entity === filterEntity) &&
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  const canCreate = currentRole === "HR Admin" || currentRole === "Recruiter";

  const toggleJobStatus = (id, currentStatus) => {
    const next = currentStatus === "Open" ? "Closed" : "Open";
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: next } : j));
  };

  const exportJobs = () => {
    const headers = ["Job Title", "Department", "Entity", "Position Type", "Job Family", "Headcount", "Active Candidates", "Open Date", "Recruiter", "Hiring Manager", "Salary Min (EGP)", "Salary Max (EGP)", "Status"];
    const rows = filtered.map(j => {
      const appCount = applications.filter(a => a.jobId === j.id && a.status === "Active").length;
      return [j.title, j.dept, j.entity, j.positionType || "Manpower", j.level, j.headcount, appCount, j.openDate, j.recruiter, j.hiringManager, j.salaryMin, j.salaryMax, j.status];
    });
    const dateStr = new Date().toISOString().split("T")[0];
    exportToCSV(`Karm_ATS_Job_Requisitions_${dateStr}.csv`, headers, rows);
  };

  return (
    <>
      {showImporter && (
        <ManpowerPlanImporter
          closeModal={() => setShowImporter(false)}
          jobs={jobs}
          setJobs={setJobs}
        />
      )}
      <div className="page-header">
        <div>
          <div className="page-title">Job Requisitions</div>
          <div className="page-sub">{jobs.length} total requisitions across all entities</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton onClick={exportJobs} />
          {canCreate && (
            <button className="btn btn-ghost" onClick={() => setShowImporter(true)}>
              <span style={{ fontSize: 15 }}>📋</span> Import Manpower Plan
            </button>
          )}
          {canCreate && <button className="btn btn-primary" onClick={() => openModal("addJob")}><Icon name="plus" size={14} /> New Requisition</button>}
        </div>
      </div>
      <div className="page-content">
        <div className="toolbar" style={{ marginBottom: 16 }}>
          <div className="search-wrap">
            <span className="search-icon"><Icon name="search" size={14} /></span>
            <input className="search-input" placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: "auto" }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All</option><option>Open</option><option>Draft</option><option>Closed</option>
          </select>
          <select className="form-select" style={{ width: "auto" }} value={filterEntity} onChange={e => setFilterEntity(e.target.value)}>
            <option>All</option>{ENTITIES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Job title</th><th>Department</th><th>Entity</th><th>Position type</th><th>Job family</th><th>HC</th><th>Candidates</th><th>Open date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(job => {
                  const appCount = applications.filter(a => a.jobId === job.id && a.status === "Active").length;
                  return (
                    <tr key={job.id}>
                      <td className="strong">{job.title}</td>
                      <td>{job.dept}</td>
                      <td><span className="tag">{job.entity}</span></td>
                      <td><span className={`badge ${positionTypeBadge(job.positionType)}`}>{job.positionType || "Manpower"}</span></td>
                      <td><span className="badge badge-gray">{job.level}</span></td>
                      <td style={{ fontFamily: "var(--mono)" }}>{job.headcount}</td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{appCount}</td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--text3)" }}>{job.openDate}</td>
                      <td><span className={`badge ${jobStatusBadge(job.status)}`}>{job.status}</span></td>
                      <td>
                        {canCreate && job.status !== "Draft" && (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={job.status === "Closed" ? { color: "var(--teal)", borderColor: "var(--teal-soft)" } : {}}
                            onClick={() => toggleJobStatus(job.id, job.status)}
                          >
                            {job.status === "Open" ? "Close" : "Reopen"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ── CANDIDATES PAGE ───────────────────────────────────────────────────────────
function CandidatesPage({ candidates, setCandidates, applications, jobs, currentRole, openModal }) {
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");

  const filtered = candidates.filter(c =>
    (filterSource === "All" || c.source === filterSource) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const canCreate = currentRole === "HR Admin" || currentRole === "Recruiter";

  const exportCandidates = () => {
    const headers = ["Full Name", "Email", "Phone", "Nationality", "Source", "Active Applications", "Current Stage", "Applied Job", "Date Added", "Tags"];
    const rows = filtered.map(c => {
      const activeApp = applications.find(a => a.candidateId === c.id && a.status === "Active");
      const activeJob = activeApp ? jobs.find(j => j.id === activeApp.jobId) : null;
      const appCount = applications.filter(a => a.candidateId === c.id && a.status === "Active").length;
      return [
        c.name, c.email, c.phone || "", c.nationality, c.source,
        appCount,
        activeApp?.stage || "—",
        activeJob?.title || "—",
        c.addedDate,
        (c.tags || []).join(", "),
      ];
    });
    const dateStr = new Date().toISOString().split("T")[0];
    exportToCSV(`Karm_ATS_Candidates_${dateStr}.csv`, headers, rows);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Candidate Database</div>
          <div className="page-sub">{candidates.length} candidates in the system</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton onClick={exportCandidates} />
          {canCreate && <button className="btn btn-primary" onClick={() => openModal("addCandidate")}><Icon name="plus" size={14} /> Add Candidate</button>}
        </div>
      </div>
      <div className="page-content">
        <div className="toolbar" style={{ marginBottom: 16 }}>
          <div className="search-wrap">
            <span className="search-icon"><Icon name="search" size={14} /></span>
            <input className="search-input" placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: "auto" }} value={filterSource} onChange={e => setFilterSource(e.target.value)}>
            <option>All</option>{SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Candidate</th><th>Email</th><th>Nationality</th><th>Source</th><th>Active apps</th><th>Current stage</th><th>Added</th><th></th></tr></thead>
              <tbody>
                {filtered.map(c => {
                  const activeApp = applications.find(a => a.candidateId === c.id && a.status === "Active");
                  const activeJob = activeApp ? jobs.find(j => j.id === activeApp.jobId) : null;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="candidate-avatar" style={{ background: c.color + "22", color: c.color, fontSize: 11, fontWeight: 600 }}>{initials(c.name)}</div>
                          <span className="strong">{c.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 12 }}>{c.email}</td>
                      <td>{c.nationality}</td>
                      <td><span className="badge badge-gray">{c.source}</span></td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{applications.filter(a => a.candidateId === c.id && a.status === "Active").length}</td>
                      <td>{activeApp ? <span className={`badge ${stageBadge(activeApp.stage)}`}>{activeApp.stage}</span> : <span style={{ color: "var(--text3)", fontSize: 12 }}>—</span>}</td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--text3)", fontSize: 12 }}>{c.addedDate}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => openModal("viewCandidate", { candidate: c, activeApp, activeJob })}>View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ── CV PARSER MODAL ───────────────────────────────────────────────────────────
function CVParserModal({ jobs, candidates, setCandidates, applications, setApplications, closeModal }) {
  const [phase, setPhase] = useState("drop"); // drop | parsing | review | done
  const [dragOver, setDragOver] = useState(false);
  const [parsedFiles, setParsedFiles] = useState([]); // [{fileName, extracted, editing}]
  const [currentIdx, setCurrentIdx] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useState(null);

  const COLORS = ["#4f8ef7","#2dd4b4","#a78bfa","#f59e0b","#fb923c","#f87171","#4ade80","#38bdf8","#e879f9","#34d399"];

  const readFileAsBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(",")[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const readFileAsText = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsText(file);
  });

  const parseCV = async (file) => {
    const isPDF = file.type === "application/pdf";
    const isDocx = file.name.endsWith(".docx") || file.type.includes("word");
    const isText = file.type.startsWith("text/") || file.name.endsWith(".txt");

    const jobList = jobs.filter(j => j.status === "Open").map(j => `- ${j.title} (${j.dept}, ${j.entity})`).join("\n");

    const systemPrompt = `You are an expert HR assistant for Karm Group. Extract candidate information from the resume provided and return ONLY a valid JSON object with no extra text, no markdown, no explanation.

Return exactly this structure:
{
  "name": "Full name of candidate",
  "email": "email@example.com",
  "phone": "+XX XXX XXX XXXX",
  "nationality": "Nationality if mentioned, else empty string",
  "currentTitle": "Current or most recent job title",
  "yearsExp": "Number as string e.g. 5",
  "skills": ["skill1", "skill2", "skill3"],
  "source": "CV Upload",
  "suggestedJob": "Best matching job title from the list below, or empty string if none match",
  "summary": "2-sentence professional summary"
}

Open jobs at Karm Group:
${jobList}

Match the candidate to the most relevant open job based on their experience and skills. Return only the JSON.`;

    let messages;

    if (isPDF) {
      const b64 = await readFileAsBase64(file);
      messages = [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
          { type: "text", text: "Extract the candidate information from this resume." }
        ]
      }];
    } else {
      // For docx/text, read as text (best effort)
      let text = "";
      try { text = await readFileAsText(file); } catch (e) { text = `File: ${file.name}`; }
      messages = [{
        role: "user",
        content: `Extract candidate information from this resume text:\n\n${text.slice(0, 8000)}`
      }];
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      })
    });

    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  };

  const handleFiles = async (files) => {
    if (!files.length) return;
    setPhase("parsing");
    setError("");
    const results = [];
    for (const file of Array.from(files)) {
      try {
        const extracted = await parseCV(file);
        // Find suggested job object
        const suggestedJobObj = jobs.find(j =>
          j.status === "Open" && j.title.toLowerCase().includes((extracted.suggestedJob || "").toLowerCase().split(" ")[0])
        ) || null;
        results.push({
          fileName: file.name,
          extracted: {
            name: extracted.name || "",
            email: extracted.email || "",
            phone: extracted.phone || "",
            nationality: extracted.nationality || "",
            currentTitle: extracted.currentTitle || "",
            yearsExp: extracted.yearsExp || "",
            skills: extracted.skills || [],
            source: "CV Upload",
            summary: extracted.summary || "",
            suggestedJob: extracted.suggestedJob || "",
          },
          suggestedJobObj,
          selectedJobId: suggestedJobObj?.id || (jobs.find(j => j.status === "Open")?.id || ""),
        });
      } catch (e) {
        results.push({
          fileName: file.name,
          extracted: { name: "", email: "", phone: "", nationality: "", currentTitle: "", yearsExp: "", skills: [], source: "CV Upload", summary: "", suggestedJob: "" },
          suggestedJobObj: null,
          selectedJobId: jobs.find(j => j.status === "Open")?.id || "",
          parseError: true,
        });
      }
    }
    setParsedFiles(results);
    setCurrentIdx(0);
    setPhase("review");
  };

  const updateField = (field, value) => {
    setParsedFiles(prev => prev.map((p, i) => i === currentIdx ? { ...p, extracted: { ...p.extracted, [field]: value } } : p));
  };

  const confirmCandidate = () => {
    const item = parsedFiles[currentIdx];
    const { extracted, selectedJobId } = item;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newCand = {
      id: Date.now() + currentIdx,
      name: extracted.name || "Unknown",
      email: extracted.email || "",
      phone: extracted.phone || "",
      nationality: extracted.nationality || "",
      source: "CV Upload",
      cvUrl: "#",
      addedDate: new Date().toISOString().split("T")[0],
      tags: extracted.skills?.slice(0, 4) || [],
      color,
    };
    setCandidates(prev => [...prev, newCand]);
    if (selectedJobId) {
      const newApp = {
        id: Date.now() + currentIdx + 500,
        candidateId: newCand.id,
        jobId: parseInt(selectedJobId),
        stage: "Applied",
        status: "Active",
        recruiter: "Islam Ahmed",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: extracted.summary || "",
        daysInStage: 0,
      };
      setApplications(prev => [...prev, newApp]);
    }
    if (currentIdx < parsedFiles.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setPhase("done");
    }
  };

  const cur = parsedFiles[currentIdx];
  const openJobs = jobs.filter(j => j.status === "Open");

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal modal-lg" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {phase === "drop" && "📄 Drop CVs to Auto-Fill"}
              {phase === "parsing" && "🤖 Reading CVs with AI..."}
              {phase === "review" && `Review Extracted Data (${currentIdx + 1} of ${parsedFiles.length})`}
              {phase === "done" && "✅ All Candidates Added"}
            </div>
            {phase === "review" && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, fontFamily: "var(--mono)" }}>{cur?.fileName}</div>}
          </div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>

        <div className="modal-body">

          {/* DROP ZONE */}
          {phase === "drop" && (
            <div>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => document.getElementById("cv-file-input").click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border2)"}`,
                  borderRadius: "var(--radius-lg)",
                  background: dragOver ? "var(--accent-soft)" : "var(--bg3)",
                  padding: "52px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 14 }}>📂</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                  Drag & drop CVs here
                </div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
                  Supports PDF and Word (.docx) — drop multiple files at once
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "white", padding: "8px 20px", borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500 }}>
                  <Icon name="plus" size={14} /> Or click to browse files
                </div>
              </div>
              <input
                id="cv-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                multiple
                style={{ display: "none" }}
                onChange={e => handleFiles(e.target.files)}
              />
              <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--bg3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>How it works</div>
                <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7 }}>
                  Claude AI reads each CV → extracts name, email, phone, nationality, skills → suggests the best matching open job → you review & confirm → candidate is added to the Applied column automatically.
                </div>
              </div>
            </div>
          )}

          {/* PARSING STATE */}
          {phase === "parsing" && (
            <div style={{ textAlign: "center", padding: "52px 24px" }}>
              <div style={{ fontSize: 44, marginBottom: 20, animation: "spin 1s linear infinite", display: "inline-block" }}>⚙️</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Reading CVs with Claude AI</div>
              <div style={{ fontSize: 13, color: "var(--text3)" }}>Extracting candidate information — this takes a few seconds per CV...</div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* REVIEW STATE */}
          {phase === "review" && cur && (
            <div>
              {cur.parseError && (
                <div className="alert alert-amber" style={{ marginBottom: 16 }}>
                  <Icon name="alert" size={14} /> Couldn't fully parse this CV. Please fill in the fields manually.
                </div>
              )}

              {/* Progress bar for multiple files */}
              {parsedFiles.length > 1 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 6, fontFamily: "var(--mono)" }}>
                    <span>Progress</span><span>{currentIdx + 1} / {parsedFiles.length} CVs</span>
                  </div>
                  <div className="mini-bar" style={{ height: 6 }}>
                    <div className="mini-bar-fill" style={{ width: `${((currentIdx) / parsedFiles.length) * 100}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              )}

              {/* AI Summary banner */}
              {cur.extracted.summary && (
                <div style={{ padding: "12px 14px", background: "var(--accent-soft)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: "var(--radius)", marginBottom: 18, fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 4 }}>🤖 AI Summary</span>
                  {cur.extracted.summary}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full name *</label>
                  <input className="form-input" value={cur.extracted.name} onChange={e => updateField("name", e.target.value)} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" value={cur.extracted.email} onChange={e => updateField("email", e.target.value)} placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={cur.extracted.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+20 1xx xxx xxxx" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input className="form-input" value={cur.extracted.nationality} onChange={e => updateField("nationality", e.target.value)} placeholder="e.g. Egyptian" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current title</label>
                  <input className="form-input" value={cur.extracted.currentTitle} onChange={e => updateField("currentTitle", e.target.value)} placeholder="e.g. Solar Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of experience</label>
                  <input className="form-input" value={cur.extracted.yearsExp} onChange={e => updateField("yearsExp", e.target.value)} placeholder="e.g. 5" />
                </div>
              </div>

              {/* Skills chips */}
              {cur.extracted.skills?.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Extracted skills</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cur.extracted.skills.map((s, i) => (
                      <span key={i} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job assignment */}
              <div className="form-group">
                <label className="form-label">
                  Apply to job
                  {cur.suggestedJobObj && <span style={{ marginLeft: 8, fontSize: 10, fontFamily: "var(--mono)", color: "var(--teal)" }}>✦ AI suggested: {cur.suggestedJobObj.title}</span>}
                </label>
                <select
                  className="form-select"
                  value={cur.selectedJobId}
                  onChange={e => setParsedFiles(prev => prev.map((p, i) => i === currentIdx ? { ...p, selectedJobId: e.target.value } : p))}
                >
                  <option value="">— No job yet —</option>
                  {openJobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} · {j.dept} · {j.entity}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* DONE STATE */}
          {phase === "done" && (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                {parsedFiles.length} candidate{parsedFiles.length > 1 ? "s" : ""} added successfully
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>
                All candidates are now in the Applied column of the pipeline.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                {parsedFiles.map((p, i) => (
                  <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--green)", borderRadius: "var(--radius)", padding: "8px 14px", fontSize: 12, color: "var(--green)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="check" size={12} /> {p.extracted.name || p.fileName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          {phase === "drop" && <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>}
          {phase === "parsing" && <button className="btn btn-ghost" disabled style={{ opacity: 0.5 }}>Processing...</button>}
          {phase === "review" && (
            <>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-ghost" onClick={() => {
                if (currentIdx < parsedFiles.length - 1) setCurrentIdx(i => i + 1);
                else setPhase("done");
              }}>Skip this CV</button>
              <button className="btn btn-primary" onClick={confirmCandidate}>
                <Icon name="check" size={14} />
                {currentIdx < parsedFiles.length - 1 ? "Confirm & Next" : "Confirm & Finish"}
              </button>
            </>
          )}
          {phase === "done" && <button className="btn btn-primary" onClick={closeModal}>Close</button>}
        </div>
      </div>
    </div>
  );
}

// ── PIPELINE PAGE ─────────────────────────────────────────────────────────────
function PipelinePage({ applications, setApplications, candidates, setCandidates, jobs, currentRole, openModal }) {
  const [filterJob, setFilterJob] = useState("All");
  const [filterEntity, setFilterEntity] = useState("All");
  const [showCVParser, setShowCVParser] = useState(false);

  const openJobs = jobs.filter(j => j.status === "Open");

  const filteredApps = applications.filter(a => {
    const job = jobs.find(j => j.id === a.jobId);
    return a.status === "Active" &&
      (filterJob === "All" || a.jobId === parseInt(filterJob)) &&
      (filterEntity === "All" || (job && job.entity === filterEntity));
  });

  const canMove = currentRole === "HR Admin" || currentRole === "Recruiter" || currentRole === "Hiring Manager";
  const canUpload = currentRole === "HR Admin" || currentRole === "Recruiter";

  return (
    <>
      {showCVParser && (
        <CVParserModal
          jobs={jobs}
          candidates={candidates}
          setCandidates={setCandidates}
          applications={applications}
          setApplications={setApplications}
          closeModal={() => setShowCVParser(false)}
        />
      )}
      <div className="page-header">
        <div>
          <div className="page-title">Candidate Pipeline</div>
          <div className="page-sub">{filteredApps.length} active applications in view</div>
        </div>
        {canUpload && (
          <button className="btn btn-primary" onClick={() => setShowCVParser(true)}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>📄</span> Upload CVs
          </button>
        )}
      </div>
      <div className="page-content">
        <div className="toolbar" style={{ marginBottom: 16 }}>
          <select className="form-select" style={{ width: "auto" }} value={filterJob} onChange={e => setFilterJob(e.target.value)}>
            <option value="All">All jobs</option>
            {openJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <select className="form-select" style={{ width: "auto" }} value={filterEntity} onChange={e => setFilterEntity(e.target.value)}>
            <option>All</option>{ENTITIES.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>

        <div className="kanban">
          {PIPELINE_STAGES.map(stage => {
            const stageApps = filteredApps.filter(a => a.stage === stage);
            const isApplied = stage === "Applied";
            return (
              <div key={stage} className="kanban-col">
                <div className="kanban-col-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div className="kanban-stage-dot" style={{ background: stageColor(stage) }} />
                    <span className="kanban-col-title">{stage}</span>
                  </div>
                  <span className="kanban-col-count">{stageApps.length}</span>
                </div>
                <div className="kanban-col-body">
                  {/* CV drop zone in Applied column */}
                  {isApplied && canUpload && (
                    <div
                      onClick={() => setShowCVParser(true)}
                      style={{
                        border: "1.5px dashed var(--border2)",
                        borderRadius: "var(--radius)",
                        padding: "12px 8px",
                        textAlign: "center",
                        cursor: "pointer",
                        marginBottom: 6,
                        transition: "all 0.15s",
                        background: "transparent",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-soft)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>📄</div>
                      <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", lineHeight: 1.4 }}>Drop CV here<br />to auto-parse</div>
                    </div>
                  )}

                  {stageApps.map(app => {
                    const cand = candidates.find(c => c.id === app.candidateId);
                    const job = jobs.find(j => j.id === app.jobId);
                    if (!cand) return null;
                    return (
                      <div key={app.id} className="kanban-card" onClick={() => canMove && openModal("moveStage", { app, cand, job })}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: cand.color + "22", color: cand.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{initials(cand.name)}</div>
                          <span className="kanban-card-name">{cand.name}</span>
                        </div>
                        <div className="kanban-card-job">{job?.title}</div>
                        <div className="kanban-card-meta">
                          <span className="kanban-card-days">{app.daysInStage}d in stage</span>
                          <span className="tag" style={{ fontSize: 9 }}>{job?.entity?.split(" ")[0] || "—"}</span>
                        </div>
                      </div>
                    );
                  })}
                  {stageApps.length === 0 && !isApplied && (
                    <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text3)", fontSize: 11 }}>Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── INTERVIEWS PAGE ───────────────────────────────────────────────────────────
function InterviewsPage({ interviews, setInterviews, applications, candidates, jobs, scorecards, currentRole, openModal }) {
  const [tab, setTab] = useState("scheduled");

  const canSchedule = currentRole === "HR Admin" || currentRole === "Recruiter";
  const canScore = currentRole === "HR Admin" || currentRole === "Recruiter" || currentRole === "Interviewer";

  const enrichedInterviews = interviews.map(i => {
    const app = applications.find(a => a.id === i.applicationId);
    const cand = app ? candidates.find(c => c.id === app.candidateId) : null;
    const job = app ? jobs.find(j => j.id === app.jobId) : null;
    const sc = scorecards.find(s => s.applicationId === i.applicationId);
    return { ...i, app, cand, job, sc };
  }).filter(i => i.cand);

  const scheduled = enrichedInterviews.filter(i => i.status === "Scheduled");
  const completed = enrichedInterviews.filter(i => i.status === "Completed");
  const displayed = tab === "scheduled" ? scheduled : completed;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Interviews & Scorecards</div>
          <div className="page-sub">{scheduled.length} upcoming, {completed.length} completed</div>
        </div>
        {canSchedule && <button className="btn btn-primary" onClick={() => openModal("scheduleInterview")}><Icon name="plus" size={14} /> Schedule Interview</button>}
      </div>
      <div className="page-content">
        <div className="tabs" style={{ marginBottom: 16 }}>
          <div className={`tab ${tab === "scheduled" ? "active" : ""}`} onClick={() => setTab("scheduled")}>Scheduled ({scheduled.length})</div>
          <div className={`tab ${tab === "completed" ? "active" : ""}`} onClick={() => setTab("completed")}>Completed ({completed.length})</div>
        </div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Candidate</th><th>Job</th><th>Interview type</th><th>Date & time</th><th>Format</th><th>Interviewer</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {displayed.map(i => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: i.cand.color + "22", color: i.cand.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{initials(i.cand.name)}</div>
                        <span className="strong">{i.cand.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{i.job?.title}</td>
                    <td><span className="badge badge-teal">{i.type}</span></td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>{i.scheduledAt}</td>
                    <td><span className="badge badge-gray">{i.format}</span></td>
                    <td style={{ color: "var(--text2)" }}>{i.interviewerId}</td>
                    <td><span className={`badge ${i.status === "Completed" ? "badge-green" : "badge-amber"}`}>{i.status}</span></td>
                    <td>
                      {canScore && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openModal("scorecard", { interview: i, app: i.app, cand: i.cand, job: i.job, existingScore: i.sc })}>
                          {i.sc ? "View Score" : "Score"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {displayed.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text3)", padding: "40px" }}>No interviews in this view</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ── OFFERS PAGE ───────────────────────────────────────────────────────────────
// ── EMAIL NOTIFICATION SYSTEM ─────────────────────────────────────────────────
const PERSONNEL_RECIPIENT = {
  name: "Islam Ahmed",
  email: "islam.ahmed@karmsolar.com",
  role: "Personnel & Recruitment",
};

function buildOfferEmail({ cand, job, offer, approvedBy }) {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  return {
    to: PERSONNEL_RECIPIENT.email,
    toName: PERSONNEL_RECIPIENT.name,
    subject: `✅ Offer Approved — ${cand.name} | ${job.title}`,
    body: `Dear ${PERSONNEL_RECIPIENT.name},

This is an automated notification from Karm. ATS to confirm that an offer has been approved and requires your action.

─────────────────────────────────────
OFFER DETAILS
─────────────────────────────────────
Candidate name  : ${cand.name}
Position        : ${job.title}
Department      : ${job.dept}
Entity          : ${job.entity}
Proposed salary : ${offer.salary.toLocaleString()} ${offer.currency}
Start date      : ${offer.startDate}
─────────────────────────────────────
APPROVAL DETAILS
─────────────────────────────────────
Approved by     : ${approvedBy}
Approval date   : ${today}
Offer created by: ${offer.createdBy}
─────────────────────────────────────

ACTION REQUIRED
Please proceed with the following steps:
  1. Prepare the formal offer letter for ${cand.name}
  2. Initiate the onboarding documentation
  3. Coordinate the start date logistics with the relevant department
  4. Update social insurance and payroll records upon joining

If you have any questions, please contact Yara Rashad (yara.rashad@karmsolar.com).

Best regards,
Karm. ATS — Automated Notification
KarmSolar · Sarapis Energy
`,
  };
}

function EmailNotificationModal({ email, onClose, sentAt }) {
  const [copied, setCopied] = useState(false);
  const copyBody = () => {
    navigator.clipboard?.writeText(email.body).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--green-soft)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="mail" size={14} />
              </div>
              <div>
                <div className="modal-title">Email notification sent</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 1 }}>{sentAt}</div>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ padding: "20px 24px" }}>

          {/* Status banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--green-soft)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "var(--radius)", marginBottom: 20 }}>
            <span style={{ color: "var(--green)", display: "flex" }}><Icon name="check" size={16} /></span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--green)" }}>Notification dispatched successfully</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>In production this triggers your SMTP / SendGrid / EmailJS integration</div>
            </div>
          </div>

          {/* Email header fields */}
          {[
            { label: "To", value: `${email.toName} <${email.to}>` },
            { label: "Subject", value: email.subject },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 52, fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)", paddingTop: 2, flexShrink: 0, textAlign: "right" }}>{label}</div>
              <div style={{ flex: 1, fontSize: 13, color: "var(--text)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "7px 12px" }}>{value}</div>
            </div>
          ))}

          {/* Email body */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 52, fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)", paddingTop: 10, flexShrink: 0, textAlign: "right" }}>Body</div>
            <div style={{ flex: 1, position: "relative" }}>
              <pre style={{ fontSize: 12, color: "var(--text2)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", whiteSpace: "pre-wrap", lineHeight: 1.7, fontFamily: "var(--mono)", maxHeight: 320, overflowY: "auto" }}>{email.body}</pre>
              <button onClick={copyBody} className="btn btn-ghost btn-sm" style={{ position: "absolute", top: 8, right: 8, fontSize: 11 }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Integration note */}
          <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--bg3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Connect a real mail service</div>
            <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
              To send real emails, wire the <code style={{ background: "var(--bg4)", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>sendOfferNotification()</code> function to <strong style={{ color: "var(--text)" }}>EmailJS</strong>, <strong style={{ color: "var(--text)" }}>SendGrid</strong>, or your company SMTP. The email payload is already structured and ready.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => { window.open(`mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`); }}>
            <Icon name="mail" size={13} /> Open in Mail Client
          </button>
        </div>
      </div>
    </div>
  );
}

// ── NOTIFICATION LOG ──────────────────────────────────────────────────────────
function NotificationLog({ notifications }) {
  if (notifications.length === 0) return null;
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <div className="card-title">Email notifications sent</div>
        <span className="badge badge-green">{notifications.length} sent</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Recipient</th><th>Subject</th><th>Triggered by</th><th>Sent at</th><th></th></tr></thead>
          <tbody>
            {notifications.map((n, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>IA</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{n.email.toName}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{n.email.to}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "var(--text2)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.email.subject}</td>
                <td style={{ fontSize: 12, color: "var(--text2)" }}>{n.triggeredBy}</td>
                <td style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)" }}>{n.sentAt}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => n.onView()}>View email</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OffersPage({ offers, setOffers, applications, candidates, jobs, currentRole, roleConfig, openModal }) {
  const canCreate = currentRole === "HR Admin" || currentRole === "Recruiter";
  const canApprove = roleConfig.canApproveOffer || currentRole === "HR Admin";

  const [notifications, setNotifications] = useState([]);
  const [viewingEmail, setViewingEmail] = useState(null);

  const enriched = offers.map(o => {
    const app = applications.find(a => a.id === o.applicationId);
    const cand = app ? candidates.find(c => c.id === app.candidateId) : null;
    const job = app ? jobs.find(j => j.id === app.jobId) : null;
    return { ...o, app, cand, job };
  }).filter(o => o.cand);

  const approveOffer = (id) => {
    const offer = enriched.find(o => o.id === id);
    const now = new Date();
    const sentAt = now.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const approvedByName = roleConfig.fullName;

    setOffers(prev => prev.map(o => o.id === id
      ? { ...o, status: "Approved", approvedBy: approvedByName, approvedDate: now.toISOString().split("T")[0] }
      : o
    ));

    // Build and "send" the email notification
    const emailPayload = buildOfferEmail({
      cand: offer.cand,
      job: offer.job,
      offer,
      approvedBy: approvedByName,
    });

    const notif = {
      email: emailPayload,
      sentAt,
      triggeredBy: approvedByName,
      onView: () => setViewingEmail({ email: emailPayload, sentAt }),
    };

    setNotifications(prev => [notif, ...prev]);
    // Auto-show preview AND auto-open Outlook/mail client
    setViewingEmail({ email: emailPayload, sentAt });
    setTimeout(() => {
      window.open(`mailto:${emailPayload.to}?subject=${encodeURIComponent(emailPayload.subject)}&body=${encodeURIComponent(emailPayload.body)}`);
    }, 400);
  };

  const rejectOffer = (id) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: "Rejected" } : o));
  };

  return (
    <>
      {viewingEmail && (
        <EmailNotificationModal
          email={viewingEmail.email}
          sentAt={viewingEmail.sentAt}
          onClose={() => setViewingEmail(null)}
        />
      )}
      <div className="page-header">
        <div>
          <div className="page-title">Offer Approvals</div>
          <div className="page-sub">{offers.filter(o => o.status === "Pending Approval").length} pending approval</div>
        </div>
        {canCreate && <button className="btn btn-primary" onClick={() => openModal("addOffer")}><Icon name="plus" size={14} /> Create Offer</button>}
      </div>
      <div className="page-content">
        {enriched.filter(o => o.status === "Pending Approval").length > 0 && canApprove && (
          <div className="alert alert-amber" style={{ marginBottom: 16 }}>
            <Icon name="alert" size={16} />
            <span>You have {enriched.filter(o => o.status === "Pending Approval").length} offer{enriched.filter(o => o.status === "Pending Approval").length > 1 ? "s" : ""} awaiting your approval.</span>
          </div>
        )}

        {/* NOTIFICATION LOG */}
        <NotificationLog notifications={notifications} />

        {/* APPROVAL WORKFLOW STEPS */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">Approval workflow</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              <Icon name="mail" size={12} />
              <span>Auto-notifies islam.ahmed@karmsolar.com on approval</span>
            </div>
          </div>
          <div className="card-body">
            <div className="offer-steps">
              {[
                { label: "Recruiter prepares offer", done: true },
                { label: "HR Admin reviews", done: true },
                { label: "CEO approves", active: true },
                { label: "📧 Personnel notified", notify: true },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div className={`offer-step ${step.done ? "done" : step.active ? "active" : ""}`} style={{ flex: "none" }}>
                    {step.done ? (
                      <div className="offer-step-done-icon"><Icon name="check" size={10} /></div>
                    ) : step.notify ? (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="mail" size={11} />
                      </div>
                    ) : (
                      <div className="offer-step-num">{i + 1}</div>
                    )}
                    <span style={{ fontSize: 11, marginLeft: 6, whiteSpace: "nowrap" }}>{step.label}</span>
                  </div>
                  {i < 3 && <div className="offer-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Candidate</th><th>Job</th><th>Salary (EGP)</th><th>Start date</th><th>Created by</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {enriched.map(o => (
                  <tr key={o.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: o.cand.color + "22", color: o.cand.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{initials(o.cand.name)}</div>
                        <span className="strong">{o.cand.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{o.job?.title}</td>
                    <td style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 500 }}>{o.salary.toLocaleString()}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>{o.startDate}</td>
                    <td style={{ color: "var(--text2)" }}>{o.createdBy}</td>
                    <td><span className={`badge ${o.status === "Pending Approval" ? "badge-amber" : o.status === "Approved" ? "badge-green" : "badge-red"}`}>{o.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openModal("viewOffer", { offer: o })}>View</button>
                        {o.status === "Approved" && notifications.find(n => n.email.subject.includes(o.cand?.name)) && (
                          <button className="btn btn-ghost btn-sm" style={{ color: "var(--accent)", borderColor: "var(--accent-soft)" }}
                            onClick={() => { const n = notifications.find(nn => nn.email.subject.includes(o.cand?.name)); if (n) setViewingEmail({ email: n.email, sentAt: n.sentAt }); }}>
                            <Icon name="mail" size={12} /> Email sent
                          </button>
                        )}
                        {canApprove && o.status === "Pending Approval" && (
                          <>
                            <button className="btn btn-sm" style={{ background: "var(--green-soft)", color: "var(--green)", border: "1px solid rgba(74,222,128,0.2)" }} onClick={() => approveOffer(o.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => rejectOffer(o.id)}>Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {enriched.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text3)", padding: "40px" }}>No offers created yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage({ currentRole, roleAssignments, setRoleAssignments, ROLES_CONFIG }) {
  const [activeTab, setActiveTab] = useState("users");
  const [saved, setSaved] = useState(false);
  const [localAssignments, setLocalAssignments] = useState({ ...roleAssignments });

  const saveAssignments = () => {
    setRoleAssignments(localAssignments);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const changed = JSON.stringify(localAssignments) !== JSON.stringify(roleAssignments);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Manage role assignments, pipeline stages, and entities</div>
        </div>
      </div>
      <div className="page-content">
        <div className="tabs" style={{ marginBottom: 16 }}>
          {["users", "stages", "entities"].map(t => (
            <div key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)} style={{ textTransform: "capitalize" }}>{t}</div>
          ))}
        </div>

        {activeTab === "users" && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <div className="card-title">Role assignments</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>Assign any team member to any system role</div>
              </div>
              <div className="card-body">
                {ROLE_LIST.map(role => {
                  const perms = ROLE_PERMISSIONS[role];
                  const assignedIdx = localAssignments[role];
                  const member = TEAM[assignedIdx];
                  return (
                    <div key={role} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 200, flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{role}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {perms.canSeeAll && <span className="badge badge-blue" style={{ fontSize: 10 }}>Full access</span>}
                          {perms.canApproveOffer && <span className="badge badge-amber" style={{ fontSize: 10 }}>Approves offers</span>}
                          {perms.canManageUsers && <span className="badge badge-teal" style={{ fontSize: 10 }}>Manages users</span>}
                          {!perms.canSeeAll && !perms.canApproveOffer && <span className="badge badge-gray" style={{ fontSize: 10 }}>Scoped access</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: member.color + "22", color: member.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{member.initials}</div>
                        <select
                          className="form-select"
                          value={assignedIdx}
                          onChange={e => setLocalAssignments(prev => ({ ...prev, [role]: parseInt(e.target.value) }))}
                          style={{ flex: 1 }}
                        >
                          {TEAM.map((t, i) => (
                            <option key={i} value={i}>{t.fullName} — {t.email}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {changed ? "⚠ You have unsaved changes" : saved ? "✓ Roles saved" : "Role assignments are saved to this browser"}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={saveAssignments}
                  disabled={!changed}
                  style={{ opacity: changed ? 1 : 0.5 }}
                >
                  {saved ? "✓ Saved!" : "Save role assignments"}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">All team members</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Assigned role</th><th>Can approve offers</th><th>Salary visible</th></tr></thead>
                  <tbody>
                    {TEAM.map((u, idx) => {
                      const assignedRole = Object.entries(localAssignments).find(([, i]) => i === idx);
                      const role = assignedRole ? assignedRole[0] : null;
                      const perms = role ? ROLE_PERMISSIONS[role] : null;
                      return (
                        <tr key={u.email}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: u.color + "22", color: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{u.initials}</div>
                              <span className="strong">{u.fullName}</span>
                            </div>
                          </td>
                          <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)" }}>{u.email}</td>
                          <td>{role ? <span className="badge badge-blue">{role}</span> : <span className="badge badge-gray">—</span>}</td>
                          <td>{perms?.canApproveOffer ? <span style={{ color: "var(--green)" }}><Icon name="check" size={14} /></span> : <span style={{ color: "var(--text3)" }}>—</span>}</td>
                          <td>{perms?.canSeeAll || perms?.canApproveOffer ? <span style={{ color: "var(--green)" }}><Icon name="check" size={14} /></span> : <span style={{ color: "var(--text3)" }}>—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stages" && (
          <div className="card">
            <div className="card-header"><div className="card-title">Pipeline stages</div></div>
            <div className="card-body">
              {STAGES.map((stage, i) => (
                <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < STAGES.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "var(--mono)", color: "var(--text3)" }}>{i + 1}</div>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: stageColor(stage) }} />
                  <span style={{ fontSize: 13, color: "var(--text)" }}>{stage}</span>
                  <span className={`badge ${stageBadge(stage)}`} style={{ marginLeft: "auto" }}>{i < 7 ? "Active" : "Terminal"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "entities" && (
          <div className="card">
            <div className="card-header"><div className="card-title">Company entities</div></div>
            <div className="card-body">
              {[
            { name: "HoldCo. (UK)",      country: "United Kingdom", type: "Group holding company",       color: "#4f8ef7" },
            { name: "Sub HoldCo. (NL)",  country: "Netherlands",    type: "Sub-holding entity",           color: "#a78bfa" },
            { name: "Karm Egypt",        country: "Egypt",          type: "Solar EPC, O&M & Operations",  color: "#2dd4b4" },
            { name: "Karm Cyprus",       country: "Cyprus",         type: "Energy trading & development",  color: "#f59e0b" },
            { name: "Karm Tunisia",      country: "Tunisia",        type: "North Africa expansion",        color: "#fb923c" },
          ].map(e => (
                <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: "var(--bg3)", borderRadius: "var(--radius)", marginBottom: 10, border: "1px solid var(--border)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: e.color + "22", border: `1px solid ${e.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: e.color }}>{e.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{e.type} · {e.country}</div>
                  </div>
                  <span className="badge badge-green" style={{ marginLeft: "auto" }}>Active</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function AddJobModal({ data, closeModal, ctx }) {
  const [form, setForm] = useState({ title: "", dept: DEPARTMENTS[0], entity: ENTITIES[0], positionType: "Manpower", level: JOB_FAMILIES[0], headcount: 1, status: "Open", description: "", salaryMin: "", salaryMax: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title) return;
    const newJob = { ...form, id: Date.now(), openDate: new Date().toISOString().split("T")[0], recruiter: "Islam Ahmed", hiringManager: "Yara Rashad", headcount: parseInt(form.headcount), salaryMin: parseFloat(form.salaryMin) || 0, salaryMax: parseFloat(form.salaryMax) || 0 };
    ctx.setJobs(prev => [...prev, newJob]);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">New Job Requisition</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Job title *</label><input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior Solar Engineer" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Department</label><select className="form-select" value={form.dept} onChange={e => set("dept", e.target.value)}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Entity</label><select className="form-select" value={form.entity} onChange={e => set("entity", e.target.value)}>{ENTITIES.map(en => <option key={en}>{en}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Position type</label>
              <select className="form-select" value={form.positionType} onChange={e => set("positionType", e.target.value)}>
                {POSITION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Job family</label><select className="form-select" value={form.level} onChange={e => set("level", e.target.value)}>{JOB_FAMILIES.map(f => <option key={f}>{f}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Headcount</label><input className="form-input" type="number" min="1" value={form.headcount} onChange={e => set("headcount", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Initial status</label><select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}><option>Draft</option><option>Open</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Min salary (EGP)</label><input className="form-input" type="number" value={form.salaryMin} onChange={e => set("salaryMin", e.target.value)} placeholder="20000" /></div>
            <div className="form-group"><label className="form-label">Max salary (EGP)</label><input className="form-input" type="number" value={form.salaryMax} onChange={e => set("salaryMax", e.target.value)} placeholder="35000" /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Role summary and requirements..." /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create Requisition</button>
        </div>
      </div>
    </div>
  );
}

function AddCandidateModal({ data, closeModal, ctx }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", nationality: "Egyptian", source: SOURCES[0], jobId: ctx.jobs.find(j => j.status === "Open")?.id || "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const colors = ["#4f8ef7","#2dd4b4","#a78bfa","#f59e0b","#fb923c","#f87171","#4ade80"];

  const submit = () => {
    if (!form.name || !form.email) return;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newCand = { ...form, id: Date.now(), cvUrl: "#", addedDate: new Date().toISOString().split("T")[0], tags: [], color };
    ctx.setCandidates(prev => [...prev, newCand]);
    if (form.jobId) {
      const newApp = { id: Date.now() + 1, candidateId: newCand.id, jobId: parseInt(form.jobId), stage: "Applied", status: "Active", recruiter: "Islam Ahmed", appliedDate: new Date().toISOString().split("T")[0], notes: "", daysInStage: 0 };
      ctx.setApplications(prev => [...prev, newApp]);
    }
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Add Candidate</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Full name *</label><input className="form-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ahmed Kamel" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="candidate@email.com" /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+20 1xx xxx xxxx" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Nationality</label><input className="form-input" value={form.nationality} onChange={e => set("nationality", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Source</label><select className="form-select" value={form.source} onChange={e => set("source", e.target.value)}>{SOURCES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Apply to job (optional)</label>
            <select className="form-select" value={form.jobId} onChange={e => set("jobId", e.target.value)}>
              <option value="">— No job yet —</option>
              {ctx.jobs.filter(j => j.status === "Open").map(j => <option key={j.id} value={j.id}>{j.title} ({j.entity})</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Add Candidate</button>
        </div>
      </div>
    </div>
  );
}

function ViewCandidateModal({ data, closeModal, ctx }) {
  const { candidate: c, activeApp, activeJob } = data;
  const allApps = ctx.applications.filter(a => a.candidateId === c.id);
  const stageIdx = activeApp ? stageIndex(activeApp.stage) : -1;
  const [movingStage, setMovingStage] = useState(false);
  const [movingJob, setMovingJob] = useState(false);
  const [selectedStage, setSelectedStage] = useState(activeApp?.stage || "Applied");
  const [selectedJobId, setSelectedJobId] = useState(activeApp?.jobId || "");
  const [moveNotes, setMoveNotes] = useState(activeApp?.notes || "");

  const openJobs = ctx.jobs.filter(j => j.status === "Open");

  const saveStage = () => {
    ctx.setApplications(prev => prev.map(a => a.id === activeApp.id ? { ...a, stage: selectedStage, notes: moveNotes, daysInStage: 0 } : a));
    setMovingStage(false);
    closeModal();
  };

  const saveJob = () => {
    if (!selectedJobId) return;
    ctx.setApplications(prev => prev.map(a => a.id === activeApp.id ? { ...a, jobId: parseInt(selectedJobId), stage: "Applied", daysInStage: 0 } : a));
    setMovingJob(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.color + "22", color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{initials(c.name)}</div>
            <div>
              <div className="modal-title">{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>{c.source} · Added {c.addedDate}</div>
            </div>
          </div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-row" style={{ marginBottom: 20 }}>
            <div>
              <div className="form-label">Contact</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>{c.email}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{c.phone || "—"}</div>
            </div>
            <div>
              <div className="form-label">Nationality</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{c.nationality}</div>
            </div>
          </div>

          {activeApp && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div className="form-label" style={{ margin: 0 }}>Current pipeline stage</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setMovingJob(!movingJob); setMovingStage(false); }}>
                    🔀 Change job
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setMovingStage(!movingStage); setMovingJob(false); }}>
                    ↕ Move stage
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {PIPELINE_STAGES.map((s, i) => (
                    <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: i < stageIdx ? "var(--accent)" : i === stageIdx ? stageColor(activeApp.stage) : "var(--bg4)" }} title={s} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`badge ${stageBadge(activeApp.stage)}`}>{activeApp.stage}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>on {activeJob?.title} · {activeJob?.dept}</span>
                </div>
              </div>

              {/* MOVE STAGE PANEL */}
              {movingStage && (
                <div style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "16px", marginBottom: 16, border: "1px solid var(--border2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Move to stage</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                    {STAGES.map(stage => (
                      <div key={stage} onClick={() => setSelectedStage(stage)} style={{ padding: "8px 10px", borderRadius: "var(--radius)", border: `1px solid ${selectedStage === stage ? stageColor(stage) : "var(--border)"}`, background: selectedStage === stage ? stageColor(stage) + "18" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: stageColor(stage), flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: selectedStage === stage ? "var(--text)" : "var(--text2)", fontWeight: selectedStage === stage ? 500 : 400 }}>{stage}</span>
                      </div>
                    ))}
                  </div>
                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" style={{ minHeight: 60 }} value={moveNotes} onChange={e => setMoveNotes(e.target.value)} placeholder="Reason for stage change..." />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setMovingStage(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={saveStage}>Confirm move</button>
                  </div>
                </div>
              )}

              {/* CHANGE JOB PANEL */}
              {movingJob && (
                <div style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "16px", marginBottom: 16, border: "1px solid var(--border2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Move candidate to a different job</div>
                  <div className="alert alert-amber" style={{ marginBottom: 12, fontSize: 12 }}>
                    <Icon name="alert" size={13} /> Candidate will be moved to the Applied stage of the selected job.
                  </div>
                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label">Select job</label>
                    <select className="form-select" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
                      <option value="">— Select a job —</option>
                      {openJobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title} · {j.dept} · {j.entity}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setMovingJob(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={saveJob} disabled={!selectedJobId}>Confirm transfer</button>
                  </div>
                </div>
              )}

              {activeApp.notes && !movingStage && !movingJob && (
                <div style={{ background: "var(--bg3)", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
                  <div className="form-label" style={{ marginBottom: 4 }}>Recruiter notes</div>
                  {activeApp.notes}
                </div>
              )}
            </>
          )}

          <div className="form-label">Application history</div>
          {allApps.length === 0 ? (
            <div style={{ color: "var(--text3)", fontSize: 13 }}>No applications yet.</div>
          ) : allApps.map(app => {
            const job = ctx.jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{job?.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>{app.appliedDate}</div>
                </div>
                <span className={`badge ${stageBadge(app.stage)}`}>{app.stage}</span>
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
}

function MoveStageModal({ data, closeModal, ctx }) {
  const { app, cand, job } = data;
  const [selectedStage, setSelectedStage] = useState(app.stage);
  const [notes, setNotes] = useState(app.notes || "");

  const save = () => {
    ctx.setApplications(prev => prev.map(a => a.id === app.id ? { ...a, stage: selectedStage, notes, daysInStage: 0 } : a));
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Move candidate</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: "var(--bg3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: cand.color + "22", color: cand.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{initials(cand.name)}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{cand.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{job?.title}</div>
            </div>
            <span className={`badge ${stageBadge(app.stage)}`} style={{ marginLeft: "auto" }}>{app.stage}</span>
          </div>

          <div className="form-group">
            <label className="form-label">Move to stage</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {STAGES.map(stage => (
                <div key={stage} onClick={() => setSelectedStage(stage)} style={{ padding: "9px 12px", borderRadius: "var(--radius)", border: `1px solid ${selectedStage === stage ? stageColor(stage) : "var(--border)"}`, background: selectedStage === stage ? stageColor(stage) + "18" : "var(--bg3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.1s" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: stageColor(stage), flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: selectedStage === stage ? "var(--text)" : "var(--text2)", fontWeight: selectedStage === stage ? 500 : 400 }}>{stage}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add context for this stage move..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save & Move</button>
        </div>
      </div>
    </div>
  );
}

function ScorecardModal({ data, closeModal, ctx }) {
  const { interview, app, cand, job, existingScore } = data;
  const [scores, setScores] = useState({ knowledge: existingScore?.knowledge || 0, attitude: existingScore?.attitude || 0, feedback: existingScore?.feedback || 0 });
  const [recommendation, setRecommendation] = useState(existingScore?.recommendation || "");
  const [notes, setNotes] = useState(existingScore?.notes || "");
  const readOnly = !!existingScore;

  const avg = scores.knowledge && scores.attitude && scores.feedback
    ? ((scores.knowledge + scores.attitude + scores.feedback) / 3).toFixed(1)
    : "—";

  const StarRow = ({ label, field }) => (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <div className="score-stars">
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className={`score-star ${scores[field] >= n ? "active" : ""}`}
            onClick={() => !readOnly && setScores(p => ({ ...p, [field]: n }))}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );

  const submit = () => {
    if (!recommendation) return;
    const newSc = { id: Date.now(), applicationId: app.id, interviewerId: ctx.roleConfig.fullName, interviewType: interview.type, knowledge: scores.knowledge, attitude: scores.attitude, feedback: scores.feedback, recommendation, notes, submittedDate: new Date().toISOString().split("T")[0] };
    ctx.setScorecards(prev => [...prev.filter(s => s.applicationId !== app.id), newSc]);
    ctx.setInterviews(prev => prev.map(i => i.id === interview.id ? { ...i, status: "Completed" } : i));
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Interview Scorecard</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{cand?.name} · {interview?.type}</div>
          </div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          {readOnly && <div className="alert alert-info" style={{ marginBottom: 16 }}><Icon name="alert" size={14} />Scorecard submitted on {existingScore.submittedDate}</div>}
          <StarRow label="Knowledge" field="knowledge" />
          <StarRow label="Attitude" field="attitude" />
          <StarRow label="Feedback" field="feedback" />

          <div className="divider" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "var(--text2)" }}>Average score</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--mono)" }}>{avg}<span style={{ fontSize: 13, color: "var(--text3)" }}>/5</span></span>
          </div>

          <div className="form-group">
            <label className="form-label">Recommendation</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Hire", "Maybe", "No Hire"].map(r => (
                <div key={r} onClick={() => !readOnly && setRecommendation(r)} style={{ flex: 1, padding: "9px", textAlign: "center", borderRadius: "var(--radius)", border: `1px solid ${recommendation === r ? (r === "Hire" ? "var(--green)" : r === "Maybe" ? "var(--amber)" : "var(--red)") : "var(--border)"}`, background: recommendation === r ? (r === "Hire" ? "var(--green-soft)" : r === "Maybe" ? "var(--amber-soft)" : "var(--red-soft)") : "var(--bg3)", cursor: readOnly ? "default" : "pointer", fontSize: 13, fontWeight: recommendation === r ? 600 : 400, color: recommendation === r ? (r === "Hire" ? "var(--green)" : r === "Maybe" ? "var(--amber)" : "var(--red)") : "var(--text2)", transition: "all 0.1s" }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes {readOnly ? "" : "(visible to HR Admin only)"}</label>
            <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} readOnly={readOnly} placeholder="Strengths, concerns, overall impression..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>{readOnly ? "Close" : "Cancel"}</button>
          {!readOnly && <button className="btn btn-primary" onClick={submit} disabled={!recommendation}>Submit Scorecard</button>}
        </div>
      </div>
    </div>
  );
}

function AddOfferModal({ data, closeModal, ctx }) {
  const activeApps = ctx.applications.filter(a => a.status === "Active" && ["Final Interview", "Offer"].includes(a.stage));
  const [form, setForm] = useState({ applicationId: activeApps[0]?.id || "", salary: "", currency: "EGP", startDate: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const selectedApp = ctx.applications.find(a => a.id === parseInt(form.applicationId));
  const selectedCand = selectedApp ? ctx.candidates.find(c => c.id === selectedApp.candidateId) : null;
  const selectedJob = selectedApp ? ctx.jobs.find(j => j.id === selectedApp.jobId) : null;

  const submit = () => {
    if (!form.applicationId || !form.salary || !form.startDate) return;
    const newOffer = { id: Date.now(), applicationId: parseInt(form.applicationId), salary: parseFloat(form.salary), currency: form.currency, startDate: form.startDate, status: "Pending Approval", createdBy: ctx.roleConfig.fullName, approvalNote: "", createdDate: new Date().toISOString().split("T")[0] };
    ctx.setOffers(prev => [...prev, newOffer]);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create Offer</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Candidate & job *</label>
            <select className="form-select" value={form.applicationId} onChange={e => set("applicationId", e.target.value)}>
              <option value="">— Select candidate —</option>
              {activeApps.map(app => {
                const cand = ctx.candidates.find(c => c.id === app.candidateId);
                const job = ctx.jobs.find(j => j.id === app.jobId);
                return <option key={app.id} value={app.id}>{cand?.name} → {job?.title}</option>;
              })}
            </select>
          </div>
          {selectedJob && (
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <Icon name="alert" size={14} />
              <span>Salary band for {selectedJob.title}: {selectedJob.salaryMin.toLocaleString()} – {selectedJob.salaryMax.toLocaleString()} EGP</span>
            </div>
          )}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Proposed salary *</label><input className="form-input" type="number" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 55000" /></div>
            <div className="form-group"><label className="form-label">Currency</label><select className="form-select" value={form.currency} onChange={e => set("currency", e.target.value)}><option>EGP</option><option>USD</option><option>EUR</option></select></div>
          </div>
          <div className="form-group"><label className="form-label">Proposed start date *</label><input className="form-input" type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Submit for Approval</button>
        </div>
      </div>
    </div>
  );
}

function ViewOfferModal({ data, closeModal, ctx }) {
  const { offer } = data;
  const { cand, job, app } = offer;

  const statusColor = offer.status === "Approved" ? "var(--green)" : offer.status === "Pending Approval" ? "var(--amber)" : "var(--red)";

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Offer Details</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ background: "var(--bg3)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: 20, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: cand?.color + "22", color: cand?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>{cand ? initials(cand.name) : "?"}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{cand?.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{job?.title} · {job?.entity}</div>
              </div>
              <span style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 20, background: statusColor + "22", color: statusColor, fontSize: 12, fontWeight: 500 }}>{offer.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><div className="form-label">Proposed salary</div><div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--mono)" }}>{offer.salary.toLocaleString()} <span style={{ fontSize: 13, color: "var(--text3)" }}>{offer.currency}</span></div></div>
              <div><div className="form-label">Start date</div><div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{offer.startDate}</div></div>
              <div><div className="form-label">Created by</div><div style={{ fontSize: 13, color: "var(--text2)" }}>{offer.createdBy}</div></div>
              <div><div className="form-label">Created date</div><div style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--mono)" }}>{offer.createdDate}</div></div>
            </div>
          </div>
          {job && (
            <div className="alert alert-info">
              <Icon name="alert" size={14} />
              <span>Salary band for this role: {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()} EGP. Proposed: {offer.salary.toLocaleString()} EGP {offer.salary > job.salaryMax ? "⚠ above band" : offer.salary < job.salaryMin ? "⚠ below band" : "✓ within band"}.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
}

function ScheduleInterviewModal({ data, closeModal, ctx }) {
  const eligibleApps = ctx.applications.filter(a => a.status === "Active" && !["Applied", "Hired", "Rejected", "On Hold"].includes(a.stage));
  const [form, setForm] = useState({ applicationId: eligibleApps[0]?.id || "", type: "1st Interview", scheduledAt: "", format: "In-person", interviewerId: "Mohi Mohsen" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.applicationId || !form.scheduledAt) return;
    const newInterview = { id: Date.now(), applicationId: parseInt(form.applicationId), type: form.type, scheduledAt: form.scheduledAt, format: form.format, interviewerId: form.interviewerId, status: "Scheduled" };
    ctx.setInterviews(prev => [...prev, newInterview]);
    closeModal();
  };

  const interviewers = TEAM.map(t => t.fullName);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Schedule Interview</div>
          <button className="modal-close" onClick={closeModal}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Candidate *</label>
            <select className="form-select" value={form.applicationId} onChange={e => set("applicationId", e.target.value)}>
              {eligibleApps.map(app => {
                const cand = ctx.candidates.find(c => c.id === app.candidateId);
                const job = ctx.jobs.find(j => j.id === app.jobId);
                return <option key={app.id} value={app.id}>{cand?.name} → {job?.title} ({app.stage})</option>;
              })}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Interview type</label>
              <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
                {["HR Screening","1st Interview","Technical Interview","Panel Interview","Final Interview"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Format</label>
              <select className="form-select" value={form.format} onChange={e => set("format", e.target.value)}>
                {["In-person","Video call","Phone"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date & time *</label><input className="form-input" type="datetime-local" value={form.scheduledAt} onChange={e => set("scheduledAt", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Interviewer</label>
              <select className="form-select" value={form.interviewerId} onChange={e => set("interviewerId", e.target.value)}>
                {interviewers.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Schedule Interview</button>
        </div>
      </div>
    </div>
  );
}
