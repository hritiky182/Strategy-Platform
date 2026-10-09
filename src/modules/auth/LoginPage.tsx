import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Globe,
  Compass,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    users,
    language,
    setLanguage,
    login,
    entityConfig,
  } = useApp();

  const navigate = useNavigate();

  // Admin persona default
  const adminUser =
    users.find((u) => u.role === 'Strategy Manager') ||
    users.find((u) => u.role === 'System Administrator') ||
    users[0];

  const [emailInput, setEmailInput] = useState(adminUser?.email || 'admin@ahda.gov.sa');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const matchedUser =
        users.find((u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()) || adminUser;

      login(matchedUser, 'credentials');
      setIsSubmitting(false);
      navigate('/setup-journey', { replace: true });
    }, 300);
  };

  const isArabic = language === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc',
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        fontFamily: isArabic ? 'Cairo, sans-serif' : 'Inter, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      {/* Top Bar: Language Switcher */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: isArabic ? 'auto' : '28px',
          left: isArabic ? '28px' : 'auto',
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '7px 14px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <Globe size={14} color="#059669" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>

      {/* Main Login Card - Clean, Light, Uncluttered */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow:
            '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.02)',
          padding: '36px 32px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Compass size={24} color="#ffffff" />
          </div>

          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {isArabic
              ? entityConfig?.nameAr || 'هيئة تطوير الأحساء'
              : entityConfig?.name || 'Al Ahsa Development Authority'}
          </h2>

          <p
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#059669',
              margin: '4px 0 0 0',
            }}
          >
            {isArabic
              ? 'منصة الإدارة والتخطيط الاستراتيجي'
              : 'Strategy & Performance Management'}
          </p>
        </div>

        {/* Section Title */}
        <div style={{ marginBottom: '22px' }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 4px 0',
            }}
          >
            {isArabic ? 'تسجيل الدخول' : 'Sign In'}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0,
            }}
          >
            {isArabic
              ? 'أدخل بيانات الاعتماد للوصول إلى لوحة الإدارة'
              : 'Enter your credentials to access the platform'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Work Email */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px',
              }}
            >
              {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
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
                  pointerEvents: 'none',
                }}
              />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@ahda.gov.sa"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingLeft: isArabic ? '14px' : '38px',
                  paddingRight: isArabic ? '38px' : '14px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '12px',
                  color: '#059669',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => alert(isArabic ? 'حساب تجريبي مصرح له مسبقاً.' : 'Demo account pre-authorized.')}
              >
                {isArabic ? 'استعادة كلمة المرور؟' : 'Forgot?'}
              </button>
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
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 38px',
                  paddingLeft: isArabic ? '38px' : '38px',
                  paddingRight: isArabic ? '38px' : '38px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#059669';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: isArabic ? 'auto' : '12px',
                  left: isArabic ? '12px' : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '12.5px',
                color: '#475569',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: '#059669',
                  width: '15px',
                  height: '15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              />
              <span>{isArabic ? 'تذكر بيانات الدخول' : 'Remember me'}</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '6px',
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
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#047857';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#059669';
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{isArabic ? 'جارِ الدخول...' : 'Signing in...'}</span>
              </>
            ) : (
              <>
                <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
                {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </>
            )}
          </button>
        </form>

        {/* Minimal Footer Note */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
            fontSize: '11.5px',
            color: '#94a3b8',
          }}
        >
          <span>
            {isArabic
              ? 'بوابة مسؤول الاستراتيجية المعتمد'
              : 'Authorized Strategy Administrator Access'}
          </span>
        </div>
      </div>
    </div>
  );
};
