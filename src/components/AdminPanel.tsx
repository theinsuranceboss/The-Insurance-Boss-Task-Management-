import React, { useState } from 'react';
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  User, 
  Users, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase, 
  CheckSquare, 
  Plus, 
  FolderGit, 
  ArrowRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { Member, AgentTeam, Task } from '../types';

interface AdminPanelProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'badgeCount'>) => void;
  onDeleteMember: (id: string) => void;
  teams: AgentTeam[];
  onAddTeam: (team: AgentTeam) => void;
  onDeleteTeam: (id: string) => void;
  tasks: Task[];
  isDarkMode: boolean;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
];

export function AdminPanel({ 
  members, 
  onAddMember, 
  onDeleteMember, 
  teams, 
  onAddTeam, 
  onDeleteTeam, 
  tasks,
  isDarkMode 
}: AdminPanelProps) {
  // Agent state variables
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [agentUsername, setAgentUsername] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[0]);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [successMsg, setSuccessMsg] = useState('');

  // Team state variables
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');

  // Active oversight inspector state
  const [inspectedAgent, setInspectedAgent] = useState<Member | null>(null);

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !roleTitle.trim() || !agentUsername.trim() || !agentPassword.trim()) return;

    const newMemberId = agentUsername.trim().toLowerCase();
    
    // Check if username already exists
    if (members.some(m => m.id === newMemberId || m.username === agentUsername)) {
      alert('Username is already in use by another agent or admin.');
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
    setSuccessMsg('Insurance agent profile & login created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const newTeam: AgentTeam = {
      id: `team-${Date.now()}`,
      name: teamName.trim(),
      description: teamDescription.trim(),
      memberIds: selectedTeamMembers
    };

    onAddTeam(newTeam);
    setTeamName('');
    setTeamDescription('');
    setSelectedTeamMembers([]);
    setTeamSuccessMsg('Agent team created successfully!');
    setTimeout(() => setTeamSuccessMsg(''), 3000);
  };

  const togglePasswordVisibility = (agentId: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const toggleTeamMemberSelection = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  // Inspecting agent calculations
  const inspectedAgentTasks = inspectedAgent 
    ? tasks.filter(t => t.assigneeIds.includes(inspectedAgent.id))
    : [];

  return (
    <div className={`flex flex-col p-6 h-full overflow-y-auto ${
      isDarkMode ? 'bg-[#0f1016] text-[#e3e4e8]' : 'bg-gray-50 text-gray-800'
    }`} id="admin-panel">
      {/* Top Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#FAC000]/10 border border-[#FAC000]/30 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#FAC000]" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <span>Administration Control Center</span>
            <span className="text-[10px] bg-[#FAC000] text-black font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Agency Master Admin
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Create agent credentials, organize operational agent teams, and inspect assigned workloads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Create Agent Credential Form & Create Team Form */}
        <div className="col-span-1 xl:col-span-5 space-y-8">
          
          {/* Agent Creator Block */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#151722] border-gray-800 shadow-md' : 'bg-white border-gray-250'
          }`}>
            <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider mb-4 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#FAC000]" />
              <span>Create Insurance Agent Account</span>
            </h3>

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-200 text-center mb-4 font-bold">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAgentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Broker"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none ${
                      isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' : 'bg-gray-50 border-gray-200 text-gray-805'
                    }`}
                  />
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Corporate Role *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Life Advisor"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border outline-none ${
                        isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' : 'bg-gray-50 border-gray-200 text-gray-805'
                      }`}
                    />
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="john@agency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border outline-none ${
                        isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' : 'bg-gray-50 border-gray-200 text-gray-850'
                      }`}
                    />
                    <Mail className="w-3.5 h-3.5 absolute left-2.5 top-3.5 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Login Credentials block */}
              <div className="bg-black/40 p-4 rounded-xl border border-gray-850 space-y-3">
                <span className="block text-[9px] uppercase font-black text-[#FAC000] tracking-widest">Login Access Credentials</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. john_broker"
                      value={agentUsername}
                      onChange={(e) => setAgentUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:border-[#FAC000] font-mono ${
                        isDarkMode ? 'bg-[#12131a] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">Password *</label>
                    <input
                      type="text"
                      required
                      placeholder="password123"
                      value={agentPassword}
                      onChange={(e) => setAgentPassword(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded border focus:outline-none focus:border-[#FAC000] font-mono ${
                        isDarkMode ? 'bg-[#12131a] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Profile Avatar</label>
                <div className="flex gap-2 py-1 overflow-x-auto">
                  {DEFAULT_AVATARS.map((av, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatarUrl(av)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
                        avatarUrl === av ? 'border-[#FAC000] scale-110' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={av} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs py-3 rounded-xl transition-all shadow-md shadow-[#FAC000]/10 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" />
                <span>Create & Activate Agent</span>
              </button>
            </form>
          </div>

          {/* Team Creator Block */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#151722] border-gray-800 shadow-md' : 'bg-white border-gray-250'
          }`}>
            <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FAC000]" />
              <span>Create Agent Team ("Equipos de Agentes")</span>
            </h3>

            {teamSuccessMsg && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-200 text-center mb-4 font-bold animate-fadeIn">
                {teamSuccessMsg}
              </div>
            )}

            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life Insurance Sales Crew"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' : 'bg-gray-50 border-gray-200 text-gray-805'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Functional Focus / Description</label>
                <textarea
                  rows={2}
                  placeholder="Focuses on term life quotations and annuity follow-ups."
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' : 'bg-gray-50 border-gray-200 text-gray-805'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Assemble Team Members</label>
                <div className={`mt-1 max-h-36 overflow-y-auto border p-2 rounded-lg space-y-1.5 ${
                  isDarkMode ? 'bg-black/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  {members.map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedTeamMembers.includes(m.id)}
                        onChange={() => toggleTeamMemberSelection(m.id)}
                        className="rounded border-gray-800 text-[#FAC000] focus:ring-[#FAC000]/30"
                      />
                      <img src={m.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <span>{m.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">({m.role})</span>
                    </label>
                  ))}
                  {members.length === 0 && (
                    <span className="text-gray-500 italic text-[11px] block p-1">No active agents to add. Create one first!</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs py-3 rounded-xl transition-all shadow-md shadow-[#FAC000]/10 flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <FolderGit className="w-4 h-4" />
                <span>Establish Team</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Active Agents Listing & Teams overview */}
        <div className="col-span-1 xl:col-span-7 space-y-8">
          
          {/* Active Agents Fleet list */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#151722] border-gray-800 shadow-md' : 'bg-white border-gray-250'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FAC000]" />
                <span>Active Corporate Agent Fleet ({members.length})</span>
              </h3>
              <span className="text-[10px] text-gray-500">Security Access Directory</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500 min-w-[500px]">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDarkMode ? 'border-gray-800 text-gray-400 bg-black/20' : 'border-gray-250 text-gray-500'
                  }`}>
                    <th className="py-2.5 px-3">Agent</th>
                    <th className="py-2.5 px-3">Corporate Role</th>
                    <th className="py-2.5 px-3 font-mono">Credentials</th>
                    <th className="py-2.5 px-3 text-right">Oversight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {members.map((m) => {
                    const agentTasksCount = tasks.filter(t => t.assigneeIds.includes(m.id)).length;
                    return (
                      <tr key={m.id} className={`group ${
                        isDarkMode ? 'hover:bg-slate-900/40 text-gray-200' : 'hover:bg-slate-100/50 text-gray-700'
                      }`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={m.avatar} 
                              alt={m.name} 
                              className="w-8 h-8 rounded-full object-cover border border-gray-700" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold block text-xs">{m.name}</span>
                              <span className="text-[9px] text-[#FAC000] bg-[#FAC000]/10 px-1.5 py-0.2 rounded font-mono">
                                id: {m.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[11px] text-gray-300">{m.role}</div>
                          {m.email && <div className="text-[10px] text-gray-500">{m.email}</div>}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          {m.username ? (
                            <div className="text-[11px] space-y-0.5">
                              <div><span className="text-gray-500">U:</span> {m.username}</div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">P:</span>
                                <span>{showPasswordMap[m.id] ? m.password : '••••••'}</span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(m.id)}
                                  className="text-gray-500 hover:text-white p-0 bg-transparent border-none cursor-pointer"
                                >
                                  {showPasswordMap[m.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic text-[10px]">No Login (Demo Account)</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectedAgent(m)}
                              className="px-2.5 py-1 text-[10px] uppercase font-black tracking-wider bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md border-none flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Workload</span>
                              <span className="px-1.5 rounded-full bg-black/60 text-[#FAC000] text-[9px] font-mono">{agentTasksCount}</span>
                            </button>
                            
                            {/* Deletion of agents - protect default admin/test agents if we want, or allow deleting any */}
                            <button
                              onClick={() => onDeleteMember(m.id)}
                              className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors border-none cursor-pointer"
                              title="Discard Agent Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teams of Agents Directory list */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#151722] border-gray-800 shadow-md' : 'bg-white border-gray-250'
          }`}>
            <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FAC000]" />
              <span>Established Agent Teams ("Equipos de Agentes") ({teams.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map(t => (
                <div key={t.id} className="p-4 rounded-xl bg-black/40 border border-gray-800 relative group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">{t.name}</h4>
                      <button
                        onClick={() => onDeleteTeam(t.id)}
                        className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
                        title="Delete team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{t.description}</p>
                  </div>

                  <div className="mt-4 border-t border-gray-800/40 pt-2.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-wider mb-1.5">Team Roster ({t.memberIds.length} agents)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {t.memberIds.map(mid => {
                        const member = members.find(m => m.id === mid);
                        if (!member) return null;
                        return (
                          <div key={mid} className="flex items-center gap-1 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700 shrink-0" title={member.role}>
                            <img src={member.avatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                            <span className="text-[10px] text-gray-300 font-medium">{member.name}</span>
                          </div>
                        );
                      })}
                      {t.memberIds.length === 0 && <span className="text-[10px] text-gray-550 italic">Empty team</span>}
                    </div>
                  </div>
                </div>
              ))}

              {teams.length === 0 && (
                <div className="col-span-2 py-8 text-center text-xs text-gray-550 italic bg-black/20 border border-dashed border-gray-800 rounded-xl">
                  No active teams defined yet. Complete the team builder form above to coordinate.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Inspecting Agent Workload Panel Modal */}
      {inspectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 space-y-4 shadow-2xl animate-scaleUp ${
            isDarkMode ? 'bg-[#151722] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
          }`}>
            <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
              <div className="flex items-center gap-2.5">
                <img src={inspectedAgent.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-700" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-sm font-black text-[#FAC000] uppercase tracking-wider">{inspectedAgent.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono font-bold leading-none mt-0.5">{inspectedAgent.role}</p>
                </div>
              </div>
              <button onClick={() => setInspectedAgent(null)} className="text-gray-500 hover:text-white bg-transparent border-none cursor-pointer p-1"><X className="w-4.5 h-4.5" /></button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black text-gray-400 block tracking-widest">Active Insurance Task Assignment ({inspectedAgentTasks.length})</span>
              
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1.5">
                {inspectedAgentTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-black/45 border border-gray-800 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{t.title}</span>
                      <p className="text-gray-400 text-[11px] line-clamp-1">{t.description || 'No description guidelines.'}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-full">{t.status}</span>
                      <span className="text-[10px] font-bold text-red-400">{t.priority}</span>
                    </div>
                  </div>
                ))}

                {inspectedAgentTasks.length === 0 && (
                  <div className="py-8 text-center text-xs text-gray-500 italic bg-black/20 rounded-xl">
                    No active tasks assigned to this agent currently.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-800/40">
              <button
                onClick={() => setInspectedAgent(null)}
                className="bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold uppercase text-xs px-5 py-2.5 rounded-xl border-none cursor-pointer"
              >
                Close Oversight
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple internal X icon representation
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
