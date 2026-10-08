import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/Badge';
import { AlertTriangle, CheckCircle, FileText, Calendar } from 'lucide-react';

export const ActionDrawer: React.FC = () => {
  const { selectedAction, setSelectedAction, updateAction, language, kpis, initiatives, setSelectedKpi, setSelectedInitiative } = useApp();

  if (!selectedAction) return null;

  const act = selectedAction;
  const linkedKpi = kpis.find((k) => k.id === act.kpiId);
  const linkedIni = initiatives.find((i) => i.id === act.initiativeId);

  const handleStatusChange = (newStatus: any) => {
    const updated = { ...act, status: newStatus };
    updateAction(updated);
    setSelectedAction(updated);
  };

  return (
    <Drawer
      isOpen={!!selectedAction}
      onClose={() => setSelectedAction(null)}
      title={`${act.code}: ${act.title}`}
      subtitle="Corrective Action Exception Response & Effectiveness Tracking"
      width="580px"
    >
      {/* Top Banner */}
      <div
        style={{
          background: act.status === 'Overdue' ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' : 'linear-gradient(135deg, #0f2b46, #16426f)',
          padding: '16px 20px',
          borderRadius: '8px',
          color: '#ffffff',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#fca5a5', textTransform: 'uppercase' }}>
              Action Status
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '2px' }}>
              {act.status}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Due Date</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fef08a', marginTop: '2px' }}>
              {act.dueDate}
            </div>
          </div>
        </div>

        {act.status === 'Overdue' && (
          <div style={{ marginTop: '10px', padding: '6px 10px', background: 'rgba(0,0,0,0.25)', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="#f87171" />
            <span>Overdue exception flagged to Director General & Executive Dashboard</span>
          </div>
        )}
      </div>

      {/* Status Transition Control */}
      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Workflow Status:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Open', 'In Progress', 'Pending Review', 'Closed'] as const).map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${act.status === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleStatusChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Problem & Root Cause */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '6px', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
            Triggering Problem Statement
          </div>
          <p style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '6px', lineHeight: 1.5 }}>
            {act.problem}
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Diagnosed Root Cause
          </div>
          <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: 1.5 }}>
            {act.rootCause}
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Expected Effect & Recovery Plan
          </div>
          <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: 1.5 }}>
            {act.expectedEffect}
          </p>
        </div>

        {/* Linked Records */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {linkedKpi && (
            <div
              style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => setSelectedKpi(linkedKpi)}
            >
              <div style={{ fontSize: '10px', color: '#64748b' }}>Linked Deficient KPI</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', marginTop: '2px' }}>
                {linkedKpi.code}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {linkedKpi.name}
              </div>
            </div>
          )}

          {linkedIni && (
            <div
              style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
              onClick={() => setSelectedInitiative(linkedIni)}
            >
              <div style={{ fontSize: '10px', color: '#64748b' }}>Linked Strategic Initiative</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', marginTop: '2px' }}>
                {linkedIni.code}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {linkedIni.name}
              </div>
            </div>
          )}
        </div>

        {/* Important Rule Notice */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#475569',
            lineHeight: 1.5,
          }}
        >
          <strong>Methodological Rule:</strong> Closing a corrective action does NOT automatically artificially improve the KPI score. Effectiveness is demonstrated exclusively through future verified and approved quarterly results.
        </div>
      </div>
    </Drawer>
  );
};
