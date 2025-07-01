// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Eye, 
  EyeOff, 
  Save, 
  Download, 
  Undo, 
  Redo, 
  Plus, 
  Trash2, 
  Move, 
  Type, 
  Image, 
  Layout,
  Palette,
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Square,
  Circle,
  Minus,
  Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AICommandPortal from './AICommandPortal';
import { generateAIContent } from '../services/aiProviderService';

const CustomEditor = ({ formData, onClose, documentType = 'resume' }) => {
  const [mode, setMode] = useState('visual');
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [showElementsPanel, setShowElementsPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [draggedElement, setDraggedElement] = useState(null);
  const [showAICommandPortal, setShowAICommandPortal] = useState(false);
  const [aiCommandField, setAiCommandField] = useState('');
  const [aiCommandElement, setAiCommandElement] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  
  const previewRef = useRef(null);

  const availableElements = [
    { type: 'header', icon: Type, label: 'Header', defaultContent: 'Your Name' },
    { type: 'text', icon: Type, label: 'Text Block', defaultContent: 'Enter your text here...' },
    { type: 'section', icon: Layout, label: 'Section', defaultContent: 'Section Title' },
    { type: 'image', icon: Image, label: 'Image', defaultContent: '' },
    { type: 'list', icon: List, label: 'List', defaultContent: ['Item 1', 'Item 2', 'Item 3'] },
    { type: 'divider', icon: Minus, label: 'Divider', defaultContent: '' },
    { type: 'contact', icon: Link, label: 'Contact Info', defaultContent: 'email@example.com | +1 234 567 8900' },
    { type: 'skills', icon: Square, label: 'Skills', defaultContent: ['Skill 1', 'Skill 2', 'Skill 3'] },
    { type: 'experience', icon: Layout, label: 'Experience', defaultContent: { title: 'Job Title', company: 'Company', dates: '2020-2023', description: 'Job description...' } },
    { type: 'education', icon: Layout, label: 'Education', defaultContent: { degree: 'Degree', school: 'University', dates: '2020-2024', gpa: '3.8' } }
  ];

  useEffect(() => {
    initializeDefaultTemplate();
  }, [documentType]);

  const initializeDefaultTemplate = () => {
    const defaultElements = [
      {
        id: 'header-1',
        type: 'header',
        content: formData.name || 'Your Name',
        style: { fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', marginBottom: '1rem' }
      },
      {
        id: 'contact-1',
        type: 'contact',
        content: `${formData.email || 'email@example.com'} | ${formData.phone || '+1 234 567 8900'} | ${formData.location || 'City, State'}`,
        style: { fontSize: '1rem', color: '#6b7280', textAlign: 'center', marginBottom: '2rem' }
      }
    ];
    
    setElements(defaultElements);
    updateCode(defaultElements);
  };

  const updateCode = (newElements) => {
    const html = generateHTML(newElements);
    const css = generateCSS(newElements);
    setHtmlCode(html);
    setCssCode(css);
  };

  const generateHTML = (elements) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentType === 'resume' ? 'Resume' : 'Cover Letter'}</title>
    <style>
        ${generateCSS(elements)}
    </style>
</head>
<body>
    <div class="document-container">
        ${elements.map(element => generateElementHTML(element)).join('\n        ')}
    </div>
</body>
</html>`;
  };

  const generateCSS = (elements) => {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f8fafc;
}

.document-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

${elements.map(element => generateElementCSS(element)).join('\n')}

@media (max-width: 768px) {
    .document-container {
        padding: 1rem;
        margin: 0.5rem;
    }
}`;
  };

  const generateElementHTML = (element) => {
    switch (element.type) {
      case 'header':
        return `<h1 id="${element.id}" class="element-header">${element.content}</h1>`;
      case 'text':
        return `<p id="${element.id}" class="element-text">${element.content}</p>`;
      case 'section':
        return `<div id="${element.id}" class="element-section">
            <h2 class="section-title">${element.content}</h2>
        </div>`;
      case 'image':
        return `<img id="${element.id}" class="element-image" src="${element.content}" alt="Image" />`;
      case 'list':
        return `<ul id="${element.id}" class="element-list">
            ${Array.isArray(element.content) ? element.content.map(item => `<li>${item}</li>`).join('') : '<li>List item</li>'}
        </ul>`;
      case 'divider':
        return `<hr id="${element.id}" class="element-divider" />`;
      case 'contact':
        return `<div id="${element.id}" class="element-contact">${element.content}</div>`;
      case 'skills':
        return `<div id="${element.id}" class="element-skills">
            <h3>Skills</h3>
            <div class="skills-grid">
                ${Array.isArray(element.content) ? element.content.map(skill => `<span class="skill-tag">${skill}</span>`).join('') : '<span class="skill-tag">Skill</span>'}
            </div>
        </div>`;
      case 'experience':
        return `<div id="${element.id}" class="element-experience">
            <h3>${element.content.title || 'Job Title'}</h3>
            <p class="company">${element.content.company || 'Company'}</p>
            <p class="dates">${element.content.dates || 'Dates'}</p>
            <p>${element.content.description || 'Description'}</p>
        </div>`;
      case 'education':
        return `<div id="${element.id}" class="element-education">
            <h3>${element.content.degree || 'Degree'}</h3>
            <p class="school">${element.content.school || 'University'}</p>
            <p class="dates">${element.content.dates || 'Dates'}</p>
            <p class="gpa">GPA: ${element.content.gpa || '3.8'}</p>
        </div>`;
      default:
        return `<div id="${element.id}" class="element-${element.type}">${element.content}</div>`;
    }
  };

  const generateElementCSS = (element) => {
    const baseStyles = Object.entries(element.style || {}).map(([key, value]) => `${key}: ${value};`).join(' ');
    
    switch (element.type) {
      case 'header':
        return `#${element.id} {
    ${baseStyles}
    color: #2563eb;
    margin-bottom: 1rem;
}`;
      case 'text':
        return `#${element.id} {
    ${baseStyles}
    margin-bottom: 1rem;
}`;
      case 'section':
        return `#${element.id} .section-title {
    ${baseStyles}
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}`;
      case 'image':
        return `#${element.id} {
    ${baseStyles}
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}`;
      case 'list':
        return `#${element.id} {
    ${baseStyles}
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

#${element.id} li {
    margin-bottom: 0.5rem;
}`;
      case 'divider':
        return `#${element.id} {
    ${baseStyles}
    border: none;
    height: 1px;
    background: #e5e7eb;
    margin: 1rem 0;
}`;
      case 'contact':
        return `#${element.id} {
    ${baseStyles}
    margin-bottom: 2rem;
}`;
      case 'skills':
        return `#${element.id} {
    ${baseStyles}
    margin-bottom: 2rem;
}

#${element.id} .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

#${element.id} .skill-tag {
    background: #dbeafe;
    color: #2563eb;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
}`;
      case 'experience':
      case 'education':
        return `#${element.id} {
    ${baseStyles}
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-left: 3px solid #2563eb;
    background: #f8fafc;
}

#${element.id} h3 {
    color: #2563eb;
    margin-bottom: 0.5rem;
}

#${element.id} .company,
#${element.id} .school {
    font-weight: 600;
    color: #374151;
}

#${element.id} .dates {
    color: #6b7280;
    font-size: 0.875rem;
}`;
      default:
        return `#${element.id} {
    ${baseStyles}
}`;
    }
  };

  const addElement = (elementType) => {
    const element = availableElements.find(el => el.type === elementType);
    if (!element) return;

    const newElement = {
      id: `${elementType}-${Date.now()}`,
      type: elementType,
      content: element.defaultContent,
      style: getDefaultStyle(elementType)
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    updateCode(newElements);
    setSelectedElement(newElement);
  };

  const getDefaultStyle = (type) => {
    switch (type) {
      case 'header':
        return { fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' };
      case 'text':
        return { fontSize: '1rem', color: '#374151', marginBottom: '1rem' };
      case 'section':
        return { fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' };
      case 'image':
        return { maxWidth: '200px', height: 'auto', borderRadius: '8px' };
      case 'list':
        return { marginLeft: '1.5rem', marginBottom: '1rem' };
      case 'divider':
        return { border: 'none', height: '1px', background: '#e5e7eb', margin: '1rem 0' };
      case 'contact':
        return { fontSize: '1rem', color: '#6b7280', textAlign: 'center', marginBottom: '2rem' };
      case 'skills':
        return { marginBottom: '2rem' };
      case 'experience':
      case 'education':
        return { marginBottom: '1.5rem', padding: '1rem', borderLeft: '3px solid #2563eb', background: '#f8fafc' };
      default:
        return {};
    }
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    updateCode(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    updateCode(newElements);
  };

  const handleDragStart = (e, element) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetElement) => {
    e.preventDefault();
    if (!draggedElement || draggedElement.id === targetElement.id) return;

    const draggedIndex = elements.findIndex(el => el.id === draggedElement.id);
    const targetIndex = elements.findIndex(el => el.id === targetElement.id);

    const newElements = [...elements];
    const [removed] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, removed);

    setElements(newElements);
    updateCode(newElements);
    setDraggedElement(null);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleAISuggest = (element) => {
    setAiCommandElement(element);
    setAiCommandField(element.type);
    setShowAICommandPortal(true);
  };

  const handleAICommandGenerate = async (command, mode) => {
    setShowAICommandPortal(false);
    setAiLoading(true);
    
    let prompt;
    const currentContent = aiCommandElement?.content || '';
    
    if (mode === 'write') {
      // Writing new content
      prompt = `${command}\n\nContext: ${JSON.stringify(formData)}\n\nGenerate professional content for a ${aiCommandElement?.type} element in a ${documentType}.`;
    } else {
      // Improving existing content
      prompt = `${command}\n\nCurrent content: ${currentContent}\n\nContext: ${JSON.stringify(formData)}\n\nImprove and enhance the existing content for a ${aiCommandElement?.type} element in a ${documentType}.`;
    }

    try {
      const aiSuggestion = await generateAIContent(prompt, { max_tokens: 300, temperature: 0.7 });
      updateElement(aiCommandElement.id, { content: aiSuggestion });
    } catch (e) {
      alert('All AI providers are unavailable or rate-limited. Please try again later.');
    }
    
    setAiLoading(false);
  };

  const handleDownload = async (format) => {
    if (!previewRef.current) return;
    
    const canvas = await html2canvas(previewRef.current, { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: '#ffffff' 
    });
    
    const a = document.createElement('a');
    switch (format) {
      case 'png':
        a.href = canvas.toDataURL('image/png');
        a.download = `${documentType}.png`;
        break;
      case 'jpeg':
        a.href = canvas.toDataURL('image/jpeg', 0.9);
        a.download = `${documentType}.jpeg`;
        break;
      case 'pdf':
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ 
          orientation: 'portrait', 
          unit: 'px', 
          format: [canvas.width, canvas.height] 
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${documentType}.pdf`);
        return;
      case 'html':
        const blob = new Blob([htmlCode], { type: 'text/html' });
        a.href = URL.createObjectURL(blob);
        a.download = `${documentType}.html`;
        break;
    }
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              Custom {documentType === 'resume' ? 'Resume' : 'Cover Letter'} Editor
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMode('visual')}
                className={`px-3 py-1 rounded ${mode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => setMode('code')}
                className={`px-3 py-1 rounded ${mode === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Code className="h-4 w-4 inline mr-1" />
                Code Editor
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 absolute top-4 right-6 z-20">
            <button onClick={() => setMode('visual')} title="Visual Editor" className={`p-2 rounded-full ${mode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-600'} hover:bg-blue-700 hover:text-white transition`}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
            </button>
            <button onClick={() => setMode('code')} title="Code Editor" className={`p-2 rounded-full ${mode === 'code' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-purple-600'} hover:bg-purple-700 hover:text-white transition`}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
            </button>
            <button onClick={() => handleDownload('pdf')} title="Download PDF" className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
            <button onClick={() => handleDownload('html')} title="Download HTML" className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition">HTML</button>
            <button onClick={onClose} title="Close" className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition">×</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {mode === 'visual' ? (
            <>
              {/* Elements Panel */}
              {showElementsPanel && (
                <div className="w-64 bg-gray-50 border-r overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Elements</h3>
                    <div className="space-y-2">
                      {availableElements.map((element) => (
                        <button
                          key={element.type}
                          onClick={() => addElement(element.type)}
                          className="w-full flex items-center space-x-2 p-3 text-left bg-white rounded border hover:bg-gray-50 transition-colors"
                        >
                          <element.icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">{element.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Editor Area */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b px-4 py-2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowElementsPanel(!showElementsPanel)}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Layout className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
                    className={`p-2 rounded ${showPropertiesPanel ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    title="Toggle Properties Panel"
                  >
                    <Palette className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setAiCommandElement({ type: 'general', content: '' });
                      setAiCommandField('general');
                      setShowAICommandPortal(true);
                    }}
                    className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    title="AI Assistant"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>

                {/* Document Area */}
                <div className="flex-1 flex">
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                      {elements.map((element) => (
                        <div
                          key={element.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, element)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, element)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedElement(element)}
                          className={`relative p-2 border-2 rounded cursor-pointer mb-2 ${
                            selectedElement?.id === element.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
                          } ${draggedElement?.id === element.id ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Move className="h-3 w-3 text-gray-400 cursor-move" />
                              <span className="text-xs font-medium text-gray-600 uppercase">
                                {element.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAISuggest(element);
                                }}
                                className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                                title="AI Suggestion"
                              >
                                <Sparkles className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteElement(element.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Delete Element"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          
                          <div
                            style={element.style}
                            className="min-h-[2rem] flex items-center"
                          >
                            {element.type === 'image' ? (
                              <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center">
                                <Image className="h-8 w-8 text-gray-400" />
                              </div>
                            ) : (
                              <div>{element.content}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Properties Panel */}
                  {showPropertiesPanel && selectedElement && (
                    <div className="w-80 bg-gray-50 border-l overflow-y-auto">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
                        
                        {/* Content */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                          </label>
                          <input
                            type="text"
                            value={selectedElement.content}
                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Style Properties */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Font Size
                            </label>
                            <input
                              type="text"
                              value={selectedElement.style?.fontSize || ''}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                style: { ...selectedElement.style, fontSize: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              placeholder="1rem"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Color
                            </label>
                            <input
                              type="color"
                              value={selectedElement.style?.color || '#000000'}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                style: { ...selectedElement.style, color: e.target.value }
                              })}
                              className="w-full h-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text Align
                            </label>
                            <div className="flex space-x-1">
                              {['left', 'center', 'right'].map((align) => (
                                <button
                                  key={align}
                                  onClick={() => updateElement(selectedElement.id, { 
                                    style: { ...selectedElement.style, textAlign: align }
                                  })}
                                  className={`p-2 border rounded ${
                                    selectedElement.style?.textAlign === align ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                                  }`}
                                >
                                  {align === 'left' && <AlignLeft className="h-4 w-4" />}
                                  {align === 'center' && <AlignCenter className="h-4 w-4" />}
                                  {align === 'right' && <AlignRight className="h-4 w-4" />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Code Editor Mode */
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex">
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">HTML</h3>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter HTML code..."
                    />
                  </div>
                  <div className="flex-1 p-4 border-l">
                    <h3 className="font-semibold text-gray-900 mb-2">CSS</h3>
                    <textarea
                      value={cssCode}
                      onChange={(e) => setCssCode(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter CSS code..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-96 bg-white border-l overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                <div 
                  ref={previewRef}
                  className="bg-white border rounded p-4 min-h-[500px]"
                  dangerouslySetInnerHTML={{ __html: htmlCode.replace('</style>', `${cssCode}\n    </style>`) }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading Overlay */}
      {aiLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-lg font-medium">AI is generating content...</span>
          </div>
        </div>
      )}
      
      {showAICommandPortal && (
        <AICommandPortal
          isOpen={showAICommandPortal}
          onClose={() => setShowAICommandPortal(false)}
          onGenerate={handleAICommandGenerate}
          fieldName={aiCommandField}
          currentContent={aiCommandElement?.content || ''}
          documentType={documentType}
          formData={formData}
        />
      )}
    </div>
  );
};

export default CustomEditor; 