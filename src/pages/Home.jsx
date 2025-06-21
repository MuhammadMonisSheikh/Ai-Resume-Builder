import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ResumeForm from '../components/ResumeForm';
import CoverLetterForm from '../components/CoverLetterForm';
import AdPlaceholder from '../components/AdPlaceholder';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [activeTab, setActiveTab] = useState('resume');

  return (
    <>
      <Helmet>
        <title>AI Resume Pro | Free ATS Resume & Cover Letter Builder</title>
        <meta name="description" content="Build a job-winning resume in minutes with our free AI-powered resume and cover letter builder. Create professional, ATS-friendly documents with expert templates and keyword optimization." />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Top Ad */}
          <AdPlaceholder adSlot="YOUR_TOP_AD_SLOT_ID" />

          {/* Hero Section */}
          <div className="text-center my-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                AI-Powered Resume Builder
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create professional, ATS-optimized resumes that get past the bots. Our AI tools help you stand out and get hired faster.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                  <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                      <button
                          onClick={() => setActiveTab('resume')}
                          className={`px-4 sm:px-6 py-2 rounded-md font-semibold text-sm sm:text-base transition-all ${
                              activeTab === 'resume' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                          Resume Builder
                      </button>
                      <button
                          onClick={() => setActiveTab('cover-letter')}
                          className={`px-4 sm:px-6 py-2 rounded-md font-semibold text-sm sm:text-base transition-all ${
                              activeTab === 'cover-letter' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                          Cover Letter Writer
                      </button>
                  </div>
              </div>

              {/* Content */}
              <div>
                {activeTab === 'resume' && <ResumeForm />}
                {activeTab === 'cover-letter' && <CoverLetterForm />}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Sidebar Ad */}
              <div className="sticky top-8">
                <AdPlaceholder adSlot="YOUR_SIDEBAR_AD_SLOT_ID" />
              </div>
            </div>
          </div>
          
          {/* Bottom Ad */}
          <div className="mt-12">
              <AdPlaceholder adSlot="YOUR_BOTTOM_AD_SLOT_ID" />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;