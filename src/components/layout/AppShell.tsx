import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { ToastContainer } from '../common/Toast';
import { ObjectiveDrawer } from '../drawers/ObjectiveDrawer';
import { KpiDrawer } from '../drawers/KpiDrawer';
import { InitiativeDrawer } from '../drawers/InitiativeDrawer';
import { ActionDrawer } from '../drawers/ActionDrawer';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationDrawer } from './NotificationDrawer';
import { DemoScriptDrawer } from './DemoScriptDrawer';

export const AppShell: React.FC = () => {
  return (
    <div className="app-container">
      <TopHeader />

      <div className="app-body">
        <Sidebar />

        <main className="app-main">
          <Breadcrumb />
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Slide-out Drawers */}
      <ObjectiveDrawer />
      <KpiDrawer />
      <InitiativeDrawer />
      <ActionDrawer />

      {/* Modals & Flyouts */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <DemoScriptDrawer />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};
