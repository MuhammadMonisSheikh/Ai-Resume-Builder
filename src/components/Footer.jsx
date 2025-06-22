import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone, Github, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand and Mission */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Resume Pro</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Create professional, ATS-friendly resumes and cover letters with the power of AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold text-gray-100 mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/resume-for-freshers" className="text-sm text-gray-400 hover:text-white transition-colors">For Freshers</Link></li>
              <li><Link to="/resume-for-gulf-jobs" className="text-sm text-gray-400 hover:text-white transition-colors">For Gulf Jobs</Link></li>
              <li><Link to="/cover-letter-for-teachers" className="text-sm text-gray-400 hover:text-white transition-colors">For Teachers</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-md font-semibold text-gray-100 mb-4 uppercase tracking-wider">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>AI Content Generation</li>
              <li>Professional Templates</li>
              <li>Instant PDF Export</li>
              <li>Fully Responsive Design</li>
              <li>100% Free Forever</li>
            </ul>
          </div>

          {/* Social and Contact */}
          <div>
            <h3 className="text-md font-semibold text-gray-100 mb-4 uppercase tracking-wider">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/MuhammadMonisSheikh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/muhammad-monis-sheikh-18a881236/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
              <a href="https://x.com/monis_vohra" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="https://www.facebook.com/muhammadmonissh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} AI Resume Pro. All Rights Reserved.</p>
          <p className="text-gray-400 mt-2 sm:mt-0">Built with ❤️ for Job Seekers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;