import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PremiumLanding } from './features/landing/PremiumLanding.tsx'

const RootApp = () => {
  // Try to load from localStorage if they have already seen the landing page
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('seenLanding') !== 'true';
  });

  const handleEnterApp = () => {
    localStorage.setItem('seenLanding', 'true');
    setShowLanding(false);
  };

  if (showLanding) {
    return <PremiumLanding onEnter={handleEnterApp} />;
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
)
