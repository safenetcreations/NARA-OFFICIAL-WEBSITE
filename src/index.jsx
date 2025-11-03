import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializePWA } from './utils/pwa';
import "./i18n";
import "./styles/tailwind.css";
import "./styles/index.css";
import './styles/mobile-optimizations.css';
import './styles/accessibility.css';

const container = document.getElementById("root");
const root = createRoot(container);

// Initialize PWA features like service worker and update notifications
if ('serviceWorker' in navigator) {
  initializePWA().catch(error => {
    console.error('PWA Initialization failed:', error);
  });
}

root.render(<App />);
