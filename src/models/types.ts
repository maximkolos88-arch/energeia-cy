/**
 * Energeia - Data Models and Type Definitions
 */

export type NewsStatus = 'Published' | 'Draft' | 'Archived' | 'PUBLISHED' | 'DRAFT';

export type NewsCategory = 
  | 'All Updates' 
  | 'Renewables' 
  | 'Oil & Gas' 
  | 'Government & Policy' 
  | 'Grid & Infrastructure' 
  | 'CERA Regulation' 
  | 'Grants & Subsidies' 
  | 'Energy Market'
  | string;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string; // Rich Markdown text content
  category: NewsCategory;
  imageUrl?: string; // Main article/OpenGraph image URL
  image_url?: string; // Database column fallback alias
  sourceUrl?: string;
  publishedAt: string; // ISO date string or formatted date
  createdAt: string;
  status: NewsStatus;
  readTimeMinutes?: number;
  title_el?: string;
  title_ru?: string;
  title_he?: string;
  summary_el?: string;
  summary_ru?: string;
  summary_he?: string;
  content_el?: string;
  content_ru?: string;
  content_he?: string;
}

export type MemberType = 'Individual' | 'Company';

export interface DirectoryMember {
  id: string;
  name: string;
  type: MemberType;
  roleOrCategory: string; // e.g., 'Independent Auditor', 'Solar Installation Co.', 'Grid Specialist', 'ESG Agency'
  email: string;
  phone?: string;
  location?: string; // e.g. 'Nicosia', 'Limassol', 'Larnaca'
  category?: "Oil & Gas" | "Renewables" | "Electricity & Trading" | "Maritime & Offshore" | "Engineering & EPC" | "Professional Services" | "Government & Associations" | string;
  expertiseTags: string[]; // e.g., ['Solar', 'Wind', 'Storage', 'Policy', 'ESG', 'Grid', 'ESG Auditors', 'Solar Installers']
  imageUrl?: string;
  description?: string;
  isVerified?: boolean;
  createdAt?: string;
  logoUrl?: string;
  website?: string;
  linkedin?: string;
  keyContactName?: string;
  showDescription?: boolean;
  showLocation?: boolean;
  showWebsite?: boolean;
  showLinkedin?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showKeyContact?: boolean;
  keyServices?: string[] | string;
  notableProjects?: string;
  certifications?: string;
  showKeyServices?: boolean;
  showNotableProjects?: boolean;
  showCertifications?: boolean;
}

/**
 * Controller Async State interface
 */
export interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  empty: boolean;
}

export interface MagazineIssue {
  id: string;
  title: string;
  issueNumber: number;
  publishDate: string;
  coverImageUrl: string;
  pdfUrl: string;
  description: string;
  isPublished: boolean;
}

export interface AcademyCourse {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: string;
  level: string;
  imageUrl: string;
  checkoutUrl: string;
  isPublished: boolean;
}
