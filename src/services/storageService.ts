import {
  INITIAL_ACTIONS,
  INITIAL_ALIGNMENTS,
  INITIAL_AMENDMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DIAGNOSIS,
  INITIAL_INITIATIVES,
  INITIAL_KPIS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPTIONS,
  INITIAL_ORGANIZATIONS,
  INITIAL_PERSPECTIVES,
  INITIAL_PLANS,
  INITIAL_RELATIONSHIPS,
  INITIAL_REPORTS,
  INITIAL_RESULTS,
  INITIAL_REVIEWS,
  INITIAL_RISKS,
  INITIAL_SETTINGS,
  INITIAL_THEMES,
  INITIAL_OBJECTIVES,
  INITIAL_USERS,
} from '../data/initialSeedData';
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
  StrategicObjective,
  StrategicOption,
  StrategicRisk,
  StrategicTheme,
  StrategyMapRelationship,
  StrategyReviewMeeting,
  User,
  RoleName,
  EntityConfig,
  JourneySetupData,
} from '../types';

export interface AuthSession {
  token: string;
  userId: string;
  role: RoleName;
  authenticatedAt: string;
  expiresAt: string;
  authMethod: 'persona' | 'nafath' | 'credentials';
}

export const DEFAULT_ENTITY_CONFIG: EntityConfig = {
  name: 'Al Ahsa Development Authority (AHDA)',
  nameAr: 'هيئة تطوير الأحساء',
  logo: '',
  primaryColor: '#059669',
  secondaryColor: '#0f766e',
  theme: 'emerald',
  mandate: 'Catalyzing sustainable socio-economic prosperity, preserving Al Ahsa oasis heritage, and delivering world-class civic and investment services.',
  mandateAr: 'تحفيز الازدهار الاقتصادي والاجتماعي المستدام، والحفاظ على تراث واحة الأحساء، وتقديم خدمات تنموية واستثمارية ومجتمعية عالمية المستوى.',
  sector: 'Regional Development & Municipal Authority',
  headquarters: 'Al Ahsa, Eastern Province, KSA',
  currency: 'SAR',
  fiscalYearStart: 'January 1',
  reviewFrequency: 'Quarterly',
  decimalPrecision: 1,
};

export const STORAGE_KEYS = {
  AUTH_SESSION: 'ahda_auth_session',
  USERS: 'ahda_users',
  ORGANIZATIONS: 'ahda_organizations',
  PLANS: 'ahda_plans',
  PERSPECTIVES: 'ahda_perspectives',
  THEMES: 'ahda_themes',
  OBJECTIVES: 'ahda_objectives',
  RELATIONSHIPS: 'ahda_relationships',
  KPIS: 'ahda_kpis',
  RESULTS: 'ahda_results',
  INITIATIVES: 'ahda_initiatives',
  ACTIONS: 'ahda_actions',
  RISKS: 'ahda_risks',
  ALIGNMENTS: 'ahda_alignments',
  DIAGNOSIS: 'ahda_diagnosis',
  OPTIONS: 'ahda_options',
  REVIEWS: 'ahda_reviews',
  AMENDMENTS: 'ahda_amendments',
  REPORTS: 'ahda_reports',
  AUDIT_LOG: 'ahda_audit_log',
  NOTIFICATIONS: 'ahda_notifications',
  SETTINGS: 'ahda_settings',
  ENTITY_CONFIG: 'ahda_entity_config',
  ONBOARDING_COMPLETED: 'ahda_onboarding_completed',
} as const;

export class StorageService {
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving localStorage key "${key}":`, e);
    }
  }

  public static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetDemo();
    } else {
      // Migrate any legacy @ahda.gov.sa emails in localStorage to @test.com
      try {
        const users = this.getUsers();
        let hasLegacy = false;
        const updatedUsers = users.map((u) => {
          if (u.email && u.email.includes('@ahda.gov.sa')) {
            hasLegacy = true;
            return { ...u, email: u.email.replace('@ahda.gov.sa', '@test.com') };
          }
          return u;
        });
        if (hasLegacy) {
          this.setItem(STORAGE_KEYS.USERS, updatedUsers);
        }
      } catch (e) {
        console.warn('Error migrating legacy emails in localStorage:', e);
      }
    }
  }

  public static resetDemo(): void {
    this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    this.setItem(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    this.setItem(STORAGE_KEYS.PERSPECTIVES, INITIAL_PERSPECTIVES);
    this.setItem(STORAGE_KEYS.THEMES, INITIAL_THEMES);
    this.setItem(STORAGE_KEYS.OBJECTIVES, INITIAL_OBJECTIVES);
    this.setItem(STORAGE_KEYS.RELATIONSHIPS, INITIAL_RELATIONSHIPS);
    this.setItem(STORAGE_KEYS.KPIS, INITIAL_KPIS);
    this.setItem(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    this.setItem(STORAGE_KEYS.INITIATIVES, INITIAL_INITIATIVES);
    this.setItem(STORAGE_KEYS.ACTIONS, INITIAL_ACTIONS);
    this.setItem(STORAGE_KEYS.RISKS, INITIAL_RISKS);
    this.setItem(STORAGE_KEYS.ALIGNMENTS, INITIAL_ALIGNMENTS);
    this.setItem(STORAGE_KEYS.DIAGNOSIS, INITIAL_DIAGNOSIS);
    this.setItem(STORAGE_KEYS.OPTIONS, INITIAL_OPTIONS);
    this.setItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    this.setItem(STORAGE_KEYS.AMENDMENTS, INITIAL_AMENDMENTS);
    this.setItem(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    this.setItem(STORAGE_KEYS.AUDIT_LOG, INITIAL_AUDIT_LOGS);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  // Getters
  public static getUsers(): User[] {
    return this.getItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  public static getOrganizations(): OrganizationUnit[] {
    return this.getItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  }
  public static getPlans(): Plan[] {
    return this.getItem(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  }
  public static getPerspectives(): Perspective[] {
    return this.getItem(STORAGE_KEYS.PERSPECTIVES, INITIAL_PERSPECTIVES);
  }
  public static getThemes(): StrategicTheme[] {
    return this.getItem(STORAGE_KEYS.THEMES, INITIAL_THEMES);
  }
  public static getObjectives(): StrategicObjective[] {
    return this.getItem(STORAGE_KEYS.OBJECTIVES, INITIAL_OBJECTIVES);
  }
  public static getRelationships(): StrategyMapRelationship[] {
    return this.getItem(STORAGE_KEYS.RELATIONSHIPS, INITIAL_RELATIONSHIPS);
  }
  public static getKpis(): KPI[] {
    return this.getItem(STORAGE_KEYS.KPIS, INITIAL_KPIS);
  }
  public static getResults(): PerformanceResult[] {
    return this.getItem(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
  }
  public static getInitiatives(): Initiative[] {
    return this.getItem(STORAGE_KEYS.INITIATIVES, INITIAL_INITIATIVES);
  }
  public static getActions(): CorrectiveAction[] {
    return this.getItem(STORAGE_KEYS.ACTIONS, INITIAL_ACTIONS);
  }
  public static getRisks(): StrategicRisk[] {
    return this.getItem(STORAGE_KEYS.RISKS, INITIAL_RISKS);
  }
  public static getAlignments(): DepartmentAlignment[] {
    return this.getItem(STORAGE_KEYS.ALIGNMENTS, INITIAL_ALIGNMENTS);
  }
  public static getDiagnosis(): DiagnosisItem[] {
    return this.getItem(STORAGE_KEYS.DIAGNOSIS, INITIAL_DIAGNOSIS);
  }
  public static getOptions(): StrategicOption[] {
    return this.getItem(STORAGE_KEYS.OPTIONS, INITIAL_OPTIONS);
  }
  public static getReviews(): StrategyReviewMeeting[] {
    return this.getItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  public static getAmendments(): Amendment[] {
    return this.getItem(STORAGE_KEYS.AMENDMENTS, INITIAL_AMENDMENTS);
  }
  public static getReports(): ExecutiveReport[] {
    return this.getItem(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  }
  public static getAuditLogs(): AuditLog[] {
    return this.getItem(STORAGE_KEYS.AUDIT_LOG, INITIAL_AUDIT_LOGS);
  }
  public static getNotifications(): NotificationItem[] {
    return this.getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  public static getSettings(): AppSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  // Setters
  public static setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }
  public static setOrganizations(orgs: OrganizationUnit[]): void {
    this.setItem(STORAGE_KEYS.ORGANIZATIONS, orgs);
  }
  public static setPlans(plans: Plan[]): void {
    this.setItem(STORAGE_KEYS.PLANS, plans);
  }
  public static setThemes(themes: StrategicTheme[]): void {
    this.setItem(STORAGE_KEYS.THEMES, themes);
  }
  public static setObjectives(objectives: StrategicObjective[]): void {
    this.setItem(STORAGE_KEYS.OBJECTIVES, objectives);
  }
  public static setRelationships(rels: StrategyMapRelationship[]): void {
    this.setItem(STORAGE_KEYS.RELATIONSHIPS, rels);
  }
  public static setKpis(kpis: KPI[]): void {
    this.setItem(STORAGE_KEYS.KPIS, kpis);
  }
  public static setResults(results: PerformanceResult[]): void {
    this.setItem(STORAGE_KEYS.RESULTS, results);
  }
  public static setInitiatives(initiatives: Initiative[]): void {
    this.setItem(STORAGE_KEYS.INITIATIVES, initiatives);
  }
  public static setActions(actions: CorrectiveAction[]): void {
    this.setItem(STORAGE_KEYS.ACTIONS, actions);
  }
  public static setRisks(risks: StrategicRisk[]): void {
    this.setItem(STORAGE_KEYS.RISKS, risks);
  }
  public static setAlignments(alignments: DepartmentAlignment[]): void {
    this.setItem(STORAGE_KEYS.ALIGNMENTS, alignments);
  }
  public static setDiagnosis(items: DiagnosisItem[]): void {
    this.setItem(STORAGE_KEYS.DIAGNOSIS, items);
  }
  public static setOptions(opts: StrategicOption[]): void {
    this.setItem(STORAGE_KEYS.OPTIONS, opts);
  }
  public static setReviews(reviews: StrategyReviewMeeting[]): void {
    this.setItem(STORAGE_KEYS.REVIEWS, reviews);
  }
  public static setAmendments(amendments: Amendment[]): void {
    this.setItem(STORAGE_KEYS.AMENDMENTS, amendments);
  }
  public static setReports(reports: ExecutiveReport[]): void {
    this.setItem(STORAGE_KEYS.REPORTS, reports);
  }
  public static setAuditLogs(logs: AuditLog[]): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOG, logs);
  }
  public static setNotifications(notifications: NotificationItem[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
  public static setSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Authentication Session helpers
  public static getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!data) return null;
      const session = JSON.parse(data) as AuthSession;
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        return null;
      }
      return session;
    } catch (e) {
      console.warn('Error reading auth session:', e);
      return null;
    }
  }

  public static setSession(session: AuthSession): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Error saving auth session:', e);
    }
  }

  public static clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch (e) {
      console.error('Error clearing auth session:', e);
    }
  }

  // Entity Configuration helpers
  public static getEntityConfig(): EntityConfig {
    return this.getItem(STORAGE_KEYS.ENTITY_CONFIG, DEFAULT_ENTITY_CONFIG);
  }

  public static setEntityConfig(config: EntityConfig): void {
    this.setItem(STORAGE_KEYS.ENTITY_CONFIG, config);
  }

  // Onboarding status
  public static isOnboardingCompleted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
    } catch {
      return false;
    }
  }

  public static setOnboardingCompleted(completed: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, String(completed));
    } catch (e) {
      console.error('Error saving onboarding completed status:', e);
    }
  }

  // Save complete journey setup data to localStorage
  public static saveCompleteJourney(data: JourneySetupData): void {
    this.setEntityConfig(data.entity);
    this.setOrganizations(data.organizationUnits);
    this.setUsers(data.users);
    
    // Ensure the new/updated plan is in the plans array
    const existingPlans = this.getPlans();
    const planIndex = existingPlans.findIndex((p) => p.id === data.plan.id || p.code === data.plan.code);
    if (planIndex >= 0) {
      existingPlans[planIndex] = data.plan;
      this.setPlans(existingPlans);
    } else {
      this.setPlans([data.plan, ...existingPlans]);
    }

    this.setThemes(data.themes);
    this.setObjectives(data.objectives);
    this.setKpis(data.kpis);
    this.setInitiatives(data.initiatives);
    if (data.results && data.results.length > 0) {
      this.setResults(data.results);
    }
    this.setOnboardingCompleted(true);
  }

  // Audit Log helper
  public static addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.setAuditLogs([newLog, ...logs]);
  }
}

