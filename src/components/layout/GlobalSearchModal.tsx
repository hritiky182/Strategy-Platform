import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Search, Compass, BookMarked, Sparkles, AlertTriangle, Users, FileText } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    objectives,
    kpis,
    initiatives,
    actions,
    users,
    reports,
    setSelectedObjective,
    setSelectedKpi,
    setSelectedInitiative,
    setSelectedAction,
  } = useApp();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      category: string;
      id: string;
      title: string;
      subtitle: string;
      icon: React.ReactNode;
      action: () => void;
    }> = [];

    // Objectives
    objectives
      .filter((o) => o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q))
      .forEach((o) => {
        items.push({
          category: 'Strategic Objectives',
          id: o.id,
          title: `${o.code}: ${o.name}`,
          subtitle: `Weight: ${o.weight}% • Owner: ${o.ownerName}`,
          icon: <Compass size={16} color="#0284c7" />,
          action: () => {
            setSelectedObjective(o);
            setIsSearchOpen(false);
          },
        });
      });

    // KPIs
    kpis
      .filter((k) => k.code.toLowerCase().includes(q) || k.name.toLowerCase().includes(q))
      .forEach((k) => {
        items.push({
          category: 'KPIs',
          id: k.id,
          title: `${k.code}: ${k.name}`,
          subtitle: `Target: ${k.target} ${k.unit} • Formula: ${k.formula}`,
          icon: <BookMarked size={16} color="#059669" />,
          action: () => {
            setSelectedKpi(k);
            setIsSearchOpen(false);
          },
        });
      });

    // Initiatives
    initiatives
      .filter((i) => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
      .forEach((i) => {
        items.push({
          category: 'Initiatives',
          id: i.id,
          title: `${i.code}: ${i.name}`,
          subtitle: `Progress: ${i.progress}% • Budget: ${i.budget.toLocaleString()} SAR`,
          icon: <Sparkles size={16} color="#8b5cf6" />,
          action: () => {
            setSelectedInitiative(i);
            setIsSearchOpen(false);
          },
        });
      });

    // Actions
    actions
      .filter((a) => a.code.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))
      .forEach((a) => {
        items.push({
          category: 'Corrective Actions',
          id: a.id,
          title: `${a.code}: ${a.title}`,
          subtitle: `Status: ${a.status} • Owner: ${a.ownerName}`,
          icon: <AlertTriangle size={16} color="#dc2626" />,
          action: () => {
            setSelectedAction(a);
            setIsSearchOpen(false);
          },
        });
      });

    // Users
    users
      .filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
      .forEach((u) => {
        items.push({
          category: 'Users',
          id: u.id,
          title: `${u.name}`,
          subtitle: `Role: ${u.role} • ${u.email}`,
          icon: <Users size={16} color="#475569" />,
          action: () => {
            navigate('/admin/users');
            setIsSearchOpen(false);
          },
        });
      });

    // Reports
    reports
      .filter((r) => r.code.toLowerCase().includes(q) || r.title.toLowerCase().includes(q))
      .forEach((r) => {
        items.push({
          category: 'Reports',
          id: r.id,
          title: `${r.code}`,
          subtitle: `${r.title} (${r.period})`,
          icon: <FileText size={16} color="#0f2b46" />,
          action: () => {
            navigate('/reports');
            setIsSearchOpen(false);
          },
        });
      });

    return items;
  }, [query, objectives, kpis, initiatives, actions, users, reports]);

  if (!isSearchOpen) return null;

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      title="Global Enterprise Search"
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="table-search" style={{ width: '100%', padding: '8px 12px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Type code, objective, KPI, action, or user name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {query.trim() === '' ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
              Type to search across objectives, KPIs, initiatives, corrective actions, and reports.
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
              No matching strategic records found for "{query}".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={item.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <div style={{ padding: '6px', background: '#f1f5f9', borderRadius: '4px' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
