// components/NotificationModal.jsx
import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, AlertTriangle, Compass, CloudSun, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, currentUser]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', {
        headers: {
          'x-user-id': currentUser?.user_id || 'FAR-101',
          'x-user-role': currentUser?.role || 'farmer'
        }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev =>
        prev.map(n => n.notification_id === id ? { ...n, status: 'read' } : n)
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'weather': return <CloudSun className="w-5 h-5 text-amber-500" />;
      case 'survey': return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'complaint': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500">Live survey updates and weather advisories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto divide-y divide-slate-100 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No notifications at this time.</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.notification_id}
                className={`py-3.5 px-3 rounded-xl transition flex items-start gap-3 ${
                  notif.status === 'unread' ? 'bg-emerald-50/60 border border-emerald-100/80 mb-2' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                    {notif.status === 'unread' && (
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80 text-[11px] text-slate-400">
                    <span>{new Date(notif.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {notif.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(notif.notification_id)}
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
