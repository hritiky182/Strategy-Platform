import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { RagBadge, StatusBadge } from '../common/Badge';
import { calculateKpiMetrics } from '../../services/calculationService';
import { FileCheck, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const KpiDrawer: React.FC = () => {
  const { selectedKpi, setSelectedKpi, results, settings, language, users } = useApp();

  if (!selectedKpi) return null;

  const kpi = selectedKpi;
  const currentResult = results.find(
    (r) => r.kpiId === kpi.id && r.period === settings.activePeriod
  );

  const metrics = calculateKpiMetrics(kpi, currentResult);
  const owner = users.find((u) => u.id === kpi.ownerId);
  const updater = users.find((u) => u.id === kpi.updaterId);
  const reviewer = users.find((u) => u.id === kpi.reviewerId);

  return (
    <Drawer
      isOpen={!!selectedKpi}
      onClose={() => setSelectedKpi(null)}
      title={`${kpi.code}: ${language === 'ar' ? kpi.nameAr : kpi.name}`}
      subtitle="KPI Dictionary Specification & Performance Metrics"
      width="580px"
    >
      {/* Top Metric Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2b46, #16426f)',
          padding: '16px 20px',
          borderRadius: '8px',
          color: '#ffffff',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase' }}>
              Official Achievement ({settings.activePeriod})
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {metrics.rawAchievement !== null ? `${metrics.rawAchievement.toFixed(1)}%` : '—'}
              <RagBadge status={metrics.ragStatus} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#93c5fd' }}>Result State</span>
            <div style={{ marginTop: '4px' }}>
              <StatusBadge status={currentResult ? currentResult.status : 'Missing'} />
            </div>
          </div>
        </div>

        {/* 3 Separate Metrics: Target Achievement vs Baseline Improvement vs Progress Toward Target */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Target Achievement</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>
              {metrics.rawAchievement !== null ? `${metrics.rawAchievement.toFixed(1)}%` : '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Baseline Improvement</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px', color: '#86efac' }}>
              {metrics.baselineImprovement !== null ? `${metrics.baselineImprovement.toFixed(2)}%` : '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Progress Toward Target</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px', color: '#67e8f9' }}>
              {metrics.progressTowardTarget !== null ? `${metrics.progressTowardTarget.toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Target vs Actual Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Historical Baseline</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
            {kpi.baseline} {kpi.unit}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>As of {kpi.baselineDate}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Approved Target</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e40af', marginTop: '2px' }}>
            {kpi.target} {kpi.unit}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Direction: {kpi.direction === 'lower' ? 'Lower is better' : 'Higher is better'}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Submitted Actual</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            {currentResult && currentResult.actual !== null ? `${currentResult.actual} ${kpi.unit}` : 'Missing'}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Variance: {metrics.variance !== null ? `${metrics.variance > 0 ? '+' : ''}${metrics.variance} ${kpi.unit}` : '—'}</div>
        </div>
      </div>

      {/* Detailed KPI Properties */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Formal Business Definition
          </div>
          <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: 1.6 }}>
            {language === 'ar' ? kpi.definitionAr : kpi.definition}
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Calculation Formula
          </div>
          <code style={{ display: 'block', padding: '8px 10px', background: '#0f172a', color: '#38bdf8', borderRadius: '4px', fontSize: '12px', marginTop: '6px' }}>
            {kpi.formula}
          </code>
        </div>

        {/* Roles & Governance */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ padding: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Accountable Owner</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f2b46', marginTop: '2px' }}>
              {owner ? owner.name : 'Unassigned'}
            </div>
          </div>
          <div style={{ padding: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Data Collector</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f2b46', marginTop: '2px' }}>
              {updater ? updater.name : 'Unassigned'}
            </div>
          </div>
          <div style={{ padding: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Assurance Reviewer</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f2b46', marginTop: '2px' }}>
              {reviewer ? reviewer.name : 'Unassigned'}
            </div>
          </div>
        </div>

        {/* Evidence & Submission Record */}
        {currentResult && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck size={15} color="#16a34a" />
              <span>Evidence Attachment & Audit Record</span>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
              <strong>Title: </strong> {currentResult.evidenceTitle || 'No evidence attached'}
            </div>
            {currentResult.evidenceSummary && (
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {currentResult.evidenceSummary}
              </p>
            )}
            {currentResult.varianceAnalysis && (
              <div style={{ marginTop: '8px', padding: '8px', background: '#fef3c7', borderRadius: '4px', fontSize: '11px', color: '#92400e' }}>
                <strong>Variance Explanation: </strong> {currentResult.varianceAnalysis}
              </div>
            )}
          </div>
        )}

        {/* Historical Versions */}
        {currentResult && currentResult.history.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Audit & Revision History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentResult.history.map((h, i) => (
                <div key={i} style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Version {h.version} ({h.status})</span>
                    <span>{new Date(h.changedAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: '#1e293b', marginTop: '2px' }}>{h.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
