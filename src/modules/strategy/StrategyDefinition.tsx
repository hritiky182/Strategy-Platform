import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Sparkles, Shield, Bookmark, ExternalLink } from 'lucide-react';

export const StrategyDefinition: React.FC = () => {
  const { plans, themes, objectives, setSelectedObjective, language, t } = useApp();
  const plan = plans[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('strategy_definition')} (Strategic Identity & Themes)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Guiding mandate, vision statement, institutional values, and strategic thematic pillars.
          </p>
        </div>

        <div style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>
          Plan Baseline: {plan.code} ({plan.version})
        </div>
      </div>

      {/* Identity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={16} />
              <span>Institutional Mandate</span>
            </div>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.6 }}>
              {language === 'ar' ? plan.mandateAr : plan.mandate}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Compass size={16} />
              <span>Vision 2030 Aspiration</span>
            </div>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.6 }}>
              {language === 'ar' ? plan.visionAr : plan.vision}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Core Values */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={16} />
            <span>Mission & Core Institutional Values</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Strategic Mission Statement
            </span>
            <p style={{ fontSize: '14px', color: '#0f2b46', fontWeight: 600, marginTop: '4px', lineHeight: 1.5 }}>
              {language === 'ar' ? plan.missionAr : plan.mission}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Core Values
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
              {(language === 'ar' ? plan.valuesAr : plan.values).map((val, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Themes & Linkage to Objectives */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Bookmark size={16} />
            <span>Strategic Themes & Linked Objectives</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {themes.map((thm) => {
              const linkedObjs = objectives.filter((o) => o.themeId === thm.id);
              return (
                <div
                  key={thm.id}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46' }}>
                    {language === 'ar' ? thm.nameAr : thm.name}
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>
                    {language === 'ar' ? thm.descriptionAr : thm.description}
                  </p>

                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      Linked Objectives ({linkedObjs.length}):
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {linkedObjs.map((obj) => (
                        <div
                          key={obj.id}
                          onClick={() => setSelectedObjective(obj)}
                          style={{
                            padding: '6px 10px',
                            background: '#ffffff',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#1e40af' }}>{obj.code}</span>
                          <span style={{ color: '#475569' }}>{obj.weight}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* External Alignment Reference */}
      <div className="card" style={{ backgroundColor: '#f8fafc' }}>
        <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
          <div className="card-title">
            <ExternalLink size={16} />
            <span>External National Alignment Reference (Non-Scoring)</span>
          </div>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            AHDA Strategy STR-2027-2030 links outward to Saudi Vision 2030 Vibrant Society & Thriving
            Economy programs, Digital Government Authority (DGA) interoperability guidelines, and
            National Municipal Transformation Charters. As per methodology, external alignment is an
            informational reference and does not inject artificial scoring parents into the authority scorecard.
          </p>
        </div>
      </div>
    </div>
  );
};
