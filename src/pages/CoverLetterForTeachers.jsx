import React from 'react';
import { BookOpen, Users, Award, Heart } from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { Helmet } from 'react-helmet-async';
import CoverLetterForm from '../components/CoverLetterForm';

const CoverLetterForTeachers = () => {
  return (
    <>
      <Helmet>
        <title>Teacher Cover Letter Builder | Free Education & Teaching Templates</title>
        <meta name="description" content="Create a compelling cover letter for teaching positions with our free builder. Includes expert templates and tips for educators, from new teachers to experienced professionals." />
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
                <BookOpen className="h-8 w-8 text-purple-600" />
                <h1 className="text-4xl font-bold text-gray-900">Cover Letter for Teachers: Complete Writing Guide</h1>
              </div>
              <p className="text-xl text-gray-600">
                Craft compelling cover letters that showcase your passion for education and teaching excellence. 
                Learn what principals and hiring committees look for in teacher applications.
              </p>
            </header>

            <div className="prose max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-4">Why Teacher Cover Letters Matter</h2>
                <p className="text-purple-800">
                  Your cover letter is your opportunity to demonstrate your teaching philosophy, 
                  passion for education, and how you'll contribute to the school community. 
                  It's often the first impression you make on hiring committees.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-7 w-7 text-blue-500 mr-3" />
                Essential Elements for Teacher Cover Letters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Teaching Philosophy</h3>
                  <p className="text-gray-600">
                    Clearly articulate your approach to education and how you inspire student learning and growth.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">📚 Subject Expertise</h3>
                  <p className="text-gray-600">
                    Highlight your knowledge in specific subjects and how you make complex concepts accessible.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">👥 Classroom Management</h3>
                  <p className="text-gray-600">
                    Demonstrate your ability to create positive, inclusive learning environments for all students.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">🏫 School Alignment</h3>
                  <p className="text-gray-600">
                    Show how your values and teaching style align with the school's mission and culture.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-7 w-7 text-green-500 mr-3" />
                Cover Letter Structure for Teachers
              </h2>

              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Opening Paragraph</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• State the specific position you're applying for</li>
                    <li>• Mention how you learned about the opportunity</li>
                    <li>• Include a compelling hook about your teaching passion</li>
                    <li>• Reference the school by name to show genuine interest</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-3">Body Paragraphs</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• Highlight relevant teaching experience and achievements</li>
                    <li>• Provide specific examples of successful student outcomes</li>
                    <li>• Discuss your teaching methods and classroom innovations</li>
                    <li>• Mention any special certifications or training</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Closing Paragraph</h3>
                  <ul className="text-purple-800 space-y-2">
                    <li>• Reiterate your enthusiasm for the position</li>
                    <li>• Mention your desire to contribute to the school community</li>
                    <li>• Request an interview and provide contact information</li>
                    <li>• Thank the hiring committee for their consideration</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="h-7 w-7 text-red-500 mr-3" />
                Sample Teacher Cover Letter Template
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-8 font-mono text-sm">
                <p className="mb-4"><strong>Dear [Principal's Name / Hiring Committee],</strong></p>
                
                <p className="mb-4">
                  I am writing to express my strong interest in the [Grade Level/Subject] teaching position at [School Name]. 
                  As a passionate educator with [X years] of experience inspiring young minds, I am excited about the opportunity 
                  to contribute to your school's commitment to academic excellence and student growth.
                </p>

                <p className="mb-4">
                  In my previous role at [Previous School], I successfully [specific achievement, e.g., "improved student 
                  reading levels by 25%" or "implemented innovative STEM curriculum"]. My teaching philosophy centers on 
                  [your teaching approach], and I believe every student can achieve success when provided with engaging, 
                  differentiated instruction tailored to their unique learning styles.
                </p>

                <p className="mb-4">
                  What particularly attracts me to [School Name] is [specific reason related to school's mission, programs, 
                  or values]. I am eager to bring my experience in [relevant skills/subjects] and my commitment to 
                  fostering inclusive, supportive learning environments to your educational community.
                </p>

                <p className="mb-4">
                  I would welcome the opportunity to discuss how my passion for education and proven track record of 
                  student success can contribute to [School Name]'s continued excellence. Thank you for considering my application.
                </p>

                <p><strong>Sincerely,<br/>[Your Name]</strong></p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">Key Tips for Teacher Cover Letters</h3>
                <ul className="space-y-3 text-yellow-800">
                  <li>✨ Show genuine enthusiasm for teaching and student success</li>
                  <li>📊 Include specific examples with measurable outcomes</li>
                  <li>🎨 Mention any special skills (technology, arts, languages)</li>
                  <li>🤝 Emphasize collaboration with parents, colleagues, and administration</li>
                  <li>📝 Keep it to one page and use professional formatting</li>
                  <li>🔍 Research the school thoroughly and personalize your letter</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Land Your Dream Teaching Job?</h3>
                <p className="text-purple-100 mb-6">
                  Use our AI-powered cover letter generator to create personalized, compelling cover letters 
                  that highlight your unique teaching strengths and passion for education.
                </p>
                <a
                  href="/"
                  className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Generate My Teaching Cover Letter
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

export default CoverLetterForTeachers;