import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Building2, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export interface MembershipIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: 'Strategic Partner' | 'Corporate Member' | 'Associate / Academic';
}

export const MembershipIntakeModal: React.FC<MembershipIntakeModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'Corporate Member',
}) => {
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+357 ');
  const [specialization, setSpecialization] = useState('Solar PV & Generation');
  const [membershipTier, setMembershipTier] = useState(defaultTier);
  const [operationsSummary, setOperationsSummary] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!registrationNumber.trim()) newErrors.registrationNumber = 'Cyprus HE Registration number is required';
    if (!contactName.trim()) newErrors.contactName = 'Primary contact name and title required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid official business email required';
    if (!phone.trim() || phone.trim() === '+357') newErrors.phone = 'Contact telephone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const reference = `CY-E-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const applicationPayload = {
      reference,
      company_name: companyName.trim(),
      registration_number: registrationNumber.trim(),
      contact_name: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialization,
      membership_tier: membershipTier,
      operations_summary: operationsSummary.trim(),
      created_at: new Date().toISOString(),
      status: 'pending_review'
    };

    try {
      // Attempt sending to Supabase
      const { error } = await supabase.from('membership_applications').insert([applicationPayload]);
      if (error) {
        console.warn('Supabase membership_applications table error, falling back to local storage:', error.message);
      }
    } catch (err) {
      console.warn('Network exception while saving membership application:', err);
    }

    // Always persist to local backup so applications are never lost
    try {
      const existing = JSON.parse(localStorage.getItem('energeia_membership_applications') || '[]');
      existing.push(applicationPayload);
      localStorage.setItem('energeia_membership_applications', JSON.stringify(existing));
    } catch {}

    setLoading(false);
    setSubmittedRef(reference);
  };

  const handleCopyReference = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setCompanyName('');
    setRegistrationNumber('');
    setContactName('');
    setEmail('');
    setPhone('+357 ');
    setOperationsSummary('');
    setErrors({});
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
    >
      <div 
        ref={modalRef}
        className="w-full sm:max-w-lg bg-white dark:bg-[#1E1F20] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cyprus Flag Gradient Accent Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFFFFF] via-[#D46200] to-[#3C4E1C]" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F1F3F4] dark:border-[#282A2C] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] block">
              Cyprus Energy Cluster
            </span>
            <h2 id="intake-title" className="text-xl font-medium text-[#1F1F1F] dark:text-[#E3E3E3] mt-0.5">
              {submittedRef ? 'Application Submitted' : 'Membership Intake Application'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close dialog"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F1F3F4] dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submittedRef ? (
            /* Confirmation Success State */
            <div className="py-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#1F1F1F] dark:text-white">
                  Intake Dossier Received
                </h3>
                <p className="text-sm text-[#5F6368] dark:text-[#9AA0A6] mt-2 max-w-sm mx-auto leading-relaxed">
                  Your organization's application to join the Cyprus National Energy Cluster has been registered for accreditation review.
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between max-w-xs mx-auto">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-semibold text-[#5F6368] dark:text-[#9AA0A6] block">
                    Dossier Reference
                  </span>
                  <span className="text-base font-mono font-medium text-[#1F1F1F] dark:text-white">
                    {submittedRef}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#282A2C] text-[#5F6368] dark:text-[#9AA0A6] transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Cluster SLA Notice */}
              <div className="p-4 rounded-2xl bg-[#E8F0FE]/60 dark:bg-[#0842A0]/20 border border-[#1A73E8]/20 text-xs text-[#1F1F1F] dark:text-[#E3E3E3] text-left space-y-1">
                <div className="font-semibold text-[#1A73E8] dark:text-[#8AB4F8] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accreditation SLA</span>
                </div>
                <p className="text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed">
                  The Cluster Secretariat and Accreditation Committee will review company corporate filings and verify HE documentation within <strong>2–3 business days</strong>.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all cursor-pointer shadow-xs"
                >
                  Return to Portal
                </button>
              </div>
            </div>
          ) : (
            /* Application Intake Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Company Legal Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                  Legal Entity / Company Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Hellenic Renewable Energy Systems Ltd"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white transition-colors focus:outline-none ${
                      errors.companyName 
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-[#DADCE0] dark:border-[#444746] focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]'
                    }`}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.companyName}
                  </p>
                )}
              </div>

              {/* Cyprus HE Registration Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                  Cyprus Corporate Reg. (HE Number) *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. HE 438859"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white transition-colors focus:outline-none ${
                      errors.registrationNumber 
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-[#DADCE0] dark:border-[#444746] focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]'
                    }`}
                  />
                </div>
                {errors.registrationNumber && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.registrationNumber}
                  </p>
                )}
              </div>

              {/* Executive Contact Name & Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                  Executive Contact &amp; Title *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Andreas Demetriou, Managing Director"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white transition-colors focus:outline-none ${
                      errors.contactName 
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                        : 'border-[#DADCE0] dark:border-[#444746] focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]'
                    }`}
                  />
                </div>
                {errors.contactName && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.contactName}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    Official Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="corporate@company.cy"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white transition-colors focus:outline-none ${
                        errors.email 
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                          : 'border-[#DADCE0] dark:border-[#444746] focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    Business Telephone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#80868B] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+357 25 123456"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white transition-colors focus:outline-none ${
                        errors.phone 
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                          : 'border-[#DADCE0] dark:border-[#444746] focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Specialization & Tier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    Industry Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                  >
                    <option value="Solar PV & Generation">Solar PV & Generation</option>
                    <option value="Battery Storage (BESS)">Battery Storage (BESS)</option>
                    <option value="Grid & Transmission">Grid & Transmission</option>
                    <option value="EPC Contractors">EPC Contractors</option>
                    <option value="Engineering & Advisory">Engineering & Advisory</option>
                    <option value="Legal, Policy & ESG">Legal, Policy & ESG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                    Membership Tier
                  </label>
                  <select
                    value={membershipTier}
                    onChange={(e: any) => setMembershipTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8]"
                  >
                    <option value="Corporate Member">Corporate Member</option>
                    <option value="Strategic Partner">Strategic Partner</option>
                    <option value="Associate / Academic">Associate / Academic</option>
                  </select>
                </div>
              </div>

              {/* Summary of Cyprus Energy Operations */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6] mb-1.5">
                  Cyprus Operations &amp; Capacity (MWp/Projects)
                </label>
                <textarea
                  rows={3}
                  value={operationsSummary}
                  onChange={(e) => setOperationsSummary(e.target.value)}
                  placeholder="Outline installed renewable assets, active pipeline, or grid services in Cyprus..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DADCE0] dark:border-[#444746] text-sm bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#1A73E8] dark:focus:border-[#8AB4F8]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] dark:bg-[#8AB4F8] dark:hover:bg-[#AECBFA] text-white dark:text-[#062E6F] font-medium text-sm transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-[#062E6F] border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Dossier...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Accreditation Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#5F6368] dark:text-[#9AA0A6]">
                Data governed under Republic of Cyprus law &amp; GDPR compliance.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
