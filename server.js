import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import Parser from 'rss-parser';
import axios from 'axios';
import { GoogleDecoder } from 'google-news-url-decoder';
import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import puppeteer from 'puppeteer';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

const formatDateBackend = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }
  } catch (e) {}
  return dateStr;
};

const cleanTitle = (title) => {
  if (!title) return '';
  let cleaned = title.replace(/\s+-\s+[^-]+$/, '').trim();
  return cleaned.replace(/[.\s]+$/, '').trim();
};

const cleanSummary = (summary) => {
  if (!summary) return '';
  let cleaned = summary.trim().replace(/[.\s]+$/, '').trim();
  if (cleaned && !/[?!]$/.test(cleaned)) {
    cleaned += '.';
  }
  return cleaned;
};

const cleanBoilerplate = (text) => {
  if (!text) return '';
  
  // 1. Remove HTML tags if any (resilient stripping)
  let cleaned = text.replace(/<[^>]+>/g, '');

  // 2. Define case-insensitive regex patterns for typical boilerplate text
  const patterns = [
    /click here to download/gi,
    /follow us on (twitter|facebook|linkedin|instagram|youtube|social)/gi,
    /share this (article|page|story|post) on (twitter|facebook|linkedin|social)/gi,
    /share on (twitter|facebook|linkedin)/gi,
    /sign up for (our|updates|newsletter)/gi,
    /subscribe to (our|updates|newsletter|feed)/gi,
    /all rights reserved/gi,
    /copyright\s*(©|\(c\))?\s*\d{4}.*$/gim,
    /read more at.*$/gim,
    /read more:.*$/gim,
    /related (articles|topics|news|stories):.*$/gim,
    /sponsored content/gi,
    /advertisement/gi,
    /cookie policy|privacy policy|terms of service|terms of use/gi,
    /this website uses cookies.*$/gim,
    /join our telegram channel/gi,
    /about the author.*$/gim,
    /written by.*$/gim,
    /posted by.*$/gim
  ];

  // Apply patterns to remove matching lines or substrings
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // 3. Remove excessive whitespace, empty lines, and redundant separator symbols
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n'); // normalize multiple newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' '); // collapse multiple spaces/tabs
  
  // Remove empty paragraphs/lines
  cleaned = cleaned.split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (line.length === 0) return false;
      if (/^(share|tweet|like|comment|newsletter|subscribe|follow)$/i.test(line)) return false;
      return true;
    })
    .join('\n');

  return cleaned.trim();
};

// Seed Data definition
const SEED_DATA = {
  news: [
    {
      id: 'news-1',
      title: 'Revised Net-Billing Framework Published for Public Consultation',
      summary: 'The Cyprus Energy Regulatory Authority has released the draft framework for the updated net-billing photovoltaic model.',
      content: `## Executive Overview\n\nThe **Cyprus Energy Regulatory Authority (CERA)** has officially opened public consultations for the new **Net-Billing Photovoltaic Framework 2026**. This initiative aims to modernize rooftop PV feed-in limits, streamline grid connectivity requests, and introduce dynamic hourly feed-in tariffs.\n\n### Key Regulatory Highlights\n- **Feed-in Capacity Upper Cap:** Increased from 4.2kW to **10kW** for residential self-consumers.\n- **Hourly Settlement:** Moving from monthly volumetric net-metering to dynamic 15-minute interval settlement.\n- **Battery Storage Integration:** Priority connection rights granted to systems paired with approved battery energy storage systems (BESS).\n\n> *"This framework aligns Cyprus with target EU Electricity Market Directive 2019/944, ensuring fairer cost allocation and grid stability."*  \n> — **CERA Regulatory Advisory Board**`,
      category: 'Renewables',
      sourceUrl: 'https://www.cera.org.cy/en-gb/home',
      publishedAt: '2 hours ago',
      createdAt: new Date().toISOString(),
      status: 'Published',
      readTimeMinutes: 4,
      commentsCount: 2
    },
    {
      id: 'news-2',
      title: 'Cronos-2 Offshore Natural Gas Field Appraisal Completed in Block 6',
      summary: 'Eni and TotalEnergies confirm significant gas reserves in Cyprus EEZ Block 6 with high-capacity production test results.',
      content: `## Eastern Mediterranean EEZ Appraisal Results\n\nThe operator consortium of **Eni** and **TotalEnergies** has successfully completed appraisal drilling at the **Cronos-2** natural gas discovery site in Block 6, approximately 160 km off the southwestern coast of Cyprus.\n\n### Technical & Commercial Insights\n- **Reservoir Flow Capacity:** Confirmed high deliverability exceeding 30 million cubic feet per day (MMSCFD).\n- **Synergy Strategy:** Fast-track tie-back options to existing regional infrastructure in Egypt & Mediterranean LNG hubs.\n- **Local Power Supply Transition:** Natural gas imports via Vassilikos terminal remain on schedule to convert Cyprus' inland power stations from heavy fuel oil.`,
      category: 'Oil & Gas',
      sourceUrl: 'https://meci.gov.cy',
      publishedAt: '5 hours ago',
      createdAt: new Date(Date.now() - 18000000).toISOString(),
      status: 'Published',
      readTimeMinutes: 5,
      commentsCount: 1
    },
    {
      id: 'news-3',
      title: 'Ministry of Energy Submits 2030 Revised National Energy & Climate Plan',
      summary: 'Cabinet approves updated Cyprus NECP targeting 33% renewable energy share in gross final energy consumption by 2030.',
      content: `## Government Strategic Roadmap\n\nThe Council of Ministers has formally endorsed the revised **National Energy and Climate Plan (NECP 2021-2030)** for submission to the European Commission.\n\n### Key National Targets\n- **Renewable Energy Share:** Minimum **33%** of gross final energy consumption.\n- **Greenhouse Gas Reductions:** **32% reduction** in non-ETS sector emissions compared to 2005 levels.\n- **Energy Efficiency:** Mandatory building envelope retrofits for all public administration facilities across Cyprus.`,
      category: 'Government & Policy',
      sourceUrl: 'https://meci.gov.cy',
      publishedAt: '1 day ago',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'Published',
      readTimeMinutes: 4,
      commentsCount: 0
    },
    {
      id: 'news-4',
      title: 'Great Sea Interconnector Subsea Cables Reach Technical Milestone',
      summary: 'High-voltage direct current (HVDC) subsea survey completed between Cyprus and Crete grid hubs.',
      content: `## Cross-Border Electricity Grid Connectivity\n\nThe **Great Sea Interconnector** project has reached a milestone with the completion of full bathymetric subsea cable route surveys.\n\n### Project Impact\n- **Capacity:** 1,000 MW HVDC bidirectional line connecting Cyprus to the European electricity market.\n- **Energy Isolation Elimination:** Ending Cyprus' status as the last non-interconnected EU member state.`,
      category: 'Grid & Infrastructure',
      sourceUrl: 'https://tsoc.org.cy',
      publishedAt: '2 days ago',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'Published',
      readTimeMinutes: 3,
      commentsCount: 0
    },
    {
      id: 'news-5',
      title: 'Photovoltaics for All Scheme Expansion Announced with €30M Allocation',
      summary: 'Ministry of Energy announces a €30M budget increase for residential PV subsidies and battery retrofits.',
      content: `## Household Clean Energy Funding Injection\n\nThe Ministry of Energy, Commerce and Industry (MECI) has unveiled a major expansion of the popular **"Photovoltaics for All"** scheme.\n\n### Financial Breakdown\n- **Total Allocation:** €30,000,000\n- **Maximum Grant per Unit:** Up to **€1,500** upfront subsidy + zero-interest loan repayment via EAC utility bills.\n- **Target Beneficiaries:** Over **6,000 additional households** across Limassol, Nicosia, Larnaca, and Paphos.`,
      category: 'Grants & Subsidies',
      sourceUrl: 'https://meci.gov.cy',
      publishedAt: '3 days ago',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'Published',
      readTimeMinutes: 3,
      commentsCount: 0
    }
  ],
  participants: [
    {
      id: 'member-1',
      name: 'Elena Vasiliou',
      type: 'Individual',
      roleOrCategory: 'Independent Energy & ESG Auditor',
      email: 'elena.vasiliou@energeia.cy',
      phone: '+357 99 123456',
      location: 'Nicosia',
      category: 'Professional Services',
      expertiseTags: ['ESG Auditors', 'ESG', 'Policy', 'Energy Efficiency', 'Individuals'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtdU_pDIVMIMs3jGXRG5Xd4kzByVAdYcOYt40VlE9dJFiQk_cDtChYsTcqBGNdpBnUjMq5FCQ8_EXTqaupV74Jo0MkITWRvqthgS7bosXHk4HnB0IGPqfueUayRglXCWJ5WahqohB2YmlcElxg1jP1QCMw8xnZ_vJ27gpo8ByKlOTLt82aPlrF7Cg7QqZ2TzXT77eVx8KPZ59Y2LzIO_CDaMgQguK4REiFJ9FSXox-QbEmaNthEvKEuA',
      description: 'Certified European Energy Manager & Senior ESG Consultant for commercial PV and policy compliance.',
      isVerified: true,
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtdU_pDIVMIMs3jGXRG5Xd4kzByVAdYcOYt40VlE9dJFiQk_cDtChYsTcqBGNdpBnUjMq5FCQ8_EXTqaupV74Jo0MkITWRvqthgS7bosXHk4HnB0IGPqfueUayRglXCWJ5WahqohB2YmlcElxg1jP1QCMw8xnZ_vJ27gpo8ByKlOTLt82aPlrF7Cg7QqZ2TzXT77eVx8KPZ59Y2LzIO_CDaMgQguK4REiFJ9FSXox-QbEmaNthEvKEuA',
      website: 'https://energeia.cy',
      linkedin: 'https://linkedin.com/in/elena-vasiliou',
      keyContactName: 'Elena Vasiliou',
      showDescription: true,
      showLocation: true,
      showWebsite: true,
      showLinkedin: true,
      showEmail: true,
      showPhone: true,
      showKeyContact: true,
      keyServices: ['ESG Auditing', 'CSRD Compliance', 'Energy Efficiency Auditing'],
      notableProjects: 'Nicosia Commercial PV Audit 2025',
      certifications: 'Certified European Energy Manager, ESG Auditor CY-2024',
      showKeyServices: true,
      showNotableProjects: true,
      showCertifications: true
    },
    {
      id: 'member-2',
      name: 'Helios Dynamics Ltd',
      type: 'Company',
      roleOrCategory: 'Solar & Battery Storage Contractor',
      email: 'contact@heliosdynamics.com.cy',
      phone: '+357 25 876543',
      location: 'Limassol',
      category: 'Renewables',
      expertiseTags: ['Solar Installers', 'Solar', 'Storage', 'Wind', 'Companies'],
      imageUrl: '',
      description: 'Premier turnkey solar photovoltaics installation, wind energy integration, and industrial storage contractor in Cyprus.',
      isVerified: true,
      logoUrl: '',
      website: 'https://heliosdynamics.com.cy',
      linkedin: 'https://linkedin.com/company/helios-dynamics-cy',
      keyContactName: 'Marios Demetriou',
      showDescription: true,
      showLocation: true,
      showWebsite: true,
      showLinkedin: true,
      showEmail: true,
      showPhone: true,
      showKeyContact: true,
      keyServices: ['Turnkey PV Installation', 'Wind Integration', 'Industrial Batteries'],
      notableProjects: 'Limassol Port Solar Array 2.4MW',
      certifications: 'ISO 9001, OHSAS 18001, MECI Solar Contractor',
      showKeyServices: true,
      showNotableProjects: true,
      showCertifications: true
    },
    {
      id: 'member-3',
      name: 'Andreas Kyriakou',
      type: 'Individual',
      roleOrCategory: 'Grid & Microgrid Specialist',
      email: 'andreas.k@energeia.cy',
      phone: '+357 99 334455',
      location: 'Larnaca',
      category: 'Engineering & EPC',
      expertiseTags: ['Grid', 'Storage', 'EV Charging', 'Microgrids', 'Individuals'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2TyQev0dIPG45d2E4DOVj3skqHeOnipirzYXfH7wejZJ1dvLCtzU2-R1CtB8TaFVw4fDCPj6xkGEfZRtoqTBHBrSIZVdqJCspiXheu16m2S3Pkmp0cmlZeXJFRY2mjwz1uVYcWeNTP7lCqaic8BZoZbH1T4c3qSIeYyS4DBkew16Xl9sk0_R8SrIZcAnPVw_CFWTqoSOBcJO5Brf5z_ltLF5p51kPNR2hXQ783kouFLGvdegrEy_Pew',
      description: 'Electrical engineer specializing in transmission grid connection protocols, storage synchronization, and EV hubs.',
      isVerified: true,
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2TyQev0dIPG45d2E4DOVj3skqHeOnipirzYXfH7wejZJ1dvLCtzU2-R1CtB8TaFVw4fDCPj6xkGEfZRtoqTBHBrSIZVdqJCspiXheu16m2S3Pkmp0cmlZeXJFRY2mjwz1uVYcWeNTP7lCqaic8BZoZbH1T4c3qSIeYyS4DBkew16Xl9sk0_R8SrIZcAnPVw_CFWTqoSOBcJO5Brf5z_ltLF5p51kPNR2hXQ783kouFLGvdegrEy_Pew',
      website: 'https://energeia.cy',
      linkedin: 'https://linkedin.com/in/andreas-kyriakou',
      keyContactName: 'Andreas Kyriakou',
      showDescription: true,
      showLocation: true,
      showWebsite: true,
      showLinkedin: true,
      showEmail: true,
      showPhone: true,
      showKeyContact: true,
      keyServices: ['Grid Interconnection', 'Storage Synchronization', 'EV Hub Design'],
      notableProjects: 'Larnaca EV Hub Integration',
      certifications: 'IEEE Member, Licensed Grid Engineer',
      showKeyServices: true,
      showNotableProjects: true,
      showCertifications: true
    },
    {
      id: 'member-4',
      name: 'EcoAudit Partners',
      type: 'Company',
      roleOrCategory: 'ESG Advisory & Sustainability Agency',
      email: 'info@ecoauditpartners.cy',
      phone: '+357 22 554433',
      location: 'Nicosia',
      category: 'Professional Services',
      expertiseTags: ['ESG Auditors', 'ESG', 'Policy', 'Energy Efficiency', 'Companies'],
      imageUrl: '',
      description: 'Institutional ESG reporting, GHG emissions auditing, EU taxonomy advisory, and CSRD compliance advisory firm.',
      isVerified: true,
      logoUrl: '',
      website: 'https://ecoauditpartners.cy',
      linkedin: 'https://linkedin.com/company/ecoaudit-partners',
      keyContactName: 'Elena Georgiou',
      showDescription: true,
      showLocation: true,
      showWebsite: true,
      showLinkedin: true,
      showEmail: true,
      showPhone: true,
      showKeyContact: true,
      keyServices: ['CSRD Advising', 'GHG Emissions Audits', 'EU Taxonomy Advisory'],
      notableProjects: 'Cyprus Telecom CSRD Transition',
      certifications: 'Licensed CSRD Consultant',
      showKeyServices: true,
      showNotableProjects: true,
      showCertifications: true
    },
    {
      id: 'member-5',
      name: 'Kypros Wind Power Ltd',
      type: 'Company',
      roleOrCategory: 'Wind Farm Operator',
      email: 'operations@kypros-wind.cy',
      phone: '+357 26 910200',
      location: 'Paphos',
      category: 'Renewables',
      expertiseTags: ['Wind', 'Storage', 'Policy', 'Companies'],
      imageUrl: '',
      description: 'Commercial onshore wind turbine array developer and grid balancing market provider.',
      isVerified: true,
      logoUrl: '',
      website: 'https://kypros-wind.cy',
      linkedin: 'https://linkedin.com/company/kypros-wind',
      keyContactName: 'Yiannis Christou',
      showDescription: true,
      showLocation: true,
      showWebsite: true,
      showLinkedin: true,
      showEmail: true,
      showPhone: true,
      showKeyContact: true,
      keyServices: ['Onshore Wind Operations', 'Grid Balancing', 'Battery Balancing'],
      notableProjects: 'Paphos Wind Array Expansion 15MW',
      certifications: 'MECI Wind Farm Operator License',
      showKeyServices: true,
      showNotableProjects: true,
      showCertifications: true
    }
  ],
  magazines: [
    {
      id: 'issue-1',
      title: 'Summer 2026',
      issueNumber: 1,
      publishDate: '2026-07-01',
      coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Exclusive interview with the Minister of Energy, special focus on East Med gas exploration, and solar battery storage incentives.',
      isPublished: true
    }
  ],
  courses: [
    {
      id: 'course-1',
      title: 'Solar Grid Integration Basics',
      description: 'Learn the fundamental electrical and engineering principles to synchronize utility-scale photovoltaics with high-voltage distribution networks.',
      price: 149,
      duration: '8 Weeks',
      level: 'Beginner',
      imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600',
      checkoutUrl: 'https://checkout.stripe.com/pay/dummy_solar_basics',
      isPublished: true
    },
    {
      id: 'course-2',
      title: 'Cyprus Energy Market Regulations',
      description: 'A comprehensive legal and commercial deep dive into CERA regulatory frameworks, bilateral contract models, and open market transition protocols.',
      price: 299,
      duration: '12 Weeks',
      level: 'Advanced',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
      checkoutUrl: 'https://checkout.stripe.com/pay/dummy_cyprus_regs',
      isPublished: true
    },
    {
      id: 'course-3',
      title: 'Industrial Battery Storage & Peak Shaving',
      description: 'Design and deploy large-scale Lithium-iron phosphate battery setups for power quality control, backup systems, and microgrid leveling.',
      price: 249,
      duration: '6 Weeks',
      level: 'Intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
      checkoutUrl: 'https://checkout.stripe.com/pay/dummy_battery_storage',
      isPublished: true
    },
    {
      id: 'course-4',
      title: 'ESG Auditing & Reporting Compliance',
      description: 'Prepare your enterprise for CSRD and EU taxonomy compliance. Learn metrics mapping, GHG protocol calculation, and verification drafting.',
      price: 199,
      duration: '4 Weeks',
      level: 'Beginner',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
      checkoutUrl: 'https://checkout.stripe.com/pay/dummy_esg_compliance',
      isPublished: true
    }
  ]
};

// Database helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const cleanSeed = {
        ...SEED_DATA,
        news: SEED_DATA.news.map(item => ({
          ...item,
          imageUrl: item.imageUrl || item.image_url || '',
          title: cleanTitle(item.title),
          summary: cleanSummary(item.summary)
        }))
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(cleanSeed, null, 2), 'utf8');
      return cleanSeed;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const dbData = JSON.parse(raw);
    let updated = false;
    if (!dbData.courses) {
      dbData.courses = SEED_DATA.courses;
      updated = true;
    }
    if (!dbData.magazines) {
      dbData.magazines = SEED_DATA.magazines;
      updated = true;
    }
    if (dbData.news && Array.isArray(dbData.news)) {
      dbData.news = dbData.news.map(item => ({
        ...item,
        imageUrl: item.imageUrl || item.image_url || '',
        title: cleanTitle(item.title),
        summary: cleanSummary(item.summary)
      }));
    }
    if (updated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
    }
    return dbData;
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      ...SEED_DATA,
      news: SEED_DATA.news.map(item => ({
        ...item,
        imageUrl: item.imageUrl || item.image_url || '',
        title: cleanTitle(item.title),
        summary: cleanSummary(item.summary)
      }))
    };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Intelligent News Aggregator Agent: RSS Fetching, Content Scraping, and LLM Rewriting
async function triggerRssAggregator() {
  const rssUrl = 'https://news.google.com/rss/search?q=cyprus%20energy&hl=en-GB&gl=GB&ceid=GB%3Aen';
  const drafts = [];
  const logs = [];
  
  let browser;
  try {
    console.log(`[Aggregator Worker] Fetching RSS Feed from Google News...`);
    const parser = new Parser({
      headers: { 'User-Agent': 'Energeia-Aggregator-Bot/1.0' }
    });
    const feed = await parser.parseURL(rssUrl);
    console.log(`[Aggregator Worker] Parsed ${feed.items ? feed.items.length : 0} items.`);

    const dbData = readDb();
    const decoder = new GoogleDecoder();

    // Limit initial items to process to the first 10
    const itemsToProcess = (feed.items || []).slice(0, 10);
    if (itemsToProcess.length === 0) {
      console.log('[Aggregator Worker] No new articles found.');
      return { success: true, insertedCount: 0, drafts: [], logs };
    }

    const recentArticles = [...dbData.news]
      .sort((a, b) => new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime())
      .slice(0, 20);
    const recentTitles = recentArticles.map(a => a.title);
    let titlesString = recentTitles.length > 0 ? recentTitles.join(' | ') : 'No recent articles exist yet.';

    console.log(`[Aggregator Worker] Processing ${itemsToProcess.length} new articles sequentially...`);
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    // STRICT SEQUENTIAL LOOP
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      console.log(`\n[${i + 1}/${itemsToProcess.length}] Processing: ${item.title}`);

      // 1. STRICT 2-SECOND DELAY (CRITICAL FOR RATE LIMITS)
      console.log('Waiting 2 seconds to respect Gemini & Google News limits...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        let targetUrl = item.link;
        try {
          const decodedResult = await decoder.decode(item.link);
          if (decodedResult.status && decodedResult.decoded_url) {
            targetUrl = decodedResult.decoded_url;
          }
        } catch (decErr) {
          console.warn(`[Aggregator Worker] Failed to decode URL: ${decErr.message}`);
        }

        const alreadyExists = dbData.news.some(existing => existing.sourceUrl === targetUrl);
        if (alreadyExists) {
          const skipMsg = `Skipped: URL already exists for ${item.title}`;
          console.log(skipMsg);
          logs.push(skipMsg);
          continue;
        }

        console.log(`[Aggregator Worker] Scraping: ${targetUrl}`);
        let articleText = '';
        let imageUrl = '';
        
        const page = await browser.newPage();
        try {
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          
          try {
            await page.setCookie({
              name: 'CONSENT',
              value: 'YES+cb.20220228-17-p0.en+FX+999',
              domain: '.google.com',
              path: '/'
            });
          } catch (cookieErr) {
            console.warn('[Scraper] Failed to set consent cookie:', cookieErr.message);
          }

          // 2. NAVIGATION & EXTRACTION WITH SEO FALLBACK
          await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

          // 1. GDPR Consent Bypass
          if (page.url().includes('consent.google.com') || await page.evaluate(() => document.body.innerText.includes('consent') || document.body.innerText.includes('согласие'))) {
            console.log('Bypassing GDPR consent for:', targetUrl);
            try {
              await page.evaluate(() => {
                const forms = document.querySelectorAll('form');
                for (const form of forms) {
                  if (form.action.includes('consent')) {
                    form.submit();
                    return;
                  }
                }
              });
              await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
            } catch (error) {
              console.log('Consent bypass error:', error.message);
            }
          }

          // 2. Redirect Notice Bypass
          let isRedirectNotice = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.includes('Переадресация') || text.includes('Redirect') || text.includes('перенаправить') || text.includes('переадресации');
          });

          if (isRedirectNotice) {
            console.log('[Scraper] Redirect notice page detected. Extracting destination URL...');
            try {
              const destinationUrl = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                const targetLink = links.find(l => {
                  if (!l.href) return false;
                  if (l.href.includes('google.com/url?q=')) return true;
                  return !l.href.includes('google.com') && l.href.length > 15;
                });
                if (targetLink) {
                  if (targetLink.href.includes('google.com/url?q=')) {
                    try {
                      const urlObj = new URL(targetLink.href);
                      const qParam = urlObj.searchParams.get('q');
                      if (qParam) return qParam;
                    } catch (e) {}
                  }
                  return targetLink.href;
                }
                return '';
              });
              if (destinationUrl) {
                console.log('[Scraper] Direct navigating to destination URL:', destinationUrl);
                await page.goto(destinationUrl, { waitUntil: 'networkidle2', timeout: 60000 });
              }
            } catch (err) {
              console.warn('[Scraper] Failed to bypass redirect notice:', err.message);
            }
          }

          // 3. Multi-Redirect Loop
          let redirectAttempts = 0;
          while (page.url().includes('google.com') && redirectAttempts < 3) {
            console.log(`[Scraper] Page is at Google URL: ${page.url()}. Waiting for redirect...`);
            try {
              await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 });
            } catch (navErr) {
              try {
                await page.waitForFunction(() => !window.location.hostname.includes('google.com'), { timeout: 5000 });
              } catch (e) {
                await new Promise(r => setTimeout(r, 2000));
              }
            }
            redirectAttempts++;
          }

          targetUrl = page.url();

          // Wait 6 seconds for modern SPA/React sites to render
          await new Promise(r => setTimeout(r, 6000));
          console.log('Final landed URL:', await page.url());

          // Extract content and image directly
          const extractedText = await page.evaluate(() => {
            let extracted = "";
            const article = document.querySelector('article, main, [role="main"]');
            if (article && article.innerText.trim().length > 200) {
              extracted = article.innerText.trim();
            } else {
              extracted = document.body.innerText.trim();
            }
            // SEO Fallback for Paywalls
            if (extracted.length < 150) {
              const ogDesc = document.querySelector('meta[property="og:description"]')?.content || "";
              const metaDesc = document.querySelector('meta[name="description"]')?.content || "";
              extracted = ogDesc || metaDesc;
            }

            const ogImg = document.querySelector('meta[property="og:image"]');
            return {
              text: extracted || '',
              imageUrl: ogImg ? ogImg.getAttribute('content') : ''
            };
          });

          articleText = cleanBoilerplate(extractedText.text);
          if (extractedText.imageUrl) {
            imageUrl = extractedText.imageUrl;
          }
        } finally {
          await page.close();
        }

        let safeText = articleText.substring(0, 4000).replace(/\s+/g, ' ').trim();
        console.log('Extracted text for ' + targetUrl + ':', safeText.substring(0, 200));

        if (safeText.length < 50) {
          console.log(`Extracted text too short (${safeText.length} chars). Falling back to RSS feed snippet.`);
          const fallbackText = item.contentSnippet || item.content || item.title || "";
          safeText = cleanBoilerplate(fallbackText).substring(0, 4000).replace(/\s+/g, ' ').trim();
        }

        if (safeText.length < 50) {
          const reason = `Skipped: Empty article text extracted for ${item.title}`;
          console.log(reason);
          logs.push(reason);
          continue;
        }

        // 3. GEMINI API CALL WITH CONTEXT INJECTION
        const promptText = `You are an expert news editor for a Cyprus Energy publication.

Original Headline: "${item.title}"
Scraped Text: "${safeText}"

Task 1 (Deduplication): Compare the provided article against these recently published titles: ${titlesString}. If the core event or news announcement is the same, return category 'DUPLICATE'.

Task 2: Write a 2-3 paragraph news summary. 
CRITICAL: If the "Scraped Text" is just a paywall notice, cookie banner, or very short, DO NOT mark it as IRRELEVANT. Instead, use the "Original Headline" and whatever context is available in the text to write a short, professional news brief about Cyprus energy.

JSON Schema requirements:
- "title": A clean, engaging headline.
- "content": The news summary (use \\n\\n for paragraphs, NO HTML tags).
- "category": Choose exactly ONE: 'Renewables', 'Oil & Gas', 'Government & Policy', 'Grid & Infrastructure', 'Grants & Subsidies', 'CERA Regulation', 'Energy Market', 'DUPLICATE', or 'IRRELEVANT'.
- ONLY output 'IRRELEVANT' for the category if the Original Headline has absolutely nothing to do with energy or Cyprus.

CRITICAL: You MUST output ONLY valid JSON. Do not include any markdown formatting, conversational text, or explanations outside the JSON object. Your output must strictly follow this schema:
{
  "category": "(You MUST choose EXACTLY ONE of the following values: 'Renewables', 'Oil & Gas', 'Government & Policy', 'Grid & Infrastructure', 'Grants & Subsidies', 'CERA Regulation', 'Energy Market', 'DUPLICATE', or 'IRRELEVANT')",
  "title": "(Your new engaging headline)",
  "content": "(Your rewritten 2 to 3 paragraph article in clean text. Use double newlines \\n\\n to separate paragraphs. DO NOT use HTML tags.)"
}`;

        let rawText = '';
        if (process.env.GEMINI_API_KEY) {
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

          let result = null;
          let attempts = 0;
          while (!result && attempts < 3) {
            try {
              attempts++;
              result = await model.generateContent(promptText);
              const response = await result.response;
              rawText = response.text();
            } catch (err) {
              if ((err.status === 429 || (err.message && err.message.includes('429'))) && attempts < 3) {
                console.log(`Rate limited (429). Waiting 5s before retry attempt ${attempts + 1}...`);
                await new Promise(r => setTimeout(r, 5000));
              } else {
                throw err;
              }
            }
          }

          if (!rawText || !rawText.trim()) {
            const reason = `Skipped: AI Generation failed for ${item.title}`;
            console.log(reason);
            logs.push(reason);
            continue;
          }

          let aiResult;
          try {
            rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            aiResult = JSON.parse(rawText);
          } catch (parseError) {
            const reason = `Skipped: JSON Parse failed for ${targetUrl} (AI returned invalid format)`;
            console.log(reason);
            logs.push(reason);
            continue;
          }

          if (aiResult.category === 'IRRELEVANT' || aiResult.category === 'DUPLICATE') {
            const reason = `Skipped: AI marked as ${aiResult.category}: ${aiResult.title}`;
            console.log(reason);
            logs.push(reason);
            continue;
          }

          let rewrittenCategory = aiResult.category || "Uncategorized";
          let normalizedCategory = rewrittenCategory;
          if (normalizedCategory === 'Oil and Gas') normalizedCategory = 'Oil & Gas';
          if (normalizedCategory === 'Government and Policy') normalizedCategory = 'Government & Policy';
          if (normalizedCategory === 'Grants and Subsidies') normalizedCategory = 'Grants & Subsidies';
          if (normalizedCategory === 'Grid and Infrastructure') normalizedCategory = 'Grid & Infrastructure';
          if (normalizedCategory === 'CERA Regulations') normalizedCategory = 'CERA Regulation';

          const allowedCategories = [
            'Renewables', 'Oil & Gas', 'Government & Policy', 
            'Grid & Infrastructure', 'Grants & Subsidies', 
            'CERA Regulation', 'Energy Market'
          ];
          if (!allowedCategories.includes(normalizedCategory)) {
            normalizedCategory = 'Uncategorized';
          }

          const cleanTitleVal = cleanTitle(aiResult.title || item.title);
          const cleanSummaryVal = cleanSummary(aiResult.summary || item.title.split(' - ')[0]);

          const newEntry = {
            id: 'news-rss-' + Math.random().toString(36).substring(2, 9),
            title: cleanTitleVal,
            summary: cleanSummaryVal,
            content: aiResult.content || '',
            category: normalizedCategory,
            imageUrl: imageUrl,
            sourceUrl: targetUrl,
            publishedAt: formatDateBackend(new Date().toISOString()),
            createdAt: new Date().toISOString(),
            status: 'DRAFT',
            readTimeMinutes: Math.ceil((aiResult.content || '').split(' ').length / 200) || 3,
            commentsCount: 0
          };

          drafts.push(newEntry);
          logs.push(`Success: Saved article: ${cleanTitle}`);
          console.log('Success: Saved article:', cleanTitle);

          // Real-Time Duplicate Memory
          recentTitles.push(cleanTitle);
          titlesString = recentTitles.length > 0 ? recentTitles.join(' | ') : 'No recent articles exist yet.';
        } else {
          console.warn(`[Aggregator Worker] GEMINI_API_KEY is not configured, skipping AI rewrite.`);
        }

        console.log(`Successfully processed: ${item.title}`);
      } catch (error) {
        console.error(`Failed to process ${item.title}:`, error.message);
        logs.push(`Failed to process ${item.title}: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('[Aggregator Worker Failure] news aggregator worker failed:', err);
    return { success: false, insertedCount: 0, drafts: [], error: err.message, logs };
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  if (drafts.length > 0) {
    const updatedDbData = readDb();
    updatedDbData.news.unshift(...drafts);
    writeDb(updatedDbData);
    console.log(`[Aggregator Worker] Successfully saved ${drafts.length} new draft entries.`);
  }

  return { success: true, insertedCount: drafts.length, drafts, logs };
}

// REST API Endpoints

// Scraper Trigger
// Scraper Trigger
global.isCrawlerRunning = false;
global.lastCrawlerRun = null;
global.lastCrawlerResult = null;

app.post('/api/scraper/trigger', (req, res) => {
  try {
    if (global.isCrawlerRunning) {
      return res.json({ success: true, message: 'Crawler is already running' });
    }

    global.isCrawlerRunning = true;
    console.log('[Scraper Manual Trigger] Starting news crawler in background...');

    triggerRssAggregator()
      .then((result) => {
        global.isCrawlerRunning = false;
        global.lastCrawlerResult = result;
        global.lastCrawlerRun = new Date().toISOString();
        console.log(`[Scraper Manual Trigger] Crawler finished. Inserted drafts: ${result.insertedCount}`);
      })
      .catch(err => {
        global.isCrawlerRunning = false;
        console.error('[Scraper Manual Trigger] Crawler background run failed:', err);
      });

    res.json({ success: true, message: 'Crawler started in background' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scraper/status', (req, res) => {
  res.json({
    running: global.isCrawlerRunning || false,
    lastRun: global.lastCrawlerRun || null,
    lastResult: global.lastCrawlerResult || null
  });
});

// News Scraper API skeleton
app.get('/api/run-scraper', async (req, res) => {
  try {
    const result = await triggerRssAggregator();
    return res.status(200).json({
      insertedCount: result.insertedCount,
      logs: result.logs
    });
  } catch (error) {
    console.error('[Scraper API Core Failure] Error:', error);
    return res.status(500).json({
      error: error.message,
      logs: []
    });
  }
});

// NEWS CRUD
// AI TEXT SUMMARIZATION ENDPOINT
app.post('/api/ai/summarize', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const prompt = `You are an expert news editor. Read the following article body and write a concise, punchy 1-2 sentence summary (about 15-25 words) that clearly captures the core essence of the news piece. Do not include any intro, outro, or conversational filler. Return ONLY the summary.

Article Body:
"${content}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text().trim();
    res.json({ summary: summaryText });
  } catch (err) {
    console.error('[AI Summarize Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

// IMAGE PROXY ENDPOINT
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required');

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    // Pipe the response headers and stream data
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    response.data.pipe(res);
  } catch (err) {
    console.error('[Image Proxy Error]:', err.message);
    res.status(500).send('Error proxying image');
  }
});

app.get('/api/news', (req, res) => {
  const dbData = readDb();
  const sortedNews = [...dbData.news].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });
  res.json(sortedNews);
});

// SMART FETCH SINGLE ARTICLE VIA PUPPETEER AND GEMINI
app.post('/api/crawler/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let browser;
  try {
    let targetUrl = url;
    if (url.includes('news.google.com')) {
      try {
        console.log('[Smart Fetch] Google News URL detected. Decoding...');
        const decoder = new GoogleDecoder();
        const decodedResult = await decoder.decode(url);
        if (decodedResult.status && decodedResult.decoded_url) {
          console.log(`[Smart Fetch] Successfully decoded Google News redirect URL to: ${decodedResult.decoded_url}`);
          targetUrl = decodedResult.decoded_url;
        } else {
          console.warn('[Smart Fetch] Google News URL decoding failed:', decodedResult.message);
        }
      } catch (decodeErr) {
        console.error('[Smart Fetch] Google News decoding exception:', decodeErr.message);
      }
    }

    console.log(`[Smart Fetch] Scraping URL: ${targetUrl}`);
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Follow redirect
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 4000));

    let html = await page.content();
    let finalLandedUrl = page.url();

    let dom = new JSDOM(html, { url: finalLandedUrl });
    let document = dom.window.document;

    // Handle HTML meta-refresh redirect manually if present
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
      const contentAttr = metaRefresh.getAttribute('content');
      const urlMatch = contentAttr?.match(/url=(.+)/i);
      if (urlMatch && urlMatch[1]) {
        let redirectUrl = urlMatch[1].trim();
        if (redirectUrl.startsWith("'") || redirectUrl.startsWith('"')) {
          redirectUrl = redirectUrl.slice(1, -1);
        }
        const absoluteRedirectUrl = new URL(redirectUrl, finalLandedUrl).toString();
        console.log(`[Smart Fetch] Meta refresh redirect detected to: ${absoluteRedirectUrl}. Re-navigating page...`);
        
        await page.goto(absoluteRedirectUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(r => setTimeout(r, 4000));
        
        html = await page.content();
        finalLandedUrl = page.url();
        dom = new JSDOM(html, { url: finalLandedUrl });
        document = dom.window.document;
      }
    }

    await browser.close();
    browser = null;

    // Remove cookie/consent elements, scripts, styles
    const selectorsToRemove = [
      '[class*="cookie" i]', '[id*="cookie" i]',
      '[class*="consent" i]', '[id*="consent" i]',
      '[class*="banner" i]', '[id*="banner" i]',
      '[class*="popup" i]', '[id*="popup" i]',
      '[class*="overlay" i]', '[id*="overlay" i]',
      'nav', 'header', 'footer', 'noscript', 'script', 'style'
    ];
    selectorsToRemove.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => el.remove());
      } catch (e) {}
    });

    // Parse readability
    const reader = new Readability(document);
    const article = reader.parse();

    const cleanTitle = (article?.title || document.title || '').trim();
    let cleanContent = (article?.textContent || '').trim();

    // Fallback: If Readability returns empty string or very short text, try aggressive CSS selectors
    if (cleanContent.length < 200) {
      console.log('[Smart Fetch] Readability content is too short. Trying aggressive fallback CSS selectors...');
      const fallbackSelectors = [
        '[itemprop="articleBody"]',
        '.article-content',
        '.c-article-content',
        '.js-article-content',
        'article',
        'main article',
        'main',
        '#main-content',
        '.main-content'
      ];
      
      let foundContainer = null;
      for (const selector of fallbackSelectors) {
        const container = document.querySelector(selector);
        if (container) {
          const paragraphs = container.querySelectorAll('p');
          if (paragraphs.length > 0) {
            foundContainer = container;
            break;
          }
        }
      }

      if (foundContainer) {
        cleanContent = Array.from(foundContainer.querySelectorAll('p'))
          .map(p => p.textContent?.trim())
          .filter(Boolean)
          .join('\n\n');
      }

      // Ultimate Brute-force Fallback if content is still empty or extremely short
      if (cleanContent.length < 200) {
        console.log('[Smart Fetch] Standard extraction yielded empty or short content. Running brute-force paragraph extraction...');
        cleanContent = Array.from(document.querySelectorAll('p'))
          .map(p => p.textContent?.trim())
          .filter(Boolean)
          .filter(text => text.length >= 80)
          .join('\n\n');
      }
    }

    cleanContent = cleanBoilerplate(cleanContent);

    // Extract image
    const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                  document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
                  '';

    // Extract description/summary
    let description = (article?.excerpt || '').trim();
    if (!description || description.toLowerCase() === cleanTitle.toLowerCase()) {
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const twitterDesc = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
      description = (ogDesc || metaDesc || twitterDesc || '').trim();
    }

    // Fallback to first paragraph if missing or identical to title
    if (!description || description.toLowerCase() === cleanTitle.toLowerCase()) {
      const firstParagraph = document.querySelector('p')?.textContent?.trim() || '';
      description = firstParagraph || article?.excerpt || '';
    }

    // Strict check: if still identical to title, select another paragraph
    if (description.toLowerCase() === cleanTitle.toLowerCase()) {
      const pTags = Array.from(document.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(Boolean);
      description = pTags.find(p => p.toLowerCase() !== cleanTitle.toLowerCase()) || '';
    }

    // Use Gemini to generate a professional summary and category classification for the article "content" if key is set
    let finalContent = cleanContent;
    let aiCategory = 'Uncategorized';
    if (process.env.GEMINI_API_KEY && cleanContent.length > 50) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        
        const promptText = `You are an expert news editor for a Cyprus Energy publication.

Original URL Content: "${cleanContent.substring(0, 8000).replace(/\s+/g, ' ')}"

Task 1: Write a 2-3 paragraph professional news summary.
Task 2: Classify the article into one of the allowed categories: 'Renewables', 'Oil & Gas', 'Government & Policy', 'Grid & Infrastructure', 'Grants & Subsidies', 'CERA Regulation', or 'Energy Market'. 
If the article's topic does not fit cleanly into any of these, set the category to 'Uncategorized'.

JSON Schema requirements:
- "title": A clean, engaging headline.
- "content": A 2-3 paragraph professional news summary (use \\n\\n for paragraphs, NO HTML tags).
- "category": Choose exactly ONE: 'Renewables', 'Oil & Gas', 'Government & Policy', 'Grid & Infrastructure', 'Grants & Subsidies', 'CERA Regulation', 'Energy Market', or 'Uncategorized'.

Your output must follow this schema:
{
  "title": "(Your engaging headline)",
  "content": "(Your news summary)",
  "category": "(Your classified category)"
}`;
        const result = await model.generateContent(promptText);
        const response = await result.response;
        let rawText = response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        const aiResult = JSON.parse(rawText);
        
        if (aiResult.content) finalContent = aiResult.content;
        if (aiResult.category) aiCategory = aiResult.category;
      } catch (geminiErr) {
        console.warn('[Smart Fetch] Gemini parsing failed, returning clean content directly:', geminiErr.message);
      }
    }

    let normalizedCategory = aiCategory;
    if (normalizedCategory === 'Oil and Gas') normalizedCategory = 'Oil & Gas';
    if (normalizedCategory === 'Government and Policy') normalizedCategory = 'Government & Policy';
    if (normalizedCategory === 'Grants and Subsidies') normalizedCategory = 'Grants & Subsidies';
    if (normalizedCategory === 'Grid and Infrastructure') normalizedCategory = 'Grid & Infrastructure';
    if (normalizedCategory === 'CERA Regulations') normalizedCategory = 'CERA Regulation';

    const allowedCategories = [
      'Renewables', 'Oil & Gas', 'Government & Policy', 
      'Grid & Infrastructure', 'Grants & Subsidies', 
      'CERA Regulation', 'Energy Market'
    ];
    if (!allowedCategories.includes(normalizedCategory)) {
      normalizedCategory = 'Uncategorized';
    }

    res.json({
      title: cleanTitle,
      description: description,
      imageUrl: ogImg,
      content: finalContent,
      category: normalizedCategory
    });
  } catch (err) {
    if (browser) await browser.close();
    console.error('[Smart Fetch Error]:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fetch-article', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    // Call the internal crawler logic using local server address
    const response = await axios.post(`http://localhost:${PORT}/api/crawler/fetch`, { url });
    return res.json(response.data);
  } catch (err) {
    const errMsg = err.response?.data?.error || err.message;
    return res.status(500).json({ error: errMsg });
  }
});

app.get('/api/news/:id', (req, res) => {
  const dbData = readDb();
  const item = dbData.news.find(n => n.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'News item not found' });
  res.json(item);
});

app.post('/api/news', (req, res) => {
  const dbData = readDb();
  const newItem = {
    ...req.body,
    id: req.body.id || 'news-' + Date.now(),
    title: cleanTitle(req.body.title),
    summary: cleanSummary(req.body.summary),
    content: req.body.content ? cleanBoilerplate(req.body.content) : '',
    imageUrl: req.body.imageUrl || req.body.image_url || '',
    createdAt: req.body.createdAt || new Date().toISOString(),
    commentsCount: req.body.commentsCount || 0
  };
  dbData.news.unshift(newItem);
  writeDb(dbData);
  res.status(201).json(newItem);
});

app.put('/api/articles/bulk-publish', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid or missing ids array' });
  }

  const dbData = readDb();
  let updatedCount = 0;

  dbData.news = dbData.news.map(article => {
    if (ids.includes(article.id)) {
      updatedCount++;
      return { ...article, status: 'PUBLISHED' };
    }
    return article;
  });

  writeDb(dbData);
  res.json({ success: true, message: `Successfully published ${updatedCount} articles` });
});

app.put('/api/news/:id', (req, res) => {
  const dbData = readDb();
  const index = dbData.news.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'News item not found' });
  
  dbData.news[index] = {
    ...dbData.news[index],
    ...req.body,
    title: req.body.title !== undefined ? cleanTitle(req.body.title) : dbData.news[index].title,
    summary: req.body.summary !== undefined ? cleanSummary(req.body.summary) : dbData.news[index].summary,
    content: req.body.content !== undefined ? cleanBoilerplate(req.body.content) : dbData.news[index].content,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : (req.body.image_url !== undefined ? req.body.image_url : dbData.news[index].imageUrl),
    id: req.params.id // ensure ID remains constant
  };
  writeDb(dbData);
  res.json(dbData.news[index]);
});

app.get('/api/articles/nuke', (req, res) => {
  const dbData = readDb();
  dbData.news = [];
  writeDb(dbData);
  res.json({ message: 'Database wiped completely' });
});

app.delete('/api/articles', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid or missing ids array' });
  }

  const dbData = readDb();
  const initialCount = dbData.news.length;
  dbData.news = dbData.news.filter(article => !ids.includes(article.id));
  writeDb(dbData);

  res.json({ success: true, message: `Successfully deleted ${initialCount - dbData.news.length} articles` });
});

app.delete('/api/news/:id', (req, res) => {
  const dbData = readDb();
  const index = dbData.news.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'News item not found' });
  
  const deletedItem = dbData.news.splice(index, 1)[0];
  writeDb(dbData);
  res.json(deletedItem);
});

// MAGAZINE CRUD
app.get('/api/magazines', (req, res) => {
  const dbData = readDb();
  if (!dbData.magazines) dbData.magazines = [];
  res.json(dbData.magazines);
});

app.post('/api/magazines', (req, res) => {
  const dbData = readDb();
  if (!dbData.magazines) dbData.magazines = [];
  const newIssue = {
    ...req.body,
    id: req.body.id || 'issue-' + Date.now(),
    isPublished: req.body.isPublished ?? false
  };
  dbData.magazines.unshift(newIssue);
  writeDb(dbData);
  res.status(201).json(newIssue);
});

app.put('/api/magazines/:id', (req, res) => {
  const dbData = readDb();
  if (!dbData.magazines) dbData.magazines = [];
  const index = dbData.magazines.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Issue not found' });
  
  dbData.magazines[index] = {
    ...dbData.magazines[index],
    ...req.body,
    id: req.params.id
  };
  writeDb(dbData);
  res.json(dbData.magazines[index]);
});

app.delete('/api/magazines/:id', (req, res) => {
  const dbData = readDb();
  if (!dbData.magazines) dbData.magazines = [];
  const index = dbData.magazines.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Issue not found' });
  
  const deleted = dbData.magazines.splice(index, 1)[0];
  writeDb(dbData);
  res.json(deleted);
});

// ACADEMY COURSES CRUD
app.get('/api/courses', (req, res) => {
  const dbData = readDb();
  if (!dbData.courses) dbData.courses = [];
  res.json(dbData.courses);
});

app.post('/api/courses', (req, res) => {
  const dbData = readDb();
  if (!dbData.courses) dbData.courses = [];
  const newCourse = {
    ...req.body,
    id: req.body.id || 'course-' + Date.now(),
    isPublished: req.body.isPublished ?? false
  };
  dbData.courses.unshift(newCourse);
  writeDb(dbData);
  res.status(201).json(newCourse);
});

app.put('/api/courses/:id', (req, res) => {
  const dbData = readDb();
  if (!dbData.courses) dbData.courses = [];
  const index = dbData.courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  dbData.courses[index] = {
    ...dbData.courses[index],
    ...req.body,
    id: req.params.id
  };
  writeDb(dbData);
  res.json(dbData.courses[index]);
});

app.delete('/api/courses/:id', (req, res) => {
  const dbData = readDb();
  if (!dbData.courses) dbData.courses = [];
  const index = dbData.courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  
  const deleted = dbData.courses.splice(index, 1)[0];
  writeDb(dbData);
  res.json(deleted);
});

// DRAFT MEMBER REGISTRATION LEAD SUBMISSION
app.post('/api/members/draft', (req, res) => {
  const dbData = readDb();
  const { fullName, email, company, role, messenger, description } = req.body;
  const newMember = {
    id: 'member-' + Date.now(),
    name: fullName || '',
    type: 'Individual',
    roleOrCategory: role || '',
    email: email || '',
    phone: messenger || '',
    location: company || '',
    description: description || '',
    isVerified: false,
    expertiseTags: [],
    createdAt: new Date().toISOString()
  };
  dbData.participants.unshift(newMember);
  writeDb(dbData);
  res.status(201).json(newMember);
});

// DIRECTORY (PARTICIPANTS) CRUD
app.get('/api/participants', (req, res) => {
  const dbData = readDb();
  res.json(dbData.participants);
});

app.post('/api/participants', (req, res) => {
  const dbData = readDb();
  const newMember = {
    ...req.body,
    id: req.body.id || 'member-' + Date.now()
  };
  dbData.participants.unshift(newMember);
  writeDb(dbData);
  res.status(201).json(newMember);
});

app.put('/api/participants/:id', (req, res) => {
  const dbData = readDb();
  const index = dbData.participants.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Member not found' });
  
  dbData.participants[index] = {
    ...dbData.participants[index],
    ...req.body,
    id: req.params.id
  };
  writeDb(dbData);
  res.json(dbData.participants[index]);
});

app.delete('/api/participants/:id', (req, res) => {
  const dbData = readDb();
  const index = dbData.participants.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Member not found' });
  
  const deleted = dbData.participants.splice(index, 1)[0];
  writeDb(dbData);
  res.json(deleted);
});

// Setup static file serving for React frontend SPA build files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  // If request is for an API that fell through, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  // Otherwise send the main index.html file for SPA routing
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Energeia App loading</title></head>
        <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #12181a; color: #e1e7e8;">
          <h2>Energeia Frontend Build Not Yet Compiled</h2>
          <p>Please compile the react build using <code>npm run build</code> first.</p>
          <p>You can also use Vite dev server directly on <a href="http://localhost:3000" style="color: #40c4ff;">http://localhost:3000</a>.</p>
        </body>
      </html>
    `);
  }
});

// Schedule: Runs every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log('⏰ Starting scheduled news crawler run...');
  try {
    const result = await triggerRssAggregator();
    global.lastCrawlerResult = result;
    global.lastCrawlerRun = new Date().toISOString();
    console.log(`✅ Scheduled news crawler completed successfully. Inserted drafts: ${result.insertedCount}`);
  } catch (error) {
    console.error('❌ Scheduled news crawler failed:', error.message);
  }
});

// Start backend server
app.listen(PORT, () => {
  console.log(`[Energeia Server] Running on http://localhost:${PORT}`);
});
