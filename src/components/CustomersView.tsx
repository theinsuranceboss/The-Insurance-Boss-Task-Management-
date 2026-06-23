import React, { useState } from 'react';
import { 
  Building, 
  CircleDollarSign, 
  UserPlus2, 
  Trash2, 
  Mail, 
  Sparkles, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (company: string, contact: string, email: string, value: string, status: 'Active' | 'Lead') => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onAddCustomer,
  onDeleteCustomer,
}) => {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'Lead'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompany.trim() && newContact.trim() && newEmail.trim()) {
      onAddCustomer(
        newCompany.trim(),
        newContact.trim(),
        newEmail.trim(),
        newValue.trim() || '$10,000/yr',
        newStatus
      );
      
      // Reset inputs
      setNewCompany('');
      setNewContact('');
      setNewEmail('');
      setNewValue('');
      setNewStatus('Active');
      setIsAddingMode(false);
    }
  };

  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold';
      case 'Lead': return 'bg-amber-50 text-amber-700 border-amber-250 font-bold';
      case 'Churned': return 'bg-slate-50 text-slate-500 border-slate-205';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="flex-1 p-4 bg-white overflow-y-auto font-sans select-none" id="crm-customers-view">
      {/* CRM Actions header */}
      <div className="flex items-center justify-between mb-4 bg-slate-50 p-2.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-800">Customers CRM Directory</h3>
        </div>

        <button 
          onClick={() => setIsAddingMode(!isAddingMode)}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-sm shadow-purple-900/10"
          id="crm-add-client-button"
        >
          <UserPlus2 className="w-3.5 h-3.5" />
          <span>+ Add Account Client</span>
        </button>
      </div>

      {/* Inline Form to Add Customer */}
      {isAddingMode && (
        <form onSubmit={handleSubmit} className="bg-[#fafbfe] p-4 rounded-xl border border-purple-200 mb-4 animate-fadeIn" id="crm-add-customer-form">
          <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>New Customer Account Setup</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                placeholder="Stripe, Vercel etc."
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Contact Person</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Contact Email</label>
              <input
                type="email"
                required
                placeholder="email@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Annual Contract Value</label>
              <input
                type="text"
                placeholder="$45,000/yr"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Lead')}
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-md focus:outline-none font-semibold"
              >
                <option value="Active">Active Partner</option>
                <option value="Lead">Lead Opportunity</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsAddingMode(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-1.5 text-xs font-semibold cursor-pointer shadow-sm shadow-purple-900/10"
            >
              Save New Account
            </button>
          </div>
        </form>
      )}

      {/* Accounts CRM Table Layout */}
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-none bg-slate-50/20">
        <table className="w-full text-left border-collapse text-xs select-none">
          <thead>
            <tr className="bg-gray-50 text-[10.5px] font-bold text-gray-400 select-none tracking-wider uppercase border-b border-gray-150">
              <th className="p-3">COMPANY NAME</th>
              <th className="p-3">PRIMARY CONTACT</th>
              <th className="p-3">EMAIL CORRESPONDENCE</th>
              <th className="p-3">CONTRACT VALUE</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 text-right pr-6">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-purple-50/20 transition-colors group">
                {/* Company logo and Name */}
                <td className="p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-gray-150 shrink-0" 
                      src={c.avatar} 
                      alt={c.company} 
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-bold text-gray-800 text-xs shrink-1 truncate">{c.company}</span>
                  </div>
                </td>

                <td className="p-3 font-medium text-gray-600">{c.contactName}</td>

                {/* Email mapping */}
                <td className="p-3 text-gray-500">
                  <span className="flex items-center gap-1 cursor-text select-all">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {c.email}
                  </span>
                </td>

                {/* Contract value */}
                <td className="p-3">
                  <span className="flex items-center gap-1 font-bold text-purple-700 bg-purple-50/50 rounded-full px-2.5 py-0.5 border border-purple-100/50 w-fit shrink-0 text-[11px]">
                    <CircleDollarSign className="w-3.5 h-3.5 text-purple-600" />
                    {c.value}
                  </span>
                </td>

                {/* Status custom badge */}
                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium leading-none ${getStatusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </td>

                {/* Action button */}
                <td className="p-3 text-right pr-6 shrink-0">
                  <button
                    onClick={() => onDeleteCustomer(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 hover:text-rose-600 text-gray-400 rounded transition-all cursor-pointer border-none shadow-none"
                    title="Remove Account"
                    id={`delete-crm-${c.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="py-20 text-center text-xs text-gray-400 font-medium">
            No Account Clients Listed. Click the right button to add!
          </div>
        )}
      </div>
    </div>
  );
};
