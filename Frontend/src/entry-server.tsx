import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppRouter from '@/app/router/AppRouter';
import { getSEOMetadata } from '@/lib/seo';

export function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppRouter />
      </StaticRouter>
    </React.StrictMode>
  );

  // Get clean path
  const path = url.split('?')[0];
  // Default server rendering is English 
  const seo = getSEOMetadata(path, false);

  return { 
    html,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: seo.ogImage
  };
}
