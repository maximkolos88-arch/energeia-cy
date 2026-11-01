import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Trash2, 
  Search, 
  Mail, 
  Building, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Archive, 
  Eye, 
  Phone, 
  FileText, 
  X, 
  Filter, 
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { LeadApplication } from '../AdminPanel';
import { supabase } from '../../lib/supabase';

export interface MembershipApplication {
  id?: string;
  reference: string;
  company_name: string;
  registration_number: string;
  contact_name: string;
  email: string;
  phone: string;
  specialization: string;
  membership_tier: 'strategic' | 'corporate' | 'associate' | string;
  operations_summary: string;
  created_at: string;
  status: 'pending_review' | 'approved' | 'archived' | string;
}

interface AdminApplicationsViewProps {
  applications: LeadApplication[];
  onDeleteApplication: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const AdminApplicationsView: React.FC<AdminApplicationsViewProps> = ({
  applications,
  onDeleteApplication,
  isLoading
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'membership' | 'leads'>('membership');
  const [membershipApps, setMembershipApps] = useState<MembershipApplication[]>([]);
  const [loadingMembership, setLoadingMembership] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'archived'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'strategic' | 'corporate' | 'associate'>('all');
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);

  // Load Membership Applications from Supabase with LocalStorage fallback
  const fetchMembershipApplications = async () => {
    setLoadingMembership(true);
    let remoteApps: MembershipApplication[] = [];

    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        remoteApps = data as MembershipApplication[];
      }
    } catch (err) {
      console.warn('Supabase membership_applications fetch warning:', err);
    }

    // Merge with localStorage entries
    let localApps: MembershipApplication[] = [];
    try {
      const raw = localStorage.getItem('energeia_membership_applications');
      if (raw) {
        localApps = JSON.parse(raw);
      }
    } catch {}

    // Deduplicate by reference or company_name + created_at
    const mergedMap = new Map<string, MembershipApplication>();
    
    // Add remote first
    remoteApps.forEach(app => {
      const key = app.reference || `${app.company_name}_${app.created_at}`;
      mergedMap.set(key, app);
    });

    // Add local if not already present
    localApps.forEach(app => {
      const key = app.reference || `${app.company_name}_${app.created_at}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, app);
      }
    });

    const combined = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setMembershipApps(combined);
    setLoadingMembership(false);
  };

  useEffect(() => {
    fetchMembershipApplications();
  }, []);

  // Update Status in Supabase & LocalStorage
  const handleUpdateStatus = async (
    targetApp: MembershipApplication, 
    newStatus: 'pending_review' | 'approved' | 'archived'
  ) => {
    const updated = membershipApps.map(app => 
      app.reference === targetApp.reference ? { ...app, status: newStatus } : app
    );
    setMembershipApps(updated);
    if (selectedApp?.reference === targetApp.reference) {
      setSelectedApp({ ...targetApp, status: newStatus });
    }

    // Update in localStorage
    try {
      localStorage.setItem('energeia_membership_applications', JSON.stringify(updated));
    } catch {}

    // Update in Supabase if id or reference exists
    try {
      if (targetApp.id) {
        await supabase
          .from('membership_applications')
          .update({ status: newStatus })
          .eq('id', targetApp.id);
      } else if (targetApp.reference) {
        await supabase
          .from('membership_applications')
          .update({ status: newStatus })
          .eq('reference', targetApp.reference);
      }
    } catch (err) {
      console.warn('Failed to update status in Supabase:', err);
    }
  };

  // Delete Membership Application
  const handleDeleteMembershipApp = async (targetApp: MembershipApplication) => {
    if (!window.confirm(`Are you sure you want to delete application ${targetApp.reference} from ${targetApp.company_name}?`)) {
      return;
    }

    const updated = membershipApps.filter(app => app.reference !== targetApp.reference);
    setMembershipApps(updated);
    if (selectedApp?.reference === targetApp.reference) {
      setSelectedApp(null);
    }

    try {
      localStorage.setItem('energeia_membership_applications', JSON.stringify(updated));
    } catch {}

    try {
      if (targetApp.id) {
        await supabase.from('membership_applications').delete().eq('id', targetApp.id);
      } else if (targetApp.reference) {
        await supabase.from('membership_applications').delete().eq('reference', targetApp.reference);
      }
    } catch (err) {
      console.warn('Failed to delete application in Supabase:', err);
    }
  };

  // Filter Membership Applications
  const filteredMembership = membershipApps.filter(app => {
    const query = search.toLowerCase();
    const matchQuery = 
      (app.company_name || '').toLowerCase().includes(query) ||
      (app.registration_number || '').toLowerCase().includes(query) ||
      (app.contact_name || '').toLowerCase().includes(query) ||
      (app.email || '').toLowerCase().includes(query) ||
      (app.reference || '').toLowerCase().includes(query) ||
      (app.operations_summary || '').toLowerCase().includes(query);

    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchTier = tierFilter === 'all' || app.membership_tier?.toLowerCase() === tierFilter;

    return matchQuery && matchStatus && matchTier;
  });

  // Filter General Inbound Leads
  const filteredLeads = applications.filter(app =>
    app.full_name.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = membershipApps.filter(a => a.status === 'pending_review' || !a.status).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-1">
            Cluster Governance &amp; Ingestion
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-[#1A73E8]" />
            Cluster Applications &amp; Inbound Leads
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review B2B cluster membership intake (TechIsland framework), corporate HE registrations, and partner proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchMembershipApplications}
            disabled={loadingMembership}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMembership ? 'animate-spin' : ''}`} />
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-[#E8F0FE] dark:bg-[#1A73E8]/20 border border-[#1A73E8]/30 text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8] shrink-0">
            {pendingCount} Pending Review
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Strip */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('membership')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'membership'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Cluster Membership Intake</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeSubTab === 'membership' ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
          }`}>
            {membershipApps.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'leads'
              ? 'bg-[#1A73E8] text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inbound Leads &amp; Proposals</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeSubTab === 'leads' ? 'bg-white/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
          }`}>
            {applications.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: CLUSTER MEMBERSHIP APPLICATIONS */}
      {activeSubTab === 'membership' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search + Tier & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company name, HE number, contact, or reference..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-[#1A73E8] focus:outline-none transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-medium">Tier:</span>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">All Tiers</option>
                  <option value="strategic">Strategic Partner</option>
                  <option value="corporate">Corporate Member</option>
                  <option value="associate">Associate / Academic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table / Cards View */}
          {filteredMembership.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No cluster membership applications found matching your criteria.
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      <th className="py-3.5 px-4">Company &amp; Registration</th>
                      <th className="py-3.5 px-4">Primary Contact</th>
                      <th className="py-3.5 px-4">Requested Tier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                    {filteredMembership.map((app) => {
                      const isPending = app.status === 'pending_review' || !app.status;
                      const isApproved = app.status === 'approved';
                      const isArchived = app.status === 'archived';

                      return (
                        <tr 
                          key={app.reference} 
                          className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          {/* Company & HE */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                              <span>{app.company_name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                              <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded font-medium text-zinc-700 dark:text-zinc-300">
                                {app.registration_number || 'HE Pending'}
                              </span>
                              <span>•</span>
                              <span className="text-[#1A73E8] dark:text-[#8AB4F8]">{app.specialization || 'Energy'}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-zinc-400">{app.reference}</span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">
                              {app.contact_name}
                            </div>
                            <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                              <a href={`mailto:${app.email}`} className="hover:underline text-[#1A73E8] dark:text-[#8AB4F8]">
                                {app.email}
                              </a>
                              {app.phone && (
                                <>
                                  <span>•</span>
                                  <a href={`tel:${app.phone}`} className="hover:underline">
                                    {app.phone}
                                  </a>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Tier */}
                          <td className="py-3.5 px-4">
                            {app.membership_tier === 'strategic' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF8EE] text-[#D46200] border border-[#FFA726]/40 dark:bg-[#251A10] dark:text-[#FFA726]">
                                <Sparkles className="w-3 h-3" /> Strategic
                              </span>
                            ) : app.membership_tier === 'corporate' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F0FE] text-[#1A73E8] border border-[#1A73E8]/30 dark:bg-[#1A73E8]/20 dark:text-[#8AB4F8]">
                                <Building className="w-3 h-3" /> Corporate
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300">
                                Associate
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Clock className="w-3 h-3" /> Pending Review
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <ShieldCheck className="w-3 h-3" /> Approved
                              </span>
                            )}
                            {isArchived && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                <Archive className="w-3 h-3" /> Archived
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                            {new Date(app.created_at || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-[#1A73E8] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Inspect Application Dossier"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(app, 'approved')}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                                  title="Approve Membership"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              {!isArchived && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(app, 'archived')}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                  title="Archive Application"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteMembershipApp(app)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Delete Application Record"
                              >
                                <Trash2 className="w-4 h-4" />
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
          )}

        </div>
      )}

      {/* SUB-TAB 2: GENERAL INBOUND LEADS */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inbound leads by name, company, or message..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-[#1A73E8] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                No inbound lead applications found.
              </div>
            ) : (
              filteredLeads.map(app => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3.5 shadow-xs relative group hover:border-[#1A73E8]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {app.full_name}
                      </h3>
                      <span className="text-xs font-medium text-[#D46200] dark:text-[#FFA726] flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5" /> {app.company || 'Private Entity'} {app.role ? `• ${app.role}` : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Delete Lead Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Inbound Request
                    </span>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 whitespace-pre-wrap">
                      {app.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1">
                    <a
                      href={`mailto:${app.email}`}
                      className="font-medium text-[#1A73E8] dark:text-[#8AB4F8] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> {app.email}
                    </a>

                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3 h-3" /> {new Date(app.created_at || Date.now()).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FULL MEMBERSHIP APPLICATION DOSSIER INSPECTOR MODAL */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedApp(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full sm:max-w-xl bg-white dark:bg-[#1E1F20] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block mb-1">
                  Cluster Membership Intake Dossier
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {selectedApp.company_name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300 font-medium">
                    {selectedApp.registration_number || 'HE Registration'}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{selectedApp.reference}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                aria-label="Close dossier"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              
              {/* Status and Tier Strip */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Membership Tier</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white capitalize">
                    {selectedApp.membership_tier} Partner
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5 text-right">Current Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    selectedApp.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : selectedApp.status === 'archived'
                      ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {selectedApp.status === 'approved' ? 'Approved' : selectedApp.status === 'archived' ? 'Archived' : 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Authorized Contact Person */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Authorized Signatory &amp; Representative
                </span>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {selectedApp.contact_name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <a href={`mailto:${selectedApp.email}`} className="text-[#1A73E8] dark:text-[#8AB4F8] hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <a href={`tel:${selectedApp.phone}`} className="hover:underline">
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Operations & Energy Portfolio Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Energy Sector Operations &amp; Asset Capacity Summary
                </span>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.operations_summary || 'No operational summary provided in the intake submission.'}
                </div>
              </div>

              {/* Sector Specialization */}
              <div className="flex items-center justify-between text-zinc-500 pt-1">
                <span>Domain Focus: <strong className="text-zinc-800 dark:text-zinc-200">{selectedApp.specialization}</strong></span>
                <span>Submitted: <strong className="text-zinc-800 dark:text-zinc-200">{new Date(selectedApp.created_at).toLocaleString()}</strong></span>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDeleteMembershipApp(selectedApp)}
                className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Delete Submission
              </button>

              <div className="flex items-center gap-2">
                {selectedApp.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp, 'approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Approve Member</span>
                  </button>
                )}

                {selectedApp.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp, 'archived')}
                    className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                )}

                {selectedApp.status !== 'pending_review' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApp, 'pending_review')}
                    className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
