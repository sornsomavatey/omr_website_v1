import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/app/router/AppRouter';
import './styles/index.css';

hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);

requestAnimationFrame(() => {
  document.getElementById('root')?.style.removeProperty('visibility');
});
