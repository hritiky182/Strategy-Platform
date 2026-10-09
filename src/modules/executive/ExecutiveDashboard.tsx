import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { RagBadge, StatusBadge } from '../../components/common/Badge';
import { calculateOverallStrategyScore, calculateObjectiveScore, calculatePerspectiveScore } from '../../services/calculationService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Layers,
  Sparkles,
  AlertTriangle,
  FileText,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    objectives,
    kpis,
    results,
    initiatives,
    actions,
    perspectives,
    settings,
    plans,
    entityConfig,
    setSelectedObjective,
    setSelectedKpi,
    setSelectedInitiative,
    setSelectedAction,
    language,
    t,
  } = useApp();

  const navigate = useNavigate();
  const activePlan = plans.find((p) => p.id === settings.activePlanId) || plans[0];

  // Dynamic Overall Metrics
  const strategyMetrics = calculateOverallStrategyScore(
    objectives,
    kpis,
    results,
    settings.activePeriod
  );

  const openActionsCount = actions.filter((a) => a.status !== 'Closed').length;

  // Chart data: Distribution of RAG
  const ragDistributionData = [
    { name: 'On Track (Green)', value: strategyMetrics.greenKpis, color: '#16a34a' },
    { name: 'At Risk (Amber)', value: strategyMetrics.amberKpis, color: '#d97706' },
    { name: 'Off Track (Red)', value: strategyMetrics.redKpis, color: '#dc2626' },
    { name: 'Missing / Unrated', value: strategyMetrics.grayKpis, color: '#64748b' },
  ].filter((d) => d.value > 0);

  // Chart data: Objectives Performance
  const objectivesPerformanceData = objectives.map((obj) => {
    const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);
    return {
      name: obj.code,
      Score: calc.score !== null ? Math.round(calc.score * 10) / 10 : 0,
      Target: 100,
    };
  });

  // Chart data: Initiative Delivery Progress
  const initiativesData = initiatives.map((ini) => ({
    name: ini.code,
    Progress: ini.progress,
    Budget: Math.round(ini.budget / 100000), // in 100k SAR
  }));

  return (
    <div>
      {/* Executive Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2b46' }}>
            {language === 'ar' ? (entityConfig?.nameAr || 'لوحة القيادة التنفيذية') : (entityConfig?.name || 'Executive Cockpit')} • {t('executive_dashboard')}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {language === 'ar' ? (activePlan?.nameAr || activePlan?.name) : activePlan?.name} ({activePlan?.code}) • Reporting Period:{' '}
            <strong>{settings.activePeriod}</strong>
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/reports')}
        >
          <FileText size={15} />
          <span>Generate Executive Briefing Report</span>
        </button>
      </div>

      {/* Top 7 Executive KPI Summary Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', marginBottom: '20px' }}>
        <StatCard
          title="Overall Strategy"
          value={strategyMetrics.overallScore !== null ? `${strategyMetrics.overallScore}%` : '—'}
          subtitle="Weighted Strategy Achievement"
          indicatorColor={strategyMetrics.ragStatus.toLowerCase() as any}
          onClick={() => navigate('/performance/analysis')}
        />
        <StatCard
          title="Objectives"
          value={strategyMetrics.totalObjectives}
          subtitle="Balanced Across 4 Perspectives"
          indicatorColor="blue"
          onClick={() => navigate('/strategy/bsc')}
        />
        <StatCard
          title="Total KPIs"
          value={strategyMetrics.totalKpis}
          subtitle="Standardized Metrics"
          indicatorColor="blue"
          onClick={() => navigate('/performance/kpis')}
        />
        <StatCard
          title="Red KPIs"
          value={strategyMetrics.redKpis}
          subtitle="Off Track (< 90%)"
          indicatorColor="red"
          onClick={() => navigate('/performance/results')}
        />
        <StatCard
          title="Amber KPIs"
          value={strategyMetrics.amberKpis}
          subtitle="At Risk (90–99%)"
          indicatorColor="amber"
          onClick={() => navigate('/performance/results')}
        />
        <StatCard
          title="Green KPIs"
          value={strategyMetrics.greenKpis}
          subtitle="On Track (≥ 100%)"
          indicatorColor="green"
          onClick={() => navigate('/performance/results')}
        />
        <StatCard
          title="Open Actions"
          value={openActionsCount}
          subtitle="1 Action Overdue (ACT-001)"
          indicatorColor="red"
          onClick={() => navigate('/execution/actions')}
        />
      </div>

      {/* 4 Balanced Scorecard Perspective Summary Cards (Matching Corporater Layout) */}
      <div className="exec-perspectives-grid">
        {perspectives.map((p) => {
          const pScore = calculatePerspectiveScore(p.id, objectives, kpis, results, settings.activePeriod);
          const pObjectives = objectives.filter((o) => o.perspectiveId === p.id);

          return (
            <div
              key={p.id}
              className="card"
              style={{
                borderTop: `4px solid ${p.color}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => navigate('/strategy/bsc')}
            >
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                    {language === 'ar' ? p.nameAr : p.name}
                  </span>
                  <RagBadge status={pScore.ragStatus} />
                </div>

                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f2b46', marginTop: '6px' }}>
                  {pScore.score !== null ? `${pScore.score.toFixed(1)}%` : '—'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span>{pObjectives.length} Objectives</span>
                  <span>100% Coverage</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Dashboard (Recharts) */}
      <div className="exec-charts-grid">
        {/* Objectives Achievement Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={16} />
              <span>Strategic Objectives Score Breakdown</span>
            </div>
          </div>
          <div className="card-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={objectivesPerformanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis domain={[0, 100]} fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Score" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Status Distribution Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={16} />
              <span>KPI Performance Status Distribution (RAG)</span>
            </div>
          </div>
          <div className="card-body" style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ragDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ragDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drill-down Exception Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ color: '#991b1b' }}>
            <AlertTriangle size={16} />
            <span>Active Performance Exceptions & Off-Track Objectives (Drill-Down)</span>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Code</th>
                <th>Strategic Objective</th>
                <th>Perspective</th>
                <th>Primary Owner</th>
                <th>Weight</th>
                <th>Calculated Score</th>
                <th>Status</th>
                <th>Linked Corrective Action</th>
                <th style={{ textAlign: 'center' }}>Interactive Drill-Down</th>
              </tr>
            </thead>
            <tbody>
              {objectives.map((obj) => {
                const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);
                const isRed = calc.ragStatus === 'RED';
                const p = perspectives.find((x) => x.id === obj.perspectiveId);
                const act = actions.find((a) => {
                  const k = kpis.find((kp) => kp.id === a.kpiId);
                  return k && k.objectiveId === obj.id;
                });

                return (
                  <tr
                    key={obj.id}
                    style={{
                      backgroundColor: isRed ? '#fff1f2' : undefined,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedObjective(obj)}
                  >
                    <td style={{ fontWeight: 700, color: isRed ? '#b91c1c' : '#1e40af' }}>
                      {obj.code}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' ? obj.nameAr : obj.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {obj.description.slice(0, 60)}...
                      </div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{p ? p.name : '—'}</td>
                    <td style={{ fontSize: '12px' }}>{obj.ownerName}</td>
                    <td style={{ fontWeight: 600 }}>{obj.weight}%</td>
                    <td style={{ fontWeight: 800, fontSize: '14px', color: isRed ? '#dc2626' : '#0f2b46' }}>
                      {calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}
                    </td>
                    <td>
                      <RagBadge status={calc.ragStatus} />
                    </td>
                    <td>
                      {act ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#b91c1c',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAction(act);
                          }}
                        >
                          {act.code} ({act.status})
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>None Required</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedObjective(obj);
                        }}
                      >
                        Drill Down
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
