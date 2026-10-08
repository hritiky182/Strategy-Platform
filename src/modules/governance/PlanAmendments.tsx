import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Amendment } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { FileEdit, Plus, CheckCircle2, ShieldCheck, ArrowRight, History } from 'lucide-react';

export const PlanAmendments: React.FC = () => {
  const { amendments, addAmendment, updateAmendment, kpis, users, checkPermission, showToast, language, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Amendment>({
    id: '',
    code: '',
    targetType: 'KPI_TARGET',
    targetRecordId: 'KPI-P01',
    targetRecordName: 'Average Completed-Case Cycle Time',
    oldValue: 20,
    newValue: 18,
    reason: 'Reflect faster operational velocity enabled by digital triage automation in H2 2027.',
    effectiveDate: '2027-07-01',
    reviewerId: 'USR-06',
    affectedPeriods: ['Q3 2027', 'Q4 2027'],
    status: 'Approved',
    versionGenerated: 'KPI-P01 v2.0',
  });

  const canApprove = checkPermission('APPROVE', 'amendment').allowed;

  const handleCreateAmendment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAmd: Amendment = {
      ...formData,
      id: `AMD-${Date.now().toString().slice(-4)}`,
      code: `AMD-2027-0${amendments.length + 1}`,
      status: 'Submitted',
      versionGenerated: `${formData.targetRecordId} v2.0`,
    };

    addAmendment(newAmd);
    setIsModalOpen(false);
  };

  const handleApproveAmendment = (amd: Amendment) => {
    updateAmendment({
      ...amd,
      status: 'Approved',
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('amendments')} (Target Amendments & Version Control)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Controlled baseline revision protocol: Modifying targets creates auditable version forks without altering historical quarters.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} />
          <span>Propose Plan Amendment</span>
        </button>
      </div>

      {/* Historical Integrity Rule Banner */}
      <div
        style={{
          padding: '12px 18px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <ShieldCheck size={20} color="#1d4ed8" />
        <div style={{ fontSize: '12px', color: '#1e40af' }}>
          <strong>Historical Preservation Invariant:</strong> Ratifying an amendment updates future
          periods (e.g. Q3/Q4 2027) with a new version tag (e.g. KPI-P01 v2.0). All previously frozen
          snapshots (e.g. REP-Q1-2027 v1) remain strictly intact and bit-for-bit immutable.
        </div>
      </div>

      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Amendment ID</th>
                <th>Target Element</th>
                <th>Prior Baseline</th>
                <th>New Proposed Value</th>
                <th>Governance Reason</th>
                <th>Effective Horizon</th>
                <th>Version Generated</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Approval Action</th>
              </tr>
            </thead>
            <tbody>
              {amendments.map((amd) => (
                <tr key={amd.id}>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{amd.code}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f2b46' }}>{amd.targetRecordName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Type: {amd.targetType}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>{amd.oldValue} days</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>{amd.newValue} days</td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '300px' }}>
                    {amd.reason}
                  </td>
                  <td style={{ fontSize: '11px', color: '#64748b' }}>
                    From {amd.effectiveDate} ({amd.affectedPeriods.join(', ')})
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', padding: '2px 8px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '4px', fontWeight: 600 }}>
                      {amd.versionGenerated}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={amd.status} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {amd.status === 'Submitted' && canApprove && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApproveAmendment(amd)}
                      >
                        <CheckCircle2 size={12} />
                        <span>Ratify Amendment</span>
                      </button>
                    )}
                    {amd.status === 'Approved' && (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} />
                        <span>Enacted</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Propose Amendment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propose Formal Strategic Target Amendment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleCreateAmendment}>
              Submit Amendment
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateAmendment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Target Record</label>
              <select
                className="form-select"
                value={formData.targetRecordId}
                onChange={(e) => {
                  const k = kpis.find((x) => x.id === e.target.value);
                  setFormData({
                    ...formData,
                    targetRecordId: e.target.value,
                    targetRecordName: k ? k.name : '',
                    oldValue: k ? k.target : 20,
                  });
                }}
              >
                {kpis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code}: {k.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Existing Baseline Target</label>
              <input className="form-input" value={formData.oldValue} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Amended Target Value *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={formData.newValue}
                onChange={(e) => setFormData({ ...formData, newValue: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Justification & Strategic Evidence *</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
