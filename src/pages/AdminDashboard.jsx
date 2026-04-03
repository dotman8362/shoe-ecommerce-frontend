import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:         #0e0c0a;
    --bg-card:    #141210;
    --bg-input:   #1a1714;
    --border:     rgba(255,255,255,0.07);
    --gold:       #c49c68;
    --gold-light: #dbb98a;
    --text:       #f0ebe3;
    --text-muted: #8a8178;
    --text-faint: #4a4540;
    --success:    #7aab8a;
    --warning:    #c49c68;
    --danger:     #a87878;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
    --sidebar-w:  260px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Grain ── */
  .ad-grain {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 200; opacity: 0.5;
  }

  /* ── Shell ── */
  .ad-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  /* ── Sidebar overlay (mobile) ── */
  .ad-overlay {
    position: fixed; inset: 0;
    background: rgba(14,12,10,0.7);
    backdrop-filter: blur(4px);
    z-index: 99;
  }

  /* ── Sidebar ── */
  .ad-sidebar {
    width: var(--sidebar-w);
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
    transition: transform 0.32s var(--ease);
    z-index: 100;
  }

  .ad-sidebar.mobile {
    position: fixed;
    left: 0; top: 0; bottom: 0;
  }

  .ad-sidebar.hidden { transform: translateX(-100%); }

  /* Sidebar top edge gold rule */
  .ad-sidebar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.25;
  }

  .ad-sb-head {
    padding: 32px 28px 24px;
    border-bottom: 1px solid var(--border);
  }

  .ad-sb-brand {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text);
    letter-spacing: 0.02em;
    margin-bottom: 8px;
    display: block;
  }

  .ad-sb-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 4px 10px;
    border: 1px solid rgba(196,156,104,0.3);
    border-radius: 1px;
    background: rgba(196,156,104,0.06);
  }

  .ad-sb-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--success);
    animation: pulse 2.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }

  /* Sidebar nav */
  .ad-nav {
    flex: 1;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    overflow-y: auto;
  }

  .ad-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border: none;
    border-radius: 2px;
    background: transparent;
    color: var(--text-faint);
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    cursor: pointer;
    width: 100%;
    text-align: left;
    position: relative;
    transition: color 0.2s var(--ease), background 0.2s;
  }

  .ad-nav-item:hover { color: var(--text-muted); background: rgba(255,255,255,0.03); }

  .ad-nav-item.active {
    color: var(--gold);
    background: rgba(196,156,104,0.07);
  }

  .ad-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    border-radius: 1px;
  }

  .ad-nav-icon {
    width: 16px; height: 16px;
    flex-shrink: 0;
    stroke: currentColor;
  }

  /* Nav section label */
  .ad-nav-section {
    font-size: 0.54rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-faint);
    opacity: 0.6;
    padding: 14px 14px 6px;
  }

  .ad-sb-footer {
    padding: 16px;
    border-top: 1px solid var(--border);
  }

  .ad-logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 2px;
    background: transparent;
    font-family: var(--sans);
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-faint);
    cursor: pointer;
    width: 100%;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .ad-logout-btn:hover {
    border-color: rgba(168,120,120,0.4);
    color: var(--danger);
    background: rgba(168,120,120,0.05);
  }

  /* ── Main ── */
  .ad-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-x: hidden;
  }

  /* ── Top bar ── */
  .ad-topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(14,12,10,0.88);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }

  .ad-topbar::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.1;
    pointer-events: none;
  }

  .ad-menu-btn {
    width: 36px; height: 36px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .ad-menu-btn:hover { border-color: rgba(196,156,104,0.3); background: rgba(196,156,104,0.04); }

  .ad-menu-line {
    width: 14px; height: 1px;
    background: var(--text-muted);
    border-radius: 1px;
    transition: background 0.2s;
  }

  .ad-menu-btn:hover .ad-menu-line { background: var(--gold); }

  .ad-topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* Date range toggle */
  .ad-range-toggle {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .ad-range-btn {
    padding: 7px 16px;
    background: transparent;
    border: none;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
    cursor: pointer;
    border-right: 1px solid var(--border);
    transition: background 0.2s, color 0.2s;
  }

  .ad-range-btn:last-child { border-right: none; }

  .ad-range-btn.active {
    background: rgba(196,156,104,0.1);
    color: var(--gold);
  }

  /* Admin chip */
  .ad-admin-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px 6px 6px;
    border: 1px solid var(--border);
    border-radius: 2px;
    background: var(--bg-input);
  }

  .ad-admin-avatar {
    width: 28px; height: 28px;
    border-radius: 1px;
    background: rgba(196,156,104,0.12);
    border: 1px solid rgba(196,156,104,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--gold);
  }

  .ad-admin-info { line-height: 1.3; }

  .ad-admin-name {
    font-size: 0.72rem;
    font-weight: 400;
    color: var(--text);
    display: block;
    letter-spacing: 0.03em;
  }

  .ad-admin-role {
    font-size: 0.58rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
  }

  /* ── Page body ── */
  .ad-body {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    flex: 1;
  }

  /* ── Welcome banner ── */
  .ad-banner {
    border: 1px solid var(--border);
    background: var(--bg-card);
    padding: 36px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.6s 0.1s var(--ease) both;
  }

  .ad-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.25;
  }

  /* Watermark */
  .ad-banner-wm {
    position: absolute;
    right: -20px; bottom: -30px;
    font-family: var(--serif);
    font-size: 11rem;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px rgba(196,156,104,0.05);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .ad-banner-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ad-banner-label::before {
    content: '';
    display: inline-block;
    width: 22px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .ad-banner-title {
    font-family: var(--serif);
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 300;
    color: var(--text);
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 6px;
  }

  .ad-banner-title em { font-style: italic; color: var(--gold-light); }

  .ad-banner-sub {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  /* Banner stats */
  .ad-banner-stats {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .ad-banner-stat {
    padding: 18px 28px;
    text-align: center;
    border-right: 1px solid var(--border);
    min-width: 110px;
  }

  .ad-banner-stat:last-child { border-right: none; }

  .ad-banner-stat-num {
    font-family: var(--serif);
    font-size: 1.8rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    display: block;
    letter-spacing: -0.02em;
    margin-bottom: 5px;
  }

  .ad-banner-stat-label {
    font-size: 0.58rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    display: block;
  }

  /* ── KPI cards ── */
  .ad-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    border: 1px solid var(--border);
    animation: fadeUp 0.6s 0.18s var(--ease) both;
  }

  .ad-kpi {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    padding: 28px 28px 24px;
    position: relative;
    overflow: hidden;
    transition: background 0.28s var(--ease);
  }

  .ad-kpi:last-child { border-right: none; }
  .ad-kpi:hover { background: #171412; }

  .ad-kpi::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.28s;
  }

  .ad-kpi:hover::before { opacity: 0.35; }

  .ad-kpi-icon {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    margin-bottom: 18px;
    transition: border-color 0.22s;
  }

  .ad-kpi:hover .ad-kpi-icon { border-color: rgba(196,156,104,0.3); }

  .ad-kpi-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 8px;
    display: block;
  }

  .ad-kpi-value {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    letter-spacing: -0.02em;
    display: block;
    margin-bottom: 6px;
  }

  .ad-kpi-trend {
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.04em;
  }

  .ad-kpi-trend.up { color: var(--success); }

  /* ── Charts row ── */
  .ad-charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr 340px;
    gap: 2px;
    border: 1px solid var(--border);
    animation: fadeUp 0.6s 0.24s var(--ease) both;
  }

  .ad-chart-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    padding: 28px;
    position: relative;
    overflow: hidden;
  }

  .ad-chart-card:last-child { border-right: none; }

  .ad-chart-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.15;
  }

  .ad-chart-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .ad-chart-title {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .ad-chart-select {
    padding: 5px 10px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 300;
    color: var(--text-muted);
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
  }

  /* Recharts custom tooltip */
  .ad-tooltip {
    background: var(--bg-card) !important;
    border: 1px solid var(--border) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 12px !important;
    color: var(--text-muted) !important;
    padding: 10px 14px !important;
    box-shadow: none !important;
  }

  /* Pie labels */
  .ad-pie-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .ad-pie-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--text-muted);
  }

  .ad-pie-dot-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ad-pie-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ad-pie-count {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 300;
    color: var(--text);
  }

  /* ── Activity + table row ── */
  .ad-lower-row {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2px;
    border: 1px solid var(--border);
    animation: fadeUp 0.6s 0.3s var(--ease) both;
  }

  /* Activity panel */
  .ad-activity {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .ad-panel-head {
    padding: 22px 24px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ad-panel-title {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .ad-view-all {
    font-size: 0.6rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .ad-view-all:hover { color: var(--gold); }

  .ad-activity-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  .ad-activity-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 22px;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }

  .ad-activity-item:last-child { border-bottom: none; }
  .ad-activity-item:hover { background: rgba(255,255,255,0.02); }

  .ad-act-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--text-faint);
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .ad-activity-item:hover .ad-act-dot { background: var(--gold); }

  .ad-act-body { flex: 1; min-width: 0; }

  .ad-act-name {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.02em;
    margin-bottom: 2px;
  }

  .ad-act-time {
    font-size: 0.65rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.05em;
  }

  .ad-act-amount {
    font-family: var(--serif);
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Orders table panel ── */
  .ad-table-panel {
    background: var(--bg-card);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ad-table-controls {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ad-search {
    flex: 1;
    min-width: 160px;
    padding: 9px 14px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    letter-spacing: 0.03em;
    transition: border-color 0.2s;
  }

  .ad-search::placeholder { color: var(--text-faint); }
  .ad-search:focus { border-color: var(--border-focus, rgba(196,156,104,0.45)); }

  .ad-filter-select {
    padding: 9px 12px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-muted);
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
  }

  .ad-export-btn {
    padding: 9px 20px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
  }

  .ad-export-btn:hover { border-color: rgba(196,156,104,0.35); color: var(--gold); }

  /* Table */
  .ad-table-wrap { overflow-x: auto; flex: 1; }

  .ad-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
  }

  .ad-thead tr {
    border-bottom: 1px solid var(--border);
  }

  .ad-th {
    padding: 12px 18px;
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-faint);
    text-align: left;
    white-space: nowrap;
    background: var(--bg-input);
  }

  .ad-tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }

  .ad-tr:last-child { border-bottom: none; }
  .ad-tr:hover { background: rgba(255,255,255,0.02); }

  .ad-td {
    padding: 14px 18px;
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .ad-order-id {
    font-family: var(--serif);
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--gold);
    letter-spacing: 0.04em;
  }

  .ad-customer-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ad-customer-init {
    width: 28px; height: 28px;
    border-radius: 1px;
    background: rgba(196,156,104,0.08);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--gold);
    flex-shrink: 0;
  }

  .ad-amount {
    font-family: var(--serif);
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .ad-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 1px;
  }

  .ad-status-chip.paid {
    color: var(--success);
    background: rgba(122,171,138,0.1);
    border: 1px solid rgba(122,171,138,0.2);
  }

  .ad-status-chip.pending {
    color: var(--warning);
    background: rgba(196,156,104,0.08);
    border: 1px solid rgba(196,156,104,0.2);
  }

  .ad-status-pip {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* Action buttons */
  .ad-actions { display: flex; gap: 6px; }

  .ad-action-btn {
    width: 30px; height: 30px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-faint);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .ad-action-btn:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.05);
  }

  .ad-action-btn.toggle-paid:hover {
    border-color: rgba(122,171,138,0.4);
    color: var(--success);
    background: rgba(122,171,138,0.05);
  }

  /* Table footer */
  .ad-table-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ad-showing {
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.06em;
  }

  .ad-pagination { display: flex; gap: 4px; }

  .ad-page-btn {
    width: 30px; height: 30px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    font-family: var(--sans);
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-faint);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }

  .ad-page-btn:hover { border-color: rgba(196,156,104,0.3); color: var(--gold); }

  .ad-page-btn.active {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--bg);
  }

  /* ── Loading ── */
  .ad-loading {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    font-family: var(--sans);
  }

  .ad-spinner {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }

  .ad-loading-label {
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Swal overrides ── */
  .swal2-popup.ad-swal {
    background: var(--bg-card) !important;
    border: 1px solid var(--border) !important;
    border-radius: 4px !important;
    font-family: var(--sans) !important;
    color: var(--text) !important;
    padding: 36px !important;
  }
  .swal2-popup.ad-swal .swal2-title {
    font-family: var(--serif) !important;
    font-size: 1.5rem !important;
    font-weight: 300 !important;
    color: var(--text) !important;
  }
  .swal2-popup.ad-swal .swal2-html-container {
    color: var(--text-muted) !important;
    font-size: 0.82rem !important;
    font-weight: 300 !important;
    line-height: 1.75 !important;
    text-align: left !important;
  }
  .swal2-popup.ad-swal .swal2-confirm {
    background: var(--gold) !important;
    color: var(--bg) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.ad-swal .swal2-cancel {
    background: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--border) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.ad-swal .swal2-icon.swal2-warning { border-color: var(--gold) !important; color: var(--gold) !important; }
  .swal2-popup.ad-swal .swal2-icon.swal2-success { border-color: var(--success) !important; color: var(--success) !important; }
  .swal2-popup.ad-swal .swal2-icon.swal2-error   { border-color: var(--danger) !important; color: var(--danger) !important; }
  .swal2-popup.ad-swal .swal2-icon.swal2-question { border-color: var(--gold) !important; color: var(--gold) !important; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .ad-charts-row { grid-template-columns: 1fr 1fr; }
    .ad-chart-card:last-child { grid-column: 1 / -1; }
    .ad-kpi-grid  { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 900px) {
    .ad-body     { padding: 24px; }
    .ad-topbar   { padding: 0 20px; }
    .ad-charts-row { grid-template-columns: 1fr; }
    .ad-lower-row  { grid-template-columns: 1fr; }
    .ad-activity   { border-right: none; border-bottom: 1px solid var(--border); }
    .ad-banner-stats { display: none; }
    .ad-banner     { padding: 28px 24px; }
    .ad-admin-info { display: none; }
  }
  @media (max-width: 600px) {
    .ad-body     { padding: 16px; gap: 20px; }
    .ad-kpi-grid { grid-template-columns: 1fr 1fr; }
    .ad-kpi      { padding: 20px 18px; }
    .ad-range-toggle { display: none; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: "overview" },
      { id: "orders", label: "Orders", icon: "orders" },
      { id: "products", label: "Products", icon: "products" },
      { id: "customers", label: "Customers", icon: "customers" },
      { id: "posts", label: "Blog Posts", icon: "posts" },
      { id: "subscribers", label: "Subscribers", icon: "subscribers" },
    ],
  },
  {
    label: "Reports",
    items: [
      { id: "analytics", label: "Analytics", icon: "analytics" },
      { id: "settings", label: "Settings", icon: "settings" },
    ],
  },
];

const swalDefaults = {
  customClass: { popup: "ad-swal" },
  background: "#141210",
  backdrop: "rgba(14,12,10,0.75)",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const itemsPerPage = 8;

  // Fetch all data
  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      setLoading(true);

      // Fetch subscribers from backend
     
      // Send newsletter email (placeholder - you can implement actual email sending later)
    // Send newsletter email (placeholder - you can implement actual email sending later)

// Fetch subscribers from backend
const fetchSubscribers = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("http://localhost:5000/api/newsletter/subscribers", {
      headers: { Authorization: token }
    });
    const data = await response.json();
    if (data.success) {
      setSubscribers(data.subscribers);
    }
  } catch (error) {
    console.error("Error fetching subscribers:", error);
  }
};
// Fetch subscribers
await fetchSubscribers();
// Export subscribers to CSV
const exportSubscribersToCSV = () => {
  if (subscribers.length === 0) {
    Swal.fire({
      ...swalDefaults,
      icon: "info",
      title: "No Subscribers",
      text: "There are no subscribers to export."
    });
    return;
  }
  
  const csv = [["Email", "Subscribed Date", "Status", "IP Address", "User Agent"]];
  subscribers.forEach(sub => {
    csv.push([
      sub.email,
      new Date(sub.subscribedAt).toLocaleString(),
      sub.status,
      sub.ipAddress || "N/A",
      sub.userAgent?.substring(0, 50) || "N/A"
    ]);
  });
  const sendNewsletter = async () => {
  const result = await Swal.fire({
    ...swalDefaults,
    title: "Send Newsletter",
    html: `
      <input type="text" id="subject" class="swal2-input" placeholder="Email Subject" style="background: var(--bg-input); color: var(--text); border: 1px solid var(--border);">
      <textarea id="message" class="swal2-textarea" placeholder="Email Message" rows="5" style="background: var(--bg-input); color: var(--text); border: 1px solid var(--border);"></textarea>
    `,
    confirmButtonText: "Send",
    showCancelButton: true,
    preConfirm: () => {
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      if (!subject || !message) {
        Swal.showValidationMessage('Please fill in both fields');
        return false;
      }
      return { subject, message };
    }
  });
  
  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          subject: result.value.subject,
          message: result.value.message
        })
      });
      
      if (response.ok) {
        Swal.fire({
          ...swalDefaults,
          icon: "success",
          title: "Newsletter Sent!",
          text: "The newsletter has been sent to all subscribers.",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      Swal.fire({
        ...swalDefaults,
        icon: "info",
        title: "Coming Soon",
        text: "Email sending functionality will be fully implemented in the next update."
      });
    }
  }
};
  const csvContent = "data:text/csv;charset=utf-8," + csv.map(row => row.join(",")).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  Swal.fire({
    ...swalDefaults,
    icon: "success",
    title: "Exported!",
    text: `Exported ${subscribers.length} subscribers to CSV`,
    timer: 1500,
    showConfirmButton: false
  });
};

// Delete/Unsubscribe subscriber
const deleteSubscriber = async (email) => {
  const result = await Swal.fire({
    ...swalDefaults,
    title: "Remove Subscriber?",
    text: `Are you sure you want to remove ${email} from the newsletter?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel"
  });
  
  if (!result.isConfirmed) return;
  
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("http://localhost:5000/api/newsletter/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) throw new Error("Failed to remove subscriber");
    
    // Refresh subscribers list
    const subscribersRes = await fetch("http://localhost:5000/api/newsletter/subscribers", {
      headers: { Authorization: token }
    });
    if (subscribersRes.ok) {
      const data = await subscribersRes.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    }
    
    Swal.fire({ ...swalDefaults, icon: "success", title: "Removed!", timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ ...swalDefaults, icon: "error", title: "Error", text: "Failed to remove subscriber." });
  }
};
      // Fetch posts from backend

      

      const fetchPosts = async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch("http://localhost:5000/api/posts", {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setPosts(data.posts || []);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      // Delete post
      const deletePost = async (postId, postTitle) => {
        const result = await Swal.fire({
          ...swalDefaults,
          title: "Delete Post?",
          text: `Are you sure you want to delete "${postTitle}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(
            `http://localhost:5000/api/posts/${postId}`,
            {
              method: "DELETE",
              headers: { Authorization: token },
            },
          );

          if (!response.ok) throw new Error("Failed to delete");

          await fetchPosts(); // Refresh the list
          Swal.fire({
            ...swalDefaults,
            icon: "success",
            title: "Deleted!",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            ...swalDefaults,
            icon: "error",
            title: "Error",
            text: "Failed to delete post.",
          });
        }
      };

      // View post details
      const viewPostDetails = (post) => {
        Swal.fire({
          ...swalDefaults,
          title: post.title,
          width: "600px",
          html: `
      <div style="text-align: left; max-height: 500px; overflow-y: auto;">
        <img src="${post.image}" style="width: 100%; border-radius: 4px; margin-bottom: 16px;" />
        <p style="color: var(--gold); font-size: 11px; margin-bottom: 8px;">${post.category}</p>
        <p style="margin-bottom: 16px; line-height: 1.6;">${post.excerpt}</p>
        <div style="border-top: 1px solid rgba(255,255,255,0.07); padding-top: 16px;">
          <p><strong>Author:</strong> ${post.author}</p>
          <p><strong>Published:</strong> ${new Date(post.createdAt).toLocaleDateString()}</p>
          <p><strong>Tags:</strong> ${(post.tags || []).join(", ")}</p>
          <p><strong>Views:</strong> ${post.views || 0}</p>
        </div>
      </div>
    `,
          confirmButtonText: "Close",
          showCloseButton: true,
        });
      };

      // Edit post (navigate to edit page)
      const editPost = (post) => {
        navigate(`/admin/edit-post/${post._id}`);
      };

      // Export posts to CSV
      const exportPostsToCSV = () => {
        const csv = [
          ["Title", "Category", "Author", "Date", "Status", "Excerpt"],
        ];
        posts.forEach((post) => {
          csv.push([
            post.title,
            post.category,
            post.author,
            new Date(post.createdAt).toLocaleDateString(),
            post.published !== false ? "Published" : "Draft",
            post.excerpt?.substring(0, 100) || "",
          ]);
        });

        const csvContent =
          "data:text/csv;charset=utf-8," +
          csv.map((row) => row.join(",")).join("\n");
        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = `blog_posts_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
      };

      try {
        // Fetch orders
        const ordersRes = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: token },
        });
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const ordersData = await ordersRes.json();

        // Transform orders to match dashboard expected format
        const transformedOrders = ordersData.map((order) => ({
          _id: order._id,
          name: order.customerName, // Use customerName from your data
          email: order.email,
          phone: order.phone,
          address: order.shipping?.address || "",
          city: order.shipping?.city || "",
          state: order.shipping?.state || "",
          zip: order.shipping?.zip || "",
          total: order.total,
          items: order.items || [],
          paid: order.paid === true || order.status === "paid" || false, // Default to false
          createdAt: order.createdAt,
          shipping: order.shipping,
        }));

        setOrders(transformedOrders);

        // Fetch products
        const productsRes = await fetch("http://localhost:5000/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        // Extract unique customers from orders
        const uniqueCustomers = {};
        transformedOrders.forEach((order) => {
          const customerEmail = order.email;
          if (customerEmail && !uniqueCustomers[customerEmail]) {
            uniqueCustomers[customerEmail] = {
              id: customerEmail,
              name: order.name,
              email: customerEmail,
              phone: order.phone,
              totalSpent: 0,
              orderCount: 0,
              lastOrder: order.createdAt,
            };
          }
          if (customerEmail && uniqueCustomers[customerEmail]) {
            uniqueCustomers[customerEmail].totalSpent += order.total || 0;
            uniqueCustomers[customerEmail].orderCount++;
            if (
              new Date(order.createdAt) >
              new Date(uniqueCustomers[customerEmail].lastOrder)
            ) {
              uniqueCustomers[customerEmail].lastOrder = order.createdAt;
            }
          }
        });
        setCustomers(Object.values(uniqueCustomers));
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          ...swalDefaults,
          icon: "error",
          title: "Error",
          text: "Failed to load dashboard data.",
        });
      } finally {
        setLoading(false);
      }
      // Fetch posts
      const postsRes = await fetch("http://localhost:5000/api/posts");
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }
      // Fetch subscribers
      const subscribersRes = await fetch(
        "http://localhost:5000/api/newsletter/subscribers",
        {
          headers: { Authorization: token },
        },
      );
      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        if (subscribersData.success) {
          setSubscribers(subscribersData.subscribers);
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Responsive sidebar
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) setShowSidebar(false);
      else setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Stats calculations */
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const paidOrders = orders.filter(
    (o) => o.paid === true || o.status === "paid",
  ).length;
  const pendingOrders = orders.filter(
    (o) => !o.paid && o.status !== "paid",
  ).length;

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentOrders = orders.filter((o) => new Date(o.createdAt) > lastWeek);
  const recentRevenue = recentOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0,
  );

  /* Chart data */
  const getChartData = () => {
    const days = dateRange === "week" ? 7 : 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(0, 0, 0, 0);

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });

      data.push({
        name: label,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      });
    }
    return data;
  };

  const chartData = getChartData();
  const statusData = [
    { name: "Paid", value: paidOrders, color: "#7aab8a" },
    { name: "Pending", value: pendingOrders, color: "#c49c68" },
  ];

  // Filter orders
  const filteredOrders = orders.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Handlers
  const handleLogout = () => {
    Swal.fire({
      ...swalDefaults,
      title: "Sign Out?",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
    });
  };

  const viewDetails = (order) => {
    Swal.fire({
      ...swalDefaults,
      title: "Order Details",
      width: "580px",
      html: `
      <div style="font-family:'Jost',sans-serif;font-weight:300;color:#8a8178;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <div>
            <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:5px;">Customer</p>
            <p style="color:#f0ebe3;font-size:13px;">${order.name}</p>
          </div>
          <div>
            <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:5px;">Email</p>
            <p style="color:#8a8178;font-size:13px;">${order.email}</p>
          </div>
          <div>
            <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:5px;">Phone</p>
            <p style="color:#8a8178;font-size:13px;">${order.phone || "N/A"}</p>
          </div>
          <div>
            <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:5px;">Date</p>
            <p style="color:#8a8178;font-size:13px;">${new Date(order.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
        <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:10px;">Delivery Address</p>
          <p style="color:#8a8178;font-size:13px;line-height:1.7;">
            ${order.address || "N/A"}<br>
            ${order.city || ""}${order.city && order.state ? ", " : ""}${order.state || ""} ${order.zip || ""}
          </p>
        </div>
        <div>
          <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;margin-bottom:12px;">Items</p>
          ${(order.items || [])
            .map(
              (item) => `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <p style="color:#f0ebe3;font-size:13px;margin-bottom:3px;">${item.name}</p>
                <p style="color:#4a4540;font-size:11px;letter-spacing:0.06em;">${item.size || "N/A"} &middot; ${item.color || "N/A"} &middot; &times;${item.quantity}</p>
              </div>
              <p style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:300;color:#f0ebe3;">₦${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
          <div style="display:flex;justify-content:space-between;padding-top:16px;margin-top:4px;">
            <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#4a4540;">Total</p>
            <p style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:#f0ebe3;">₦${(order.total || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    `,
      confirmButtonText: "Close",
      showCloseButton: true,
    });
  };

  const updateStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    const result = await Swal.fire({
      ...swalDefaults,
      title: "Update Status",
      text: `Mark this order as ${newStatus.toUpperCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ paid: newStatus === "paid" }),
      });

      if (!res.ok) throw new Error();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, paid: newStatus === "paid" } : o,
        ),
      );

      Swal.fire({
        ...swalDefaults,
        icon: "success",
        title: "Updated",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        ...swalDefaults,
        icon: "error",
        title: "Error",
        text: "Failed to update order.",
      });
    }
  };

  const deleteProduct = async (productId, productName) => {
    const result = await Swal.fire({
      ...swalDefaults,
      title: "Delete Product?",
      text: `Are you sure you want to delete "${productName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        },
      );

      if (!res.ok) throw new Error();

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      Swal.fire({
        ...swalDefaults,
        icon: "success",
        title: "Deleted",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        ...swalDefaults,
        icon: "error",
        title: "Error",
        text: "Failed to delete product.",
      });
    }
  };
  // Fetch subscribers from backend
const fetchSubscribers = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("http://localhost:5000/api/newsletter/subscribers", {
      headers: { Authorization: token }
    });
    const data = await response.json();
    if (data.success) {
      setSubscribers(data.subscribers);
    }
  } catch (error) {
    console.error("Error fetching subscribers:", error);
  }
};

// Export subscribers to CSV
const exportSubscribersToCSV = () => {
  if (subscribers.length === 0) {
    Swal.fire({
      ...swalDefaults,
      icon: "info",
      title: "No Subscribers",
      text: "There are no subscribers to export."
    });
    return;
  }
  
  const csv = [["Email", "Subscribed Date", "Status", "IP Address", "User Agent"]];
  subscribers.forEach(sub => {
    csv.push([
      sub.email,
      new Date(sub.subscribedAt).toLocaleString(),
      sub.status,
      sub.ipAddress || "N/A",
      `"${(sub.userAgent || "N/A").substring(0, 50).replace(/"/g, '""')}"`
    ]);
  });
  
  const csvContent = "data:text/csv;charset=utf-8," + csv.map(row => row.join(",")).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  Swal.fire({
    ...swalDefaults,
    icon: "success",
    title: "Exported!",
    text: `Exported ${subscribers.length} subscribers to CSV`,
    timer: 1500,
    showConfirmButton: false
  });
};

// Delete/Unsubscribe subscriber
const deleteSubscriber = async (email) => {
  const result = await Swal.fire({
    ...swalDefaults,
    title: "Remove Subscriber?",
    text: `Are you sure you want to remove ${email} from the newsletter?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Remove",
    cancelButtonText: "Cancel"
  });
  
  if (!result.isConfirmed) return;
  
  try {
    const token = localStorage.getItem("adminToken");
    const response = await fetch("http://localhost:5000/api/newsletter/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) throw new Error("Failed to remove subscriber");
    
    // Refresh subscribers list
    await fetchSubscribers();
    
    Swal.fire({ ...swalDefaults, icon: "success", title: "Removed!", timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ ...swalDefaults, icon: "error", title: "Error", text: "Failed to remove subscriber." });
  }
};

// Send newsletter
const sendNewsletter = async () => {
  const activeCount = subscribers.filter(s => s.status === "active").length;
  
  if (activeCount === 0) {
    Swal.fire({
      ...swalDefaults,
      icon: "info",
      title: "No Subscribers",
      text: "There are no active subscribers to send the newsletter to."
    });
    return;
  }
  
  const result = await Swal.fire({
    ...swalDefaults,
    title: "Send Newsletter",
    html: `
      <input type="text" id="subject" class="swal2-input" placeholder="Email Subject" style="background: var(--bg-input); color: var(--text); border: 1px solid var(--border); margin-bottom: 15px;">
      <textarea id="message" class="swal2-textarea" placeholder="Email Message" rows="5" style="background: var(--bg-input); color: var(--text); border: 1px solid var(--border);"></textarea>
      <div style="margin-top: 10px; padding: 8px; background: rgba(196,156,104,0.1); border-radius: 4px; font-size: 12px; color: var(--gold);">
        📧 This will be sent to ${activeCount} active subscriber${activeCount !== 1 ? 's' : ''}
      </div>
    `,
    confirmButtonText: "Send Newsletter",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      if (!subject || !message) {
        Swal.showValidationMessage('Please fill in both subject and message');
        return false;
      }
      return { subject, message };
    }
  });
  
  if (result.isConfirmed) {
    Swal.fire({
      ...swalDefaults,
      title: "Sending...",
      text: "Please wait while we send the newsletter",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          subject: result.value.subject,
          message: result.value.message
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({
          ...swalDefaults,
          icon: "success",
          title: "Newsletter Sent!",
          html: `
            <div style="text-align: left;">
              <p>${data.message}</p>
              ${data.results ? `<p style="margin-top: 10px; font-size: 12px; color: var(--success);">
                ✓ Successful: ${data.results.successful}<br>
                ✗ Failed: ${data.results.failed}
              </p>` : ''}
            </div>
          `,
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message || "Failed to send");
      }
    } catch (error) {
      Swal.fire({
        ...swalDefaults,
        icon: "error",
        title: "Error",
        text: error.message || "Failed to send newsletter. Please try again."
      });
    }
  }
};
  // Export posts to CSV
  const exportPostsToCSV = () => {
    const csv = [["Title", "Category", "Author", "Date", "Status", "Excerpt"]];
    posts.forEach((post) => {
      csv.push([
        `"${post.title?.replace(/"/g, '""') || ""}"`,
        `"${post.category || ""}"`,
        `"${post.author || ""}"`,
        new Date(post.createdAt).toLocaleDateString(),
        post.published !== false ? "Published" : "Draft",
        `"${post.excerpt?.substring(0, 100).replace(/"/g, '""') || ""}"`,
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csv.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `blog_posts_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="ad-tooltip">
        <p
          style={{
            marginBottom: 4,
            color: "#4a4540",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: "#f0ebe3" }}>
            {p.name === "revenue"
              ? `₦${Number(p.value).toLocaleString()}`
              : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ad-loading">
        <style>{CSS}</style>
        <div className="ad-spinner" />
        <p className="ad-loading-label">Loading dashboard</p>
      </div>
    );
  }

  return (
    <div className="ad-shell">
      <style>{CSS}</style>
      <div className="ad-grain" />

      {showSidebar && isMobile && (
        <div className="ad-overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`ad-sidebar${isMobile ? " mobile" : ""}${!showSidebar ? " hidden" : ""}`}
      >
        <div className="ad-sb-head">
          <span className="ad-sb-brand">Jofta Solemates</span>
          <span className="ad-sb-badge">
            <span className="ad-sb-badge-dot" />
            Admin Panel
          </span>
        </div>

        <nav className="ad-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="ad-nav-section">{section.label}</p>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`ad-nav-item${activeTab === item.id ? " active" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setShowSidebar(false);
                  }}
                >
                  <svg
                    className="ad-nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {item.icon === "overview" && (
                      <>
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </>
                    )}
                    {item.icon === "orders" && (
                      <>
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </>
                    )}
                    {item.icon === "products" && (
                      <>
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </>
                    )}
                    {item.icon === "customers" && (
                      <>
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </>
                    )}
                    {item.icon === "analytics" && (
                      <>
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </>
                    )}
                    {item.icon === "subscribers" && (
                      <>
                        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                        <polyline points="22 6 12 13 2 6" />
                        <path d="M22 18l-6-5" />
                        <path d="M2 18l6-5" />
                      </>
                    )}
                    {item.icon === "settings" && (
                      <>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                      </>
                    )}
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ad-sb-footer">
          <button className="ad-logout-btn" onClick={handleLogout}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ad-main">
        <header className="ad-topbar">
          <button
            className="ad-menu-btn"
            onClick={() => setShowSidebar((s) => !s)}
          >
            <span className="ad-menu-line" />
            <span className="ad-menu-line" style={{ width: 10 }} />
            <span className="ad-menu-line" />
          </button>

          <div className="ad-topbar-right">
            <div className="ad-range-toggle">
              <button
                className={`ad-range-btn${dateRange === "week" ? " active" : ""}`}
                onClick={() => setDateRange("week")}
              >
                7 Days
              </button>
              <button
                className={`ad-range-btn${dateRange === "month" ? " active" : ""}`}
                onClick={() => setDateRange("month")}
              >
                30 Days
              </button>
            </div>
            <div className="ad-admin-chip">
              <div className="ad-admin-avatar">A</div>
              <div className="ad-admin-info">
                <span className="ad-admin-name">Admin User</span>
                <span className="ad-admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="ad-body">
          {activeTab === "overview" && (
            <>
              {/* Banner */}
              <div className="ad-banner">
                <div className="ad-banner-wm">J</div>
                <div>
                  <div className="ad-banner-label">Dashboard</div>
                  <h1 className="ad-banner-title">
                    Welcome back, <em>Admin</em>
                  </h1>
                  <p className="ad-banner-sub">
                    Here is what is happening with your store today.
                  </p>
                </div>
                <div className="ad-banner-stats">
                  <div className="ad-banner-stat">
                    <span className="ad-banner-stat-num">
                      {recentOrders.length}
                    </span>
                    <span className="ad-banner-stat-label">Orders (7d)</span>
                  </div>
                  <div className="ad-banner-stat">
                    <span className="ad-banner-stat-num">
                      ₦{recentRevenue.toLocaleString()}
                    </span>
                    <span className="ad-banner-stat-label">Revenue (7d)</span>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="ad-kpi-grid">
                <div className="ad-kpi">
                  <div className="ad-kpi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <span className="ad-kpi-label">Total Orders</span>
                  <span className="ad-kpi-value">{totalOrders}</span>
                  <span className="ad-kpi-trend up">+12% this month</span>
                </div>
                <div className="ad-kpi">
                  <div className="ad-kpi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                  <span className="ad-kpi-label">Total Revenue</span>
                  <span className="ad-kpi-value">
                    ₦{totalRevenue.toLocaleString()}
                  </span>
                  <span className="ad-kpi-trend up">+8% this month</span>
                </div>
                <div className="ad-kpi">
                  <div className="ad-kpi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <span className="ad-kpi-label">Avg. Order Value</span>
                  <span className="ad-kpi-value">
                    ₦{Math.round(avgOrderValue).toLocaleString()}
                  </span>
                  <span className="ad-kpi-trend">Per transaction</span>
                </div>
                <div className="ad-kpi">
                  <div className="ad-kpi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="ad-kpi-label">Conversion Rate</span>
                  <span className="ad-kpi-value">
                    {((paidOrders / totalOrders) * 100 || 0).toFixed(1)}%
                  </span>
                  <span className="ad-kpi-trend up">
                    {paidOrders} completed
                  </span>
                </div>
              </div>

              {/* Charts */}
              <div className="ad-charts-row">
                <div className="ad-chart-card">
                  <div className="ad-chart-head">
                    <span className="ad-chart-title">Revenue Overview</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="revGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#c49c68"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#c49c68"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="2 4"
                        stroke="rgba(255,255,255,0.04)"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#4a4540"
                        tick={{ fontSize: 10, fill: "#4a4540" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#4a4540"
                        tick={{ fontSize: 10, fill: "#4a4540" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#c49c68"
                        strokeWidth={1.5}
                        fill="url(#revGrad)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="ad-chart-card">
                  <div className="ad-chart-head">
                    <span className="ad-chart-title">Order Volume</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} barSize={14}>
                      <CartesianGrid
                        strokeDasharray="2 4"
                        stroke="rgba(255,255,255,0.04)"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#4a4540"
                        tick={{ fontSize: 10, fill: "#4a4540" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#4a4540"
                        tick={{ fontSize: 10, fill: "#4a4540" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="orders"
                        fill="#c49c68"
                        fillOpacity={0.7}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="ad-chart-card">
                  <div className="ad-chart-head">
                    <span className="ad-chart-title">Order Status</span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={72}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="ad-pie-legend">
                    {statusData.map((item) => (
                      <div key={item.name} className="ad-pie-item">
                        <div className="ad-pie-dot-label">
                          <span
                            className="ad-pie-dot"
                            style={{ background: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="ad-pie-count">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity & Orders */}
              <div className="ad-lower-row">
                <div className="ad-activity">
                  <div className="ad-panel-head">
                    <span className="ad-panel-title">Recent Activity</span>
                  </div>
                  <div className="ad-activity-list">
                    {orders.slice(0, 8).map((order) => (
                      <div key={order._id} className="ad-activity-item">
                        <span className="ad-act-dot" />
                        <div className="ad-act-body">
                          <p className="ad-act-name">{order.name}</p>
                          <p className="ad-act-time">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="ad-act-amount">
                          ₦{(order.total || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ad-table-panel">
                  <div className="ad-panel-head">
                    <span className="ad-panel-title">Recent Orders</span>
                  </div>
                  <div className="ad-table-controls">
                    <input
                      type="text"
                      className="ad-search"
                      placeholder="Search by name or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      className="ad-export-btn"
                      onClick={() => {
                        const csv = [
                          [
                            "Order ID",
                            "Customer",
                            "Email",
                            "Amount",
                            "Status",
                            "Date",
                          ],
                        ];
                        filteredOrders.forEach((o) => {
                          csv.push([
                            o._id,
                            o.name,
                            o.email,
                            o.total,
                            o.paid ? "Paid" : "Pending",
                            new Date(o.createdAt).toLocaleDateString(),
                          ]);
                        });
                        const csvContent =
                          "data:text/csv;charset=utf-8," +
                          csv.map((row) => row.join(",")).join("\n");
                        const link = document.createElement("a");
                        link.href = encodeURI(csvContent);
                        link.download = "orders.csv";
                        link.click();
                      }}
                    >
                      Export CSV
                    </button>
                  </div>

                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead className="ad-thead">
                        <tr>
                          <th className="ad-th">Order ID</th>
                          <th className="ad-th">Customer</th>
                          <th className="ad-th">Amount</th>
                          <th className="ad-th">Status</th>
                          <th className="ad-th">Date</th>
                          <th className="ad-th">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map((order) => (
                          <tr key={order._id} className="ad-tr">
                            <td className="ad-td">
                              <span className="ad-order-id">
                                #{order._id?.slice(-6).toUpperCase()}
                              </span>
                            </td>
                            <td className="ad-td">
                              <div className="ad-customer-cell">
                                <div className="ad-customer-init">
                                  {order.name?.charAt(0).toUpperCase()}
                                </div>
                                <span>{order.name}</span>
                              </div>
                            </td>
                            <td className="ad-td">
                              <span className="ad-amount">
                                ₦{(order.total || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="ad-td">
                              <span
                                className={`ad-status-chip ${order.paid ? "paid" : "pending"}`}
                              >
                                <span className="ad-status-pip" />
                                {order.paid ? "Paid" : "Pending"}
                              </span>
                            </td>
                            <td className="ad-td">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="ad-td">
                              <div className="ad-actions">
                                <button
                                  className="ad-action-btn"
                                  onClick={() => viewDetails(order)}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M22 12c-2.667 4.667-6 7-10 7S4.667 16.667 2 12c2.667-4.667 6-7 10-7s7.333 2.333 10 7z" />
                                  </svg>
                                </button>
                                <button
                                  className="ad-action-btn toggle-paid"
                                  onClick={() =>
                                    updateStatus(
                                      order._id,
                                      order.paid ? "paid" : "pending",
                                    )
                                  }
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    {order.paid ? (
                                      <>
                                        <polyline points="1 4 1 10 7 10" />
                                        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                                      </>
                                    ) : (
                                      <polyline points="20 6 9 17 4 12" />
                                    )}
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="ad-table-footer">
                    <p className="ad-showing">
                      Showing {paginatedOrders.length} of{" "}
                      {filteredOrders.length} orders
                    </p>
                    <div className="ad-pagination">
                      <button
                        className="ad-page-btn"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={i}
                            className={`ad-page-btn${currentPage === pageNum ? " active" : ""}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        className="ad-page-btn"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "products" && (
            <div className="ad-table-panel">
              <div className="ad-panel-head">
                <span className="ad-panel-title">Product Management</span>
                <button
                  className="ad-view-all"
                  onClick={() => navigate("/admin/add-product")}
                >
                  + Add Product
                </button>
              </div>
              <div className="ad-table-controls">
                <input
                  type="text"
                  className="ad-search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead className="ad-thead">
                    <tr>
                      <th className="ad-th">Image</th>
                      <th className="ad-th">Name</th>
                      <th className="ad-th">Price</th>
                      <th className="ad-th">Stock</th>
                      <th className="ad-th">Category</th>
                      <th className="ad-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((p) =>
                        p.name?.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((product) => (
                        <tr key={product._id} className="ad-tr">
                          <td className="ad-td">
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td className="ad-td">{product.name}</td>
                          <td className="ad-td">
                            ₦{product.price.toLocaleString()}
                          </td>
                          <td className="ad-td">{product.stock}</td>
                          <td className="ad-td">{product.category}</td>
                          <td className="ad-td">
                            <button
                              className="ad-action-btn"
                              onClick={() =>
                                deleteProduct(product._id, product.name)
                              }
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="ad-table-panel">
              <div className="ad-panel-head">
                <span className="ad-panel-title">Customer Management</span>
              </div>
              <div className="ad-table-controls">
                <input
                  type="text"
                  className="ad-search"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead className="ad-thead">
                    <tr>
                      <th className="ad-th">Customer</th>
                      <th className="ad-th">Email</th>
                      <th className="ad-th">Phone</th>
                      <th className="ad-th">Total Spent</th>
                      <th className="ad-th">Orders</th>
                      <th className="ad-th">Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter(
                        (c) =>
                          c.name
                            ?.toLowerCase()
                            .includes(search.toLowerCase()) ||
                          c.email?.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((customer) => (
                        <tr key={customer.id} className="ad-tr">
                          <td className="ad-td">
                            <div className="ad-customer-cell">
                              <div className="ad-customer-init">
                                {customer.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{customer.name}</span>
                            </div>
                          </td>
                          <td className="ad-td">{customer.email}</td>
                          <td className="ad-td">{customer.phone || "N/A"}</td>
                          <td className="ad-td">
                            <span className="ad-amount">
                              ₦{customer.totalSpent.toLocaleString()}
                            </span>
                          </td>
                          <td className="ad-td">{customer.orderCount}</td>
                          <td className="ad-td">
                            {new Date(customer.lastOrder).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "subscribers" && (
            <div className="ad-table-panel">
              <div className="ad-panel-head">
                <span className="ad-panel-title">Newsletter Subscribers</span>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="ad-view-all" onClick={sendNewsletter}>
                    Send Newsletter
                  </button>
                  <button
                    className="ad-view-all"
                    onClick={exportSubscribersToCSV}
                  >
                    Export CSV ({subscribers.length})
                  </button>
                </div>
              </div>

              <div className="ad-table-controls">
                <input
                  type="text"
                  className="ad-search"
                  placeholder="Search subscribers by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="ad-filter-select"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  defaultValue="all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead className="ad-thead">
                    <tr>
                      <th className="ad-th">Email</th>
                      <th className="ad-th">Subscribed Date</th>
                      <th className="ad-th">Status</th>
                      <th className="ad-th">IP Address</th>
                      <th className="ad-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers
                      .filter(
                        (sub) =>
                          (filterStatus === "all" ||
                            sub.status === filterStatus) &&
                          sub.email
                            ?.toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((subscriber) => (
                        <tr key={subscriber._id} className="ad-tr">
                          <td className="ad-td">
                            <div className="ad-customer-cell">
                              <div className="ad-customer-init">
                                {subscriber.email.charAt(0).toUpperCase()}
                              </div>
                              <span>{subscriber.email}</span>
                            </div>
                          </td>
                          <td className="ad-td">
                            {new Date(
                              subscriber.subscribedAt,
                            ).toLocaleDateString()}
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--text-faint)",
                              }}
                            >
                              {new Date(
                                subscriber.subscribedAt,
                              ).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="ad-td">
                            <span
                              className={`ad-status-chip ${subscriber.status === "active" ? "paid" : "pending"}`}
                            >
                              <span className="ad-status-pip" />
                              {subscriber.status === "active"
                                ? "Active"
                                : "Unsubscribed"}
                            </span>
                          </td>
                          <td className="ad-td" style={{ fontSize: "11px" }}>
                            {subscriber.ipAddress || "N/A"}
                          </td>
                          <td className="ad-td">
                            <div className="ad-actions">
                              <button
                                className="ad-action-btn"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    subscriber.email,
                                  );
                                  Swal.fire({
                                    ...swalDefaults,
                                    icon: "success",
                                    title: "Copied!",
                                    text: "Email copied to clipboard",
                                    timer: 1500,
                                    showConfirmButton: false,
                                  });
                                }}
                                title="Copy Email"
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="2.18"
                                    ry="2.18"
                                  />
                                  <line x1="8" y1="2" x2="8" y2="22" />
                                  <line x1="16" y1="2" x2="16" y2="22" />
                                </svg>
                              </button>
                              {subscriber.status === "active" && (
                                <button
                                  className="ad-action-btn toggle-paid"
                                  onClick={() =>
                                    deleteSubscriber(subscriber.email)
                                  }
                                  title="Unsubscribe"
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {subscribers.filter(
                      (sub) =>
                        (filterStatus === "all" ||
                          sub.status === filterStatus) &&
                        sub.email?.toLowerCase().includes(search.toLowerCase()),
                    ).length === 0 && (
                      <tr className="ad-tr">
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "var(--text-faint)",
                          }}
                        >
                          No subscribers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ad-table-footer">
                <p className="ad-showing">
                  Showing{" "}
                  {
                    subscribers.filter(
                      (sub) =>
                        (filterStatus === "all" ||
                          sub.status === filterStatus) &&
                        sub.email?.toLowerCase().includes(search.toLowerCase()),
                    ).length
                  }{" "}
                  of {subscribers.length} subscribers
                </p>
                <div className="ad-stats">
                  <span
                    className="ad-status-chip paid"
                    style={{ marginRight: "8px" }}
                  >
                    Active:{" "}
                    {subscribers.filter((s) => s.status === "active").length}
                  </span>
                  <span className="ad-status-chip pending">
                    Unsubscribed:{" "}
                    {
                      subscribers.filter((s) => s.status === "unsubscribed")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "posts" && (
            <div className="ad-table-panel">
              <div className="ad-panel-head">
                <span className="ad-panel-title">Blog Post Management</span>
                <button
                  className="ad-view-all"
                  onClick={() => navigate("/admin/add-post")}
                >
                  + Write New Post
                </button>
              </div>
              <div className="ad-table-controls">
                <input
                  type="text"
                  className="ad-search"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="ad-export-btn" onClick={exportPostsToCSV}>
                  Export CSV
                </button>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead className="ad-thead">
                    <tr>
                      <th className="ad-th">Image</th>
                      <th className="ad-th">Title</th>
                      <th className="ad-th">Category</th>
                      <th className="ad-th">Author</th>
                      <th className="ad-th">Date</th>
                      <th className="ad-th">Status</th>
                      <th className="ad-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts
                      .filter((p) =>
                        p.title?.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((post) => (
                        <tr key={post._id} className="ad-tr">
                          <td className="ad-td">
                            <img
                              src={post.image}
                              alt={post.title}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/50")
                              }
                            />
                          </td>
                          <td className="ad-td">
                            <div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginBottom: "4px",
                                }}
                              >
                                {post.title}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "var(--text-faint)",
                                }}
                              >
                                {post.excerpt?.substring(0, 60)}...
                              </div>
                            </div>
                          </td>
                          <td className="ad-td">
                            <span
                              className="ad-tag"
                              style={{
                                background: "rgba(196,156,104,0.1)",
                                padding: "4px 8px",
                                borderRadius: "2px",
                                fontSize: "11px",
                              }}
                            >
                              {post.category}
                            </span>
                          </td>
                          <td className="ad-td">{post.author}</td>
                          <td className="ad-td">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="ad-td">
                            <span
                              className={`ad-status-chip ${post.published !== false ? "paid" : "pending"}`}
                            >
                              {post.published !== false ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="ad-td">
                            <div className="ad-actions">
                              <button
                                className="ad-action-btn"
                                onClick={() => viewPostDetails(post)}
                                title="View"
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <circle cx="12" cy="12" r="3" />
                                  <path d="M22 12c-2.667 4.667-6 7-10 7S4.667 16.667 2 12c2.667-4.667 6-7 10-7s7.333 2.333 10 7z" />
                                </svg>
                              </button>
                              <button
                                className="ad-action-btn"
                                onClick={() => editPost(post)}
                                title="Edit"
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                                </svg>
                              </button>
                              <button
                                className="ad-action-btn"
                                onClick={() => deletePost(post._id, post.title)}
                                title="Delete"
                              >
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
