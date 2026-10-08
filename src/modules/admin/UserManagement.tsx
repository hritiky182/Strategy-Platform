import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, RoleName } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';
import { Users, UserPlus, Search, Edit2, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, organizations, addUser, updateUser, checkPermission, t, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    nameAr: string;
    email: string;
    role: RoleName;
    departmentId: string;
    title: string;
    titleAr: string;
    status: 'active' | 'inactive';
    effectiveFrom: string;
    effectiveTo: string;
  }>({
    id: '',
    name: '',
    nameAr: '',
    email: '',
    role: 'KPI Contributor',
    departmentId: 'ORG-03',
    title: '',
    titleAr: '',
    status: 'active',
    effectiveFrom: '2027-01-01',
    effectiveTo: '2030-12-31',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const canAdminister = checkPermission('ADMINISTER', 'user_admin').allowed;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      id: `USR-${(users.length + 1).toString().padStart(2, '0')}`,
      name: '',
      nameAr: '',
      email: '',
      role: 'KPI Contributor',
      departmentId: 'ORG-03',
      title: '',
      titleAr: '',
      status: 'active',
      effectiveFrom: '2027-01-01',
      effectiveTo: '2030-12-31',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      nameAr: user.nameAr,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      title: user.title,
      titleAr: user.titleAr,
      status: user.status,
      effectiveFrom: user.effectiveFrom,
      effectiveTo: user.effectiveTo,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    const updatedStatus = user.status === 'active' ? 'inactive' : 'active';
    updateUser({ ...user, status: updatedStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Full name and email are required fields.');
      return;
    }

    // Check duplicate email
    const duplicateEmail = users.find(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== formData.id
    );
    if (duplicateEmail) {
      setFormError(`Email "${formData.email}" is already registered to user ${duplicateEmail.name}.`);
      return;
    }

    if (editingUser) {
      updateUser(formData as User);
    } else {
      addUser(formData as User);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('users')} (User Administration)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Enterprise directory, role assignments, organizational linkages, and active status control.
          </p>
        </div>

        {canAdminister && (
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <UserPlus size={15} />
            <span>Create New User</span>
          </button>
        )}
      </div>

      <div className="card">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="form-select"
              style={{ width: '180px', fontSize: '12px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Strategy Manager">Strategy Manager</option>
              <option value="Strategy Analyst">Strategy Analyst</option>
              <option value="Department Head">Department Head</option>
              <option value="KPI Contributor">KPI Contributor</option>
              <option value="Performance Reviewer">Performance Reviewer</option>
              <option value="Initiative Owner">Initiative Owner</option>
              <option value="Executive Approver">Executive Approver</option>
              <option value="Executive Viewer">Executive Viewer</option>
              <option value="Auditor / Assurance Viewer">Auditor</option>
            </select>

            <select
              className="form-select"
              style={{ width: '130px', fontSize: '12px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Directorate / Unit</th>
                <th>Effective Dates</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const org = organizations.find((o) => o.id === u.departmentId);
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: '#1e40af' }}>{u.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>
                        {language === 'ar' ? u.nameAr : u.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {language === 'ar' ? u.titleAr : u.title}
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{u.email}</td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#334155' }}>
                      {org ? org.name : u.departmentId}
                    </td>
                    <td style={{ fontSize: '11px', color: '#64748b' }}>
                      {u.effectiveFrom} to {u.effectiveTo}
                    </td>
                    <td>
                      <StatusBadge status={u.status === 'active' ? 'Active' : 'Inactive'} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {canAdminister && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(u)}
                              title="Edit user details"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                              onClick={() => handleToggleStatus(u)}
                              title={u.status === 'active' ? 'Deactivate user' : 'Reactivate user'}
                            >
                              {u.status === 'active' ? <UserX size={12} /> : <CheckCircle2 size={12} />}
                            </button>
                          </>
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

      {/* User Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Create New Enterprise User'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingUser ? 'Save Updates' : 'Create User'}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Full Name (English) *</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name (Arabic)</label>
              <input
                className="form-input"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Official Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Role *</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleName })}
              >
                <option value="System Administrator">System Administrator</option>
                <option value="Strategy Manager">Strategy Manager</option>
                <option value="Strategy Analyst">Strategy Analyst</option>
                <option value="Department Head">Department Head</option>
                <option value="KPI Contributor">KPI Contributor</option>
                <option value="Performance Reviewer">Performance Reviewer</option>
                <option value="Initiative Owner">Initiative Owner</option>
                <option value="Executive Approver">Executive Approver</option>
                <option value="Executive Viewer">Executive Viewer</option>
                <option value="Auditor / Assurance Viewer">Auditor / Assurance Viewer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Organizational Unit</label>
              <select
                className="form-select"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">User Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Job Title (EN)</label>
              <input
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title (AR)</label>
              <input
                className="form-input"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
