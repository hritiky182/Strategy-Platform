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
import { useApp } from '../../context/AppContext';
import { CorporateSubnav } from './CorporateSubnav';
import { BookOpen } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { setIsDemoGuideOpen, settings } = useApp();

  return (
    <div className="app-container">
      <TopHeader />

      <div className="app-body">
        <Sidebar />

        <main className="app-main">
          <Breadcrumb />
          <CorporateSubnav />
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Demo Guide Shortcut */}
      <div className="demo-guide-bar">
        <span style={{ color: '#93c5fd' }}>AHDA Strategic Demo • {settings.activeRole}</span>
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            padding: '2px 8px',
            fontSize: '11px',
          }}
          onClick={() => setIsDemoGuideOpen(true)}
        >
          <BookOpen size={12} />
          <span>Demo Guide (20 Scenes)</span>
        </button>
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
