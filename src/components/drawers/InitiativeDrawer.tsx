import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { StatusBadge } from '../common/Badge';
import { CheckCircle2, Clock, DollarSign } from 'lucide-react';

export const InitiativeDrawer: React.FC = () => {
  const { selectedInitiative, setSelectedInitiative, updateInitiative, language, users, kpis } = useApp();

  if (!selectedInitiative) return null;

  const ini = selectedInitiative;
  const sponsor = users.find((u) => u.id === ini.sponsorId);
  const owner = users.find((u) => u.id === ini.ownerId);

  const toggleMilestone = (milestoneId: string) => {
    const updatedMilestones = ini.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    // Calculate updated progress from completed milestone weights
    const totalWeight = updatedMilestones.reduce((acc, m) => acc + m.weight, 0);
    const completedWeight = updatedMilestones
      .filter((m) => m.completed)
      .reduce((acc, m) => acc + m.weight, 0);

    const calculatedProgress =
      totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : ini.progress;

    const updated = {
      ...ini,
      milestones: updatedMilestones,
      progress: calculatedProgress,
      status: (calculatedProgress === 100 ? 'Completed' : 'In Progress') as any,
    };

    updateInitiative(updated);
    setSelectedInitiative(updated);
  };

  return (
    <Drawer
      isOpen={!!selectedInitiative}
      onClose={() => setSelectedInitiative(null)}
      title={`${ini.code}: ${language === 'ar' ? ini.nameAr : ini.name}`}
      subtitle="Strategic Initiative Execution & Milestone Tracking"
      width="580px"
    >
      {/* Top Progress & Budget Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f2b46, #16426f)',
          padding: '16px 20px',
          borderRadius: '8px',
          color: '#ffffff',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase' }}>
              Execution Progress
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '2px' }}>
              {ini.progress}%
            </div>
          </div>
          <div>
            <StatusBadge status={ini.status} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginTop: '12px' }}>
          <div
            style={{
              height: '100%',
              width: `${ini.progress}%`,
              background: '#38bdf8',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#cbd5e1' }}>Approved Budget: </span>
            <strong>{ini.budget.toLocaleString()} SAR</strong>
          </div>
          <div>
            <span style={{ color: '#cbd5e1' }}>Actual Spend: </span>
            <strong>{ini.actualCost.toLocaleString()} SAR</strong>
          </div>
        </div>
      </div>

      {/* Description & Scope */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Initiative Charter & Scope
          </div>
          <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: 1.6 }}>
            {ini.description}
          </p>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', padding: '8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <strong>Expected Outcomes: </strong> {ini.expectedOutcomes}
          </div>
        </div>

        {/* Governance */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ padding: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Executive Sponsor</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '2px' }}>
              {sponsor ? sponsor.name : 'Unassigned'}
            </div>
          </div>
          <div style={{ padding: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Program Manager / Owner</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46', marginTop: '2px' }}>
              {owner ? owner.name : 'Unassigned'}
            </div>
          </div>
        </div>

        {/* Milestones Checklist */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
              Key Milestones ({ini.milestones.filter((m) => m.completed).length} of {ini.milestones.length} Completed)
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Click checkbox to toggle update</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ini.milestones.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: m.completed ? '#f0fdf4' : '#ffffff',
                  border: m.completed ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => toggleMilestone(m.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => {}} // handled by div
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: m.completed ? '#166534' : '#1e293b',
                      textDecoration: m.completed ? 'line-through' : 'none',
                    }}
                  >
                    {language === 'ar' ? m.nameAr : m.name}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Due: {m.dueDate} ({m.weight}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefit KPIs */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Targeted Strategic KPIs:</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {ini.benefitKpiIds.map((kpiId) => {
              const k = kpis.find((x) => x.id === kpiId);
              return (
                <span
                  key={kpiId}
                  style={{
                    padding: '4px 10px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#1d4ed8',
                    fontWeight: 600,
                  }}
                >
                  {k ? `${k.code}: ${k.name}` : kpiId}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
