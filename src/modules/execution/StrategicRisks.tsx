import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/Badge';
import { ShieldAlert, Plus, Search, AlertCircle } from 'lucide-react';

export const StrategicRisks: React.FC = () => {
  const { risks, objectives, language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = risks.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('strategic_risks')} (Strategic Risk Register)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Identifying, monitoring, and mitigating threats that could jeopardize strategic objective realization.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search risk title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Risk Code</th>
                <th>Strategic Threat / Risk Description</th>
                <th>Linked Objective</th>
                <th>Probability</th>
                <th>Impact</th>
                <th>Mitigation Strategy</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const obj = objectives.find((o) => o.id === r.objectiveId);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, color: '#dc2626' }}>{r.code}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' && r.titleAr ? r.titleAr : r.title}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#1e40af', fontWeight: 500 }}>
                      {obj ? obj.code : r.objectiveId}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: r.probability === 'High' ? '#dc2626' : '#d97706' }}>
                        {r.probability}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: r.impact === 'High' ? '#dc2626' : '#d97706' }}>
                        {r.impact}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>{r.mitigation}</td>
                    <td style={{ fontSize: '12px' }}>{r.owner}</td>
                    <td>
                      <StatusBadge status={r.status} />
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
