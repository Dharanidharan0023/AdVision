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
  const siteTitle = siteSettings?.websiteName || 'AdVision Studio';
  const siteUrl = 'https://advisionstudio.com';
  const fullUrl = `${siteUrl}${url}`;
  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || 'Premium video production, visual narratives, and digital experiences by AdVision Studio.';
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDesc} />
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
