import React, { useState } from 'react';
import {
  Users, Plus, Search, Edit, Trash2, CheckSquare, Square
} from 'lucide-react';
import { AdminDirectoryMember } from './adminTypes';

interface AdminDirectoryViewProps {
  members: AdminDirectoryMember[];
  onSaveMember: (member: Partial<AdminDirectoryMember>) => Promise<void>;
  onDeleteMember: (id: string) => Promise<void>;
  onBatchUpdateTier: (ids: string[], tier: 'Partner' | 'Sponsor' | 'Standard' | 'Observer') => Promise<void>;
  onBatchDeleteMembers: (ids: string[]) => Promise<void>;
  editingMember: Partial<AdminDirectoryMember> | null;
  setEditingMember: (m: Partial<AdminDirectoryMember> | null) => void;
  isLoading: boolean;
}

export const AdminDirectoryView: React.FC<AdminDirectoryViewProps> = ({
  members,
  onSaveMember,
  onDeleteMember,
  onBatchUpdateTier,
  onBatchDeleteMembers,
  editingMember,
  setEditingMember,
  isLoading
}) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Filtering
  const filteredMembers = members.filter(m => {
    const categoryName = m.category || m.roleOrCategory || '';
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          categoryName.toLowerCase().includes(search.toLowerCase()) ||
                          (m.keyContactName && m.keyContactName.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = tierFilter === 'All' || m.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Batch Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length && filteredMembers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map(m => m.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchTier = async (tier: 'Partner' | 'Sponsor' | 'Standard' | 'Observer') => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      await onBatchUpdateTier(selectedIds, tier);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} members from the directory?`)) return;
    setIsProcessingBatch(true);
    try {
      await onBatchDeleteMembers(selectedIds);
      setSelectedIds([]);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Cyprus Energy Directory Members
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage official profiles for utility operators (EAC), regulators (CERA), BESS providers, and EPC contractors.
          </p>
        </div>

        <button
          onClick={() => setEditingMember({
            name: '',
            type: 'Company',
            roleOrCategory: 'Solar Installation Co.',
            category: 'Solar & Renewable Developers',
            subcategories: ['Solar PV', 'EPC Services'],
            tier: 'Standard',
            expertiseTags: ['Solar PV', 'EPC'],
            description: '',
            location: 'Nicosia, Cyprus',
            email: 'info@energy-company.cy',
            phone: '+357 22 000000',
            website: 'https://',
            keyContactName: '',
            keyContactRole: 'Managing Director',
            logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'
          })}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Filters & Batch Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">

        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member by company name, contact, or category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Membership Tiers</option>
            <option value="Partner">Partner</option>
            <option value="Sponsor">Sponsor</option>
            <option value="Standard">Standard</option>
            <option value="Observer">Observer</option>
          </select>
        </div>

        {/* Batch Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 animate-fade-in shrink-0">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {selectedIds.length} selected
            </span>
            <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-800 my-auto mx-1" />

            <button
              onClick={() => handleBatchTier('Partner')}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Set Partner
            </button>
            <button
              onClick={() => handleBatchTier('Sponsor')}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-colors cursor-pointer"
            >
              Set Sponsor
            </button>
            <button
              onClick={() => handleBatchTier('Standard')}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              Set Standard
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={isProcessingBatch}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}

      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 uppercase text-[10px] font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredMembers.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Organization Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Key Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">
                    No directory members match search criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const isSelected = selectedIds.includes(member.id);
                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(member.id)}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {(member.logoUrl || member.imageUrl) && (
                            <img
                              src={member.logoUrl || member.imageUrl}
                              alt=""
                              className="w-9 h-9 rounded-xl object-contain bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1 shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono block">
                              {member.website ? member.website.replace(/^https?:\/\//, '') : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
                          {member.category || member.roleOrCategory}
                        </span>
                        {member.subcategories && member.subcategories.length > 0 && (
                          <span className="text-[10px] text-zinc-400 block truncate max-w-[180px]">
                            {member.subcategories.join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          member.tier === 'Partner'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : member.tier === 'Sponsor'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {member.tier || 'Standard'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
                          {member.keyContactName || '—'}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">
                          {member.keyContactRole}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 dark:text-zinc-400">
                        {member.location || 'Cyprus'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteMember(member.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingMember.id ? 'Edit Directory Member' : 'Register New Member'}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Company Name</label>
                  <input
                    type="text"
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="e.g. Electricity Authority of Cyprus (EAC)"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
                  <select
                    value={editingMember.category || editingMember.roleOrCategory || 'Solar & Renewable Developers'}
                    onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value, roleOrCategory: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Solar & Renewable Developers">Solar & Renewable Developers</option>
                    <option value="Grid & Transmission Operators">Grid & Transmission Operators</option>
                    <option value="Energy Storage & BESS">Energy Storage & BESS</option>
                    <option value="Regulatory & Government Bodies">Regulatory & Government Bodies</option>
                    <option value="EPC Contractors & Installers">EPC Contractors & Installers</option>
                    <option value="Financial & Legal Advisory">Financial & Legal Advisory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Membership Tier</label>
                  <select
                    value={editingMember.tier || 'Standard'}
                    onChange={(e) => setEditingMember({ ...editingMember, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="Partner">Partner</option>
                    <option value="Sponsor">Sponsor</option>
                    <option value="Standard">Standard</option>
                    <option value="Observer">Observer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Location</label>
                  <input
                    type="text"
                    value={editingMember.location || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                    placeholder="Nicosia, Cyprus"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Key Contact Name</label>
                  <input
                    type="text"
                    value={editingMember.keyContactName || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, keyContactName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Key Contact Role</label>
                  <input
                    type="text"
                    value={editingMember.keyContactRole || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, keyContactRole: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Phone</label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Website</label>
                  <input
                    type="text"
                    value={editingMember.website || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, website: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Logo SVG / Image URL</label>
                <input
                  type="text"
                  value={editingMember.logoUrl || editingMember.imageUrl || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, logoUrl: e.target.value, imageUrl: e.target.value })}
                  placeholder="/logos/eac.svg or image URL"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">English Description</label>
                <textarea
                  rows={3}
                  value={editingMember.description || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (editingMember) {
                    await onSaveMember(editingMember);
                    setEditingMember(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Save Member
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
