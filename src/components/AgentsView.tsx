import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  ShieldCheck, 
  Activity, 
  CheckSquare, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Search,
  Lock,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { Member, Task, Lead } from '../types';

interface AgentsViewProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'badgeCount'>) => void;
  onDeleteMember: (id: string) => void;
  tasks: Task[];
  leads: Lead[];
  isDarkMode: boolean;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
];

export function AgentsView({
  members,
  onAddMember,
  onDeleteMember,
  tasks,
  leads,
  isDarkMode,
  currentUser
}: AgentsViewProps) {
  // Search and selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Member | null>(null);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [agentUsername, setAgentUsername] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATARS[0]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [successMsg, setSuccessMsg] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  // Helper metrics
  const getAgentTasks = (memberId: string) => {
    return tasks.filter(t => t.assigneeIds.includes(memberId));
  };

  const getAgentLeads = (memberId: string) => {
    return leads.filter(l => l.agentId === memberId);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !roleTitle.trim() || !agentUsername.trim() || !agentPassword.trim()) return;

    const newMemberId = agentUsername.trim().toLowerCase();

    // Check unique username
    if (members.some(m => m.id === newMemberId || m.username === agentUsername)) {
      alert('This username is already occupied by another active agent profile.');
      return;
    }

    onAddMember({
      id: newMemberId,
      name: fullName.trim(),
      avatar: avatarUrl,
      color: 'bg-[#FAC000]',
      status: 'active',
      role: roleTitle.trim(),
      username: agentUsername.trim(),
      password: agentPassword.trim(),
      email: email.trim() || undefined
    });

    setFullName('');
    setRoleTitle('');
    setEmail('');
    setAgentUsername('');
    setAgentPassword('');
    setSuccessMsg('New agent invited and logged to active directory!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setShowAddForm(false);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6" id="agents-view-container">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner Section */}
        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
          isDarkMode 
            ? 'bg-gradient-to-r from-yellow-500/5 via-yellow-500/1 to-transparent border-gray-850' 
            : 'bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-100'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FAC000]" />
              <h2 className="text-lg font-black tracking-tight uppercase">Agents Directory</h2>
            </div>
            <p className="text-xs text-gray-400">
              {isAdmin 
                ? 'Oversee active team members, analyze current assignments, evaluate workloads, and invite new agents.'
                : 'View directory profiles and contact list of active insurance advisors.'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold text-xs rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-yellow-500/10 cursor-pointer border-none shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddForm ? 'Hide Registry Form' : 'Register New Agent'}</span>
            </button>
          )}
        </div>

        {/* Top Mini Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0f1016] border-gray-850' : 'bg-white border-gray-205'
          }`}>
            <span className="p-2 rounded-lg bg-yellow-500/10 text-[#FAC000]">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black text-gray-500 block">Total Agents</span>
              <span className="text-lg font-black font-mono">{members.length} Active</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0f1016] border-gray-850' : 'bg-white border-gray-205'
          }`}>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black text-gray-500 block">Total Active Tasks</span>
              <span className="text-lg font-black font-mono">
                {tasks.filter(t => t.status !== 'POSTED').length} Tasks
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0f1016] border-gray-850' : 'bg-white border-gray-205'
          }`}>
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <UserCheck className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black text-gray-500 block">CRM Pipeline Leads</span>
              <span className="text-lg font-black font-mono">{leads.length} Contacts</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDarkMode ? 'bg-[#0f1016] border-gray-850' : 'bg-white border-gray-205'
          }`}>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black text-gray-500 block">Active Workspace</span>
              <span className="text-lg font-black uppercase text-gray-300">Live 🟢</span>
            </div>
          </div>
        </div>

        {/* Success notification */}
        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Register New Agent Collapsible Form */}
        {showAddForm && isAdmin && (
          <form onSubmit={handleSubmit} className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0f1016] border-gray-850' : 'bg-white border-gray-200'
          } space-y-4 shadow-md animate-slideDown`}>
            <div className="flex items-center gap-1.5 border-b pb-2 mb-2 border-gray-850">
              <UserPlus className="w-4 h-4 text-[#FAC000]" />
              <h3 className="text-xs font-black uppercase tracking-wider">Register Agent Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">
                  Full Name ("Nombre Completo") *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sandra Bullock"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">
                  Agent Title / Role ("Rol") *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life Insurance Representative"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. sandra.b@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">
                  System Username ("Usuario") *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sandra"
                  value={agentUsername}
                  onChange={(e) => setAgentUsername(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">
                  Access Password ("Contraseña") *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={agentPassword}
                  onChange={(e) => setAgentPassword(e.target.value)}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-[#181a25] border-gray-800 focus:border-[#FAC000] text-white' 
                      : 'bg-gray-50 border-gray-250 focus:bg-white focus:border-[#FAC000] text-gray-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1.5">
                  Select Profile Avatar
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatarUrl(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === av ? 'border-[#FAC000] scale-110 ring-2 ring-yellow-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar Selection" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-850">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  isDarkMode 
                    ? 'border-gray-800 bg-gray-900/40 text-gray-400 hover:bg-gray-850' 
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold text-xs rounded-lg transition-all cursor-pointer border-none"
              >
                Establish Agent Profile
              </button>
            </div>
          </form>
        )}

        {/* Core Layout: Search + Agents Grid */}
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search agent name, title or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-3 py-2 text-xs rounded-xl outline-none w-full border transition-all ${
                  isDarkMode 
                    ? 'bg-[#0f1016] border-gray-850 text-white placeholder-gray-500 focus:border-[#FAC000]' 
                    : 'bg-white border-gray-200 text-gray-850 placeholder-gray-400 focus:border-[#FAC000]'
                }`}
              />
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              Displaying {filteredMembers.length} of {members.length} agent files
            </div>
          </div>

          {/* Agents List Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((agent) => {
              const agentTasks = getAgentTasks(agent.id);
              const agentLeads = getAgentLeads(agent.id);
              const isSelected = selectedAgent?.id === agent.id;

              return (
                <div
                  key={agent.id}
                  className={`border rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                    isDarkMode 
                      ? 'bg-[#0f1016] border-gray-850 hover:border-gray-800' 
                      : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                  } ${isSelected ? 'ring-2 ring-[#FAC000]/50 border-[#FAC000]/50 bg-yellow-500/10' : ''}`}
                >
                  {/* Top info and status indicator */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-gray-800">
                          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <span className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                            agent.status === 'active' ? 'bg-emerald-500' :
                            agent.status === 'focus' ? 'bg-purple-500' :
                            agent.status === 'offline' ? 'bg-gray-500' : 'bg-amber-500'
                          }`} title={`Status: ${agent.status}`} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs truncate leading-snug">{agent.name}</h4>
                          <p className="text-[10px] text-[#FAC000] font-semibold leading-tight mt-0.5">{agent.role}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{agent.email || `${agent.id}@agency.com`}</span>
                          </p>
                        </div>
                      </div>

                      {isAdmin && agent.id !== 'admin' && agent.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove agent profile '${agent.name}' from active directory?`)) {
                              onDeleteMember(agent.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg border-none cursor-pointer transition-colors ${
                            isDarkMode ? 'hover:bg-red-500/10 text-gray-600 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                          }`}
                          title="Remove agent file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Basic specs & credentials display */}
                    <div className={`p-2.5 rounded-xl text-[10px] font-mono space-y-1 ${
                      isDarkMode ? 'bg-black/40 text-gray-400 border border-gray-900' : 'bg-gray-50 text-gray-600 border border-gray-150'
                    }`}>
                      <div className="flex justify-between">
                        <span>Username:</span>
                        <span className="font-bold text-gray-300">{agent.username || agent.id}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex justify-between items-center">
                          <span>Password:</span>
                          <div className="flex items-center gap-1 text-gray-300 font-bold">
                            <span>{showPasswords[agent.id] ? (agent.password || 'boss admin') : '••••••••'}</span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(agent.id)}
                              className="p-0.5 border-none bg-transparent cursor-pointer text-gray-500 hover:text-white"
                            >
                              {showPasswords[agent.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operational parameters */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className={`p-2 rounded-xl text-center ${
                        isDarkMode ? 'bg-[#181a25]/40' : 'bg-gray-50'
                      }`}>
                        <span className="text-[9px] uppercase font-bold text-gray-500 block">Assigned Tasks</span>
                        <span className="text-xs font-black text-white">{agentTasks.length} Active</span>
                      </div>
                      <div className={`p-2 rounded-xl text-center ${
                        isDarkMode ? 'bg-[#181a25]/40' : 'bg-gray-50'
                      }`}>
                        <span className="text-[9px] uppercase font-bold text-gray-500 block">CRM Leads</span>
                        <span className="text-xs font-black text-white">{agentLeads.length} Leads</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-850/50 flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-wider font-black text-gray-500">
                      System Key: <span className="font-mono text-gray-400">{agent.id}</span>
                    </span>
                    <button
                      onClick={() => setSelectedAgent(isSelected ? null : agent)}
                      className={`text-[10px] font-bold flex items-center gap-1 border-none bg-transparent cursor-pointer transition-colors ${
                        isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      <span>{isSelected ? 'Collapse Files' : 'Inspect Portfolio'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspector Slide Panel (Shows tasks and leads details for selected agent) */}
        {selectedAgent && (
          <div className={`p-5 rounded-2xl border animate-slideLeft ${
            isDarkMode ? 'bg-[#0f1016] border-[#FAC000]/30' : 'bg-[#fffbeb] border-yellow-200'
          } space-y-4`}>
            <div className="flex justify-between items-start border-b border-gray-850 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FAC000]" />
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider">
                    Portfolio Oversight: {selectedAgent.name}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Inspecting active insurance cases and prospects assigned to this specific advisor.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-[10px] font-bold px-2 py-1 border border-gray-800 bg-gray-900 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tasks List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <span>Assigned Insurance Operations</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-yellow-500/10 text-[#FAC000] rounded font-mono">
                    {getAgentTasks(selectedAgent.id).length}
                  </span>
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {getAgentTasks(selectedAgent.id).length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-gray-800 text-center text-[10px] text-gray-500">
                      No active task assignments tracked.
                    </div>
                  ) : (
                    getAgentTasks(selectedAgent.id).map(t => (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDarkMode ? 'bg-black/60 border-gray-850' : 'bg-white border-gray-150'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{t.title}</p>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.1 rounded font-mono ${
                            t.priority === 'URGENT' ? 'bg-red-500/10 text-red-400' :
                            t.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400' : 'bg-gray-800 text-gray-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold uppercase text-[#FAC000] bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10 shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Leads list */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <span>CRM Prospect Pipeline</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-teal-500/10 text-teal-400 rounded font-mono">
                    {getAgentLeads(selectedAgent.id).length}
                  </span>
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {getAgentLeads(selectedAgent.id).length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-gray-800 text-center text-[10px] text-gray-500">
                      No prospective CRM contacts registered.
                    </div>
                  ) : (
                    getAgentLeads(selectedAgent.id).map(l => (
                      <div
                        key={l.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          isDarkMode ? 'bg-black/60 border-gray-850' : 'bg-white border-gray-150'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{l.name}</p>
                          <p className="text-[9px] text-gray-400 truncate">{l.policyInterest} • {l.value}</p>
                        </div>
                        <span className="text-[9px] font-black bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20 shrink-0 uppercase">
                          {l.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
