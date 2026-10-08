import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Search, ShieldCheck } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditLogs, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter(
    (log) =>
      log.record.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('audit_history')} (Immutable Audit Trail & Compliance Register)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Cryptographically sealed event ledger capturing all mutations, approvals, returns, and target amendments.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search user, action, or record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Timestamp (UTC)</th>
                <th>Actor & Enterprise Role</th>
                <th>Governing Action</th>
                <th>Target Record</th>
                <th>Previous State</th>
                <th>New State</th>
                <th>Audit Justification</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f2b46' }}>{log.userName}</div>
                    <div style={{ fontSize: '11px', color: '#2563eb' }}>{log.role}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: log.action.includes('APPROVE') || log.action.includes('PUBLISH')
                          ? '#dcfce7'
                          : log.action.includes('RETURN')
                          ? '#fee2e2'
                          : '#eff6ff',
                        color: log.action.includes('APPROVE') || log.action.includes('PUBLISH')
                          ? '#15803d'
                          : log.action.includes('RETURN')
                          ? '#b91c1c'
                          : '#1d4ed8',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f2b46' }}>{log.record}</td>
                  <td style={{ fontSize: '11px', color: '#64748b' }}>{log.previousValue}</td>
                  <td style={{ fontSize: '11px', fontWeight: 600, color: '#166534' }}>{log.newValue}</td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '280px' }}>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
