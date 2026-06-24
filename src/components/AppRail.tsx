import React from 'react';
import { Home, Calendar, Settings, Bell, LayoutGrid, HelpCircle, UserCheck, LogOut, Moon, Sun, ShieldAlert } from 'lucide-react';

interface AppRailProps {
  activeView: string;
  setActiveView: (view: any) => void;
  pendingNotificationsCount?: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onSignout: () => void;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
}

export const AppRail: React.FC<AppRailProps> = ({
  activeView,
  setActiveView,
  pendingNotificationsCount = 4,
  isDarkMode,
  setIsDarkMode,
  onSignout,
  currentUser
}) => {
  return (
    <aside className={`w-16 flex flex-col items-center py-4 select-none h-full shrink-0 z-10 transition-all ${
      isDarkMode 
        ? 'bg-[#000000] border-r border-[#151722] text-gray-300' 
        : 'bg-white border-r border-gray-200 text-gray-600'
    }`} id="app-rail">
      {/* Top Main Workplace Avatar Switcher: Logo The Insurance Boss */}
      <div 
        onClick={() => setActiveView('tasks')}
        className="relative group cursor-pointer mb-6" 
        id="rail-workspace-selector"
      >
        <div className="w-11 h-11 rounded-xl bg-black/45 flex items-center justify-center p-1 border border-[#FAC000]/30 transition-all duration-300 hover:scale-[1.05] hover:border-[#FAC000]">
          <img 
            src="https://theinsuranceboss.com/wp-content/uploads/2026/05/IB-Logo-1.png" 
            alt="The Insurance Boss" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-[#090a0f] shadow-sm flex items-center justify-center text-[7px] font-black text-black">
          IB
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-16 top-1 ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
          The Insurance Boss Workspace
        </div>
      </div>

      {/* Navigation Group */}
      <nav className="flex-1 w-full flex flex-col items-center gap-2.5">
        {/* Inbox tasks trigger */}
        <button
          onClick={() => setActiveView('tasks')}
          className={`relative group p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            activeView === 'tasks' 
              ? 'bg-[#FAC000]/15 text-[#FAC000] border-l-2 border-[#FAC000]' 
              : isDarkMode ? 'text-gray-400 hover:text-[#FAC000] hover:bg-white/5' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-50'
          }`}
          id="rail-inbox-btn"
        >
          <Home className="w-[19px] h-[19px]" />
          {pendingNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FAC000] rounded-full animate-ping"></span>
          )}
          {pendingNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FAC000] rounded-full"></span>
          )}
          
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Task Director Board
          </div>
        </button>

        {/* Calendar / Schedule Tracker */}
        <button
          onClick={() => setActiveView('schedule')}
          className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            activeView === 'schedule'
              ? 'bg-[#FAC000]/15 text-[#FAC000] border-l-2 border-[#FAC000]'
              : isDarkMode ? 'text-gray-400 hover:text-[#FAC000] hover:bg-white/5' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-50'
          }`}
          id="rail-timeline-btn"
        >
          <Calendar className="w-[19px] h-[19px]" />
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Weekly Activity Planner
          </div>
        </button>

        {/* Members Statuses Selector */}
        <button
          onClick={() => setActiveView('chat')}
          className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            activeView === 'chat'
              ? 'bg-[#FAC000]/15 text-[#FAC000] border-l-2 border-[#FAC000]'
              : isDarkMode ? 'text-gray-400 hover:text-[#FAC000] hover:bg-white/5' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-50'
          }`}
          id="rail-chat-btn"
        >
          <LayoutGrid className="w-[19px] h-[19px]" />
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Team Collaboration Chat
          </div>
        </button>

        {/* CRM Leads Selector */}
        <button
          onClick={() => setActiveView('leads')}
          className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            activeView === 'leads'
              ? 'bg-[#FAC000]/15 text-[#FAC000] border-l-2 border-[#FAC000]'
              : isDarkMode ? 'text-gray-400 hover:text-[#FAC000] hover:bg-white/5' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-50'
          }`}
          id="rail-crm-btn"
        >
          <UserCheck className="w-[19px] h-[19px]" />
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Leads Management Window
          </div>
        </button>

        {/* Admin Section Control IF current user is an admin */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveView('admin')}
            className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              activeView === 'admin'
                ? 'bg-red-500/10 text-red-500 border-l-2 border-red-500 font-bold'
                : 'text-red-400/80 hover:text-red-500 hover:bg-red-500/10'
            }`}
            id="rail-admin-btn"
          >
            <ShieldAlert className="w-[19px] h-[19px]" />
            <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
              Admin Control Panel 🔐
            </div>
          </button>
        )}
      </nav>

      {/* Bottom Setup & Help Icons */}
      <div className="w-full flex flex-col items-center gap-3.5 mt-auto">
        {/* Dark/Light mode toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`group relative p-2.5 rounded-xl cursor-pointer transition-all ${
            isDarkMode ? 'text-yellow-400 hover:bg-white/5' : 'text-gray-400 hover:text-yellow-600 hover:bg-gray-50'
          }`}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun className="w-[19px] h-[19px]" /> : <Moon className="w-[19px] h-[19px]" />}
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Toggle Theme (Light/Dark)
          </div>
        </button>

        {/* Logout Button */}
        <button 
          onClick={onSignout}
          className="group relative p-2.5 rounded-xl text-gray-400 hover:text-[#FAC000] hover:bg-white/5 cursor-pointer transition-all"
          title="Sign Out to Landing Page"
        >
          <LogOut className="w-[19px] h-[19px]" />
          <div className="absolute left-16 top-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
            Sign Out
          </div>
        </button>

        {/* Profile Avatar Trigger */}
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer overflow-hidden group relative ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200 hover:bg-gray-100'
        }`}>
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"}
            alt="My Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-[#FAC000]" />
          </div>
          <div className="absolute left-16 bottom-2 px-2.5 py-1.5 bg-gray-950 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-lg border border-gray-800">
            <p className="text-[10px] font-bold text-white">{currentUser?.name || "Guest"}</p>
            <p className="text-[9px] text-[#FAC000] uppercase font-mono tracking-wider font-extrabold">{currentUser?.role || "user"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
