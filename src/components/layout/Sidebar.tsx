import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Search,
  Scale,
  Compass,
  Layers,
  GitBranch,
  BookMarked,
  UploadCloud,
  CheckSquare,
  BarChart2,
  Workflow,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ClipboardCheck,
  History,
  FileEdit,
  FileSpreadsheet,
  PieChart,
  FileText,
  Users,
  Network,
  Lock,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const role = currentUser.role;

  // Role visibility checks
  const isAdmin = role === 'System Administrator';
  const isManager = role === 'Strategy Manager' || role === 'Strategy Analyst';
  const isExecutive = role === 'Executive Approver' || role === 'Executive Viewer';
  const isAuditor = role === 'Auditor / Assurance Viewer';
  const isContributor = role === 'KPI Contributor';
  const isReviewer = role === 'Performance Reviewer';
  const isDeptHead = role === 'Department Head';
  const isInitiativeOwner = role === 'Initiative Owner';

  // Administration section is visible to Admin, and viewable by Auditor & Manager
  const showAdmin = isAdmin || isManager || isAuditor;

  return (
    <aside className="app-sidebar" aria-label="Sidebar Navigation">
      {/* 1. HOME / WORKSPACE */}
      <div className="nav-section-title">{t('nav_home')}</div>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={16} />
        <span>{t('dashboard')}</span>
      </NavLink>

      {/* 2. STRATEGY ARCHITECTURE */}
      <div className="nav-section-title">{t('nav_strategy')}</div>
      <NavLink
        to="/strategy/planning-cycles"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Calendar size={16} />
        <span>{t('planning_cycles')}</span>
      </NavLink>
      <NavLink
        to="/strategy/diagnosis"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Search size={16} />
        <span>{t('diagnosis')}</span>
      </NavLink>
      <NavLink
        to="/strategy/options"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Scale size={16} />
        <span>{t('strategic_options')}</span>
      </NavLink>
      <NavLink
        to="/strategy/definition"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Compass size={16} />
        <span>{t('strategy_definition')}</span>
      </NavLink>
      <NavLink
        to="/strategy/bsc"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Layers size={16} />
        <span>{t('balanced_scorecard')}</span>
      </NavLink>
      <NavLink
        to="/strategy/map"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <GitBranch size={16} />
        <span>{t('strategy_map')}</span>
      </NavLink>

      {/* 3. PERFORMANCE MANAGEMENT */}
      <div className="nav-section-title">{t('nav_performance')}</div>
      <NavLink
        to="/performance/kpis"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <BookMarked size={16} />
        <span>{t('kpi_dictionary')}</span>
      </NavLink>
      <NavLink
        to="/performance/collection"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <UploadCloud size={16} />
        <span>{t('performance_collection')}</span>
      </NavLink>
      <NavLink
        to="/performance/results"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <CheckSquare size={16} />
        <span>{t('scorecard_results')}</span>
      </NavLink>
      <NavLink
        to="/performance/analysis"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <BarChart2 size={16} />
        <span>{t('performance_analysis')}</span>
      </NavLink>

      {/* 4. ALIGNMENT & CASCADE */}
      <div className="nav-section-title">{t('nav_alignment')}</div>
      <NavLink
        to="/alignment/departments"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Workflow size={16} />
        <span>{t('department_scorecards')}</span>
      </NavLink>

      {/* 5. EXECUTION & ACTIONS */}
      <div className="nav-section-title">{t('nav_execution')}</div>
      <NavLink
        to="/execution/initiatives"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <Sparkles size={16} />
        <span>{t('initiatives')}</span>
      </NavLink>
      <NavLink
        to="/execution/actions"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <AlertTriangle size={16} />
        <span>{t('corrective_actions')}</span>
      </NavLink>
      <NavLink
        to="/execution/risks"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <ShieldAlert size={16} />
        <span>{t('strategic_risks')}</span>
      </NavLink>

      {/* 6. GOVERNANCE & APPROVALS */}
      <div className="nav-section-title">{t('nav_governance')}</div>
      <NavLink
        to="/governance/approvals"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <ClipboardCheck size={16} />
        <span>{t('approvals')}</span>
      </NavLink>
      <NavLink
        to="/governance/reviews"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <History size={16} />
        <span>{t('strategy_reviews')}</span>
      </NavLink>
      <NavLink
        to="/governance/amendments"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <FileEdit size={16} />
        <span>{t('amendments')}</span>
      </NavLink>
      <NavLink
        to="/governance/audit"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <FileSpreadsheet size={16} />
        <span>{t('audit_history')}</span>
      </NavLink>

      {/* 7. EXECUTIVE REPORTING */}
      <div className="nav-section-title">{t('nav_reporting')}</div>
      <NavLink
        to="/executive/dashboard"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <PieChart size={16} />
        <span>{t('executive_dashboard')}</span>
      </NavLink>
      <NavLink
        to="/reports"
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <FileText size={16} />
        <span>{t('reports')}</span>
      </NavLink>

      {/* 8. ADMINISTRATION */}
      {showAdmin && (
        <>
          <div className="nav-section-title">{t('nav_admin')}</div>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>{t('users')}</span>
          </NavLink>
          <NavLink
            to="/admin/organization"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Network size={16} />
            <span>{t('organization_tree')}</span>
          </NavLink>
          <NavLink
            to="/admin/permissions"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Lock size={16} />
            <span>{t('roles_permissions')}</span>
          </NavLink>
        </>
      )}

      {/* Session / Authentication Footer */}
      <div
        style={{
          marginTop: 'auto',
          padding: '12px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>IAM Session Active</span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Scene 01</span>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
        >
          <LogOut size={13} style={{ color: '#f87171' }} />
          <span>Switch Persona / Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
