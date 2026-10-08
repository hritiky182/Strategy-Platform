import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CorrectiveAction } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { AlertTriangle, Plus, Search, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const CorrectiveActions: React.FC = () => {
  const { actions, addAction, updateAction, setSelectedAction, kpis, users, checkPermission, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<CorrectiveAction>({
    id: '',
    code: '',
    title: '',
    titleAr: '',
    problem: '',
    rootCause: '',
    kpiId: 'KPI-P01',
    resultId: 'RES-P01-Q1-2027',
    initiativeId: 'INI-001',
    ownerId: 'USR-04',
    ownerName: 'Fahad Al-Dosari',
    dueDate: '2027-05-15',
    expectedEffect: '',
    evidence: '',
    effectivenessCheck: '',
    status: 'Open',
  });

  const canCreate = checkPermission('CREATE', 'action').allowed;

  const filteredActions = actions.filter((act) => {
    const matchSearch =
      act.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || act.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      id: `ACT-${(actions.length + 1).toString().padStart(3, '0')}`,
      code: `ACT-${(actions.length + 1).toString().padStart(3, '0')}`,
      title: '',
      titleAr: '',
      problem: '',
      rootCause: '',
      kpiId: 'KPI-P01',
      resultId: 'RES-P01-Q1-2027',
      initiativeId: 'INI-001',
      ownerId: users[3]?.id || '',
      ownerName: users[3]?.name || '',
      dueDate: '2027-05-15',
      expectedEffect: '',
      evidence: '',
      effectivenessCheck: 'Next cycle quarterly performance audit result.',
      status: 'Open',
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.problem.trim()) return;

    const assignedUser = users.find((u) => u.id === formData.ownerId);
    addAction({
      ...formData,
      ownerName: assignedUser ? assignedUser.name : formData.ownerName,
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('corrective_actions')} (Performance Exception Response)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Root cause investigation and corrective mitigation plans linked directly to underperforming KPIs.
          </p>
        </div>

        {canCreate && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={15} />
            <span>Initiate Corrective Action</span>
          </button>
        )}
      </div>

      {/* Exception Banner */}
      <div
        style={{
          padding: '12px 18px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <AlertTriangle size={20} color="#b91c1c" />
        <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
          <strong>Critical Exception: </strong> Action <strong>ACT-001 (Redesign Case Triage Process)</strong> is
          currently <strong>Overdue</strong>. Overdue items are elevated to the Director General's workspace and executive reports.
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search code or problem..."
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
            <option value="Overdue">Overdue</option>
            <option value="In Progress">In Progress</option>
            <option value="Open">Open</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Action ID</th>
                <th>Corrective Action Title</th>
                <th>Underperforming KPI</th>
                <th>Assigned Owner</th>
                <th>Target Due Date</th>
                <th>Expected Impact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredActions.map((act) => {
                const kpi = kpis.find((k) => k.id === act.kpiId);

                return (
                  <tr
                    key={act.id}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: act.status === 'Overdue' ? '#fff1f2' : undefined,
                    }}
                    onClick={() => setSelectedAction(act)}
                  >
                    <td style={{ fontWeight: 700, color: act.status === 'Overdue' ? '#b91c1c' : '#1e40af' }}>
                      {act.code}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' && act.titleAr ? act.titleAr : act.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Problem: {act.problem.slice(0, 75)}...
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>
                      {kpi ? `${kpi.code}: ${kpi.name}` : act.kpiId}
                    </td>
                    <td style={{ fontSize: '12px' }}>{act.ownerName}</td>
                    <td style={{ fontWeight: 600, color: act.status === 'Overdue' ? '#dc2626' : '#0f2b46' }}>
                      {act.dueDate}
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569' }}>
                      {act.expectedEffect.slice(0, 60)}...
                    </td>
                    <td>
                      <StatusBadge status={act.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate Corrective Action Exception Response"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Submit Action
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Action Title *</label>
            <input
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Triggering Performance Problem *</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Diagnosed Root Cause *</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Linked Deficient KPI</label>
              <select
                className="form-select"
                value={formData.kpiId}
                onChange={(e) => setFormData({ ...formData, kpiId: e.target.value })}
              >
                {kpis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code}: {k.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Accountable Action Owner</label>
              <select
                className="form-select"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Target Completion Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Metric Impact</label>
              <input
                className="form-input"
                value={formData.expectedEffect}
                onChange={(e) => setFormData({ ...formData, expectedEffect: e.target.value })}
                placeholder="e.g. Recover 5 business days"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
