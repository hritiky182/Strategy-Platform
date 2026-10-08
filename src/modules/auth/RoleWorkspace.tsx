import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { RagBadge, StatusBadge } from '../../components/common/Badge';
import { calculateOverallStrategyScore, calculateObjectiveScore } from '../../services/calculationService';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const RoleWorkspace: React.FC = () => {
  const {
    currentUser,
    objectives,
    kpis,
    results,
    initiatives,
    actions,
    users,
    plans,
    settings,
    setSelectedObjective,
    setSelectedKpi,
    setSelectedAction,
    language,
    t,
  } = useApp();

  const navigate = useNavigate();
  const role = currentUser.role;

  // Live calculated scores
  const strategyMetrics = calculateOverallStrategyScore(
    objectives,
    kpis,
    results,
    settings.activePeriod
  );

  // Overdue actions
  const overdueActions = actions.filter((a) => a.status === 'Overdue');
  const pendingResults = results.filter((r) => r.status === 'Submitted');

  return (
    <div>
      {/* Workspace Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f2b46' }}>
            {language === 'ar' ? currentUser.nameAr : currentUser.name} • {t('dashboard')}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Role Context: <strong>{currentUser.role}</strong> • Organization:{' '}
            <strong>Al Ahsa Development Authority (AHDA)</strong> • Period:{' '}
            <strong>{settings.activePeriod}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/strategy/map')}
          >
            <Layers size={14} />
            <span>{t('strategy_map')}</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/executive/dashboard')}
          >
            <TrendingUp size={14} />
            <span>{t('executive_dashboard')}</span>
          </button>
        </div>
      </div>

      {/* 1. System Administrator Workspace */}
      {role === 'System Administrator' && (
        <>
          <div className="stat-grid">
            <StatCard
              title="Active Directory Users"
              value={users.filter((u) => u.status === 'active').length}
              subtitle="All authority directorates"
              indicatorColor="blue"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              title="Configured Roles"
              value="10 Roles"
              subtitle="Permission matrix synchronized"
              indicatorColor="green"
              onClick={() => navigate('/admin/permissions')}
            />
            <StatCard
              title="Organizational Units"
              value="6 Units"
              subtitle="Hierarchical structure active"
              indicatorColor="blue"
              onClick={() => navigate('/admin/organization')}
            />
            <StatCard
              title="Audit Logs Captured"
              value="8 Records"
              subtitle="Immutable event trail"
              indicatorColor="amber"
              onClick={() => navigate('/governance/audit')}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Users size={16} />
                <span>System Administration Shortcuts & Tasks</span>
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                As System Administrator, manage enterprise access, prevent duplicate identity
                profiles, and configure segregation-of-duty boundaries.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users & Roles
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/admin/organization')}
                >
                  Inspect Organizational Tree
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/admin/permissions')}
                >
                  Run Permission Matrix Test
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. KPI Contributor Workspace */}
      {role === 'KPI Contributor' && (
        <>
          <div className="stat-grid">
            <StatCard
              title="Assigned Department KPIs"
              value="4 KPIs"
              subtitle="Service Delivery Department"
              indicatorColor="blue"
              onClick={() => navigate('/performance/results')}
            />
            <StatCard
              title="Pending Collection Tasks"
              value="1 Pending"
              subtitle="Q1 2027 collection cycle"
              indicatorColor="amber"
              onClick={() => navigate('/performance/collection')}
            />
            <StatCard
              title="Approved Q1 Results"
              value="2 Approved"
              subtitle="KPI-P01 & KPI-P02 ratified"
              indicatorColor="green"
              onClick={() => navigate('/performance/results')}
            />
            <StatCard
              title="Department Corrective Actions"
              value="2 Assigned"
              subtitle="1 action overdue (ACT-001)"
              indicatorColor="red"
              onClick={() => navigate('/execution/actions')}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileCheck size={16} />
                <span>Assigned Data Collection Tasks ({settings.activePeriod})</span>
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                Enter verified operational metrics with accompanying evidence attachments. Note
                that self-approval is strictly prevented by the governance system.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/performance/results')}
                >
                  Submit Performance Results
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/performance/collection')}
                >
                  Simulate CSV Batch Import
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3. Performance Reviewer Workspace */}
      {role === 'Performance Reviewer' && (
        <>
          <div className="stat-grid">
            <StatCard
              title="Submissions Awaiting Review"
              value={pendingResults.length > 0 ? `${pendingResults.length} Submissions` : '0 Pending'}
              subtitle="Ready for quality assurance"
              indicatorColor={pendingResults.length > 0 ? 'amber' : 'green'}
              onClick={() => navigate('/performance/results')}
            />
            <StatCard
              title="Verified Results"
              value={`${results.filter((r) => r.status === 'Approved').length} Approved`}
              subtitle="Official scorecard entries"
              indicatorColor="green"
              onClick={() => navigate('/performance/results')}
            />
            <StatCard
              title="Returned for Correction"
              value="1 Returned"
              subtitle="Supplemental evidence requested"
              indicatorColor="amber"
              onClick={() => navigate('/performance/results')}
            />
            <StatCard
              title="Audited Indicator Calculations"
              value="84% Objective Score"
              subtitle="OBJ-P01 verified"
              indicatorColor="red"
              onClick={() => navigate('/performance/analysis')}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CheckCircle2 size={16} />
                <span>Performance Reviewer Queue</span>
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
                Inspect incoming performance actuals, verify calculation formulas, review audit
                evidence attachments, and approve or return submissions.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/performance/results')}
                >
                  Go to Result Approval Queue
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/performance/analysis')}
                >
                  Inspect Score Calculation Engine
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. Strategy Manager & General Workspace */}
      {(role === 'Strategy Manager' ||
        role === 'Strategy Analyst' ||
        role === 'Department Head' ||
        role === 'Initiative Owner' ||
        role === 'Executive Approver' ||
        role === 'Executive Viewer' ||
        role === 'Auditor / Assurance Viewer') && (
        <>
          {/* Quick Statistics (Matching Corporater UX Pattern) */}
          <div className="stat-grid">
            <StatCard
              title="Overall Strategy Execution"
              value={strategyMetrics.overallScore !== null ? `${strategyMetrics.overallScore}%` : '—'}
              subtitle="4 BSC Perspectives • Q1 2027"
              indicatorColor={strategyMetrics.ragStatus.toLowerCase() as any}
              onClick={() => navigate('/performance/analysis')}
            />
            <StatCard
              title="Strategic Objectives"
              value={`${objectives.length} Objectives`}
              subtitle="3 on track • 1 off track (OBJ-P01)"
              indicatorColor="amber"
              onClick={() => navigate('/strategy/bsc')}
            />
            <StatCard
              title="Active Indicators (KPIs)"
              value={`${kpis.length} KPIs`}
              subtitle={`${strategyMetrics.redKpis} Red • ${strategyMetrics.amberKpis} Amber • ${strategyMetrics.greenKpis} Green`}
              indicatorColor="red"
              onClick={() => navigate('/performance/kpis')}
            />
            <StatCard
              title="Overdue Corrective Actions"
              value={`${overdueActions.length} Overdue`}
              subtitle="ACT-001: Redesign Case Triage"
              indicatorColor="red"
              onClick={() => navigate('/execution/actions')}
            />
          </div>

          {/* Exception Spotlight & Strategy Storyline Banner */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#991b1b',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                <AlertTriangle size={16} />
                <span>Executive Attention: Case Cycle Time Exception Detected</span>
              </div>
              <p style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px' }}>
                Objective <strong>OBJ-P01 (Accelerate Service Delivery)</strong> scored{' '}
                <strong>84% (RED)</strong>. KPI-P01 completed-case turnaround is currently 25 days
                against the 20-day target (80% achievement). Action ACT-001 is overdue.
              </p>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                const p01 = objectives.find((o) => o.code === 'OBJ-P01');
                if (p01) setSelectedObjective(p01);
              }}
            >
              Inspect OBJ-P01
            </button>
          </div>

          {/* Two-column Summary Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Left: Related Objectives Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Layers size={16} />
                  <span>Strategic Objectives & Live Achievement</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/strategy/bsc')}
                >
                  View BSC
                </button>
              </div>
              <div style={{ padding: 0 }}>
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Objective Name</th>
                      <th>Weight</th>
                      <th>Calculated Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.map((obj) => {
                      const calc = calculateObjectiveScore(
                        obj,
                        kpis,
                        results,
                        settings.activePeriod
                      );
                      return (
                        <tr
                          key={obj.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedObjective(obj)}
                        >
                          <td style={{ fontWeight: 600, color: '#1e40af' }}>{obj.code}</td>
                          <td>
                            <div style={{ fontWeight: 500 }}>
                              {language === 'ar' ? obj.nameAr : obj.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              Owner: {obj.ownerName}
                            </div>
                          </td>
                          <td>{obj.weight}%</td>
                          <td style={{ fontWeight: 700 }}>
                            {calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}
                          </td>
                          <td>
                            <RagBadge status={calc.ragStatus} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Key Initiatives & Corrective Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Initiatives Card */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Sparkles size={16} />
                    <span>Strategic Initiatives Execution</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/execution/initiatives')}
                  >
                    View All
                  </button>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {initiatives.slice(0, 3).map((ini) => (
                    <div
                      key={ini.id}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f2b46' }}>
                          {ini.code}: {ini.name}
                        </span>
                        <StatusBadge status={ini.status} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                        <span>Progress: {ini.progress}%</span>
                        <span>Budget: {ini.budget.toLocaleString()} SAR</span>
                      </div>
                      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${ini.progress}%`,
                            background: '#2563eb',
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overdue Action Alert */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Clock size={16} color="#dc2626" />
                    <span>Corrective Action Exceptions</span>
                  </div>
                </div>
                <div className="card-body">
                  {overdueActions.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        backgroundColor: '#fff1f2',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedAction(act)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b' }}>
                          {act.code}: {act.title}
                        </span>
                        <StatusBadge status="Overdue" variant="danger" />
                      </div>
                      <p style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '4px' }}>
                        {act.problem}
                      </p>
                      <div style={{ fontSize: '10px', color: '#b91c1c', marginTop: '4px' }}>
                        Owner: {act.ownerName} • Due: {act.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
