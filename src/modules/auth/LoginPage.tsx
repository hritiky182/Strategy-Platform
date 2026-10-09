import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Globe,
  Sparkles,
  CheckCircle2,
  Building2,
  Compass,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    users,
    language,
    setLanguage,
    currentUser,
    isAuthenticated,
    session,
    login,
    logout,
    entityConfig,
  } = useApp();

  const navigate = useNavigate();

  // Admin persona default
  const adminUser =
    users.find((u) => u.role === 'Strategy Manager') ||
    users.find((u) => u.role === 'System Administrator') ||
    users[0];

  const [emailInput, setEmailInput] = useState(adminUser?.email || 's.otaibi@test.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Find matching admin or default to Strategy Manager / Specialist
      const matchedUser =
        users.find((u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()) || adminUser;

      login(matchedUser, 'credentials');
      setIsSubmitting(false);
      navigate('/setup-journey', { replace: true });
    }, 350);
  };

  const isArabic = language === 'ar';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #07192f 0%, #0b2545 45%, #053b2f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: isArabic ? 'Cairo, sans-serif' : 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Login Card - Clean, Uncluttered Split Layout */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          minHeight: '560px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Left Side: Brand & Strategic Platform Context */}
        <div
          style={{
            background: 'linear-gradient(155deg, #091a30 0%, #0c2b4d 60%, #064032 100%)',
            padding: '48px 44px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            {/* Top Brand Crest */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(5, 150, 105, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Compass size={24} color="#ffffff" />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    letterSpacing: '0.4px',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {isArabic ? entityConfig.nameAr || 'هيئة تطوير الأحساء' : entityConfig.name || 'AL AHSA DEVELOPMENT AUTHORITY'}
                </h2>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#34d399', marginTop: '2px' }}>
                  {isArabic ? 'منصة الإدارة الاستراتيجية وبطاقة الأداء' : 'Strategy & Performance Management Platform'}
                </div>
              </div>
            </div>

            {/* Strategic Value Proposition */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6ee7b7',
                  marginBottom: '16px',
                }}
              >
                <Sparkles size={12} />
                <span>{isArabic ? 'رحلة البداية والتجهيز المؤسسي' : 'End-to-End Strategic Demo Journey'}</span>
              </div>

              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  lineHeight: 1.35,
                  color: '#ffffff',
                  marginBottom: '14px',
                }}
              >
                {isArabic
                  ? 'حوكمة استراتيجية متكاملة من الرؤية إلى التنفيذ'
                  : 'Orchestrating Strategy from Vision into Measurable Impact'}
              </h1>

              <p
                style={{
                  fontSize: '13.5px',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                  marginBottom: '28px',
                }}
              >
                {isArabic
                  ? 'بناء الهيكل التنظيمي، صياغة الأهداف ومؤشرات الأداء (KPIs)، وإطلاق المبادرات مع توصيات الذكاء الاصطناعي والمتابعة المباشرة.'
                  : 'Configure entity parameters, establish organization hierarchy, formulate objectives & KPIs, and drive strategic initiatives with integrated AI recommendations.'}
              </p>
            </div>

            {/* Clean 4-Chapter Journey Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                {
                  num: '01',
                  title: isArabic ? 'إعداد الهيئة والهوية' : 'Chapter 1: Entity & Branding Setup',
                  desc: isArabic ? 'تخصيص الشعار، الألوان، والمحددات' : 'Name, logo, colors & institutional parameters',
                },
                {
                  num: '02',
                  title: isArabic ? 'الهيكل التنظيمي والصلاحيات' : 'Chapter 2: Organization & Hierarchy',
                  desc: isArabic ? 'مستويات القيادة، الإدارات، والمستخدمين' : 'Leadership layers, departments & authority',
                },
                {
                  num: '03',
                  title: isArabic ? 'التخطيط الاستراتيجي والمؤشرات' : 'Chapter 3: Strategy & Balanced Scorecard',
                  desc: isArabic ? 'الرؤية، الأهداف، KPIs والمبادرات + AI' : 'Vision, pillars, objectives, KPIs & initiatives',
                },
                {
                  num: '04',
                  title: isArabic ? 'لوحة القياس والتقارير' : 'Chapter 4: Monitoring & Executive Reports',
                  desc: isArabic ? 'متابعة الأداء والتصدير (PDF / Excel)' : 'Target vs. actual tracking, export & analytics',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#34d399',
                      backgroundColor: 'rgba(5, 150, 105, 0.25)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '11.5px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>iValue Platform Architecture</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>v2.4 Ready</span>
          </div>
        </div>

        {/* Right Side: Clean, Focused Sign-In Form for Administrator */}
        <div
          style={{
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            {/* Top Bar with Language Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0f766e',
                    letterSpacing: '0.6px',
                  }}
                >
                  {isArabic ? 'بوابة التحقق المعتمدة' : 'SECURE ACCESS GATEWAY'}
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0f2b46',
                    marginTop: '2px',
                    margin: 0,
                  }}
                >
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#0f766e',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <Globe size={13} />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </div>

            {/* Active Role Notice: Strategy Specialist / Administrator */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  flexShrink: 0,
                }}
              >
                SO
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46' }}>
                  {isArabic ? adminUser.nameAr : adminUser.name}
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600 }}>
                    {isArabic ? 'مدير الاستراتيجية والمسؤول المعتمد' : 'Strategy Specialist & Authorized Administrator'}
                  </span>
                  <span>•</span>
                  <span>{adminUser.role}</span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  {isArabic ? 'البريد الإلكتروني المؤسسي' : 'Authorized Work Email'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: isArabic ? 'auto' : '12px',
                      right: isArabic ? '12px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      paddingLeft: isArabic ? '14px' : '38px',
                      paddingRight: isArabic ? '38px' : '14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#0f766e')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    {isArabic ? 'كلمة المرور' : 'Password'}
                  </label>
                  <span style={{ fontSize: '11px', color: '#0f766e', cursor: 'pointer', fontWeight: 600 }}>
                    {isArabic ? 'استعادة الرمز؟' : 'Reset?'}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: isArabic ? 'auto' : '12px',
                      right: isArabic ? '12px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      paddingLeft: isArabic ? '14px' : '38px',
                      paddingRight: isArabic ? '38px' : '14px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#0f766e')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>
              </div>

              {/* Remember Me & SSO Note */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#059669', width: '15px', height: '15px' }}
                  />
                  <span>{isArabic ? 'تذكر الجلسة في هذا المتصفح' : 'Keep session active'}</span>
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="#059669" />
                  <span>IAM 2.0</span>
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '12px 18px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  transition: 'background 0.15s ease, transform 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              >
                <span>
                  {isSubmitting
                    ? isArabic
                      ? 'جارِ التحقق والبدء...'
                      : 'Authenticating...'
                    : isArabic
                      ? 'تسجيل الدخول وبدء رحلة التجهيز'
                      : 'Sign In & Launch Setup Journey'}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Direct Quick Launch Notice */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px' }}>
              {isArabic
                ? 'سيتم توجيهك مباشرة إلى معالج إعداد الهيئة والتخطيط الاستراتيجي'
                : 'Directly opens Step-by-Step Entity & Strategy Setup Wizard'}
            </div>
            <button
              type="button"
              onClick={() => handleLogin()}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#0f766e',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Sparkles size={12} />
              <span>{isArabic ? 'دخول سريع تجريبي (مسؤول الاستراتيجية)' : 'Instant 1-Click Demo Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
