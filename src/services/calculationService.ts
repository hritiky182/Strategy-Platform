import { KPI, PerformanceResult, RagStatus, StrategicObjective } from '../types';

export interface KpiCalculationResult {
  rawAchievement: number | null;
  officialScore: number | null;
  ragStatus: RagStatus;
  baselineImprovement: number | null;
  progressTowardTarget: number | null;
  variance: number | null;
  variancePercentage: number | null;
  isMissing: boolean;
}

export interface ObjectiveCalculationResult {
  score: number | null;
  ragStatus: RagStatus;
  kpiCount: number;
  scoredKpiCount: number;
  coveragePercentage: number;
  kpiBreakdown: Array<{
    kpiId: string;
    kpiCode: string;
    kpiName: string;
    actual: number | null;
    target: number;
    unit: string;
    achievement: number | null;
    officialScore: number | null;
    weight: number;
    contribution: number | null;
    ragStatus: RagStatus;
    resultStatus: string;
  }>;
}

/**
 * Calculates raw achievement and official score for a single KPI.
 * Direction:
 *   - 'higher': (actual / target) * 100
 *   - 'lower':  (target / actual) * 100
 */
export function calculateKpiMetrics(
  kpi: KPI,
  result?: PerformanceResult | null
): KpiCalculationResult {
  if (!result || result.actual === null || result.actual === undefined || isNaN(result.actual)) {
    return {
      rawAchievement: null,
      officialScore: null,
      ragStatus: 'GRAY',
      baselineImprovement: null,
      progressTowardTarget: null,
      variance: null,
      variancePercentage: null,
      isMissing: true,
    };
  }

  const actual = Number(result.actual);
  const target = Number(kpi.target);
  const baseline = Number(kpi.baseline);

  if (target === 0 || actual <= 0) {
    return {
      rawAchievement: 0,
      officialScore: 0,
      ragStatus: 'RED',
      baselineImprovement: 0,
      progressTowardTarget: 0,
      variance: actual - target,
      variancePercentage: 0,
      isMissing: false,
    };
  }

  let rawAchievement = 0;
  let variance = 0;
  let baselineImprovement = 0;
  let progressTowardTarget = 0;

  if (kpi.direction === 'lower') {
    // Lower is better (e.g. cycle time: target 20, actual 25 -> 20/25 = 80%)
    rawAchievement = (target / actual) * 100;
    variance = actual - target; // Positive variance means taking longer than target (undesirable)

    // Baseline improvement: (baseline - actual) / baseline * 100
    // Example: (30 - 25) / 30 = 5 / 30 = 16.67%
    if (baseline > 0) {
      baselineImprovement = ((baseline - actual) / baseline) * 100;
    }

    // Progress toward target: (baseline - actual) / (baseline - target) * 100
    // Example: (30 - 25) / (30 - 20) = 5 / 10 = 50%
    if (baseline !== target) {
      progressTowardTarget = ((baseline - actual) / (baseline - target)) * 100;
    }
  } else {
    // Higher is better (e.g. digital completion: target 90, actual 81 -> 81/90 = 90%)
    rawAchievement = (actual / target) * 100;
    variance = actual - target;

    // Baseline improvement: (actual - baseline) / baseline * 100
    if (baseline > 0) {
      baselineImprovement = ((actual - baseline) / baseline) * 100;
    }

    // Progress toward target: (actual - baseline) / (target - baseline) * 100
    if (target !== baseline) {
      progressTowardTarget = ((actual - baseline) / (target - baseline)) * 100;
    }
  }

  const variancePercentage = target !== 0 ? ((actual - target) / target) * 100 : 0;
  const officialScore = Math.min(100, Math.max(0, rawAchievement));
  const ragStatus = getRagStatus(officialScore);

  return {
    rawAchievement,
    officialScore,
    ragStatus,
    baselineImprovement,
    progressTowardTarget,
    variance,
    variancePercentage,
    isMissing: false,
  };
}

/**
 * Standard RAG Threshold:
 * GREEN: >= 100%
 * AMBER: >= 90% and < 100%
 * RED: < 90%
 * GRAY: missing
 */
export function getRagStatus(score: number | null): RagStatus {
  if (score === null || score === undefined || isNaN(score)) {
    return 'GRAY';
  }
  if (score >= 100) return 'GREEN';
  if (score >= 90) return 'AMBER';
  return 'RED';
}

/**
 * Calculates objective score from weighted sum of its KPIs.
 * Only approved results (or all collected if allowPending is set) contribute to the official score.
 */
export function calculateObjectiveScore(
  objective: StrategicObjective,
  kpis: KPI[],
  results: PerformanceResult[],
  period: string,
  onlyApproved = false
): ObjectiveCalculationResult {
  const objectiveKpis = kpis.filter((k) => k.objectiveId === objective.id && k.status === 'active');

  if (objectiveKpis.length === 0) {
    return {
      score: null,
      ragStatus: 'GRAY',
      kpiCount: 0,
      scoredKpiCount: 0,
      coveragePercentage: 0,
      kpiBreakdown: [],
    };
  }

  let totalWeightedScore = 0;
  let totalApplicableWeight = 0;
  let scoredKpiCount = 0;

  const kpiBreakdown = objectiveKpis.map((kpi) => {
    // Find result for this KPI and period
    const res = results.find(
      (r) => r.kpiId === kpi.id && r.period === period && (!onlyApproved || r.status === 'Approved')
    );

    const metrics = calculateKpiMetrics(kpi, res);
    const weight = kpi.weight || 0;

    let contribution: number | null = null;
    if (metrics.officialScore !== null) {
      scoredKpiCount += 1;
      totalWeightedScore += metrics.officialScore * (weight / 100);
      totalApplicableWeight += weight;
      contribution = metrics.officialScore * (weight / 100);
    }

    return {
      kpiId: kpi.id,
      kpiCode: kpi.code,
      kpiName: kpi.name,
      actual: res ? res.actual : null,
      target: kpi.target,
      unit: kpi.unit,
      achievement: metrics.rawAchievement,
      officialScore: metrics.officialScore,
      weight: kpi.weight,
      contribution,
      ragStatus: metrics.ragStatus,
      resultStatus: res ? res.status : 'Missing',
    };
  });

  const coveragePercentage = (scoredKpiCount / objectiveKpis.length) * 100;

  if (scoredKpiCount === 0 || totalApplicableWeight === 0) {
    return {
      score: null,
      ragStatus: 'GRAY',
      kpiCount: objectiveKpis.length,
      scoredKpiCount: 0,
      coveragePercentage: 0,
      kpiBreakdown,
    };
  }

  // Normalize by the sum of available weights
  const normalizedScore = (totalWeightedScore / (totalApplicableWeight / 100));
  const finalScore = Math.min(100, Math.max(0, normalizedScore));

  return {
    score: finalScore,
    ragStatus: getRagStatus(finalScore),
    kpiCount: objectiveKpis.length,
    scoredKpiCount,
    coveragePercentage,
    kpiBreakdown,
  };
}

/**
 * Calculates Perspective score
 */
export function calculatePerspectiveScore(
  perspectiveId: string,
  objectives: StrategicObjective[],
  kpis: KPI[],
  results: PerformanceResult[],
  period: string
) {
  const pObjectives = objectives.filter((o) => o.perspectiveId === perspectiveId);
  if (pObjectives.length === 0) {
    return { score: null, ragStatus: 'GRAY' as RagStatus, objectiveCount: 0 };
  }

  const scores: number[] = [];
  pObjectives.forEach((obj) => {
    const calc = calculateObjectiveScore(obj, kpis, results, period);
    if (calc.score !== null) {
      scores.push(calc.score);
    }
  });

  if (scores.length === 0) {
    return { score: null, ragStatus: 'GRAY' as RagStatus, objectiveCount: pObjectives.length };
  }

  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return {
    score: avg,
    ragStatus: getRagStatus(avg),
    objectiveCount: pObjectives.length,
  };
}

/**
 * Calculates Overall Strategy Score
 */
export function calculateOverallStrategyScore(
  objectives: StrategicObjective[],
  kpis: KPI[],
  results: PerformanceResult[],
  period: string
) {
  if (objectives.length === 0) {
    return {
      overallScore: 0,
      ragStatus: 'GRAY' as RagStatus,
      totalObjectives: 0,
      totalKpis: kpis.length,
      redKpis: 0,
      amberKpis: 0,
      greenKpis: 0,
      grayKpis: 0,
      coverage: 0,
    };
  }

  const objScores: number[] = [];
  objectives.forEach((obj) => {
    const calc = calculateObjectiveScore(obj, kpis, results, period);
    if (calc.score !== null) {
      objScores.push(calc.score);
    }
  });

  // Calculate KPI distributions
  let redKpis = 0;
  let amberKpis = 0;
  let greenKpis = 0;
  let grayKpis = 0;

  kpis.forEach((k) => {
    const res = results.find((r) => r.kpiId === k.id && r.period === period);
    const m = calculateKpiMetrics(k, res);
    if (m.ragStatus === 'GREEN') greenKpis++;
    else if (m.ragStatus === 'AMBER') amberKpis++;
    else if (m.ragStatus === 'RED') redKpis++;
    else grayKpis++;
  });

  const totalKpis = kpis.length;
  const scoredCount = redKpis + amberKpis + greenKpis;
  const coverage = totalKpis > 0 ? (scoredCount / totalKpis) * 100 : 0;

  const overallScore =
    objScores.length > 0
      ? objScores.reduce((sum, s) => sum + s, 0) / objScores.length
      : null;

  return {
    overallScore: overallScore !== null ? Math.round(overallScore * 100) / 100 : null,
    ragStatus: getRagStatus(overallScore),
    totalObjectives: objectives.length,
    totalKpis,
    redKpis,
    amberKpis,
    greenKpis,
    grayKpis,
    coverage: Math.round(coverage * 10) / 10,
  };
}
