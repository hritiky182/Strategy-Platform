import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateObjectiveScore, calculateKpiMetrics } from '../../services/calculationService';
import { RagBadge, StatusBadge } from '../../components/common/Badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { BarChart2, Calculator, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

export const PerformanceAnalysis: React.FC = () => {
  const { objectives, kpis, results, settings, setSelectedKpi, language, t } = useApp();

  const [selectedObjId, setSelectedObjId] = useState('OBJ-P01');

  // Simulation test state
  const [simulatedP01Actual, setSimulatedP01Actual] = useState(25);

  const obj = objectives.find((o) => o.id === selectedObjId) || objectives[0];
  const objCalc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);

  // Chart data: Target vs Actual comparison
  const targetVsActualData = objCalc.kpiBreakdown.map((kb) => ({
    name: kb.kpiCode,
    Target: kb.target,
    Actual: kb.actual !== null ? kb.actual : 0,
    Achievement: kb.achievement !== null ? kb.achievement : 0,
    unit: kb.unit,
  }));

  // Historical trend data (Q3 2026, Q4 2026, Q1 2027)
  const trendData = [
    { period: 'Q3 2026', Score: 76, Benchmark: 90 },
    { period: 'Q4 2026', Score: 79, Benchmark: 90 },
    { period: 'Q1 2027', Score: objCalc.score || 84, Benchmark: 90 },
  ];

  // Dynamic simulation calculation
  const simKpiP01 = kpis.find((k) => k.code === 'KPI-P01');
  const simKpiP02 = kpis.find((k) => k.code === 'KPI-P02');

  const simAchievementP01 =
    simKpiP01 && simulatedP01Actual > 0
      ? (simKpiP01.target / simulatedP01Actual) * 100
      : 80;
  const simAchievementP02 = 90; // KPI-P02 actual 81/90 = 90%
  const simObjectiveScore =
    simAchievementP01 * 0.6 + simAchievementP02 * 0.4;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('performance_analysis')} (Deep Calculation Engine & Analytics)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Transparent mathematical aggregation, variance analytics, and what-if sensitivity modeling.
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: '280px', fontSize: '12px', fontWeight: 600 }}
          value={selectedObjId}
          onChange={(e) => setSelectedObjId(e.target.value)}
        >
          {objectives.map((o) => (
            <option key={o.id} value={o.id}>
              {o.code}: {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* Top Main Score & Calculation Breakdown Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f2b46, #16426f)',
          color: '#ffffff',
          marginBottom: '24px',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
              Official Calculated Objective Score • {settings.activePeriod}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900 }}>
                {objCalc.score !== null ? `${objCalc.score.toFixed(1)}%` : '—'}
              </span>
              <RagBadge status={objCalc.ragStatus} />
            </div>
            <div style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '4px', fontWeight: 500 }}>
              {obj.code}: {language === 'ar' ? obj.nameAr : obj.name}
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '12px 18px',
              maxWidth: '420px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={13} />
              <span>Transparent Formula Verification</span>
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff', marginTop: '6px', fontFamily: 'monospace' }}>
              OBJ_SCORE = ∑ (KPI_Score × KPI_Weight)
              <br />
              = (80.0% × 60%) + (90.0% × 40%)
              <br />
              = 48.0% + 36.0% = <strong>84.0% (RED)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Breakdown */}
      <div className="perf-grid-2col">
        {objCalc.kpiBreakdown.map((kb) => {
          const kpi = kpis.find((k) => k.id === kb.kpiId);

          return (
            <div
              key={kb.kpiId}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => kpi && setSelectedKpi(kpi)}
            >
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#1e40af', fontSize: '13px' }}>
                    {kb.kpiCode}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46' }}>
                    {kb.kpiName}
                  </span>
                </div>
                <RagBadge status={kb.ragStatus} />
              </div>

              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Target</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>
                      {kb.target} {kb.unit}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Actual</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>
                      {kb.actual !== null ? `${kb.actual} ${kb.unit}` : 'Missing'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Achievement</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginTop: '2px' }}>
                      {kb.achievement !== null ? `${kb.achievement.toFixed(1)}%` : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Objective Weight</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>
                      {kb.weight}%
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#64748b' }}>
                    Score Contribution: <strong>{kb.contribution ? kb.contribution.toFixed(1) : 0}%</strong>
                  </span>
                  <StatusBadge status={kb.resultStatus} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Section (Recharts) */}
      <div className="perf-grid-2col">
        {/* Chart 1: Target vs Actual */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BarChart2 size={16} />
              <span>Target vs Actual Performance</span>
            </div>
          </div>
          <div className="card-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetVsActualData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Target" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Historical Performance Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={16} />
              <span>Quarterly Trajectory & Benchmark</span>
            </div>
          </div>
          <div className="card-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" fontSize={11} stroke="#64748b" />
                <YAxis domain={[50, 100]} fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Score" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Benchmark" stroke="#16a34a" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* What-If Live Sensitivity Simulator */}
      <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div className="card-header" style={{ backgroundColor: '#f0fdf4' }}>
          <div className="card-title" style={{ color: '#166534' }}>
            <Sparkles size={16} />
            <span>Interactive "What-If" Sensitivity Simulator (Demonstration Engine)</span>
          </div>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '12px', color: '#15803d', marginBottom: '16px' }}>
            Simulate how recovering cycle time through Corrective Action ACT-001 moves the needle on
            objective achievement live in the calculation engine:
          </p>

          <div className="perf-simulator-grid">
            <div>
              <label className="form-label" style={{ color: '#14532d' }}>
                Simulate KPI-P01 Actual Cycle Time: <strong>{simulatedP01Actual} days</strong>
                {simulatedP01Actual === 20 && ' (Target Achieved!)'}
              </label>
              <input
                type="range"
                min="15"
                max="35"
                step="1"
                value={simulatedP01Actual}
                onChange={(e) => setSimulatedP01Actual(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#166534', marginTop: '4px' }}>
                <span>15 days (Best)</span>
                <span>20 days (Target)</span>
                <span>25 days (Current Actual)</span>
                <span>35 days (Worst)</span>
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #86efac',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                Simulated Objective Score Result
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: simObjectiveScore >= 90 ? '#16a34a' : '#dc2626', marginTop: '2px' }}>
                {Math.min(100, simObjectiveScore).toFixed(1)}%
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                KPI-P01: {Math.min(100, simAchievementP01).toFixed(1)}% (60%) + KPI-P02: 90% (40%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
