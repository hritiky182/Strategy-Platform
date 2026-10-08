import React from 'react';

interface SpeedometerGaugeProps {
  score: number | null;
  size?: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ score, size = 110 }) => {
  const safeScore = score === null || isNaN(score) ? 0 : Math.min(100, Math.max(0, score));

  // Determine color based on standard RAG
  const color =
    score === null
      ? '#94a3b8'
      : safeScore >= 100
      ? '#16a34a'
      : safeScore >= 90
      ? '#d97706'
      : '#dc2626';

  // Calculate needle angle between -90 deg (0%) and +90 deg (100%)
  const angle = (safeScore / 100) * 180 - 90;

  const width = size;
  const height = Math.round(size * 0.58);
  const cx = width / 2;
  const cy = height - 6;
  const r = width * 0.42;

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Arc: Red segment (0 - 89%) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * 0.1)} ${cy - r * Math.sin(Math.PI * 0.1)}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Amber segment (90 - 99%) */}
        <path
          d={`M ${cx + r * Math.cos(Math.PI * 0.1)} ${cy - r * Math.sin(Math.PI * 0.1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * 0.02)} ${cy - r * Math.sin(Math.PI * 0.02)}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="7"
        />
        {/* Green segment (100%) */}
        <path
          d={`M ${cx + r * Math.cos(Math.PI * 0.02)} ${cy - r * Math.sin(Math.PI * 0.02)} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#22c55e"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - r + 4}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
          <circle cx={cx} cy={cy} r="2" fill="#0f2b46" />
        </g>
      </svg>

      {/* Score text */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          fontSize: '11px',
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}
      >
        {score !== null ? `${score.toFixed(0)}%` : 'N/A'}
      </div>
    </div>
  );
};
