import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ResumeForFreshers from './pages/ResumeForFreshers';
import ResumeForGulfJobs from './pages/ResumeForGulfJobs';
import CoverLetterForTeachers from './pages/CoverLetterForTeachers';
import PWAInstall from './components/PWAInstall';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
    </Router>
  );
}

export default App;