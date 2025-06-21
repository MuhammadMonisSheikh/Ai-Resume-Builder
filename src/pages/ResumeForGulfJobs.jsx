import React from 'react';
import { MapPin, Briefcase, Globe, Star } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { Helmet } from 'react-helmet-async';
import ResumeForm from '../components/ResumeForm';

const ResumeForGulfJobs = () => {
  return (
    <>
      <Helmet>
        <title>Gulf CV Builder | Create a Professional CV for Dubai, UAE & Gulf Jobs</title>
        <meta name="description" content="Build a professional CV for jobs in the Gulf region. Our free CV maker includes templates and formats preferred by employers in Dubai, UAE, Saudi Arabia, and more." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Ad */}
        <AdPlaceholder position="top" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Ad */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <AdPlaceholder position="sidebar" />
          </div>

          {/* Main Content */}
          <article className="lg:col-span-3 order-1 lg:order-2">
            <header className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
                <h1 className="text-4xl font-bold text-gray-900">Resume for Gulf Jobs: UAE, Saudi Arabia, Qatar Guide</h1>
              </div>
              <p className="text-xl text-gray-600">
                Create a winning resume for the Gulf job market. Learn the specific requirements, 
                cultural considerations, and formatting preferences for Middle East employers.
              </p>
            </header>

            <div className="prose max-w-none">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4">Gulf Job Market Overview</h2>
                <p className="text-green-800">
                  The Gulf region offers lucrative opportunities across various industries including oil & gas, 
                  construction, healthcare, finance, and technology. However, Gulf employers have specific 
                  expectations for resume format and content that differ from Western standards.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-7 w-7 text-blue-500 mr-3" />
                Key Requirements for Gulf Resumes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📷 Professional Photo</h3>
                  <p className="text-gray-600">
                    Include a professional headshot photo. This is expected and required for most Gulf positions.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🆔 Personal Details</h3>
                  <p className="text-gray-600">
                    Include nationality, age, marital status, and visa status. These details are standard requirements.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Salary Expectations</h3>
                  <p className="text-gray-600">
                    Often expected to mention current salary and expected salary range in your resume.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📅 Availability</h3>
                  <p className="text-gray-600">
                    Clearly state your availability to join and notice period required from current employer.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-7 w-7 text-purple-500 mr-3" />
                Country-Specific Preferences
              </h2>

              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">🇦🇪 UAE (Dubai, Abu Dhabi)</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• Emphasis on international experience and multicultural adaptability</li>
                    <li>• Strong focus on customer service and relationship building skills</li>
                    <li>• Preference for candidates with experience in diverse work environments</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-3">🇸🇦 Saudi Arabia</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• Focus on technical expertise and industry-specific qualifications</li>
                    <li>• Highlight any Arabic language skills</li>
                    <li>• Emphasis on leadership and team management capabilities</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">🇶🇦 Qatar</h3>
                  <ul className="text-purple-800 space-y-2">
                    <li>• Strong emphasis on educational qualifications and certifications</li>
                    <li>• Preference for candidates with experience in project management</li>
                    <li>• Highlight any experience with international standards and best practices</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="h-7 w-7 text-yellow-500 mr-3" />
                Resume Format Best Practices
              </h2>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Structure & Layout:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ 2-3 pages maximum</li>
                      <li>✓ Professional photo at top</li>
                      <li>✓ Clear section headings</li>
                      <li>✓ Chronological format preferred</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Content Focus:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Quantifiable achievements</li>
                      <li>✓ Industry-specific keywords</li>
                      <li>✓ Cultural adaptability examples</li>
                      <li>✓ Professional references</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <h3 className="text-xl font-bold text-red-900 mb-4">Important Cultural Considerations</h3>
                <ul className="space-y-3 text-red-800">
                  <li>🕌 Respect for local customs and traditions</li>
                  <li>🤝 Emphasis on team collaboration and relationship building</li>
                  <li>📚 Continuous learning and professional development</li>
                  <li>🌍 Adaptability to multicultural work environments</li>
                  <li>💼 Professional dress code and appearance standards</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Ready for Your Gulf Career?</h3>
                <p className="text-green-100 mb-6">
                  Create a professionally formatted resume that meets Gulf job market standards and 
                  showcases your qualifications effectively to Middle East employers.
                </p>
                <a
                  href="/"
                  className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Create Gulf-Ready Resume
                </a>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom Ad */}
        <AdPlaceholder position="bottom" className="mt-12" />
      </div>
    </>
  );
};

export default ResumeForGulfJobs;