import React from 'react';
import { 
  MessageSquare, 
  ListTodo, 
  Calendar, 
  Milestone, 
  Users, 
  Plus, 
  Search, 
  Star, 
  SlidersHorizontal, 
  Share2, 
  ShieldCheck,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface WorkspaceHeaderProps {
  selectedFolder: string;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  taskCount?: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  selectedFolder,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  taskCount = 8,
  isDarkMode,
  setIsDarkMode,
  currentUser,
  isSidebarOpen = false,
  setIsSidebarOpen
}) => {
  return (
    <header className={`flex flex-col shrink-0 select-none z-10 font-sans transition-all ${
      isDarkMode 
        ? 'bg-[#000000] border-b border-gray-900' 
        : 'bg-white border-b border-[#e9ecef]'
    }`} id="workspace-header">
      {/* Top Title Bar */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        isDarkMode ? 'border-gray-900 bg-[#000000]' : 'border-[#f1f3f5] bg-white'
      }`}>
        {/* Workspace Breadcrumbs & Title */}
        <div className="flex items-center gap-1.5 min-w-0">
          {setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 mr-1 rounded-lg md:hidden cursor-pointer flex items-center justify-center border-none transition-colors ${
                isDarkMode ? 'hover:bg-white/5 text-[#FAC000]' : 'hover:bg-gray-105 text-gray-700'
              }`}
              title="Toggle directory navigator"
            >
              {isSidebarOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
            </button>
          )}
          <span className="w-2 h-2 rounded bg-[#FAC000] shrink-0 hidden sm:inline-block"></span>
          <nav className="flex items-center text-xs font-bold leading-none min-w-0">
            <span className={`hidden xs:inline truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>The Insurance Boss</span>
            <span className="mx-1 text-gray-500 hidden xs:inline">/</span>
            <span className={`text-[13px] truncate capitalize font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedFolder}</span>
          </nav>
          
          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ml-1 flex items-center gap-1 shrink-0 ${
            currentUser?.role === 'admin' 
              ? 'bg-red-500/10 text-red-400 border border-red-500/15'
              : 'bg-yellow-500/10 text-[#FAC000] border border-yellow-500/15'
          }`}>
            {currentUser?.role === 'admin' ? <ShieldCheck className="w-2.5 h-2.5 text-red-400" /> : <UserCheck className="w-2.5 h-2.5 text-yellow-500" />}
            <span className="hidden xxs:inline">{currentUser?.role || 'Guest'}</span>
          </span>
        </div>

        {/* Action Controls & AI helpers */}
        <div className="flex items-center gap-2">
          {/* Quick Find Search */}
          <div className="relative relative-search">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none w-28 xs:w-40 sm:w-48 focus:w-36 xs:focus:w-48 sm:focus:w-56 focus:ring-1 transition-all font-semibold ${
                isDarkMode 
                  ? 'bg-[#181a25] border border-gray-800 text-white placeholder-gray-500 focus:border-[#FAC000] focus:ring-[#FAC000]/30' 
                  : 'bg-[#f8f9fa] border border-gray-250 text-gray-700 placeholder-gray-400 focus:bg-white focus:border-[#FAC000] focus:ring-[#FAC000]/15'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Toolbar with scroll capability */}
      <div className={`px-2 py-0.5 flex items-center justify-between text-xs select-none overflow-x-auto scrollbar-none border-t ${
        isDarkMode ? 'bg-black border-gray-900' : 'bg-white border-gray-100'
      }`}>
        <ul className="flex items-center gap-1 -mb-[1px] flex-nowrap whitespace-nowrap overflow-x-auto scrollbar-none" id="header-tabs">
          {/* Chats View */}
          <li>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold cursor-pointer transition-all ${
                activeTab === 'chat'
                  ? isDarkMode ? 'border-[#FAC000] text-[#FAC000] bg-[#FAC000]/5 font-black' : 'border-[#FAC000] text-yellow-800 bg-yellow-50/20 font-black'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-gray-550 hover:text-gray-900 hover:border-gray-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FAC000]/80" />
              <span className="text-[11px]">Chat</span>
            </button>
          </li>

          {/* Collapsible Tasks view */}
          <li>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold cursor-pointer transition-all ${
                activeTab === 'tasks'
                  ? isDarkMode ? 'border-[#FAC000] text-[#FAC000] bg-[#FAC000]/5 font-black' : 'border-[#FAC000] text-yellow-800 bg-yellow-50/20 font-black'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-white font-semibold' : 'border-transparent text-gray-550 hover:text-gray-900 hover:border-gray-200 font-semibold'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px]">Tasks</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-500'
              }`}>
                {taskCount}
              </span>
            </button>
          </li>

          {/* Calendar view */}
          <li>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold cursor-pointer transition-all ${
                activeTab === 'schedule'
                  ? isDarkMode ? 'border-[#FAC000] text-[#FAC000] bg-[#FAC000]/5' : 'border-[#FAC000] text-yellow-800 bg-yellow-50/20'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-gray-550 hover:text-gray-900 hover:border-gray-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px]">Weekly Planner</span>
            </button>
          </li>

          {/* Gantt View */}
          <li>
            <button
              onClick={() => setActiveTab('gantt')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold cursor-pointer transition-all ${
                activeTab === 'gantt'
                  ? isDarkMode ? 'border-[#FAC000] text-[#FAC000] bg-[#FAC000]/5' : 'border-[#FAC000] text-yellow-800 bg-yellow-50/20'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-gray-550 hover:text-gray-905 hover:border-gray-200'
              }`}
            >
              <Milestone className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px]">Gantt Timeline</span>
            </button>
          </li>

          {/* Customers view */}
          <li>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold cursor-pointer transition-all ${
                activeTab === 'customers'
                  ? isDarkMode ? 'border-[#FAC000] text-[#FAC000] bg-[#FAC000]/5' : 'border-[#FAC000] text-yellow-800 bg-yellow-50/20'
                  : isDarkMode ? 'border-transparent text-gray-400 hover:text-white' : 'border-transparent text-gray-550 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px]">CRM Clients</span>
            </button>
          </li>
        </ul>

        {/* View Layout Personalizer */}
        <div className="flex items-center gap-3 shrink-0 pl-1.5">
          <div className="flex -space-x-1 shrink-0">
            {/* Quick representation of team */}
            <img className="w-4 h-4 rounded-full ring-1 ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" />
            <img className="w-4 h-4 rounded-full ring-1 ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" />
            <img className="w-4 h-4 rounded-full ring-1 ring-gray-900 object-cover" src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80" alt="Avatar" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </header>
  );
};
