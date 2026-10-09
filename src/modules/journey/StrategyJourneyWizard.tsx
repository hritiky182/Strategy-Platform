import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Layers,
  Compass,
  Table,
  LineChart,
  Rocket,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  ShieldCheck,
  Target,
  Palette,
  Eye,
  RotateCcw,
  Sliders,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import {
  EntityConfig,
  OrganizationUnit,
  User,
  Plan,
  StrategicTheme,
  StrategicObjective,
  KPI,
  Initiative,
  RoleName,
} from '../../types';
import {
  SAMPLE_DEMO_JOURNEY,
  generateAiSuggestionsForObjective,
  AiObjectiveRecommendation,
} from './demoJourneyData';

// 8 Step Definitions grouped into the 4 MOM Chapters
const CHAPTERS = [
  {
    id: 1,
    title: 'Chapter 1: Entity & Organization Setup',
    titleAr: 'الفصل 1: إعداد الهيئة والهوية',
    steps: [
      {
        id: 1,
        name: 'Entity Setup & Branding',
        nameAr: 'إعداد الهيئة والهوية',
        icon: Building2,
        desc: 'Name, logo, colors & institutional parameters',
      },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: Organization Structure & Permissions',
    titleAr: 'الفصل 2: الهيكل التنظيمي والصلاحيات',
    steps: [
      {
        id: 2,
        name: 'Organization Hierarchy',
        nameAr: 'الهيكل التنظيمي والإدارات',
        icon: Layers,
        desc: 'CEO level down to units & management layers',
      },
      {
        id: 3,
        name: 'Users, Roles & Authority',
        nameAr: 'المستخدمين والأدوار والصلاحيات',
        icon: Users,
        desc: 'Roles, responsibilities & maker-checker rules',
      },
    ],
  },
  {
    id: 3,
    title: 'Chapter 3: Strategy Planning (Core Demonstration)',
    titleAr: 'الفصل 3: التخطيط الاستراتيجي المتكامل',
    steps: [
      {
        id: 4,
        name: 'Strategy Foundation & Pillars',
        nameAr: 'الرؤية والرسالة والمحاور',
        icon: Compass,
        desc: 'Vision, mission, values & strategic pillars',
      },
      {
        id: 5,
        name: 'Strategic Objectives & AI',
        nameAr: 'الأهداف الاستراتيجية ومساعد الذكاء',
        icon: Target,
        desc: 'Objectives mapped to pillars + AI suggestions',
      },
      {
        id: 6,
        name: 'KPI Definition & Rules',
        nameAr: 'مؤشرات الأداء (KPIs) وقواعد القياس',
        icon: LineChart,
        desc: 'Targets, actuals, calculation formulas & thresholds',
      },
      {
        id: 7,
        name: 'Initiatives & Execution',
        nameAr: 'المبادرات الاستراتيجية والتنفيذ',
        icon: Rocket,
        desc: 'Milestones, budgets & AI description assist',
      },
    ],
  },
  {
    id: 4,
    title: 'Chapter 4: Monitoring & Platform Launch',
    titleAr: 'الفصل 4: المتابعة وإطلاق المنصة',
    steps: [
      {
        id: 8,
        name: 'Review & Activate Platform',
        nameAr: 'المراجعة واعتماد المنصة',
        icon: CheckCircle2,
        desc: 'Summary verification & launch to live dashboards',
      },
    ],
  },
];

export const StrategyJourneyWizard: React.FC = () => {
  const {
    language,
    saveCompleteJourney,
    showToast,
    entityConfig: currentEntityConfig,
    currentUser,
  } = useApp();

  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // ==========================================
  // FORM STATES - INITIALIZED BLANK (EMPTY)
  // Per requirement: "dont show the prefilled data in the step for we can add and button to fill demo data or user can add the data by himself"
  // ==========================================

  // Step 1: Entity & Branding
  const [entityName, setEntityName] = useState<string>('');
  const [entityNameAr, setEntityNameAr] = useState<string>('');
  const [entityLogo, setEntityLogo] = useState<string>('crest');
  const [primaryColor, setPrimaryColor] = useState<string>('#059669');
  const [secondaryColor, setSecondaryColor] = useState<string>('#0f766e');
  const [themeMode, setThemeMode] = useState<'emerald' | 'navy' | 'royal' | 'obsidian'>('emerald');
  const [mandate, setMandate] = useState<string>('');
  const [mandateAr, setMandateAr] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [headquarters, setHeadquarters] = useState<string>('');
  const [currency, setCurrency] = useState<string>('SAR');
  const [fiscalYearStart, setFiscalYearStart] = useState<string>('January 1');
  const [reviewFrequency, setReviewFrequency] = useState<'Quarterly' | 'Monthly' | 'Annual'>('Quarterly');

  // Step 2: Org Hierarchy & Layers
  const [orgUnits, setOrgUnits] = useState<OrganizationUnit[]>([]);
  const [newUnitCode, setNewUnitCode] = useState<string>('');
  const [newUnitName, setNewUnitName] = useState<string>('');
  const [newUnitNameAr, setNewUnitNameAr] = useState<string>('');
  const [newUnitParent, setNewUnitParent] = useState<string>('');
  const [newUnitManager, setNewUnitManager] = useState<string>('');

  // Step 3: Users, Roles & Permissions
  const [usersList, setUsersList] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserNameAr, setNewUserNameAr] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<RoleName>('Department Head');
  const [newUserDept, setNewUserDept] = useState<string>('');
  const [newUserTitle, setNewUserTitle] = useState<string>('');
  const [makerCheckerEnabled, setMakerCheckerEnabled] = useState<boolean>(true);

  // Step 4: Strategy Foundation & Pillars
  const [strategyName, setStrategyName] = useState<string>('');
  const [strategyNameAr, setStrategyNameAr] = useState<string>('');
  const [strategyHorizon, setStrategyHorizon] = useState<string>('2027–2030');
  const [strategyStatement, setStrategyStatement] = useState<string>('');
  const [vision, setVision] = useState<string>('');
  const [visionAr, setVisionAr] = useState<string>('');
  const [mission, setMission] = useState<string>('');
  const [missionAr, setMissionAr] = useState<string>('');
  const [valuesInput, setValuesInput] = useState<string>('');
  const [themesList, setThemesList] = useState<StrategicTheme[]>([]);
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [newThemeNameAr, setNewThemeNameAr] = useState<string>('');
  const [newThemeDesc, setNewThemeDesc] = useState<string>('');

  // Step 5: Objectives & AI Recommendations
  const [objectivesList, setObjectivesList] = useState<StrategicObjective[]>([]);
  const [newObjCode, setNewObjCode] = useState<string>('');
  const [newObjName, setNewObjName] = useState<string>('');
  const [newObjNameAr, setNewObjNameAr] = useState<string>('');
  const [newObjThemeId, setNewObjThemeId] = useState<string>('');
  const [newObjPerspective, setNewObjPerspective] = useState<string>('PERSP-01');
  const [newObjOwner, setNewObjOwner] = useState<string>('');
  const [newObjWeight, setNewObjWeight] = useState<number>(25);
  const [newObjDesc, setNewObjDesc] = useState<string>('');
  const [activeAiObjModal, setActiveAiObjModal] = useState<StrategicObjective | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiObjectiveRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Step 6: KPI Definition & Management
  const [kpisList, setKpisList] = useState<KPI[]>([]);
  const [newKpiCode, setNewKpiCode] = useState<string>('');
  const [newKpiName, setNewKpiName] = useState<string>('');
  const [newKpiNameAr, setNewKpiNameAr] = useState<string>('');
  const [newKpiObjId, setNewKpiObjId] = useState<string>('');
  const [newKpiUnit, setNewKpiUnit] = useState<string>('%');
  const [newKpiTarget, setNewKpiTarget] = useState<number>(100);
  const [newKpiActual, setNewKpiActual] = useState<number>(85);
  const [newKpiBaseline, setNewKpiBaseline] = useState<number>(50);
  const [newKpiFormula, setNewKpiFormula] = useState<string>('(Actual / Target) * 100');
  const [newKpiFrequency, setNewKpiFrequency] = useState<'Quarterly' | 'Monthly'>('Quarterly');
  const [newKpiOwner, setNewKpiOwner] = useState<string>('');

  // Step 7: Initiatives & Projects
  const [initiativesList, setInitiativesList] = useState<Initiative[]>([]);
  const [newIniCode, setNewIniCode] = useState<string>('');
  const [newIniName, setNewIniName] = useState<string>('');
  const [newIniNameAr, setNewIniNameAr] = useState<string>('');
  const [newIniObjId, setNewIniObjId] = useState<string>('');
  const [newIniOwner, setNewIniOwner] = useState<string>('');
  const [newIniBudget, setNewIniBudget] = useState<number>(10000000);
  const [newIniStatus, setNewIniStatus] = useState<Initiative['status']>('In Progress');
  const [newIniDesc, setNewIniDesc] = useState<string>('');
  const [isAiRefiningIni, setIsAiRefiningIni] = useState<boolean>(false);

  // ==========================================
  // ACTION: "✨ AUTO-FILL DEMO DATA" BUTTON
  // Populates full realistic journey data for the presenter on demand!
  // ==========================================
  const handleAutoFillDemoData = () => {
    const demo = SAMPLE_DEMO_JOURNEY;

    // Entity & branding
    setEntityName(demo.entity.name);
    setEntityNameAr(demo.entity.nameAr);
    setEntityLogo(demo.entity.logo);
    setPrimaryColor(demo.entity.primaryColor);
    setSecondaryColor(demo.entity.secondaryColor);
    setThemeMode(demo.entity.theme);
    setMandate(demo.entity.mandate);
    setMandateAr(demo.entity.mandateAr);
    setSector(demo.entity.sector);
    setHeadquarters(demo.entity.headquarters);
    setCurrency(demo.entity.currency);
    setFiscalYearStart(demo.entity.fiscalYearStart);
    setReviewFrequency(demo.entity.reviewFrequency);

    // Organization Hierarchy
    setOrgUnits([...demo.organizationUnits]);

    // Users
    setUsersList([...demo.users]);
    setMakerCheckerEnabled(true);

    // Strategy Foundation & Pillars
    setStrategyName(demo.plan.name);
    setStrategyNameAr(demo.plan.nameAr);
    setStrategyHorizon(demo.plan.horizon);
    setStrategyStatement(demo.plan.mandate);
    setVision(demo.plan.vision);
    setVisionAr(demo.plan.visionAr);
    setMission(demo.plan.mission);
    setMissionAr(demo.plan.missionAr);
    setValuesInput(demo.plan.values.join(', '));
    setThemesList([...demo.themes]);

    // Objectives
    setObjectivesList([...demo.objectives]);

    // KPIs
    setKpisList([...demo.kpis]);

    // Initiatives
    setInitiativesList([...demo.initiatives]);

    // Mark steps as completed
    setCompletedSteps([1, 2, 3, 4, 5, 6, 7]);

    showToast(
      isArabic
        ? 'تم تحميل بيانات الرحلة التجريبية لهيئة تطوير الأحساء بنجاح!'
        : '✨ Realistic Al Ahsa Authority Demo Journey loaded across all steps!',
      'success'
    );
  };

  // Clear current step fields back to blank
  const handleClearCurrentStep = () => {
    switch (currentStep) {
      case 1:
        setEntityName('');
        setEntityNameAr('');
        setMandate('');
        setMandateAr('');
        setSector('');
        setHeadquarters('');
        break;
      case 2:
        setOrgUnits([]);
        break;
      case 3:
        setUsersList([]);
        break;
      case 4:
        setStrategyName('');
        setStrategyNameAr('');
        setVision('');
        setVisionAr('');
        setMission('');
        setMissionAr('');
        setValuesInput('');
        setThemesList([]);
        break;
      case 5:
        setObjectivesList([]);
        break;
      case 6:
        setKpisList([]);
        break;
      case 7:
        setInitiativesList([]);
        break;
      default:
        break;
    }
    showToast(isArabic ? 'تم تفريغ حقول الخطوة الحالية' : 'Current step fields reset to blank', 'info');
  };

  // Add a new organization unit
  const handleAddOrgUnit = () => {
    if (!newUnitName.trim()) {
      showToast('Please provide an organizational unit name', 'warning');
      return;
    }
    const id = `ORG-${Date.now().toString().slice(-4)}`;
    const code = newUnitCode.trim() || `UNIT-${orgUnits.length + 1}`;
    const newUnit: OrganizationUnit = {
      id,
      code,
      name: newUnitName.trim(),
      nameAr: newUnitNameAr.trim() || newUnitName.trim(),
      parentId: newUnitParent || (orgUnits.length > 0 ? orgUnits[0].id : null),
      managerId: 'USR-02',
      managerName: newUnitManager.trim() || 'Assigned Lead',
      status: 'active',
      order: orgUnits.length + 1,
    };
    setOrgUnits([...orgUnits, newUnit]);
    setNewUnitCode('');
    setNewUnitName('');
    setNewUnitNameAr('');
    setNewUnitManager('');
    showToast(`Added unit: ${newUnit.name}`, 'success');
  };

  // Add a new user
  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Please provide user name and email', 'warning');
      return;
    }
    const id = `USR-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      id,
      name: newUserName.trim(),
      nameAr: newUserNameAr.trim() || newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      departmentId: newUserDept || (orgUnits[0]?.id || 'ORG-01'),
      status: 'active',
      effectiveFrom: '2025-01-01',
      effectiveTo: '2030-12-31',
      title: newUserTitle.trim() || newUserRole,
      titleAr: newUserTitle.trim() || newUserRole,
    };
    setUsersList([...usersList, newUser]);
    setNewUserName('');
    setNewUserNameAr('');
    setNewUserEmail('');
    setNewUserTitle('');
    showToast(`Added user: ${newUser.name} (${newUser.role})`, 'success');
  };

  // Add a new strategic pillar / theme
  const handleAddTheme = () => {
    if (!newThemeName.trim()) {
      showToast('Please provide a strategic theme name', 'warning');
      return;
    }
    const id = `TH-${Date.now().toString().slice(-4)}`;
    const code = `TH-0${themesList.length + 1}`;
    const newTheme: StrategicTheme = {
      id,
      code,
      name: newThemeName.trim(),
      nameAr: newThemeNameAr.trim() || newThemeName.trim(),
      description: newThemeDesc.trim() || 'Strategic pillar focused on institutional impact.',
      descriptionAr: newThemeDesc.trim() || 'ركيزة استراتيجية لتحقيق الأثر المؤسسي.',
    };
    setThemesList([...themesList, newTheme]);
    setNewThemeName('');
    setNewThemeNameAr('');
    setNewThemeDesc('');
    showToast(`Added Pillar: ${newTheme.name}`, 'success');
  };

  // Add a new strategic objective
  const handleAddObjective = () => {
    if (!newObjName.trim()) {
      showToast('Please provide objective name', 'warning');
      return;
    }
    const id = `OBJ-P${(objectivesList.length + 1).toString().padStart(2, '0')}`;
    const code = newObjCode.trim() || id;
    const newObj: StrategicObjective = {
      id,
      code,
      name: newObjName.trim(),
      nameAr: newObjNameAr.trim() || newObjName.trim(),
      perspectiveId: newObjPerspective,
      themeId: newObjThemeId || (themesList[0]?.id || 'TH-01'),
      departmentId: orgUnits[1]?.id || orgUnits[0]?.id || 'ORG-01',
      contributingDepartmentIds: [],
      ownerId: 'USR-02',
      ownerName: newObjOwner.trim() || 'Saad Al-Otaibi',
      weight: newObjWeight,
      description: newObjDesc.trim() || 'Strategic objective for performance execution.',
      descriptionAr: newObjDesc.trim() || 'هدف استراتيجي لتحقيق التميز المؤسسي.',
      planId: 'PLAN-01',
    };
    setObjectivesList([...objectivesList, newObj]);
    setNewObjCode('');
    setNewObjName('');
    setNewObjNameAr('');
    setNewObjDesc('');
    showToast(`Added Objective: ${newObj.code}`, 'success');
  };

  // AI Recommendation Trigger for Objective (MOM Section 10)
  const handleTriggerAiForObjective = (obj: StrategicObjective) => {
    setActiveAiObjModal(obj);
    setIsAiLoading(true);
    setTimeout(() => {
      const recs = generateAiSuggestionsForObjective(obj.name);
      setAiSuggestions(recs);
      setIsAiLoading(false);
    }, 450);
  };

  // Apply AI Suggested KPI
  const handleApplyAiKpi = (sugKpi: NonNullable<AiObjectiveRecommendation>['suggestedKpis'][0]) => {
    if (!activeAiObjModal) return;
    const id = `KPI-${(kpisList.length + 1).toString().padStart(2, '0')}`;
    const kpi: KPI = {
      id,
      code: id,
      name: sugKpi.name,
      nameAr: sugKpi.name,
      objectiveId: activeAiObjModal.id,
      departmentId: activeAiObjModal.departmentId,
      definition: sugKpi.description,
      definitionAr: sugKpi.description,
      unit: sugKpi.unit,
      formula: sugKpi.formula,
      direction: 'higher',
      baseline: sugKpi.baseline,
      baselineDate: '2026-01-01',
      target: sugKpi.target,
      weight: 50,
      frequency: sugKpi.frequency,
      source: 'AI-Recommended Metric Engine',
      ownerId: activeAiObjModal.ownerId,
      updaterId: activeAiObjModal.ownerId,
      reviewerId: 'USR-02',
      aggregationMethod: 'Average',
      thresholds: {
        green: sugKpi.target * 0.9,
        amber: sugKpi.target * 0.75,
      },
      evidenceRequirement: 'Official verified performance documentation',
      version: 'v1.0',
      status: 'active',
    };
    setKpisList([...kpisList, kpi]);
    showToast(`✨ Added AI-suggested KPI: ${kpi.name}`, 'success');
  };

  // Apply AI Suggested Initiative
  const handleApplyAiInitiative = (sugIni: NonNullable<AiObjectiveRecommendation>['suggestedInitiatives'][0]) => {
    if (!activeAiObjModal) return;
    const id = `INI-${(initiativesList.length + 1).toString().padStart(2, '0')}`;
    const ini: Initiative = {
      id,
      code: id,
      name: sugIni.name,
      nameAr: sugIni.name,
      description: sugIni.description,
      descriptionAr: sugIni.description,
      objectiveId: activeAiObjModal.id,
      departmentId: activeAiObjModal.departmentId,
      sponsorId: 'USR-08',
      ownerId: activeAiObjModal.ownerId,
      startDate: '2027-01-01',
      endDate: '2028-12-31',
      budget: sugIni.budget,
      actualCost: 0,
      progress: 15,
      status: sugIni.status,
      scope: sugIni.description,
      dependencies: 'Cross-functional alignment',
      risks: 'Resource mobilization cadence',
      benefitKpiIds: [],
      expectedOutcomes: 'Direct tangible contribution to linked strategic objective.',
      milestones: [
        { id: 'M-AI-01', name: 'Charter & Scoping Sign-off', nameAr: 'اعتماد الميثاق والنطاق', dueDate: '2027-03-31', completed: false, weight: 100 },
      ],
    };
    setInitiativesList([...initiativesList, ini]);
    showToast(`✨ Added AI-suggested Initiative: ${ini.name}`, 'success');
  };

  // Add a new KPI manually
  const handleAddKpi = () => {
    if (!newKpiName.trim()) {
      showToast('Please provide KPI name', 'warning');
      return;
    }
    const id = `KPI-${(kpisList.length + 1).toString().padStart(2, '0')}`;
    const code = newKpiCode.trim() || id;
    const newKpi: KPI = {
      id,
      code,
      name: newKpiName.trim(),
      nameAr: newKpiNameAr.trim() || newKpiName.trim(),
      objectiveId: newKpiObjId || (objectivesList[0]?.id || 'OBJ-P01'),
      departmentId: orgUnits[1]?.id || 'ORG-02',
      definition: `Target vs actual measurement for ${newKpiName}`,
      definitionAr: `قياس المستهدف والمتحقق لمؤشر ${newKpiName}`,
      unit: newKpiUnit,
      formula: newKpiFormula,
      direction: 'higher',
      baseline: newKpiBaseline,
      baselineDate: '2026-01-01',
      target: newKpiTarget,
      weight: 50,
      frequency: newKpiFrequency,
      source: 'Directorate Performance Logs',
      ownerId: 'USR-02',
      updaterId: 'USR-02',
      reviewerId: 'USR-08',
      aggregationMethod: 'Average',
      thresholds: {
        green: newKpiTarget * 0.9,
        amber: newKpiTarget * 0.75,
      },
      evidenceRequirement: 'Official operational sign-off and system telemetry',
      version: 'v1.0',
      status: 'active',
    };
    setKpisList([...kpisList, newKpi]);
    setNewKpiCode('');
    setNewKpiName('');
    setNewKpiNameAr('');
    showToast(`Added KPI: ${newKpi.code}`, 'success');
  };

  // Add a new Initiative manually
  const handleAddInitiative = () => {
    if (!newIniName.trim()) {
      showToast('Please provide initiative name', 'warning');
      return;
    }
    const id = `INI-${(initiativesList.length + 1).toString().padStart(2, '0')}`;
    const code = newIniCode.trim() || id;
    const newIni: Initiative = {
      id,
      code,
      name: newIniName.trim(),
      nameAr: newIniNameAr.trim() || newIniName.trim(),
      description: newIniDesc.trim() || 'Strategic initiative driving execution milestone delivery.',
      descriptionAr: newIniDesc.trim() || 'مبادرة استراتيجية لدفع وتيرة الإنجاز المؤسسي.',
      objectiveId: newIniObjId || (objectivesList[0]?.id || 'OBJ-P01'),
      departmentId: orgUnits[1]?.id || 'ORG-02',
      sponsorId: 'USR-08',
      ownerId: 'USR-02',
      startDate: '2027-01-01',
      endDate: '2028-12-31',
      budget: newIniBudget,
      actualCost: 0,
      progress: 25,
      status: newIniStatus,
      scope: newIniDesc.trim() || 'Execution milestone delivery',
      dependencies: 'Operational governance',
      risks: 'Vendor execution timeline constraints',
      benefitKpiIds: [],
      expectedOutcomes: 'Direct strategic milestone achievement.',
      milestones: [
        { id: 'M-1', name: 'Initiative Kickoff & Stakeholder Charter', nameAr: 'بدء المبادرة والميثاق', dueDate: '2027-03-31', completed: false, weight: 100 },
      ],
    };
    setInitiativesList([...initiativesList, newIni]);
    setNewIniCode('');
    setNewIniName('');
    setNewIniNameAr('');
    setNewIniDesc('');
    showToast(`Added Initiative: ${newIni.code}`, 'success');
  };

  // AI Refine Initiative scope & description
  const handleAiRefineInitiative = () => {
    setIsAiRefiningIni(true);
    setTimeout(() => {
      setNewIniDesc(
        'Comprehensive multi-phase initiative establishing institutional governance, agile deployment sprints, integrated data-verification checkpoints, and cross-directorate stakeholder alignment.'
      );
      setIsAiRefiningIni(false);
      showToast('✨ AI refined initiative scope & strategic phrasing!', 'success');
    }, 400);
  };

  // Next / Previous navigation
  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Action: Save & Launch Platform!
  const handleLaunchPlatform = () => {
    // If user filled nothing, use fallback defaults or prompt
    const finalEntity: EntityConfig = {
      name: entityName.trim() || 'Al Ahsa Development Authority (AHDA)',
      nameAr: entityNameAr.trim() || 'هيئة تطوير الأحساء',
      logo: entityLogo,
      primaryColor: primaryColor || '#059669',
      secondaryColor: secondaryColor || '#0f766e',
      theme: themeMode,
      mandate: mandate.trim() || 'Catalyzing sustainable socio-economic prosperity, preserving Al Ahsa oasis heritage.',
      mandateAr: mandateAr.trim() || 'تحفيز الازدهار الاقتصادي والاجتماعي المستدام، والحفاظ على تراث واحة الأحساء.',
      sector: sector.trim() || 'Regional Development Authority',
      headquarters: headquarters.trim() || 'Al Ahsa, Eastern Province, KSA',
      currency,
      fiscalYearStart,
      reviewFrequency,
      decimalPrecision: 1,
    };

    const finalOrgs =
      orgUnits.length > 0 ? orgUnits : SAMPLE_DEMO_JOURNEY.organizationUnits;
    const finalUsers =
      usersList.length > 0 ? usersList : SAMPLE_DEMO_JOURNEY.users;
    const finalThemes =
      themesList.length > 0 ? themesList : SAMPLE_DEMO_JOURNEY.themes;
    const finalObjectives =
      objectivesList.length > 0 ? objectivesList : SAMPLE_DEMO_JOURNEY.objectives;
    const finalKpis =
      kpisList.length > 0 ? kpisList : SAMPLE_DEMO_JOURNEY.kpis;
    const finalInitiatives =
      initiativesList.length > 0 ? initiativesList : SAMPLE_DEMO_JOURNEY.initiatives;

    const finalPlan: Plan = {
      id: 'PLAN-01',
      code: 'STR-2027-2030',
      name: strategyName.trim() || `${finalEntity.name} Strategic Plan 2027-2030`,
      nameAr: strategyNameAr.trim() || `خطة ${finalEntity.nameAr} الاستراتيجية 2027-2030`,
      ownerId: 'USR-02',
      orgId: finalOrgs[0]?.id || 'ORG-01',
      framework: 'Balanced Scorecard (BSC)',
      horizon: strategyHorizon,
      reportingFrequency: reviewFrequency,
      period: 'Q1 2027',
      reviewers: ['USR-08', 'USR-02'],
      deadlines: '2027-04-15',
      status: 'Published',
      version: 'v1.0',
      publishedAt: '2026-12-28',
      mandate: strategyStatement.trim() || finalEntity.mandate,
      mandateAr: finalEntity.mandateAr,
      vision: vision.trim() || 'Premier oasis economy and vibrant sustainable cultural sanctuary by 2030.',
      visionAr: visionAr.trim() || 'اقتصاد واحة رائد عالمياً ووجهة ثقافية مستدامة بحلول 2030.',
      mission: mission.trim() || 'Orchestrate integrated regional development and agile strategic execution.',
      missionAr: missionAr.trim() || 'قيادة التنمية الإقليمية المتكاملة وتنفيذ استراتيجي مرن.',
      values: valuesInput
        ? valuesInput.split(',').map((v) => v.trim()).filter(Boolean)
        : ['Excellence', 'Stewardship', 'Innovation', 'Integrity'],
      valuesAr: ['التميز', 'الاستدامة', 'الابتكار', 'النزاهة'],
    };

    saveCompleteJourney({
      entity: finalEntity,
      organizationUnits: finalOrgs,
      users: finalUsers,
      plan: finalPlan,
      themes: finalThemes,
      objectives: finalObjectives,
      kpis: finalKpis,
      initiatives: finalInitiatives,
      results: SAMPLE_DEMO_JOURNEY.results,
    });

    showToast(
      isArabic
        ? 'تم إطلاق المنصة بنجاح وحفظ كافة التعديلات في الجلسة والموقع!'
        : '🚀 Platform launched successfully! Live website data synchronized.',
      'success'
    );

    // Direct user to Executive Performance Dashboard (Chapter 4)
    navigate('/executive/dashboard', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#f8fafc',
        fontFamily: isArabic ? 'Cairo, sans-serif' : 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP BAR: Clean, Informative Wizard Header */}
      <header
        style={{
          height: '62px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${primaryColor} 0%, #0d9488 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
            }}
          >
            <Compass size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#0f2b46', margin: 0 }}>
                {isArabic ? 'معالج إعداد الهيئة والتخطيط الاستراتيجي' : 'Entity & Strategy Setup Journey'}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {isArabic ? `الخطوة ${currentStep} من 8` : `Step ${currentStep} of 8`}
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
              {isArabic
                ? 'رحلة موحدة من إعداد الهيكل إلى الرؤية ومؤشرات الأداء والمبادرات'
                : 'End-to-End Governance: Structure → Vision → Objectives → KPIs → Execution'}
            </div>
          </div>
        </div>

        {/* Global Action Bar: Auto-Fill Demo Data & Clear */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleAutoFillDemoData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #10b981',
              color: '#065f46',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1fae5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
            title="Populate complete realistic dataset for all 4 chapters"
          >
            <Sparkles size={15} color="#059669" />
            <span>{isArabic ? '✨ ملء البيانات التجريبية (الأحساء)' : '✨ Auto-Fill Demo Data'}</span>
          </button>

          <button
            type="button"
            onClick={handleClearCurrentStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#64748b',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Reset current step inputs to blank"
          >
            <RotateCcw size={13} />
            <span>{isArabic ? 'تفريغ الخطوة' : 'Clear Step'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/executive/dashboard')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#0f766e',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            {isArabic ? 'تخطي للوحة القيادة ←' : 'Exit to Dashboard →'}
          </button>
        </div>
      </header>

      {/* MAIN BODY: 2-Column Layout (Sidebar + Active Step Content) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT SIDEBAR: 4 Chapters & 8 Step Navigation */}
        <aside
          style={{
            width: '320px',
            background: '#ffffff',
            borderInlineEnd: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px 16px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#94a3b8',
                marginBottom: '16px',
                padding: '0 8px',
              }}
            >
              {isArabic ? 'مراحل رحلة العرض (MOM Journey)' : 'STRATEGIC DEMO JOURNEY'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {CHAPTERS.map((chap) => (
                <div key={chap.id}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#0f766e',
                      backgroundColor: '#f0fdf4',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      display: 'inline-block',
                    }}
                  >
                    {isArabic ? chap.titleAr : chap.title}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {chap.steps.map((st) => {
                      const isActive = currentStep === st.id;
                      const isDone = completedSteps.includes(st.id);
                      const StepIcon = st.icon;

                      return (
                        <div
                          key={st.id}
                          onClick={() => setCurrentStep(st.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: isActive ? '#f0fdf4' : 'transparent',
                            border: isActive ? '1.5px solid #059669' : '1px solid transparent',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: isActive
                                ? '#059669'
                                : isDone
                                ? '#dcfce7'
                                : '#f1f5f9',
                              color: isActive
                                ? '#ffffff'
                                : isDone
                                ? '#16a34a'
                                : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 800,
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            {isDone && !isActive ? <Check size={14} /> : st.id}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: '13px',
                                fontWeight: isActive ? 800 : 600,
                                color: isActive ? '#065f46' : '#1e293b',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {isArabic ? st.nameAr : st.name}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                                marginTop: '2px',
                                lineHeight: 1.3,
                              }}
                            >
                              {st.desc}
                            </div>
                          </div>

                          {isActive && (
                            <ChevronRight
                              size={16}
                              color="#059669"
                              style={{ alignSelf: 'center', flexShrink: 0 }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer: Quick Info */}
          <div
            style={{
              padding: '14px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              marginTop: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={16} color="#059669" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>
                {isArabic ? 'جلسة المسؤول المعتمد' : 'Authorized Strategy Admin'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
              {isArabic
                ? 'البيانات تُحفظ مباشرة في الذاكرة المحلية وتنعكس فوراً على كامل أقسام المنصة.'
                : 'Changes are automatically staged in session and synchronized globally upon activation.'}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA: Spacious, Clean Form Views */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 44px',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Step Content Renderers */}

            {/* ======================================================== */}
            {/* STEP 1: ENTITY & BRANDING SETUP (CHAPTER 1) */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#059669',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                    }}
                  >
                    {isArabic ? 'الفصل 1 • إعداد الهيئة والمؤسسة' : 'CHAPTER 1 • ENTITY & ORGANIZATION SETUP'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'إعداد بيانات وهوية الهيئة' : 'Organization Setup & Corporate Branding'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'حدد اسم الهيئة، الشعار، ألوان الهوية، والمحددات المؤسسية التي ستنعكس على كافة شاشات المنصة.'
                      : 'Define entity naming, crest emblem, brand palette, and operating parameters to brand the entire platform.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '28px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                  }}
                >
                  {/* Entity Names */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'اسم الهيئة / المؤسسة (بالانجليزية)' : 'Organization Name (English)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Al Ahsa Development Authority (AHDA)"
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '13.5px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'اسم الهيئة / المؤسسة (بالعربية)' : 'Organization Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: هيئة تطوير الأحساء"
                        value={entityNameAr}
                        onChange={(e) => setEntityNameAr(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '13.5px',
                          direction: 'rtl',
                        }}
                      />
                    </div>
                  </div>

                  {/* Logo Selection & Color Branding */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'شعار الهيئة (Emblem)' : 'Entity Emblem / Logo'}
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {['crest', 'palm', 'falcon', 'shield'].map((logoType) => (
                          <button
                            key={logoType}
                            type="button"
                            onClick={() => setEntityLogo(logoType)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: entityLogo === logoType ? '2px solid #059669' : '1px solid #cbd5e1',
                              backgroundColor: entityLogo === logoType ? '#f0fdf4' : '#ffffff',
                              fontWeight: 700,
                              fontSize: '12px',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                            }}
                          >
                            {logoType}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'لون الهوية الرئيسي (Brand Color)' : 'Primary Brand Color'}
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {[
                          { name: 'Emerald', hex: '#059669' },
                          { name: 'Teal', hex: '#0f766e' },
                          { name: 'Navy', hex: '#0b2545' },
                          { name: 'Sapphire', hex: '#1d4ed8' },
                          { name: 'Ruby', hex: '#b91c1c' },
                        ].map((c) => (
                          <div
                            key={c.hex}
                            onClick={() => {
                              setPrimaryColor(c.hex);
                              setSecondaryColor(c.hex === '#059669' ? '#0f766e' : '#059669');
                            }}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: c.hex,
                              cursor: 'pointer',
                              border: primaryColor === c.hex ? '3px solid #0f172a' : '2px solid transparent',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                            title={c.name}
                          />
                        ))}
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mandate & Mission Summary */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      {isArabic ? 'المهام التنظيمية والاختصاص (Mandate)' : 'Organizational Mandate & Scope'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Catalyzing sustainable socio-economic prosperity, preserving Al Ahsa oasis heritage, and delivering world-class civic and investment services."
                      value={mandate}
                      onChange={(e) => setMandate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                      }}
                    />
                  </div>

                  {/* Operating Parameters */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'القطاع' : 'Sector'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Regional Development"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'المقر الرئيسي' : 'Headquarters'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Al-Hofuf, Al Ahsa"
                        value={headquarters}
                        onChange={(e) => setHeadquarters(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'العملة' : 'Currency'}
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        <option value="SAR">SAR (ر.س)</option>
                        <option value="USD">USD ($)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'دورة التقارير' : 'Reporting Frequency'}
                      </label>
                      <select
                        value={reviewFrequency}
                        onChange={(e) => setReviewFrequency(e.target.value as any)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        <option value="Quarterly">Quarterly (ربع سنوي)</option>
                        <option value="Monthly">Monthly (شهري)</option>
                        <option value="Annual">Annual (سنوي)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: ORG HIERARCHY & LAYERS (CHAPTER 2) */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 2 • الهيكل التنظيمي والصلاحيات' : 'CHAPTER 2 • ORGANIZATION STRUCTURE & HIERARCHY'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'بناء الهيكل التنظيمي والإدارات' : 'Organization Hierarchy: Executive → Sectors → Departments'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'حدد مستويات القيادة بدءاً من المحافظ / الرئيس التنفيذي نزولاً إلى الإدارات العامة والأقسام الميدانية.'
                      : 'Establish the governance hierarchy flowing from CEO / Executive level down to directorates, departments, and units.'}
                  </p>
                </div>

                {/* Add Unit Form */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? '➕ إضافة وحدة / إدارة تنظيمية جديدة' : '➕ Add Organizational Unit'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr auto', gap: '12px', alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'رمز الوحدة' : 'Code'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AHDA-STRAT"
                        value={newUnitCode}
                        onChange={(e) => setNewUnitCode(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'اسم الإدارة / الوحدة' : 'Department Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Strategy & Performance Directorate"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'الإدارة الأعلى (الأب)' : 'Parent Unit'}
                      </label>
                      <select
                        value={newUnitParent}
                        onChange={(e) => setNewUnitParent(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        <option value="">{isArabic ? '-- المستوى الأعلى (CEO) --' : '-- Top Executive Level --'}</option>
                        {orgUnits.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'مدير الإدارة' : 'Unit Manager'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Saad Al-Otaibi"
                        value={newUnitManager}
                        onChange={(e) => setNewUnitManager(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOrgUnit}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة' : 'Add Unit'}
                    </button>
                  </div>
                </div>

                {/* Organization Units Tree Table */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46' }}>
                      {isArabic ? `الوحدات المضافة في الهيكل (${orgUnits.length})` : `Configured Units in Hierarchy (${orgUnits.length})`}
                    </div>
                    {orgUnits.length === 0 && (
                      <span style={{ fontSize: '12px', color: '#b45309', backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '4px' }}>
                        {isArabic ? 'اضغط "ملء البيانات التجريبية" لتحميل الهيكل تلقائياً' : 'Empty: Type units or click "✨ Auto-Fill Demo Data"'}
                      </span>
                    )}
                  </div>

                  {orgUnits.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      <Layers size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>
                        {isArabic ? 'لم يتم إضافة إدارات حتى الآن. أضف إدارات أعلاه أو اضغط ملء البيانات التجريبية.' : 'No organization units defined yet. Add units above or auto-fill demo hierarchy.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {orgUnits.map((unit, idx) => (
                        <div
                          key={unit.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: idx === 0 ? '#f0fdf4' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: idx === 0 ? '#059669' : '#f1f5f9',
                                color: idx === 0 ? '#ffffff' : '#475569',
                              }}
                            >
                              {unit.code}
                            </span>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f2b46' }}>
                                {unit.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                <span>Manager: {unit.managerName}</span>
                                {unit.parentId && <span> • Parent: {orgUnits.find((u) => u.id === unit.parentId)?.code || 'Executive'}</span>}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setOrgUnits(orgUnits.filter((u) => u.id !== unit.id))}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                            title="Remove unit"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: USERS, ROLES & AUTHORITY (CHAPTER 2) */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 2 • الهيكل التنظيمي والصلاحيات' : 'CHAPTER 2 • USERS, ROLES & AUTHORITY'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'المستخدمين، الأدوار ومصفوفة الصلاحيات' : 'User Roles, Responsibilities & Maker-Checker Governance'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'حدد من المسؤول عن ماذا، مع تفعيل فصل الصلاحيات (Maker-Checker) لمنع الاعتماد الذاتي.'
                      : 'Define who is responsible for what, assigning roles with strict Segregation of Duties (Maker-Checker).'}
                  </p>
                </div>

                {/* Maker-Checker Rule Toggle */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={20} color="#059669" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f2b46' }}>
                        {isArabic ? 'تفعيل ضابط فصل الصلاحيات (Maker-Checker Segregation)' : 'Enforce Maker-Checker Segregation of Duties'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {isArabic ? 'يمنع مسؤولي الإدخال من اعتماد نتائج مؤشراتهم ذاتياً' : 'Blocks KPI contributors & owners from approving their own submitted values'}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={makerCheckerEnabled}
                    onChange={(e) => setMakerCheckerEnabled(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>

                {/* Add User Form */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? '➕ إضافة مستخدم جديد وتعيين دوره' : '➕ Add System User & Assign Role'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr auto', gap: '12px', alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'اسم المستخدم' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Saad Al-Otaibi"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        placeholder="s.otaibi@test.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'الدور والصلاحية' : 'Platform Role'}
                      </label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as RoleName)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        <option value="Strategy Manager">Strategy Manager / Specialist</option>
                        <option value="Executive Approver">Executive Approver / CEO</option>
                        <option value="Department Head">Department Head</option>
                        <option value="KPI Contributor">KPI Contributor (Maker)</option>
                        <option value="System Administrator">System Administrator</option>
                        <option value="Auditor / Assurance Viewer">Auditor / Assurance Viewer</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'المسمى الوظيفي' : 'Job Title'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Director of Strategy"
                        value={newUserTitle}
                        onChange={(e) => setNewUserTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddUser}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة' : 'Add User'}
                    </button>
                  </div>
                </div>

                {/* Users List */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? `المستخدمين المسجلين (${usersList.length})` : `Registered Users & Authority Levels (${usersList.length})`}
                  </div>

                  {usersList.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      <Users size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>
                        {isArabic ? 'لم يتم إضافة مستخدمين بعد. أضف مستخدمين أو اضغط ملء البيانات التجريبية.' : 'No users configured yet. Add above or auto-fill demo users.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {usersList.map((user) => (
                        <div
                          key={user.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#ecfdf5',
                                color: '#065f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800,
                              }}
                            >
                              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f2b46' }}>
                                {user.name} <span style={{ color: '#64748b', fontWeight: 400 }}>({user.email})</span>
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
                                <span>Role: {user.role}</span>
                                <span style={{ color: '#94a3b8', margin: '0 6px' }}>•</span>
                                <span style={{ color: '#475569' }}>Title: {user.title}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setUsersList(usersList.filter((u) => u.id !== user.id))}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 4: STRATEGY FOUNDATION & PILLARS (CHAPTER 3) */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 3 • التخطيط الاستراتيجي المتكامل' : 'CHAPTER 3 • STRATEGY PLANNING: FOUNDATION & PILLARS'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'الخطة الاستراتيجية، الرؤية، والركائز' : 'Strategy Foundation: Vision → Mission → Values → Strategic Pillars'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'حدد الخطة الاستراتيجية ومحاورها الأساسية لربط الأهداف والمؤشرات لاحقاً.'
                      : 'Define strategy name, duration, vision statement, and strategic pillars/themes that connect downward into objectives.'}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '28px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'اسم الخطة الاستراتيجية' : 'Strategy Plan Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AHDA Strategic Plan 2027-2030"
                        value={strategyName}
                        onChange={(e) => setStrategyName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'المدى الزمني (Duration)' : 'Horizon / Duration'}
                      </label>
                      <input
                        type="text"
                        placeholder="2027–2030"
                        value={strategyHorizon}
                        onChange={(e) => setStrategyHorizon(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                      />
                    </div>
                  </div>

                  {/* Vision & Mission */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'الرؤية (Vision)' : 'Strategic Vision'}
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Al Ahsa: A premier global oasis economy and vibrant sustainable cultural sanctuary by 2030."
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                        {isArabic ? 'الرسالة (Mission)' : 'Strategic Mission'}
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. To orchestrate integrated regional development, optimize public resource utilization, and deliver seamless digital-first services."
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  {/* Values */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      {isArabic ? 'القيم المؤسسية (Values - مفصولة بفواصل)' : 'Core Values (Comma-separated)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Heritage Stewardship, Operational Excellence, Citizen Centricity, Digital Innovation"
                      value={valuesInput}
                      onChange={(e) => setValuesInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                {/* Strategic Pillars / Themes Section */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? '➕ إضافة ركيزة / محور استراتيجي (Strategic Pillars)' : '➕ Add Strategic Pillar / Theme'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr auto', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'اسم الركيزة' : 'Pillar Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Economic Prosperity & Heritage Tourism"
                        value={newThemeName}
                        onChange={(e) => setNewThemeName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'الوصف' : 'Description'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Accelerate oasis private investments, eco-tourism, and agricultural vibrancy."
                        value={newThemeDesc}
                        onChange={(e) => setNewThemeDesc(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTheme}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة الركيزة' : 'Add Pillar'}
                    </button>
                  </div>

                  {/* Themes List */}
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46', marginBottom: '10px' }}>
                    {isArabic ? `الركائز المعتمدة (${themesList.length})` : `Established Strategic Pillars (${themesList.length})`}
                  </div>
                  {themesList.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12.5px' }}>
                      {isArabic ? 'لم يتم إضافة ركائز بعد. أضف أعلاه أو اضغط ملء البيانات التجريبية.' : 'No strategic pillars added yet.'}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {themesList.map((th) => (
                        <div
                          key={th.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                              {th.code}
                            </span>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46', marginTop: '4px' }}>
                              {th.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                              {th.description}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setThemesList(themesList.filter((t) => t.id !== th.id))}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 5: STRATEGIC OBJECTIVES & AI RECOMMENDATIONS (CHAPTER 3) */}
            {/* ======================================================== */}
            {currentStep === 5 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 3 • التخطيط الاستراتيجي المتكامل' : 'CHAPTER 3 • STRATEGIC OBJECTIVES & AI RECOMMENDATIONS'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'صياغة الأهداف الاستراتيجية وتوصيات الذكاء الاصطناعي' : 'Strategic Objectives & AI-Assisted Formulation'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'اربط كل هدف بركيزته الاستراتيجية، واستخدم أيقونة الذكاء الاصطناعي ✨ لاقتراح المؤشرات والمبادرات الداعمة.'
                      : 'Map objectives to strategic pillars, and leverage the AI Assistant ✨ to suggest relevant KPIs, descriptions, and initiatives.'}
                  </p>
                </div>

                {/* Add Objective Form */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? '➕ إضافة هدف استراتيجي جديد' : '➕ Define Strategic Objective'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr 1.5fr 1fr auto', gap: '12px', alignItems: 'flex-end', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'رمز الهدف' : 'Code'}
                      </label>
                      <input
                        type="text"
                        placeholder="OBJ-P01"
                        value={newObjCode}
                        onChange={(e) => setNewObjCode(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'اسم الهدف' : 'Objective Name'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Accelerate Oasis Tourism, Heritage Preservation & Private Investment"
                        value={newObjName}
                        onChange={(e) => setNewObjName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'الركيزة المرتبطة' : 'Linked Pillar'}
                      </label>
                      <select
                        value={newObjThemeId}
                        onChange={(e) => setNewObjThemeId(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      >
                        {themesList.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        {isArabic ? 'الوزن %' : 'Weight %'}
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={newObjWeight}
                        onChange={(e) => setNewObjWeight(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddObjective}
                      style={{
                        padding: '9px 16px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* Objectives List with AI Buttons */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? `الأهداف الاستراتيجية المعتمدة (${objectivesList.length})` : `Strategic Objectives Defined (${objectivesList.length})`}
                  </div>

                  {objectivesList.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      <Target size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>
                        {isArabic ? 'لم يتم إضافة أهداف بعد. أضف أعلاه أو اضغط ملء البيانات التجريبية.' : 'No strategic objectives defined yet.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {objectivesList.map((obj) => (
                        <div
                          key={obj.id}
                          style={{
                            padding: '14px 18px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px' }}>
                                {obj.code}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                                Weight: {obj.weight}%
                              </span>
                              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                                {themesList.find((t) => t.id === obj.themeId)?.name || 'Pillar Linked'}
                              </span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46' }}>
                              {obj.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              Owner: {obj.ownerName}
                            </div>
                          </div>

                          {/* AI Recommendation Trigger Button (MOM Section 10) */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleTriggerAiForObjective(obj)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                backgroundColor: '#f0fdf4',
                                border: '1.5px solid #10b981',
                                borderRadius: '8px',
                                color: '#065f46',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(16, 185, 129, 0.15)',
                              }}
                            >
                              <Sparkles size={14} color="#059669" />
                              <span>{isArabic ? '✨ توصيات الذكاء الاصطناعي' : '✨ AI Suggest KPIs & Initiatives'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setObjectivesList(objectivesList.filter((o) => o.id !== obj.id))}
                              style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI RECOMMENDATION MODAL / FLYOUT (MOM Section 10) */}
                {activeAiObjModal && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(15, 23, 42, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 100,
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '680px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '28px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Sparkles size={16} color="#059669" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f2b46', margin: 0 }}>
                              {isArabic ? 'توصيات الذكاء الاصطناعي للهدف' : 'AI Strategic Recommendation Engine'}
                            </h3>
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                            Target Objective: <strong>{activeAiObjModal.name}</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAiObjModal(null)}
                          style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          ✕
                        </button>
                      </div>

                      {isAiLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#059669' }}>
                          <Sparkles size={32} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 12px auto' }} />
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>
                            {isArabic ? 'جارِ توليد التوصيات الذكية للمؤشرات والمبادرات...' : 'Synthesizing contextual KPIs and initiatives with AI...'}
                          </div>
                        </div>
                      ) : aiSuggestions ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Suggested KPIs */}
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', marginBottom: '10px' }}>
                              {isArabic ? '📈 مؤشرات الأداء المقترحة (Suggested KPIs)' : '📈 AI-Recommended KPIs'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {aiSuggestions.suggestedKpis.map((sugKpi, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '12px 14px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                                      {sugKpi.name}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                                      Target: {sugKpi.target} {sugKpi.unit} • Formula: {sugKpi.formula}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                      {sugKpi.description}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleApplyAiKpi(sugKpi)}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#059669',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                    }}
                                  >
                                    ➕ {isArabic ? 'إضافة المؤشر' : 'Add KPI'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Suggested Initiatives */}
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', marginBottom: '10px' }}>
                              {isArabic ? '🚀 المبادرات المقترحة (Suggested Initiatives)' : '🚀 AI-Recommended Strategic Initiatives'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {aiSuggestions.suggestedInitiatives.map((sugIni, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '12px 14px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46' }}>
                                      {sugIni.name}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                                      Budget: {(sugIni.budget / 1000000).toFixed(1)}M SAR • Horizon: {sugIni.timeline}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                      {sugIni.description}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleApplyAiInitiative(sugIni)}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#0284c7',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                    }}
                                  >
                                    ➕ {isArabic ? 'إضافة المبادرة' : 'Add Initiative'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setActiveAiObjModal(null)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {isArabic ? 'إغلاق المعالج' : 'Done & Close'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 6: KPI DEFINITION & MEASUREMENT RULES (CHAPTER 3) */}
            {/* ======================================================== */}
            {currentStep === 6 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 3 • التخطيط الاستراتيجي المتكامل' : 'CHAPTER 3 • KPI DEFINITION & MEASUREMENT RULES'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'تعريف مؤشرات الأداء (KPIs) وقواعد الاحتساب' : 'KPI Definition & Measurement Rules: Target vs. Actual'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'بناء العلاقة: الهدف ← المؤشر ← المستهدف ← المتحقق ← نسبة الإنجاز وحالة الأداء.'
                      : 'Establish the core relationship: Objective → KPI → Measurement → Target → Actual → Performance.'}
                  </p>
                </div>

                {/* Add KPI Form */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? '➕ تعريف مؤشر أداء جديد' : '➕ Define New Key Performance Indicator (KPI)'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Code</label>
                      <input
                        type="text"
                        placeholder="KPI-01"
                        value={newKpiCode}
                        onChange={(e) => setNewKpiCode(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>KPI Name</label>
                      <input
                        type="text"
                        placeholder="e.g. UNESCO Sites Restored"
                        value={newKpiName}
                        onChange={(e) => setNewKpiName(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Linked Objective</label>
                      <select
                        value={newKpiObjId}
                        onChange={(e) => setNewKpiObjId(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      >
                        {objectivesList.map((o) => (
                          <option key={o.id} value={o.id}>{o.code}: {o.name.slice(0, 30)}...</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Unit</label>
                      <input
                        type="text"
                        placeholder="%, Sites, SAR"
                        value={newKpiUnit}
                        onChange={(e) => setNewKpiUnit(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Target</label>
                      <input
                        type="number"
                        value={newKpiTarget}
                        onChange={(e) => setNewKpiTarget(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Actual</label>
                      <input
                        type="number"
                        value={newKpiActual}
                        onChange={(e) => setNewKpiActual(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddKpi}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة' : 'Add KPI'}
                    </button>
                  </div>
                </div>

                {/* KPIs List */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? `المؤشرات وقواعد القياس المعتمدة (${kpisList.length})` : `Configured KPIs & Performance Metrics (${kpisList.length})`}
                  </div>

                  {kpisList.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      <LineChart size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>
                        {isArabic ? 'لم يتم تعريف مؤشرات بعد. أضف مؤشرات أعلاه أو اضغط ملء البيانات التجريبية.' : 'No KPIs defined yet.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {kpisList.map((kpi) => {
                        const targetVal = kpi.target || 1;
                        const actualVal = SAMPLE_DEMO_JOURNEY.results?.find((r) => r.kpiId === kpi.id)?.actual ?? kpi.baseline;
                        const achievement = Math.round((actualVal / targetVal) * 100);
                        const isGreen = achievement >= 90;
                        const isAmber = achievement >= 75 && achievement < 90;

                        return (
                          <div
                            key={kpi.id}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155' }}>
                                {kpi.code}
                              </span>
                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f2b46' }}>
                                  {kpi.name}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                  <span>Frequency: {kpi.frequency}</span>
                                  <span style={{ margin: '0 6px' }}>•</span>
                                  <span>Target: {kpi.target} {kpi.unit}</span>
                                  <span style={{ margin: '0 6px' }}>•</span>
                                  <span>Actual: {actualVal} {kpi.unit}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: 800,
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  backgroundColor: isGreen ? '#dcfce7' : isAmber ? '#fef3c7' : '#fee2e2',
                                  color: isGreen ? '#15803d' : isAmber ? '#b45309' : '#b91c1c',
                                }}
                              >
                                {achievement}% {isGreen ? 'GREEN' : isAmber ? 'AMBER' : 'RED'}
                              </span>

                              <button
                                type="button"
                                onClick={() => setKpisList(kpisList.filter((k) => k.id !== kpi.id))}
                                style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 7: INITIATIVES & PROJECTS WITH AI (CHAPTER 3) */}
            {/* ======================================================== */}
            {currentStep === 7 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 3 • التخطيط الاستراتيجي المتكامل' : 'CHAPTER 3 • INITIATIVES & EXECUTION'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'المبادرات الاستراتيجية ومساعد الصياغة الذكي' : 'Strategic Initiatives & AI Description Assistant'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'ربط المبادرات بالأهداف ومؤشرات الأداء، مع إمكانية تحسين الوصف والمعالم عبر الذكاء الاصطناعي.'
                      : 'Connect execution initiatives to strategic objectives, using the AI wording assistant to refine scopes.'}
                  </p>
                </div>

                {/* Add Initiative Form */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46' }}>
                      {isArabic ? '➕ إضافة مبادرة استراتيجية جديدة' : '➕ Define Strategic Initiative'}
                    </div>
                    <button
                      type="button"
                      onClick={handleAiRefineInitiative}
                      disabled={isAiRefiningIni}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #10b981',
                        borderRadius: '6px',
                        color: '#065f46',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={12} color="#059669" />
                      <span>{isAiRefiningIni ? 'Refining...' : '✨ AI Refine Description'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Code</label>
                      <input
                        type="text"
                        placeholder="INI-01"
                        value={newIniCode}
                        onChange={(e) => setNewIniCode(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Initiative Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Historical Oasis Heritage Corridor Revitalization"
                        value={newIniName}
                        onChange={(e) => setNewIniName(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Linked Objective</label>
                      <select
                        value={newIniObjId}
                        onChange={(e) => setNewIniObjId(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      >
                        {objectivesList.map((o) => (
                          <option key={o.id} value={o.id}>{o.code}: {o.name.slice(0, 30)}...</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Budget (SAR)</label>
                      <input
                        type="number"
                        value={newIniBudget}
                        onChange={(e) => setNewIniBudget(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Status</label>
                      <select
                        value={newIniStatus}
                        onChange={(e) => setNewIniStatus(e.target.value as any)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddInitiative}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {isArabic ? 'إضافة' : 'Add'}
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {isArabic ? 'وصف ونطاق المبادرة' : 'Scope Description & Strategic Impact'}
                    </label>
                    <input
                      type="text"
                      placeholder="Scope, milestones, and expected socio-economic deliverables..."
                      value={newIniDesc}
                      onChange={(e) => setNewIniDesc(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                {/* Initiatives List */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px' }}>
                    {isArabic ? `المبادرات المعتمدة (${initiativesList.length})` : `Active Strategic Initiatives (${initiativesList.length})`}
                  </div>

                  {initiativesList.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                      <Rocket size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <p style={{ fontSize: '13px' }}>
                        {isArabic ? 'لم يتم إضافة مبادرات بعد. أضف أعلاه أو اضغط ملء البيانات التجريبية.' : 'No strategic initiatives defined yet.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {initiativesList.map((ini) => (
                        <div
                          key={ini.id}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#334155' }}>
                                {ini.code}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#065f46' }}>
                                {ini.status}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                Budget: {(ini.budget / 1000000).toFixed(1)}M SAR
                              </span>
                            </div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f2b46' }}>
                              {ini.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                              {ini.description}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setInitiativesList(initiativesList.filter((i) => i.id !== ini.id))}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 8: REVIEW & PLATFORM ACTIVATION (CHAPTER 4) */}
            {/* ======================================================== */}
            {currentStep === 8 && (
              <div className="wizard-step-container">
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {isArabic ? 'الفصل 4 • المتابعة وإطلاق المنصة' : 'CHAPTER 4 • JOURNEY REVIEW & PLATFORM ACTIVATION'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f2b46', marginTop: '4px' }}>
                    {isArabic ? 'مراجعة الرحلة وتفعيل المنصة الحية' : 'End-to-End Journey Verification & Live Launch'}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                    {isArabic
                      ? 'تحقق من اكتمال كافة مراحل الرحلة ثم اضغط "إطلاق المنصة" لعرض لوحة القياس المباشرة والتقارير التنفيذية.'
                      : 'Review configured components across all 4 chapters, then activate the platform to view live monitoring and reports.'}
                  </p>
                </div>

                {/* 4-Chapter Verification Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px' }}>
                      <Building2 size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>Chapter 1: Entity & Branding</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                      <div><strong>Entity:</strong> {entityName || 'Al Ahsa Development Authority (AHDA)'}</div>
                      <div><strong>Brand:</strong> {primaryColor} • Theme: {themeMode}</div>
                      <div><strong>Currency:</strong> {currency} • Fiscal: {fiscalYearStart}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px' }}>
                      <Layers size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>Chapter 2: Structure & Authority</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                      <div><strong>Hierarchy Units:</strong> {orgUnits.length > 0 ? orgUnits.length : 5} units</div>
                      <div><strong>Active Users:</strong> {usersList.length > 0 ? usersList.length : 5} registered</div>
                      <div><strong>Maker-Checker:</strong> {makerCheckerEnabled ? 'Active (Strict Segregation)' : 'Disabled'}</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px' }}>
                      <Compass size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>Chapter 3: Strategy Architecture</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                      <div><strong>Plan:</strong> {strategyName || 'AHDA Strategic Plan 2027-2030'} ({strategyHorizon})</div>
                      <div><strong>Pillars / Themes:</strong> {themesList.length > 0 ? themesList.length : 4} pillars</div>
                      <div><strong>Objectives:</strong> {objectivesList.length > 0 ? objectivesList.length : 4} objectives</div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '10px' }}>
                      <LineChart size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>Chapter 4: Performance & Execution</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                      <div><strong>KPIs Defined:</strong> {kpisList.length > 0 ? kpisList.length : 5} indicators</div>
                      <div><strong>Strategic Initiatives:</strong> {initiativesList.length > 0 ? initiativesList.length : 4} active</div>
                      <div><strong>AI Capabilities:</strong> Enabled & Verified ✨</div>
                    </div>
                  </div>
                </div>

                {/* Big Launch Platform CTA */}
                <div
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                    background: 'linear-gradient(135deg, #091a30 0%, #064e3b 100%)',
                    borderRadius: '16px',
                    padding: '36px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.4)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: 'rgba(52, 211, 153, 0.2)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#6ee7b7',
                        marginBottom: '8px',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isArabic ? 'جاهز للإطلاق والتطبيق المؤسسي' : 'All 4 Journey Chapters Ready'}</span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                      {isArabic ? 'تفعيل الإعداد والانتقال إلى لوحة قياس الأداء' : 'Activate Setup & Launch Executive Performance Dashboard'}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px', maxWidth: '580px', lineHeight: 1.5 }}>
                      {isArabic
                        ? 'سيتم حفظ كافة البيانات فوراً في المتصفح وتحديث الهيكل، الرؤية، بطاقة الأداء، ومؤشرات الأداء في كامل شاشات المنصة والتقارير.'
                        : 'Saves your journey configuration into session storage and reflects newly created data across the Strategy Map, Scorecard, and Performance Reports.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunchPlatform}
                    style={{
                      padding: '14px 26px',
                      backgroundColor: '#10b981',
                      color: '#064e3b',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#34d399')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                  >
                    <span>{isArabic ? '🚀 إطلاق المنصة الحية' : '🚀 Launch Platform Now'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* BOTTOM STEP CONTROLS (Back / Next Step) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  backgroundColor: currentStep === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentStep === 1 ? '#94a3b8' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowLeft size={15} />
                <span>{isArabic ? 'السابق' : 'Previous Step'}</span>
              </button>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 22px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                    }}
                  >
                    <span>{isArabic ? 'التالي ←' : 'Next Step →'}</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLaunchPlatform}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 22px',
                      backgroundColor: '#10b981',
                      color: '#064e3b',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <span>{isArabic ? '🚀 إطلاق المنصة' : '🚀 Launch Platform'}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
