import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DepartmentAlignment } from '../../types';
import { Workflow, Plus, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const DepartmentCascade: React.FC = () => {
  const { alignments, objectives, organizations, kpis, setSelectedObjective, setSelectedKpi, language, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('department_scorecards')} (Corporate-to-Department Strategic Cascade)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Vertical and cross-functional alignment linking corporate strategic objectives to operational department scorecards.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} />
          <span>Add Alignment Link</span>
        </button>
      </div>

      {/* Alignment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alignments.map((alg) => {
          const corpObj = objectives.find((o) => o.id === alg.corporateObjectiveId);
          const dept = organizations.find((o) => o.id === alg.departmentId);

          return (
            <div key={alg.id} className="card">
              <div
                className="card-header"
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '12px 18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Workflow size={16} color="#2563eb" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                    {dept ? dept.name : alg.departmentId}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: alg.contributionType === 'Direct Contribution' ? '#dcfce7' : '#eff6ff',
                      color: alg.contributionType === 'Direct Contribution' ? '#15803d' : '#1d4ed8',
                      fontWeight: 600,
                    }}
                  >
                    {alg.contributionType}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {/* Visual Cascade Chain */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    overflowX: 'auto',
                  }}
                >
                  {/* Step 1: Corporate Objective */}
                  <div
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                    }}
                    onClick={() => corpObj && setSelectedObjective(corpObj)}
                  >
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Corporate Strategic Objective
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginTop: '2px' }}>
                      {corpObj ? `${corpObj.code}: ${corpObj.name}` : alg.corporateObjectiveId}
                    </div>
                  </div>

                  <ArrowRight size={18} color="#94a3b8" />

                  {/* Step 2: Department Objective */}
                  <div
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Department Operational Objective
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>
                      {language === 'ar' ? alg.departmentObjectiveNameAr : alg.departmentObjectiveName}
                    </div>
                  </div>

                  <ArrowRight size={18} color="#94a3b8" />

                  {/* Step 3: Linked KPIs */}
                  <div
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Accountable Operational KPIs
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {alg.kpiIds.map((kid) => {
                        const k = kpis.find((x) => x.id === kid);
                        return (
                          <span
                            key={kid}
                            onClick={() => k && setSelectedKpi(k)}
                            style={{
                              padding: '2px 8px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            {k ? k.code : kid}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                  <strong>Operational Notes: </strong> {alg.notes}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Strategic Alignment Linkage"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569' }}>
          Demonstration notice: Standard alignments between Service Delivery Department and Corporate
          Objective OBJ-P01 are pre-configured. Direct roll-up safeguards prevent double-counting.
        </p>
      </Modal>
    </div>
  );
};
