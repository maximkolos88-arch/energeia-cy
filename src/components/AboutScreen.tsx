import React from 'react';
import PageHeader from './PageHeader';

export const AboutScreen: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 animate-fade-in">
      <PageHeader description="Cyprus's dedicated platform for the clean energy transition and professional networking." iconName="energy_savings_leaf" title="Our Mission"/>

      {/* Manifesto & CTA Section */}
      <div className="mt-8 bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Mission Text */}
          <div className="lg:col-span-3 space-y-6 text-slate-600 text-base leading-relaxed">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Empowering the Island's Energy Future</h2>
            <p>
              Energeia is built to track, connect, and educate. Our focus is squarely on the sustainable, overall energy landscape of Cyprus, moving beyond legacy resources to map the critical milestones in renewable integration.
            </p>
            <p>
              We provide a unified ecosystem where certified engineers, ESG auditors, policymakers, and innovative suppliers can collaborate. Through our open-access digital archives, professional directory, and specialized academy, we deliver the insights and tools necessary to shape the market.
            </p>
          </div>

          {/* CTA Box */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-gray-100 text-center">
            <span className="material-symbols-outlined text-5xl text-[#1CA350] mb-4">how_to_reg</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Become a Member</h3>
            <p className="text-sm text-slate-500 mb-8">
              Join the Cyprus All-Energy Network to list your company, connect with industry leaders, and access exclusive resources.
            </p>
            
            {/* Action Button linking to /register */}
            <a 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-3 w-full bg-[#1CA350] hover:bg-[#15823f] text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Join Us
              <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
