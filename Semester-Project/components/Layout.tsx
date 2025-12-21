import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  UtensilsCrossed, 
  ClipboardList, 
  LogOut, 
  Menu,
  Bell,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT, UserRole.KITCHEN] },
      { id: 'students', label: 'Students', icon: Users, roles: [UserRole.ADMIN, UserRole.WARDEN] },
      { id: 'rooms', label: 'Rooms', icon: BedDouble, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT] },
      { id: 'mess', label: 'Mess & Meals', icon: UtensilsCrossed, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT, UserRole.KITCHEN] },
      { id: 'complaints', label: 'Complaints', icon: ClipboardList, roles: [UserRole.ADMIN, UserRole.WARDEN, UserRole.STUDENT] },
    ];

    return items.filter(item => item.roles.includes(user.role));
  };

  const navItems = getMenuItems();

  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
                H
              </div>
              <span className="text-xl font-bold text-gray-900">HostelMate</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${currentView === item.id ? 'text-brand-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4 px-2">
              <img src={user.avatar || "https://picsum.photos/32/32"} alt="User" className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-500 rounded-md hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900">HostelMate</span>
            <button className="p-2 -mr-2 text-gray-500 rounded-md hover:bg-gray-100">
              <Bell size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};