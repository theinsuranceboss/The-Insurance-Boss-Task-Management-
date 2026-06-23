import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Folder, 
  FolderLock, 
  Inbox, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Users, 
  PlusCircle, 
  Search,
  ShieldAlert,
  X
} from 'lucide-react';
import { Member } from '../types';

interface ContentSidebarProps {
  members: Member[];
  onSelectSpaceFolder: (folderName: string) => void;
  selectedFolder: string;
  isDarkMode: boolean;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({
  members,
  onSelectSpaceFolder,
  selectedFolder,
  isDarkMode,
  currentUser,
  isSidebarOpen = false,
  setIsSidebarOpen
}) => {
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Insurance Boss');
  const [isCreativeTeamExpanded, setIsCreativeTeamExpanded] = useState(true);
  const [isSpacesExpanded, setIsSpacesExpanded] = useState(true);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  
  const [folders, setFolders] = useState([
    'Campaigns',
    'Medicare Options',
    'Social Scheduling',
    'Brand Assets'
  ]);

  const workspaces = ['Insurance Boss', 'Agency Elite', 'Personal Leads', '+ Choose Workspace'];

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderInput.trim()) {
      setFolders([...folders, newFolderInput.trim()]);
      onSelectSpaceFolder(newFolderInput.trim());
      setNewFolderInput('');
      setIsAddingFolder(false);
      if (setIsSidebarOpen) {
        setIsSidebarOpen(false); // Auto close menu on mobile
      }
    }
  };

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'focus': return 'bg-yellow-500';
      case 'meeting': return 'bg-amber-400';
      case 'lunch': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const selectFolderMobileFriendly = (folder: string) => {
    onSelectSpaceFolder(folder);
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false); // auto-dismiss sidebar on mobile
    }
  };

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {isSidebarOpen && setIsSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-16 z-30 w-60 flex flex-col h-full shrink-0 select-none font-sans border-r transition-all duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isDarkMode 
          ? 'bg-[#000000] border-gray-900 text-gray-300' 
          : 'bg-[#f8f9fa] border-gray-200 text-gray-700'
        }
      `} id="content-sidebar">
        {/* Workspace Dropdown Header */}
        <div className={`relative border-b ${isDarkMode ? 'border-gray-900/80 bg-black/20' : 'border-[#e9ecef] bg-gray-50/50'} flex items-center justify-between`}>
          <button 
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className={`flex-1 px-4 py-3.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
              isDarkMode ? 'hover:bg-white/5' : 'hover:bg-[#f1f3f5]'
            }`}
            id="workspace-dropdown-trigger"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#FAC000] flex items-center justify-center text-[#090a0f] text-[11px] font-black">
                ★
              </span>
              <span className={`font-extrabold text-[13px] ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedWorkspace}
              </span>
              <span className="text-[9px] bg-yellow-500/10 text-[#FAC000] px-1.5 py-0.5 rounded font-black border border-yellow-500/20">
                v1.2
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {setIsSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 mr-2 md:hidden hover:bg-gray-500/15 text-gray-400 hover:text-white rounded-lg cursor-pointer border-none"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isWorkspaceDropdownOpen && (
            <div className={`absolute top-12 left-2 right-2 rounded-lg border shadow-lg py-1.5 z-40 ${
              isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-[#e9ecef]'
            }`} id="workspace-dropdown-menu">
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    if (ws !== '+ Choose Workspace') {
                      setSelectedWorkspace(ws);
                    }
                    setIsWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors border-none bg-transparent cursor-pointer ${
                    ws === selectedWorkspace 
                      ? 'text-[#FAC000] bg-[#FAC000]/10' 
                      : isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {ws}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Navigation List Scrollable */}
        <div className="flex-1 overflow-y-auto pt-3 px-2 flex flex-col gap-4 pb-4">
          {/* Home Section */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mb-1.5 text-gray-500 px-2">
              <span>Directory Space</span>
              <button className="text-gray-500 hover:text-[#FAC000] transition-colors cursor-pointer border-none bg-transparent">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col gap-[2px]">
              {/* My Tasks */}
              <button 
                onClick={() => selectFolderMobileFriendly('Campaigns')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left text-xs font-semibold cursor-pointer border-none bg-transparent ${
                  isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100/80'
                }`}
                id="sidebar-mytasks"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-[#FAC000]" />
                  <span>My Active Tasks ({selectedFolder})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Creative Team Section */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mb-1.5 text-gray-500 px-2">
              <button 
                onClick={() => setIsCreativeTeamExpanded(!isCreativeTeamExpanded)}
                className="flex items-center gap-1 hover:text-white cursor-pointer border-none bg-transparent font-black"
              >
                {isCreativeTeamExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Collaborative Crew</span>
              </button>
              <span className="text-[10px] bg-gray-500/10 text-[#FAC000] px-1.5 py-0.2 rounded font-mono font-bold border border-[#FAC000]/15">
                {members.length}
              </span>
            </div>

            {isCreativeTeamExpanded && (
              <div className="flex flex-col gap-[1px] pl-1 max-h-56 overflow-y-auto pr-1">
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-all text-xs ${
                      isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className={`truncate font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{member.name}</span>
                      {/* Status Dot */}
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(member.status)}`} />
                    </div>
                    <span className="text-[8px] opacity-60 font-mono tracking-tighter uppercase shrink-0">
                      {member.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spaces Section */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mb-1.5 text-gray-500 px-2">
              <button 
                onClick={() => setIsSpacesExpanded(!isSpacesExpanded)}
                className="flex items-center gap-1 hover:text-white cursor-pointer border-none bg-transparent font-black"
              >
                {isSpacesExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>Insurance Projects</span>
              </button>
              <button 
                onClick={() => setIsAddingFolder(!isAddingFolder)}
                className="text-gray-500 hover:text-[#FAC000] transition-colors cursor-pointer border-none bg-transparent"
                title="Create Space Folder"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {isSpacesExpanded && (
              <div className="flex flex-col pl-1">
                {/* Marketing Folder Selected */}
                <div className="mb-1">
                  <div className={`flex items-center gap-1.5 px-2 py-1 border-l-2 font-bold text-xs rounded-r-md ${
                    isDarkMode ? 'bg-yellow-500/10 border-[#FAC000] text-white animate-fade' : 'bg-yellow-50/50 border-[#FAC000] text-yellow-950'
                  }`}>
                    <span className="w-2 rounded-full h-2 bg-[#FAC000] shrink-0"></span>
                    <span className="truncate">The Insurance Boss</span>
                  </div>

                  {/* Nested Folders mapping */}
                  <div className="flex flex-col gap-[2px] mt-1 pl-3 border-l border-gray-800 ml-1.5">
                    {folders.map((folder) => {
                      const isSelected = selectedFolder.toLowerCase() === folder.toLowerCase();
                      return (
                        <button
                          key={folder}
                          onClick={() => selectFolderMobileFriendly(folder)}
                          className={`w-full text-left px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors max-w-full truncate border-none ${
                            isSelected 
                              ? 'bg-[#FAC000]/20 text-[#FAC000] font-black border-r border-[#FAC000]/30' 
                              : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-650 hover:text-gray-950 hover:bg-gray-200/50'
                          }`}
                        >
                          <span className="opacity-60 mr-1.5">⌗</span>
                          {folder}
                        </button>
                      );
                    })}
                    
                    {isAddingFolder && (
                      <form onSubmit={handleAddFolder} className="mt-1.5 pr-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Folder name..."
                          value={newFolderInput}
                          onChange={(e) => setNewFolderInput(e.target.value)}
                          className={`w-full p-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#FAC000] ${
                            isDarkMode ? 'bg-[#1b1c25] border-gray-800 text-whiteBox' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          onBlur={() => {
                            if (!newFolderInput.trim()) setIsAddingFolder(false);
                          }}
                        />
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
