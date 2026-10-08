import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Initiative } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Sparkles, Plus, Search, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

export const StrategicInitiatives: React.FC = () => {
  const { initiatives, updateInitiative, addInitiative, objectives, users, setSelectedInitiative, checkPermission, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const canEdit = checkPermission('EDIT', 'initiative').allowed;

  const filteredInitiatives = initiatives.filter((ini) => {
    const matchSearch =
      ini.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ini.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || ini.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('initiatives')} (Strategic Execution Programs)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Transformational programs, milestone delivery schedules, and fiscal allocations. Execution progress is tracked independently from KPI performance.
          </p>
        </div>

        {canEdit && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} />
            <span>Charter New Initiative</span>
          </button>
        )}
      </div>

      {/* Initiatives Table Card */}
      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search code or initiative..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '160px', fontSize: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Code</th>
                <th>Initiative Name</th>
                <th>Linked Objective</th>
                <th>Program Manager</th>
                <th>Approved Budget</th>
                <th>Actual Spend</th>
                <th>Milestone Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInitiatives.map((ini) => {
                const obj = objectives.find((o) => o.id === ini.objectiveId);
                const owner = users.find((u) => u.id === ini.ownerId);

                return (
                  <tr
                    key={ini.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedInitiative(ini)}
                  >
                    <td style={{ fontWeight: 700, color: '#1e40af' }}>{ini.code}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' ? ini.nameAr : ini.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {ini.description.slice(0, 80)}...
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#1e40af' }}>
                      {obj ? obj.code : ini.objectiveId}
                    </td>
                    <td style={{ fontSize: '12px' }}>{owner ? owner.name : 'Program Manager'}</td>
                    <td style={{ fontWeight: 600 }}>{ini.budget.toLocaleString()} SAR</td>
                    <td style={{ color: '#475569' }}>{ini.actualCost.toLocaleString()} SAR</td>
                    <td style={{ width: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                        <span>{ini.progress}%</span>
                        <span style={{ color: '#64748b' }}>
                          {ini.milestones.filter((m) => m.completed).length}/{ini.milestones.length}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '3px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${ini.progress}%`,
                            background: '#2563eb',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={ini.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charter Modal notice */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Charter Strategic Initiative"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569' }}>
          Demonstration notice: Core initiatives including <strong>INI-001 (Digital Case Handling)</strong>{' '}
          are pre-seeded. Click any initiative row to open the milestone checklist drawer and interactively
          update progress!
        </p>
      </Modal>
    </div>
  );
};
