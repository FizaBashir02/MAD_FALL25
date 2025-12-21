
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BedDouble, UtensilsCrossed, ClipboardList, LogOut, 
  Menu, Bell, X, Sun, Moon, Camera, Trash2
} from 'lucide-react';
import { User, UserRole, AppNotification } from '../types';
import { api } from '../services/api';

interface LayoutProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  onUpdateProfile?: (dataUrl: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, children, onUpdateProfile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Init Theme
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Poll Notifications
  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
        const data = await api.notifications.getAll(user.role);
        setNotifications(data);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDeleteNotif = async (id: string) => {
      await api.notifications.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0] && onUpdateProfile) {
          const reader = new FileReader();
          reader.onload = () => {
              onUpdateProfile(reader.result as string);
              setIsProfileOpen(false);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  if (!user) return <>{children}</>;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT, UserRole.KITCHEN] },
    { id: 'students', label: 'Students', icon: Users, roles: [UserRole.ADMIN, UserRole.WARDEN] },
    { id: 'rooms', label: 'Rooms', icon: BedDouble, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT] },
    { id: 'mess', label: 'Mess & Meals', icon: UtensilsCrossed, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT, UserRole.KITCHEN] },
    { id: 'complaints', label: 'Complaints', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT] },
  ].filter(item => item.roles.includes(user.role));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white transition-colors duration-300 flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Sticky for desktop */}
      <aside className={`
        fixed lg:sticky top-0 h-screen z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-200 ease-in-out shrink-0 overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
              <span className="text-xl font-bold">HostelMate</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500"><X size={24} /></button>
        </div>

        <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 absolute bottom-0 w-full bg-white dark:bg-slate-900">
            <div className="flex items-center mb-4 cursor-pointer hover:opacity-80" onClick={() => setIsProfileOpen(true)}>
              <div className="relative">
                  <img src={user.avatar || "https://picsum.photos/32/32"} alt="User" className="w-8 h-8 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5"><Camera size={8} className="text-white"/></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium truncate w-32">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <LogOut className="mr-3 h-5 w-5" /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24} /></button>
            
            <div className="flex items-center gap-4 ml-auto">
               <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                   {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>

               <div className="relative">
                   <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
                       <Bell size={20} />
                       {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
                   </button>

                   {isNotifOpen && (
                       <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                           <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-bold">Notifications</div>
                           <div className="max-h-80 overflow-y-auto">
                               {notifications.length === 0 ? <div className="p-4 text-center text-sm text-slate-500">No notifications</div> : (
                                   notifications.map(n => (
                                       <div key={n.id} className="p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 relative group">
                                           <h4 className="text-sm font-bold">{n.title}</h4>
                                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                                           <span className="text-[10px] text-slate-400 block mt-2">{new Date(n.timestamp).toLocaleTimeString()}</span>
                                           <button onClick={(e) => { e.stopPropagation(); handleDeleteNotif(n.id); }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"><Trash2 size={12}/></button>
                                       </div>
                                   ))
                               )}
                           </div>
                           {notifications.length > 0 && <div className="p-2 text-center border-t border-slate-200 dark:border-slate-700"><button onClick={() => setIsNotifOpen(false)} className="text-xs text-blue-500">Close</button></div>}
                       </div>
                   )}
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>

      {/* Profile Upload Modal */}
      {isProfileOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm text-center">
                  <h3 className="text-lg font-bold mb-4">Update Profile Photo</h3>
                  <div className="relative inline-block mb-4">
                      <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
                      <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500">
                          <Camera size={16} className="text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Upload a new photo from your device.</p>
                  <button onClick={() => setIsProfileOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm font-medium">Cancel</button>
              </div>
          </div>
      )}
    </div>
  );
};
