import { supabase } from '../config/supabase';

// AI Learning Service - Tracks interactions and improves responses
class AILearningService {
  constructor() {
    this.interactionBuffer = [];
    this.maxBufferSize = 50;
    this.learningEnabled = true;
  }

  // Track user interaction for learning
  async trackInteraction(interaction) {
    if (!this.learningEnabled) return;

    const enrichedInteraction = {
      ...interaction,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      performance_metrics: this.getPerformanceMetrics()
    };

    this.interactionBuffer.push(enrichedInteraction);

    // Save to database
    await this.saveInteraction(enrichedInteraction);

    // Process buffer if full
    if (this.interactionBuffer.length >= this.maxBufferSize) {
      await this.processLearningBatch();
    }
  }

  // Track AI command and response
  async trackAICommand(command, response, success = true, userFeedback = null) {
    await this.trackInteraction({
      type: 'ai_command',
      command: command,
      response: response,
      success: success,
      user_feedback: userFeedback,
      response_time: this.getResponseTime(),
      command_complexity: this.analyzeComplexity(command),
      response_quality: this.analyzeResponseQuality(response)
    });
  }

  // Track user errors and mistakes
  async trackError(error, context = {}) {
    await this.trackInteraction({
      type: 'error',
      error_message: error.message,
      error_stack: error.stack,
      error_type: error.name,
      context: context,
      severity: this.analyzeErrorSeverity(error),
      recovery_action: this.suggestRecoveryAction(error)
    });
  }

  // Track user corrections and improvements
  async trackCorrection(originalResponse, correctedResponse, correctionType) {
    await this.trackInteraction({
      type: 'correction',
      original_response: originalResponse,
      corrected_response: correctedResponse,
      correction_type: correctionType,
      improvement_score: this.calculateImprovementScore(originalResponse, correctedResponse)
    });
  }

  // Track user preferences and patterns
  async trackUserPreference(preference, value, context = {}) {
    await this.trackInteraction({
      type: 'preference',
      preference_key: preference,
      preference_value: value,
      context: context,
      timestamp: new Date().toISOString()
    });
  }

  // Learn from successful patterns
  async learnFromSuccess(command, response, userSatisfaction) {
    const learningData = {
      command_pattern: this.extractPattern(command),
      response_template: this.extractTemplate(response),
      success_factors: this.analyzeSuccessFactors(command, response),
      user_satisfaction: userSatisfaction,
      context: this.getCurrentContext()
    };

    await this.saveLearningData(learningData);
  }

  // Learn from failures and improve
  async learnFromFailure(command, failedResponse, userCorrection) {
    const failureData = {
      command_pattern: this.extractPattern(command),
      failed_response: failedResponse,
      user_correction: userCorrection,
      failure_reasons: this.analyzeFailureReasons(command, failedResponse),
      improvement_suggestions: this.generateImprovementSuggestions(command, userCorrection)
    };

    await this.saveFailureData(failureData);
  }

  // Get improved response based on learning
  async getImprovedResponse(command, context = {}) {
    const learningData = await this.getRelevantLearningData(command);
    const userPreferences = await this.getUserPreferences();
    const commonPatterns = await this.getCommonPatterns();

    return this.generateImprovedResponse(command, learningData, userPreferences, commonPatterns, context);
  }

  // Analyze command complexity
  analyzeComplexity(command) {
    const factors = {
      length: command.length,
      wordCount: command.split(' ').length,
      hasSpecialChars: /[^a-zA-Z0-9\s]/.test(command),
      hasNumbers: /\d/.test(command),
      hasUrls: /https?:\/\//.test(command),
      hasEmails: /\S+@\S+\.\S+/.test(command)
    };

    let complexity = 0;
    complexity += factors.length > 100 ? 3 : factors.length > 50 ? 2 : 1;
    complexity += factors.wordCount > 10 ? 2 : factors.wordCount > 5 ? 1 : 0;
    complexity += factors.hasSpecialChars ? 1 : 0;
    complexity += factors.hasNumbers ? 1 : 0;
    complexity += factors.hasUrls ? 2 : 0;
    complexity += factors.hasEmails ? 1 : 0;

    return Math.min(complexity, 10); // Scale 1-10
  }

  // Analyze response quality
  analyzeResponseQuality(response) {
    const factors = {
      length: response.length,
      hasCode: /```[\s\S]*```/.test(response),
      hasLinks: /\[.*?\]\(.*?\)/.test(response),
      hasLists: /^\s*[-*+]\s/.test(response),
      hasHeaders: /^#{1,6}\s/.test(response),
      completeness: this.assessCompleteness(response),
      clarity: this.assessClarity(response)
    };

    let quality = 0;
    quality += factors.length > 200 ? 3 : factors.length > 100 ? 2 : 1;
    quality += factors.hasCode ? 2 : 0;
    quality += factors.hasLinks ? 1 : 0;
    quality += factors.hasLists ? 1 : 0;
    quality += factors.hasHeaders ? 1 : 0;
    quality += factors.completeness * 2;
    quality += factors.clarity * 2;

    return Math.min(quality, 10); // Scale 1-10
  }

  // Assess response completeness
  assessCompleteness(response) {
    let score = 0;
    if (response.includes('```')) score += 0.3;
    if (response.includes('##') || response.includes('###')) score += 0.2;
    if (response.includes('- ') || response.includes('* ')) score += 0.2;
    if (response.includes('**') || response.includes('__')) score += 0.1;
    if (response.length > 500) score += 0.2;
    return Math.min(score, 1);
  }

  // Assess response clarity
  assessClarity(response) {
    let score = 0;
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    if (avgSentenceLength < 100) score += 0.3;
    if (response.includes('Here') || response.includes('Let me')) score += 0.2;
    if (response.includes('First') || response.includes('Next') || response.includes('Finally')) score += 0.2;
    if (response.includes('example') || response.includes('Example')) score += 0.2;
    if (response.includes('**') || response.includes('__')) score += 0.1;
    
    return Math.min(score, 1);
  }

  // Extract command patterns
  extractPattern(command) {
    const patterns = {
      create: /create|make|build|generate/i,
      update: /update|modify|change|edit/i,
      delete: /delete|remove|drop/i,
      show: /show|display|view|list/i,
      help: /help|assist|support/i,
      explain: /explain|describe|tell/i,
      fix: /fix|repair|resolve/i,
      improve: /improve|enhance|optimize/i
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      if (pattern.test(command)) {
        return key;
      }
    }
    return 'general';
  }

  // Extract response template
  extractTemplate(response) {
    const templates = {
      code_block: /```[\s\S]*```/,
      list: /^\s*[-*+]\s/m,
      numbered_list: /^\s*\d+\.\s/m,
      headers: /^#{1,6}\s/m,
      bold: /\*\*.*?\*\*/,
      italic: /\*.*?\*/,
      links: /\[.*?\]\(.*?\)/,
      tables: /\|.*\|/
    };

    const foundTemplates = [];
    for (const [key, template] of Object.entries(templates)) {
      if (template.test(response)) {
        foundTemplates.push(key);
      }
    }
    return foundTemplates;
  }

  // Analyze error severity
  analyzeErrorSeverity(error) {
    if (error.message.includes('network') || error.message.includes('fetch')) return 'high';
    if (error.message.includes('auth') || error.message.includes('permission')) return 'high';
    if (error.message.includes('validation') || error.message.includes('format')) return 'medium';
    if (error.message.includes('not found') || error.message.includes('404')) return 'medium';
    return 'low';
  }

  // Suggest recovery actions
  suggestRecoveryAction(error) {
    const suggestions = {
      network: 'retry_connection',
      auth: 'reauthenticate',
      validation: 'validate_input',
      not_found: 'check_resource',
      permission: 'check_permissions',
      default: 'show_error_message'
    };

    if (error.message.includes('network')) return suggestions.network;
    if (error.message.includes('auth')) return suggestions.auth;
    if (error.message.includes('validation')) return suggestions.validation;
    if (error.message.includes('not found')) return suggestions.not_found;
    if (error.message.includes('permission')) return suggestions.permission;
    return suggestions.default;
  }

  // Calculate improvement score
  calculateImprovementScore(original, corrected) {
    const originalQuality = this.analyzeResponseQuality(original);
    const correctedQuality = this.analyzeResponseQuality(corrected);
    return Math.max(0, correctedQuality - originalQuality);
  }

  // Get current context
  getCurrentContext() {
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_size: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('ai_learning_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('ai_learning_session_id', sessionId);
    }
    return sessionId;
  }

  // Get performance metrics
  getPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      return {
        page_load_time: timing.loadEventEnd - timing.navigationStart,
        dom_ready_time: timing.domContentLoadedEventEnd - timing.navigationStart,
        first_paint: timing.responseEnd - timing.navigationStart
      };
    }
    return {};
  }

  // Get response time
  getResponseTime() {
    return Date.now() - (this.lastCommandTime || Date.now());
  }

  // Database operations
  async saveInteraction(interaction) {
    try {
      const { error } = await supabase
        .from('ai_interactions')
        .insert([interaction]);
      
      if (error) {
        console.error('Error saving interaction:', error);
      }
    } catch (err) {
      console.error('Exception saving interaction:', err);
    }
  }

  async saveLearningData(learningData) {
    try {
      const { error } = await supabase
        .from('ai_learning_data')
        .insert([learningData]);
      
      if (error) {
        console.error('Error saving learning data:', error);
      }
    } catch (err) {
      console.error('Exception saving learning data:', err);
    }
  }

  async saveFailureData(failureData) {
    try {
      const { error } = await supabase
        .from('ai_failure_data')
        .insert([failureData]);
      
      if (error) {
        console.error('Error saving failure data:', error);
      }
    } catch (err) {
      console.error('Exception saving failure data:', err);
    }
  }

  async getRelevantLearningData(command) {
    try {
      const pattern = this.extractPattern(command);
      const { data, error } = await supabase
        .from('ai_learning_data')
        .select('*')
        .eq('command_pattern', pattern)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching learning data:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching learning data:', err);
      return [];
    }
  }

  async getUserPreferences() {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('preference_key, preference_value')
        .eq('type', 'preference')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return {};
      }
      
      const preferences = {};
      (data || []).forEach(item => {
        preferences[item.preference_key] = item.preference_value;
      });
      
      return preferences;
    } catch (err) {
      console.error('Exception fetching user preferences:', err);
      return {};
    }
  }

  async getCommonPatterns() {
    try {
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('command_pattern, COUNT(*) as count')
        .eq('type', 'ai_command')
        .group('command_pattern')
        .order('count', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching common patterns:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching common patterns:', err);
      return [];
    }
  }

  // Process learning batch
  async processLearningBatch() {
    if (this.interactionBuffer.length === 0) return;

    const batch = this.interactionBuffer.splice(0, this.maxBufferSize);
    
    // Analyze patterns in batch
    const patterns = this.analyzeBatchPatterns(batch);
    
    // Update learning models
    await this.updateLearningModels(patterns);
    
    // Clear processed interactions
    this.interactionBuffer = [];
  }

  // Analyze batch patterns
  analyzeBatchPatterns(batch) {
    const patterns = {
      command_types: {},
      error_types: {},
      success_rates: {},
      user_preferences: {},
      response_qualities: []
    };

    batch.forEach(interaction => {
      if (interaction.type === 'ai_command') {
        patterns.command_types[interaction.command_pattern] = 
          (patterns.command_types[interaction.command_pattern] || 0) + 1;
        
        patterns.response_qualities.push(interaction.response_quality);
        
        if (interaction.success) {
          patterns.success_rates[interaction.command_pattern] = 
            (patterns.success_rates[interaction.command_pattern] || 0) + 1;
        }
      } else if (interaction.type === 'error') {
        patterns.error_types[interaction.error_type] = 
          (patterns.error_types[interaction.error_type] || 0) + 1;
      } else if (interaction.type === 'preference') {
        patterns.user_preferences[interaction.preference_key] = interaction.preference_value;
      }
    });

    return patterns;
  }

  // Update learning models
  async updateLearningModels(patterns) {
    try {
      const { error } = await supabase
        .from('ai_learning_models')
        .upsert([{
          model_type: 'pattern_analysis',
          patterns: patterns,
          updated_at: new Date().toISOString()
        }], { onConflict: 'model_type' });
      
      if (error) {
        console.error('Error updating learning models:', error);
      }
    } catch (err) {
      console.error('Exception updating learning models:', err);
    }
  }

  // Generate improved response
  generateImprovedResponse(command, learningData, userPreferences, commonPatterns, context) {
    // This is a simplified version - in a real implementation, you'd use ML models
    const pattern = this.extractPattern(command);
    const relevantLearning = learningData.find(d => d.command_pattern === pattern);
    
    let improvedResponse = command;
    
    // Apply learned improvements
    if (relevantLearning) {
      improvedResponse += `\n\nBased on previous successful interactions, here's an improved approach:`;
      improvedResponse += `\n\n**Key Success Factors:**`;
      relevantLearning.success_factors.forEach(factor => {
        improvedResponse += `\n- ${factor}`;
      });
    }
    
    // Apply user preferences
    if (userPreferences.response_style) {
      improvedResponse += `\n\n**Response Style:** ${userPreferences.response_style}`;
    }
    
    // Apply common patterns
    if (commonPatterns.length > 0) {
      improvedResponse += `\n\n**Common Patterns:**`;
      commonPatterns.slice(0, 3).forEach(pattern => {
        improvedResponse += `\n- ${pattern.command_pattern}: ${pattern.count} times`;
      });
    }
    
    return improvedResponse;
  }

  // Enable/disable learning
  setLearningEnabled(enabled) {
    this.learningEnabled = enabled;
    localStorage.setItem('ai_learning_enabled', enabled.toString());
  }

  // Get learning status
  isLearningEnabled() {
    return this.learningEnabled;
  }

  // Get learning statistics
  async getLearningStats() {
    try {
      const { data: interactions, error: interactionsError } = await supabase
        .from('ai_interactions')
        .select('type, COUNT(*) as count')
        .group('type');

      const { data: learningData, error: learningError } = await supabase
        .from('ai_learning_data')
        .select('COUNT(*) as count');

      const { data: failures, error: failuresError } = await supabase
        .from('ai_failure_data')
        .select('COUNT(*) as count');

      return {
        total_interactions: interactions?.reduce((sum, item) => sum + parseInt(item.count), 0) || 0,
        interaction_types: interactions || [],
        learning_entries: learningData?.[0]?.count || 0,
        failure_entries: failures?.[0]?.count || 0,
        learning_enabled: this.learningEnabled
      };
    } catch (err) {
      console.error('Error getting learning stats:', err);
      return {
        total_interactions: 0,
        interaction_types: [],
        learning_entries: 0,
        failure_entries: 0,
        learning_enabled: this.learningEnabled
      };
    }
  }
}

// Create singleton instance
const aiLearningService = new AILearningService();

export default aiLearningService; 