import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../PageHeader';

export const PrivacyScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader
        description={t('privacy.subtitle')}
        iconName="shield_lock"
        title={t('privacy.title')}
      />

      <div className="mt-8 bg-white dark:bg-[#1b1c1e] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-10 shadow-sm space-y-8">
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            {t('privacy.lastUpdated')}
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s1_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('privacy.s1_text')}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s2_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {t('privacy.s2_text')}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s3_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('privacy.s3_text')}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s4_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('privacy.s4_text')}
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s5_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('privacy.s5_text')}
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('privacy.s6_title')}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('privacy.s6_text')}
          </p>
        </section>
      </div>
    </div>
  );
};
