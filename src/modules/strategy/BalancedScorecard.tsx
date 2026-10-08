import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StrategicObjective, KPI } from '../../types';
import { RagBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  calculateObjectiveScore,
  calculatePerspectiveScore,
  calculateKpiMetrics,
} from '../../services/calculationService';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Layers,
  Plus,
  Edit2,
  Search,
  MoreVertical,
  TrendingDown,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  LayoutDashboard,
  Table as TableIcon,
} from 'lucide-react';

export const BalancedScorecard: React.FC = () => {
  const {
    perspectives,
    objectives,
    themes,
    kpis,
    results,
    users,
    organizations,
    settings,
    addObjective,
    updateObjective,
    setSelectedObjective,
    setSelectedKpi,
    checkPermission,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'perspectives'>('summary');
  const [selectedObjId, setSelectedObjId] = useState<string>(objectives[0]?.id || 'OBJ-P01');
  const [objectiveSearch, setObjectiveSearch] = useState('');
  const [kpiSearch, setKpiSearch] = useState('');
  const [assessmentComment, setAssessmentComment] = useState('');
  const [commentsList, setCommentsList] = useState<string[]>([
    'Triage redesign initiative INI-001 underway to compress cycle time to under 20 days.',
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StrategicObjective | null>(null);

  const [formData, setFormData] = useState<StrategicObjective>({
    id: '',
    code: '',
    name: '',
    nameAr: '',
    perspectiveId: 'PER-02',
    themeId: 'THM-01',
    departmentId: 'ORG-03',
    contributingDepartmentIds: ['ORG-05'],
    ownerId: 'USR-04',
    ownerName: 'Fahad Al-Dosari',
    weight: 25,
    description: '',
    descriptionAr: '',
    planId: 'PLAN-01',
  });

  const canCreate = checkPermission('CREATE', 'bsc_objective').allowed;

  const selectedObj = objectives.find((o) => o.id === selectedObjId) || objectives[0];
  const selectedObjCalc = selectedObj
    ? calculateObjectiveScore(selectedObj, kpis, results, settings.activePeriod)
    : null;

  // Chart data matching Image 1 ("KPIS ACHIEVEMENT OVER THE PERIOD")
  const trendData = [
    { period: 'Jun', score: 98 },
    { period: 'Jul', score: 92 },
    { period: 'Aug', score: 90 },
    { period: 'Sep', score: 81 },
    { period: 'Oct', score: 82 },
    { period: 'Nov', score: 85 },
    { period: 'Dec', score: 88 },
  ];

  const handleAddComment = () => {
    if (!assessmentComment.trim()) return;
    setCommentsList([...commentsList, assessmentComment.trim()]);
    setAssessmentComment('');
  };

  const handleOpenCreate = (pId: string) => {
    setEditingObjective(null);
    setFormData({
      id: `OBJ-P${(objectives.length + 1).toString().padStart(2, '0')}`,
      code: `OBJ-P${(objectives.length + 1).toString().padStart(2, '0')}`,
      name: '',
      nameAr: '',
      perspectiveId: pId,
      themeId: themes[0].id,
      departmentId: organizations[2].id,
      contributingDepartmentIds: [],
      ownerId: users[3].id,
      ownerName: users[3].name,
      weight: 20,
      description: '',
      descriptionAr: '',
      planId: 'PLAN-01',
    });
    setIsModalOpen(true);
  };

  const filteredObjectives = objectives.filter(
    (o) =>
      o.name.toLowerCase().includes(objectiveSearch.toLowerCase()) ||
      o.code.toLowerCase().includes(objectiveSearch.toLowerCase())
  );

  const filteredKpis = kpis.filter(
    (k) =>
      k.name.toLowerCase().includes(kpiSearch.toLowerCase()) ||
      k.code.toLowerCase().includes(kpiSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and View Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f2b46', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0f766e' }}>AHDA Corporate Performance Summary</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Balanced Scorecard lifecycle • Performance achievement trends, related strategic objectives, and active KPIs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '6px', padding: '3px' }}>
            <button
              onClick={() => setActiveTab('summary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'summary' ? '#ffffff' : 'transparent',
                color: activeTab === 'summary' ? '#0f766e' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeTab === 'summary' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <LayoutDashboard size={13} />
              <span>Executive Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('perspectives')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'perspectives' ? '#ffffff' : 'transparent',
                color: activeTab === 'perspectives' ? '#0f766e' : '#64748b',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeTab === 'perspectives' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <TableIcon size={13} />
              <span>Perspectives Breakdown</span>
            </button>
          </div>

          {canCreate && (
            <button className="btn btn-primary btn-sm" onClick={() => handleOpenCreate('PER-01')}>
              <Plus size={14} />
              <span>Create Objective</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: PERFORMANCE SUMMARY (Matching Image 1) */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Trend Chart & Quick Statistics */}
          <div className="bsc-summary-top-grid">
            {/* Chart Card */}
            <div className="card" style={{ padding: '16px 20px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  KPIS ACHIEVEMENT OVER THE PERIOD
                </span>
                <MoreVertical size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
              </div>

              <div style={{ height: '170px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <YAxis domain={[75, 105]} ticks={[80, 90, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Achievement']}
                      contentStyle={{ background: '#0f2b46', color: '#ffffff', borderRadius: '4px', fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0060a9"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0f2b46', stroke: '#0060a9', strokeWidth: 1.5 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Statistics (2x2 Grid with Vertical Indicator Bars) */}
            <div className="card" style={{ padding: '16px 20px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  QUICK STATISTICS
                </span>
                <MoreVertical size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Tile 1 */}
                <div className="corp-stat-tile">
                  <div className="corp-stat-indicator red" />
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Overall Objectives</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '2px' }}>
                      84%
                    </div>
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="corp-stat-tile">
                  <div className="corp-stat-indicator amber" />
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Overall KPIs</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '2px' }}>
                      74%
                    </div>
                  </div>
                </div>

                {/* Tile 3 */}
                <div className="corp-stat-tile">
                  <div className="corp-stat-indicator red" />
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Overall Initiatives</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '2px' }}>
                      52%
                    </div>
                  </div>
                </div>

                {/* Tile 4 */}
                <div className="corp-stat-tile">
                  <div className="corp-stat-indicator red" />
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Risks Treated</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '2px' }}>
                      34%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Section: Tables on Left, Description on Right */}
          <div className="bsc-summary-main-grid">
            {/* Left Column: Related Objectives & Related KPIs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Related Objectives Card */}
              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    RELATED OBJECTIVES
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                      <Search size={13} style={{ color: '#64748b' }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={objectiveSearch}
                        onChange={(e) => setObjectiveSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', width: '90px' }}
                      />
                    </div>
                    <MoreVertical size={15} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                  </div>
                </div>

                <div className="table-container" style={{ border: 'none' }}>
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th style={{ textAlign: 'center' }}>PRIORITY</th>
                        <th style={{ textAlign: 'center' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredObjectives.map((obj) => {
                        const isSelected = obj.id === selectedObjId;
                        const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);
                        const statusDotColor =
                          calc.ragStatus === 'GREEN'
                            ? '#16a34a'
                            : calc.ragStatus === 'AMBER'
                            ? '#d97706'
                            : '#dc2626';

                        return (
                          <tr
                            key={obj.id}
                            onClick={() => setSelectedObjId(obj.id)}
                            style={{
                              backgroundColor: isSelected ? '#f0f7ff' : undefined,
                              cursor: 'pointer',
                              fontWeight: isSelected ? 700 : 500,
                            }}
                          >
                            <td style={{ color: isSelected ? '#0060a9' : '#0f2b46' }}>
                              {language === 'ar' ? obj.nameAr : obj.name}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusDotColor, display: 'inline-block' }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Related KPIs Card */}
              <div className="card">
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    RELATED KPIS
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                      <Search size={13} style={{ color: '#64748b' }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={kpiSearch}
                        onChange={(e) => setKpiSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', width: '90px' }}
                      />
                    </div>
                    <MoreVertical size={15} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                  </div>
                </div>

                <div className="table-container" style={{ border: 'none' }}>
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>RESPONSIBLE</th>
                        <th>ACTUAL</th>
                        <th style={{ textAlign: 'center' }}>PRIORITY</th>
                        <th style={{ textAlign: 'center' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKpis.map((kpi) => {
                        const res = results.find((r) => r.kpiId === kpi.id && r.period === settings.activePeriod);
                        const metrics = calculateKpiMetrics(kpi, res);
                        const statusDotColor =
                          metrics.ragStatus === 'GREEN'
                            ? '#16a34a'
                            : metrics.ragStatus === 'AMBER'
                            ? '#d97706'
                            : '#dc2626';

                        return (
                          <tr
                            key={kpi.id}
                            onClick={() => setSelectedKpi(kpi)}
                            style={{ cursor: 'pointer' }}
                            title="Click to view KPI details drawer"
                          >
                            <td style={{ fontWeight: 600, color: '#0f2b46' }}>
                              {kpi.name}
                            </td>
                            <td style={{ color: '#475569', fontSize: '12px' }}>
                              {users.find((u) => u.id === kpi.ownerId)?.name || 'Owner'}
                            </td>
                            <td style={{ fontWeight: 700, color: '#0f2b46' }}>
                              {res ? `${res.actual} ${kpi.unit}` : '—'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusDotColor, display: 'inline-block' }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: DESCRIPTION Panel (Image 1) */}
            <div className="card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  DESCRIPTION
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Edit2 size={14} style={{ color: '#64748b', cursor: 'pointer' }} />
                  <MoreVertical size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                </div>
              </div>

              {selectedObj && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
                  {/* Name */}
                  <div>
                    <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>NAME</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0060a9', marginTop: '2px' }}>
                      {selectedObj.name}
                    </div>
                  </div>

                  {/* Priority & Status */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>PRIORITY</div>
                      <div style={{ fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>High</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>STATUS</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: selectedObjCalc?.ragStatus === 'GREEN' ? '#16a34a' : selectedObjCalc?.ragStatus === 'AMBER' ? '#d97706' : '#dc2626',
                          }}
                        />
                        <span style={{ fontWeight: 700 }}>
                          {selectedObjCalc?.ragStatus || 'RED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trend & Weight */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>TREND</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>
                        <TrendingDown size={14} />
                        <span>Down</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>WEIGHT</div>
                      <div style={{ fontWeight: 700, color: '#0f2b46', marginTop: '2px' }}>
                        {selectedObj.weight.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Audit Metadata */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>MODIFIED BY</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                        Administrator
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>LAST MODIFIED</div>
                    <div style={{ color: '#475569', marginTop: '2px', fontSize: '11px' }}>
                      Oct 8, 2026, 1:32:33 PM
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>CREATED BY</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                        Administrator
                      </span>
                    </div>
                  </div>

                  {/* Key Assessment Section (Collapsible in Image 1) */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f2b46', textTransform: 'uppercase' }}>
                        KEY ASSESSMENT
                      </span>
                      <Plus size={14} style={{ color: '#0060a9', cursor: 'pointer' }} />
                    </div>

                    {/* Existing Comments */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                      {commentsList.map((c, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', fontSize: '11px', color: '#334155', borderInlineStart: '3px solid #0060a9' }}>
                          {c}
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <textarea
                        rows={2}
                        placeholder="Add a comment..."
                        value={assessmentComment}
                        onChange={(e) => setAssessmentComment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '11px',
                          resize: 'none',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={handleAddComment}
                        className="btn btn-secondary btn-sm"
                        style={{ alignSelf: 'flex-end', fontSize: '11px', padding: '3px 8px' }}
                      >
                        <MessageSquare size={12} />
                        <span>Add Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PERSPECTIVE TABLE (Detailed breakdown) */}
      {activeTab === 'perspectives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {perspectives.map((p) => {
            const pObjectives = objectives.filter((o) => o.perspectiveId === p.id);
            const pScore = calculatePerspectiveScore(p.id, objectives, kpis, results, settings.activePeriod);

            return (
              <div key={p.id} className="card">
                <div
                  className="card-header"
                  style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '14px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        backgroundColor: p.color,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f2b46' }}>
                        {language === 'ar' ? p.nameAr : p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {language === 'ar' ? p.descriptionAr : p.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Perspective Score</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f2b46' }}>
                        {pScore.score !== null ? `${pScore.score.toFixed(1)}%` : '—'}
                      </div>
                    </div>
                    <RagBadge status={pScore.ragStatus} />
                    {canCreate && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenCreate(p.id)}
                        title="Add objective to this perspective"
                      >
                        <Plus size={12} />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="table-container" style={{ border: 'none' }}>
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th style={{ width: '100px' }}>Code</th>
                        <th>Strategic Objective</th>
                        <th>Theme</th>
                        <th>Accountable Owner</th>
                        <th>Weight</th>
                        <th>KPIs</th>
                        <th>Calculated Score</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Inspect</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pObjectives.map((obj) => {
                        const thm = themes.find((t) => t.id === obj.themeId);
                        const calc = calculateObjectiveScore(obj, kpis, results, settings.activePeriod);

                        return (
                          <tr key={obj.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedObjective(obj)}>
                            <td style={{ fontWeight: 700, color: '#0060a9' }}>{obj.code}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                                {language === 'ar' ? obj.nameAr : obj.name}
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '11px', color: '#475569' }}>
                                {thm ? (language === 'ar' ? thm.nameAr : thm.name) : '—'}
                              </span>
                            </td>
                            <td style={{ fontSize: '12px' }}>{obj.ownerName}</td>
                            <td style={{ fontWeight: 600 }}>{obj.weight}%</td>
                            <td>{calc.kpiCount} KPIs</td>
                            <td style={{ fontWeight: 800, color: '#0f2b46' }}>
                              {calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}
                            </td>
                            <td>
                              <RagBadge status={calc.ragStatus} />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '2px 8px', fontSize: '11px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedObjective(obj);
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
