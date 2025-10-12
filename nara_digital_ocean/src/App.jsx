import React, { useEffect } from "react";
import Routes from "./Routes";
import useThemeStore from './store/theme';
import CookieConsent from './components/compliance/CookieConsent';
import './styles/variables.css';
import './styles/theme-global.css';
import './styles/academy-themes.css';

function App() {
  const theme = useThemeStore((state) => state?.theme || 'normal');
  
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);
  
  return (
    <>
      <Routes />
      <CookieConsent />
    </>
  );
}

export default App;
