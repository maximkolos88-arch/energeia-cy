import React, { useEffect } from 'react';
import { NewsItem } from '../../models/types';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  article?: NewsItem | null;
  siteName?: string;
}

export const SEOManager: React.FC<SEOProps> = ({
  title = 'Energeia - Cyprus Energy News & Market Intelligence',
  description = 'Cyprus energy news, renewable market intelligence, regulatory policy updates, and clean energy analytics.',
  url = 'https://energeia.cy',
  image = 'https://energeia.cy/apple-touch-icon-180x180.png',
  article = null,
  siteName = 'Energeia Cyprus All-Energy Network'
}) => {
  useEffect(() => {
    // 1. Resolve effective meta values
    const articleTitle = article?.title || title;
    const fullTitle = article ? `${articleTitle} | Energeia` : title;
    const metaDescription = article?.summary || article?.content?.slice(0, 160) || description;
    const currentUrl = article?.slug ? `https://energeia.cy/news/${article.slug}` : url;
    const imageUrl = article?.image_url || article?.imageUrl || image;
    const publishedDate = article?.publishedAt || article?.createdAt || new Date().toISOString();

    // 2. Update Document Title
    document.title = fullTitle;

    // 3. Helper to update/create meta tag
    const updateMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 4. Update standard meta tags & Canonical URL
    updateMetaTag('name', 'description', metaDescription);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Open Graph Tags
    updateMetaTag('property', 'og:type', article ? 'article' : 'website');
    updateMetaTag('property', 'og:title', articleTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:image', imageUrl);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:site_name', siteName);

    // Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', articleTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', imageUrl);

    // 5. Inject / Update Schema.org JSON-LD Structured Data
    let scriptTag = document.head.querySelector('#schema-structured-data') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (article) {
      const newsArticleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': currentUrl
        },
        'headline': articleTitle,
        'description': metaDescription,
        'image': [imageUrl],
        'datePublished': publishedDate,
        'dateModified': publishedDate,
        'author': {
          '@type': 'Organization',
          'name': 'Energeia Editorial Team',
          'url': 'https://energeia.cy'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Energeia',
          'url': 'https://energeia.cy',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://energeia.cy/apple-touch-icon-180x180.png'
          }
        }
      };
      scriptTag.text = JSON.stringify(newsArticleSchema);
    } else {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Energeia',
        'alternateName': 'Energeia Cyprus All-Energy Network',
        'url': 'https://energeia.cy',
        'description': description
      };
      scriptTag.text = JSON.stringify(websiteSchema);
    }
  }, [title, description, url, image, article, siteName]);

  return null;
};
