// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState, useEffect, useRef } from 'react';
import { Download, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CoverLetterPreview = ({ content }) => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const downloadMenuRef = useRef(null);
  const coverLetterPreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format) => {
    if (!coverLetterPreviewRef.current) return;
    setIsDownloading(true);
    setShowDownloadOptions(false);

    const canvas = await html2canvas(coverLetterPreviewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

    switch (format) {
      case 'png': {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'cover-letter.png';
        a.click();
        break;
      }
      case 'jpeg': {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/jpeg', 0.9);
        a.download = 'cover-letter.jpeg';
        a.click();
        break;
      }
      case 'pdf': {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('cover-letter.pdf');
        break;
      }
    }
    setIsDownloading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Cover Letter Preview</h3>
        <div ref={downloadMenuRef} className="relative">
          <button
            onClick={() => setShowDownloadOptions(p => !p)}
            className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            <span>Download</span>
          </button>
          {showDownloadOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as PDF</button>
              <button onClick={() => handleDownload('png')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as PNG</button>
              <button onClick={() => handleDownload('jpeg')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Download as JPEG</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative p-6">
        <div 
          ref={coverLetterPreviewRef}
          className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
        />
        {isDownloading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
            <p className="text-lg font-semibold">Downloading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPreview;