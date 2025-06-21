import React from 'react';
import { Download } from 'lucide-react';

const CoverLetterPreview = ({ content, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Cover Letter Preview</h3>
        <button
          onClick={onDownload}
          className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
      </div>
      
      <div className="p-6">
        <div 
          id="cover-letter-content"
          className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
        />
      </div>
    </div>
  );
};

export default CoverLetterPreview;