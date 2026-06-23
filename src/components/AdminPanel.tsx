import React, { useState } from 'react';
import { UserPlus, Trash2, ShieldCheck, User, Users, Mail, Image, Briefcase } from 'lucide-react';
import { Member } from '../types';

interface AdminPanelProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'badgeCount'>) => void;
  onDeleteMember: (id: string) => void;
  isDarkMode: boolean;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
];

export function AdminPanel({ members, onAddMember, onDeleteMember, isDarkMode }: AdminPanelProps) {
  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !roleTitle.trim()) return;

    const newMemberId = fullName.toLowerCase().replace(/\s+/g, '-');
    const finalAvatar = customAvatar.trim() || avatarUrl;

    onAddMember({
      id: newMemberId,
      name: fullName,
      avatar: finalAvatar,
      color: userRole === 'admin' ? 'bg-[#FAC000]' : 'bg-purple-600',
      status: 'active',
      role: roleTitle + (userRole === 'admin' ? ' (Admin)' : ''),
    });

    setFullName('');
    setRoleTitle('');
    setEmail('');
    setCustomAvatar('');
    setSuccessMsg('User profile created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

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
            <span>Administration Control Panel</span>
            <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Root Authority
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Create additional administrators or general campaign operators for The Insurance Boss brand.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Create User Form */}
        <div className={`col-span-1 lg:col-span-12 xl:col-span-5 p-5 rounded-2xl border ${
          isDarkMode 
            ? 'bg-[#151722] border-gray-800 shadow-md' 
            : 'bg-white border-gray-250 shadow-sm'
        }`}>
          <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider mb-4 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[#FAC000]" />
            <span>Create User or Administrator</span>
          </h3>

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-200 text-center mb-4 truncate font-bold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. John Boss"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                  }`}
                />
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                  Account Authority Type
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as 'admin' | 'user')}
                  className={`w-full text-xs p-2.5 rounded-lg border outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-[#1e202e] border-[#31354a] text-white focus:border-[#FAC000]' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                  }`}
                >
                  <option value="user">General User Account</option>
                  <option value="admin">Administrator Authority</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                  Corporate Role / Job Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Content Lead"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className={`w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' 
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                    }`}
                  />
                  <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@theinsuranceboss.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                  }`}
                />
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">
                Select Default Profile Avatar
              </label>
              <div className="flex gap-2 mb-2 overflow-x-auto py-1">
                {DEFAULT_AVATARS.map((av, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(av);
                      setCustomAvatar('');
                    }}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
                      avatarUrl === av && !customAvatar ? 'border-[#FAC000] scale-110' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={av} alt="Avatar Op." className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="Or enter custom image URL directly..."
                  value={customAvatar}
                  onChange={(e) => setCustomAvatar(e.target.value)}
                  className={`w-full text-[11px] pl-8 pr-3 py-2 rounded-lg border outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-[#1e202e] border-gray-800 text-white focus:border-[#FAC000]' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FAC000]'
                  }`}
                />
                <Image className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FAC000] hover:bg-[#e0ab00] text-[#0c0d12] font-black uppercase text-xs py-2.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer border-none font-sans"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User Profile</span>
            </button>
          </form>
        </div>

        {/* Right Side: List of Users & Delete options */}
        <div className={`col-span-1 lg:col-span-12 xl:col-span-7 p-5 rounded-2xl border ${
          isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-250'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FAC000]" />
              <span>Active Corporate Users ({members.length})</span>
            </h3>
            <span className="text-[10px] text-gray-500">Account Security Fleet</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 min-w-[500px]">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                  isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-500'
                }`}>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Corporate Role</th>
                  <th className="py-2.5 px-3 text-right">Account Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {members.map((m) => {
                  const isDeletable = !['zeb', 'alex', 'tara', 'dean', 'agent'].includes(m.id);
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
                      <td className="py-3 px-3 font-medium text-[11px]">
                        {m.role}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isDeletable ? (
                          <button
                            onClick={() => onDeleteMember(m.id)}
                            className="p-1.5 text-red-400 hover:text-red-500 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors inline-flex cursor-pointer border-none"
                            title="Discard user profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] bg-gray-500/15 text-gray-400 px-2.5 py-1 rounded inline-block font-semibold">
                            Protected System Account
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
