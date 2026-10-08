import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Calendar, Plus, Copy, CheckCircle2, Send, BookmarkCheck, FileText } from 'lucide-react';
import { validateStrategyPlanTransition } from '../../services/workflowService';

export const PlanningCycles: React.FC = () => {
  const { plans, updatePlan, addPlan, users, checkPermission, t, language, showToast } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copiedPlanName, setCopiedPlanName] = useState('AHDA Strategic Plan 2031-2034 (Draft)');

  const canEdit = checkPermission('EDIT', 'strategy_plan').allowed;
  const canSubmit = checkPermission('SUBMIT', 'strategy_plan').allowed;
  const canPublish = checkPermission('PUBLISH', 'strategy_plan').allowed;

  const handleStatusTransition = (targetStatus: any) => {
    const validation = validateStrategyPlanTransition(selectedPlan.status, targetStatus);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid transition', 'error');
      return;
    }

    const updated: Plan = {
      ...selectedPlan,
      status: targetStatus,
      publishedAt: targetStatus === 'Published' ? new Date().toISOString() : selectedPlan.publishedAt,
    };
    updatePlan(updated);
    setSelectedPlan(updated);
  };

  const handleCopyPlan = () => {
    const newPlan: Plan = {
      ...selectedPlan,
      id: `PLAN-${(plans.length + 1).toString().padStart(2, '0')}`,
      code: 'STR-2031-2034',
      name: copiedPlanName,
      nameAr: 'خطة هيئة تطوير الأحساء 2031-2034',
      horizon: '2031–2034',
      version: 'v0.1 Draft',
      status: 'Draft',
      publishedAt: undefined,
    };

    addPlan(newPlan);
    setIsCopyModalOpen(false);
    setSelectedPlan(newPlan);
    showToast('Plan copied as clean draft baseline without past actuals or approvals.', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('planning_cycles')} (Strategic Horizon & Cycle Management)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Governing strategic time horizons, reporting cadences, version history, and publication baselines.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={() => setIsCopyModalOpen(true)}>
          <Copy size={14} />
          <span>Copy Plan as New Draft</span>
        </button>
      </div>

      {/* Plan Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Calendar size={16} />
            <span>{selectedPlan.code}: {language === 'ar' ? selectedPlan.nameAr : selectedPlan.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
              Version {selectedPlan.version}
            </span>
            <StatusBadge status={selectedPlan.status} />
          </div>
        </div>

        <div className="card-body">
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Planning Horizon</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '3px' }}>
                {selectedPlan.horizon}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Strategy Framework</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '3px' }}>
                {selectedPlan.framework}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Reporting Cadence</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '3px' }}>
                {selectedPlan.reportingFrequency}
              </div>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Submission Deadline</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '3px' }}>
                {selectedPlan.deadlines}
              </div>
            </div>
          </div>

          {/* Mandate & Mission Brief */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0f2b46' }}>Institutional Mandate:</strong>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                {language === 'ar' ? selectedPlan.mandateAr : selectedPlan.mandate}
              </p>
            </div>
            <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0f2b46' }}>Strategic Vision:</strong>
              <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                {language === 'ar' ? selectedPlan.visionAr : selectedPlan.vision}
              </p>
            </div>
          </div>

          {/* Lifecycle State Transitions */}
          <div
            style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                Strategy Lifecycle Workflow Stage
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Current state: <strong>{selectedPlan.status}</strong> (Published baseline v1 cannot be silently altered)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedPlan.status === 'Draft' && canSubmit && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStatusTransition('In Review')}
                >
                  <Send size={13} />
                  <span>Submit Plan for Review</span>
                </button>
              )}

              {selectedPlan.status === 'In Review' && (
                <>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusTransition('Draft')}
                  >
                    <span>Return for Revisions</span>
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusTransition('Approved')}
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve Strategy Plan</span>
                  </button>
                </>
              )}

              {selectedPlan.status === 'Approved' && canPublish && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStatusTransition('Published')}
                >
                  <BookmarkCheck size={13} />
                  <span>Publish Version 1.0</span>
                </button>
              )}

              {selectedPlan.status === 'Published' && (
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Active Published Baseline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Plan Modal */}
      <Modal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        title="Copy Plan as New Draft Horizon"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsCopyModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleCopyPlan}>
              Create New Plan Draft
            </button>
          </>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
          This will duplicate the strategic architecture, themes, and objective structure as a fresh
          Draft without carrying over approvals or past performance results.
        </p>
        <div className="form-group">
          <label className="form-label">New Plan Title *</label>
          <input
            className="form-input"
            value={copiedPlanName}
            onChange={(e) => setCopiedPlanName(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
