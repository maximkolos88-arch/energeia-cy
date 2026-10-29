import React from 'react';
import { 
  Leaf, 
  GraduationCap, 
  Newspaper, 
  Users, 
  BookOpen, 
  Cookie, 
  Landmark, 
  ShieldCheck, 
  Scale, 
  Radar, 
  type LucideIcon 
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  energy_savings_leaf: Leaf,
  school: GraduationCap,
  newspaper: Newspaper,
  group: Users,
  book_2: BookOpen,
  cookie: Cookie,
  account_balance: Landmark,
  shield_lock: ShieldCheck,
  gavel: Scale,
  radar: Radar,
};

interface PageHeaderProps {
  title: string;
  description: string;
  iconName: string;
}

export default function PageHeader({ title, description, iconName }: PageHeaderProps) {
  const IconComponent = ICON_MAP[iconName];

  return (
    <div className="mb-6 pb-4 border-b border-gray-200 dark:border-neutral-800 w-full">
      <div className="flex items-center gap-3 mb-2">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <span className="material-symbols-outlined text-3xl text-emerald-600">
            {iconName}
          </span>
        )}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white m-0 leading-none">
          {title}
        </h1>
      </div>
      <p className="text-base text-slate-600 dark:text-neutral-400 m-0 leading-relaxed max-w-4xl">
        {description}
      </p>
    </div>
  );
}
