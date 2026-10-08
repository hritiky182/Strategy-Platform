import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { RagBadge, StatusBadge } from '../common/Badge';
import { calculateObjectiveScore } from '../../services/calculationService';
import { Layers, Sparkles, AlertTriangle, ShieldAlert, History } from 'lucide-react';

export const ObjectiveDrawer: React.FC = () => {
  const {
    selectedObjective,
    setSelectedObjective,
    setSelectedKpi,
    setSelectedInitiative,
    setSelectedAction,
    perspectives,
    themes,
    kpis,
    results,
    initiatives,
    actions,
    risks,
    settings,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'initiatives' | 'actions' | 'risks'>('overview');

  if (!selectedObjective) return null;

  const obj = selectedObjective;
  const p = perspectives.find((per) => per.id === obj.perspectiveId);
  const thm = themes.find((t) => t.id === obj.themeId);

  // Calculate live objective metrics
  const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);

  // Associated records
  const linkedInitiatives = initiatives.filter((i) => i.objectiveId === obj.id);
  const linkedActions = actions.filter((a) => {
    const kpi = kpis.find((k) => k.id === a.kpiId);
    return kpi && kpi.objectiveId === obj.id;
  });
  const linkedRisks = risks.filter((r) => r.objectiveId === obj.id);

  return (
    <Drawer
      isOpen={!!selectedObjective}
      onClose={() => setSelectedObjective(null)}
      title={`${obj.code}: ${language === 'ar' ? obj.nameAr : obj.name}`}
      subtitle={`Strategic Objective Detail • Balanced Scorecard`}
      width="600px"
    >
      {/* Top Score Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, #0f2b46, #16426f)',
          borderRadius: '8px',
          color: '#ffffff',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Calculated Objective Score ({settings.activePeriod})
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}
            <RagBadge status={calc.ragStatus} />
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
            Data Coverage: {calc.coveragePercentage.toFixed(0)}% ({calc.scoredKpiCount} of {calc.kpiCount} KPIs approved)
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#93c5fd' }}>Plan Weight</div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>{obj.weight}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
          gap: '8px',
        }}
      >
        <button
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #1e40af' : '2px solid transparent',
            color: activeTab === 'overview' ? '#1e40af' : '#64748b',
            fontWeight: activeTab === 'overview' ? 600 : 500,
            borderRadius: 0,
            padding: '6px 12px',
          }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'kpis' ? '2px solid #1e40af' : '2px solid transparent',
            color: activeTab === 'kpis' ? '#1e40af' : '#64748b',
            fontWeight: activeTab === 'kpis' ? 600 : 500,
            borderRadius: 0,
            padding: '6px 12px',
          }}
          onClick={() => setActiveTab('kpis')}
        >
          KPIs ({calc.kpiCount})
        </button>
        <button
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'initiatives' ? '2px solid #1e40af' : '2px solid transparent',
            color: activeTab === 'initiatives' ? '#1e40af' : '#64748b',
            fontWeight: activeTab === 'initiatives' ? 600 : 500,
            borderRadius: 0,
            padding: '6px 12px',
          }}
          onClick={() => setActiveTab('initiatives')}
        >
          Initiatives ({linkedInitiatives.length})
        </button>
        <button
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'actions' ? '2px solid #1e40af' : '2px solid transparent',
            color: activeTab === 'actions' ? '#1e40af' : '#64748b',
            fontWeight: activeTab === 'actions' ? 600 : 500,
            borderRadius: 0,
            padding: '6px 12px',
          }}
          onClick={() => setActiveTab('actions')}
        >
          Actions ({linkedActions.length})
        </button>
        <button
          className="btn btn-sm"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'risks' ? '2px solid #1e40af' : '2px solid transparent',
            color: activeTab === 'risks' ? '#1e40af' : '#64748b',
            fontWeight: activeTab === 'risks' ? 600 : 500,
            borderRadius: 0,
            padding: '6px 12px',
          }}
          onClick={() => setActiveTab('risks')}
        >
          Risks ({linkedRisks.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Strategic Definition
            </div>
            <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: 1.6 }}>
              {language === 'ar' ? obj.descriptionAr : obj.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>BSC Perspective</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '3px' }}>
                {p ? (language === 'ar' ? p.nameAr : p.name) : '—'}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Strategic Theme</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '3px' }}>
                {thm ? (language === 'ar' ? thm.nameAr : thm.name) : '—'}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Primary Owner</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '3px' }}>
                {obj.ownerName}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Contributing Units</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '3px' }}>
                IT & Digital Directorate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: KPIs & Transparent Calculation */}
      {activeTab === 'kpis' && (
        <div>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#1e40af',
              marginBottom: '14px',
            }}
          >
            <strong>Transparent Score Aggregation:</strong>
            <br />
            {calc.kpiBreakdown.map((kb, idx) => (
              <span key={kb.kpiId}>
                {kb.kpiCode} ({kb.achievement ? `${kb.achievement.toFixed(1)}%` : 'Missing'} × {kb.weight}%)
                {idx < calc.kpiBreakdown.length - 1 ? ' + ' : ' = '}
              </span>
            ))}
            <strong>{calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}</strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {calc.kpiBreakdown.map((kb) => {
              const fullKpi = kpis.find((k) => k.id === kb.kpiId);
              return (
                <div
                  key={kb.kpiId}
                  style={{
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                  onClick={() => fullKpi && setSelectedKpi(fullKpi)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                      {kb.kpiCode} • {kb.kpiName}
                    </div>
                    <RagBadge status={kb.ragStatus} />
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                      marginTop: '10px',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b' }}>Target: </span>
                      <strong>{kb.target} {kb.unit}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Actual: </span>
                      <strong>{kb.actual !== null ? `${kb.actual} ${kb.unit}` : '—'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Achievement: </span>
                      <strong>{kb.achievement !== null ? `${kb.achievement.toFixed(1)}%` : '—'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Weight: </span>
                      <strong>{kb.weight}%</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Initiatives */}
      {activeTab === 'initiatives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {linkedInitiatives.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px' }}>No strategic initiatives linked.</p>
          ) : (
            linkedInitiatives.map((ini) => (
              <div
                key={ini.id}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedInitiative(ini)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: '#0f2b46', fontSize: '13px' }}>
                    {ini.code}: {language === 'ar' ? ini.nameAr : ini.name}
                  </span>
                  <StatusBadge status={ini.status} />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Budget: {ini.budget.toLocaleString()} SAR • Spend: {ini.actualCost.toLocaleString()} SAR
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span>Execution Progress</span>
                    <span>{ini.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${ini.progress}%`,
                        background: '#2563eb',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Actions */}
      {activeTab === 'actions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {linkedActions.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px' }}>No corrective actions recorded.</p>
          ) : (
            linkedActions.map((act) => (
              <div
                key={act.id}
                style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#ffffff',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAction(act)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: '#b91c1c', fontSize: '13px' }}>
                    {act.code}: {act.title}
                  </span>
                  <StatusBadge status={act.status} />
                </div>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  {act.problem}
                </p>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Owner: {act.ownerName} • Due: {act.dueDate}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Risks */}
      {activeTab === 'risks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {linkedRisks.map((r) => (
            <div
              key={r.id}
              style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#0f2b46', fontSize: '13px' }}>
                  {r.code}: {r.title}
                </span>
                <StatusBadge status={r.status} />
              </div>
              <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                Mitigation: {r.mitigation}
              </p>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Probability: {r.probability} • Impact: {r.impact} • Owner: {r.owner}
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};
