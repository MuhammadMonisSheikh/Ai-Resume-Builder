# Template System Setup Guide

## Overview

The Template System is an AI-powered feature that automatically analyzes user commands and generates appropriate document templates with layouts and data. It understands natural language requests and suggests the best templates based on content type, style preferences, and context.

## Features

### 🎯 **Smart Command Analysis**
- Analyzes natural language commands to determine document type
- Suggests appropriate layouts (professional, modern, creative, minimal, executive)
- Identifies required sections based on command context
- Extracts user preferences and requirements

### 📊 **Template Management**
- Database-driven template storage with usage tracking
- Success rate monitoring and analytics
- Template recommendations based on user behavior
- Layout configuration and styling presets

### 🔄 **Dynamic Content Generation**
- Generates template data based on command analysis
- Creates appropriate content structure for different document types
- Applies styling based on layout preferences
- Supports multiple content types (resume, cover letter, portfolio, CV)

### 📈 **Analytics & Insights**
- Usage statistics and success rates
- Popular template tracking
- User behavior analysis
- Performance metrics

## Database Setup

### 1. Run the Template Database Script

Execute the `template_setup.sql` script in your Supabase SQL Editor:

```sql
-- This creates all necessary tables, indexes, and functions
-- Run the entire template_setup.sql file
```

### 2. Verify Database Tables

After running the script, you should have these tables:

- `ai_templates` - Stores template definitions
- `template_layouts` - Stores layout configurations
- `template_data` - Stores template content data
- `template_usage` - Tracks template usage and success rates

### 3. Check Default Data

The script includes default templates for:
- **Resumes**: Professional, Creative, Modern, Executive, Minimal
- **Cover Letters**: Professional, Modern, Creative
- **Portfolios**: Showcase, Timeline
- **CVs**: Academic, Research

## Usage

### 1. Access Template Dashboard

1. Click the **Layout** icon in the header (orange icon)
2. Or access via user menu → Templates
3. The dashboard shows all available templates and analytics

### 2. Test Command Analysis

1. In the Template Dashboard, use the "Test Template Analysis" panel
2. Enter a natural language command like:
   - "Create a modern professional resume for a software developer"
   - "Make a creative cover letter for a design position"
   - "Generate an executive resume for senior management"
3. Click "Analyze Command" to see the AI's analysis

### 3. View Analysis Results

The system will show:
- **Content Type**: resume, cover letter, portfolio, or CV
- **Suggested Layout**: professional, modern, creative, etc.
- **Sections**: header, summary, experience, education, skills, etc.
- **Selected Template**: the best matching template from the database

### 4. Generate Template Data

Click "Generate Template Data" to create:
- **Metadata**: analysis results and context
- **Content**: structured data for the document
- **Styling**: colors, fonts, and layout preferences

## Command Examples

### Resume Commands
```
"Create a professional resume for a marketing manager"
"Make a modern creative resume for a graphic designer"
"Generate an executive resume for a CEO position"
"Build a minimal resume for a student"
"Create a detailed resume with projects section"
```

### Cover Letter Commands
```
"Write a professional cover letter for a job application"
"Create a modern cover letter for a tech position"
"Generate a creative cover letter for a freelance project"
"Make a formal cover letter for an internship"
```

### Portfolio Commands
```
"Create a showcase portfolio for a web developer"
"Build a timeline portfolio for a photographer"
"Generate a creative portfolio for an artist"
```

### CV Commands
```
"Create an academic CV for a PhD candidate"
"Generate a research CV for a postdoc position"
"Make a comprehensive CV for a professor"
```

## Template Types

### Resume Templates

| Layout | Style | Best For |
|--------|-------|----------|
| Professional | Clean, corporate | Business roles, corporate environments |
| Modern | Contemporary, sleek | Tech companies, startups |
| Creative | Artistic, innovative | Design, creative industries |
| Executive | Formal, authoritative | Senior positions, leadership roles |
| Minimal | Simple, clean | Students, entry-level positions |

### Cover Letter Templates

| Layout | Style | Best For |
|--------|-------|----------|
| Professional | Formal, business-like | Traditional companies |
| Modern | Contemporary, engaging | Startups, modern companies |
| Creative | Artistic, innovative | Creative industries, freelance |

### Portfolio Templates

| Layout | Style | Best For |
|--------|-------|----------|
| Showcase | Dynamic, interactive | Developers, designers |
| Timeline | Chronological, organized | Photographers, artists |

### CV Templates

| Layout | Style | Best For |
|--------|-------|----------|
| Academic | Scholarly, comprehensive | Researchers, academics |
| Research | Research-focused, detailed | Scientists, postdocs |

## Integration with AI Learning

The Template System integrates with the AI Learning System:

1. **Command Analysis**: Uses learned patterns to better understand user intent
2. **Template Selection**: Learns from successful template choices
3. **Success Tracking**: Monitors which templates work best for different commands
4. **Continuous Improvement**: Updates recommendations based on user feedback

## Customization

### Adding New Templates

1. **Database Method**:
   ```sql
   INSERT INTO ai_templates (name, content_type, layout, data_type, sections, style, description)
   VALUES ('Custom Template', 'resume', 'custom', 'professional', 
           '["header", "summary", "experience", "skills"]', 
           'custom style', 'Custom template description');
   ```

2. **Code Method**: Add to the `getDefaultTemplate` function in `templateService.js`

### Adding New Layouts

1. **Database Method**:
   ```sql
   INSERT INTO template_layouts (name, content_type, layout_config, css_styles)
   VALUES ('Custom Layout', 'resume', 
           '{"sections": ["header", "summary", "experience"], "columns": 1, "spacing": "custom"}',
           '.custom-layout { font-family: Custom Font; color: #custom-color; }');
   ```

2. **Code Method**: Add to the `generateStyling` function in `templateService.js`

### Customizing Command Patterns

Edit the pattern matching in `templateService.js`:

```javascript
// Add new content type patterns
this.contentTypes = {
  resume: /resume|cv|curriculum vitae|professional summary/i,
  coverLetter: /cover letter|application letter|motivation letter|letter of intent/i,
  portfolio: /portfolio|showcase|work samples|projects/i,
  cv: /academic cv|research cv|scholarly cv/i,
  // Add your custom types here
  custom: /custom|special|unique/i
};
```

## Analytics & Monitoring

### View Template Analytics

1. **Dashboard Overview**: See total templates, usage, success rates
2. **Individual Template Stats**: Usage count, success rate, user ratings
3. **Popular Templates**: Most used templates by content type
4. **Recent Usage**: Latest template selections and commands

### Success Rate Calculation

The system calculates success rates based on:
- User feedback ratings
- Template usage frequency
- Command complexity matching
- User satisfaction metrics

### Performance Metrics

Monitor these key metrics:
- **Template Usage**: How often each template is selected
- **Success Rate**: Percentage of successful template matches
- **User Satisfaction**: Average ratings and feedback
- **Command Complexity**: Analysis accuracy by command type

## Troubleshooting

### Common Issues

1. **Templates Not Loading**
   - Check database connection
   - Verify table permissions
   - Ensure RLS policies are correct

2. **Command Analysis Failing**
   - Check command pattern matching
   - Verify content type detection
   - Review template selection logic

3. **Template Data Not Generating**
   - Check template service functions
   - Verify content generation methods
   - Review styling configuration

### Debug Mode

Enable debug logging in the template service:

```javascript
// In templateService.js
console.log('Command analysis:', analysis);
console.log('Template selection:', template);
console.log('Generated data:', templateData);
```

### Database Queries

Useful queries for debugging:

```sql
-- Check template usage
SELECT * FROM template_usage ORDER BY created_at DESC LIMIT 10;

-- View template success rates
SELECT name, usage_count, success_rate FROM ai_templates ORDER BY success_rate DESC;

-- Check recent commands
SELECT command, success, created_at FROM template_usage ORDER BY created_at DESC LIMIT 5;
```

## Best Practices

### Command Writing

1. **Be Specific**: Include job type, industry, or role
2. **Mention Style**: Specify layout preferences (modern, professional, creative)
3. **Include Context**: Add experience level or purpose
4. **Use Keywords**: Include relevant terms for better matching

### Template Management

1. **Regular Monitoring**: Check success rates and user feedback
2. **Continuous Updates**: Improve templates based on usage data
3. **A/B Testing**: Test different templates for similar commands
4. **User Feedback**: Collect and incorporate user suggestions

### Performance Optimization

1. **Database Indexing**: Ensure proper indexes for fast queries
2. **Caching**: Cache frequently used templates
3. **Lazy Loading**: Load template data on demand
4. **Error Handling**: Graceful fallbacks for missing templates

## Future Enhancements

### Planned Features

1. **Advanced AI Integration**: More sophisticated command analysis
2. **Template Customization**: User-defined template modifications
3. **Multi-language Support**: Support for different languages
4. **Template Sharing**: Community template sharing
5. **Advanced Analytics**: Machine learning insights
6. **Template Versioning**: Version control for templates
7. **Bulk Operations**: Batch template management
8. **API Integration**: External template sources

### Customization Options

1. **User Preferences**: Personalized template recommendations
2. **Industry-specific Templates**: Specialized templates by industry
3. **Seasonal Templates**: Time-based template variations
4. **Brand Integration**: Company-specific template branding

## Support

For issues or questions:

1. **Check the logs**: Review browser console and server logs
2. **Database verification**: Ensure all tables and data are properly set up
3. **Template testing**: Use the dashboard to test template functionality
4. **Documentation**: Refer to this guide and code comments

## Conclusion

The Template System provides intelligent, AI-powered template generation that adapts to user needs and improves over time. By following this setup guide and best practices, you can create a robust template management system that enhances user experience and document creation efficiency. 