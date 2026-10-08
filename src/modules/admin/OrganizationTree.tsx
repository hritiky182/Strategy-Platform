import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrganizationUnit } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Network, Plus, Edit2, ChevronRight, Users, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';

export const OrganizationTree: React.FC = () => {
  const { organizations, users, addOrganization, updateOrganization, checkPermission, language, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationUnit | null>(null);

  const [formData, setFormData] = useState<OrganizationUnit>({
    id: '',
    code: '',
    name: '',
    nameAr: '',
    parentId: null,
    managerId: 'USR-04',
    managerName: 'Fahad Al-Dosari',
    status: 'active',
    order: 1,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const canAdminister = checkPermission('ADMINISTER', 'org_admin').allowed;

  const handleOpenCreate = (parentId: string | null = null) => {
    setEditingOrg(null);
    setFormData({
      id: `ORG-${(organizations.length + 1).toString().padStart(2, '0')}`,
      code: '',
      name: '',
      nameAr: '',
      parentId,
      managerId: users[0]?.id || '',
      managerName: users[0]?.name || '',
      status: 'active',
      order: organizations.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (org: OrganizationUnit) => {
    setEditingOrg(org);
    setFormData(org);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.code.trim() || !formData.name.trim()) {
      setFormError('Code and unit name are mandatory.');
      return;
    }

    // Check duplicate code
    const duplicate = organizations.find(
      (o) => o.code.toUpperCase() === formData.code.toUpperCase() && o.id !== formData.id
    );
    if (duplicate) {
      setFormError(`Unit code "${formData.code}" is already in use by "${duplicate.name}".`);
      return;
    }

    // Circular check: cannot be own parent
    if (formData.parentId === formData.id) {
      setFormError('Circular hierarchy error: An organization unit cannot be its own parent.');
      return;
    }

    const selectedManager = users.find((u) => u.id === formData.managerId);
    const finalOrg = {
      ...formData,
      managerName: selectedManager ? selectedManager.name : formData.managerName,
    };

    if (editingOrg) {
      updateOrganization(finalOrg);
    } else {
      addOrganization(finalOrg);
    }

    setIsModalOpen(false);
  };

  // Render tree recursively
  const renderOrgNode = (org: OrganizationUnit, level = 0) => {
    const children = organizations.filter((o) => o.parentId === org.id);

    return (
      <div key={org.id} style={{ marginLeft: `${level * 24}px`, marginTop: '8px' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: level === 0 ? '#eff6ff' : '#ffffff',
            border: level === 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Network size={16} color={level === 0 ? '#1e40af' : '#2563eb'} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: '#0f2b46', fontSize: '13px' }}>
                  {language === 'ar' ? org.nameAr : org.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#e2e8f0',
                    color: '#475569',
                    fontWeight: 600,
                  }}
                >
                  {org.code}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Manager: <strong>{org.managerName}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <StatusBadge status={org.status === 'active' ? 'Active' : 'Inactive'} />
            {canAdminister && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenCreate(org.id)}
                  title="Add child unit"
                >
                  <Plus size={12} />
                  <span>Add Sub-unit</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEdit(org)}
                  title="Edit unit details"
                >
                  <Edit2 size={12} />
                </button>
              </>
            )}
          </div>
        </div>

        {children.length > 0 && (
          <div style={{ borderLeft: '2px dashed #cbd5e1', marginLeft: '12px', paddingLeft: '8px' }}>
            {children.map((child) => renderOrgNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootOrgs = organizations.filter((o) => o.parentId === null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('organization_tree')} (Organizational Architecture)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Hierarchical authority structure, leadership accountability, and operational directorates.
          </p>
        </div>

        {canAdminister && (
          <button className="btn btn-primary" onClick={() => handleOpenCreate(null)}>
            <Plus size={15} />
            <span>Add Root Organization</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Network size={16} />
            <span>Al Ahsa Development Authority Structural Hierarchy</span>
          </div>
        </div>
        <div className="card-body">
          {rootOrgs.map((root) => renderOrgNode(root, 0))}
        </div>
      </div>

      {/* Org Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrg ? `Edit Directorate: ${editingOrg.name}` : 'Create Organization Unit'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingOrg ? 'Save Changes' : 'Create Unit'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div
              style={{
                padding: '10px 14px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '14px',
              }}
            >
              {formError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Unit Code *</label>
              <input
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="AHDA-SVC"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Name (English) *</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Unit Name (Arabic)</label>
            <input
              className="form-input"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Parent Unit</label>
              <select
                className="form-select"
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
              >
                <option value="">None (Top-Level Entity)</option>
                {organizations
                  .filter((o) => o.id !== formData.id)
                  .map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.code})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Director / Manager</label>
              <select
                className="form-select"
                value={formData.managerId}
                onChange={(e) => {
                  const u = users.find((x) => x.id === e.target.value);
                  setFormData({
                    ...formData,
                    managerId: e.target.value,
                    managerName: u ? u.name : '',
                  });
                }}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
