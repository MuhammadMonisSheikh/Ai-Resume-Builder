import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Check if app is installed/standalone
    const checkInstallStatus = () => {
      const isStandaloneMode = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isStandaloneMode);
      setIsInstalled(isStandaloneMode);
    };

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    checkInstallStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const triggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setIsInstalled(true);
      }
    }
  };

  // Save data to localStorage for offline access
  const saveOfflineData = (key, data) => {
    try {
      localStorage.setItem(`pwa_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  };

  // Get data from localStorage
  const getOfflineData = (key) => {
    try {
      const stored = localStorage.getItem(`pwa_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if data is not older than 7 days
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  };

  // Clear offline data
  const clearOfflineData = (key) => {
    try {
      localStorage.removeItem(`pwa_${key}`);
      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  };

  // Get all offline data keys
  const getOfflineDataKeys = () => {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('pwa_'))
        .map(key => key.replace('pwa_', ''));
    } catch (error) {
      console.error('Failed to get offline data keys:', error);
      return [];
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Send notification
  const sendNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });
    }
    return null;
  };

  return {
    isOnline,
    isInstalled,
    isStandalone,
    canInstall: !!installPrompt,
    triggerInstall,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    getOfflineDataKeys,
    requestNotificationPermission,
    sendNotification
  };
}; 