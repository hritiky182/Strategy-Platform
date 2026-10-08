import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle2 size={18} />;
            case 'error':
              return <AlertCircle size={18} />;
            case 'warning':
              return <AlertTriangle size={18} />;
            default:
              return <Info size={18} />;
          }
        };

        return (
          <div key={t.id} className={`toast ${t.type}`} role="alert">
            {getIcon()}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                padding: '2px',
              }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
