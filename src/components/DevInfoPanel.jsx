import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi'; // Gear icon
import OptimizedImage from "./OptimizedImage";

const DevInfoPanel = ({ error, errorInfo }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  // Detect environment (Vite or CRA)
  const env = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE
    ? import.meta.env.MODE
    : (process.env.NODE_ENV || 'unknown');

  // Only show in development
  if (env !== 'development') return null;

  const clearError = () => {
    // Implement the logic to clear the error
    console.log("Clearing error");
  };

  return (
    <>
      {/* Floating Icon Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 10000,
          background: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        title={open ? 'Hide Dev Panel' : 'Show Dev Panel'}
      >
        <FiSettings size={28} />
      </button>

      {/* Dev Info Panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          left: '1.5rem',
          backgroundColor: '#111',
          color: '#fff',
          padding: '1rem',
          borderRadius: '0.75rem',
          fontSize: '14px',
          maxWidth: '320px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          <div>
            <strong>Route:</strong> {location.pathname}<br />
            <strong>Env:</strong> {env}
          </div>

          <button
            onClick={() => setShowPrefs(prev => !prev)}
            style={{
              marginTop: '0.75rem',
              background: '#444',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ⚙️ Preferences
          </button>

          {showPrefs && (
            <div style={{ marginTop: '0.5rem', background: '#222', padding: '0.75rem', borderRadius: '6px' }}>
              <p>🔁 Auto Reload: <input type="checkbox" /></p>
              <p>🧪 Mock API: <input type="checkbox" /></p>
            </div>
          )}

          <button onClick={() => window.location.reload()}>🔄 Reload</button>
          {error && <button onClick={clearError}>🧹 Clear Error</button>}

          {error && (
            <div style={{
              marginTop: '1rem',
              backgroundColor: '#550000',
              color: '#ffcccc',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              overflowY: 'auto',
              maxHeight: '180px'
            }}>
              <strong>🔥 Error:</strong>
              <p>{error.toString()}</p>
              <p>{errorInfo?.componentStack}</p>
            </div>
          )}

          <OptimizedImage
            src="/images/templates/classic.png"
            alt="Classic Template"
            width={400}
            height={300}
          />
        </div>
      )}
    </>
  );
};

export default DevInfoPanel; 