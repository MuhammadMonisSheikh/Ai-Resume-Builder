// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useEffect, useRef, useState, memo } from 'react';

const AdPlaceholder = memo(({ 
  adSlot, 
  adFormat = 'auto', 
  adClient = 'ca-pub-YOUR_PUBLISHER_ID',
  lazyLoad = true,
  delay = 2000 
}) => {
  const adRef = useRef(null);
  const isAdInitialized = useRef(false);
  const [shouldLoadAd, setShouldLoadAd] = useState(!lazyLoad);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only load ads if AdSense is available and not in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Lazy load ads after a delay
    if (lazyLoad) {
      const timer = setTimeout(() => {
        setShouldLoadAd(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [lazyLoad, delay]);

  useEffect(() => {
    // Intersection Observer for lazy loading
    if (!shouldLoadAd || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px', // Start loading 100px before the ad comes into view
        threshold: 0.1
      }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadAd]);

  useEffect(() => {
    // Initialize AdSense only when visible and not already initialized
    if (!isVisible || isAdInitialized.current || !window.adsbygoogle || !adRef.current) {
      return;
    }

    try {
      // Check if the ad element already has ads
      if (!adRef.current.hasAttribute('data-ad-status')) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdInitialized.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [isVisible]);

  // Don't render ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="ad-container my-4 text-center bg-gray-100 p-4 rounded-lg">
        <div className="text-gray-500 text-sm">
          Ad Placeholder (Development Mode)
        </div>
        <small className="text-gray-400">Advertisement</small>
      </div>
    );
  }

  // Don't render if lazy loading and not ready
  if (!shouldLoadAd) {
    return (
      <div className="ad-container my-4 text-center bg-gray-50 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className="ad-container my-4 text-center bg-gray-100 p-4 rounded-lg"
    >
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      )}
      <small className="text-gray-400">Advertisement</small>
    </div>
  );
});

AdPlaceholder.displayName = 'AdPlaceholder';

export default AdPlaceholder;