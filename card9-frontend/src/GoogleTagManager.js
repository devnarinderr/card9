import React, { useEffect } from 'react';

const GoogleTagManager = () => {
  useEffect(() => {
    const loadGoogleTagManager = () => {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9SQ1MX2Z15';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.gtag('js', new Date());
        window.gtag('config', 'G-9SQ1MX2Z15');
      };
    };

    loadGoogleTagManager();
  }, []);

  return null;
};

export default GoogleTagManager;
