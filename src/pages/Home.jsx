import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ThumbsUp, ThumbsDown, FileText, Download, Star, Zap, Shield, Users, Award, TrendingUp, CheckCircle, ArrowRight, Target, Lightbulb, Code, Lock, Monitor, Smartphone } from 'lucide-react';
import ResumeForm from '../components/ResumeForm';
import CoverLetterForm from '../components/CoverLetterForm';
import AdPlaceholder from '../components/AdPlaceholder';
import PWAInstall from '../components/PWAInstall';
import { Helmet } from 'react-helmet-async';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [aiCommand, setAiCommand] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const previewRef = useRef(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleAICommand = async (e) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;
    setAiLoading(true);
    setAiResult('');
    setFeedback(null);
    setFeedbackComment('');
    setFeedbackSubmitted(false);
    
    const prompt = `You are an expert career assistant and designer. ${aiCommand}

Generate the requested document in professional HTML format with dynamic design that adapts to the content.

Design Requirements:
1. Create a modern, visually appealing layout that matches the industry/role mentioned
2. Use appropriate color schemes (tech=blue/purple, healthcare=green/blue, finance=navy/gold, creative=colorful, etc.)
3. Include responsive design for mobile devices
4. Use professional typography and spacing
5. Make it ATS-friendly with clear section headers
6. Include modern CSS with gradients, shadows, and clean styling
7. Adapt the layout based on content type and length
8. Use icons and visual elements where appropriate
9. Ensure the design is professional yet modern
10. Include all necessary sections (header, summary, experience, skills, education, etc.)

If the user requests code, include code blocks using markdown (\`\`\`language\ncode\n\`\`\`) or HTML <pre><code> tags.

Generate a complete HTML document with embedded CSS that looks professional and modern. The design should be visually appealing while maintaining readability and professionalism.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.8
      })
    });
    const result = await response.json();
    setAiResult(result.choices?.[0]?.message?.content || 'AI failed to generate content.');
    setAiLoading(false);
  };

  useEffect(() => {
    if (aiResult && previewRef.current) {
      previewRef.current.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }
  }, [aiResult]);

  const handleCopy = () => {
    if (aiResult) navigator.clipboard.writeText(aiResult);
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('ai-document.pdf');
  };

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

          {/* AI Command Box */}
          <div className="max-w-2xl mx-auto mb-10 bg-white rounded-xl shadow p-6">
            <button
              className="mb-4 text-blue-600 underline text-sm focus:outline-none"
              onClick={() => setShowGuidelines(g => !g)}
              aria-expanded={showGuidelines}
            >
              {showGuidelines ? 'Hide' : 'Show'} AI Command Guidelines
            </button>
            {showGuidelines && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-800">
                <strong>How to use the AI Command Box:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Be specific about the type of document (CV, resume, cover letter).</li>
                  <li>Mention the job title, industry, or skills you want to highlight.</li>
                  <li>Add any special requirements (e.g., "concise", "formal", "in French").</li>
                  <li>You can ask for a document for yourself or for a hypothetical person.</li>
                </ul>
                <div className="mt-3">
                  <strong>Example Commands:</strong>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Create a resume for a software engineer with 3 years of experience in Python and React.</li>
                    <li>Generate a CV for a marketing manager with experience in digital campaigns and team leadership.</li>
                    <li>Write a cover letter for a teaching position at a high school.</li>
                    <li>Create a resume in French for a graphic designer.</li>
                    <li>Write a formal cover letter for a finance internship.</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <strong>Advanced Tips:</strong>
                  <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>Specify the tone: "formal", "friendly", "concise", etc.</li>
                    <li>Ask for a specific section: "Suggest a summary for a resume for a web developer."</li>
                    <li>Request a language: "Create a resume in Spanish for a customer service role."</li>
                  </ul>
                </div>
                <div className="mt-3 text-blue-700 font-semibold">Just type your command above and let the AI do the rest!</div>
              </div>
            )}
            <form onSubmit={handleAICommand} className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Type a command, e.g. 'Create a CV for a software engineer...'"
                value={aiCommand}
                onChange={e => setAiCommand(e.target.value)}
                disabled={aiLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={aiLoading || !aiCommand.trim()}
              >
                {aiLoading ? 'Generating...' : 'Ask AI'}
              </button>
            </form>
            {aiResult && (
              <div className="mt-6">
                <div className="flex justify-end gap-2 mb-2">
                  <button onClick={handleCopy} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">Copy</button>
                  <button onClick={handleDownloadPDF} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm">Download PDF</button>
                </div>
                <div ref={previewRef} className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto text-gray-900 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: aiResult }} />
                {/* Feedback Section */}
                {!feedbackSubmitted ? (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">Was this result helpful?</span>
                      <button
                        className={`p-2 rounded-full border ${feedback==='up' ? 'bg-green-100 border-green-400' : 'border-gray-300'} hover:bg-green-50`}
                        onClick={() => setFeedback('up')}
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp className={`h-5 w-5 ${feedback==='up' ? 'text-green-600' : 'text-gray-500'}`} />
                      </button>
                      <button
                        className={`p-2 rounded-full border ${feedback==='down' ? 'bg-red-100 border-red-400' : 'border-gray-300'} hover:bg-red-50`}
                        onClick={() => setFeedback('down')}
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown className={`h-5 w-5 ${feedback==='down' ? 'text-red-600' : 'text-gray-500'}`} />
                      </button>
                    </div>
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 mb-2"
                      rows={2}
                      placeholder="Any suggestions or improvements? (optional)"
                      value={feedbackComment}
                      onChange={e => setFeedbackComment(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                      onClick={() => {
                        // Save feedback to localStorage (or send to backend if available)
                        const feedbacks = JSON.parse(localStorage.getItem('ai_feedbacks') || '[]');
                        feedbacks.push({
                          result: aiResult,
                          feedback,
                          comment: feedbackComment,
                          date: new Date().toISOString(),
                          command: aiCommand
                        });
                        localStorage.setItem('ai_feedbacks', JSON.stringify(feedbacks));
                        setFeedbackSubmitted(true);
                      }}
                      disabled={!feedback}
                    >
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 text-green-700 font-semibold">Thank you for your feedback!</div>
                )}
              </div>
            )}
          </div>

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