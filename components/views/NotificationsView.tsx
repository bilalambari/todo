
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleClick = (id: string, link: string) => {
      markNotificationRead(id);
      navigate(link);
  };

  const markAllRead = () => {
      myNotifications.forEach(n => {
          if(!n.isRead) markNotificationRead(n.id);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="text-indigo-600" /> Notifications
                </h1>
                <p className="text-slate-500 mt-1">Stay updated with mentions and assignments.</p>
            </div>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllRead}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                    <CheckCircle size={16} /> Mark all as read
                </button>
            )}
        </div>

        <div className="space-y-4">
            {myNotifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Bell size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No notifications yet.</p>
                </div>
            ) : (
                myNotifications.map(notification => (
                    <div 
                        key={notification.id} 
                        onClick={() => handleClick(notification.id, notification.link)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${notification.isRead ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-indigo-50 border-indigo-100 hover:border-indigo-200'}`}
                    >
                        <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-indigo-500'}`}></div>
                        <div className="flex-1">
                            <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};
