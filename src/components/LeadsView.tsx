import React, { useState } from 'react';
import { 
  Briefcase, 
  CircleDollarSign, 
  UserPlus2, 
  Trash2, 
  Mail, 
  Sparkles, 
  Phone,
  Layers,
  Search,
  Filter,
  CheckCircle,
  FileText,
  User,
  MoreVertical,
  X,
  Plus
} from 'lucide-react';
import { Lead, Member, CustomFieldConfig } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  agents: Member[];
  customFields: CustomFieldConfig;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  currentUser: { id: string; name: string; avatar: string; role: 'admin' | 'user' } | null;
  isDarkMode: boolean;
}

export function LeadsView({
  leads,
  agents,
  customFields,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  currentUser,
  isDarkMode,
}: LeadsViewProps) {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [policyInterest, setPolicyInterest] = useState(customFields.options1[0] || 'Auto');
  const [status, setStatus] = useState<Lead['status']>('New');
  const [value, setValue] = useState('');
  const [agentId, setAgentId] = useState('');
  const [notes, setNotes] = useState('');

  // Filters State
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPolicy, setFilterPolicy] = useState<string>('ALL');
  const [filterAgent, setFilterAgent] = useState<string>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddLead({
      name: name.trim(),
      email: email.trim() || 'No email',
      phone: phone.trim() || 'No phone',
      policyInterest,
      status,
      value: value.trim() || '$1,200',
      agentId: agentId || undefined,
      notes: notes.trim(),
    });

    // Reset inputs
    setName('');
    setEmail('');
    setPhone('');
    setPolicyInterest(customFields.options1[0] || 'Auto');
    setStatus('New');
    setValue('');
    setAgentId('');
    setNotes('');
    setIsAddingMode(false);
  };

  const handleUpdateLeadField = (lead: Lead, field: keyof Lead, val: any) => {
    onUpdateLead({
      ...lead,
      [field]: val
    });
  };

  const getStatusBadge = (s: Lead['status']) => {
    switch (s) {
      case 'New': 
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Contacted': 
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Proposal Sent': 
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Closed Won': 
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
      case 'Closed Lost': 
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: 
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  // Filter logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(filterSearch.toLowerCase()) || 
                          l.email.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          l.phone.includes(filterSearch) ||
                          l.notes.toLowerCase().includes(filterSearch.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    const matchesPolicy = filterPolicy === 'ALL' || l.policyInterest === filterPolicy;
    const matchesAgent = filterAgent === 'ALL' || l.agentId === filterAgent;

    // If logged in as an Agent (user role), we can optionally show only their leads or let them toggle,
    // let's default to letting them see all but making it clear who's assigned, or we can filter it.
    // The requirement says: "que los agentes tengan una ventana de leads para manejarlos y registrarlos y que el admin pueda ver los leads también"
    // Let's allow agents to see all leads (or filter by clicking "Assigned to Me" easily).
    return matchesSearch && matchesStatus && matchesPolicy && matchesAgent;
  });

  // Calculate stats
  const totalLeads = leads.length;
  const activeProposals = leads.filter(l => l.status === 'Proposal Sent').length;
  const wonPremiumSum = leads
    .filter(l => l.status === 'Closed Won')
    .reduce((sum, current) => {
      const numeric = parseInt(current.value.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + numeric;
    }, 0);
  const conversionRate = totalLeads > 0 
    ? Math.round((leads.filter(l => l.status === 'Closed Won').length / totalLeads) * 100) 
    : 0;

  return (
    <div className={`flex-1 p-6 h-full overflow-y-auto ${
      isDarkMode ? 'bg-[#0f1016] text-[#e3e4e8]' : 'bg-gray-50 text-gray-800'
    }`} id="insurance-leads-view">
      
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#FAC000]/10 border border-[#FAC000]/20 text-[#FAC000]">
              <Briefcase className="w-5 h-5" />
            </span>
            <span>Leads & Clients Pipeline</span>
            <span className="text-[10px] bg-[#FAC000] text-black font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Niche Insurance CRM
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Register prospective policyholders, monitor quotation statuses, and record high-value premium conversions.
          </p>
        </div>

        <button 
          onClick={() => setIsAddingMode(!isAddingMode)}
          className="flex items-center justify-center gap-2 bg-[#FAC000] hover:bg-[#e0ab00] text-black rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-[#FAC000]/10 border-none"
        >
          <UserPlus2 className="w-4 h-4" />
          <span>{isAddingMode ? 'Collapse Form' : 'Register New Lead'}</span>
        </button>
      </div>

      {/* Metrics bento-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Leads</span>
            <User className="w-4 h-4 text-[#FAC000]" />
          </div>
          <p className="text-2xl font-black text-white">{totalLeads}</p>
          <p className="text-[10px] text-gray-500 mt-1">Total inquiries registered</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Proposals</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{activeProposals}</p>
          <p className="text-[10px] text-gray-500 mt-1">Quotation calculations in-hand</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Won Premium Value</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-[#0fa]">${wonPremiumSum.toLocaleString()}/yr</p>
          <p className="text-[10px] text-gray-500 mt-1">Accumulated book premium</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Conversion Ratio</span>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{conversionRate}%</p>
          <p className="text-[10px] text-gray-500 mt-1">Quote to premium closed rate</p>
        </div>
      </div>

      {/* Adding form wrapper */}
      {isAddingMode && (
        <div className={`p-6 rounded-2xl border-2 border-dashed mb-6 animate-fadeIn ${
          isDarkMode ? 'bg-[#151722] border-[#FAC000]/40' : 'bg-yellow-50/10 border-[#FAC000]/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase text-[#FAC000] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Prospect Insurance Setup</span>
            </h3>
            <button onClick={() => setIsAddingMode(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Prospect Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carlos Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Correspondence</label>
                <input
                  type="email"
                  placeholder="carlos@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 902-1244"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">{customFields.label1}</label>
                <select
                  value={policyInterest}
                  onChange={(e) => setPolicyInterest(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                >
                  {customFields.options1.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Lead status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Lead['status'])}
                  className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                >
                  <option value="New">New Inquiry</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Annual Estimated Premium</label>
                <input
                  type="text"
                  placeholder="e.g. $1,500"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Assigned Underwriter / Agent</label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-lg border outline-none ${
                    isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                  }`}
                >
                  <option value="">Unassigned</option>
                  {agents.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Follow-up Notes / Policy Details</label>
              <textarea
                rows={2}
                placeholder="Needs Auto comprehensive coverage and Home umbrella policy. High interest."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full text-xs px-3 py-2 rounded-lg border outline-none ${
                  isDarkMode ? 'bg-[#1d1f2b] border-gray-800 text-white' : 'bg-white border-gray-250'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMode(false)}
                className="bg-transparent text-gray-400 hover:text-white px-4 py-2 text-xs font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#FAC000] hover:bg-[#e0ab00] text-black font-black uppercase text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-[#FAC000]/10 border-none"
              >
                Save Prospective Lead
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtering Control Bar */}
      <div className={`p-4 rounded-xl border mb-4 flex flex-wrap gap-4 items-center justify-between ${
        isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-250'
      }`}>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads name, notes, email..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5 text-[#FAC000]" />
            <span>Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`text-xs p-1.5 rounded bg-transparent border border-gray-800 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New Inquiry</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={filterPolicy}
            onChange={(e) => setFilterPolicy(e.target.value)}
            className={`text-xs p-1.5 rounded bg-transparent border border-gray-800 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <option value="ALL">All Policies</option>
            {customFields.options1.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className={`text-xs p-1.5 rounded bg-transparent border border-gray-800 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <option value="ALL">All Agents</option>
            {agents.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)}
          </select>

          {/* Quick toggle for assigned to me */}
          {currentUser && (
            <button
              onClick={() => setFilterAgent(filterAgent === currentUser.id ? 'ALL' : currentUser.id)}
              className={`text-xs px-2.5 py-1.5 rounded font-bold transition-colors ${
                filterAgent === currentUser.id
                  ? 'bg-[#FAC000] text-black'
                  : 'bg-gray-800/80 hover:bg-gray-800 text-gray-400'
              }`}
            >
              Assigned to Me
            </button>
          )}
        </div>
      </div>

      {/* Main Leads Table list */}
      <div className={`border rounded-2xl overflow-hidden shadow-none ${
        isDarkMode ? 'bg-[#151722] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-500 min-w-[800px]">
            <thead>
              <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                isDarkMode ? 'border-gray-800 text-gray-400 bg-black/40' : 'border-gray-200 text-gray-500 bg-gray-50'
              }`}>
                <th className="py-3 px-4">Prospect Name</th>
                <th className="py-3 px-4">Policy Interest</th>
                <th className="py-3 px-4">Estimated Book Premium</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Follow-up Status</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {filteredLeads.map((l) => {
                const assignedAgent = agents.find(ag => ag.id === l.agentId);
                return (
                  <tr key={l.id} className={`group ${
                    isDarkMode ? 'hover:bg-slate-900/40 text-gray-200' : 'hover:bg-slate-100/50 text-gray-700'
                  }`}>
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex flex-col">
                        <span>{l.name}</span>
                        <span className="text-[9px] text-gray-500 font-normal">Registered {l.createdAt || 'recently'}</span>
                      </div>
                    </td>

                    {/* Policy Interest */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded bg-[#FAC000]/10 text-[#FAC000] border border-[#FAC000]/20 font-medium text-[11px]">
                        {l.policyInterest}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 font-bold text-[#0fa] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit text-[11px]">
                        <CircleDollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        {l.value}
                      </span>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 text-gray-400 space-y-0.5">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{l.email}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-gray-500 shrink-0" />
                        <span>{l.phone}</span>
                      </span>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-3.5 px-4">
                      {assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <img src={assignedAgent.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-gray-700" referrerPolicy="no-referrer" />
                          <span className="text-[11px] font-medium text-gray-300">{assignedAgent.name}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <select
                        value={l.status}
                        onChange={(e) => handleUpdateLeadField(l, 'status', e.target.value)}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-transparent cursor-pointer ${getStatusBadge(l.status)}`}
                      >
                        <option value="New" className="bg-[#151722] text-white">New Inquiry</option>
                        <option value="Contacted" className="bg-[#151722] text-white">Contacted</option>
                        <option value="Proposal Sent" className="bg-[#151722] text-white">Proposal Sent</option>
                        <option value="Closed Won" className="bg-[#151722] text-white">Closed Won</option>
                        <option value="Closed Lost" className="bg-[#151722] text-white">Closed Lost</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(l)}
                          className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-all cursor-pointer border-none shadow-none text-[10px] font-bold"
                        >
                          View Notes
                        </button>
                        <button
                          onClick={() => onDeleteLead(l.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 rounded transition-all cursor-pointer border-none shadow-none"
                          title="Remove prospective client"
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

        {filteredLeads.length === 0 && (
          <div className="py-16 text-center text-xs text-gray-500 font-medium bg-black/10">
            No prospects found matching active filters.
          </div>
        )}
      </div>

      {/* Note view drawer / modal popup */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl animate-scaleUp ${
            isDarkMode ? 'bg-[#151722] border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
          }`}>
            <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
              <h4 className="text-sm font-black text-[#FAC000] uppercase tracking-wider">Follow-up Notes: {selectedLead.name}</h4>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white"><X className="w-4.5 h-4.5" /></button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Prospect Information</span>
                <p className="font-bold text-gray-200 text-sm mt-0.5">{selectedLead.name}</p>
                <p className="text-gray-400 text-[11px] mt-0.5">{selectedLead.phone} | {selectedLead.email}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Policy Class Interest</span>
                <p className="font-bold text-[#FAC000] mt-0.5">{selectedLead.policyInterest}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Estimated Annual Premium</span>
                <p className="font-bold text-[#0fa] mt-0.5">{selectedLead.value}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Follow-up Journal Log</span>
                <textarea
                  className={`w-full p-2.5 rounded border text-xs leading-relaxed outline-none focus:border-[#FAC000] ${
                    isDarkMode ? 'bg-[#1e202e] border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                  rows={4}
                  value={selectedLead.notes}
                  onChange={(e) => {
                    const updated = { ...selectedLead, notes: e.target.value };
                    setSelectedLead(updated);
                    onUpdateLead(updated);
                  }}
                  placeholder="Record your follow-up notes here..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="bg-[#FAC000] hover:bg-[#e0ab00] text-black font-extrabold uppercase text-xs px-5 py-2 rounded-xl border-none cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
