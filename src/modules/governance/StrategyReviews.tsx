import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StrategyReviewMeeting } from '../../types';
import { Modal } from '../../components/common/Modal';
import { History, Plus, CheckCircle2, Lock, Users, Calendar, AlertTriangle } from 'lucide-react';

export const StrategyReviews: React.FC = () => {
  const { reviews, updateReview, reports, language, t, showToast } = useApp();

  const [activeReview, setActiveReview] = useState<StrategyReviewMeeting>(reviews[0]);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [newDecisionText, setNewDecisionText] = useState('');

  const frozenReport = reports.find((r) => r.id === activeReview.frozenReportId);

  const handleAddDecision = () => {
    if (!newDecisionText.trim()) return;

    const newDecision = {
      id: `DEC-${Date.now().toString().slice(-4)}`,
      decision: newDecisionText,
      decisionAr: newDecisionText,
      ownerId: 'USR-02',
      dueDate: '2027-05-01',
      status: 'Decided' as const,
    };

    const updated = {
      ...activeReview,
      decisions: [...activeReview.decisions, newDecision],
    };

    updateReview(updated);
    setActiveReview(updated);
    setNewDecisionText('');
    setIsDecisionModalOpen(false);
    showToast('Executive decision recorded into meeting minutes.', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('strategy_reviews')} (Executive Performance Review Meetings)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Quarterly leadership sessions evaluating scorecard exceptions, ratifying decisions, and freezing historical baselines.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsDecisionModalOpen(true)}>
          <Plus size={15} />
          <span>Record Executive Decision</span>
        </button>
      </div>

      {/* Review Meeting Dossier */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <History size={16} />
            <span>{activeReview.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
            <Calendar size={14} />
            <span>Date: {activeReview.date} ({activeReview.period})</span>
          </div>
        </div>

        <div className="card-body">
          {/* Frozen Report Status Banner */}
          {frozenReport && (
            <div
              style={{
                padding: '12px 18px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={18} color="#1d4ed8" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                    Historical Report Frozen: {frozenReport.code}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Frozen at Q1 closure (84.0% Overall Score). Immutable snapshot preserved for auditability.
                  </div>
                </div>
              </div>

              <span
                style={{
                  padding: '4px 10px',
                  background: '#1e40af',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                }}
              >
                Frozen Baseline
              </span>
            </div>
          )}

          {/* Agenda & Attendees */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0f2b46', textTransform: 'uppercase' }}>
                Meeting Agenda Items:
              </strong>
              <ul style={{ fontSize: '12px', color: '#334155', marginTop: '8px', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeReview.agenda.map((ag, idx) => (
                  <li key={idx}>{ag}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0f2b46', textTransform: 'uppercase' }}>
                Executive Participants:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {activeReview.participants.map((p, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#0f2b46',
                      fontWeight: 500,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Exceptions Discussed */}
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ fontSize: '12px', color: '#991b1b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} />
              <span>Performance Exceptions Evaluated:</span>
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {activeReview.exceptionsDiscussed.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    background: '#fff1f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#991b1b',
                  }}
                >
                  • {ex}
                </div>
              ))}
            </div>
          </div>

          {/* Official Decisions Log */}
          <div>
            <strong style={{ fontSize: '12px', color: '#0f2b46', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#16a34a" />
              <span>Ratified Executive Decisions:</span>
            </strong>
            <div className="table-container" style={{ marginTop: '8px' }}>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Decision ID</th>
                    <th>Executive Resolution</th>
                    <th>Accountable Owner</th>
                    <th>Target Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReview.decisions.map((dec) => (
                    <tr key={dec.id}>
                      <td style={{ fontWeight: 700, color: '#1e40af' }}>{dec.id}</td>
                      <td style={{ fontWeight: 500 }}>{dec.decision}</td>
                      <td>Director General / Director</td>
                      <td>{dec.dueDate}</td>
                      <td>
                        <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          {dec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Record Decision Modal */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title="Record Executive Meeting Resolution"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDecisionModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleAddDecision}>
              Record Decision
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Decision Summary *</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={newDecisionText}
            onChange={(e) => setNewDecisionText(e.target.value)}
            placeholder="e.g. Continue priority monitoring of case triage redesign..."
            required
          />
        </div>
      </Modal>
    </div>
  );
};
