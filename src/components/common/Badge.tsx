import React from 'react';
import { RagStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export const RagBadge: React.FC<{ status: RagStatus; textOverride?: string; showDot?: boolean }> = ({
  status,
  textOverride,
  showDot = true,
}) => {
  const { t } = useApp();

  const getLabel = () => {
    if (textOverride) return textOverride;
    switch (status) {
      case 'GREEN':
        return t('status_green');
      case 'AMBER':
        return t('status_amber');
      case 'RED':
        return t('status_red');
      default:
        return t('status_gray');
    }
  };

  const statusClass = status.toLowerCase();

  return (
    <span className={`rag-badge ${statusClass}`} role="status">
      {showDot && <span className="rag-dot" aria-hidden="true" />}
      <span>{getLabel()}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}> = ({ status, variant }) => {
  let resolvedVariant = variant;
  if (!resolvedVariant) {
    const s = status.toLowerCase();
    if (s.includes('approv') || s.includes('publish') || s.includes('complet') || s.includes('active')) {
      resolvedVariant = 'success';
    } else if (s.includes('risk') || s.includes('review') || s.includes('submit') || s.includes('progress')) {
      resolvedVariant = 'warning';
    } else if (s.includes('overdue') || s.includes('reject') || s.includes('return') || s.includes('deactiv')) {
      resolvedVariant = 'danger';
    } else {
      resolvedVariant = 'neutral';
    }
  }

  const badgeStyles: Record<string, { bg: string; color: string; border: string }> = {
    success: { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    warning: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    danger: { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
    info: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    neutral: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  };

  const current = badgeStyles[resolvedVariant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};
