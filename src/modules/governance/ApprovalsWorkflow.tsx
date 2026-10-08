import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plan } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ClipboardCheck, RotateCcw, CheckCircle2, BookmarkCheck, Send, ShieldAlert, FileText } from 'lucide-react';
import { validateStrategyPlanTransition } from '../../services/workflowService';

export const ApprovalsWorkflow: React.FC = () => {
  const { plans, updatePlan, currentUser, checkPermission, showToast, language, t } = useApp();

  const [activePlan, setActivePlan] = useState<Plan>(plans[0]);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState(
    'Please add accountable operational co-owner for KPI-P02 (Digital Case Completion) and specify API security baseline.'
  );

  const canApprove = checkPermission('APPROVE', 'strategy_plan').allowed;
  const canPublish = checkPermission('PUBLISH', 'strategy_plan').allowed;

  const handleTransition = (targetStatus: any, note?: string) => {
    const check = validateStrategyPlanTransition(activePlan.status, targetStatus);
    if (!check.valid) {
      showToast(check.error || 'Invalid transition', 'error');
      return;
    }

    const updated: Plan = {
      ...activePlan,
      status: targetStatus,
      publishedAt: targetStatus === 'Published' ? new Date().toISOString() : activePlan.publishedAt,
    };

    updatePlan(updated);
    setActivePlan(updated);
    showToast(`Strategic Plan is now in status: ${targetStatus}`, 'success');
  };

  const handleReturn = () => {
    handleTransition('Draft', returnFeedback);
    setIsReturnModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('approvals')} (Strategy Governance & Approval Gateway)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Multi-tier governance: Draft → Review → Returned / Approved → Formal Executive Publication.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Active State:</span>
          <StatusBadge status={activePlan.status} />
        </div>
      </div>

      {/* Plan Approval Dossier Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <ClipboardCheck size={16} />
            <span>Governance Dossier: {activePlan.code} ({activePlan.version})</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>
            Horizon: {activePlan.horizon}
          </span>
        </div>

        <div className="card-body">
          {/* Progress Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px',
              overflowX: 'auto',
              minWidth: '550px',
            }}
          >
            {/* Step 1 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1e40af',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px auto',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>Draft Formulated</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Objectives & Themes</div>
            </div>

            <div style={{ height: '2px', flex: 1, backgroundColor: '#1e40af' }} />

            {/* Step 2 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: activePlan.status !== 'Draft' ? '#1e40af' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px auto',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {activePlan.status === 'Draft' ? '2' : '✓'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>Assurance Review</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Technical Reviewers</div>
            </div>

            <div style={{ height: '2px', flex: 1, backgroundColor: activePlan.status === 'Approved' || activePlan.status === 'Published' ? '#1e40af' : '#e2e8f0' }} />

            {/* Step 3 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: activePlan.status === 'Approved' || activePlan.status === 'Published' ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px auto',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {activePlan.status === 'Published' ? '✓' : '3'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>Executive Approval</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Director General Sign-off</div>
            </div>

            <div style={{ height: '2px', flex: 1, backgroundColor: activePlan.status === 'Published' ? '#16a34a' : '#e2e8f0' }} />

            {/* Step 4 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: activePlan.status === 'Published' ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px auto',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                4
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>Published Baseline</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Immutable v1.0</div>
            </div>
          </div>

          {/* Action Decision Controls */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                Governance Stage Controls
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Demonstrate returning with review rationale, approving, and formal publication.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {activePlan.status === 'Draft' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleTransition('In Review')}
                >
                  <Send size={13} />
                  <span>Submit for Executive Review</span>
                </button>
              )}

              {activePlan.status === 'In Review' && (
                <>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setIsReturnModalOpen(true)}
                  >
                    <RotateCcw size={13} />
                    <span>Return with Feedback</span>
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleTransition('Approved')}
                  >
                    <CheckCircle2 size={13} />
                    <span>Approve Strategic Plan</span>
                  </button>
                </>
              )}

              {activePlan.status === 'Approved' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleTransition('Published')}
                >
                  <BookmarkCheck size={13} />
                  <span>Publish Plan (Freeze v1.0 Baseline)</span>
                </button>
              )}

              {activePlan.status === 'Published' && (
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookmarkCheck size={16} />
                  <span>Published & Frozen: Future revisions require formal Amendment</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Return Strategy Plan for Revisions"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsReturnModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-danger" onClick={handleReturn}>
              Confirm Return to Draft
            </button>
          </>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
          Specify governance feedback. The plan will revert to Draft status for amendments before resubmission.
        </p>
        <div className="form-group">
          <label className="form-label">Reviewer Notes & Required Changes *</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={returnFeedback}
            onChange={(e) => setReturnFeedback(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
};
