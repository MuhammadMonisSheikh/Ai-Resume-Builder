import { supabase } from '../config/supabase';

// Template Service - Generates layouts and data based on AI commands
class TemplateService {
  constructor() {
    this.templates = {
      resume: {
        layouts: ['classic', 'modern', 'creative', 'professional', 'minimal', 'executive'],
        sections: ['header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
        dataTypes: ['personal', 'professional', 'academic', 'creative']
      },
      coverLetter: {
        layouts: ['classic', 'modern', 'professional', 'creative', 'minimal'],
        sections: ['header', 'greeting', 'introduction', 'body', 'closing', 'signature'],
        dataTypes: ['job_application', 'internship', 'freelance', 'academic']
      },
      portfolio: {
        layouts: ['showcase', 'timeline', 'grid', 'minimal', 'creative'],
        sections: ['hero', 'about', 'projects', 'skills', 'contact', 'blog'],
        dataTypes: ['developer', 'designer', 'writer', 'photographer', 'consultant']
      },
      cv: {
        layouts: ['academic', 'research', 'professional', 'international'],
        sections: ['personal', 'education', 'research', 'publications', 'conferences', 'awards'],
        dataTypes: ['phd', 'postdoc', 'researcher', 'professor']
      }
    };

    this.commandPatterns = {
      create: /create|make|build|generate|new/i,
      update: /update|modify|change|edit|revise/i,
      delete: /delete|remove|drop|clear/i,
      show: /show|display|view|list|see/i,
      help: /help|assist|support|guide/i,
      explain: /explain|describe|tell|what|how/i,
      fix: /fix|repair|resolve|correct/i,
      improve: /improve|enhance|optimize|better/i,
      template: /template|layout|design|style/i,
      format: /format|structure|organize/i
    };

    this.contentTypes = {
      resume: /resume|cv|curriculum vitae|professional summary/i,
      coverLetter: /cover letter|application letter|motivation letter|letter of intent/i,
      portfolio: /portfolio|showcase|work samples|projects/i,
      cv: /academic cv|research cv|scholarly cv/i
    };
  }

  // Analyze command and determine template requirements
  async analyzeCommand(command) {
    const contentType = this.detectContentType(command);
    const layout = this.suggestLayout(command, contentType);
    const sections = this.suggestSections(command, contentType);
    
    return {
      contentType,
      layout,
      sections,
      template: await this.getTemplate(contentType, layout),
      suggestions: this.generateSuggestions(contentType, layout, sections)
    };
  }

  // Detect content type from command
  detectContentType(command) {
    for (const [type, pattern] of Object.entries(this.contentTypes)) {
      if (pattern.test(command)) return type;
    }
    return 'resume'; // default
  }

  // Suggest layout based on command
  suggestLayout(command, contentType) {
    if (/modern|contemporary/i.test(command)) return 'modern';
    if (/creative|artistic/i.test(command)) return 'creative';
    if (/professional|business/i.test(command)) return 'professional';
    if (/minimal|simple/i.test(command)) return 'minimal';
    if (/executive|senior/i.test(command)) return 'executive';
    return 'professional'; // default
  }

  // Suggest sections based on command
  suggestSections(command, contentType) {
    const baseSections = {
      resume: ['header', 'summary', 'experience', 'education', 'skills'],
      coverLetter: ['header', 'greeting', 'introduction', 'body', 'closing', 'signature'],
      portfolio: ['hero', 'about', 'projects', 'skills', 'contact'],
      cv: ['personal', 'education', 'research', 'publications', 'conferences']
    };

    return baseSections[contentType] || baseSections.resume;
  }

  // Get template based on analysis
  async getTemplate(contentType, layout) {
    try {
      const { data, error } = await supabase
        .from('ai_templates')
        .select('*')
        .eq('content_type', contentType)
        .eq('layout', layout)
        .single();

      return data || this.getDefaultTemplate(contentType, layout);
    } catch (err) {
      return this.getDefaultTemplate(contentType, layout);
    }
  }

  // Get default template
  getDefaultTemplate(contentType, layout) {
    return {
      name: `${layout} ${contentType}`,
      layout: layout,
      sections: this.suggestSections('', contentType),
      style: 'standard'
    };
  }

  // Generate template data based on command
  async generateTemplateData(command, analysis) {
    return {
      metadata: analysis,
      content: this.generateContent(analysis),
      styling: this.generateStyling(analysis)
    };
  }

  // Generate content based on command
  generateContent(analysis) {
    const { contentType, sections } = analysis;
    
    if (contentType === 'resume') {
      return {
        header: {
          name: 'Your Name',
          title: 'Professional Title',
          email: 'your.email@example.com',
          phone: '+1 (555) 123-4567'
        },
        summary: {
          text: 'Professional summary text'
        },
        experience: [
          {
            title: 'Job Title',
            company: 'Company Name',
            duration: '2020 - Present',
            description: 'Job description'
          }
        ]
      };
    }
    
    return {};
  }

  // Generate styling based on analysis
  generateStyling(analysis) {
    const { layout } = analysis;
    
    const styles = {
      professional: {
        colors: ['#2c3e50', '#34495e', '#ecf0f1'],
        fonts: ['Arial', 'Helvetica', 'sans-serif']
      },
      modern: {
        colors: ['#3498db', '#2980b9', '#f8f9fa'],
        fonts: ['Roboto', 'Open Sans', 'sans-serif']
      },
      creative: {
        colors: ['#e74c3c', '#f39c12', '#9b59b6'],
        fonts: ['Playfair Display', 'Lato', 'serif']
      }
    };
    
    return styles[layout] || styles.professional;
  }

  // Generate suggestions based on analysis and template
  generateSuggestions(contentType, layout, sections) {
    return [
      {
        type: 'template',
        message: `Using ${layout} template for ${contentType}`,
        priority: 'high'
      }
    ];
  }

  // Save template to database
  async saveTemplate(template) {
    try {
      const { data, error } = await supabase
        .from('ai_templates')
        .upsert([template], { onConflict: 'id' });

      if (error) {
        console.error('Error saving template:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception saving template:', err);
      return false;
    }
  }

  // Get all templates
  async getAllTemplates() {
    try {
      const { data, error } = await supabase
        .from('ai_templates')
        .select('*')
        .order('content_type', { ascending: true });

      if (error) {
        console.error('Error fetching templates:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception fetching templates:', err);
      return [];
    }
  }

  // Get templates by content type
  async getTemplatesByType(contentType) {
    try {
      const { data, error } = await supabase
        .from('ai_templates')
        .select('*')
        .eq('content_type', contentType)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching templates by type:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception fetching templates by type:', err);
      return [];
    }
  }
}

// Create singleton instance
const templateService = new TemplateService();

export default templateService; 