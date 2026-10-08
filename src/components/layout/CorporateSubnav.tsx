import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Building2,
  Table,
  LineChart,
  Rocket,
  ShieldAlert,
  CalendarCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  labelAr: string;
  route: string;
  icon: React.ReactNode;
}

const CORP_TABS: TabItem[] = [
  {
    id: 'map',
    label: 'Strategy Map',
    labelAr: 'خريطة الاستراتيجية',
    route: '/strategy/map',
    icon: <Compass size={14} />,
  },
  {
    id: 'org',
    label: 'Organization Alignment',
    labelAr: 'المواءمة وتدرج الإدارات',
    route: '/alignment/departments',
    icon: <Building2 size={14} />,
  },
  {
    id: 'scorecard',
    label: 'Balanced Scorecard',
    labelAr: 'بطاقة الأداء المتوازن',
    route: '/strategy/bsc',
    icon: <Table size={14} />,
  },
  {
    id: 'performance',
    label: 'Performance Analysis',
    labelAr: 'تحليل الأداء والمؤشرات',
    route: '/performance/analysis',
    icon: <LineChart size={14} />,
  },
  {
    id: 'initiatives',
    label: 'Strategic Initiatives',
    labelAr: 'المبادرات التنموية',
    route: '/execution/initiatives',
    icon: <Rocket size={14} />,
  },
  {
    id: 'risks',
    label: 'Strategic Risks',
    labelAr: 'المخاطر الاستراتيجية',
    route: '/execution/risks',
    icon: <ShieldAlert size={14} />,
  },
  {
    id: 'meeting',
    label: 'Governance Reviews',
    labelAr: 'مراجعات القيادة والقرارات',
    route: '/governance/reviews',
    icon: <CalendarCheck size={14} />,
  },
  {
    id: 'reports',
    label: 'Executive Reports',
    labelAr: 'مركز التقارير والتوثيق',
    route: '/reports',
    icon: <FileSpreadsheet size={14} />,
  },
];

export const CorporateSubnav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useApp();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '6px',
        overflowX: 'auto',
        userSelect: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      {CORP_TABS.map((tab) => {
        const isActive = location.pathname === tab.route;
        return (
          <div
            key={tab.id}
            onClick={() => navigate(tab.route)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '11px 16px',
              fontSize: '12.5px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#0f766e' : '#64748b',
              borderBottom: isActive ? '2px solid #0f766e' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              backgroundColor: isActive ? 'rgba(15, 118, 110, 0.04)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#0f766e';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ color: isActive ? '#0f766e' : '#94a3b8' }}>{tab.icon}</span>
            <span>{language === 'ar' ? tab.labelAr : tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};
