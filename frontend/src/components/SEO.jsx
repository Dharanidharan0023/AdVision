import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../context/SiteContext';

const SEO = ({ 
  title, 
  description, 
  url = '', 
  image = '/vite.svg', // Default image or provide a real OG image path
  type = 'website',
  structuredData = null
}) => {
  const { siteSettings } = useSite();
  const siteTitle = siteSettings?.websiteName || 'Dharanix Studio | Dharanidharan';
  const siteUrl = 'https://advisionstudio.com'; // User's custom domain when active
  const fullUrl = `${siteUrl}${url}`;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || 'Dharanix Studio by Dharanidharan. Premium video production, visual narratives, and digital experiences.';
  const metaKeywords = "dharanix, dharanidharan, Dharanix Studio, video production, visual narratives, digital experiences, portfolio, creative studio";
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Dharanidharan" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
