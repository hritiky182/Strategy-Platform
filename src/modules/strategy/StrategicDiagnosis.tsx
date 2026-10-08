import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiagnosisItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Search, Plus, MoreVertical, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const StrategicDiagnosis: React.FC = () => {
  const { diagnosis, addDiagnosis, checkPermission, language, t } = useApp();

  const [activeTab, setActiveTab] = useState<'SWOT' | 'PEST'>('SWOT');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DiagnosisItem | null>(null);

  // Search terms for each quadrant table
  const [searchS, setSearchS] = useState('');
  const [searchW, setSearchW] = useState('');
  const [searchO, setSearchO] = useState('');
  const [searchT, setSearchT] = useState('');

  const [formData, setFormData] = useState<DiagnosisItem>({
    id: '',
    type: 'SWOT_W',
    finding: '',
    findingAr: '',
    method: 'Operational Audit & Stakeholder Interviews',
    source: 'AHDA Strategy Diagnostic Report 2026',
    date: '2026-11-20',
    confidence: 'High',
    owner: 'Saad Al-Otaibi',
    reviewer: 'Dr. Tariq Al-Mansoor',
    relatedStrategicIssue: 'Service Transformation',
    linkedThemeId: 'THM-01',
    evidenceRecord: 'DOC-DIAG-2026-120.pdf',
    comments: '',
  });

  const canCreate = checkPermission('CREATE', 'diagnosis').allowed;

  const handleOpenAdd = (type: DiagnosisItem['type']) => {
    setFormData({
      id: `DIAG-${Date.now().toString().slice(-4)}`,
      type,
      finding: '',
      findingAr: '',
      method: 'Operational Audit & Stakeholder Interviews',
      source: 'AHDA Internal Strategy Diagnostic Report 2026',
      date: '2026-11-20',
      confidence: 'High',
      owner: 'Saad Al-Otaibi',
      reviewer: 'Dr. Tariq Al-Mansoor',
      relatedStrategicIssue: 'Service Transformation',
      linkedThemeId: 'THM-01',
      evidenceRecord: 'DOC-DIAG-2026-120.pdf',
      comments: '',
    });
    setIsModalOpen(true);
  };

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.finding.trim()) return;
    addDiagnosis(formData);
    setIsModalOpen(false);
  };

  // SWOT Items
  const strengths = diagnosis.filter((d) => d.type === 'SWOT_S');
  const weaknesses = diagnosis.filter((d) => d.type === 'SWOT_W');
  const opportunities = diagnosis.filter((d) => d.type === 'SWOT_O');
  const threats = diagnosis.filter((d) => d.type === 'SWOT_T');

  const swotCategories = [
    {
      type: 'SWOT_S' as const,
      letter: 'S',
      title: 'STRENGTHS',
      titleAr: 'نقاط القوة',
      letterClass: 'corp-swot-letter-blue',
      description:
        'SWOT analysis are the attributes within an organization that are considered to be necessary for the ultimate success of the business. Strengths are resources and capabilities that can be used for competitive advantage.',
      items: strengths,
      search: searchS,
      setSearch: setSearchS,
      statusDot: '#16a34a',
      counts: [
        { month: 'Sep', count: 5 },
        { month: 'Oct', count: 6 },
        { month: 'Nov', count: 7 },
        { month: 'Dec', count: 10 },
      ],
    },
    {
      type: 'SWOT_W' as const,
      letter: 'W',
      title: 'WEAKNESSES',
      titleAr: 'نقاط الضعف',
      letterClass: 'corp-swot-letter-dark',
      description:
        'The factors that could prevent successful results of the business are Weaknesses. It stops an organization from performing at its optimum level.',
      items: weaknesses,
      search: searchW,
      setSearch: setSearchW,
      statusDot: '#dc2626',
      counts: [
        { month: 'Sep', count: 5 },
        { month: 'Oct', count: 6 },
        { month: 'Nov', count: 7 },
        { month: 'Dec', count: 10 },
      ],
    },
    {
      type: 'SWOT_O' as const,
      letter: 'O',
      title: 'OPPORTUNITIES',
      titleAr: 'الفرص المتاحة',
      letterClass: 'corp-swot-letter-blue',
      description:
        'External factors in the business environment that the organization could exploit to its advantage to accelerate growth and strategic transformation.',
      items: opportunities,
      search: searchO,
      setSearch: setSearchO,
      statusDot: '#16a34a',
      counts: [
        { month: 'Sep', count: 4 },
        { month: 'Oct', count: 5 },
        { month: 'Nov', count: 8 },
        { month: 'Dec', count: 9 },
      ],
    },
    {
      type: 'SWOT_T' as const,
      letter: 'T',
      title: 'THREATS',
      titleAr: 'التهديدات والمخاطر',
      letterClass: 'corp-swot-letter-dark',
      description:
        'External factors that could jeopardize the business or project. Identifying threats allows leadership to build resilience and proactive risk management.',
      items: threats,
      search: searchT,
      setSearch: setSearchT,
      statusDot: '#d97706',
      counts: [
        { month: 'Sep', count: 3 },
        { month: 'Oct', count: 4 },
        { month: 'Nov', count: 6 },
        { month: 'Dec', count: 8 },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title & Tab Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f2b46', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0f766e' }}>AHDA</span> Strategic Diagnosis (SWOT & PESTEL)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Diagnostic assessment linking environmental factors and evidence to strategic priorities and Service Transformation.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '6px', padding: '3px' }}>
          <button
            onClick={() => setActiveTab('SWOT')}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'SWOT' ? '#0f766e' : 'transparent',
              color: activeTab === 'SWOT' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            SWOT Analysis
          </button>
          <button
            onClick={() => setActiveTab('PEST')}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === 'PEST' ? '#0f766e' : 'transparent',
              color: activeTab === 'PEST' ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            PESTEL Drivers
          </button>
        </div>
      </div>

      {/* SWOT LAYOUT (Exact Corporater Pattern from Image 3) */}
      {activeTab === 'SWOT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {swotCategories.map((cat) => {
            const filteredItems = cat.items.filter((it) =>
              (it.finding || '').toLowerCase().includes(cat.search.toLowerCase())
            );

            return (
              <div key={cat.title} className="corp-swot-row">
                {/* Column 1: Big Letter Tile & Description */}
                <div className="corp-swot-letter-card">
                  <div className={`corp-swot-big-letter ${cat.letterClass}`}>
                    {cat.letter}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f2b46', letterSpacing: '0.5px' }}>
                      {language === 'ar' ? cat.titleAr : cat.title}
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Column 2: Searchable Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Table Search Input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 12px' }}>
                    <Search size={14} style={{ color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search table..."
                      value={cat.search}
                      onChange={(e) => cat.setSearch(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
                    />
                    {canCreate && (
                      <button
                        onClick={() => handleOpenAdd(cat.type)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0060a9', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                        title="Add finding"
                      >
                        <Plus size={13} />
                        <span>Add</span>
                      </button>
                    )}
                  </div>

                  {/* Findings Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <table className="enterprise-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th style={{ textAlign: 'center', width: '80px' }}>STATUS</th>
                          <th style={{ textAlign: 'center', width: '40px' }} />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            style={{ cursor: 'pointer' }}
                            title="Click to view diagnostic evidence detail"
                          >
                            <td style={{ fontWeight: 600, color: '#0f2b46', fontSize: '12px' }}>
                              {language === 'ar' ? item.findingAr || item.finding : item.finding}
                              {item.relatedStrategicIssue && (
                                <div style={{ fontSize: '11px', color: '#0060a9', fontWeight: 500, marginTop: '2px' }}>
                                  → Linked Issue: {item.relatedStrategicIssue}
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: cat.statusDot,
                                  display: 'inline-block',
                                }}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <MoreVertical size={14} style={{ color: '#94a3b8' }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Column 3: IDENTIFIED Distribution Mini Chart */}
                <div style={{ borderInlineStart: '1px solid #e2e8f0', paddingInlineStart: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
                    IDENTIFIED
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cat.counts.map((c) => (
                      <div key={c.month} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                        <span style={{ width: '28px', color: '#64748b', fontWeight: 600 }}>{c.month}</span>
                        <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${(c.count / 12) * 100}%`,
                              height: '100%',
                              backgroundColor: '#475569',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                        <span style={{ width: '16px', textAlign: 'right', fontWeight: 700, color: '#0f2b46' }}>{c.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Horizontal Axis Ticks */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '9px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PEST ANALYSIS TAB */}
      {activeTab === 'PEST' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f2b46', marginBottom: '14px' }}>
            PESTEL Macro-Environmental Landscape for AHDA
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { code: 'POL', title: 'Political & Mandate', desc: 'Saudi Vision 2030 regional authority mandates and municipal governance standards.' },
              { code: 'ECO', title: 'Economic Drivers', desc: 'Al Ahsa agricultural oasis economy, cultural tourism, and regional private investments.' },
              { code: 'SOC', title: 'Social & Cultural', desc: 'Civic engagement, citizen satisfaction expectations, and heritage preservation.' },
              { code: 'TEC', title: 'Technological', desc: 'Accelerated digital case handling, automated permits, and central integration buses.' },
              { code: 'ENV', title: 'Environmental', desc: 'Oasis water conservation, sustainable urban development, and microclimate protection.' },
              { code: 'LEG', title: 'Legal & Regulatory', desc: 'Urban zoning regulations, public sector performance compliance, and audit requirements.' },
            ].map((p) => (
              <div key={p.code} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', background: '#f8fafc' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#0060a9', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                  {p.code}
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '8px' }}>{p.title}</div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Details Inspection Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Diagnostic Finding: ${selectedItem.finding.slice(0, 50)}...`}
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedItem(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>FINDING</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginTop: '4px' }}>
                {selectedItem.finding}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SOURCE EVIDENCE</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0060a9', marginTop: '2px' }}>
                  {selectedItem.source}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>LINKED STRATEGIC ISSUE</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>
                  {selectedItem.relatedStrategicIssue || 'None'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ASSESSED BY</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>{selectedItem.owner}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CONFIDENCE LEVEL</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                  {selectedItem.confidence}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Diagnostic Evidence Finding"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateFinding}>
              Save Finding
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="form-label">Finding Description (English)</label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.finding}
              onChange={(e) => setFormData({ ...formData, finding: e.target.value })}
              placeholder="e.g. Slow service delivery due to manual paper approvals..."
            />
          </div>
          <div>
            <label className="form-label">Evidence Source & Document</label>
            <input
              className="form-control"
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Linked Strategic Issue</label>
            <input
              className="form-control"
              type="text"
              value={formData.relatedStrategicIssue}
              onChange={(e) => setFormData({ ...formData, relatedStrategicIssue: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
