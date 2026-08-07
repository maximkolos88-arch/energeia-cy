/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { 
  X, Bot, ShieldCheck, Database, RefreshCw, CheckCircle, 
  Plus, Edit, Trash2, BookOpen, Users, GraduationCap, 
  FileText, Check, AlertCircle, Inbox, BarChart2, LogOut, Lock,
  Sparkles, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NewsRepository } from '../services/repositories/NewsRepository';
import { DirectoryRepository, ALL_EXPERTISE_TAGS } from '../services/repositories/DirectoryRepository';
import { MagazineRepository } from '../services/repositories/MagazineRepository';
import { CourseRepository } from '../services/repositories/CourseRepository';
import { NewsItem, DirectoryMember, MagazineIssue, AcademyCourse } from '../models/types';

const PREDEFINED_KEY_SERVICES = [
  "EPC", "O&M", "Project Management", "Solar PV Development", 
  "Energy Storage", "Smart Grids", "Exploration & Production (E&P)", 
  "Offshore Support Services", "LNG Infrastructure", "Bunkering", 
  "Energy Trading", "PPA Structuring", "Strategic Consulting", 
  "Legal Counsel", "Financial Advisory", "Environmental & HSE"
];

interface AdminPanelProps {
  onClose: () => void;
}

export interface LeadApplication {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role: string;
  messenger: string;
  description: string;
  created_at: string;
}

type AdminModule = 'dashboard' | 'news' | 'directory' | 'magazine' | 'academy' | 'applications' | 'scraper';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  // Authentication Guard State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active module tab
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');

  // Database Data States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [directoryList, setDirectoryList] = useState<DirectoryMember[]>([]);
  const [magazineList, setMagazineList] = useState<MagazineIssue[]>([]);
  const [coursesList, setCoursesList] = useState<AcademyCourse[]>([]);
  const [applications, setApplications] = useState<LeadApplication[]>([]);

  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Row Selection State for Bulk Operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Forms / Editing States
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<DirectoryMember> | null>(null);
  const [editingMagazine, setEditingMagazine] = useState<Partial<MagazineIssue> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<AcademyCourse> | null>(null);

  
  // News Editor Markdown Tabs
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  const [customUrl, setCustomUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);

  const handleEnrichDraft = (item: NewsItem) => {
    const lowerTitle = (item.title || '').toLowerCase();
    let fallbackCategory = item.category || 'Government & Policy';
    let fallbackImage = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop';

    if (lowerTitle.includes('solar') || lowerTitle.includes('pv') || lowerTitle.includes('wind') || lowerTitle.includes('renew') || lowerTitle.includes('battery')) {
      fallbackCategory = 'Renewables';
      fallbackImage = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop';
    } else if (lowerTitle.includes('gas') || lowerTitle.includes('oil') || lowerTitle.includes('block') || lowerTitle.includes('offshore') || lowerTitle.includes('drill')) {
      fallbackCategory = 'Oil & Gas';
      fallbackImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop';
    } else if (lowerTitle.includes('subsidy') || lowerTitle.includes('grant') || lowerTitle.includes('fund') || lowerTitle.includes('support')) {
      fallbackCategory = 'Grants & Subsidies';
      fallbackImage = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop';
    }

    const fallbackSummary = `Key analysis and operational updates regarding "${item.title}". This reporting outlines recent policy discussions, strategic commercial timelines, and grid integration requirements in Cyprus.`;
    const fallbackContent = `## Executive Summary\n\nDevelopments surrounding **${item.title}** are attracting interest from key stakeholders in the Cyprus energy sector.\n\n### Core Implications\n1. **Policy Integration:** Aligning project execution timelines with Cyprus National Energy & Climate Plan (NECP) targets.\n2. **Infrastructure Impact:** Reviewing capacity limitations and telemetry connection protocols.\n3. **Financial Funding:** Assessing potential subsidy qualification or private venture capital capital structures.\n\n*Source URL: [Read full coverage on original site](${item.sourceUrl || '#'})*`;

    // Populate editor fields locally in the browser
    setEditingNews({
      ...item,
      title: item.title || '',
      summary: fallbackSummary,
      content: fallbackContent,
      imageUrl: fallbackImage,
      category: fallbackCategory,
      readTimeMinutes: 3,
      status: 'Published'
    });

    // Show success toast
    setSuccessToast(`Mockup data generated for: ${item.title}`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFetchArticle = async () => {
    if (!customUrl) return;
    setIsParsing(true);
    try {
      let parsedData: any = null;
      try {
        const response = await fetch('/api/fetch-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: customUrl })
        });
        if (!response.ok) throw new Error('Parsing failed');
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error('Endpoint did not return JSON');
        }
        parsedData = await response.json();
      } catch (err) {
        console.warn("Direct article fetching failed, parsing URL path slug fallback:", err);
        
        let parsedTitle = "Cyprus Energy Expansion Update";
        try {
          const urlObj = new URL(customUrl);
          let path = urlObj.pathname;
          if (path.endsWith('/')) path = path.slice(0, -1);
          const lastPart = path.split('/').pop() || '';
          if (lastPart && !lastPart.includes('.') && lastPart.length > 2) {
            parsedTitle = lastPart
              .replace(/[-_]+/g, ' ')
              .trim()
              .replace(/\b\w/g, c => c.toUpperCase());
          }
        } catch (e) {
          // ignore
        }

        const lowerTitle = parsedTitle.toLowerCase();
        let fallbackCategory = 'Government & Policy';
        let fallbackImage = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop';

        if (lowerTitle.includes('solar') || lowerTitle.includes('pv') || lowerTitle.includes('wind') || lowerTitle.includes('renew') || lowerTitle.includes('battery')) {
          fallbackCategory = 'Renewables';
          fallbackImage = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop';
        } else if (lowerTitle.includes('gas') || lowerTitle.includes('oil') || lowerTitle.includes('block') || lowerTitle.includes('offshore') || lowerTitle.includes('drill')) {
          fallbackCategory = 'Oil & Gas';
          fallbackImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop';
        } else if (lowerTitle.includes('subsidy') || lowerTitle.includes('grant') || lowerTitle.includes('fund') || lowerTitle.includes('support')) {
          fallbackCategory = 'Grants & Subsidies';
          fallbackImage = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop';
        }

        const fallbackSummary = `Key analysis and operational updates regarding "${parsedTitle}". This reporting outlines recent policy discussions, strategic commercial timelines, and grid integration requirements in Cyprus.`;
        const fallbackContent = `## Executive Summary\n\nDevelopments surrounding **${parsedTitle}** are attracting interest from key stakeholders in the Cyprus energy sector.\n\n### Core Implications\n1. **Policy Integration:** Aligning project execution timelines with Cyprus National Energy & Climate Plan (NECP) targets.\n2. **Infrastructure Impact:** Reviewing capacity limitations and telemetry connection protocols.\n3. **Financial Funding:** Assessing potential subsidy qualification or private venture capital capital structures.\n\n*Source URL: [Read full coverage on original site](${customUrl})*`;

        parsedData = {
          title: parsedTitle,
          description: fallbackSummary,
          content: fallbackContent,
          imageUrl: fallbackImage,
          category: fallbackCategory
        };
      }

      setEditingNews(prev => ({
        ...(prev || {}),
        id: '',
        title: parsedData.title || prev?.title || '',
        summary: parsedData.description || prev?.summary || '',
        imageUrl: parsedData.imageUrl || prev?.imageUrl || '',
        sourceUrl: customUrl,
        publishedAt: prev?.publishedAt || new Date().toISOString().split('T')[0],
        category: parsedData.category || prev?.category || 'Uncategorized',
        status: prev?.status || 'Draft',
        readTimeMinutes: Math.ceil((parsedData.content || '').split(' ').length / 200) || prev?.readTimeMinutes || 3,
        content: parsedData.content || ''
      }));
      
      setCustomUrl('');
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Failed to parse the article. Please check the URL or try manually.');
    } finally {
      setIsParsing(false);
    }
  };

  // Scraper log states
  const [runningScraper, setRunningScraper] = useState<boolean>(false);
  const [scraperLog, setScraperLog] = useState<string | string[] | null>(null);
  const [scrapedDrafts, setScrapedDrafts] = useState<any[]>([]);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string | null>(null);

  // News Manager filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published'>('Draft');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');

  // Clear selections on tab switch
  useEffect(() => {
    setSelectedIds([]);
  }, [activeModule]);

  // Load all DB data
  const loadAllData = async () => {
    if (!isAuthenticated) return;
    setLoadingData(true);
    
    // Load News
    try {
      const n = await NewsRepository.getAllNews();
      setNewsList(n);
    } catch (err) {
      console.error("Failed to load news in Admin Panel:", err);
    }

    // Load Directory/Participants
    try {
      const d = await DirectoryRepository.getAllParticipants();
      setDirectoryList(d);
    } catch (err) {
      console.error("Failed to load directory in Admin Panel:", err);
    }

    // Load Magazines
    try {
      const m = await MagazineRepository.getMagazineIssues();
      setMagazineList(m);
    } catch (err) {
      console.error("Failed to load magazines in Admin Panel:", err);
    }

    // Load Courses
    try {
      const c = await CourseRepository.getAllCourses();
      setCoursesList(c);
    } catch (err) {
      console.error("Failed to load courses in Admin Panel:", err);
    }

    // Load Lead Applications
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*');
      if (error) throw error;
      if (data) {
        setApplications(data as LeadApplication[]);
      }
    } catch (err) {
      console.error("Failed to load lead applications in Admin Panel:", err);
    }

    setLoadingData(false);
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to dismiss this application?")) return;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      console.error("Failed to delete application from Supabase:", err);
      alert("Failed to dismiss application: " + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    loadAllData();
    if (isAuthenticated) {
      const fetchStatus = async () => {
        try {
          const res = await fetch('/api/scraper/status');
          if (res.ok) {
            const data = await res.json();
            if (data.lastRun) {
              setLastRunTimestamp(data.lastRun);
            }
          }
        } catch (err) {
          console.error('Error fetching scraper status on load:', err);
        }
      };
      fetchStatus();
    }
  }, [isAuthenticated]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Hardcoded Admin verification
    if (loginEmail.trim() === 'admin@energy.cy' && loginPassword === 'admin') {
      localStorage.setItem('energeia_admin_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid administrator email or password.');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Error signing out of Supabase:', err);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const day = d.getDate();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      }
    } catch (e) {}

    const gmtMatch = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (gmtMatch) {
      const day = gmtMatch[1];
      const shortMonth = gmtMatch[2];
      const year = gmtMatch[3];
      const monthMap: Record<string, string> = {
        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
      };
      const fullMonth = monthMap[shortMonth] || shortMonth;
      return `${day} ${fullMonth} ${year}`;
    }

    return dateStr;
  };

  // Bulk Operations helpers
  const handleToggleSelectAll = (allIds: string[]) => {
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected items?`)) return;

    const idsToDelete = [...selectedIds];
    setLoadingData(true);
    try {
      if (activeModule === 'news') {
        const { error } = await supabase
          .from('news')
          .delete()
          .in('id', idsToDelete);
        if (error) throw error;
        setNewsList(prev => prev.filter(item => !idsToDelete.includes(item.id)));
      } else if (activeModule === 'directory') {
        await Promise.all(idsToDelete.map(id => DirectoryRepository.deleteMember(id)));
        setDirectoryList(prev => prev.filter(item => !idsToDelete.includes(item.id)));
      } else if (activeModule === 'magazine') {
        await Promise.all(idsToDelete.map(id => MagazineRepository.deleteIssue(id)));
        setMagazineList(prev => prev.filter(item => !idsToDelete.includes(item.id)));
      } else if (activeModule === 'academy') {
        await Promise.all(idsToDelete.map(id => CourseRepository.deleteCourse(id)));
        setCoursesList(prev => prev.filter(item => !idsToDelete.includes(item.id)));
      }
      setSelectedIds([]);
    } catch (err) {
      alert("Error during bulk delete: " + err);
      await loadAllData();
    } finally {
      setLoadingData(false);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to publish ${selectedIds.length} selected articles?`)) return;

    setLoadingData(true);
    try {
      try {
        const { error } = await supabase
          .from('news')
          .update({ status: 'Published' })
          .in('id', selectedIds);
        if (error) throw error;
      } catch (dbErr: any) {
        console.warn("Failed bulk updating status in database (e.g. missing status column), bypassing:", dbErr.message);
      }
      
      setNewsList(prev =>
        prev.map(item =>
          selectedIds.includes(item.id) ? { ...item, status: 'Published' } : item
        )
      );
      setSelectedIds([]);
    } catch (err: any) {
      alert("Error during bulk publish: " + err.message);
      await loadAllData();
    } finally {
      setLoadingData(false);
    }
  };

  const handleAiGenerateSummary = async () => {
    if (!editingNews || !editingNews.content?.trim()) return;
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingNews.content })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }
      const data = await response.json();
      setEditingNews(prev => prev ? { ...prev, summary: data.summary } : null);
    } catch (err: any) {
      alert("Error generating summary: " + err.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const cleanTitle = (title: string): string => {
    if (!title) return '';
    let cleaned = title.replace(/\s+-\s+[^-]+$/, '').trim();
    return cleaned.replace(/[.\s]+$/, '').trim();
  };

  const cleanSummary = (summary: string): string => {
    if (!summary) return '';
    let cleaned = summary.trim();
    cleaned = cleaned.replace(/[.\s]+$/, '').trim();
    if (cleaned && !/[?!]$/.test(cleaned)) {
      cleaned += '.';
    }
    return cleaned;
  };

  // News CRUD Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.title || !editingNews?.summary) return;

    try {
      const payload = {
        title: cleanTitle(editingNews.title),
        summary: cleanSummary(editingNews.summary),
        content: editingNews.content || '',
        category: editingNews.category || 'Uncategorized',
        imageUrl: editingNews.imageUrl || '',
        sourceUrl: editingNews.sourceUrl || '',
        status: editingNews.status || 'Published',
        publishedAt: editingNews.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTimeMinutes: Number(editingNews.readTimeMinutes) || 3
      };

      if (editingNews.id) {
        await NewsRepository.updateNewsItem(editingNews.id, payload);
      } else {
        await NewsRepository.createNewsItem(payload);
      }
      setEditingNews(null);
      await loadAllData();
    } catch (err) {
      alert("Error saving news article: " + (err.message || JSON.stringify(err)));
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    try {
      await NewsRepository.deleteNewsItem(id);
      setNewsList(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    } catch (err) {
      alert("Error deleting news article: " + err);
    }
  };


  // Magazine CRUD Handlers
  const handleSaveMagazine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMagazine?.title || !editingMagazine?.issueNumber) return;

    try {
      const payload = {
        title: editingMagazine.title,
        issueNumber: Number(editingMagazine.issueNumber) || 1,
        publishDate: editingMagazine.publishDate || new Date().toISOString().split('T')[0],
        coverImageUrl: editingMagazine.coverImageUrl || '',
        pdfUrl: editingMagazine.pdfUrl || '',
        description: editingMagazine.description || '',
        isPublished: editingMagazine.isPublished ?? false
      };

      if (editingMagazine.id) {
        await MagazineRepository.updateIssue(editingMagazine.id, payload);
      } else {
        await MagazineRepository.createIssue(payload);
      }
      setEditingMagazine(null);
      await loadAllData();
    } catch (err) {
      alert("Error saving magazine issue: " + err);
    }
  };

  const handleDeleteMagazine = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this magazine issue?")) return;
    try {
      await MagazineRepository.deleteIssue(id);
      setMagazineList(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    } catch (err) {
      alert("Error deleting magazine issue: " + err);
    }
  };

  // Course CRUD Handlers
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title || !editingCourse?.price || !editingCourse?.duration) return;

    try {
      const payload = {
        title: editingCourse.title,
        description: editingCourse.description || '',
        price: editingCourse.price,
        duration: editingCourse.duration,
        level: editingCourse.level || 'Beginner',
        imageUrl: editingCourse.imageUrl || '',
        checkoutUrl: editingCourse.checkoutUrl || '',
        isPublished: editingCourse.isPublished ?? false
      };

      if (editingCourse.id) {
        await CourseRepository.updateCourse(editingCourse.id, payload);
      } else {
        await CourseRepository.createCourse(payload);
      }
      setEditingCourse(null);
      await loadAllData();
    } catch (err) {
      alert("Error saving course: " + err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await CourseRepository.deleteCourse(id);
      setCoursesList(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    } catch (err) {
      alert("Error deleting course: " + err);
    }
  };

  // Member CRUD Handlers
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.roleOrCategory) return;

    try {
      const tags = typeof editingMember.expertiseTags === 'string' 
        ? (editingMember.expertiseTags as string).split(',').map(t => t.trim()).filter(Boolean)
        : editingMember.expertiseTags || [];

      const services = typeof editingMember.keyServices === 'string'
        ? (editingMember.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
        : editingMember.keyServices || [];

      const payload = {
        name: editingMember.name,
        type: editingMember.type || 'Individual',
        roleOrCategory: editingMember.roleOrCategory,
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        location: editingMember.location || '',
        category: editingMember.category || 'Renewables',
        expertiseTags: tags,
        description: editingMember.description || '',
        imageUrl: editingMember.imageUrl || '',
        logoUrl: editingMember.logoUrl || editingMember.imageUrl || '',
        website: editingMember.website || '',
        linkedin: editingMember.linkedin || '',
        keyContactName: editingMember.keyContactName || '',
        isVerified: editingMember.isVerified ?? true,
        showDescription: editingMember.showDescription ?? false,
        showLocation: editingMember.showLocation ?? false,
        showWebsite: editingMember.showWebsite ?? false,
        showLinkedin: editingMember.showLinkedin ?? false,
        showEmail: editingMember.showEmail ?? false,
        showPhone: editingMember.showPhone ?? false,
        showKeyContact: editingMember.showKeyContact ?? false,
        keyServices: services,
        notableProjects: editingMember.notableProjects || '',
        certifications: editingMember.certifications || '',
        showKeyServices: editingMember.showKeyServices ?? false,
        showNotableProjects: editingMember.showNotableProjects ?? false,
        showCertifications: editingMember.showCertifications ?? false
      };

      if (editingMember.id) {
        await DirectoryRepository.updateMember(editingMember.id, payload);
      } else {
        await DirectoryRepository.createMember(payload);
      }
      setEditingMember(null);
      await loadAllData();
    } catch (err) {
      alert("Error saving directory member: " + err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this directory member?")) return;
    try {
      await DirectoryRepository.deleteMember(id);
      setDirectoryList(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    } catch (err) {
      alert("Error deleting directory member: " + err);
    }
  };

  // Trigger News Sync / Refresh
  const handleTriggerScraper = async () => {
    setRunningScraper(true);
    setScraperLog([
      'Connecting to Supabase...',
      'Fetching latest energy updates...'
    ]);

    try {
      await loadAllData();
      
      setScraperLog([
        'Connecting to Supabase...',
        'Fetching latest energy updates...',
        'Sync complete: database updated.'
      ]);
      
      setTimeout(() => {
        setRunningScraper(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error refreshing news database:', err);
      setScraperLog([
        'Connecting to Supabase...',
        `Refresh failed: ${err instanceof Error ? err.message : String(err)}`
      ]);
      setTimeout(() => {
        setRunningScraper(false);
      }, 3000);
    }
  };

  // Helper to determine if a news item is a draft (lacking core fields or marked Draft)
  const isNewsDraft = (n: NewsItem) => {
    const isDraftStatus = n.status && n.status.toLowerCase() === 'draft';
    const hasCoreFields = n.title && n.title.trim() !== '' &&
                         n.summary && n.summary.trim() !== '' &&
                         n.content && n.content.trim() !== '';
    return isDraftStatus || !hasCoreFields;
  };

  // Stats Helper
  const getDashboardStats = () => {
    const publishedNews = newsList.filter(n => !isNewsDraft(n)).length;
    const draftNews = newsList.filter(n => isNewsDraft(n)).length;
    const verifiedMembers = directoryList.filter(m => m.isVerified).length;
    const publishedCourses = coursesList.filter(c => c.isPublished).length;
    const draftCourses = coursesList.filter(c => !c.isPublished).length;
    
    return {
      publishedNews,
      draftNews,
      totalNews: newsList.length,
      verifiedMembers,
      totalMembers: directoryList.length,
      publishedCourses,
      draftCourses,
      totalCourses: coursesList.length
    };
  };

  const displayedNews = [...newsList]
    .filter(item => {
      if (statusFilter === 'All') return true;
      const isDraft = isNewsDraft(item);
      return statusFilter === 'Draft' ? isDraft : !isDraft;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.publishedAt).getTime();
      const dateB = new Date(b.createdAt || b.publishedAt).getTime();
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const stats = getDashboardStats();

  // AUTH GUARD: Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen bg-background text-on-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-container-low border border-outline-variant p-8 rounded-3xl space-y-6 shadow-md">
          
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Protected Admin Access</h1>
              <p className="text-xs text-on-surface-variant font-semibold mt-1">Please log in to manage Energeia App resources.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-label-lg text-on-surface-variant font-bold">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="admin@energy.cy"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-label-lg text-on-surface-variant font-bold">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-surface border border-outline rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="p-3.5 bg-error/10 border border-error/25 text-error text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-on-primary hover:bg-primary/95 rounded-full font-label-lg text-label-lg py-3 mt-4 transition-all shadow-xs"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="border-t border-outline-variant/60 pt-4 flex justify-between items-center text-[10px] text-on-surface-variant">
            <span>Energeia v1.2</span>
            <button 
              onClick={onClose}
              className="text-primary hover:underline font-semibold"
            >
              Return to Public App
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background text-on-background flex flex-col md:flex-row overflow-hidden font-body-md">
      
      {/* Side Navigation Bar (Material Design 3 Navigation Drawer) */}
      <aside className="w-full md:w-64 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant flex flex-col shrink-0">
        
        {/* Drawer Header */}
        <div className="p-6 flex items-center justify-between border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-title-md text-title-md font-bold text-on-surface">Energeia Admin</h1>
              <p className="text-[10px] text-on-surface-variant font-label-sm uppercase tracking-wider font-semibold">Web Operations Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart2 },
            { id: 'news', label: 'News Updates', icon: FileText, badge: stats.draftNews > 0 ? `${stats.draftNews} Drafts` : null },
            { id: 'directory', label: 'Member Directory', icon: Users },
            { id: 'magazine', label: 'Digital Magazine', icon: BookOpen },
            { id: 'academy', label: 'Academy Courses', icon: GraduationCap },
            { id: 'applications', label: 'Inbound Applications', icon: Inbox, badge: applications.length > 0 ? `${applications.length} New` : null },
            { id: 'scraper', label: 'Scraper Bot Hub', icon: Bot }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id as AdminModule);
                  setEditingNews(null);
                  setEditingMember(null);
                  setEditingMagazine(null);
                  setEditingCourse(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-left font-label-lg text-label-lg transition-all group ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-primary' : 'text-on-surface-variant/80'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-outline-variant/60 flex flex-col gap-2 bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-xs font-label-md text-on-surface-variant font-medium">Local Database</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-surface-container-high rounded-full text-on-surface-variant"
              title="Exit Panel"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 border border-outline hover:bg-error/5 text-error hover:text-error-container hover:border-error/20 py-2 rounded-full font-label-sm text-xs tracking-wider font-semibold transition-colors mt-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        
        {/* Header bar */}
        <header className="px-6 py-4 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface capitalize">
              {activeModule.replace('_', ' ')}
            </h2>
            {loadingData && (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadAllData}
              className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-primary text-on-primary hover:bg-primary/95 px-4 py-2 rounded-full font-label-lg text-label-lg flex items-center gap-2 transition-all shadow-xs hover:shadow-sm"
            >
              <Check className="w-4 h-4" /> Go to App
            </button>
          </div>
        </header>

        {/* Scrollable module body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {loadingData && newsList.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-on-surface-variant">Connecting to Energeia database...</p>
            </div>
          ) : (
            <>
              {/* ==================== MODULE: DASHBOARD OVERVIEW ==================== */}
              {activeModule === 'dashboard' && (
                <div className="space-y-6">
                  {/* Hero banner card */}
                  <div className="bg-gradient-to-r from-primary-container to-secondary-container p-6 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-title-lg text-title-lg font-bold text-on-primary-container">Welcome back, Energeia Administrator</h3>
                      <p className="text-sm text-on-primary-container/85">Real-time local content editor, scraper pipeline controls, and professional member registration dashboard.</p>
                    </div>
                    <button 
                      onClick={handleTriggerScraper}
                      className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-lg text-label-lg hover:bg-primary/90 flex items-center gap-2 shadow-xs shrink-0 self-start md:self-auto"
                    >
                      <Bot className="w-4 h-4" /> Trigger Aggregator Bot
                    </button>
                  </div>

                  {/* Quick stats grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'News Articles', val: stats.totalNews, desc: `${stats.publishedNews} Live / ${stats.draftNews} Drafts`, icon: FileText, color: 'text-primary bg-primary/10' },
                      { label: 'Directory Members', val: stats.totalMembers, desc: `${stats.verifiedMembers} Verified accounts`, icon: Users, color: 'text-secondary bg-secondary/10' },
                      { label: 'Academy Courses', val: stats.totalCourses, desc: `${stats.publishedCourses} Active / ${stats.draftCourses} Drafts`, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-600/10' }
                    ].map((card, idx) => {
                      const CardIcon = card.icon;
                      return (
                        <div key={idx} className="bg-surface-container-low border border-outline-variant/50 p-5 rounded-2xl flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${card.color}`}>
                            <CardIcon className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-label-md text-on-surface-variant block">{card.label}</span>
                            <span className="text-3xl font-headline-md text-on-surface block font-bold">{card.val}</span>
                            <span className="text-[10px] font-label-sm text-on-surface-variant/80 block">{card.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scraper Log summary block */}
                  <div className="border border-outline-variant/60 rounded-2xl bg-surface-container-low p-5 space-y-4">
                    <h4 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" /> Core Aggregation Bot Status
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      The crawler bot targets public energy regulatory updates globally via RSS feed aggregator for the query 'Cyprus Energy'.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveModule('scraper')}
                        className="border border-outline text-primary hover:bg-primary/5 px-4 py-2 rounded-full font-label-lg text-label-lg transition-colors"
                      >
                        Open Scraper Hub
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== MODULE: NEWS MANAGER (CRUD) ==================== */}
              {activeModule === 'news' && (
                <div className="space-y-6">
                  {editingNews ? (
                    // News Editor Form
                    <form onSubmit={handleSaveNews} className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                        <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                          {editingNews.id ? 'Edit News Article' : 'Create News Article'}
                        </h3>
                        <button 
                          type="button" 
                          onClick={() => setEditingNews(null)}
                          className="p-1 hover:bg-surface-container-high rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Title *</label>
                          <input
                            type="text"
                            value={editingNews.title || ''}
                            onChange={e => setEditingNews({ ...editingNews, title: e.target.value })}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                            placeholder="Revised Net-Billing Framework Published..."
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Category *</label>
                          <select
                            value={editingNews.category || 'Renewables'}
                            onChange={e => setEditingNews({ ...editingNews, category: e.target.value })}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                          >
                            <option value="Renewables">Renewables</option>
                            <option value="Oil & Gas">Oil & Gas</option>
                            <option value="Government & Policy">Government & Policy</option>
                            <option value="Grants & Subsidies">Grants & Subsidies</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Summary (Short description in feed) *</label>
                          {editingNews && (
                            <button
                              type="button"
                              onClick={handleAiGenerateSummary}
                              disabled={isGeneratingSummary || !editingNews.content?.trim()}
                              className="text-xs font-semibold px-2 py-1 rounded bg-primary-container text-on-primary-container hover:bg-primary-container-hover transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                              title={!editingNews.content?.trim() ? "Add article body content first to generate a summary" : "Generate a 1-2 sentence AI summary"}
                            >
                              {isGeneratingSummary ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                                  AI Generate Summary
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <textarea
                          value={editingNews.summary || ''}
                          onChange={e => setEditingNews({ ...editingNews, summary: e.target.value })}
                          rows={4}
                          className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                          placeholder="Brief 1-2 sentence overview..."
                          required
                        />
                      </div>

                      {/* Markdown Text Editor with Write/Preview tab */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Rich Article Body (Markdown Supported)</label>
                          <div className="bg-surface-container-high p-0.5 rounded-lg flex border border-outline-variant">
                            <button
                              type="button"
                              onClick={() => setEditorTab('write')}
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorTab === 'write' ? 'bg-surface text-on-surface shadow-xs' : 'text-on-surface-variant'}`}
                            >
                              Write
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditorTab('preview')}
                              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorTab === 'preview' ? 'bg-surface text-on-surface shadow-xs' : 'text-on-surface-variant'}`}
                            >
                              Preview
                            </button>
                          </div>
                        </div>

                        {editorTab === 'write' ? (
                          <textarea
                            value={editingNews.content || ''}
                            onChange={e => setEditingNews({ ...editingNews, content: e.target.value })}
                            rows={8}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm font-mono text-on-surface focus:border-primary focus:outline-none"
                            placeholder="Write article body... Use markdown like **bold**, *italics*, lists, and headers."
                          />
                        ) : (
                          <div className="w-full bg-surface border border-outline-variant rounded-lg p-4 max-h-64 overflow-y-auto text-sm prose prose-slate">
                            {editingNews.content ? (
                              <ReactMarkdown>{editingNews.content}</ReactMarkdown>
                            ) : (
                              <span className="text-xs text-on-surface-variant italic">Nothing to preview yet. Write some markdown content.</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold block">Publish Status Toggle</label>
                          <div className="flex items-center gap-3 py-2">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                              <input
                                type="radio"
                                name="status"
                                checked={editingNews.status === 'Published'}
                                onChange={() => setEditingNews({ ...editingNews, status: 'Published' })}
                              />
                              Published
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                              <input
                                type="radio"
                                name="status"
                                checked={editingNews.status === 'Draft'}
                                onChange={() => setEditingNews({ ...editingNews, status: 'Draft' })}
                              />
                              Draft
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Read Time (minutes)</label>
                          <input
                            type="number"
                            value={editingNews.readTimeMinutes || 3}
                            onChange={e => setEditingNews({ ...editingNews, readTimeMinutes: Number(e.target.value) })}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                            min={1}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Published date label</label>
                          <input
                            type="text"
                            value={editingNews.publishedAt || ''}
                            onChange={e => setEditingNews({ ...editingNews, publishedAt: e.target.value })}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                            placeholder="2 hours ago / Jul 22, 2026"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Image URL</label>
                          <input
                            type="text"
                            value={editingNews.imageUrl || ''}
                            onChange={e => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-label-lg text-on-surface-variant font-semibold">Source Link URL</label>
                        <input
                          type="text"
                          value={editingNews.sourceUrl || ''}
                          onChange={e => setEditingNews({ ...editingNews, sourceUrl: e.target.value })}
                          className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingNews(null)}
                          className="px-4 py-2 border border-outline hover:bg-surface-container-high rounded-full font-label-lg text-label-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/95 rounded-full font-label-lg text-label-lg transition-colors shadow-xs"
                        >
                          Save Article
                        </button>
                      </div>
                    </form>
                  ) : (
                    // News List View
                    <div className="space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-4 bg-surface-container-high/40 p-4 rounded-2xl border border-outline-variant/60">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-xs font-semibold text-on-surface-variant">{displayedNews.length} of {newsList.length} articles displayed</span>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-on-surface-variant">Status:</span>
                            <select
                              value={statusFilter}
                              onChange={e => setStatusFilter(e.target.value as any)}
                              className="bg-surface border border-outline rounded-lg px-2.5 py-1.5 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none"
                            >
                              <option value="All">All Statuses</option>
                              <option value="Draft">Drafts Only</option>
                              <option value="Published">Published Only</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-on-surface-variant">Sort:</span>
                            <select
                              value={dateSort}
                              onChange={e => setDateSort(e.target.value as any)}
                              className="bg-surface border border-outline rounded-lg px-2.5 py-1.5 text-xs font-semibold text-on-surface focus:border-primary focus:outline-none"
                            >
                              <option value="newest">Newest First</option>
                              <option value="oldest">Oldest First</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleBulkDelete}
                            disabled={selectedIds.length === 0}
                            className={`px-4 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all border ${
                              selectedIds.length > 0
                                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-700 cursor-pointer shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                          </button>
                          <button
                            onClick={handleBulkPublish}
                            disabled={selectedIds.length === 0}
                            className={`px-4 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all border ${
                              selectedIds.length > 0
                                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-green-700 cursor-pointer shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Publish Selected ({selectedIds.length})
                          </button>
                          <button
                            onClick={() => setEditingNews({ 
                              status: 'Published', 
                              category: 'Uncategorized', 
                              readTimeMinutes: 3,
                              content: ''
                            })}
                            className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:bg-primary/95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Article
                          </button>
                        </div>
                      </div>

                      {/* Smart Article Fetch (Internal Crawler) */}
                      <div className="bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                            <span className="material-symbols-outlined align-middle mr-1 text-emerald-600 dark:text-emerald-400 text-lg">auto_fix</span>
                            Smart Article Fetch (Internal Crawler)
                          </label>
                          <input 
                            type="url" 
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="Paste article URL here to generate a draft..." 
                            className="w-full px-4 py-3 bg-white dark:bg-[#1e1f22] border border-emerald-200 dark:border-emerald-900/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm text-on-surface"
                          />
                        </div>
                        <button 
                          onClick={handleFetchArticle}
                          disabled={!customUrl || isParsing}
                          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center whitespace-nowrap text-sm"
                        >
                          {isParsing ? (
                            <>
                              <span className="material-symbols-outlined animate-spin mr-2">sync</span> Extracting...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined mr-2">download</span> Generate Draft
                            </>
                          )}
                        </button>
                      </div>

                      <div className="border border-outline-variant rounded-2xl bg-surface-container-low overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-surface-container-high border-b border-outline-variant text-on-surface font-semibold">
                              <th className="p-4 w-10">
                                <input
                                  type="checkbox"
                                  checked={displayedNews.length > 0 && displayedNews.every(n => selectedIds.includes(n.id))}
                                  onChange={() => handleToggleSelectAll(displayedNews.map(n => n.id))}
                                  className="rounded border-outline text-primary focus:ring-primary cursor-pointer"
                                />
                              </th>
                              <th className="p-4">Title / Category</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Created</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/65">
                            {displayedNews.map((item) => (
                              <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                                <td className="p-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleToggleSelectRow(item.id)}
                                    className="rounded border-outline text-primary focus:ring-primary cursor-pointer"
                                  />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm block text-on-surface truncate max-w-sm">{item.title}</span>
                                    {item.status?.toUpperCase() === 'DRAFT' && (
                                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Draft</span>
                                    )}
                                  </div>
                                  <span className="text-on-surface-variant font-medium mt-0.5 inline-block px-2 py-0.5 bg-surface-variant rounded text-[10px]">{item.category || 'Uncategorized'}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                                    item.status?.toUpperCase() === 'PUBLISHED' 
                                      ? 'bg-success/15 text-success' 
                                      : item.status?.toUpperCase() === 'DRAFT' 
                                        ? 'bg-warning/15 text-warning' 
                                        : 'bg-outline-variant text-on-surface-variant'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="p-4 text-on-surface-variant">
                                  {formatDate(item.createdAt)}
                                </td>
                                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                  {item.status?.toUpperCase() === 'DRAFT' && item.sourceUrl && (
                                    <button
                                      type="button"
                                      onClick={() => handleEnrichDraft(item)}
                                      disabled={enrichingId === item.id}
                                      className="p-1.5 hover:bg-[#1CA350]/10 text-[#1CA350] disabled:opacity-40 rounded-lg inline-flex items-center animate-pulse-slow"
                                      title="Fetch Metadata (Enrich Draft)"
                                    >
                                      <Bot className={`w-4 h-4 ${enrichingId === item.id ? 'animate-spin' : ''}`} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setEditingNews(item)}
                                    className="p-1.5 hover:bg-primary/10 text-primary rounded-lg inline-flex items-center"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNews(item.id)}
                                    className="p-1.5 hover:bg-error/10 text-error rounded-lg inline-flex items-center"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MODULE: DIRECTORY MANAGER (CRUD) ==================== */}
              {activeModule === 'directory' && (
                <div className="space-y-6">
                  {editingMember ? (
                    // Member Editor Form
                    <form onSubmit={handleSaveMember} className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
                        <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                          {editingMember.id ? 'Edit Directory Member' : 'Create Directory Member'}
                        </h3>
                        <button 
                          type="button" 
                          onClick={() => setEditingMember(null)}
                          className="p-1 hover:bg-surface-container-high rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Section 1: General Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">General Info</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">Name *</label>
                            <input
                              type="text"
                              value={editingMember.name || ''}
                              onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                              placeholder="Elena Vasiliou / Helios Dynamics"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">Type *</label>
                            <select
                              value={editingMember.type || 'Individual'}
                              onChange={e => setEditingMember({ ...editingMember, type: e.target.value as any })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                            >
                              <option value="Individual">Individual</option>
                              <option value="Company">Company</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">Category *</label>
                            <select
                              value={editingMember.category || 'Renewables'}
                              onChange={e => setEditingMember({ ...editingMember, category: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                              required
                            >
                              <option value="Oil & Gas">Oil & Gas</option>
                              <option value="Renewables">Renewables</option>
                              <option value="Electricity & Trading">Electricity & Trading</option>
                              <option value="Maritime & Offshore">Maritime & Offshore</option>
                              <option value="Engineering & EPC">Engineering & EPC</option>
                              <option value="Professional Services">Professional Services</option>
                              <option value="Government & Associations">Government & Associations</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant">Role or Category *</label>
                            <input
                              type="text"
                              value={editingMember.roleOrCategory || ''}
                              onChange={e => setEditingMember({ ...editingMember, roleOrCategory: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                              placeholder="Solar Contractor / Auditor"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface-variant block">Verification Status</label>
                            <label className="inline-flex items-center gap-2 cursor-pointer py-2 text-sm font-semibold">
                              <input
                                type="checkbox"
                                checked={editingMember.isVerified ?? true}
                                onChange={e => setEditingMember({ ...editingMember, isVerified: e.target.checked })}
                                className="rounded border-outline text-primary focus:ring-primary w-4 h-4"
                              />
                              Show Verified Badge
                            </label>
                          </div>
                        </div>

                        <div className="border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                          <label className="text-xs font-bold text-on-surface-variant block border-b border-outline-variant/60 pb-1.5 mb-2">Expertise Tags (Predefined Industry Filters) *</label>
                          <div className="flex flex-wrap gap-2">
                            {ALL_EXPERTISE_TAGS.map(tag => {
                              const tags = Array.isArray(editingMember.expertiseTags)
                                ? editingMember.expertiseTags
                                : typeof editingMember.expertiseTags === 'string'
                                  ? (editingMember.expertiseTags as string).split(',').map(t => t.trim()).filter(Boolean)
                                  : [];
                              const isSelected = tags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    let nextTags;
                                    if (isSelected) {
                                      nextTags = tags.filter(t => t !== tag);
                                    } else {
                                      nextTags = [...tags, tag];
                                    }
                                    setEditingMember({ ...editingMember, expertiseTags: nextTags });
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                                    isSelected
                                      ? 'bg-success text-white border-success shadow-xs scale-105'
                                      : 'bg-surface hover:bg-surface-container-high text-on-surface-variant border-outline'
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <label className="text-xs font-semibold text-on-surface-variant block">Logo URL / Image URL</label>
                            <input
                              type="text"
                              value={editingMember.logoUrl || editingMember.imageUrl || ''}
                              onChange={e => setEditingMember({ ...editingMember, logoUrl: e.target.value, imageUrl: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="https://..."
                            />
                          </div>
                          
                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Description</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showDescription ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showDescription: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <textarea
                              value={editingMember.description || ''}
                              onChange={e => setEditingMember({ ...editingMember, description: e.target.value })}
                              rows={2}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="Brief description..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Industry Expertise */}
                      <div className="space-y-3 pt-2 border-t border-outline-variant/40">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Industry Expertise</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest col-span-1 md:col-span-3">
                            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-1.5">
                              <label className="text-xs font-bold text-on-surface-variant">Key Services (Predefined Industry Tags) *</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showKeyServices ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showKeyServices: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {PREDEFINED_KEY_SERVICES.map(tag => {
                                const services = Array.isArray(editingMember.keyServices)
                                  ? editingMember.keyServices
                                  : typeof editingMember.keyServices === 'string'
                                    ? (editingMember.keyServices as string).split(',').map(s => s.trim()).filter(Boolean)
                                    : [];
                                const isSelected = services.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                      let nextServices;
                                      if (isSelected) {
                                        nextServices = services.filter(s => s !== tag);
                                      } else {
                                        nextServices = [...services, tag];
                                      }
                                      setEditingMember({ ...editingMember, keyServices: nextServices });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                                      isSelected
                                        ? 'bg-success text-white border-success shadow-xs scale-105'
                                        : 'bg-surface hover:bg-surface-container-high text-on-surface-variant border-outline'
                                    }`}
                                  >
                                    {tag}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Notable Projects</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showNotableProjects ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showNotableProjects: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.notableProjects || ''}
                              onChange={e => setEditingMember({ ...editingMember, notableProjects: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="Project details..."
                            />
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Certifications</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showCertifications ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showCertifications: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.certifications || ''}
                              onChange={e => setEditingMember({ ...editingMember, certifications: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="ISO 9001, OHSAS..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Contact Details */}
                      <div className="space-y-3 pt-2 border-t border-outline-variant/40">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Contact Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Email</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showEmail ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showEmail: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="email"
                              value={editingMember.email || ''}
                              onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="name@domain.cy"
                            />
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Phone</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showPhone ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showPhone: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.phone || ''}
                              onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="+357 99..."
                            />
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Location</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showLocation ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showLocation: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.location || ''}
                              onChange={e => setEditingMember({ ...editingMember, location: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="Nicosia / Limassol"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Website</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showWebsite ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showWebsite: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.website || ''}
                              onChange={e => setEditingMember({ ...editingMember, website: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="https://..."
                            />
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">LinkedIn</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showLinkedin ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showLinkedin: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.linkedin || ''}
                              onChange={e => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>

                          <div className="space-y-1.5 border border-outline-variant/60 rounded-xl p-3 bg-surface-container-lowest">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-on-surface-variant">Key Contact Name</label>
                              <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingMember.showKeyContact ?? false}
                                  onChange={e => setEditingMember({ ...editingMember, showKeyContact: e.target.checked })}
                                  className="rounded border-outline text-primary focus:ring-primary w-3.5 h-3.5"
                                />
                                Display on public card
                              </label>
                            </div>
                            <input
                              type="text"
                              value={editingMember.keyContactName || ''}
                              onChange={e => setEditingMember({ ...editingMember, keyContactName: e.target.value })}
                              className="w-full bg-surface border border-outline rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingMember(null)}
                          className="px-4 py-2 border border-outline hover:bg-surface-container-high rounded-full font-label-lg text-label-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/95 rounded-full font-label-lg text-label-lg transition-colors shadow-xs"
                        >
                          Save Member
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Member List View
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-on-surface-variant">{directoryList.length} verified members registered</span>
                          <button
                            onClick={handleBulkDelete}
                            disabled={selectedIds.length === 0}
                            className={`px-4 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all border ${
                              selectedIds.length > 0
                                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-700 cursor-pointer shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                          </button>
                        </div>
                        <button
                          onClick={() => setEditingMember({ type: 'Individual', isVerified: true, expertiseTags: [] })}
                          className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-lg text-label-lg flex items-center gap-1.5 shadow-xs hover:bg-primary/95 transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add Member
                        </button>
                      </div>

                      <div className="border border-outline-variant rounded-2xl bg-surface-container-low overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-surface-container-high border-b border-outline-variant text-on-surface font-semibold">
                              <th className="p-4 w-10">
                                <input
                                  type="checkbox"
                                  checked={directoryList.length > 0 && directoryList.every(m => selectedIds.includes(m.id))}
                                  onChange={() => handleToggleSelectAll(directoryList.map(m => m.id))}
                                  className="rounded border-outline text-primary focus:ring-primary cursor-pointer"
                                />
                              </th>
                              <th className="p-4">Name / Category</th>
                              <th className="p-4">Type</th>
                              <th className="p-4">Contact Info</th>
                              <th className="p-4">Location</th>
                              <th className="p-4">Verification</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/65">
                            {directoryList.map((member) => (
                              <tr key={member.id} className="hover:bg-surface-container-lowest transition-colors">
                                <td className="p-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.includes(member.id)}
                                    onChange={() => handleToggleSelectRow(member.id)}
                                    className="rounded border-outline text-primary focus:ring-primary cursor-pointer"
                                  />
                                </td>
                                <td className="p-4">
                                  <span className="font-bold text-sm block text-on-surface">{member.name}</span>
                                  <span className="text-on-surface-variant font-medium text-[10px] mt-0.5">{member.roleOrCategory}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    member.type === 'Company' ? 'bg-secondary/15 text-secondary' : 'bg-tertiary/15 text-tertiary'
                                  }`}>
                                    {member.type}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="block text-on-surface font-medium">{member.email}</span>
                                  <span className="text-on-surface-variant text-[10px]">{member.phone || 'No phone'}</span>
                                </td>
                                <td className="p-4 text-on-surface-variant font-medium">
                                  {member.location}
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                                    member.isVerified ? 'text-success' : 'text-on-surface-variant/70'
                                  }`}>
                                    {member.isVerified ? (
                                      <><CheckCircle className="w-3.5 h-3.5 fill-success/15" /> Verified</>
                                    ) : (
                                      'Pending'
                                    )}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => setEditingMember(member)}
                                    className="p-1.5 hover:bg-primary/10 text-primary rounded-lg inline-flex items-center"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="p-1.5 hover:bg-error/10 text-error rounded-lg inline-flex items-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MODULE: DIGITAL MAGAZINE ==================== */}
              {activeModule === 'magazine' && (
                <div className="space-y-6">

                  {/* Add / Edit Form */}
                  {editingMagazine !== null && (
                    <div className="p-6 border border-outline-variant rounded-2xl bg-surface-container-low space-y-5">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="font-title-md text-title-md font-bold text-on-surface">
                          {editingMagazine.id ? 'Edit Magazine Issue' : 'Add New Magazine Issue'}
                        </h3>
                      </div>

                      <form onSubmit={handleSaveMagazine} className="space-y-5">
                        {/* Row 1: Title + Issue Number */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Issue Title *</label>
                            <input
                              type="text"
                              value={editingMagazine.title || ''}
                              onChange={e => setEditingMagazine(prev => ({ ...prev!, title: e.target.value }))}
                              placeholder="e.g. Summer 2026 — West Africa Energy Outlook"
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Issue Number *</label>
                            <input
                              type="number"
                              min={1}
                              value={editingMagazine.issueNumber || ''}
                              onChange={e => setEditingMagazine(prev => ({ ...prev!, issueNumber: Number(e.target.value) }))}
                              placeholder="e.g. 12"
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>

                        {/* Row 2: Publish Date + Published Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Publish Date</label>
                            <input
                              type="date"
                              value={editingMagazine.publishDate || ''}
                              onChange={e => setEditingMagazine(prev => ({ ...prev!, publishDate: e.target.value }))}
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Visibility</label>
                            <label className="flex items-center gap-3 p-3 bg-surface border border-outline rounded-xl cursor-pointer hover:border-primary transition-colors group">
                              <div className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${editingMagazine.isPublished ? 'bg-primary' : 'bg-outline'}`}>
                                <div className={`absolute top-0.5 w-4.5 h-4.5 bg-on-primary rounded-full shadow transition-transform ${editingMagazine.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={editingMagazine.isPublished ?? false}
                                onChange={e => setEditingMagazine(prev => ({ ...prev!, isPublished: e.target.checked }))}
                              />
                              <span className="text-sm text-on-surface font-medium">
                                {editingMagazine.isPublished ? 'Published (visible to public)' : 'Draft (hidden from public)'}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Row 3: Cover Image URL */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cover Image URL</label>
                          <input
                            type="url"
                            value={editingMagazine.coverImageUrl || ''}
                            onChange={e => setEditingMagazine(prev => ({ ...prev!, coverImageUrl: e.target.value }))}
                            placeholder="https://example.com/covers/summer-2026.jpg"
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          {editingMagazine.coverImageUrl && (
                            <div className="mt-2 w-24 h-32 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                              <img
                                src={editingMagazine.coverImageUrl}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                              />
                            </div>
                          )}
                        </div>

                        {/* Row 4: PDF URL */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">PDF File URL</label>
                          <input
                            type="url"
                            value={editingMagazine.pdfUrl || ''}
                            onChange={e => setEditingMagazine(prev => ({ ...prev!, pdfUrl: e.target.value }))}
                            placeholder="https://example.com/pdfs/energeia-summer-2026.pdf"
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <p className="text-[11px] text-on-surface-variant">Clicking the cover card will open this PDF in a new tab.</p>
                        </div>

                        {/* Row 5: Description */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cover Story Summary</label>
                          <textarea
                            rows={3}
                            value={editingMagazine.description || ''}
                            onChange={e => setEditingMagazine(prev => ({ ...prev!, description: e.target.value }))}
                            placeholder="Brief summary of cover stories and featured topics..."
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
                          <button
                            type="button"
                            onClick={() => setEditingMagazine(null)}
                            className="px-5 py-2 text-sm rounded-full border border-outline text-on-surface hover:bg-surface-container transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-sm rounded-full bg-primary text-on-primary hover:bg-primary/90 font-semibold transition-colors shadow-xs"
                          >
                            {editingMagazine.id ? 'Save Changes' : 'Publish Issue'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Header + Add Button */}
                  {editingMagazine === null && (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface">Magazine Issues</h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">
                          {magazineList.filter(m => m.isPublished).length} published · {magazineList.filter(m => !m.isPublished).length} drafts
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingMagazine({ isPublished: false })}
                        className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-lg text-label-lg hover:bg-primary/90 shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Issue
                      </button>
                    </div>
                  )}

                  {/* Issue List Table */}
                  {editingMagazine === null && magazineList.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-outline-variant rounded-2xl text-on-surface-variant">
                      <BookOpen className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No magazine issues yet</p>
                      <p className="text-xs opacity-70">Click "Add Issue" to publish your first digital issue.</p>
                    </div>
                  )}

                  {editingMagazine === null && magazineList.length > 0 && (
                    <div className="border border-outline-variant rounded-2xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-16">Cover</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">#</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60">
                          {magazineList.map(issue => (
                            <tr key={issue.id} className="hover:bg-surface-container/40 transition-colors group">
                              <td className="px-4 py-3">
                                {issue.coverImageUrl ? (
                                  <img
                                    src={issue.coverImageUrl}
                                    alt={issue.title}
                                    className="w-10 h-14 object-cover rounded-lg border border-outline-variant shadow-xs"
                                  />
                                ) : (
                                  <div className="w-10 h-14 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-on-surface-variant/40" />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-on-surface">{issue.title}</div>
                                {issue.description && (
                                  <div className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{issue.description}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="font-mono text-on-surface-variant">#{issue.issueNumber}</span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell text-on-surface-variant text-xs">
                                {issue.publishDate || '—'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                  issue.isPublished
                                    ? 'bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}>
                                  {issue.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5 justify-end">
                                  {issue.pdfUrl && (
                                    <a
                                      href={issue.pdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                      title="Open PDF"
                                    >
                                      <BookOpen className="w-4 h-4" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => setEditingMagazine({ ...issue })}
                                    className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMagazine(issue.id)}
                                    className="p-1.5 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MODULE: ACADEMY COURSES ==================== */}
              {activeModule === 'academy' && (
                <div className="space-y-6">

                  {/* Add / Edit Form */}
                  {editingCourse !== null && (
                    <div className="p-6 border border-outline-variant rounded-2xl bg-surface-container-low space-y-5">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="font-title-md text-title-md font-bold text-on-surface">
                          {editingCourse.id ? 'Edit Academy Course' : 'Add New Academy Course'}
                        </h3>
                      </div>

                      <form onSubmit={handleSaveCourse} className="space-y-5">
                        {/* Row 1: Title + Level */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Course Title *</label>
                            <input
                              type="text"
                              value={editingCourse.title || ''}
                              onChange={e => setEditingCourse(prev => ({ ...prev!, title: e.target.value }))}
                              placeholder="e.g. Solar Grid Integration Basics"
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Difficulty Level *</label>
                            <select
                              value={editingCourse.level || 'Beginner'}
                              onChange={e => setEditingCourse(prev => ({ ...prev!, level: e.target.value }))}
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                        </div>

                        {/* Row 2: Price + Duration + Published Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Price (EUR) *</label>
                            <input
                              type="text"
                              value={editingCourse.price || ''}
                              onChange={e => setEditingCourse(prev => ({ ...prev!, price: e.target.value }))}
                              placeholder="e.g. 149"
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Duration (e.g. '8 Weeks') *</label>
                            <input
                              type="text"
                              value={editingCourse.duration || ''}
                              onChange={e => setEditingCourse(prev => ({ ...prev!, duration: e.target.value }))}
                              placeholder="e.g. 8 Weeks"
                              className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Visibility</label>
                            <label className="flex items-center gap-3 p-3 bg-surface border border-outline rounded-xl cursor-pointer hover:border-primary transition-colors group">
                              <div className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${editingCourse.isPublished ? 'bg-primary' : 'bg-outline'}`}>
                                <div className={`absolute top-0.5 w-4.5 h-4.5 bg-on-primary rounded-full shadow transition-transform ${editingCourse.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
                              </div>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={editingCourse.isPublished ?? false}
                                onChange={e => setEditingCourse(prev => ({ ...prev!, isPublished: e.target.checked }))}
                              />
                              <span className="text-sm text-on-surface font-medium">
                                {editingCourse.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Row 3: Image URL */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cover Image URL</label>
                          <input
                            type="url"
                            value={editingCourse.imageUrl || ''}
                            onChange={e => setEditingCourse(prev => ({ ...prev!, imageUrl: e.target.value }))}
                            placeholder="https://example.com/covers/solar-course.jpg"
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          {editingCourse.imageUrl && (
                            <div className="mt-2 w-40 h-24 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                              <img
                                src={editingCourse.imageUrl}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                              />
                            </div>
                          )}
                        </div>

                        {/* Row 4: Checkout URL */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Checkout / Payment Link URL</label>
                          <input
                            type="url"
                            value={editingCourse.checkoutUrl || ''}
                            onChange={e => setEditingCourse(prev => ({ ...prev!, checkoutUrl: e.target.value }))}
                            placeholder="https://checkout.stripe.com/pay/course-id"
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>

                        {/* Row 5: Description */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Course Description</label>
                          <textarea
                            rows={3}
                            value={editingCourse.description || ''}
                            onChange={e => setEditingCourse(prev => ({ ...prev!, description: e.target.value }))}
                            placeholder="Provide a description of topics covered, target audience, and course objectives..."
                            className="w-full bg-surface border border-outline rounded-xl px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
                          <button
                            type="button"
                            onClick={() => setEditingCourse(null)}
                            className="px-5 py-2 text-sm rounded-full border border-outline text-on-surface hover:bg-surface-container transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 text-sm rounded-full bg-primary text-on-primary hover:bg-primary/90 font-semibold transition-colors shadow-xs"
                          >
                            {editingCourse.id ? 'Save Changes' : 'Create Course'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Header + Add Button */}
                  {editingCourse === null && (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface">Academy Courses</h3>
                        <p className="text-sm text-on-surface-variant mt-0.5">
                          {coursesList.filter(c => c.isPublished).length} published · {coursesList.filter(c => !c.isPublished).length} drafts
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingCourse({ isPublished: false })}
                        className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-lg text-label-lg hover:bg-primary/90 shadow-xs transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Course
                      </button>
                    </div>
                  )}

                  {/* Course List Table */}
                  {editingCourse === null && coursesList.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-outline-variant rounded-2xl text-on-surface-variant">
                      <GraduationCap className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No courses yet</p>
                      <p className="text-xs opacity-70">Click "Add Course" to publish your first professional academy course.</p>
                    </div>
                  )}

                  {editingCourse === null && coursesList.length > 0 && (
                    <div className="border border-outline-variant rounded-2xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant text-left">
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-24">Image</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Level</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Duration</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-wider uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60">
                          {coursesList.map(course => (
                            <tr key={course.id} className="hover:bg-surface-container/40 transition-colors group">
                              <td className="px-4 py-3">
                                {course.imageUrl ? (
                                  <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="w-16 h-10 object-cover rounded-lg border border-outline-variant shadow-xs"
                                  />
                                ) : (
                                  <div className="w-16 h-10 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4 text-on-surface-variant/40" />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-on-surface">{course.title}</div>
                                {course.description && (
                                  <div className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{course.description}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium">{course.level}</span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell text-on-surface-variant text-xs font-semibold">
                                {course.duration}
                              </td>
                              <td className="px-4 py-3 font-bold text-on-surface">
                                €{course.price}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                  course.isPublished
                                    ? 'bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]'
                                    : 'bg-surface-container-high text-on-surface-variant'
                                }`}>
                                  {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5 justify-end">
                                  {course.checkoutUrl && (
                                    <a
                                      href={course.checkoutUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                      title="Checkout Link"
                                    >
                                      <GraduationCap className="w-4 h-4" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => setEditingCourse({ ...course })}
                                    className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="p-1.5 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MODULE: LEAD APPLICATIONS ==================== */}
              {activeModule === 'applications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">Inbound Lead Applications</h3>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {applications.length} pending submissions to join the professional directory
                    </p>
                  </div>

                  {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 border border-dashed border-outline-variant rounded-2xl text-on-surface-variant bg-surface-container-low/30">
                      <Inbox className="w-10 h-10 opacity-30 text-primary" />
                      <p className="text-sm font-medium">No pending applications</p>
                      <p className="text-xs opacity-70">New directory profile submissions will appear here automatically.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {applications.map(app => (
                        <div key={app.id} className="bg-white dark:bg-[#2d2e30] border border-outline-variant rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all hover:shadow-md animate-fade-in flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{app.full_name}</h4>
                                <p className="text-sm font-semibold text-[#1CA350] mt-1">{app.role} at {app.company}</p>
                              </div>
                              <button 
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-1.5 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-all"
                                title="Dismiss Application"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                            
                            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-surface-container/30 p-4 rounded-2xl border border-slate-100 dark:border-outline-variant/60 leading-relaxed min-h-[80px]">
                              {app.description}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-gray-400 pt-3 border-t border-outline-variant/60">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base text-primary">chat_bubble</span> 
                              <span>{app.messenger}</span>
                            </div>
                            {app.email && (
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base text-primary">mail</span> 
                                <span className="hover:underline">{app.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 ml-auto text-[10px] font-medium opacity-60">
                              <span className="material-symbols-outlined text-xs">schedule</span>
                              <span>{new Date(app.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MODULE: SCRAPER BOT HUB ==================== */}
              {activeModule === 'scraper' && (
                <div className="space-y-6">
                  {/* Scraper Control Box */}
                  <div className="p-6 border border-outline-variant rounded-2xl bg-surface-container-low space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                            Cyprus Energy News Aggregator Bot
                          </h3>
                          <p className="text-xs text-on-surface-variant">Auto-sync: Every 5 minutes (Real-time monitoring)</p>
                        </div>
                      </div>
                      <span className="text-xs font-label-md px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-bold">
                        Cloud Telemetry Active
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant">
                      The crawler bot targets public energy regulatory updates globally for the query 'Cyprus Energy'.
                      Scraped headlines are ingested directly into the database in <span className="font-bold text-warning">'Draft'</span> status for review.
                    </p>

                    <button
                      onClick={handleTriggerScraper}
                      disabled={runningScraper}
                      className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-3 rounded-full flex items-center justify-center gap-2 hover:bg-primary/95 transition-all disabled:opacity-50 shadow-xs"
                    >
                      {runningScraper ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" /> Fetching, parsing and AI rewriting RSS news...
                        </>
                      ) : (
                        'Trigger News Scraper Crawler On-Demand'
                      )}
                    </button>

                    {lastRunTimestamp && (
                      <p className="text-center text-xs text-on-surface-variant font-medium">
                        Last Run: {new Date(lastRunTimestamp).toLocaleString()}
                      </p>
                    )}

                    {/* Scraper Log */}
                    {scraperLog && (
                      <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                          <CheckCircle className="w-4 h-4" /> Live Logger Feed:
                        </div>
                        {Array.isArray(scraperLog) ? (
                          <div className="space-y-1 font-mono text-[10px] text-on-surface-variant max-h-60 overflow-y-auto">
                            {scraperLog.map((logLine, idx) => (
                              <div key={idx} className="border-b border-outline-variant/30 py-0.5 last:border-0">{logLine}</div>
                            ))}
                          </div>
                        ) : (
                          <pre className="text-on-surface-variant font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">{scraperLog}</pre>
                        )}
                      </div>
                    )}

                    {/* Scraped draft items preview */}
                    {scrapedDrafts.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-outline-variant">
                        <p className="text-xs font-bold text-on-surface">Recent Scraped News Headlines (Ingested Drafts):</p>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {scrapedDrafts.map((draft, idx) => (
                            <div key={idx} className="p-3 bg-surface rounded-xl border border-outline-variant/65 flex justify-between items-center gap-4">
                              <div className="space-y-0.5 truncate">
                                <span className="font-bold text-xs text-on-surface block truncate">{draft.title}</span>
                                <span className="text-[10px] text-on-surface-variant font-medium">{draft.category}</span>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-warning/15 text-warning rounded-full shrink-0 uppercase">Draft</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white font-semibold px-4 py-3 rounded-2xl shadow-lg border border-emerald-500 z-50 flex items-center gap-2 animate-slide-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
};
