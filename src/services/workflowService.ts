export interface WorkflowTransitionResult {
  valid: boolean;
  error?: string;
}

export function validateStrategyPlanTransition(
  currentStatus: string,
  targetStatus: string
): WorkflowTransitionResult {
  const validTransitions: Record<string, string[]> = {
    Draft: ['In Review'],
    'In Review': ['Approved', 'Draft'], // Draft means Returned
    Approved: ['Published', 'In Review'],
    Published: ['Archived'],
    Archived: [],
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Illegal workflow transition from '${currentStatus}' to '${targetStatus}'. Strategy must follow: Draft → In Review → Approved → Published.`,
    };
  }

  return { valid: true };
}

export function validateResultTransition(
  currentStatus: string,
  targetStatus: string
): WorkflowTransitionResult {
  const validTransitions: Record<string, string[]> = {
    Draft: ['Submitted'],
    Submitted: ['Approved', 'Returned'],
    Returned: ['Submitted'], // Resubmit
    Approved: ['Corrected'], // Formal correction generates new version
    Corrected: ['Submitted'],
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Illegal workflow transition from '${currentStatus}' to '${targetStatus}'. Performance results must be Reviewed and Approved before entering official scorecards.`,
    };
  }

  return { valid: true };
}

export function validateActionTransition(
  currentStatus: string,
  targetStatus: string
): WorkflowTransitionResult {
  const validTransitions: Record<string, string[]> = {
    Open: ['In Progress'],
    'In Progress': ['Pending Review', 'Overdue'],
    Overdue: ['In Progress', 'Pending Review'],
    'Pending Review': ['Closed', 'In Progress'],
    Closed: ['In Progress'], // Re-open
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid action transition from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  return { valid: true };
}

export function validateAmendmentTransition(
  currentStatus: string,
  targetStatus: string
): WorkflowTransitionResult {
  const validTransitions: Record<string, string[]> = {
    Draft: ['Submitted'],
    Submitted: ['Approved', 'Rejected'],
    Approved: [],
    Rejected: ['Draft'],
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid amendment transition from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  return { valid: true };
}
