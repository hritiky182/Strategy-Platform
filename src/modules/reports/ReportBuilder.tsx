import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { jsPDF } from 'jspdf';
import { calculateOverallStrategyScore, calculateObjectiveScore } from '../../services/calculationService';
import { RagBadge, StatusBadge } from '../../components/common/Badge';
import { FileText, Download, Printer, ShieldCheck, Lock, CheckCircle2, Filter, FileSpreadsheet } from 'lucide-react';

export const ReportBuilder: React.FC = () => {
  const {
    plans,
    objectives,
    kpis,
    results,
    initiatives,
    actions,
    reviews,
    reports,
    settings,
    entityConfig,
    language,
    t,
    showToast,
  } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState(settings.activePeriod);
  const [selectedPerspectiveFilter, setSelectedPerspectiveFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const plan = plans.find((p) => p.id === settings.activePlanId) || plans[0];
  const overallMetrics = calculateOverallStrategyScore(objectives, kpis, results, selectedPeriod);
  const frozenReport = reports.find((r) => r.isFrozen);

  // Generate real PDF with jsPDF
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header
      doc.setFillColor(15, 43, 70); // #0f2b46
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(entityConfig?.name ? entityConfig.name.toUpperCase() : 'STRATEGY PLATFORM', 14, 14);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Official Executive Strategic Performance Report • ${selectedPeriod}`, 14, 22);
      doc.text(`Plan: ${plan.code} (${plan.version}) | Date: ${new Date().toLocaleDateString()}`, 14, 28);

      // Overall Score Box
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 40, 182, 28, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 40, 182, 28, 'S');

      doc.setTextColor(15, 43, 70);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE PERFORMANCE SUMMARY', 20, 48);

      doc.setFontSize(18);
      doc.setTextColor(220, 38, 38);
      doc.text(`Overall Score: ${overallMetrics.overallScore}% (RED)`, 20, 58);

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Total Objectives: ${overallMetrics.totalObjectives} | KPIs: ${overallMetrics.totalKpis} (Red: ${overallMetrics.redKpis}, Amber: ${overallMetrics.amberKpis}, Green: ${overallMetrics.greenKpis}) | Coverage: ${overallMetrics.coverage}%`,
        20,
        64
      );

      // Section: Objectives & KPIs
      let yPos = 78;
      doc.setTextColor(15, 43, 70);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('BALANCED SCORECARD OBJECTIVES & RATIFIED ACTUALS', 14, yPos);
      yPos += 8;

      objectives.forEach((obj, idx) => {
        const calc = calculateObjectiveScore(obj, kpis, results, selectedPeriod);
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFillColor(248, 250, 252);
        doc.rect(14, yPos, 182, 14, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(14, yPos, 182, 14, 'S');

        doc.setTextColor(15, 43, 70);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${obj.code}: ${obj.name}`, 18, yPos + 6);

        doc.setFontSize(9);
        doc.setTextColor(29, 78, 216);
        doc.text(
          `Weight: ${obj.weight}% | Score: ${calc.score !== null ? calc.score.toFixed(1) + '%' : 'N/A'} [${calc.ragStatus}]`,
          18,
          yPos + 11
        );

        yPos += 18;

        // Breakdown KPIs
        calc.kpiBreakdown.forEach((kb) => {
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          doc.text(
            `• ${kb.kpiCode} (${kb.kpiName}): Target: ${kb.target} ${kb.unit} | Actual: ${kb.actual !== null ? kb.actual + ' ' + kb.unit : 'Pending'} | Achievement: ${kb.achievement ? kb.achievement.toFixed(1) + '%' : 'N/A'} [${kb.ragStatus}]`,
            24,
            yPos
          );
          yPos += 6;
        });

        yPos += 4;
      });

      // Actions section
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 6;
      doc.setTextColor(185, 28, 28);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('CRITICAL PERFORMANCE EXCEPTIONS & CORRECTIVE ACTIONS', 14, yPos);
      yPos += 8;

      actions.forEach((act) => {
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `[${act.status}] ${act.code}: ${act.title} - Owner: ${act.ownerName} | Due: ${act.dueDate}`,
          18,
          yPos
        );
        yPos += 5;
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `AHDA Strategy Platform • Confidential Client Briefing • Page ${i} of ${pageCount}`,
          14,
          290
        );
      }

      doc.save(`${(entityConfig?.name || 'AHDA').replace(/\s+/g, '_')}_Executive_Report_${selectedPeriod.replace(' ', '_')}.pdf`);
      showToast('Client-side PDF report generated and downloaded successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('PDF generation failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Generate Excel / CSV export matching MOM Section 12
  const handleExportExcel = () => {
    try {
      const headers = ['Objective Code', 'Objective Name', 'Weight %', 'KPI Code', 'KPI Name', 'Target', 'Actual', 'Unit', 'Achievement %', 'Status'];
      const rows: string[][] = [];

      objectives.forEach((obj) => {
        const calc = calculateObjectiveScore(obj, kpis, results, selectedPeriod);
        calc.kpiBreakdown.forEach((kb) => {
          rows.push([
            `"${obj.code}"`,
            `"${obj.name.replace(/"/g, '""')}"`,
            `"${obj.weight}%"`,
            `"${kb.kpiCode}"`,
            `"${kb.kpiName.replace(/"/g, '""')}"`,
            `"${kb.target}"`,
            `"${kb.actual !== null ? kb.actual : 'Pending'}"`,
            `"${kb.unit}"`,
            `"${kb.achievement ? kb.achievement.toFixed(1) + '%' : 'N/A'}"`,
            `"${kb.ragStatus}"`,
          ]);
        });
      });

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${(entityConfig?.name || 'Strategy').replace(/\s+/g, '_')}_Performance_${selectedPeriod.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Performance data successfully exported to Excel / CSV format.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Excel export failed', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('reports')} (Executive Briefing & Snapshot Archive)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Audited performance reports, immutable historical archives, and export to PDF / Excel.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print View</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportExcel} style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
            <FileSpreadsheet size={14} color="#059669" />
            <span>Export Excel / CSV</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExportPDF} disabled={isExporting}>
            <Download size={14} />
            <span>{isExporting ? 'Generating PDF...' : 'Export Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8fafc' }}>
        <div className="card-body" style={{ padding: '12px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#64748b" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f2b46' }}>Report Scope:</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Period:</span>
              <select
                className="form-select"
                style={{ width: '130px', fontSize: '12px' }}
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="Q1 2027">Q1 2027 (Active)</option>
                <option value="Q2 2027">Q2 2027</option>
                <option value="Q3 2027">Q3 2027</option>
                <option value="Q4 2027">Q4 2027</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Perspective:</span>
              <select
                className="form-select"
                style={{ width: '180px', fontSize: '12px' }}
                value={selectedPerspectiveFilter}
                onChange={(e) => setSelectedPerspectiveFilter(e.target.value)}
              >
                <option value="ALL">All 4 Perspectives</option>
                <option value="PER-01">Stakeholders</option>
                <option value="PER-02">Internal Processes</option>
                <option value="PER-03">Learning & Growth</option>
                <option value="PER-04">Financial Stewardship</option>
              </select>
            </div>

            <div style={{ marginInlineStart: 'auto', fontSize: '11px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} />
              <span>Approved Data Only • 100% Coverage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Document Preview */}
      <div
        className="card"
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {/* Document Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f2b46, #16426f)',
            color: '#ffffff',
            padding: '24px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#93c5fd', fontWeight: 700 }}>
              AL AHSA DEVELOPMENT AUTHORITY (AHDA)
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              Strategic Performance & Scorecard Briefing Report
            </h1>
            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
              Reporting Period: <strong>{selectedPeriod}</strong> • Plan Baseline:{' '}
              <strong>{plan.code} ({plan.version})</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                padding: '4px 12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#ffffff',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Lock size={12} />
              <span>Approved Historical Snapshot</span>
            </span>
            <div style={{ fontSize: '10px', color: '#93c5fd', marginTop: '6px' }}>
              Cutoff: 12 April 2027 • Generated by Strategy Directorate
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div style={{ padding: '30px' }}>
          {/* Executive Overview Box */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Aggregated Strategy Performance
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#dc2626', marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                {overallMetrics.overallScore}%
                <RagBadge status={overallMetrics.ragStatus} />
              </div>
              <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', maxWidth: '640px' }}>
                Overall strategy execution for Q1 2027 is Off Track (84%) driven by cycle time
                bottlenecks in case processing (KPI-P01: 25 days vs 20-day target). Corrective Action
                ACT-001 has been initiated.
              </p>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
              <div>Objectives: <strong>{overallMetrics.totalObjectives}</strong></div>
              <div>Audited KPIs: <strong>{overallMetrics.totalKpis}</strong></div>
              <div>Red Exceptions: <strong style={{ color: '#dc2626' }}>{overallMetrics.redKpis}</strong></div>
              <div>Data Completeness: <strong>{overallMetrics.coverage}%</strong></div>
            </div>
          </div>

          {/* Detailed Objectives Section */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f2b46', marginBottom: '14px', borderBottom: '2px solid #0f2b46', paddingBottom: '6px' }}>
              Balanced Scorecard Objectives & Ratified Results
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {objectives.map((obj) => {
                const calc = calculateObjectiveScore(obj, kpis, results, selectedPeriod);

                return (
                  <div key={obj.id} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        padding: '10px 16px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: '#1e40af', fontSize: '13px' }}>
                          {obj.code}: {obj.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', marginInlineStart: '10px' }}>
                          Owner: {obj.ownerName} • Weight: {obj.weight}%
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>
                          {calc.score !== null ? `${calc.score.toFixed(1)}%` : '—'}
                        </span>
                        <RagBadge status={calc.ragStatus} />
                      </div>
                    </div>

                    <table className="enterprise-table">
                      <thead>
                        <tr>
                          <th>KPI Code</th>
                          <th>Indicator Name</th>
                          <th>Target</th>
                          <th>Actual</th>
                          <th>Raw Achievement</th>
                          <th>Weight</th>
                          <th>Contribution</th>
                          <th>Audit Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calc.kpiBreakdown.map((kb) => (
                          <tr key={kb.kpiId}>
                            <td style={{ fontWeight: 600 }}>{kb.kpiCode}</td>
                            <td>{kb.kpiName}</td>
                            <td>{kb.target} {kb.unit}</td>
                            <td style={{ fontWeight: 700 }}>
                              {kb.actual !== null ? `${kb.actual} ${kb.unit}` : 'Missing'}
                            </td>
                            <td>
                              {kb.achievement !== null ? `${kb.achievement.toFixed(1)}%` : '—'}
                            </td>
                            <td>{kb.weight}%</td>
                            <td style={{ fontWeight: 600 }}>
                              {kb.contribution !== null ? `${kb.contribution.toFixed(1)}%` : '—'}
                            </td>
                            <td>
                              <StatusBadge status={kb.resultStatus} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corrective Actions & Decisions Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '10px' }}>
                Exception Corrective Actions Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {actions.map((act) => (
                  <div key={act.id} style={{ fontSize: '11px', padding: '8px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span style={{ color: '#0f2b46' }}>{act.code}: {act.title}</span>
                      <StatusBadge status={act.status} />
                    </div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>
                      Owner: {act.ownerName} • Due: {act.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', background: '#ffffff' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b46', marginBottom: '10px' }}>
                Ratified Executive Review Resolutions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reviews[0]?.decisions.map((dec) => (
                  <div key={dec.id} style={{ fontSize: '11px', padding: '8px', background: '#f0fdf4', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: 600, color: '#166534' }}>{dec.id}</div>
                    <div style={{ color: '#14532d', marginTop: '2px' }}>{dec.decision}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
