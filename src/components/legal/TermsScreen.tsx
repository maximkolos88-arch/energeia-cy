import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../PageHeader';

export const TermsScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-16 animate-fade-in">
      <PageHeader
        description={t('terms.subtitle', 'Terms of service, statutory platform conditions, and legal rules for Energeia.')}
        iconName="gavel"
        title={t('terms.title', 'Terms & Conditions')}
      />

      <div className="mt-8 bg-[var(--md-sys-color-surface-container-low,#F8F9FA)] dark:bg-[var(--md-sys-color-surface-container-low,#1E1F20)] border border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] rounded-[var(--radius-card,24px)] p-6 md:p-10 space-y-8 transition-colors">
        <div className="border-b border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] pb-4">
          <p className="text-xs text-[var(--md-sys-color-secondary-text,#5F6368)] dark:text-[#9AA0A6] font-mono">
            {t('terms.lastUpdated', 'Last updated: 31 October 2026 • Governing Law: Republic of Cyprus & European Union')}
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('terms.s1_title', '1. Acceptance of Terms')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('terms.s1_text', 'By accessing or using Energeia (www.energeia.cy), you confirm that you have read, understood, and agreed to be bound by these Terms of Service and all applicable laws and regulations of the Republic of Cyprus.')}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('terms.s2_title', '2. Description of Services & Telemetry')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed whitespace-pre-line">
            {t('terms.s2_text', 'Energeia provides independent market intelligence, news analysis, geospatial 3D GIS data visualization, and directory indexing of the Cyprus clean energy transition, CERA regulatory decisions, and ENTSO-E grid telemetry.')}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('terms.s3_title', '3. Public Interest & Disclaimers')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('terms.s3_text', 'All telemetry, grid capacity estimates, and wholesale electricity indicators are presented for informational and analytical purposes without warranty of merchantability or commercial fitness for power trading dispatch.')}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('terms.s4_title', '4. Intellectual Property')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('terms.s4_text', 'The layout, interface design tokens, proprietary analyses, and software codebases are protected intellectual property of M3J2 LTD under Cyprus and international copyright legislation.')}
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            {t('terms.s5_title', '5. Directory Listing & Enterprise Representation')}
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            {t('terms.s5_text', 'Inclusion in the verified directory does not constitute an endorsement, regulatory certification, or commercial guarantee by Energeia or M3J2 LTD.')}
          </p>
        </section>

        {/* Section 6: Third-Party Trademarks & Publisher Attribution */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            6. Third-Party Trademarks & Publisher Rights (EU Directive 2019/790)
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            All registered corporate logos, brand marks, and entity names indexed within the directory or publication stream are trademarks of their respective proprietors. Their presence serves exclusively for nominative identification, descriptive cataloging, and public-interest informational reporting under Cypriot and European Union intellectual property doctrine. News extracts and citations are published in strict compliance with Directive (EU) 2019/790 Article 15 (short excerpts and attribution hyperlinks to original press releases and public filings).
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-white">
            7. Governing Jurisdiction
          </h2>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[#C4C7C5] leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of the Republic of Cyprus. The District Courts of Limassol have exclusive jurisdiction over any disputes arising from platform use.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsScreen;
