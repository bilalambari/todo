
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Bell, Menu, X, LogOut, Archive } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { notifications } = useStore();
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.isRead).length;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { name: 'Projects', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Archive', path: '/archive', icon: Archive },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-md shadow border border-gray-200"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-white" size={20} />
            </div>
            TaskFlow
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <img src={user?.avatarUrl} className="w-8 h-8 rounded-full bg-slate-700" alt="Avatar" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors p-1" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 h-full relative">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
