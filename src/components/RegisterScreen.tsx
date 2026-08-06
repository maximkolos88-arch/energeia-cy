import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const RegisterScreen: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    messenger: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase.from('applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          messenger: formData.messenger,
          description: formData.description
        }
      ]);
      if (supabaseError) throw supabaseError;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting application to Supabase:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
            <span className="material-symbols-outlined text-[#1CA350] text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Application Received</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for applying to join the Cyprus All-Energy Network. Our team will review your profile and publish it to the directory shortly.
          </p>
          <button 
            onClick={() => window.location.href = '/members'}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Browse Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12 animate-fade-in bg-slate-50/50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1CA350]/10 mb-4">
            <span className="material-symbols-outlined text-[#1CA350] text-2xl">assignment_ind</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Join the Network</h1>
          <p className="text-sm text-slate-500">
            Submit your professional details below. Once approved, your profile will be added to our public directory.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors"
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors"
                placeholder="Company Name"
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Role / Title</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors"
                placeholder="e.g. Lead Engineer, CEO, Auditor"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Telegram</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors"
                placeholder="+357... or @username"
                onChange={(e) => setFormData({...formData, messenger: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email (Optional)</label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors"
              placeholder="john@company.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Professional Bio / Company Focus</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1CA350]/20 focus:border-[#1CA350] transition-colors resize-none"
              placeholder="Briefly describe your expertise and focus within the energy sector..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2 font-medium">{error}</div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-[#1CA350] hover:bg-[#15823f] disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
