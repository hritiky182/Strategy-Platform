export type RoleName =
  | 'System Administrator'
  | 'Strategy Manager'
  | 'Strategy Analyst'
  | 'Department Head'
  | 'KPI Contributor'
  | 'Performance Reviewer'
  | 'Initiative Owner'
  | 'Executive Approver'
  | 'Executive Viewer'
  | 'Auditor / Assurance Viewer';

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'SUBMIT'
  | 'APPROVE'
  | 'PUBLISH'
  | 'EXPORT'
  | 'ADMINISTER';

export type PermissionResource =
  | 'strategy_plan'
  | 'diagnosis'
  | 'options'
  | 'bsc_objective'
  | 'kpi_definition'
  | 'performance_result'
  | 'initiative'
  | 'action'
  | 'review'
  | 'amendment'
  | 'user_admin'
  | 'org_admin'
  | 'permissions_admin'
  | 'audit_log'
  | 'executive_report';

export type RagStatus = 'GREEN' | 'AMBER' | 'RED' | 'GRAY';

export interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: RoleName;
  departmentId: string;
  status: 'active' | 'inactive';
  effectiveFrom: string;
  effectiveTo: string;
  title: string;
  titleAr: string;
}

export interface OrganizationUnit {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  parentId: string | null;
  managerId: string;
  managerName: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  ownerId: string;
  orgId: string;
  framework: string;
  horizon: string;
  reportingFrequency: 'Quarterly' | 'Monthly' | 'Annual';
  period: string;
  reviewers: string[];
  deadlines: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Published' | 'Archived';
  version: string;
  publishedAt?: string;
  mandate: string;
  mandateAr: string;
  vision: string;
  visionAr: string;
  mission: string;
  missionAr: string;
  values: string[];
  valuesAr: string[];
}

export interface Perspective {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  order: number;
  description: string;
  descriptionAr: string;
  color: string;
}

export interface StrategicTheme {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
}

export interface StrategicObjective {
  id: string; // e.g. OBJ-P01
  code: string;
  name: string;
  nameAr: string;
  perspectiveId: string;
  themeId: string;
  departmentId: string;
  contributingDepartmentIds: string[];
  ownerId: string;
  ownerName: string;
  weight: number;
  description: string;
  descriptionAr: string;
  planId: string;
}

export interface StrategyMapRelationship {
  id: string;
  sourceObjectiveId: string;
  targetObjectiveId: string;
  direction: 'up' | 'down' | 'lateral';
  rationale: string;
  rationaleAr: string;
}

export interface KPI {
  id: string; // e.g. KPI-P01
  code: string;
  name: string;
  nameAr: string;
  objectiveId: string;
  departmentId: string;
  definition: string;
  definitionAr: string;
  unit: string;
  formula: string;
  direction: 'higher' | 'lower';
  baseline: number;
  baselineDate: string;
  target: number;
  weight: number; // percentage in objective
  frequency: 'Quarterly' | 'Monthly';
  source: string;
  ownerId: string;
  updaterId: string;
  reviewerId: string;
  aggregationMethod: 'Average' | 'Sum' | 'Last Value';
  thresholds: {
    green: number;
    amber: number;
  };
  evidenceRequirement: string;
  version: string;
  status: 'active' | 'deprecated';
}

export interface PerformanceResultHistory {
  version: number;
  actual: number | null;
  status: string;
  changedBy: string;
  changedAt: string;
  note: string;
  evidenceTitle?: string;
}

export interface PerformanceResult {
  id: string;
  kpiId: string;
  period: string; // Q1 2027
  year: number;
  quarter: string;
  actual: number | null;
  target: number;
  status: 'Draft' | 'Submitted' | 'Returned' | 'Approved' | 'Corrected';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  returnReason?: string;
  evidenceTitle?: string;
  evidenceSummary?: string;
  evidenceFile?: string;
  varianceAnalysis?: string;
  version: number;
  history: PerformanceResultHistory[];
}

export interface InitiativeMilestone {
  id: string;
  name: string;
  nameAr: string;
  dueDate: string;
  completed: boolean;
  weight: number;
}

export interface Initiative {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  objectiveId: string;
  departmentId: string;
  sponsorId: string;
  ownerId: string;
  description: string;
  descriptionAr: string;
  scope: string;
  expectedOutcomes: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  progress: number;
  status: 'Planned' | 'In Progress' | 'At Risk' | 'Completed';
  dependencies: string;
  risks: string;
  benefitKpiIds: string[];
  milestones: InitiativeMilestone[];
}

export interface CorrectiveAction {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  problem: string;
  rootCause: string;
  kpiId: string;
  resultId: string;
  initiativeId?: string;
  ownerId: string;
  ownerName: string;
  dueDate: string;
  expectedEffect: string;
  evidence: string;
  effectivenessCheck: string;
  status: 'Open' | 'In Progress' | 'Overdue' | 'Pending Review' | 'Closed';
}

export interface StrategicRisk {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  objectiveId: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  owner: string;
  status: 'Mitigated' | 'Monitoring' | 'Active';
}

export interface DepartmentAlignment {
  id: string;
  corporateObjectiveId: string;
  departmentObjectiveId: string;
  departmentObjectiveName: string;
  departmentObjectiveNameAr: string;
  departmentId: string;
  contributionType: 'Direct Contribution' | 'Supporting Contribution' | 'Shared KPI' | 'Local KPI';
  kpiIds: string[];
  notes: string;
}

export interface DiagnosisItem {
  id: string;
  type: 'SWOT_S' | 'SWOT_W' | 'SWOT_O' | 'SWOT_T' | 'PESTEL' | 'STAKEHOLDER';
  finding: string;
  findingAr: string;
  method: string;
  source: string;
  date: string;
  confidence: 'High' | 'Medium' | 'Low';
  owner: string;
  reviewer: string;
  relatedStrategicIssue: string;
  linkedThemeId?: string;
  evidenceRecord: string;
  comments: string;
}

export interface StrategicOption {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  impact: number; // 1-10
  mandateAlignment: number; // 1-10
  feasibility: number; // 1-10
  cost: number; // 1-10 (higher is more favorable / cost-effective)
  risk: number; // 1-10 (higher is lower risk)
  status: 'Selected' | 'Deferred' | 'Rejected';
  decisionRationale: string;
  decisionRationaleAr: string;
}

export interface StrategyReviewMeeting {
  id: string;
  period: string;
  date: string;
  title: string;
  agenda: string[];
  participants: string[];
  exceptionsDiscussed: string[];
  decisions: Array<{
    id: string;
    decision: string;
    decisionAr: string;
    ownerId: string;
    dueDate: string;
    status: 'Decided' | 'Action In Progress' | 'Completed';
  }>;
  actions: string[];
  frozenReportId?: string;
}

export interface Amendment {
  id: string;
  code: string;
  targetType: 'KPI_TARGET' | 'OBJECTIVE_WEIGHT' | 'PLAN_HORIZON';
  targetRecordId: string;
  targetRecordName: string;
  oldValue: string | number;
  newValue: string | number;
  reason: string;
  effectiveDate: string;
  reviewerId: string;
  affectedPeriods: string[];
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  versionGenerated: string;
}

export interface ExecutiveReport {
  id: string;
  code: string;
  planVersion: string;
  period: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  approvalState: 'Approved Snapshot' | 'Draft Preview';
  overallScore: number;
  dataCoverage: number;
  summaryText: string;
  isFrozen: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  record: string;
  recordId: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  link: string;
}

export interface AppSettings {
  activeRole: RoleName;
  activeLanguage: 'en' | 'ar';
  activePlanId: string;
  activePeriod: string;
  activeOrgId: string;
}
