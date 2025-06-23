// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import DevInfoPanel from './components/DevInfoPanel';
import OfflineIndicator from './components/OfflineIndicator';
import PWAInstall from './components/PWAInstall';
import AdPlaceholder from './components/AdPlaceholder';
import PerformanceMonitor from './components/PerformanceMonitor';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages with preloading hints
const Home = lazy(() => import('./pages/Home'));
const ResumeForFreshers = lazy(() => import('./pages/ResumeForFreshers'));
const ResumeForGulfJobs = lazy(() => import('./pages/ResumeForGulfJobs'));
const CoverLetterForTeachers = lazy(() => import('./pages/CoverLetterForTeachers'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Optimized loading skeleton
const LoadingSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Preload critical pages
const preloadPages = () => {
  // Preload the most commonly used pages
  const preloadHome = () => import('./pages/Home');
  const preloadResume = () => import('./pages/ResumeForFreshers');
  
  // Preload on user interaction
  document.addEventListener('mouseover', preloadHome, { once: true });
  document.addEventListener('mouseover', preloadResume, { once: true });
};

const App = () => {
  React.useEffect(() => {
    console.log('App component mounting...');
    preloadPages();
    console.log('App component mounted successfully');
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
            
            <main className="flex-grow">
              <Suspense fallback={<LoadingSkeleton />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/resume-for-freshers" element={<ResumeForFreshers />} />
                  <Route path="/resume-for-gulf-jobs" element={<ResumeForGulfJobs />} />
                  <Route path="/cover-letter-for-teachers" element={<CoverLetterForTeachers />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </Suspense>
            </main>

            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </div>

          {/* Global Components */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          
          <PWAInstall />
          <OfflineIndicator />
          <DevInfoPanel />
          <PerformanceMonitor />
          
          {/* Ad Placeholder - Only show in production */}
          {process.env.NODE_ENV === 'production' && (
            <AdPlaceholder adSlot="your-ad-slot-id" />
          )}
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default memo(App);