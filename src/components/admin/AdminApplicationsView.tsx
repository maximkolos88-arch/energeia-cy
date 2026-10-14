import React, { useState } from 'react';
import { Inbox, Trash2, Search, Mail, Building, Clock, MessageSquare } from 'lucide-react';
import { LeadApplication } from '../AdminPanel';

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
  const [search, setSearch] = useState('');

  const filtered = applications.filter(app =>
    app.full_name.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-500" />
            Inbound Lead Applications & Proposals
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review B2B partnership applications, directory registration forms, and advertising inquiries.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-800 dark:text-amber-300 shrink-0">
          {applications.length} Total Submissions
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications by name, company, or message..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-amber-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-400 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No inbound lead applications found.
          </div>
        ) : (
          filtered.map(app => (
            <div
              key={app.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm relative group hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {app.full_name}
                  </h3>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
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

              {/* Message Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Application Details / Request
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 whitespace-pre-wrap">
                  {app.description || 'No description provided.'}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1">
                <a
                  href={`mailto:${app.email}`}
                  className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
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
  );
};
