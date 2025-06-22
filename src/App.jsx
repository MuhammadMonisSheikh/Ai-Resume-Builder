import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResumeForFreshers from './pages/ResumeForFreshers';
import ResumeForGulfJobs from './pages/ResumeForGulfJobs';
import CoverLetterForTeachers from './pages/CoverLetterForTeachers';
import PWAInstall from './components/PWAInstall';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resume-for-freshers" element={<ResumeForFreshers />} />
                <Route path="/resume-for-gulf-jobs" element={<ResumeForGulfJobs />} />
                <Route path="/cover-letter-for-teachers" element={<CoverLetterForTeachers />} />
              </Routes>
            </main>
            <Footer />
            <PWAInstall />
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;