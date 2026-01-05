import React, { useEffect } from 'react';

const SEO = ({ title, description, image, date }) => {
  useEffect(() => {
    // Update OG meta tags
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:image"]').content = image;
    document.querySelector('meta[property="og:type"]').content = 'website';
  }, [title, description, image]);

  return <></>;
};

export default SEO;
