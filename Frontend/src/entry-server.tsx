import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppRouter from '@/app/router/AppRouter';

export function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppRouter />
      </StaticRouter>
    </React.StrictMode>
  );
  return { html };
}
