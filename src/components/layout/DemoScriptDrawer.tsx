import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { RoleName } from '../../types';
import { PlayCircle, ArrowRight, Check } from 'lucide-react';

interface DemoScene {
  id: number;
  title: string;
  role: RoleName;
  route: string;
  summary: string;
  keyAction: string;
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    title: 'Scene 01: Sign In & Role Workspace',
    role: 'Strategy Manager',
    route: '/dashboard',
    summary: 'Executive landing workspace showing pending approvals, overdue items, and strategy status overview.',
    keyAction: 'Inspect role-based operational tasks and KPI exceptions.',
  },
  {
    id: 2,
    title: 'Scene 02: User Management',
    role: 'System Administrator',
    route: '/admin/users',
    summary: 'User administration directory with roles, organizational units, and status toggles.',
    keyAction: 'Demonstrate deactivating or editing a contributor account without losing audit history.',
  },
  {
    id: 3,
    title: 'Scene 03: Organization Hierarchy',
    role: 'System Administrator',
    route: '/admin/organization',
    summary: 'Hierarchical tree of AHDA units: Authority -> Strategy, Service Delivery -> Operations, IT.',
    keyAction: 'View department leadership, codes, and operational linkages.',
  },
  {
    id: 4,
    title: 'Scene 04: Roles & Permissions Matrix',
    role: 'System Administrator',
    route: '/admin/permissions',
    summary: 'Granular permission matrix with active interactive Permission Test bench.',
    keyAction: 'Test allowed vs denied actions, blocked self-approval, and departmental scope boundaries.',
  },
  {
    id: 5,
    title: 'Scene 05: Planning Cycle Management',
    role: 'Strategy Manager',
    route: '/strategy/planning-cycles',
    summary: 'Strategic planning lifecycle: STR-2027-2030 (Horizon, reporting frequency, deadlines, status).',
    keyAction: 'Review plan status transitions (Draft -> In Review -> Approved -> Published).',
  },
  {
    id: 6,
    title: 'Scene 06: Strategic Diagnosis (SWOT/PESTEL)',
    role: 'Strategy Manager',
    route: '/strategy/diagnosis',
    summary: 'Evidence-based diagnostic assessment identifying slow service delivery and manual routing.',
    keyAction: 'Inspect Weakness: Slow service delivery and link to Service Transformation issue.',
  },
  {
    id: 7,
    title: 'Scene 07: Strategic Options Comparison',
    role: 'Strategy Manager',
    route: '/strategy/options',
    summary: 'Weighted multi-criteria decision matrix comparing 3 strategic alternatives.',
    keyAction: 'Review why "Service Transformation" scored 8.5/10 and was selected over Staff Expansion.',
  },
  {
    id: 8,
    title: 'Scene 08: Strategy Definition',
    role: 'Strategy Manager',
    route: '/strategy/definition',
    summary: 'AHDA Mandate, Vision 2030, Mission statement, Core Values, and Strategic Themes.',
    keyAction: 'Explore link between Service Transformation theme and strategic objectives.',
  },
  {
    id: 9,
    title: 'Scene 09: Balanced Scorecard (BSC)',
    role: 'Strategy Manager',
    route: '/strategy/bsc',
    summary: '4 BSC Perspectives: Stakeholders & Public Value, Internal Processes, Learning & Growth, Financial Stewardship.',
    keyAction: 'Verify objectives have assigned owners, weights, and active KPIs.',
  },
  {
    id: 10,
    title: 'Scene 10: Interactive Strategy Map',
    role: 'Strategy Manager',
    route: '/strategy/map',
    summary: 'Visual directional cause-and-effect map connecting capability -> digital process -> turnaround -> citizen value.',
    keyAction: 'Click objective node (OBJ-P01) to slide out detail drawer and live calculated score.',
  },
  {
    id: 11,
    title: 'Scene 11: KPI Dictionary',
    role: 'Strategy Manager',
    route: '/performance/kpis',
    summary: 'Standardized indicator registry with formula, direction, baseline, target, and evidence requirement.',
    keyAction: 'Inspect KPI-P01 (Cycle time: lower is better) and KPI-P02 (Digital completion).',
  },
  {
    id: 12,
    title: 'Scene 12: Department Cascade',
    role: 'Department Head',
    route: '/alignment/departments',
    summary: 'Corporate-to-department cascading linking OBJ-P01 to Service Delivery Department.',
    keyAction: 'Show direct contribution vs supporting contribution linkages.',
  },
  {
    id: 13,
    title: 'Scene 13: Strategic Initiatives',
    role: 'Initiative Owner',
    route: '/execution/initiatives',
    summary: 'Execution vehicle: INI-001 (Digital Case Handling) with budget, milestones, and progress.',
    keyAction: 'Toggle milestone completion and demonstrate independent initiative progress tracking.',
  },
  {
    id: 14,
    title: 'Scene 14: Approval & Strategy Publication',
    role: 'Executive Approver',
    route: '/governance/approvals',
    summary: 'Governance sign-off gateway: Draft -> In Review -> Returned/Approved -> Published v1.0.',
    keyAction: 'Demonstrate return with reason, resubmission, and formal executive publication.',
  },
  {
    id: 15,
    title: 'Scene 15: Performance Data Collection',
    role: 'KPI Contributor',
    route: '/performance/collection',
    summary: 'Quarterly data collection tasks, deadline tracking, manual entry, and simulated CSV bulk import.',
    keyAction: 'Test simulated CSV file validator with error and duplicate detection.',
  },
  {
    id: 16,
    title: 'Scene 16: Result Submission & Assurance Review',
    role: 'Performance Reviewer',
    route: '/performance/results',
    summary: 'Submission workflow: KPI-P01 submitted with 25 days, returned for evidence, resubmitted, and approved.',
    keyAction: 'Demonstrate self-approval blockage and approving official results.',
  },
  {
    id: 17,
    title: 'Scene 17: Performance Analysis & Score Engine',
    role: 'Strategy Analyst',
    route: '/performance/analysis',
    summary: 'Mathematical breakdown: KPI-P01 (80% * 60%) + KPI-P02 (90% * 40%) = 84% RED score for OBJ-P01.',
    keyAction: 'Interactive Recharts visualizations and live scenario sensitivity analysis.',
  },
  {
    id: 18,
    title: 'Scene 18: Corrective Actions',
    role: 'Department Head',
    route: '/execution/actions',
    summary: 'Targeted corrective response ACT-001 (Redesign Case Triage Process) flagged as Overdue.',
    keyAction: 'Inspect root-cause link to KPI-P01 and show why actions do not artificially fake scores.',
  },
  {
    id: 19,
    title: 'Scene 19: Executive Dashboard & Report Builder',
    role: 'Executive Viewer',
    route: '/executive/dashboard',
    summary: 'High-level C-Suite dashboard with RAG distribution, BSC summary cards, and drill-downs.',
    keyAction: 'Click red objective card to drill down, then navigate to Report Builder for PDF generation.',
  },
  {
    id: 20,
    title: 'Scene 20: Strategy Review & Amendments',
    role: 'Strategy Manager',
    route: '/governance/reviews',
    summary: 'Q1 Review meeting, decision tracking, frozen report REP-Q1-2027 v1, and target amendment.',
    keyAction: 'View approved amendment modifying target from 20 to 18 days while preserving v1 history.',
  },
];

export const DemoScriptDrawer: React.FC = () => {
  const { isDemoGuideOpen, setIsDemoGuideOpen, setRole, isAuthenticated, login, users } = useApp();
  const navigate = useNavigate();

  if (!isDemoGuideOpen) return null;

  const handleLaunchScene = (scene: DemoScene) => {
    if (!isAuthenticated) {
      const match = users.find((u) => u.role === scene.role);
      login(match || scene.role, 'persona');
    } else {
      setRole(scene.role);
    }
    navigate(scene.route);
    setIsDemoGuideOpen(false);
  };

  return (
    <Drawer
      isOpen={isDemoGuideOpen}
      onClose={() => setIsDemoGuideOpen(false)}
      title="AHDA Client Demonstration Script (20 Scenes)"
      subtitle="Click any scene to immediately navigate to its screen and auto-switch to the ideal role"
      width="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#1e40af',
            lineHeight: 1.5,
          }}
        >
          <strong>Complete Strategic Lifecycle:</strong> Follow the 20 scenes below to demonstrate the
          end-to-end journey from initial diagnosis, BSC creation, data collection, transparent
          calculation (84%), through to executive dashboard and historical version preservation.
        </div>

        {DEMO_SCENES.map((scene) => (
          <div
            key={scene.id}
            style={{
              padding: '14px 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46' }}>
                  {scene.title}
                </span>
                <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                  Role: {scene.role} • Route: {scene.route}
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleLaunchScene(scene)}
                title="Launch this demonstration scene"
              >
                <PlayCircle size={13} />
                <span>Jump to Scene</span>
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
              {scene.summary}
            </p>

            <div
              style={{
                fontSize: '11px',
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={13} />
              <span><strong>Demonstration Action: </strong>{scene.keyAction}</span>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};
