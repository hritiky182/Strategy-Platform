import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  indicatorColor?: 'red' | 'amber' | 'green' | 'blue' | 'gray';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  indicatorColor,
  icon,
  onClick,
}) => {
  const indicatorClass = indicatorColor ? `has-indicator indicator-${indicatorColor}` : '';

  return (
    <div
      className={`stat-card ${indicatorClass}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stat-label">{title}</div>
        {icon && <div style={{ color: '#64748b' }}>{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
};
