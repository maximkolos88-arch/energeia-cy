import { NewsItem, Article, DirectoryMember, MagazineIssue, AcademyCourse, ArticleCategory } from '../../models/types';

export interface AdminNewsItem extends NewsItem {
  source?: string;
  originalUrl?: string;
  isDraft?: boolean;
}

export interface AdminDirectoryMember extends DirectoryMember {
  subcategories?: string[];
  tier?: 'Partner' | 'Sponsor' | 'Standard' | 'Observer' | string;
  keyContactRole?: string;
}

export interface AdminMagazineIssue extends MagazineIssue {
  issue_number?: string;
  publication_date?: string;
  cover_image_url?: string;
  pdf_url?: string;
  summary?: string;
}

export interface AdminAcademyCourse extends AcademyCourse {
  category?: string;
  instructor?: string;
  modulesCount?: number;
}

export interface AdminArticle extends Article {
  excerpt?: string;
  image_url?: string;
  author_name?: string;
  author_role?: string;
  read_time_minutes?: number;
  published?: boolean;
  created_at?: string;
}
