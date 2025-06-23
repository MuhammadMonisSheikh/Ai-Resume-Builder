import React, { useState, useEffect } from 'react';

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export default function DevOverlay() {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!isDev) return;
    // Handler for window.onerror
    const handleError = (event) => {
      setErrors((prev) => [
        ...prev,
        {
          message: event.message || (event.reason && event.reason.message) || 'Unknown error',
          stack: event.error ? event.error.stack : (event.reason && event.reason.stack) || '',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (!isDev) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          padding: 12,
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
        }}
        title={errors.length ? `Errors: ${errors.length}` : 'Development Mode: Click for error details'}
        onClick={() => setShowModal(true)}
      >
        <img
          src="/icons/react-dev-favicon.png"
          alt="React Dev Overlay"
          style={{ width: 40, height: 40, display: 'block' }}
        />
        {errors.length > 0 && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: '#e53e3e',
            color: '#fff',
            borderRadius: '50%',
            width: 18,
            height: 18,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}>{errors.length}</span>
        )}
      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            maxWidth: 480,
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            padding: 24,
            position: 'relative',
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label="Close error modal"
            >×</button>
            <h2 style={{marginBottom: 12, fontSize: 20, color: '#2563eb'}}>Development Error Overlay</h2>
            {errors.length === 0 ? (
              <div style={{color: '#444'}}>No errors captured yet.</div>
            ) : (
              errors.map((err, idx) => (
                <div key={idx} style={{marginBottom: 18, padding: 12, background: '#f9fafb', borderRadius: 8, border: '1px solid #eee'}}>
                  <div style={{fontWeight: 'bold', color: '#e53e3e'}}>{err.message}</div>
                  {err.stack && <pre style={{fontSize: 12, color: '#555', marginTop: 6, whiteSpace: 'pre-wrap'}}>{err.stack}</pre>}
                  <div style={{fontSize: 11, color: '#888', marginTop: 4}}>Time: {err.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
} 