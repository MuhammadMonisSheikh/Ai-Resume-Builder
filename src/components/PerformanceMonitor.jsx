import React, { useState, useEffect, memo } from 'react';
import { Activity, Zap, Clock, Wifi, WifiOff } from 'lucide-react';

const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    isOnline: navigator.onLine,
    memory: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Performance metrics
    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const firstPaint = paint.find(entry => entry.name === 'first-paint');
      const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint');

      setMetrics(prev => ({
        ...prev,
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
        domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
        firstPaint: firstPaint ? Math.round(firstPaint.startTime) : 0,
        firstContentfulPaint: firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : 0,
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        } : null,
      }));
    };

    // Update metrics after page load
    if (document.readyState === 'complete') {
      updateMetrics();
    } else {
      window.addEventListener('load', updateMetrics);
    }

    // Online/offline status
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Toggle visibility with keyboard shortcut (Ctrl+Shift+P)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', updateMetrics);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const getPerformanceColor = (value, threshold) => {
    if (value <= threshold * 0.7) return 'text-green-500';
    if (value <= threshold) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Performance
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {/* Load Time */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className={getPerformanceColor(metrics.loadTime, 3000)}>
            {metrics.loadTime}ms
          </span>
        </div>

        {/* DOM Content Loaded */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">DOM Ready:</span>
          <span className={getPerformanceColor(metrics.domContentLoaded, 2000)}>
            {metrics.domContentLoaded}ms
          </span>
        </div>

        {/* First Paint */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">First Paint:</span>
          <span className={getPerformanceColor(metrics.firstPaint, 1000)}>
            {metrics.firstPaint}ms
          </span>
        </div>

        {/* First Contentful Paint */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">FCP:</span>
          <span className={getPerformanceColor(metrics.firstContentfulPaint, 1500)}>
            {metrics.firstContentfulPaint}ms
          </span>
        </div>

        {/* Memory Usage */}
        {metrics.memory && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Memory:</span>
            <span className="text-blue-600">
              {metrics.memory.used}MB / {metrics.memory.total}MB
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <div className="flex items-center">
            {metrics.isOnline ? (
              <Wifi className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={metrics.isOnline ? 'text-green-500' : 'text-red-500'}>
              {metrics.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Press Ctrl+Shift+P to toggle
        </p>
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor; 