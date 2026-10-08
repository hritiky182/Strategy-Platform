import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceResult, KPI } from '../../types';
import { StatusBadge, RagBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { calculateKpiMetrics } from '../../services/calculationService';
import { CheckSquare, ArrowRight, RotateCcw, CheckCircle2, ShieldAlert, FileText, Send } from 'lucide-react';

export const ResultSubmissionApproval: React.FC = () => {
  const {
    kpis,
    results,
    updateResult,
    currentUser,
    settings,
    checkPermission,
    setSelectedKpi,
    showToast,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('all');
  const [selectedResult, setSelectedResult] = useState<PerformanceResult | null>(null);

  // Return modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState(
    'Supplemental evidence detail required: Please attach complete inter-directorate case processing breakdown.'
  );

  // Submit / Resubmit modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitActual, setSubmitActual] = useState<number>(25);
  const [submitEvidenceTitle, setSubmitEvidenceTitle] = useState(
    'Q1 2027 Case Processing Certified Audit Extract.pdf'
  );
  const [submitVariance, setSubmitVariance] = useState(
    'Cycle time remains above target due to fragmented case routing and manual inter-departmental transfers.'
  );

  // Filters
  const filteredResults = results.filter((r) => {
    if (r.period !== settings.activePeriod) return false;
    if (activeTab === 'pending') return r.status === 'Submitted' || r.status === 'Returned';
    if (activeTab === 'approved') return r.status === 'Approved';
    return true;
  });

  const handleOpenReview = (res: PerformanceResult) => {
    setSelectedResult(res);
  };

  // Perform Approval
  const handleApprove = (res: PerformanceResult) => {
    // Segregation of duties check
    const check = checkPermission('APPROVE', 'performance_result', res);
    if (!check.allowed) {
      showToast(check.reason || 'Approval denied by policy', 'error');
      return;
    }

    const updated: PerformanceResult = {
      ...res,
      status: 'Approved',
      reviewedBy: currentUser.id,
      reviewedAt: new Date().toISOString(),
      history: [
        ...res.history,
        {
          version: res.version,
          actual: res.actual,
          status: 'Approved',
          changedBy: currentUser.name,
          changedAt: new Date().toISOString(),
          note: `Approved by ${currentUser.name} (${currentUser.role}). Verified against attached evidence.`,
          evidenceTitle: res.evidenceTitle,
        },
      ],
    };

    updateResult(updated);
    setSelectedResult(null);
  };

  // Perform Return with Reason
  const handleReturnSubmission = () => {
    if (!selectedResult) return;

    const check = checkPermission('APPROVE', 'performance_result', selectedResult);
    if (!check.allowed && currentUser.role !== 'Performance Reviewer') {
      showToast(check.reason || 'Permission denied', 'error');
      return;
    }

    const updated: PerformanceResult = {
      ...selectedResult,
      status: 'Returned',
      returnReason,
      reviewedBy: currentUser.id,
      reviewedAt: new Date().toISOString(),
      history: [
        ...selectedResult.history,
        {
          version: selectedResult.version,
          actual: selectedResult.actual,
          status: 'Returned',
          changedBy: currentUser.name,
          changedAt: new Date().toISOString(),
          note: `Returned for revision: ${returnReason}`,
        },
      ],
    };

    updateResult(updated);
    setIsReturnModalOpen(false);
    setSelectedResult(null);
  };

  // Perform Submit or Resubmit
  const handleResubmit = () => {
    if (!selectedResult) return;

    const newVersion = selectedResult.version + 1;
    const updated: PerformanceResult = {
      ...selectedResult,
      actual: submitActual,
      evidenceTitle: submitEvidenceTitle,
      varianceAnalysis: submitVariance,
      status: 'Submitted',
      submittedBy: currentUser.id,
      submittedAt: new Date().toISOString(),
      version: newVersion,
      returnReason: undefined,
      history: [
        ...selectedResult.history,
        {
          version: newVersion,
          actual: submitActual,
          status: 'Submitted',
          changedBy: currentUser.name,
          changedAt: new Date().toISOString(),
          note: `Resubmitted (v${newVersion}) with supplemental evidence: ${submitEvidenceTitle}`,
          evidenceTitle: submitEvidenceTitle,
        },
      ],
    };

    updateResult(updated);
    setIsSubmitModalOpen(false);
    setSelectedResult(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('scorecard_results')} (Submission, Review & Verification Queue)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Two-stage data assurance: only verified and approved performance actuals contribute to official scorecards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('all')}
          >
            All Submissions ({results.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Review / Returned
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({results.filter((r) => r.status === 'Approved').length})
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>KPI Code</th>
                <th>Indicator Name</th>
                <th>Baseline</th>
                <th>Target</th>
                <th>Submitted Actual</th>
                <th>Raw Achievement</th>
                <th>Attached Evidence</th>
                <th>Version</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Workflow Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((res) => {
                const kpi = kpis.find((k) => k.id === res.kpiId);
                if (!kpi) return null;

                const metrics = calculateKpiMetrics(kpi, res);

                return (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 700, color: '#1e40af' }}>{kpi.code}</td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#0f2b46', cursor: 'pointer' }}
                        onClick={() => setSelectedKpi(kpi)}
                      >
                        {language === 'ar' ? kpi.nameAr : kpi.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Period: {res.period}
                      </div>
                    </td>
                    <td>{kpi.baseline} {kpi.unit}</td>
                    <td style={{ fontWeight: 600 }}>{kpi.target} {kpi.unit}</td>
                    <td style={{ fontWeight: 800, fontSize: '14px', color: '#0f2b46' }}>
                      {res.actual !== null ? `${res.actual} ${kpi.unit}` : '—'}
                    </td>
                    <td>
                      {metrics.rawAchievement !== null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700 }}>{metrics.rawAchievement.toFixed(1)}%</span>
                          <RagBadge status={metrics.ragStatus} />
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={12} color="#2563eb" />
                        <span>{res.evidenceTitle || 'None attached'}</span>
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>
                      v{res.version}
                    </td>
                    <td>
                      <StatusBadge status={res.status} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {res.status === 'Submitted' && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApprove(res)}
                              title="Approve submission"
                            >
                              <CheckCircle2 size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setSelectedResult(res);
                                setIsReturnModalOpen(true);
                              }}
                              title="Return with feedback"
                            >
                              <RotateCcw size={12} />
                              <span>Return</span>
                            </button>
                          </>
                        )}

                        {res.status === 'Returned' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setSelectedResult(res);
                              setSubmitActual(res.actual || 25);
                              setIsSubmitModalOpen(true);
                            }}
                          >
                            <Send size={12} />
                            <span>Fix & Resubmit</span>
                          </button>
                        )}

                        {res.status === 'Approved' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedKpi(kpi)}
                          >
                            Inspect Audit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Return Performance Submission for Revision"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsReturnModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-danger" onClick={handleReturnSubmission}>
              Confirm Return
            </button>
          </>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
          Provide the operational reason for returning this submission. The contributor will be
          notified to amend their evidence or metric.
        </p>
        <div className="form-group">
          <label className="form-label">Reviewer Return Reason *</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Fix & Resubmit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Resubmit Corrected Performance Data"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleResubmit}>
              Submit Revision
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Verified Actual Value *</label>
          <input
            type="number"
            step="any"
            className="form-input"
            value={submitActual}
            onChange={(e) => setSubmitActual(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Updated Evidence Attachment Memo *</label>
          <input
            className="form-input"
            value={submitEvidenceTitle}
            onChange={(e) => setSubmitEvidenceTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Variance Analysis & Root Cause</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={submitVariance}
            onChange={(e) => setSubmitVariance(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
