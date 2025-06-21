import React, { useEffect } from 'react';

const AdPlaceholder = ({ adSlot, adFormat = 'auto', adClient = 'ca-pub-YOUR_PUBLISHER_ID' }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="ad-container my-4 text-center bg-gray-100 p-4 rounded-lg">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot} // Your specific ad unit ID
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
      <small className="text-gray-400">Advertisement</small>
    </div>
  );
};

export default AdPlaceholder;