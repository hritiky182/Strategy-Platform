import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Amendment,
  AppSettings,
  AuditLog,
  CorrectiveAction,
  DepartmentAlignment,
  DiagnosisItem,
  ExecutiveReport,
  Initiative,
  KPI,
  NotificationItem,
  OrganizationUnit,
  PerformanceResult,
  Perspective,
  Plan,
  RoleName,
  StrategicObjective,
  StrategicOption,
  StrategicRisk,
  StrategicTheme,
  StrategyMapRelationship,
  StrategyReviewMeeting,
  User,
  PermissionAction,
  PermissionResource,
  EntityConfig,
  JourneySetupData,
} from '../types';
import { StorageService, AuthSession, DEFAULT_ENTITY_CONFIG } from '../services/storageService';
import { can, PermissionCheckResult } from '../services/permissionService';
import { TRANSLATIONS, Language } from '../data/translations';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  session: AuthSession | null;
  login: (
    userOrRole?: User | RoleName,
    authMethod?: 'persona' | 'nafath' | 'credentials'
  ) => void;
  logout: () => void;

  // Entity Configuration & Onboarding
  entityConfig: EntityConfig;
  updateEntityConfig: (config: Partial<EntityConfig>) => void;
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (completed: boolean) => void;
  saveCompleteJourney: (data: JourneySetupData) => void;

  // Data state
  users: User[];
  organizations: OrganizationUnit[];
  plans: Plan[];
  perspectives: Perspective[];
  themes: StrategicTheme[];
  objectives: StrategicObjective[];
  relationships: StrategyMapRelationship[];
  kpis: KPI[];
  results: PerformanceResult[];
  initiatives: Initiative[];
  actions: CorrectiveAction[];
  risks: StrategicRisk[];
  alignments: DepartmentAlignment[];
  diagnosis: DiagnosisItem[];
  options: StrategicOption[];
  reviews: StrategyReviewMeeting[];
  amendments: Amendment[];
  reports: ExecutiveReport[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  settings: AppSettings;
  currentUser: User;

  // Language & Translation
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;

  // Role & Global Filter state
  setRole: (role: RoleName) => void;
  setPeriod: (period: string) => void;
  setPlan: (planId: string) => void;

  // Permissions check helper
  checkPermission: (
    action: PermissionAction,
    resource: PermissionResource,
    record?: any
  ) => PermissionCheckResult;

  // Drawer / Inspection state
  selectedObjective: StrategicObjective | null;
  setSelectedObjective: (obj: StrategicObjective | null) => void;
  selectedKpi: KPI | null;
  setSelectedKpi: (kpi: KPI | null) => void;
  selectedInitiative: Initiative | null;
  setSelectedInitiative: (ini: Initiative | null) => void;
  selectedAction: CorrectiveAction | null;
  setSelectedAction: (act: CorrectiveAction | null) => void;

  // Modal / Flyout state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Mutations
  resetDemoData: () => void;
  updateUser: (user: User) => void;
  addUser: (user: User) => void;
  updateOrganization: (org: OrganizationUnit) => void;
  addOrganization: (org: OrganizationUnit) => void;
  updatePlan: (plan: Plan) => void;
  addPlan: (plan: Plan) => void;
  updateObjective: (obj: StrategicObjective) => void;
  addObjective: (obj: StrategicObjective) => void;
  updateKpi: (kpi: KPI) => void;
  addKpi: (kpi: KPI) => void;
  updateResult: (result: PerformanceResult) => void;
  addResult: (result: PerformanceResult) => void;
  updateInitiative: (ini: Initiative) => void;
  addInitiative: (ini: Initiative) => void;
  updateAction: (act: CorrectiveAction) => void;
  addAction: (act: CorrectiveAction) => void;
  updateDiagnosis: (item: DiagnosisItem) => void;
  addDiagnosis: (item: DiagnosisItem) => void;
  updateOption: (option: StrategicOption) => void;
  updateReview: (review: StrategyReviewMeeting) => void;
  addReview: (review: StrategyReviewMeeting) => void;
  addAmendment: (amendment: Amendment) => void;
  updateAmendment: (amendment: Amendment) => void;
  addReport: (report: ExecutiveReport) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize persistence on mount
  useEffect(() => {
    StorageService.initialize();
  }, []);

  const [users, setUsers] = useState<User[]>(() => {
    const list = StorageService.getUsers();
    return list.map((u) => ({
      ...u,
      email: u.email && u.email.includes('@ahda.gov.sa') ? u.email.replace('@ahda.gov.sa', '@test.com') : u.email,
    }));
  });
  const [organizations, setOrganizations] = useState<OrganizationUnit[]>(() =>
    StorageService.getOrganizations()
  );
  const [plans, setPlans] = useState<Plan[]>(() => StorageService.getPlans());
  const [perspectives] = useState<Perspective[]>(() => StorageService.getPerspectives());
  const [themes, setThemes] = useState<StrategicTheme[]>(() => StorageService.getThemes());
  const [objectives, setObjectives] = useState<StrategicObjective[]>(() =>
    StorageService.getObjectives()
  );
  const [relationships, setRelationships] = useState<StrategyMapRelationship[]>(() =>
    StorageService.getRelationships()
  );
  const [kpis, setKpis] = useState<KPI[]>(() => StorageService.getKpis());
  const [results, setResults] = useState<PerformanceResult[]>(() => StorageService.getResults());
  const [initiatives, setInitiatives] = useState<Initiative[]>(() =>
    StorageService.getInitiatives()
  );
  const [actions, setActions] = useState<CorrectiveAction[]>(() => StorageService.getActions());
  const [risks, setRisks] = useState<StrategicRisk[]>(() => StorageService.getRisks());
  const [alignments, setAlignments] = useState<DepartmentAlignment[]>(() =>
    StorageService.getAlignments()
  );
  const [diagnosis, setDiagnosis] = useState<DiagnosisItem[]>(() => StorageService.getDiagnosis());
  const [options, setOptions] = useState<StrategicOption[]>(() => StorageService.getOptions());
  const [reviews, setReviews] = useState<StrategyReviewMeeting[]>(() =>
    StorageService.getReviews()
  );
  const [amendments, setAmendments] = useState<Amendment[]>(() => StorageService.getAmendments());
  const [reports, setReports] = useState<ExecutiveReport[]>(() => StorageService.getReports());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  // Entity Configuration & Onboarding state
  const [entityConfig, setEntityConfigState] = useState<EntityConfig>(() =>
    StorageService.getEntityConfig()
  );
  const [isOnboardingCompleted, setIsOnboardingCompletedState] = useState<boolean>(() =>
    StorageService.isOnboardingCompleted()
  );

  const updateEntityConfig = (patch: Partial<EntityConfig>) => {
    setEntityConfigState((prev) => {
      const updated = { ...prev, ...patch };
      StorageService.setEntityConfig(updated);
      return updated;
    });
  };

  const setIsOnboardingCompleted = (completed: boolean) => {
    setIsOnboardingCompletedState(completed);
    StorageService.setOnboardingCompleted(completed);
  };

  const saveCompleteJourney = (data: JourneySetupData) => {
    StorageService.saveCompleteJourney(data);
    setEntityConfigState(data.entity);
    setOrganizations(data.organizationUnits);
    setUsers(data.users);
    setPlans(StorageService.getPlans());
    setThemes(data.themes);
    setObjectives(data.objectives);
    setKpis(data.kpis);
    setInitiatives(data.initiatives);
    if (data.results && data.results.length > 0) {
      setResults(data.results);
    }
    setIsOnboardingCompletedState(true);

    showToast('Platform setup journey successfully applied & synchronized!', 'success');
  };

  // Sync brand colors with CSS variables
  useEffect(() => {
    if (entityConfig.primaryColor) {
      document.documentElement.style.setProperty('--primary-800', entityConfig.primaryColor);
      document.documentElement.style.setProperty('--ahda-teal', entityConfig.primaryColor);
    }
    if (entityConfig.secondaryColor) {
      document.documentElement.style.setProperty('--ahda-emerald', entityConfig.secondaryColor);
    }
  }, [entityConfig.primaryColor, entityConfig.secondaryColor]);

  // Authentication & Session state
  const [session, setSessionState] = useState<AuthSession | null>(() => StorageService.getSession());
  const isAuthenticated = !!session;

  // UI state
  const [selectedObjective, setSelectedObjective] = useState<StrategicObjective | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast handler
  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Current active user based on activeRole
  const currentUser = useMemo(() => {
    const match = users.find((u) => u.role === settings.activeRole && u.status === 'active');
    return match || users[0];
  }, [users, settings.activeRole]);

  // Login handler
  const login = (
    userOrRole?: User | RoleName,
    authMethod: 'persona' | 'nafath' | 'credentials' = 'persona'
  ) => {
    let targetUser: User | undefined;
    if (typeof userOrRole === 'object' && userOrRole !== null) {
      targetUser = userOrRole;
    } else if (typeof userOrRole === 'string') {
      targetUser = users.find((u) => u.role === userOrRole);
    } else {
      targetUser = users.find((u) => u.role === settings.activeRole) || users[0];
    }

    if (!targetUser) targetUser = users[0];

    const newSession: AuthSession = {
      token: `ahda_jwt_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
      userId: targetUser.id,
      role: targetUser.role,
      authenticatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      authMethod,
    };

    StorageService.setSession(newSession);
    setSessionState(newSession);

    const newSettings = { ...settings, activeRole: targetUser.role };
    setSettings(newSettings);
    StorageService.setSettings(newSettings);

    StorageService.addAuditLog({
      userId: targetUser.id,
      userName: targetUser.name,
      role: targetUser.role,
      action: 'LOGIN',
      record: 'AuthSession',
      recordId: targetUser.id,
      previousValue: 'UNAUTHENTICATED',
      newValue: 'AUTHENTICATED',
      reason: `Enterprise identity verified via ${authMethod.toUpperCase()} (Session Token Issued)`,
    });
    setAuditLogs(StorageService.getAuditLogs());

    showToast(
      settings.activeLanguage === 'ar'
        ? `تم تسجيل الدخول بنجاح: ${targetUser.nameAr} (${targetUser.role})`
        : `Welcome back, ${targetUser.name} (${targetUser.role})`,
      'success'
    );
  };

  // Logout handler
  const logout = () => {
    if (session) {
      StorageService.addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        action: 'LOGOUT',
        record: 'AuthSession',
        recordId: currentUser.id,
        previousValue: 'AUTHENTICATED',
        newValue: 'UNAUTHENTICATED',
        reason: 'User explicitly terminated IAM session',
      });
      setAuditLogs(StorageService.getAuditLogs());
    }

    StorageService.clearSession();
    setSessionState(null);
    showToast(
      settings.activeLanguage === 'ar'
        ? 'تم تسجيل الخروج بنجاح'
        : 'Session terminated. Successfully signed out.',
      'info'
    );
  };

  // Language & Translation
  const language = settings.activeLanguage;
  const setLanguage = (lang: Language) => {
    const newSettings = { ...settings, activeLanguage: lang };
    setSettings(newSettings);
    StorageService.setSettings(newSettings);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  // Sync html dir on initial mount
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || key;
  };

  const setRole = (role: RoleName) => {
    const newSettings = { ...settings, activeRole: role };
    setSettings(newSettings);
    StorageService.setSettings(newSettings);

    if (session) {
      const match = users.find((u) => u.role === role);
      const updatedSession: AuthSession = {
        ...session,
        role,
        userId: match ? match.id : session.userId,
      };
      StorageService.setSession(updatedSession);
      setSessionState(updatedSession);
    }

    showToast(`Switched active role to: ${role}`, 'info');
  };

  const setPeriod = (period: string) => {
    const newSettings = { ...settings, activePeriod: period };
    setSettings(newSettings);
    StorageService.setSettings(newSettings);
  };

  const setPlan = (planId: string) => {
    const newSettings = { ...settings, activePlanId: planId };
    setSettings(newSettings);
    StorageService.setSettings(newSettings);
  };

  const checkPermission = (
    action: PermissionAction,
    resource: PermissionResource,
    record?: any
  ): PermissionCheckResult => {
    return can(currentUser, action, resource, record);
  };

  // Mutations
  const resetDemoData = () => {
    StorageService.resetDemo();
    setUsers(StorageService.getUsers());
    setOrganizations(StorageService.getOrganizations());
    setPlans(StorageService.getPlans());
    setObjectives(StorageService.getObjectives());
    setRelationships(StorageService.getRelationships());
    setKpis(StorageService.getKpis());
    setResults(StorageService.getResults());
    setInitiatives(StorageService.getInitiatives());
    setActions(StorageService.getActions());
    setRisks(StorageService.getRisks());
    setAlignments(StorageService.getAlignments());
    setDiagnosis(StorageService.getDiagnosis());
    setOptions(StorageService.getOptions());
    setReviews(StorageService.getReviews());
    setAmendments(StorageService.getAmendments());
    setReports(StorageService.getReports());
    setAuditLogs(StorageService.getAuditLogs());
    setNotifications(StorageService.getNotifications());
    setSettings(StorageService.getSettings());
    setThemes(StorageService.getThemes());
    setEntityConfigState(StorageService.getEntityConfig());
    setIsOnboardingCompletedState(StorageService.isOnboardingCompleted());
    showToast('Demo data successfully reset to initial AHDA baseline', 'success');
  };

  const updateUser = (updated: User) => {
    const updatedList = users.map((u) => (u.id === updated.id ? updated : u));
    setUsers(updatedList);
    StorageService.setUsers(updatedList);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_USER',
      record: `User ${updated.name}`,
      recordId: updated.id,
      previousValue: 'Status: updated',
      newValue: `Status: ${updated.status}, Role: ${updated.role}`,
      reason: 'Administrative user profile update',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`User ${updated.name} updated`, 'success');
  };

  const addUser = (newUser: User) => {
    const updatedList = [...users, newUser];
    setUsers(updatedList);
    StorageService.setUsers(updatedList);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'CREATE_USER',
      record: `User ${newUser.name}`,
      recordId: newUser.id,
      previousValue: 'None',
      newValue: `Created as ${newUser.role}`,
      reason: 'User onboarding',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`User ${newUser.name} created`, 'success');
  };

  const updateOrganization = (org: OrganizationUnit) => {
    const updated = organizations.map((o) => (o.id === org.id ? org : o));
    setOrganizations(updated);
    StorageService.setOrganizations(updated);
    showToast(`Organization unit ${org.name} updated`, 'success');
  };

  const addOrganization = (org: OrganizationUnit) => {
    const updated = [...organizations, org];
    setOrganizations(updated);
    StorageService.setOrganizations(updated);
    showToast(`Organization unit ${org.name} added`, 'success');
  };

  const updatePlan = (updatedPlan: Plan) => {
    const updated = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
    setPlans(updated);
    StorageService.setPlans(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_PLAN',
      record: updatedPlan.code,
      recordId: updatedPlan.id,
      previousValue: `Plan state changed`,
      newValue: `Status: ${updatedPlan.status}, Version: ${updatedPlan.version}`,
      reason: 'Strategic planning lifecycle modification',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Plan ${updatedPlan.code} updated`, 'success');
  };

  const addPlan = (plan: Plan) => {
    const updated = [...plans, plan];
    setPlans(updated);
    StorageService.setPlans(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'CREATE_PLAN',
      record: plan.code,
      recordId: plan.id,
      previousValue: 'None',
      newValue: `Created plan ${plan.code} (${plan.name})`,
      reason: 'Strategic planning cycle creation',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Plan ${plan.code} created`, 'success');
  };

  const updateObjective = (obj: StrategicObjective) => {
    const updated = objectives.map((o) => (o.id === obj.id ? obj : o));
    setObjectives(updated);
    StorageService.setObjectives(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_OBJECTIVE',
      record: obj.code,
      recordId: obj.id,
      previousValue: 'Updated',
      newValue: `${obj.name} (Weight: ${obj.weight}%)`,
      reason: 'Strategic objective adjustment',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Objective ${obj.code} updated`, 'success');
  };

  const addObjective = (obj: StrategicObjective) => {
    const updated = [...objectives, obj];
    setObjectives(updated);
    StorageService.setObjectives(updated);
    showToast(`Objective ${obj.code} created`, 'success');
  };

  const updateKpi = (kpi: KPI) => {
    const updated = kpis.map((k) => (k.id === kpi.id ? k : k));
    setKpis(updated);
    StorageService.setKpis(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_KPI',
      record: kpi.code,
      recordId: kpi.id,
      previousValue: 'Target / Baseline updated',
      newValue: `Target: ${kpi.target} ${kpi.unit}`,
      reason: 'KPI dictionary update',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`KPI ${kpi.code} updated`, 'success');
  };

  const addKpi = (kpi: KPI) => {
    const updated = [...kpis, kpi];
    setKpis(updated);
    StorageService.setKpis(updated);
    showToast(`KPI ${kpi.code} created`, 'success');
  };

  const updateResult = (res: PerformanceResult) => {
    const updated = results.map((r) => (r.id === res.id ? res : r));
    setResults(updated);
    StorageService.setResults(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: res.status === 'Approved' ? 'APPROVE_RESULT' : 'UPDATE_RESULT',
      record: `${res.kpiId} (${res.period})`,
      recordId: res.id,
      previousValue: `Status: changed`,
      newValue: `Status: ${res.status}, Actual: ${res.actual}`,
      reason: res.status === 'Returned' ? res.returnReason || 'Revision requested' : 'Performance collection workflow',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Result for ${res.kpiId} is now ${res.status}`, 'success');
  };

  const addResult = (res: PerformanceResult) => {
    const updated = [...results, res];
    setResults(updated);
    StorageService.setResults(updated);
    showToast(`Result for ${res.kpiId} submitted`, 'success');
  };

  const updateInitiative = (ini: Initiative) => {
    const updated = initiatives.map((i) => (i.id === ini.id ? ini : i));
    setInitiatives(updated);
    StorageService.setInitiatives(updated);
    showToast(`Initiative ${ini.code} updated`, 'success');
  };

  const addInitiative = (ini: Initiative) => {
    const updated = [...initiatives, ini];
    setInitiatives(updated);
    StorageService.setInitiatives(updated);
    showToast(`Initiative ${ini.code} created`, 'success');
  };

  const updateAction = (act: CorrectiveAction) => {
    const updated = actions.map((a) => (a.id === act.id ? act : a));
    setActions(updated);
    StorageService.setActions(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'UPDATE_ACTION',
      record: act.code,
      recordId: act.id,
      previousValue: 'Status changed',
      newValue: `Status: ${act.status}`,
      reason: 'Corrective action management',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Action ${act.code} status: ${act.status}`, 'success');
  };

  const addAction = (act: CorrectiveAction) => {
    const updated = [...actions, act];
    setActions(updated);
    StorageService.setActions(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'CREATE_ACTION',
      record: act.code,
      recordId: act.id,
      previousValue: 'None',
      newValue: `Created (${act.title})`,
      reason: 'Corrective action initiated',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Action ${act.code} created`, 'success');
  };

  const updateDiagnosis = (item: DiagnosisItem) => {
    const updated = diagnosis.map((d) => (d.id === item.id ? item : d));
    setDiagnosis(updated);
    StorageService.setDiagnosis(updated);
    showToast(`Diagnostic finding updated`, 'success');
  };

  const addDiagnosis = (item: DiagnosisItem) => {
    const updated = [...diagnosis, item];
    setDiagnosis(updated);
    StorageService.setDiagnosis(updated);
    showToast(`Diagnostic finding added`, 'success');
  };

  const updateOption = (option: StrategicOption) => {
    const updated = options.map((o) => (o.id === option.id ? option : o));
    setOptions(updated);
    StorageService.setOptions(updated);
    showToast(`Strategic option ${option.name} updated`, 'success');
  };

  const updateReview = (review: StrategyReviewMeeting) => {
    const updated = reviews.map((r) => (r.id === review.id ? review : r));
    setReviews(updated);
    StorageService.setReviews(updated);
    showToast(`Strategy review meeting updated`, 'success');
  };

  const addReview = (review: StrategyReviewMeeting) => {
    const updated = [...reviews, review];
    setReviews(updated);
    StorageService.setReviews(updated);
    showToast(`Strategy review recorded`, 'success');
  };

  const addAmendment = (amd: Amendment) => {
    const updated = [...amendments, amd];
    setAmendments(updated);
    StorageService.setAmendments(updated);
    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'CREATE_AMENDMENT',
      record: amd.code,
      recordId: amd.id,
      previousValue: `${amd.oldValue}`,
      newValue: `${amd.newValue}`,
      reason: amd.reason,
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Amendment ${amd.code} submitted`, 'success');
  };

  const updateAmendment = (amd: Amendment) => {
    const updated = amendments.map((a) => (a.id === amd.id ? amd : a));
    setAmendments(updated);
    StorageService.setAmendments(updated);

    // If approved, update target on the record
    if (amd.status === 'Approved' && amd.targetType === 'KPI_TARGET') {
      const targetKpi = kpis.find((k) => k.id === amd.targetRecordId);
      if (targetKpi) {
        const updatedKpi: KPI = {
          ...targetKpi,
          target: Number(amd.newValue),
          version: amd.versionGenerated,
        };
        updateKpi(updatedKpi);
      }
    }

    StorageService.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'APPROVE_AMENDMENT',
      record: amd.code,
      recordId: amd.id,
      previousValue: `${amd.oldValue}`,
      newValue: `Approved: ${amd.newValue}`,
      reason: `Amendment ratified: ${amd.reason}`,
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Amendment ${amd.code} is now ${amd.status}`, 'success');
  };

  const addReport = (rep: ExecutiveReport) => {
    const updated = [...reports, rep];
    setReports(updated);
    StorageService.setReports(updated);
    showToast(`Executive report snapshot created`, 'success');
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    StorageService.setNotifications(updated);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        session,
        login,
        logout,
        users,
        organizations,
        plans,
        perspectives,
        themes,
        objectives,
        relationships,
        kpis,
        results,
        initiatives,
        actions,
        risks,
        alignments,
        diagnosis,
        options,
        reviews,
        amendments,
        reports,
        auditLogs,
        notifications,
        settings,
        currentUser,
        entityConfig,
        updateEntityConfig,
        isOnboardingCompleted,
        setIsOnboardingCompleted,
        saveCompleteJourney,
        language,
        t,
        setLanguage,
        setRole,
        setPeriod,
        setPlan,
        checkPermission,
        selectedObjective,
        setSelectedObjective,
        selectedKpi,
        setSelectedKpi,
        selectedInitiative,
        setSelectedInitiative,
        selectedAction,
        setSelectedAction,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
        updateUser,
        addUser,
        updateOrganization,
        addOrganization,
        updatePlan,
        addPlan,
        updateObjective,
        addObjective,
        updateKpi,
        addKpi,
        updateResult,
        addResult,
        updateInitiative,
        addInitiative,
        updateAction,
        addAction,
        updateDiagnosis,
        addDiagnosis,
        updateOption,
        updateReview,
        addReview,
        addAmendment,
        updateAmendment,
        addReport,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
