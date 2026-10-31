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
  FileText,
  Building2,
  Info,
  type LucideIcon 
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  energy_savings_leaf: Leaf,
  leaf: Leaf,
  school: GraduationCap,
  newspaper: Newspaper,
  group: Users,
  users: Users,
  book_2: BookOpen,
  cookie: Cookie,
  account_balance: Landmark,
  shield_lock: ShieldCheck,
  shield: ShieldCheck,
  gavel: Scale,
  radar: Radar,
  document: FileText,
  building: Building2,
  info: Info,
};

interface PageHeaderProps {
  title: string;
  description: string;
  iconName?: string;
}

export default function PageHeader({ title, description, iconName = 'leaf' }: PageHeaderProps) {
  const IconComponent = (iconName && ICON_MAP[iconName]) || Leaf;

  return (
    <div className="mb-8 pb-5 border-b border-[var(--md-sys-color-outline-variant,#E0E2E0)] dark:border-[var(--md-sys-color-outline,#444746)] w-full">
      <div className="flex items-center gap-3.5 mb-2.5">
        <div className="p-2.5 rounded-2xl bg-[var(--md-sys-color-primary-container,#D3E3FD)] text-[var(--md-sys-color-on-primary-container,#041E49)] dark:bg-[var(--md-sys-color-primary-container,#0842A0)] dark:text-[var(--md-sys-color-on-primary-container,#D3E3FD)] flex items-center justify-center shrink-0">
          <IconComponent className="w-6 h-6 stroke-[2.2]" aria-hidden="true" focusable="false" />
        </div>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[var(--md-sys-color-on-surface,#1F1F1F)] dark:text-[var(--md-sys-color-on-surface,#E3E3E3)] m-0 leading-tight">
          {title}
        </h1>
      </div>
      <p className="text-sm md:text-base text-[var(--md-sys-color-on-surface-variant,#444746)] dark:text-[var(--md-sys-color-secondary-text,#9AA0A6)] m-0 leading-relaxed max-w-4xl">
        {description}
      </p>
    </div>
  );
}
