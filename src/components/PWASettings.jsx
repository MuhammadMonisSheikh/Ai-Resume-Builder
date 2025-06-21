import React, { useState } from 'react';
import { Settings, Trash2, Bell, Download, Database, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const PWASettings = ({ isOpen, onClose }) => {
  const {
    isOnline,
    isInstalled,
    isStandalone,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    getOfflineDataKeys,
    requestNotificationPermission,
    sendNotification
  } = usePWA();

  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [offlineDataKeys, setOfflineDataKeys] = useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setOfflineDataKeys(getOfflineDataKeys());
    }
  }, [isOpen]);

  const handleNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    
    if (granted) {
      sendNotification('Notifications Enabled', {
        body: 'You\'ll now receive updates about new features and templates!'
      });
    }
  };

  const handleClearOfflineData = (key) => {
    if (clearOfflineData(key)) {
      setOfflineDataKeys(getOfflineDataKeys());
    }
  };

  const handleClearAllOfflineData = () => {
    if (window.confirm('Are you sure you want to clear all offline data? This cannot be undone.')) {
      offlineDataKeys.forEach(key => clearOfflineData(key));
      setOfflineDataKeys([]);
    }
  };

  const getOfflineDataSize = (key) => {
    try {
      const data = localStorage.getItem(`pwa_${key}`);
      return data ? Math.round(data.length / 1024) : 0; // Size in KB
    } catch {
      return 0;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>PWA Settings</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          {/* App Status */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">App Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connection:</span>
                  <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Installation:</span>
                  <span className={`font-medium ${isInstalled ? 'text-green-600' : 'text-gray-600'}`}>
                    {isInstalled ? 'Installed' : 'Not Installed'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className={`font-medium ${isStandalone ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isStandalone ? 'Standalone' : 'Browser'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Permission:</span>
                  <span className={`text-sm font-medium ${
                    notificationPermission === 'granted' ? 'text-green-600' : 
                    notificationPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {notificationPermission}
                  </span>
                </div>
                {notificationPermission !== 'granted' && (
                  <button
                    onClick={handleNotificationPermission}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Enable Notifications
                  </button>
                )}
                {notificationPermission === 'granted' && (
                  <button
                    onClick={() => sendNotification('Test Notification', { body: 'This is a test notification from AI Resume Pro!' })}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    Test Notification
                  </button>
                )}
              </div>
            </div>

            {/* Offline Data */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Offline Data</span>
              </h3>
              <div className="space-y-3">
                {offlineDataKeys.length === 0 ? (
                  <p className="text-sm text-gray-500">No offline data stored</p>
                ) : (
                  <div className="space-y-2">
                    {offlineDataKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{key}</p>
                          <p className="text-xs text-gray-500">{getOfflineDataSize(key)} KB</p>
                        </div>
                        <button
                          onClick={() => handleClearOfflineData(key)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleClearAllOfflineData}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PWA Features */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>PWA Features</span>
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Offline resume creation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>App-like experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Automatic updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Push notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWASettings; 