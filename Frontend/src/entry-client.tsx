import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/app/router/AppRouter';
import './styles/index.css';

const revealApp = () => {
  document.body.classList.remove('app-preload');
};

hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);

requestAnimationFrame(revealApp);
