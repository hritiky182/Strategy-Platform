import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { Bell, AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationRead, language } = useApp();
  const navigate = useNavigate();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setIsNotificationsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <Drawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notification & Exception Center"
      subtitle="Strategic performance alerts and workflow events"
      width="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => {
            const getIcon = () => {
              switch (n.type) {
                case 'alert':
                  return <AlertTriangle size={16} color="#dc2626" />;
                case 'success':
                  return <CheckCircle2 size={16} color="#16a34a" />;
                case 'warning':
                  return <AlertCircle size={16} color="#d97706" />;
                default:
                  return <Info size={16} color="#2563eb" />;
              }
            };

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  background: n.read ? '#ffffff' : '#f0fdf4',
                  border: n.read ? '1px solid #e2e8f0' : '1px solid #bbf7d0',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ marginTop: '2px' }}>{getIcon()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f2b46' }}>
                      {language === 'ar' ? n.titleAr : n.title}
                    </span>
                    {!n.read && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                    {language === 'ar' ? n.messageAr : n.message}
                  </p>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Drawer>
  );
};
