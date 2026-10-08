import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StrategicOption } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Scale, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const StrategicOptions: React.FC = () => {
  const { options, updateOption, language, t, showToast } = useApp();

  // Criteria weights (must sum to 100%)
  const [weights, setWeights] = useState({
    impact: 30,
    mandateAlignment: 25,
    feasibility: 20,
    cost: 15,
    risk: 10,
  });

  const totalWeight =
    weights.impact +
    weights.mandateAlignment +
    weights.feasibility +
    weights.cost +
    weights.risk;

  // Calculate live weighted score for an option
  const computeWeightedScore = (opt: StrategicOption) => {
    const raw =
      opt.impact * (weights.impact / 100) +
      opt.mandateAlignment * (weights.mandateAlignment / 100) +
      opt.feasibility * (weights.feasibility / 100) +
      opt.cost * (weights.cost / 100) +
      opt.risk * (weights.risk / 100);
    return Math.round(raw * 100) / 100;
  };

  const handleSelectOption = (optId: string) => {
    options.forEach((opt) => {
      const isChosen = opt.id === optId;
      const updated: StrategicOption = {
        ...opt,
        status: isChosen ? 'Selected' : opt.id === 'OPT-02' ? 'Rejected' : 'Deferred',
      };
      updateOption(updated);
    });
    showToast(`Strategic decision ratified: Option ${optId} selected for plan execution.`, 'success');
  };

  const handleScoreChange = (opt: StrategicOption, field: keyof StrategicOption, val: number) => {
    const updated = { ...opt, [field]: val };
    updateOption(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('strategic_options')} (Multi-Criteria Evaluation Matrix)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Comparative decision modeling to prioritize high-impact strategic interventions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span>Weight Total:</span>
          <strong style={{ color: totalWeight === 100 ? '#16a34a' : '#dc2626' }}>
            {totalWeight}%
          </strong>
        </div>
      </div>

      {/* Criteria Weight Sliders */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8fafc' }}>
        <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
          <div className="card-title">
            <Scale size={16} />
            <span>Criteria Weighting Distribution (Must sum to 100%)</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">Strategic Impact: {weights.impact}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.impact}
                onChange={(e) => setWeights({ ...weights, impact: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="form-label">Mandate Alignment: {weights.mandateAlignment}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.mandateAlignment}
                onChange={(e) => setWeights({ ...weights, mandateAlignment: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="form-label">Feasibility: {weights.feasibility}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.feasibility}
                onChange={(e) => setWeights({ ...weights, feasibility: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="form-label">Cost Efficiency: {weights.cost}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.cost}
                onChange={(e) => setWeights({ ...weights, cost: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="form-label">Risk Favorability: {weights.risk}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.risk}
                onChange={(e) => setWeights({ ...weights, risk: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Options Comparison Table */}
      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '280px' }}>Strategic Alternative</th>
                <th style={{ textAlign: 'center' }}>Impact ({weights.impact}%)</th>
                <th style={{ textAlign: 'center' }}>Mandate ({weights.mandateAlignment}%)</th>
                <th style={{ textAlign: 'center' }}>Feasibility ({weights.feasibility}%)</th>
                <th style={{ textAlign: 'center' }}>Cost ({weights.cost}%)</th>
                <th style={{ textAlign: 'center' }}>Risk ({weights.risk}%)</th>
                <th style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>Weighted Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Selection Decision</th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt) => {
                const liveScore = computeWeightedScore(opt);
                const isSelected = opt.status === 'Selected';

                return (
                  <tr
                    key={opt.id}
                    style={{
                      backgroundColor: isSelected ? '#f0fdf4' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f2b46' }}>
                        {language === 'ar' ? opt.nameAr : opt.name}
                      </div>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {opt.description}
                      </p>
                    </td>

                    {/* Numeric Scores (1-10) with editable inputs */}
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={opt.impact}
                        onChange={(e) => handleScoreChange(opt, 'impact', Number(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={opt.mandateAlignment}
                        onChange={(e) => handleScoreChange(opt, 'mandateAlignment', Number(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={opt.feasibility}
                        onChange={(e) => handleScoreChange(opt, 'feasibility', Number(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={opt.cost}
                        onChange={(e) => handleScoreChange(opt, 'cost', Number(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={opt.risk}
                        onChange={(e) => handleScoreChange(opt, 'risk', Number(e.target.value))}
                        style={{ width: '50px', textAlign: 'center', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </td>

                    <td style={{ textAlign: 'center', backgroundColor: isSelected ? '#dcfce7' : '#f1f5f9', fontWeight: 800, fontSize: '15px', color: isSelected ? '#15803d' : '#0f2b46' }}>
                      {liveScore} / 10
                    </td>

                    <td>
                      <StatusBadge status={opt.status} />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {isSelected ? (
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <CheckCircle2 size={15} />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSelectOption(opt.id)}
                        >
                          Select Option
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Option Decision Rationale */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f0fdf4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '13px' }}>
            <CheckCircle2 size={16} />
            <span>Formal Strategic Decision Rationale</span>
          </div>
          <p style={{ fontSize: '12px', color: '#14532d', marginTop: '4px', lineHeight: 1.5 }}>
            {options.find((o) => o.status === 'Selected')?.decisionRationale}
          </p>
        </div>
      </div>
    </div>
  );
};
