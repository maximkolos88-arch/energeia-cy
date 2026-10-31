import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import PageHeader from '../PageHeader';

export const PrivacyScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-16 animate-fade-in">
      <PageHeader
        description={t('privacy.subtitle', 'EU General Data Protection Regulation (GDPR) and personal data protection policy.')}
        iconName="shield"
        title={t('privacy.title', 'Privacy Policy')}
      />

      <div className="mt-8 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-[var(--radius-card,24px)] p-6 md:p-10 space-y-8 transition-colors">
        <div className="border-b border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] pb-4">
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] font-mono">
            {t('privacy.lastUpdated', 'Last updated: 31 October 2026 • Validated for EU GDPR 2016/679 & Cyprus Law 125(I)/2018')}
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('privacy.s1_title', '1. Data Controller Identification')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('privacy.s1_text', 'Energeia is owned and operated by M3J2 LTD, a private limited liability company incorporated in the Republic of Cyprus under registration number HE 438859 and VAT CY10438859X, having its registered office at Leoforos Panioti, 20, Germasogeia 4044, Lemesos, Cyprus.')}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('privacy.s2_title', '2. Categories of Data Processed')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed whitespace-pre-line">
            {t('privacy.s2_text', 'We process minimal corporate contact information, public CERA regulatory registry data, technical telemetry, and anonymized user navigation patterns strictly necessary to deliver energy transition intelligence.')}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('privacy.s3_title', '3. Legal Basis for Processing')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('privacy.s3_text', 'Processing is carried out under GDPR Article 6(1)(b) for user requests, Article 6(1)(f) for legitimate interests in reporting Cyprus power grid transition telemetry, and Article 6(1)(a) where consent is affirmatively granted.')}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('privacy.s4_title', '4. Retention and Security Standards')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('privacy.s4_text', 'All data is encrypted in transit using TLS 1.3 with strict HSTS preloading and stored on isolated EU server nodes adhering to ISO/IEC 27001 standards.')}
          </p>
        </section>

        {/* Section 5: GDPR Sub-Processors Table */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            5. Authorized Sub-Processors & Data Transfers
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            We partner exclusively with verified infrastructure providers under GDPR Article 28 Data Processing Agreements (DPA) and Standard Contractual Clauses (SCC):
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--md-sys-color-surface-container,#F1F3F4)] dark:bg-[#282A2C] text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
                <tr>
                  <th className="p-3 font-semibold">Sub-Processor</th>
                  <th className="p-3 font-semibold">Service Purpose</th>
                  <th className="p-3 font-semibold">Data Location</th>
                  <th className="p-3 font-semibold">Transfer Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:divide-[var(--md-sys-color-outline,#444746)] text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5]">
                <tr>
                  <td className="p-3 font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Vercel Inc.</td>
                  <td className="p-3">Global Edge Web Hosting & Serverless Compute</td>
                  <td className="p-3">European Union / USA</td>
                  <td className="p-3">EU-US Data Privacy Framework / SCC</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Supabase Inc.</td>
                  <td className="p-3">Managed PostgreSQL Database & Authentication</td>
                  <td className="p-3">Frankfurt, Germany (EU-Central)</td>
                  <td className="p-3">Direct EEA Storage (GDPR Article 45)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">OneSignal Inc.</td>
                  <td className="p-3">Push Notification Token Delivery</td>
                  <td className="p-3">United States</td>
                  <td className="p-3">EU-US Data Privacy Framework / SCC</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">Cloudflare Inc.</td>
                  <td className="p-3">DDoS Mitigation & Edge DNS Routing</td>
                  <td className="p-3">Global Edge (Cyprus PoP)</td>
                  <td className="p-3">Standard Contractual Clauses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Data Subject Rights & Supervisory Authority */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            6. Data Subject Rights & Supervisory Authority
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            Under GDPR Articles 15–22, you have the right to access, rectify, or request erasure of your data. You also have the statutory right to lodge a complaint with the Office of the Commissioner for Personal Data Protection in Cyprus:
          </p>
          <div className="pt-2">
            <a
              href="https://www.gov.cy/dataprotection/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--md-sys-color-primary-container,#D3E3FD)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] text-xs font-medium hover:underline"
            >
              <span>Commissioner for Personal Data Protection (www.gov.cy/dataprotection)</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyScreen;
