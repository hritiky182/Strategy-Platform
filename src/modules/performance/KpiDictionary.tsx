import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KPI } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { BookMarked, Plus, Search, Edit2, Filter } from 'lucide-react';

export const KpiDictionary: React.FC = () => {
  const { kpis, addKpi, updateKpi, objectives, users, setSelectedKpi, checkPermission, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [objectiveFilter, setObjectiveFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);

  const [formData, setFormData] = useState<KPI>({
    id: '',
    code: '',
    name: '',
    nameAr: '',
    objectiveId: 'OBJ-P01',
    departmentId: 'ORG-03',
    definition: '',
    definitionAr: '',
    unit: '%',
    formula: '(actual / target) * 100',
    direction: 'higher',
    baseline: 0,
    baselineDate: '2026-12-31',
    target: 100,
    weight: 50,
    frequency: 'Quarterly',
    source: '',
    ownerId: 'USR-04',
    updaterId: 'USR-05',
    reviewerId: 'USR-06',
    aggregationMethod: 'Average',
    thresholds: { green: 100, amber: 90 },
    evidenceRequirement: '',
    version: 'v1.0',
    status: 'active',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const canEdit = checkPermission('EDIT', 'kpi_definition').allowed;

  const filteredKpis = useMemo(() => {
    return kpis.filter((k) => {
      const matchSearch =
        k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchObj = objectiveFilter === 'ALL' || k.objectiveId === objectiveFilter;
      const matchDir = directionFilter === 'ALL' || k.direction === directionFilter;
      return matchSearch && matchObj && matchDir;
    });
  }, [kpis, searchQuery, objectiveFilter, directionFilter]);

  const handleOpenCreate = () => {
    setEditingKpi(null);
    setFormData({
      id: `KPI-P${(kpis.length + 1).toString().padStart(2, '0')}`,
      code: `KPI-P${(kpis.length + 1).toString().padStart(2, '0')}`,
      name: '',
      nameAr: '',
      objectiveId: objectives[0]?.id || 'OBJ-P01',
      departmentId: 'ORG-03',
      definition: '',
      definitionAr: '',
      unit: '%',
      formula: '(actual / target) * 100',
      direction: 'higher',
      baseline: 0,
      baselineDate: '2026-12-31',
      target: 90,
      weight: 50,
      frequency: 'Quarterly',
      source: 'AHDA Enterprise Data Store',
      ownerId: users[3]?.id || '',
      updaterId: users[4]?.id || '',
      reviewerId: users[5]?.id || '',
      aggregationMethod: 'Average',
      thresholds: { green: 100, amber: 90 },
      evidenceRequirement: 'Official verification audit report.',
      version: 'v1.0',
      status: 'active',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kpi: KPI) => {
    setEditingKpi(kpi);
    setFormData(kpi);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('KPI Code and Name are mandatory.');
      return;
    }

    if (formData.unit === '%' && (formData.target > 100 || formData.target < 0)) {
      setFormError('Percentage target must be within 0% to 100%.');
      return;
    }

    if (editingKpi) {
      updateKpi(formData);
    } else {
      addKpi(formData);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('kpi_dictionary')} (Strategic Indicator Registry)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Catalog of standardized metrics, calculation formulas, directional polarities, and governance roles.
          </p>
        </div>

        {canEdit && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={15} />
            <span>Register New KPI</span>
          </button>
        )}
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="form-select"
              style={{ width: '220px', fontSize: '12px' }}
              value={objectiveFilter}
              onChange={(e) => setObjectiveFilter(e.target.value)}
            >
              <option value="ALL">All Objectives</option>
              {objectives.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.code}: {o.name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: '160px', fontSize: '12px' }}
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
            >
              <option value="ALL">All Directions</option>
              <option value="higher">Higher is Better</option>
              <option value="lower">Lower is Better</option>
            </select>
          </div>
        </div>

        {/* KPI Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Code</th>
                <th>Indicator Name</th>
                <th>Linked Objective</th>
                <th>Direction</th>
                <th>Baseline</th>
                <th>Approved Target</th>
                <th>Weight</th>
                <th>Frequency</th>
                <th>Version</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKpis.map((kpi) => {
                const obj = objectives.find((o) => o.id === kpi.objectiveId);
                return (
                  <tr key={kpi.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedKpi(kpi)}>
                    <td style={{ fontWeight: 700, color: '#1e40af' }}>{kpi.code}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' ? kpi.nameAr : kpi.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Formula: <code>{kpi.formula}</code>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#1e40af', fontWeight: 500 }}>
                      {obj ? obj.code : kpi.objectiveId}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: kpi.direction === 'lower' ? '#fef3c7' : '#eff6ff',
                          color: kpi.direction === 'lower' ? '#b45309' : '#1d4ed8',
                        }}
                      >
                        {kpi.direction === 'lower' ? 'Lower is better' : 'Higher is better'}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>
                      {kpi.baseline} {kpi.unit}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f2b46' }}>
                      {kpi.target} {kpi.unit}
                    </td>
                    <td>{kpi.weight}%</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{kpi.frequency}</td>
                    <td style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>{kpi.version}</td>
                    <td>
                      <StatusBadge status={kpi.status} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {canEdit && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(kpi);
                          }}
                          title="Edit KPI"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingKpi ? `Edit Indicator: ${editingKpi.code}` : 'Register New KPI'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingKpi ? 'Save Updates' : 'Register KPI'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '6px', fontSize: '12px', marginBottom: '14px' }}>
              {formError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">KPI Code *</label>
              <input
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="KPI-P01"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Indicator Name (EN) *</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Indicator Name (AR)</label>
            <input
              className="form-input"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Parent Strategic Objective *</label>
              <select
                className="form-select"
                value={formData.objectiveId}
                onChange={(e) => setFormData({ ...formData, objectiveId: e.target.value })}
              >
                {objectives.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.code}: {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Directional Polarity</label>
              <select
                className="form-select"
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value as any })}
              >
                <option value="higher">Higher is Better (actual / target)</option>
                <option value="lower">Lower is Better (target / actual)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Measurement Unit</label>
              <input
                className="form-input"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="days, %, SAR"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Approved Target *</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Weight in Objective (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="form-input"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Evidence & Audit Requirement</label>
            <input
              className="form-input"
              value={formData.evidenceRequirement}
              onChange={(e) => setFormData({ ...formData, evidenceRequirement: e.target.value })}
              placeholder="e.g. Certified quarterly case processing audit extract"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
