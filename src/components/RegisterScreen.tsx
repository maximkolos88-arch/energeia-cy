import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
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
        <div className="w-full max-w-md bg-white dark:bg-[#1b1c1e] rounded-xl border border-neutral-200 dark:border-neutral-800 p-10 text-center shadow-3xs">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">{t('register.successTitle')}</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
            {t('register.successText')}
          </p>
          <button 
            onClick={() => window.location.href = '/members'}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs rounded-full transition-colors cursor-pointer"
          >
            {t('register.browseDirectory')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12 animate-fade-in bg-neutral-50/20 dark:bg-neutral-950/20">
      <div className="w-full max-w-lg bg-white dark:bg-[#1b1c1e] rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 md:p-10 shadow-3xs">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">assignment_ind</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">{t('register.title')}</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t('register.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.fullName')}</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors text-xs font-semibold"
                placeholder={t('register.fullNamePlaceholder')}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.company')}</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors text-xs font-semibold"
                placeholder={t('register.companyPlaceholder')}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.role')}</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors text-xs font-semibold"
                placeholder={t('register.rolePlaceholder')}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.messenger')}</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors text-xs font-semibold"
                placeholder={t('register.messengerPlaceholder')}
                onChange={(e) => setFormData({...formData, messenger: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.email')}</label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors text-xs font-semibold"
              placeholder={t('register.emailPlaceholder')}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">{t('register.bio')}</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-primary transition-colors resize-none text-xs font-semibold leading-relaxed"
              placeholder={t('register.bioPlaceholder')}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          {error && (
            <div className="text-red-500 text-xs mt-2 font-bold">{error}</div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:bg-neutral-200 dark:disabled:bg-neutral-850 text-white font-bold py-3 rounded-full text-xs transition-all cursor-pointer shadow-3xs"
          >
            {isSubmitting ? t('register.submitting') : t('register.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
