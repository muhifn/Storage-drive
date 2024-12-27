import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import FilePage from './FilePage.tsx'; // Import halaman berikutnya
import ProfilePage from './ProfilePage.tsx';
import Providers from './providers/PrivyProvider.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/next" element={<FilePage />} /> 
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>
);
