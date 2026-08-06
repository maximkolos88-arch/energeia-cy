/**
 * News Feed Repository Layer
 * Interacts with Firestore 'news' collection
 */

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  Timestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { NewsItem, NewsCategory } from '../../models/types';
import { supabase } from '../../lib/supabase';

// High-fidelity fallback/initial seed data with Rich Markdown Content representing Cyprus Energy updates
const SEED_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Revised Net-Billing Framework Published for Public Consultation',
    summary: 'The Cyprus Energy Regulatory Authority has released the draft framework for the updated net-billing photovoltaic model.',
    content: `The **Cyprus Energy Regulatory Authority (CERA)** has officially opened public consultations for the new **Net-Billing Photovoltaic Framework 2026**. This initiative aims to modernize rooftop PV feed-in limits, streamline grid connectivity requests, and introduce dynamic hourly feed-in tariffs.

### Key Regulatory Highlights
- **Feed-in Capacity Upper Cap:** Increased from 4.2kW to **10kW** for residential self-consumers.
- **Hourly Settlement:** Moving from monthly volumetric net-metering to dynamic 15-minute interval settlement.
- **Battery Storage Integration:** Priority connection rights granted to systems paired with approved battery energy storage systems (BESS).

> *"This framework aligns Cyprus with target EU Electricity Market Directive 2019/944, ensuring fairer cost allocation and grid stability."*  
> — **CERA Regulatory Advisory Board**`,
    category: 'Renewables',
    sourceUrl: 'https://www.cera.org.cy/en-gb/home',
    publishedAt: '2 hours ago',
    createdAt: new Date().toISOString(),
    status: 'Published',
    readTimeMinutes: 4
  },
  {
    id: 'news-2',
    title: 'Cronos-2 Offshore Natural Gas Field Appraisal Completed in Block 6',
    summary: 'Eni and TotalEnergies confirm significant gas reserves in Cyprus EEZ Block 6 with high-capacity production test results.',
    content: `## Eastern Mediterranean EEZ Appraisal Results

The operator consortium of **Eni** and **TotalEnergies** has successfully completed appraisal drilling at the **Cronos-2** natural gas discovery site in Block 6, approximately 160 km off the southwestern coast of Cyprus.

### Technical & Commercial Insights
- **Reservoir Flow Capacity:** Confirmed high deliverability exceeding 30 million cubic feet per day (MMSCFD).
- **Synergy Strategy:** Fast-track tie-back options to existing regional infrastructure in Egypt & Mediterranean LNG hubs.
- **Local Power Supply Transition:** Natural gas imports via Vassilikos terminal remain on schedule to convert Cyprus' inland power stations from heavy fuel oil.`,
    category: 'Oil & Gas',
    sourceUrl: 'https://meci.gov.cy',
    publishedAt: '5 hours ago',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    status: 'Published',
    readTimeMinutes: 5
  },
  {
    id: 'news-3',
    title: 'Ministry of Energy Submits 2030 Revised National Energy & Climate Plan',
    summary: 'Cabinet approves updated Cyprus NECP targeting 33% renewable energy share in gross final energy consumption by 2030.',
    content: `## Government Strategic Roadmap

The Council of Ministers has formally endorsed the revised **National Energy and Climate Plan (NECP 2021-2030)** for submission to the European Commission.

### Key National Targets
- **Renewable Energy Share:** Minimum **33%** of gross final energy consumption.
- **Greenhouse Gas Reductions:** **32% reduction** in non-ETS sector emissions compared to 2005 levels.
- **Energy Efficiency:** Mandatory building envelope retrofits for all public administration facilities across Cyprus.`,
    category: 'Government & Policy',
    sourceUrl: 'https://meci.gov.cy',
    publishedAt: '1 day ago',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'Published',
    readTimeMinutes: 4
  },
  {
    id: 'news-4',
    title: 'Great Sea Interconnector Subsea Cables Reach Technical Milestone',
    summary: 'High-voltage direct current (HVDC) subsea survey completed between Cyprus and Crete grid hubs.',
    content: `## Cross-Border Electricity Grid Connectivity

The **Great Sea Interconnector** project has reached a milestone with the completion of full bathymetric subsea cable route surveys.

### Project Impact
- **Capacity:** 1,000 MW HVDC bidirectional line connecting Cyprus to the European electricity market.
- **Energy Isolation Elimination:** Ending Cyprus' status as the last non-interconnected EU member state.`,
    category: 'Grid & Infrastructure',
    sourceUrl: 'https://tsoc.org.cy',
    publishedAt: '2 days ago',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Published',
    readTimeMinutes: 3
  },
  {
    id: 'news-5',
    title: 'Photovoltaics for All Scheme Expansion Announced with €30M Allocation',
    summary: 'Ministry of Energy announces a €30M budget increase for residential PV subsidies and battery retrofits.',
    content: `## Household Clean Energy Funding Injection

The Ministry of Energy, Commerce and Industry (MECI) has unveiled a major expansion of the popular **"Photovoltaics for All"** scheme.

### Financial Breakdown
- **Total Allocation:** €30,000,000
- **Maximum Grant per Unit:** Up to **€1,500** upfront subsidy + zero-interest loan repayment via EAC utility bills.
- **Target Beneficiaries:** Over **6,000 additional households** across Limassol, Nicosia, Larnaca, and Paphos.`,
    category: 'Grants & Subsidies',
    sourceUrl: 'https://meci.gov.cy',
    publishedAt: '3 days ago',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'Published',
    readTimeMinutes: 3
  },
  {
    id: 'news-6',
    title: 'CERA Issues Regulatory Directive No. 18/2026 on Commercial Energy Storage',
    summary: 'Mandatory telemetry protocols and battery storage requirements for utility-scale solar arrays above 150 kW.',
    content: `## CERA Regulatory Mandate

CERA has published Regulatory Directive No. 18/2026 establishing standardized telemetry nodes and operating parameters for grid-tied commercial renewable generators.`,
    category: 'CERA Regulation',
    sourceUrl: 'https://www.cera.org.cy',
    publishedAt: '4 days ago',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'Published',
    readTimeMinutes: 3
  },
  {
    id: 'news-7',
    title: 'Wholesale Electricity Price Trends Q3: Mediterranean Overview',
    summary: 'Average wholesale prices show a 4% decrease compared to Q2, driven by higher renewable penetration across Cyprus.',
    content: `## Mediterranean Energy Market Analysis

According to the latest statistical bulletin from the **Cyprus Transmission System Operator (TSOC)**, renewable energy penetration reached an all-time peak during Q3.`,
    category: 'Energy Market',
    sourceUrl: 'https://tsoc.org.cy',
    publishedAt: '5 days ago',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'Published',
    readTimeMinutes: 5
  }
];

export class NewsRepository {
  private static cleanTitle(title: string): string {
    if (!title) return '';
    let cleaned = title.replace(/\s+-\s+[^-]+$/, '').trim();
    return cleaned.replace(/[.\s]+$/, '').trim();
  }

  private static cleanSummary(summary: string): string {
    if (!summary) return '';
    let cleaned = summary.trim();
    cleaned = cleaned.replace(/[.\s]+$/, '').trim();
    if (cleaned && !/[?!]$/.test(cleaned)) {
      cleaned += '.';
    }
    return cleaned;
  }

  private static mapSupabaseToNewsItem(item: any): NewsItem {
    return {
      id: item.id,
      title: this.cleanTitle(item.title || ''),
      summary: this.cleanSummary(item.summary || ''),
      content: item.content || '',
      category: item.category || 'Uncategorized',
      imageUrl: item.image_url || item.imageUrl || '',
      sourceUrl: item.source_url || '',
      publishedAt: item.published_at || item.created_at || '',
      createdAt: item.created_at || '',
      status: item.status || 'Draft',
      readTimeMinutes: item.read_time_minutes || 3
    };
  }

  /**
   * Fetch all news items (for Admin CRUD, both Published and Drafts)
   */
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => this.mapSupabaseToNewsItem(item));
    } catch (error) {
      console.warn("Failed fetching all news from Supabase, falling back to Express server:", error);
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('API failed');
        const items = await res.json();
        return items.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl || item.image_url || '',
          title: this.cleanTitle(item.title),
          summary: this.cleanSummary(item.summary)
        }));
      } catch (err) {
        return SEED_NEWS.map(item => ({
          ...item,
          imageUrl: item.imageUrl || item.image_url || '',
          title: this.cleanTitle(item.title),
          summary: this.cleanSummary(item.summary)
        }));
      }
    }
  }

  /**
   * Fetch published news items from local API
   * Ordered by publishedAt descending, with category filtering support
   */
  static async getPublishedNews(categoryFilter?: NewsCategory | string): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .or('status.eq.Published,status.eq.PUBLISHED')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const published = (data || []).map(item => this.mapSupabaseToNewsItem(item));
      return this.filterLocalNews(published, categoryFilter);
    } catch (error) {
      console.warn("Failed fetching published news from Supabase, falling back to cached seed news:", error);
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('API failed');
        const allNews: NewsItem[] = await res.json();
        const published = allNews
          .filter(item => item.status?.toUpperCase() === 'PUBLISHED')
          .map(item => ({
            ...item,
            imageUrl: item.imageUrl || item.image_url || '',
            title: this.cleanTitle(item.title),
            summary: this.cleanSummary(item.summary)
          }));
        return this.filterLocalNews(published, categoryFilter);
      } catch (err) {
        return this.filterLocalNews(
          SEED_NEWS
            .filter(item => item.status?.toUpperCase() === 'PUBLISHED')
            .map(item => ({
              ...item,
              imageUrl: item.imageUrl || item.image_url || '',
              title: this.cleanTitle(item.title),
              summary: this.cleanSummary(item.summary)
            })),
          categoryFilter
        );
      }
    }
  }

  /**
   * Create a news item (Admin Panel)
   */
  static async createNewsItem(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          status: item.status,
          image_url: item.imageUrl,
          source_url: item.sourceUrl,
          published_at: item.publishedAt
        }
      ])
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
  }

  /**
   * Update a news item (Admin Panel)
   */
  static async updateNewsItem(id: string, item: Partial<NewsItem>): Promise<NewsItem> {
    const payload: any = {};
    if (item.title !== undefined) payload.title = item.title;
    if (item.summary !== undefined) payload.summary = item.summary;
    if (item.content !== undefined) payload.content = item.content;
    if (item.category !== undefined) payload.category = item.category;
    if (item.status !== undefined) payload.status = item.status;
    if (item.imageUrl !== undefined) payload.image_url = item.imageUrl;
    if (item.sourceUrl !== undefined) payload.source_url = item.sourceUrl;
    if (item.publishedAt !== undefined) payload.published_at = item.publishedAt;

    const { data, error } = await supabase
      .from('news')
      .update(payload)
      .eq('id', id)
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
  }

  /**
   * Delete a news item (Admin Panel)
   */
  static async deleteNewsItem(id: string): Promise<NewsItem> {
    const { data, error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    return this.mapSupabaseToNewsItem(data[0]);
  }

  /**
   * Create a draft news item (used by news aggregator or admin panel)
   */
  static async createDraftNews(item: Omit<NewsItem, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([
          {
            title: item.title,
            summary: item.summary,
            content: item.content,
            category: item.category,
            status: 'Draft',
            image_url: item.imageUrl,
            source_url: item.sourceUrl,
            published_at: item.publishedAt
          }
        ])
        .select();
      if (error) throw error;
      return data[0].id;
    } catch (error) {
      console.warn("Failed creating draft in Supabase, calling Express API:", error);
      try {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, status: 'Draft' })
        });
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        return data.id;
      } catch (err) {
        return 'mock-draft-' + Date.now();
      }
    }
  }

  private static filterLocalNews(items: NewsItem[], categoryFilter?: string): NewsItem[] {
    if (!categoryFilter || categoryFilter === 'All Updates' || categoryFilter === 'All News') {
      return items;
    }
    const filterLower = categoryFilter.toLowerCase();
    return items.filter(item => {
      const catLower = item.category.toLowerCase();

      if (catLower === filterLower) return true;
      if (catLower.includes(filterLower) || filterLower.includes(catLower)) return true;
      
      // Keyword matching
      if (filterLower.includes('renew') || filterLower.includes('solar')) {
        return catLower.includes('renew') || catLower.includes('solar');
      }
      if (filterLower.includes('oil') || filterLower.includes('gas')) {
        return catLower.includes('oil') || catLower.includes('gas');
      }
      if (filterLower.includes('govern') || filterLower.includes('policy')) {
        return catLower.includes('govern') || catLower.includes('policy');
      }
      if (filterLower.includes('grid') || filterLower.includes('eac')) {
        return catLower.includes('grid') || catLower.includes('eac');
      }
      if (filterLower.includes('cera') || filterLower.includes('regula')) {
        return catLower.includes('cera') || catLower.includes('regula');
      }
      if (filterLower.includes('grant') || filterLower.includes('subsidy')) {
        return catLower.includes('grant') || catLower.includes('subsid');
      }
      if (filterLower.includes('market')) {
        return catLower.includes('market');
      }

      return false;
    });
  }
}

