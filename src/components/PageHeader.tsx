import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  iconName: string;
}

export default function PageHeader({ title, description, iconName }: PageHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200 w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-3xl text-emerald-600">
          {iconName}
        </span>
        <h1 className="text-3xl font-bold text-slate-900 m-0 leading-none">
          {title}
        </h1>
      </div>
      <p className="text-base text-slate-600 m-0 leading-relaxed max-w-4xl">
        {description}
      </p>
    </div>
  );
}
