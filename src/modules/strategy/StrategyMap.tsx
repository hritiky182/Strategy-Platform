import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StrategicObjective } from '../../types';
import { RagBadge } from '../../components/common/Badge';
import { calculateObjectiveScore, calculatePerspectiveScore } from '../../services/calculationService';
import { SpeedometerGauge } from '../../components/common/SpeedometerGauge';
import {
  GitBranch,
  ArrowUp,
  Coins,
  Users,
  Cog,
  TrendingUp,
  LayoutGrid,
  Network,
  Info,
} from 'lucide-react';
import executiveHeroImg from '../../assets/executive_hero.jpg';

export const StrategyMap: React.FC = () => {
  const {
    perspectives,
    objectives,
    relationships,
    kpis,
    results,
    settings,
    entityConfig,
    setSelectedObjective,
    language,
    t,
  } = useApp();

  const [viewMode, setViewMode] = useState<'pillars' | 'causal'>('pillars');

  // Sorted perspectives
  const pFinancial = perspectives.find((p) => p.id === 'PER-04') || perspectives[3] || perspectives[0];
  const pStakeholders = perspectives.find((p) => p.id === 'PER-01') || perspectives[0];
  const pProcesses = perspectives.find((p) => p.id === 'PER-02') || perspectives[1] || perspectives[0];
  const pCapacity = perspectives.find((p) => p.id === 'PER-03') || perspectives[2] || perspectives[0];

  const pillarsList = [
    {
      perspective: pFinancial,
      title: 'FINANCIAL',
      titleAr: 'الاستدامة المالية والموارد',
      icon: <Coins size={22} />,
    },
    {
      perspective: pStakeholders,
      title: 'CUSTOMER & CITIZEN',
      titleAr: 'المستفيدون والمجتمع',
      icon: <Users size={22} />,
    },
    {
      perspective: pProcesses,
      title: 'INTERNAL PROCESSES',
      titleAr: 'العمليات التشغيلية والخدمات',
      icon: <Cog size={22} />,
    },
    {
      perspective: pCapacity,
      title: 'ORGANIZATIONAL CAPACITY',
      titleAr: 'القدرات والتعلم المؤسسي',
      icon: <TrendingUp size={22} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Title & View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f2b46', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0f766e' }}>{entityConfig?.name ? entityConfig.name.split(' ').map(w => w[0]).join('').slice(0, 4) : 'AHDA'}</span> Corporate Strategy Map & Scorecard
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {language === 'ar'
              ? `بنية العلاقات السببية لبطاقة الأداء المتوازن لصالح ${entityConfig?.nameAr || 'هيئة تطوير الأحساء'}.`
              : `Interactive Balanced Scorecard cause-and-effect architecture for ${entityConfig?.name || 'Al Ahsa Development Authority'}.`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '6px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('pillars')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'pillars' ? '#ffffff' : 'transparent',
                color: viewMode === 'pillars' ? '#0f766e' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: viewMode === 'pillars' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <LayoutGrid size={14} />
              <span>BSC Perspective Pillars</span>
            </button>
            <button
              onClick={() => setViewMode('causal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'causal' ? '#ffffff' : 'transparent',
                color: viewMode === 'causal' ? '#0f766e' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: viewMode === 'causal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Network size={14} />
              <span>Causal Hierarchy Flow</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#dc2626' }} />
            <span>&lt;90% Red</span>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#d97706' }} />
            <span>90–99% Amber</span>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#16a34a' }} />
            <span>≥100% Green</span>
          </div>
        </div>
      </div>

      <div className="strategy-hero-grid">
        <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* AHDA Brand Emblem & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.8px', color: '#0f2b46' }}>
              AL AHSA DEVELOPMENT AUTHORITY
            </span>
            <span style={{ color: '#059669', fontSize: '14px', fontWeight: 800 }}>•</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f766e' }}>
              {language === 'ar' ? 'هيئة تطوير الأحساء' : 'STRATEGIC VISION 2030'}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
            {language === 'ar'
              ? 'تترجم هيئة تطوير الأحساء التوجهات والخيارات الاستراتيجية إلى بطاقة أداء متوازن متصلة تربط المبادرات التنموية، كفاءة الخدمات، والقدرات المؤسسية بمستهدفات الأثر المستدام.'
              : 'Translating AHDA’s regional mandate and strategic priorities into a coherent Balanced Scorecard architecture with direct accountability across stakeholder outcomes, internal service delivery, capabilities, and resource stewardship.'}
          </p>

          <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f766e', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            TRANSLATING STRATEGIC CHOICES INTO MEASURABLE PUBLIC VALUE.
          </div>
        </div>

        {/* Executive Portrait Right Side */}
        <div
          style={{
            backgroundImage: `url(${executiveHeroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            minHeight: '190px',
            borderInlineStart: '1px solid #e2e8f0',
          }}
        />
      </div>

      {/* Main Strategy View: 4 Pillars Layout (Matching Image 2) */}
      {viewMode === 'pillars' && (
        <div className="strategy-pillars-grid">
          {pillarsList.map((item) => {
            const pObj = item.perspective
              ? objectives.filter((o) => o.perspectiveId === item.perspective.id)
              : [];
            const pScore = item.perspective
              ? calculatePerspectiveScore(item.perspective.id, objectives, kpis, results, settings.activePeriod)
              : { score: 85, ragStatus: 'AMBER' as const };

            return (
              <div key={item.title} className="corp-pillar-card">
                {/* Pillar Header with circular icon, Gauge Arc & Title */}
                <div className="corp-pillar-header">
                  <div className="corp-pillar-icon-badge">{item.icon}</div>

                  {/* SVG Speedometer Gauge Arc */}
                  <SpeedometerGauge score={pScore.score} size={115} />

                  <div className="corp-pillar-title">
                    {language === 'ar' ? item.titleAr : item.title}
                  </div>
                </div>

                {/* Pillar Body with Objectives List */}
                <div className="corp-pillar-body">
                  {pObj.map((obj) => {
                    const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);
                    const statusColor =
                      calc.ragStatus === 'GREEN'
                        ? '#16a34a'
                        : calc.ragStatus === 'AMBER'
                        ? '#d97706'
                        : '#dc2626';

                    return (
                      <div
                        key={obj.id}
                        className="corp-pillar-objective-item"
                        onClick={() => setSelectedObjective(obj)}
                        title={`Click to inspect ${obj.code}: ${obj.name}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1 }}>
                          {/* Status Dot */}
                          <div
                            style={{
                              width: '11px',
                              height: '11px',
                              borderRadius: '50%',
                              backgroundColor: statusColor,
                              flexShrink: 0,
                              boxShadow: `0 0 0 2px ${statusColor}33`,
                            }}
                          />
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46', lineHeight: 1.3 }}>
                            {language === 'ar' ? obj.nameAr : obj.name}
                          </div>
                        </div>

                        {/* Calculated score badge */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: statusColor,
                              backgroundColor: `${statusColor}15`,
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {calc.score !== null ? `${calc.score.toFixed(0)}%` : '—'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alternative View: Causal Network Flow */}
      {viewMode === 'causal' && (
        <div className="card" style={{ padding: '24px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {[pStakeholders, pProcesses, pCapacity, pFinancial].filter(Boolean).map((p) => {
              if (!p) return null;
              const laneObjectives = objectives.filter((o) => o.perspectiveId === p.id);

              return (
                <div key={p.id} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', background: '#ffffff', overflow: 'hidden' }}>
                  <div style={{ background: '#f1f5f9', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase' }}>
                      {language === 'ar' ? p.nameAr : p.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {laneObjectives.length} Strategic Objectives
                    </span>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                    {laneObjectives.map((obj) => {
                      const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);
                      return (
                        <div
                          key={obj.id}
                          onClick={() => setSelectedObjective(obj)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            cursor: 'pointer',
                            minWidth: '240px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0060a9' }}>{obj.code}</span>
                            <RagBadge status={calc.ragStatus} />
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                            {language === 'ar' ? obj.nameAr : obj.name}
                          </div>
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Weight: {obj.weight}%</span>
                            <span style={{ fontWeight: 800, color: '#0f2b46' }}>{calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cause-and-Effect Directional Linkages Table */}
      <div className="card">
        <div className="card-header" style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#0f2b46' }}>
            <GitBranch size={16} style={{ color: '#0060a9' }} />
            <span>Strategic Hypothesis & Cause-and-Effect Links</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Build staff capability & deploy digital case handling → reduce cycle time → improve beneficiary satisfaction → strengthen public value.
          </span>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Enabling Driver (Cause)</th>
                <th>Outcome Node (Effect)</th>
                <th>Relationship</th>
                <th>Strategic Causal Rationale</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((rel) => {
                const src = objectives.find((o) => o.id === rel.sourceObjectiveId);
                const tgt = objectives.find((o) => o.id === rel.targetObjectiveId);

                return (
                  <tr key={rel.id}>
                    <td style={{ fontWeight: 700, color: '#0060a9' }}>
                      {src ? `${src.code}: ${src.name}` : rel.sourceObjectiveId}
                    </td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>
                      {tgt ? `${tgt.code}: ${tgt.name}` : rel.targetObjectiveId}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#eff6ff', borderRadius: '4px', fontSize: '11px', color: '#0060a9', fontWeight: 600 }}>
                        <ArrowUp size={12} />
                        <span>Upward Impact</span>
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>
                      {language === 'ar' ? rel.rationaleAr : rel.rationale}
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
