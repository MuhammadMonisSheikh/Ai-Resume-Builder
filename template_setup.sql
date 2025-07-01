-- Template System Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create AI templates table
CREATE TABLE IF NOT EXISTS public.ai_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    layout TEXT NOT NULL,
    data_type TEXT NOT NULL,
    sections JSONB,
    style TEXT,
    description TEXT,
    template_data JSONB,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,4) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_type, layout, data_type)
);

-- 2. Create template layouts table
CREATE TABLE IF NOT EXISTS public.template_layouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    content_type TEXT NOT NULL,
    layout_config JSONB NOT NULL,
    css_styles TEXT,
    preview_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create template data table
CREATE TABLE IF NOT EXISTS public.template_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.ai_templates(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_data JSONB,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create template usage tracking table
CREATE TABLE IF NOT EXISTS public.template_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.ai_templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    command TEXT NOT NULL,
    success BOOLEAN DEFAULT true,
    user_rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE public.ai_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for ai_templates
CREATE POLICY "Users can view templates" ON public.ai_templates
    FOR SELECT USING (true);

CREATE POLICY "Users can insert templates" ON public.ai_templates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update templates" ON public.ai_templates
    FOR UPDATE USING (true);

-- 7. Create RLS policies for template_layouts
CREATE POLICY "Users can view layouts" ON public.template_layouts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert layouts" ON public.template_layouts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update layouts" ON public.template_layouts
    FOR UPDATE USING (true);

-- 8. Create RLS policies for template_data
CREATE POLICY "Users can view template data" ON public.template_data
    FOR SELECT USING (true);

CREATE POLICY "Users can insert template data" ON public.template_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update template data" ON public.template_data
    FOR UPDATE USING (true);

-- 9. Create RLS policies for template_usage
CREATE POLICY "Users can view own usage" ON public.template_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.template_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON public.template_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_templates_content_type ON public.ai_templates(content_type);
CREATE INDEX IF NOT EXISTS idx_ai_templates_layout ON public.ai_templates(layout);
CREATE INDEX IF NOT EXISTS idx_ai_templates_data_type ON public.ai_templates(data_type);
CREATE INDEX IF NOT EXISTS idx_ai_templates_success_rate ON public.ai_templates(success_rate);

CREATE INDEX IF NOT EXISTS idx_template_layouts_content_type ON public.template_layouts(content_type);
CREATE INDEX IF NOT EXISTS idx_template_layouts_active ON public.template_layouts(is_active);

CREATE INDEX IF NOT EXISTS idx_template_data_template_id ON public.template_data(template_id);
CREATE INDEX IF NOT EXISTS idx_template_data_section ON public.template_data(section_name);

CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON public.template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_user_id ON public.template_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_created_at ON public.template_usage(created_at);

-- 11. Create functions for automatic updates
CREATE OR REPLACE FUNCTION public.handle_ai_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_template_layouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_template_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS handle_ai_templates_updated_at ON public.ai_templates;
CREATE TRIGGER handle_ai_templates_updated_at
    BEFORE UPDATE ON public.ai_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_ai_templates_updated_at();

DROP TRIGGER IF EXISTS handle_template_layouts_updated_at ON public.template_layouts;
CREATE TRIGGER handle_template_layouts_updated_at
    BEFORE UPDATE ON public.template_layouts
    FOR EACH ROW EXECUTE FUNCTION public.handle_template_layouts_updated_at();

DROP TRIGGER IF EXISTS handle_template_data_updated_at ON public.template_data;
CREATE TRIGGER handle_template_data_updated_at
    BEFORE UPDATE ON public.template_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_template_data_updated_at();

-- 13. Insert default templates
INSERT INTO public.ai_templates (name, content_type, layout, data_type, sections, style, description) VALUES
-- Resume Templates
('Professional Resume', 'resume', 'professional', 'professional', 
 '["header", "summary", "experience", "education", "skills"]', 
 'clean and modern', 'Professional resume template suitable for corporate environments'),

('Creative Resume', 'resume', 'creative', 'creative', 
 '["header", "summary", "experience", "skills", "projects"]', 
 'artistic and innovative', 'Creative resume template for design and creative roles'),

('Modern Resume', 'resume', 'modern', 'professional', 
 '["header", "summary", "experience", "education", "skills", "projects"]', 
 'contemporary and sleek', 'Modern resume template with clean design'),

('Executive Resume', 'resume', 'executive', 'professional', 
 '["header", "summary", "experience", "education", "skills", "certifications"]', 
 'formal and authoritative', 'Executive resume template for senior positions'),

('Minimal Resume', 'resume', 'minimal', 'personal', 
 '["header", "experience", "education", "skills"]', 
 'simple and clean', 'Minimal resume template for clean presentation'),

-- Cover Letter Templates
('Professional Cover Letter', 'coverLetter', 'professional', 'job_application', 
 '["header", "greeting", "introduction", "body", "closing", "signature"]', 
 'formal and business-like', 'Professional cover letter template'),

('Modern Cover Letter', 'coverLetter', 'modern', 'job_application', 
 '["header", "greeting", "introduction", "body", "closing", "signature"]', 
 'contemporary and engaging', 'Modern cover letter template'),

('Creative Cover Letter', 'coverLetter', 'creative', 'freelance', 
 '["header", "greeting", "introduction", "body", "closing", "signature"]', 
 'artistic and innovative', 'Creative cover letter template'),

-- Portfolio Templates
('Showcase Portfolio', 'portfolio', 'showcase', 'developer', 
 '["hero", "about", "projects", "skills", "contact"]', 
 'dynamic and interactive', 'Showcase portfolio for developers'),

('Timeline Portfolio', 'portfolio', 'timeline', 'designer', 
 '["hero", "about", "projects", "skills", "contact"]', 
 'chronological and organized', 'Timeline portfolio for designers'),

-- CV Templates
('Academic CV', 'cv', 'academic', 'phd', 
 '["personal", "education", "research", "publications", "conferences", "awards"]', 
 'scholarly and comprehensive', 'Academic CV template for researchers'),

('Research CV', 'cv', 'research', 'researcher', 
 '["personal", "education", "research", "publications", "conferences"]', 
 'research-focused and detailed', 'Research CV template for academics')
ON CONFLICT (content_type, layout, data_type) DO NOTHING;

-- 14. Insert default layouts
INSERT INTO public.template_layouts (name, content_type, layout_config, css_styles) VALUES
-- Resume Layouts
('Professional Resume Layout', 'resume', 
 '{"sections": ["header", "summary", "experience", "education", "skills"], "columns": 1, "spacing": "moderate"}',
 '.professional-resume { font-family: Arial, sans-serif; color: #2c3e50; }'),

('Modern Resume Layout', 'resume', 
 '{"sections": ["header", "summary", "experience", "education", "skills", "projects"], "columns": 2, "spacing": "generous"}',
 '.modern-resume { font-family: Roboto, sans-serif; color: #3498db; }'),

('Creative Resume Layout', 'resume', 
 '{"sections": ["header", "summary", "experience", "skills", "projects"], "columns": 1, "spacing": "dynamic"}',
 '.creative-resume { font-family: Playfair Display, serif; color: #e74c3c; }'),

-- Cover Letter Layouts
('Professional Cover Letter Layout', 'coverLetter', 
 '{"sections": ["header", "greeting", "introduction", "body", "closing", "signature"], "columns": 1, "spacing": "moderate"}',
 '.professional-cover-letter { font-family: Times New Roman, serif; color: #2c3e50; }'),

('Modern Cover Letter Layout', 'coverLetter', 
 '{"sections": ["header", "greeting", "introduction", "body", "closing", "signature"], "columns": 1, "spacing": "generous"}',
 '.modern-cover-letter { font-family: Open Sans, sans-serif; color: #3498db; }'),

-- Portfolio Layouts
('Showcase Portfolio Layout', 'portfolio', 
 '{"sections": ["hero", "about", "projects", "skills", "contact"], "columns": 1, "spacing": "dynamic"}',
 '.showcase-portfolio { font-family: Inter, sans-serif; color: #000000; }'),

('Timeline Portfolio Layout', 'portfolio', 
 '{"sections": ["hero", "about", "projects", "skills", "contact"], "columns": 1, "spacing": "organized"}',
 '.timeline-portfolio { font-family: Lato, sans-serif; color: #34495e; }'),

-- CV Layouts
('Academic CV Layout', 'cv', 
 '{"sections": ["personal", "education", "research", "publications", "conferences", "awards"], "columns": 1, "spacing": "comprehensive"}',
 '.academic-cv { font-family: Georgia, serif; color: #2c3e50; }'),

('Research CV Layout', 'cv', 
 '{"sections": ["personal", "education", "research", "publications", "conferences"], "columns": 1, "spacing": "detailed"}',
 '.research-cv { font-family: Palatino, serif; color: #34495e; }')
ON CONFLICT (name) DO NOTHING;

-- 15. Create function to get template recommendations
CREATE OR REPLACE FUNCTION public.get_template_recommendations(
    p_content_type TEXT,
    p_layout TEXT DEFAULT NULL,
    p_data_type TEXT DEFAULT NULL,
    p_complexity INTEGER DEFAULT 5
)
RETURNS TABLE (
    template_id UUID,
    template_name TEXT,
    layout_name TEXT,
    data_type TEXT,
    success_rate DECIMAL(5,4),
    usage_count INTEGER,
    recommendation_score DECIMAL(5,4)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as template_id,
        t.name as template_name,
        t.layout as layout_name,
        t.data_type,
        t.success_rate,
        t.usage_count,
        (
            COALESCE(t.success_rate, 0.5) * 0.4 +
            LEAST(t.usage_count::DECIMAL / 100, 1.0) * 0.3 +
            CASE 
                WHEN t.layout = p_layout THEN 0.2
                WHEN p_layout IS NULL THEN 0.1
                ELSE 0.0
            END +
            CASE 
                WHEN t.data_type = p_data_type THEN 0.1
                WHEN p_data_type IS NULL THEN 0.05
                ELSE 0.0
            END
        ) as recommendation_score
    FROM public.ai_templates t
    WHERE t.content_type = p_content_type
    ORDER BY recommendation_score DESC, t.usage_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Create function to update template success rate
CREATE OR REPLACE FUNCTION public.update_template_success_rate()
RETURNS TRIGGER AS $$
BEGIN
    -- Update success rate when usage is added
    UPDATE public.ai_templates 
    SET 
        success_rate = (
            SELECT COALESCE(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END), 0.0)
            FROM public.template_usage 
            WHERE template_id = NEW.template_id
        ),
        usage_count = (
            SELECT COUNT(*) 
            FROM public.template_usage 
            WHERE template_id = NEW.template_id
        )
    WHERE id = NEW.template_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 17. Create trigger to update success rate
DROP TRIGGER IF EXISTS update_template_success_rate_trigger ON public.template_usage;
CREATE TRIGGER update_template_success_rate_trigger
    AFTER INSERT OR UPDATE ON public.template_usage
    FOR EACH ROW EXECUTE FUNCTION public.update_template_success_rate();

-- 18. Grant permissions
GRANT ALL ON public.ai_templates TO authenticated;
GRANT ALL ON public.template_layouts TO authenticated;
GRANT ALL ON public.template_data TO authenticated;
GRANT ALL ON public.template_usage TO authenticated;

-- 19. Create view for template analytics
CREATE OR REPLACE VIEW public.template_analytics AS
SELECT 
    t.content_type,
    t.layout,
    t.data_type,
    COUNT(tu.id) as total_usage,
    AVG(CASE WHEN tu.success THEN 1.0 ELSE 0.0 END) as success_rate,
    AVG(tu.user_rating) as avg_rating,
    COUNT(DISTINCT tu.user_id) as unique_users
FROM public.ai_templates t
LEFT JOIN public.template_usage tu ON t.id = tu.template_id
GROUP BY t.content_type, t.layout, t.data_type
ORDER BY total_usage DESC;

-- 20. Create function to get template insights
CREATE OR REPLACE FUNCTION public.get_template_insights()
RETURNS JSON AS $$
DECLARE
    insights JSON;
BEGIN
    SELECT json_build_object(
        'total_templates', (SELECT COUNT(*) FROM public.ai_templates),
        'total_usage', (SELECT COUNT(*) FROM public.template_usage),
        'avg_success_rate', (
            SELECT AVG(success_rate) 
            FROM public.ai_templates 
            WHERE success_rate > 0
        ),
        'most_popular_content_type', (
            SELECT content_type 
            FROM public.template_analytics 
            ORDER BY total_usage DESC 
            LIMIT 1
        ),
        'top_templates', (
            SELECT json_agg(template_data)
            FROM (
                SELECT json_build_object(
                    'name', name,
                    'content_type', content_type,
                    'usage_count', usage_count,
                    'success_rate', success_rate
                ) as template_data
                FROM public.ai_templates
                ORDER BY usage_count DESC
                LIMIT 5
            ) as top_templates
        ),
        'recent_usage', (
            SELECT json_agg(usage_data)
            FROM (
                SELECT json_build_object(
                    'template_name', t.name,
                    'command', tu.command,
                    'success', tu.success,
                    'rating', tu.user_rating,
                    'created_at', tu.created_at
                ) as usage_data
                FROM public.template_usage tu
                JOIN public.ai_templates t ON tu.template_id = t.id
                ORDER BY tu.created_at DESC
                LIMIT 10
            ) as recent_usage
        )
    ) INTO insights;
    
    RETURN insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 