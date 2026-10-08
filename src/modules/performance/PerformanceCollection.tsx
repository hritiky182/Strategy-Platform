import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceResult } from '../../types';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, AlertCircle, PlayCircle, Plus } from 'lucide-react';

interface CsvRowPreview {
  kpiCode: string;
  period: string;
  actual: string;
  evidence: string;
  valid: boolean;
  error?: string;
}

export const PerformanceCollection: React.FC = () => {
  const { kpis, results, addResult, updateResult, settings, users, showToast, t } = useApp();

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState(
    `KPI_CODE,PERIOD,ACTUAL,EVIDENCE\nKPI-P01,Q1 2027,25,case_processing_extract.csv\nKPI-P02,Q1 2027,81,digital_bus_report.pdf\nKPI-INVALID,Q1 2027,99,error_demo.pdf\nKPI-P03,Q1 2027,150,out_of_range_percentage.pdf`
  );

  const [previewRows, setPreviewRows] = useState<CsvRowPreview[]>([]);
  const [hasParsed, setHasParsed] = useState(false);

  // Parse simulated CSV
  const handleParseCsv = () => {
    const lines = csvContent.trim().split('\n');
    const rows: CsvRowPreview[] = [];

    // Skip header line 0
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length < 3) continue;

      const [code, period, actualStr, evidence] = parts;
      const actualVal = parseFloat(actualStr);

      const targetKpi = kpis.find((k) => k.code === code);

      if (!targetKpi) {
        rows.push({
          kpiCode: code,
          period,
          actual: actualStr,
          evidence: evidence || '',
          valid: false,
          error: `Invalid KPI Code "${code}": Record not found in KPI Dictionary.`,
        });
      } else if (isNaN(actualVal)) {
        rows.push({
          kpiCode: code,
          period,
          actual: actualStr,
          evidence: evidence || '',
          valid: false,
          error: `Invalid actual value "${actualStr}": Must be numeric.`,
        });
      } else if (targetKpi.unit === '%' && (actualVal < 0 || actualVal > 100)) {
        rows.push({
          kpiCode: code,
          period,
          actual: actualStr,
          evidence: evidence || '',
          valid: false,
          error: `Out-of-range value (${actualVal}%): Percentage indicators must be between 0% and 100%.`,
        });
      } else {
        rows.push({
          kpiCode: code,
          period,
          actual: actualStr,
          evidence: evidence || 'Uploaded extract',
          valid: true,
        });
      }
    }

    setPreviewRows(rows);
    setHasParsed(true);
  };

  const handleCommitValidRows = () => {
    const validRows = previewRows.filter((r) => r.valid);

    validRows.forEach((row) => {
      const targetKpi = kpis.find((k) => k.code === row.kpiCode)!;
      const existing = results.find(
        (r) => r.kpiId === targetKpi.id && r.period === row.period
      );

      if (existing) {
        updateResult({
          ...existing,
          actual: parseFloat(row.actual),
          evidenceTitle: row.evidence,
          status: 'Submitted',
        });
      } else {
        addResult({
          id: `RES-${targetKpi.code}-${row.period.replace(' ', '-')}`,
          kpiId: targetKpi.id,
          period: row.period,
          year: 2027,
          quarter: 'Q1',
          actual: parseFloat(row.actual),
          target: targetKpi.target,
          status: 'Submitted',
          submittedBy: 'USR-05',
          submittedAt: new Date().toISOString(),
          evidenceTitle: row.evidence,
          version: 1,
          history: [],
        });
      }
    });

    showToast(`Committed ${validRows.length} valid performance entries into the review queue. Invalid rows were safely rejected.`, 'success');
    setIsCsvModalOpen(false);
    setHasParsed(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f2b46' }}>
            {t('performance_collection')} (Data Ingestion & Schedule)
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Reporting period: <strong>{settings.activePeriod}</strong> • Monitoring data completeness, collection cadences, and batch imports.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCsvModalOpen(true)}>
          <FileSpreadsheet size={15} />
          <span>Simulate Batch CSV Import</span>
        </button>
      </div>

      {/* Collection Tasks Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UploadCloud size={16} />
            <span>Active Collection Schedule ({settings.activePeriod})</span>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>KPI Code</th>
                <th>Indicator Name</th>
                <th>Assigned Data Collector</th>
                <th>Target</th>
                <th>Collected Actual</th>
                <th>Submission Status</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => {
                const res = results.find(
                  (r) => r.kpiId === kpi.id && r.period === settings.activePeriod
                );
                const updater = users.find((u) => u.id === kpi.updaterId);

                return (
                  <tr key={kpi.id}>
                    <td style={{ fontWeight: 700, color: '#1e40af' }}>{kpi.code}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f2b46' }}>{kpi.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Source: {kpi.source}</div>
                    </td>
                    <td style={{ fontSize: '12px' }}>{updater ? updater.name : 'Operations Coordinator'}</td>
                    <td style={{ fontWeight: 600 }}>{kpi.target} {kpi.unit}</td>
                    <td style={{ fontWeight: 700, fontSize: '14px' }}>
                      {res && res.actual !== null ? `${res.actual} ${kpi.unit}` : <span style={{ color: '#94a3b8' }}>Pending</span>}
                    </td>
                    <td>
                      <StatusBadge status={res ? res.status : 'Missing'} />
                    </td>
                    <td style={{ fontSize: '11px', color: '#64748b' }}>2027-04-15</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal with Error Highlighting */}
      <Modal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Simulated CSV Performance Data Batch Ingestion"
        maxWidth="680px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsCsvModalOpen(false)}>
              {t('cancel')}
            </button>
            {!hasParsed ? (
              <button className="btn btn-primary" onClick={handleParseCsv}>
                Validate CSV Rows
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleCommitValidRows}
                disabled={previewRows.filter((r) => r.valid).length === 0}
              >
                Commit Valid Rows ({previewRows.filter((r) => r.valid).length})
              </button>
            )}
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '12px', color: '#475569' }}>
            Simulate uploading an automated data extract. The validator verifies that KPI codes exist
            in the registry, ensures numeric types, and halts out-of-range percentage entries.
          </p>

          <div className="form-group">
            <label className="form-label">CSV Input Text (Simulated File Buffer)</label>
            <textarea
              className="form-textarea"
              rows={5}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setHasParsed(false);
              }}
            />
          </div>

          {/* Validation Result Table */}
          {hasParsed && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f2b46', marginBottom: '8px' }}>
                Pre-Ingestion Audit & Error Verification:
              </div>
              <div className="table-container">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>KPI Code</th>
                      <th>Actual</th>
                      <th>Validation Audit Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: row.valid ? '#f0fdf4' : '#fee2e2',
                        }}
                      >
                        <td>
                          {row.valid ? (
                            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={13} />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.kpiCode}</td>
                        <td>{row.actual}</td>
                        <td style={{ fontSize: '11px', color: row.valid ? '#15803d' : '#b91c1c' }}>
                          {row.valid ? 'Passed schema & boundary checks' : row.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
