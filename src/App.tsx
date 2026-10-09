import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './modules/auth/LoginPage';
import { RoleWorkspace } from './modules/auth/RoleWorkspace';
import { UserManagement } from './modules/admin/UserManagement';
import { OrganizationTree } from './modules/admin/OrganizationTree';
import { PermissionsMatrix } from './modules/admin/PermissionsMatrix';
import { PlanningCycles } from './modules/strategy/PlanningCycles';
import { StrategicDiagnosis } from './modules/strategy/StrategicDiagnosis';
import { StrategicOptions } from './modules/strategy/StrategicOptions';
import { StrategyDefinition } from './modules/strategy/StrategyDefinition';
import { BalancedScorecard } from './modules/strategy/BalancedScorecard';
import { StrategyMap } from './modules/strategy/StrategyMap';
import { KpiDictionary } from './modules/performance/KpiDictionary';
import { PerformanceCollection } from './modules/performance/PerformanceCollection';
import { ResultSubmissionApproval } from './modules/performance/ResultSubmissionApproval';
import { PerformanceAnalysis } from './modules/performance/PerformanceAnalysis';
import { DepartmentCascade } from './modules/alignment/DepartmentCascade';
import { StrategicInitiatives } from './modules/execution/StrategicInitiatives';
import { CorrectiveActions } from './modules/execution/CorrectiveActions';
import { StrategicRisks } from './modules/execution/StrategicRisks';
import { ApprovalsWorkflow } from './modules/governance/ApprovalsWorkflow';
import { StrategyReviews } from './modules/governance/StrategyReviews';
import { PlanAmendments } from './modules/governance/PlanAmendments';
import { AuditTrail } from './modules/governance/AuditTrail';
import { ExecutiveDashboard } from './modules/executive/ExecutiveDashboard';
import { ReportBuilder } from './modules/reports/ReportBuilder';
import { StrategyJourneyWizard } from './modules/journey/StrategyJourneyWizard';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Application Shell (Guarded by ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            {/* Dedicated Uncluttered Strategy Journey Setup Form with Sidebar */}
            <Route path="/setup-journey" element={<StrategyJourneyWizard />} />

            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/setup-journey" replace />} />
              <Route path="/dashboard" element={<RoleWorkspace />} />

              {/* Administration */}
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/organization" element={<OrganizationTree />} />
              <Route path="/admin/permissions" element={<PermissionsMatrix />} />

              {/* Strategy Architecture */}
              <Route path="/strategy/planning-cycles" element={<PlanningCycles />} />
              <Route path="/strategy/diagnosis" element={<StrategicDiagnosis />} />
              <Route path="/strategy/options" element={<StrategicOptions />} />
              <Route path="/strategy/definition" element={<StrategyDefinition />} />
              <Route path="/strategy/bsc" element={<BalancedScorecard />} />
              <Route path="/strategy/map" element={<StrategyMap />} />

              {/* Performance Management */}
              <Route path="/performance/kpis" element={<KpiDictionary />} />
              <Route path="/performance/collection" element={<PerformanceCollection />} />
              <Route path="/performance/results" element={<ResultSubmissionApproval />} />
              <Route path="/performance/analysis" element={<PerformanceAnalysis />} />

              {/* Alignment & Cascade */}
              <Route path="/alignment/departments" element={<DepartmentCascade />} />

              {/* Execution */}
              <Route path="/execution/initiatives" element={<StrategicInitiatives />} />
              <Route path="/execution/actions" element={<CorrectiveActions />} />
              <Route path="/execution/risks" element={<StrategicRisks />} />

              {/* Governance & Approvals */}
              <Route path="/governance/approvals" element={<ApprovalsWorkflow />} />
              <Route path="/governance/reviews" element={<StrategyReviews />} />
              <Route path="/governance/amendments" element={<PlanAmendments />} />
              <Route path="/governance/audit" element={<AuditTrail />} />

              {/* Executive Reporting */}
              <Route path="/executive/dashboard" element={<ExecutiveDashboard />} />
              <Route path="/reports" element={<ReportBuilder />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
