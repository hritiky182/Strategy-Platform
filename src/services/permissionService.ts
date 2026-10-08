import { PermissionAction, PermissionResource, RoleName, User } from '../types';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

// Role permission matrix definition
const ROLE_PERMISSIONS: Record<RoleName, Record<PermissionResource, PermissionAction[]>> = {
  'System Administrator': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW'],
    initiative: ['VIEW'],
    action: ['VIEW'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: ['VIEW', 'CREATE', 'EDIT', 'ADMINISTER'],
    org_admin: ['VIEW', 'CREATE', 'EDIT', 'ADMINISTER'],
    permissions_admin: ['VIEW', 'EDIT', 'ADMINISTER'],
    audit_log: ['VIEW', 'EXPORT'],
    executive_report: ['VIEW', 'EXPORT'],
  },
  'Strategy Manager': {
    strategy_plan: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    diagnosis: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    options: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    bsc_objective: ['VIEW', 'CREATE', 'EDIT'],
    kpi_definition: ['VIEW', 'CREATE', 'EDIT'],
    performance_result: ['VIEW', 'EDIT', 'SUBMIT'],
    initiative: ['VIEW', 'CREATE', 'EDIT'],
    action: ['VIEW', 'CREATE', 'EDIT'],
    review: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    amendment: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    user_admin: ['VIEW'],
    org_admin: ['VIEW'],
    permissions_admin: ['VIEW'],
    audit_log: ['VIEW'],
    executive_report: ['VIEW', 'CREATE', 'EXPORT'],
  },
  'Strategy Analyst': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW', 'CREATE', 'EDIT'],
    options: ['VIEW', 'CREATE', 'EDIT'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW'],
    initiative: ['VIEW'],
    action: ['VIEW'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: ['VIEW'],
    executive_report: ['VIEW', 'EXPORT'],
  },
  'Department Head': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW', 'EDIT'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW', 'SUBMIT'],
    initiative: ['VIEW', 'EDIT'],
    action: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
    review: ['VIEW'],
    amendment: ['VIEW', 'CREATE'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: ['VIEW'],
    executive_report: ['VIEW', 'EXPORT'],
  },
  'KPI Contributor': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'],
    initiative: ['VIEW'],
    action: ['VIEW', 'CREATE', 'EDIT'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: [],
    executive_report: ['VIEW'],
  },
  'Performance Reviewer': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW', 'EDIT'],
    performance_result: ['VIEW', 'EDIT', 'APPROVE'], // Can review/approve/return
    initiative: ['VIEW'],
    action: ['VIEW', 'EDIT'],
    review: ['VIEW', 'CREATE'],
    amendment: ['VIEW', 'EDIT'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: ['VIEW'],
    executive_report: ['VIEW', 'EXPORT'],
  },
  'Initiative Owner': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW'],
    initiative: ['VIEW', 'EDIT', 'SUBMIT'],
    action: ['VIEW', 'CREATE', 'EDIT'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: [],
    executive_report: ['VIEW'],
  },
  'Executive Approver': {
    strategy_plan: ['VIEW', 'APPROVE', 'PUBLISH'],
    diagnosis: ['VIEW'],
    options: ['VIEW', 'APPROVE'],
    bsc_objective: ['VIEW', 'APPROVE'],
    kpi_definition: ['VIEW', 'APPROVE'],
    performance_result: ['VIEW', 'APPROVE'],
    initiative: ['VIEW', 'APPROVE'],
    action: ['VIEW', 'APPROVE'],
    review: ['VIEW', 'APPROVE'],
    amendment: ['VIEW', 'APPROVE'],
    user_admin: ['VIEW'],
    org_admin: ['VIEW'],
    permissions_admin: ['VIEW'],
    audit_log: ['VIEW', 'EXPORT'],
    executive_report: ['VIEW', 'EXPORT', 'PUBLISH'],
  },
  'Executive Viewer': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW'],
    initiative: ['VIEW'],
    action: ['VIEW'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: [],
    org_admin: ['VIEW'],
    permissions_admin: [],
    audit_log: ['VIEW'],
    executive_report: ['VIEW', 'EXPORT'],
  },
  'Auditor / Assurance Viewer': {
    strategy_plan: ['VIEW'],
    diagnosis: ['VIEW'],
    options: ['VIEW'],
    bsc_objective: ['VIEW'],
    kpi_definition: ['VIEW'],
    performance_result: ['VIEW'],
    initiative: ['VIEW'],
    action: ['VIEW'],
    review: ['VIEW'],
    amendment: ['VIEW'],
    user_admin: ['VIEW'],
    org_admin: ['VIEW'],
    permissions_admin: ['VIEW'],
    audit_log: ['VIEW', 'EXPORT'],
    executive_report: ['VIEW', 'EXPORT'],
  },
};

/**
 * Enterprise permission engine with Segregation of Duties and context checks
 */
export function can(
  user: User | null,
  action: PermissionAction,
  resource: PermissionResource,
  contextRecord?: any
): PermissionCheckResult {
  if (!user) {
    return { allowed: false, reason: 'Authentication required.' };
  }

  if (user.status === 'inactive') {
    return { allowed: false, reason: 'User account is deactivated.' };
  }

  // 1. Check base role permission matrix
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) {
    return { allowed: false, reason: `Role ${user.role} has no configured permissions.` };
  }

  const allowedActions = rolePermissions[resource] || [];
  if (!allowedActions.includes(action)) {
    return {
      allowed: false,
      reason: `Role '${user.role}' is not granted '${action}' authority on '${resource}'.`,
    };
  }

  // 2. Segregation of Duties: Self-Approval is blocked
  if (action === 'APPROVE' && contextRecord) {
    if (contextRecord.submittedBy && contextRecord.submittedBy === user.id) {
      return {
        allowed: false,
        reason: 'Segregation of Duties: Approver cannot approve their own submission.',
      };
    }
    if (contextRecord.ownerId && contextRecord.ownerId === user.id && user.role !== 'Executive Approver') {
      return {
        allowed: false,
        reason: 'Conflict of interest: Cannot approve records where you are the primary owner.',
      };
    }
  }

  // 3. Departmental scope check for KPI Contributor
  if (user.role === 'KPI Contributor' && (action === 'EDIT' || action === 'SUBMIT') && contextRecord) {
    if (contextRecord.departmentId && contextRecord.departmentId !== user.departmentId) {
      return {
        allowed: false,
        reason: 'Scope boundary: KPI Contributors can only edit/submit data for their assigned organizational unit.',
      };
    }
  }

  // 4. System Administrator cannot approve business strategies
  if (user.role === 'System Administrator' && action === 'APPROVE') {
    return {
      allowed: false,
      reason: 'Administrative separation: System Administrators do not possess business approval authority.',
    };
  }

  return { allowed: true };
}

export function getAllowedActionsForRole(
  role: RoleName,
  resource: PermissionResource
): PermissionAction[] {
  return ROLE_PERMISSIONS[role]?.[resource] || [];
}

export { ROLE_PERMISSIONS };
