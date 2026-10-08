import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RoleName } from '../../types';
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  KeyRound,
  Fingerprint,
  Globe,
  Sparkles,
  CheckCircle2,
  Building,
  Layers,
  FileCheck,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    users,
    setRole,
    language,
    setLanguage,
    t,
    currentUser,
    showToast,
    isAuthenticated,
    session,
    login,
    logout,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from;

  const [activeTab, setActiveTab] = useState<'personas' | 'nafath' | 'credentials'>('personas');
  const [emailInput, setEmailInput] = useState('m.ghamdi@test.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isMfaSimulated, setIsMfaSimulated] = useState(true);
  const [otpCode, setOtpCode] = useState('841-209');
  const [authError, setAuthError] = useState<string | null>(null);

  // Nafath SSO simulation state
  const [nafathId, setNafathId] = useState('1084920194');
  const [nafathChallengeNumber, setNafathChallengeNumber] = useState('48');
  const [isNafathWaiting, setIsNafathWaiting] = useState(false);

  const handleSelectUser = (user: (typeof users)[0], defaultRoute = '/dashboard') => {
    login(user, 'persona');
    const targetRoute = fromPath && fromPath !== '/login' ? fromPath : defaultRoute;
    navigate(targetRoute, { replace: true });
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (matchedUser) {
      login(matchedUser, 'credentials');
      const targetRoute = fromPath && fromPath !== '/login' ? fromPath : '/dashboard';
      navigate(targetRoute, { replace: true });
    } else {
      setAuthError(
        language === 'ar'
          ? 'البريد الإلكتروني غير مسجل في الدليل المعتمد. جرب: m.ghamdi@test.com'
          : 'Email not found in authorized directory. Try: m.ghamdi@test.com'
      );
    }
  };

  const handleNafathInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNafathWaiting(true);
  };

  const handleNafathApprove = () => {
    // Authenticate as H.E. CEO / Governor
    const ceo = users.find((u) => u.role === 'Executive Approver') || users[0];
    login(ceo, 'nafath');
    const targetRoute = fromPath && fromPath !== '/login' ? fromPath : '/executive/dashboard';
    navigate(targetRoute, { replace: true });
  };

  // Grouped personas for intuitive navigation
  const leadershipUsers = users.filter((u) =>
    ['Executive Approver', 'Executive Viewer', 'Performance Reviewer'].includes(u.role)
  );
  const strategyUsers = users.filter((u) =>
    ['Strategy Manager', 'Strategy Analyst'].includes(u.role)
  );
  const operationsUsers = users.filter((u) =>
    ['Department Head', 'KPI Contributor', 'Initiative Owner'].includes(u.role)
  );
  const governanceUsers = users.filter((u) =>
    ['System Administrator', 'Auditor / Assurance Viewer'].includes(u.role)
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 75% 20%, #064e3b 0%, #0b1f3a 50%, #051329 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: language === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
      }}
    >
      <div className="auth-card-container">
        {/* Left Side: AHDA Authority Vision & Strategic Governance Showcase */}
        <div
          style={{
            background: 'linear-gradient(150deg, #091a30 0%, #0a2540 55%, #053b2f 100%)',
            padding: '44px 40px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            borderInlineEnd: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '-60px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div>
            {/* AHDA Brand Crest */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </svg>
              </div>

              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.6px', color: '#ffffff', margin: 0 }}>
                  AL AHSA DEVELOPMENT AUTHORITY
                </h1>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                  هيئة تطوير الأحساء • المملكة العربية السعودية
                </div>
              </div>
            </div>

            {/* Strategic Platform Title */}
            <div style={{ marginTop: '20px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6ee7b7',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={12} />
                <span>Strategy Management & Balanced Scorecard Platform</span>
              </span>

              <h2 style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1.3, color: '#ffffff' }}>
                {language === 'ar'
                  ? 'ترجمة المهام التنظيمية إلى أثر استراتيجي ملموس'
                  : 'Translating Regional Mandate into Strategic Impact'}
              </h2>

              <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.6 }}>
                {language === 'ar'
                  ? 'بيئة حوكمة مؤسسية موحدة تربط الأولويات الإقليمية، نتائج التشخيص، بطاقة الأداء المتوازن، وتأكيد الإنجاز المستقل وفق رؤية 2030.'
                  : 'Unified enterprise governance environment connecting regional priorities, diagnostic SWOT evidence, 4 Balanced Scorecard perspectives, cascade alignment, and independent performance assurance.'}
              </p>
            </div>

            {/* Feature Points */}
            <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  title: 'Plan STR-2027-2030 (v1.0 Baseline)',
                  desc: 'Authority-wide approved priorities and strategic themes',
                },
                {
                  title: 'Maker-Checker Segregation of Duties',
                  desc: 'Role-based authorization blocking self-approval at service layer',
                },
                {
                  title: 'Mathematical Score Engine',
                  desc: 'Formula weighting: 80% (60%) + 90% (40%) = 84% RED',
                },
                {
                  title: 'Saudi National SSO & Nafath Standard',
                  desc: 'Integrated IAM OAuth 2.0 with biometric Nafath MFA simulation',
                },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(52, 211, 153, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{item.title}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direct Access Link */}
          <div style={{ marginTop: '28px' }}>
            <button
              onClick={() => {
                const manager = users.find((u) => u.role === 'Strategy Manager') || users[0];
                login(manager, 'persona');
                navigate('/strategy/bsc', { replace: true });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#6ee7b7',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            >
              <span>{language === 'ar' ? 'استعراض بطاقة الأداء وخريطة الاستراتيجية مباشرة' : 'Direct Rehearsal: Explore Scorecard & Strategy Map'}</span>
              <ArrowRight size={13} />
            </button>

            <div
              style={{
                marginTop: '16px',
                padding: '10px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#94a3b8',
                lineHeight: 1.5,
              }}
            >
              <span>CIS & iValue • Balanced Scorecard Methodology • Demonstration Playbook</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Controls & Persona Selector */}
        <div style={{ padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
          <div>
            {/* Header with Language Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f2b46', margin: 0 }}>
                  {language === 'ar' ? 'تسجيل الدخول المؤسسي' : 'Enterprise Authentication'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {language === 'ar' ? 'بوابة التحقق ونفاذ القيادات والمساهمين' : 'Single Sign-On & Role-Based Access Control'}
                </span>
              </div>

              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0f766e',
                  cursor: 'pointer',
                }}
              >
                <Globe size={13} />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>

            {/* Security Alert: Redirected from Protected Route */}
            {fromPath && !isAuthenticated && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#92400e',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Lock size={15} style={{ color: '#d97706', flexShrink: 0 }} />
                <span>
                  {language === 'ar'
                    ? `مطلوب تسجيل الدخول: يُرجى تأكيد الهوية للوصول إلى المسار المطلوب (${fromPath})`
                    : `Authentication required: Please verify your identity to access (${fromPath})`}
                </span>
              </div>
            )}

            {/* Active Session Status Banner */}
            {isAuthenticated && session && (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#065f46',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669' }} />
                  <span>
                    <strong>Active Session:</strong> {currentUser.name} ({currentUser.role})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => navigate(fromPath || '/dashboard')}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Resume Workspace →
                  </button>
                  <button
                    onClick={logout}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Simulated SSO IAM Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#166534',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={15} style={{ color: '#059669', flexShrink: 0 }} />
              <span>
                <strong>Simulated Identity Connection:</strong> IAM / OAuth 2.0 connected with segregated roles (Scene 01).
              </span>
            </div>

            {/* Authentication Pathway Tabs (3 Modes) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '4px',
                gap: '4px',
                marginBottom: '18px',
              }}
            >
              <button
                onClick={() => setActiveTab('personas')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'personas' ? '#ffffff' : 'transparent',
                  color: activeTab === 'personas' ? '#0f766e' : '#64748b',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'personas' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <UserCheck size={13} />
                <span>{language === 'ar' ? 'أدوار التجربة (10)' : 'Playbook Personas'}</span>
              </button>

              <button
                onClick={() => setActiveTab('nafath')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'nafath' ? '#ffffff' : 'transparent',
                  color: activeTab === 'nafath' ? '#0f766e' : '#64748b',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'nafath' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Smartphone size={13} />
                <span>{language === 'ar' ? 'نفاذ الوطني' : 'Nafath SSO'}</span>
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'credentials' ? '#ffffff' : 'transparent',
                  color: activeTab === 'credentials' ? '#0f766e' : '#64748b',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'credentials' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Lock size={13} />
                <span>{language === 'ar' ? 'البريد + MFA' : 'Work Email + MFA'}</span>
              </button>
            </div>

            {/* TAB 1: PLAYBOOK PERSONAS DIRECTORY (GROUPED) */}
            {activeTab === 'personas' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {/* Section A: Executive Leadership */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.6px', marginBottom: '6px' }}>
                    {language === 'ar' ? 'القيادة التنفيذية ومجلس الإدارة' : 'Executive Leadership & Board'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {leadershipUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() =>
                          handleSelectUser(
                            u,
                            u.role === 'Executive Approver'
                              ? '/executive/dashboard'
                              : u.role === 'Performance Reviewer'
                              ? '/performance/results'
                              : '/dashboard'
                          )
                        }
                        style={{
                          padding: '9px 12px',
                          border: currentUser?.id === u.id ? '2px solid #0f766e' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: currentUser?.id === u.id ? '#f0fdf4' : '#ffffff',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            currentUser?.id === u.id ? '#f0fdf4' : '#ffffff')
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2b46' }}>
                              {language === 'ar' ? u.nameAr : u.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#b91c1c', backgroundColor: '#fee2e2', padding: '1px 5px', borderRadius: '4px' }}>
                                {u.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {language === 'ar' ? u.titleAr : u.title}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: '#0f766e' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Strategy & Performance Office (OSM) */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.6px', marginBottom: '6px' }}>
                    {language === 'ar' ? 'مكتب إدارة الاستراتيجية والأداء' : 'Strategy & Performance Office (OSM)'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {strategyUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() =>
                          handleSelectUser(
                            u,
                            u.role === 'Strategy Manager' ? '/strategy/bsc' : '/strategy/diagnosis'
                          )
                        }
                        style={{
                          padding: '9px 12px',
                          border: currentUser?.id === u.id ? '2px solid #0f766e' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: currentUser?.id === u.id ? '#f0fdf4' : '#ffffff',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            currentUser?.id === u.id ? '#f0fdf4' : '#ffffff')
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#dbeafe',
                              color: '#1d4ed8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2b46' }}>
                              {language === 'ar' ? u.nameAr : u.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '1px 5px', borderRadius: '4px' }}>
                                {u.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {language === 'ar' ? u.titleAr : u.title}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: '#0f766e' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Operations & Initiatives */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.6px', marginBottom: '6px' }}>
                    {language === 'ar' ? 'القطاعات التشغيلية والمبادرات' : 'Operations & Strategic Initiatives'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {operationsUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() =>
                          handleSelectUser(
                            u,
                            u.role === 'KPI Contributor'
                              ? '/performance/collection'
                              : u.role === 'Initiative Owner'
                              ? '/execution/initiatives'
                              : '/alignment/departments'
                          )
                        }
                        style={{
                          padding: '9px 12px',
                          border: currentUser?.id === u.id ? '2px solid #0f766e' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: currentUser?.id === u.id ? '#f0fdf4' : '#ffffff',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            currentUser?.id === u.id ? '#f0fdf4' : '#ffffff')
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#e0f2fe',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2b46' }}>
                              {language === 'ar' ? u.nameAr : u.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '1px 5px', borderRadius: '4px' }}>
                                {u.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {language === 'ar' ? u.titleAr : u.title}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: '#0f766e' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section D: Admin & Governance */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.6px', marginBottom: '6px' }}>
                    {language === 'ar' ? 'إدارة النظم والمراجعة والامتثال' : 'Administration & Audit Assurance'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {governanceUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() =>
                          handleSelectUser(
                            u,
                            u.role === 'System Administrator' ? '/admin/users' : '/governance/audit'
                          )
                        }
                        style={{
                          padding: '9px 12px',
                          border: currentUser?.id === u.id ? '2px solid #0f766e' : '1px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: currentUser?.id === u.id ? '#f0fdf4' : '#ffffff',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            currentUser?.id === u.id ? '#f0fdf4' : '#ffffff')
                        }
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          >
                            {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2b46' }}>
                              {language === 'ar' ? u.nameAr : u.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#334155', backgroundColor: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                                {u.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {language === 'ar' ? u.titleAr : u.title}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: '#0f766e' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: NAFATH NATIONAL SINGLE SIGN-ON (نفاذ) */}
            {activeTab === 'nafath' && (
              <div style={{ padding: '8px 4px' }}>
                {!isNafathWaiting ? (
                  <form onSubmit={handleNafathInitiate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        padding: '14px',
                        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#065f46',
                          fontWeight: 900,
                          fontSize: '18px',
                        }}
                      >
                        نفاذ
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800 }}>
                          {language === 'ar' ? 'النفاذ الوطني الموحد' : 'Nafath National Single Sign-On'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#a7f3d0', marginTop: '2px' }}>
                          {language === 'ar'
                            ? 'التحقق البيومتري المعتمد لمسؤولي وقيادات هيئة تطوير الأحساء'
                            : 'Official Government Authentication for AHDA Leadership & Officers'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                        {language === 'ar' ? 'رقم الهوية الوطنية / الإقامة' : 'National ID / Iqama Number'}
                      </label>
                      <div className="input-icon-wrapper">
                        <Fingerprint size={16} className="input-icon" />
                        <input
                          type="text"
                          className="form-control"
                          value={nafathId}
                          onChange={(e) => setNafathId(e.target.value)}
                          placeholder="10XXXXXXXX"
                          style={{ fontSize: '13.5px', fontWeight: 700, letterSpacing: '1px' }}
                          required
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                        {language === 'ar'
                          ? 'الهوية المعتمدة لمعالي الرئيس التنفيذي: 1084920194'
                          : 'Pre-filled with H.E. CEO credential: 1084920194'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        padding: '11px',
                        fontSize: '13px',
                        fontWeight: 700,
                        justifyContent: 'center',
                        backgroundColor: '#059669',
                      }}
                    >
                      <Zap size={15} />
                      <span>{language === 'ar' ? 'طلب رمز التحقق عبر تطبيق نفاذ' : 'Send Verification Request via Nafath'}</span>
                    </button>
                  </form>
                ) : (
                  <div
                    style={{
                      padding: '24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '2px dashed #059669',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '8px' }}>
                      {language === 'ar'
                        ? 'يرجى فتح تطبيق نفاذ على هاتفك المحمول واختيار الرقم التالي:'
                        : 'Please open the Nafath App on your mobile device and select this verification number:'}
                    </div>

                    {/* Challenge Number Card */}
                    <div
                      style={{
                        fontSize: '48px',
                        fontWeight: 900,
                        color: '#065f46',
                        letterSpacing: '4px',
                        margin: '12px auto',
                        backgroundColor: '#ecfdf5',
                        width: '120px',
                        padding: '10px 0',
                        borderRadius: '12px',
                        border: '2px solid #059669',
                      }}
                    >
                      {nafathChallengeNumber}
                    </div>

                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600, marginBottom: '20px' }}>
                      {language === 'ar'
                        ? 'الطلب موجه لحساب: معالي م. سلطان المبارك (الرئيس التنفيذي)'
                        : 'Authorizing identity: HE Eng. Sultan Al-Mubarak (Executive Approver / CEO)'}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsNafathWaiting(false)}
                        style={{ fontSize: '12px' }}
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNafathApprove}
                        style={{ fontSize: '12px', backgroundColor: '#059669' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>{language === 'ar' ? 'محاكاة الموافقة في تطبيق نفاذ' : 'Simulate Approval in Nafath App'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WORK CREDENTIALS + MFA */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {authError && (
                  <div style={{ padding: '8px 12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
                    {authError}
                  </div>
                )}

                <div>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    AHDA Work Email
                  </label>
                  <div className="input-icon-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      className="form-control"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. m.ghamdi@test.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                    Password
                  </label>
                  <div className="input-icon-wrapper">
                    <Lock size={16} className="input-icon" />
                    <input
                      type="password"
                      className="form-control"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                {/* Simulated MFA Section */}
                <div style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f2b46' }}>
                      <Fingerprint size={15} style={{ color: '#0f766e' }} />
                      <span>Simulated Multi-Factor Authentication (MFA)</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isMfaSimulated}
                        onChange={(e) => setIsMfaSimulated(e.target.checked)}
                      />
                      <span>Enforce</span>
                    </label>
                  </div>

                  {isMfaSimulated && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="input-icon-wrapper" style={{ flex: 1 }}>
                        <KeyRound size={15} className="input-icon" />
                        <input
                          type="text"
                          className="form-control"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Nafath / Authenticator OTP"
                          style={{ letterSpacing: '2px', fontWeight: 700, fontFamily: 'monospace' }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '11.5px',
                          color: '#15803d',
                          backgroundColor: '#dcfce7',
                          border: '1px solid #86efac',
                          fontWeight: 700,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        ✓ Verified
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: 700, justifyContent: 'center' }}
                >
                  <UserCheck size={16} />
                  <span>Authenticate & Enter Workspace</span>
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
            <span>AHDA Security & Compliance Standard (ISO 27001)</span>
            <span style={{ color: '#0f766e', fontWeight: 600 }}>Playbook Scene 01: IAM Identity Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
