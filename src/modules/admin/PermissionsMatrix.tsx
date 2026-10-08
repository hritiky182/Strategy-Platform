import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_PERMISSIONS, can } from '../../services/permissionService';
import { RoleName, PermissionAction, PermissionResource, User } from '../../types';
import { Lock, ShieldCheck, Check, X, PlayCircle, AlertCircle } from 'lucide-react';

export const PermissionsMatrix: React.FC = () => {
  const { users, t } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleName>('KPI Contributor');
  const [testAction, setTestAction] = useState<PermissionAction>('APPROVE');
  const [testResource, setTestResource] = useState<PermissionResource>('performance_result');
  const [isSelfSubmission, setIsSelfSubmission] = useState(true);

  // Test evaluation
  const simulatedUser = users.find((u) => u.role === selectedRole) || users[0];

  const testContext = {
    submittedBy: isSelfSubmission ? simulatedUser.id : 'USR-999',
    departmentId: 'ORG-03',
  };

  const testResult = can(simulatedUser, testAction, testResource, testContext);

  const actions: PermissionAction[] = [
    'VIEW',
    'CREATE',
    'EDIT',
    'SUBMIT',
    'APPROVE',
    'PUBLISH',
    'EXPORT',
    'ADMINISTER',
  ];

  const resources: Array<{ id: PermissionResource; label: string }> = [
    { id: 'strategy_plan', label: 'Strategic Plan & Horizon' },
    { id: 'diagnosis', label: 'Diagnosis (SWOT / PESTEL)' },
    { id: 'options', label: 'Strategic Options Matrix' },
    { id: 'bsc_objective', label: 'BSC Strategic Objectives' },
    { id: 'kpi_definition', label: 'KPI Dictionary Records' },
    { id: 'performance_result', label: 'Performance Actuals' },
    { id: 'initiative', label: 'Strategic Initiatives' },
    { id: 'action', label: 'Corrective Actions' },
    { id: 'review', label: 'Strategy Reviews' },
    { id: 'amendment', label: 'Plan Amendments' },
    { id: 'user_admin', label: 'User Directory Admin' },
    { id: 'org_admin', label: 'Organization Units' },
    { id: 'audit_log', label: 'Audit Trail Logs' },
    { id: 'executive_report', label: 'Executive Reports' },
  ];

  const allRoles: RoleName[] = [
    'System Administrator',
    'Strategy Manager',
    'Strategy Analyst',
    'Department Head',
    'KPI Contributor',
    'Performance Reviewer',
    'Initiative Owner',
    'Executive Approver',
    'Executive Viewer',
    'Auditor / Assurance Viewer',
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
          {t('roles_permissions')} (Enterprise Governance & Permission Engine)
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
          Role-based access matrix, segregation of duties, self-approval prevention, and live policy
          validation bench.
        </p>
      </div>

      {/* Interactive Permission Test Bench */}
      <div
        className="card"
        style={{
          marginBottom: '24px',
          border: '1px solid #93c5fd',
          backgroundColor: '#eff6ff',
        }}
      >
        <div className="card-header" style={{ backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
          <div className="card-title" style={{ color: '#1e40af' }}>
            <PlayCircle size={16} />
            <span>Interactive Permission Policy Test Bench</span>
          </div>
          <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
            Simulates can(user, action, resource, context)
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label">Evaluate As Role</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as RoleName)}
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Requested Action</label>
              <select
                className="form-select"
                value={testAction}
                onChange={(e) => setTestAction(e.target.value as PermissionAction)}
              >
                {actions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Target Resource</label>
              <select
                className="form-select"
                value={testResource}
                onChange={(e) => setTestResource(e.target.value as PermissionResource)}
              >
                {resources.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ paddingBottom: '8px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#1e40af',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelfSubmission}
                  onChange={(e) => setIsSelfSubmission(e.target.checked)}
                />
                <span>Simulate Own Submission</span>
              </label>
            </div>
          </div>

          {/* Test Verdict Result */}
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              borderRadius: '6px',
              backgroundColor: testResult.allowed ? '#f0fdf4' : '#fee2e2',
              border: testResult.allowed ? '1px solid #bbf7d0' : '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {testResult.allowed ? (
              <ShieldCheck size={24} color="#16a34a" />
            ) : (
              <AlertCircle size={24} color="#dc2626" />
            )}

            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: testResult.allowed ? '#166534' : '#991b1b',
                }}
              >
                {testResult.allowed ? 'VERDICT: ACTION PERMITTED' : 'VERDICT: ACTION DENIED BY POLICY'}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: testResult.allowed ? '#15803d' : '#b91c1c',
                  marginTop: '2px',
                }}
              >
                {testResult.allowed
                  ? `User '${simulatedUser.name}' holds legitimate authorization for '${testAction}' on '${testResource}'.`
                  : testResult.reason}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Permission Matrix Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Lock size={16} />
            <span>Enterprise Authority Matrix for: {selectedRole}</span>
          </div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '260px' }}>Resource Area</th>
                {actions.map((act) => (
                  <th key={act} style={{ textAlign: 'center' }}>
                    {act}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => {
                const allowedList = ROLE_PERMISSIONS[selectedRole]?.[res.id] || [];
                return (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 600, color: '#0f2b46' }}>{res.label}</td>
                    {actions.map((act) => {
                      const isAllowed = allowedList.includes(act);
                      return (
                        <td key={act} style={{ textAlign: 'center' }}>
                          {isAllowed ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                backgroundColor: '#dcfce7',
                                color: '#15803d',
                              }}
                            >
                              <Check size={14} />
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                backgroundColor: '#f1f5f9',
                                color: '#94a3b8',
                              }}
                            >
                              <X size={12} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
