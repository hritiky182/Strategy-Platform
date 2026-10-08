import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { t, settings } = useApp();

  const pathParts = location.pathname.split('/').filter(Boolean);

  const getReadableName = (part: string) => {
    switch (part) {
      case 'dashboard':
        return t('dashboard');
      case 'strategy':
        return t('nav_strategy');
      case 'planning-cycles':
        return t('planning_cycles');
      case 'diagnosis':
        return t('diagnosis');
      case 'options':
        return t('strategic_options');
      case 'definition':
        return t('strategy_definition');
      case 'bsc':
        return t('balanced_scorecard');
      case 'map':
        return t('strategy_map');
      case 'performance':
        return t('nav_performance');
      case 'kpis':
        return t('kpi_dictionary');
      case 'collection':
        return t('performance_collection');
      case 'results':
        return t('scorecard_results');
      case 'analysis':
        return t('performance_analysis');
      case 'execution':
        return t('nav_execution');
      case 'initiatives':
        return t('initiatives');
      case 'actions':
        return t('corrective_actions');
      case 'risks':
        return t('strategic_risks');
      case 'alignment':
        return t('nav_alignment');
      case 'departments':
        return t('department_scorecards');
      case 'governance':
        return t('nav_governance');
      case 'approvals':
        return t('approvals');
      case 'reviews':
        return t('strategy_reviews');
      case 'amendments':
        return t('amendments');
      case 'audit':
        return t('audit_history');
      case 'executive':
        return t('nav_reporting');
      case 'reports':
        return t('reports');
      case 'admin':
        return t('nav_admin');
      case 'users':
        return t('users');
      case 'organization':
        return t('organization_tree');
      case 'permissions':
        return t('roles_permissions');
      default:
        return part;
    }
  };

  return (
    <div className="breadcrumb-bar" aria-label="Breadcrumb navigation">
      <div className="breadcrumb-items">
        <Link to="/dashboard" className="breadcrumb-item" title="Home">
          <Home size={14} />
          <span>AHDA</span>
        </Link>

        {pathParts.map((part, index) => {
          const path = `/${pathParts.slice(0, index + 1).join('/')}`;
          const isLast = index === pathParts.length - 1;
          const label = getReadableName(part);

          return (
            <React.Fragment key={path}>
              <ChevronRight size={13} style={{ color: '#cbd5e1' }} />
              {isLast ? (
                <span className="breadcrumb-item active">{label}</span>
              ) : (
                <Link to={path} className="breadcrumb-item">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ fontSize: '11px', color: '#64748b' }}>
        Plan: <strong>STR-2027-2030 v1</strong> • Period: <strong>{settings.activePeriod}</strong>
      </div>
    </div>
  );
};
