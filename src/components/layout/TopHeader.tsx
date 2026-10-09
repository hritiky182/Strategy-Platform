import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RoleName } from '../../types';
import {
  Search,
  Bell,
  Globe,
  RotateCcw,
  BookOpen,
  User as UserIcon,
  CheckCircle,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const TopHeader: React.FC = () => {
  const {
    settings,
    currentUser,
    entityConfig,
    setRole,
    setPeriod,
    setPlan,
    language,
    setLanguage,
    t,
    resetDemoData,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsDemoGuideOpen,
    notifications,
    plans,
    organizations,
    logout,
  } = useApp();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as RoleName);
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const allRoles: RoleName[] = [
    'System Administrator',
    'Strategy Manager',
    'Strategy Analyst',
    'Department Head',
    'KPI Contributor',
    'Performance Reviewer',
    'Initiative Owner',
    'Executive Approver',
    'Executive Viewer',
    'Auditor / Assurance Viewer',
  ];

  const navigate = useNavigate();
  const periodsList = ['Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027'];
  const currentPeriodIndex = periodsList.indexOf(settings.activePeriod);

  const handlePrevPeriod = () => {
    if (currentPeriodIndex > 0) {
      setPeriod(periodsList[currentPeriodIndex - 1]);
    }
  };

  const handleNextPeriod = () => {
    if (currentPeriodIndex < periodsList.length - 1) {
      setPeriod(periodsList[currentPeriodIndex + 1]);
    }
  };

  return (
    <>
      <header
        className="app-header"
        style={{
          background: 'linear-gradient(90deg, #091a30 0%, #0f2c4e 60%, #07192f 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0 20px',
          height: '60px',
          boxShadow: '0 4px 16px rgba(7, 25, 47, 0.4)',
        }}
      >
        {/* Bespoke AHDA Authority Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {/* AHDA Oasis & Palm Emblem */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/strategy/bsc')}
            title="Al Ahsa Development Authority (AHDA) Strategy Management Platform"
          >
            {/* Elegant Emblem SVG */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #059669 0%, #0f766e 50%, #0d9488 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.8px', color: '#ffffff' }}>
                  {entityConfig?.name ? entityConfig.name.split(' ').map(w => w[0]).join('').slice(0, 4) : 'AHDA'}
                </span>
                <span style={{ color: '#059669', fontSize: '13px', fontWeight: 800 }}>•</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>
                  {language === 'ar' ? (entityConfig?.nameAr || 'هيئة تطوير الأحساء') : (entityConfig?.name || 'Al Ahsa Development Authority')}
                </span>
              </div>
              <span style={{ fontSize: '10.5px', color: '#94a3b8', letterSpacing: '0.4px', marginTop: '2px' }}>
                {language === 'ar' ? 'منصة إدارة الاستراتيجية وبطاقة الأداء المتوازن' : 'Strategy Management & Balanced Scorecard Platform'}
              </span>
            </div>
          </div>

          {/* Primary View Toggle Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <button
              onClick={() => navigate('/strategy/bsc')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              {language === 'ar' ? 'استراتيجية الهيئة' : 'Authority Strategy'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              {language === 'ar' ? 'مهامي ومسؤولياتي' : 'My Responsibilities'}
            </button>
          </div>
        </div>

        {/* Center: Modern Glassmorphic Search Bar */}
        <div style={{ flex: 1, maxWidth: '380px', margin: '0 24px' }}>
          <div
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={14} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#cbd5e1' }}>
                {language === 'ar' ? 'بحث في المؤشرات، الأهداف، المبادرات...' : 'Search objectives, KPIs, initiatives...'}
              </span>
            </div>
            <kbd
              style={{
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                color: '#94a3b8',
                padding: '1px 5px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Global Controls & Period Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Period Selector with Navigation Arrows */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '20px',
              padding: '3px 10px',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
            }}
          >
            <button
              onClick={handlePrevPeriod}
              disabled={currentPeriodIndex <= 0}
              style={{
                background: 'none',
                border: 'none',
                color: currentPeriodIndex > 0 ? '#ffffff' : 'rgba(255,255,255,0.4)',
                cursor: currentPeriodIndex > 0 ? 'pointer' : 'default',
                padding: '0 2px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
              title="Previous Reporting Period"
            >
              &lt;
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 6px', whiteSpace: 'nowrap' }}>
              {settings.activePeriod}
            </span>
            <button
              onClick={handleNextPeriod}
              disabled={currentPeriodIndex >= periodsList.length - 1}
              style={{
                background: 'none',
                border: 'none',
                color: currentPeriodIndex < periodsList.length - 1 ? '#ffffff' : 'rgba(255,255,255,0.4)',
                cursor: currentPeriodIndex < periodsList.length - 1 ? 'pointer' : 'default',
                padding: '0 2px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
              title="Next Reporting Period"
            >
              &gt;
            </button>
          </div>

          {/* Role Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '4px 8px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <UserIcon size={12} style={{ color: '#ffffff' }} />
            <select
              value={settings.activeRole}
              onChange={handleRoleChange}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '11px',
                outline: 'none',
                cursor: 'pointer',
              }}
              title="Switch Demonstration Role"
            >
              {allRoles.map((r) => (
                <option key={r} value={r} style={{ color: '#0f172a' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Journey Wizard Launcher */}
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.35)',
            }}
            onClick={() => navigate('/setup-journey')}
            title="Open Step-by-Step Entity & Strategy Setup Wizard"
          >
            <Sparkles size={13} color="#ffffff" />
            <span>{language === 'ar' ? 'رحلة التجهيز' : 'Strategy Journey'}</span>
          </button>

          {/* Demo Guide Launcher */}
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
            onClick={() => setIsDemoGuideOpen(true)}
            title="Interactive 20-Scene Script Guide"
          >
            <BookOpen size={13} />
            <span>{t('demo_script')}</span>
          </button>

          {/* Notifications */}
          <button
            className="icon-button"
            onClick={() => setIsNotificationsOpen(true)}
            title={t('notifications')}
            aria-label="Notifications"
            style={{ color: '#ffffff' }}
          >
            <Bell size={15} />
            {unreadCount > 0 && <span className="badge-dot" />}
          </button>

          {/* Language Toggle */}
          <button
            className="icon-button"
            onClick={handleLanguageToggle}
            title={t('switch_language')}
            style={{ width: 'auto', padding: '0 8px', gap: '4px', color: '#ffffff' }}
          >
            <Globe size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>
              {language === 'en' ? 'عربي' : 'EN'}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            className="icon-button"
            onClick={() => setIsResetModalOpen(true)}
            title={t('reset_demo')}
            style={{ color: '#fca5a5' }}
            aria-label="Reset demo data"
          >
            <RotateCcw size={14} />
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderInlineStart: '1px solid rgba(255,255,255,0.2)',
                paddingInlineStart: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#ffffff',
                outline: 'none',
              }}
              title="Current User Profile & Session"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <ChevronDown
                size={13}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* Floating Profile & Session Dropdown */}
            {isProfileDropdownOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: language === 'ar' ? 'auto' : '0',
                    left: language === 'ar' ? '0' : 'auto',
                    width: '300px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)',
                    zIndex: 999,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease',
                  }}
                >
                  {/* User Profile Header */}
                  <div
                    style={{
                      padding: '14px 16px',
                      background: 'linear-gradient(135deg, #091a30 0%, #0f3460 100%)',
                      color: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 800,
                          border: '2px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {currentUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {currentUser.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                          {language === 'ar' ? currentUser.nameAr : currentUser.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          backgroundColor: 'rgba(5, 150, 105, 0.3)',
                          color: '#6ee7b7',
                          border: '1px solid rgba(5, 150, 105, 0.5)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {currentUser.role}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#cbd5e1' }}>
                        {language === 'ar' ? currentUser.titleAr : currentUser.title}
                      </span>
                    </div>
                  </div>

                  {/* Identity Connection Status */}
                  <div
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#f0fdf4',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      color: '#166534',
                    }}
                  >
                    <ShieldCheck size={14} style={{ color: '#059669' }} />
                    <span>
                      {language === 'ar'
                        ? 'جلسة موثقة: نفاذ / النظم المؤسسية (IAM)'
                        : 'Authenticated: AHDA IAM / Nafath SSO'}
                    </span>
                  </div>

                  {/* Actions List */}
                  <div style={{ padding: '6px' }}>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        navigate('/login');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                        textAlign: 'start',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserIcon size={14} style={{ color: '#0f766e' }} />
                        <span>{language === 'ar' ? 'تبديل الدور / الهوية' : 'Switch Identity / Persona'}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '1px 6px', borderRadius: '10px' }}>
                        10 Roles
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsDemoGuideOpen(true);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                        textAlign: 'start',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BookOpen size={14} style={{ color: '#0284c7' }} />
                      <span>{language === 'ar' ? 'دليل سيناريوهات التجربة (20 مشهد)' : 'Demo Playbook (20 Scenes)'}</span>
                    </button>

                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 6px' }} />

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                        navigate('/login', { replace: true });
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer',
                        textAlign: 'start',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={14} style={{ color: '#dc2626' }} />
                      <span>{language === 'ar' ? 'تسجيل الخروج والعودة للبوابة' : 'Sign Out to Login Portal'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={t('reset_demo')}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setIsResetModalOpen(false)}
            >
              {t('cancel')}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
            >
              <CheckCircle size={14} />
              <span>Confirm Reset</span>
            </button>
          </>
        }
      >
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
          Are you sure you want to reset all application state to the original Al Ahsa Development
          Authority (AHDA) demonstration baseline?
        </p>
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#991b1b',
          }}
        >
          All manually created users, updated actuals, and amendments will be reverted to the seed
          scenario (STR-2027-2030 v1, Q1 2027, Cycle Time = 25 days, 84% Objective Score).
        </div>
      </Modal>
    </>
  );
};
