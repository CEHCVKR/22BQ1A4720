// src/pages/RedirectPage.tsx

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { Log } from '../../../Logging Middleware/logger';

export default function RedirectPage() {
  const { shortcode } = useParams<{ shortcode: string }>();
  const { urls, updateUrlClicks } = useUrlContext();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToRedirect = urls.find(url => url.shortCode === shortcode);

    if (urlToRedirect) {
      // Check if URL has expired
      const now = new Date();
      if (now > urlToRedirect.expiresAt) {
        Log('frontend', 'warn', 'component', `Expired URL accessed: ${shortcode}`);
        navigate('/not-found');
        return;
      }

      Log('frontend', 'info', 'component', `Redirecting from ${shortcode} to ${urlToRedirect.longURL}`);

      // Update the clicks array for this URL
      const clickData = {
        timestamp: now,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };
      
      updateUrlClicks(urlToRedirect.id, clickData);

      // Perform the redirection
      window.location.replace(urlToRedirect.longURL);
    } else {
      Log('frontend', 'error', 'component', `Shortcode not found: ${shortcode}`);
      // If the shortcode doesn't exist, redirect to a 'not found' page or home
      navigate('/not-found');
    }
  }, [shortcode, urls, navigate, updateUrlClicks]);

  return <p>Redirecting...</p>;
}