-- AI Learning System Database Setup
-- Run this in your Supabase SQL Editor after the main database setup

-- 1. Create AI interactions table
CREATE TABLE IF NOT EXISTS public.ai_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    command TEXT,
    response TEXT,
    success BOOLEAN DEFAULT true,
    user_feedback TEXT,
    response_time INTEGER,
    command_complexity INTEGER,
    response_quality INTEGER,
    error_message TEXT,
    error_stack TEXT,
    error_type TEXT,
    context JSONB,
    severity TEXT,
    recovery_action TEXT,
    original_response TEXT,
    corrected_response TEXT,
    correction_type TEXT,
    improvement_score DECIMAL(3,2),
    preference_key TEXT,
    preference_value TEXT,
    session_id TEXT,
    user_agent TEXT,
    url TEXT,
    performance_metrics JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create AI learning data table
CREATE TABLE IF NOT EXISTS public.ai_learning_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    command_pattern TEXT NOT NULL,
    response_template JSONB,
    success_factors JSONB,
    user_satisfaction INTEGER,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create AI failure data table
CREATE TABLE IF NOT EXISTS public.ai_failure_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    command_pattern TEXT NOT NULL,
    failed_response TEXT,
    user_correction TEXT,
    failure_reasons JSONB,
    improvement_suggestions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create AI learning models table
CREATE TABLE IF NOT EXISTS public.ai_learning_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_type TEXT UNIQUE NOT NULL,
    patterns JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create AI command patterns table
CREATE TABLE IF NOT EXISTS public.ai_command_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern_name TEXT UNIQUE NOT NULL,
    pattern_regex TEXT,
    success_rate DECIMAL(5,4),
    avg_response_time INTEGER,
    avg_quality_score DECIMAL(3,2),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create AI user preferences table
CREATE TABLE IF NOT EXISTS public.ai_user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value TEXT,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- 7. Enable Row Level Security
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_failure_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_command_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_preferences ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for ai_interactions
CREATE POLICY "Users can view own interactions" ON public.ai_interactions
    FOR SELECT USING (auth.uid()::text = session_id::text OR session_id IS NULL);

CREATE POLICY "Users can insert interactions" ON public.ai_interactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own interactions" ON public.ai_interactions
    FOR UPDATE USING (auth.uid()::text = session_id::text OR session_id IS NULL);

-- 9. Create RLS policies for ai_learning_data
CREATE POLICY "Users can view learning data" ON public.ai_learning_data
    FOR SELECT USING (true);

CREATE POLICY "Users can insert learning data" ON public.ai_learning_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update learning data" ON public.ai_learning_data
    FOR UPDATE USING (true);

-- 10. Create RLS policies for ai_failure_data
CREATE POLICY "Users can view failure data" ON public.ai_failure_data
    FOR SELECT USING (true);

CREATE POLICY "Users can insert failure data" ON public.ai_failure_data
    FOR INSERT WITH CHECK (true);

-- 11. Create RLS policies for ai_learning_models
CREATE POLICY "Users can view learning models" ON public.ai_learning_models
    FOR SELECT USING (true);

CREATE POLICY "Users can insert learning models" ON public.ai_learning_models
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update learning models" ON public.ai_learning_models
    FOR UPDATE USING (true);

-- 12. Create RLS policies for ai_command_patterns
CREATE POLICY "Users can view command patterns" ON public.ai_command_patterns
    FOR SELECT USING (true);

CREATE POLICY "Users can insert command patterns" ON public.ai_command_patterns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update command patterns" ON public.ai_command_patterns
    FOR UPDATE USING (true);

-- 13. Create RLS policies for ai_user_preferences
CREATE POLICY "Users can view own preferences" ON public.ai_user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.ai_user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.ai_user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON public.ai_user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON public.ai_interactions(type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_timestamp ON public.ai_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON public.ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_success ON public.ai_interactions(success);

CREATE INDEX IF NOT EXISTS idx_ai_learning_data_pattern ON public.ai_learning_data(command_pattern);
CREATE INDEX IF NOT EXISTS idx_ai_learning_data_created_at ON public.ai_learning_data(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_failure_data_pattern ON public.ai_failure_data(command_pattern);
CREATE INDEX IF NOT EXISTS idx_ai_failure_data_created_at ON public.ai_failure_data(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_command_patterns_name ON public.ai_command_patterns(pattern_name);
CREATE INDEX IF NOT EXISTS idx_ai_command_patterns_success_rate ON public.ai_command_patterns(success_rate);

CREATE INDEX IF NOT EXISTS idx_ai_user_preferences_user_id ON public.ai_user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_preferences_key ON public.ai_user_preferences(preference_key);

-- 15. Create functions for automatic updates
CREATE OR REPLACE FUNCTION public.handle_ai_interactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_ai_learning_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_ai_command_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_ai_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS handle_ai_interactions_updated_at ON public.ai_interactions;
CREATE TRIGGER handle_ai_interactions_updated_at
    BEFORE UPDATE ON public.ai_interactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_ai_interactions_updated_at();

DROP TRIGGER IF EXISTS handle_ai_learning_data_updated_at ON public.ai_learning_data;
CREATE TRIGGER handle_ai_learning_data_updated_at
    BEFORE UPDATE ON public.ai_learning_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_ai_learning_data_updated_at();

DROP TRIGGER IF EXISTS handle_ai_command_patterns_updated_at ON public.ai_command_patterns;
CREATE TRIGGER handle_ai_command_patterns_updated_at
    BEFORE UPDATE ON public.ai_command_patterns
    FOR EACH ROW EXECUTE FUNCTION public.handle_ai_command_patterns_updated_at();

DROP TRIGGER IF EXISTS handle_ai_user_preferences_updated_at ON public.ai_user_preferences;
CREATE TRIGGER handle_ai_user_preferences_updated_at
    BEFORE UPDATE ON public.ai_user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_ai_user_preferences_updated_at();

-- 17. Insert initial command patterns
INSERT INTO public.ai_command_patterns (pattern_name, pattern_regex, success_rate, avg_response_time, avg_quality_score, usage_count) VALUES
('create', 'create|make|build|generate', 0.85, 2000, 7.5, 0),
('update', 'update|modify|change|edit', 0.80, 1800, 7.0, 0),
('delete', 'delete|remove|drop', 0.90, 1500, 8.0, 0),
('show', 'show|display|view|list', 0.95, 1200, 8.5, 0),
('help', 'help|assist|support', 0.88, 1600, 7.8, 0),
('explain', 'explain|describe|tell', 0.82, 2200, 7.2, 0),
('fix', 'fix|repair|resolve', 0.75, 2500, 6.8, 0),
('improve', 'improve|enhance|optimize', 0.78, 2800, 7.1, 0)
ON CONFLICT (pattern_name) DO NOTHING;

-- 18. Grant permissions
GRANT ALL ON public.ai_interactions TO authenticated;
GRANT ALL ON public.ai_learning_data TO authenticated;
GRANT ALL ON public.ai_failure_data TO authenticated;
GRANT ALL ON public.ai_learning_models TO authenticated;
GRANT ALL ON public.ai_command_patterns TO authenticated;
GRANT ALL ON public.ai_user_preferences TO authenticated;

-- 19. Create view for learning analytics
CREATE OR REPLACE VIEW public.ai_learning_analytics AS
SELECT 
    DATE_TRUNC('day', timestamp) as date,
    type,
    COUNT(*) as interaction_count,
    AVG(response_quality) as avg_quality,
    AVG(response_time) as avg_response_time,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
    COUNT(*) as total_count,
    ROUND(
        (SUM(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2
    ) as success_rate
FROM public.ai_interactions 
WHERE type = 'ai_command'
GROUP BY DATE_TRUNC('day', timestamp), type
ORDER BY date DESC;

-- 20. Create function to get learning insights
CREATE OR REPLACE FUNCTION public.get_ai_learning_insights()
RETURNS JSON AS $$
DECLARE
    insights JSON;
BEGIN
    SELECT json_build_object(
        'total_interactions', (SELECT COUNT(*) FROM public.ai_interactions),
        'success_rate', (
            SELECT ROUND(
                (SUM(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2
            ) 
            FROM public.ai_interactions 
            WHERE type = 'ai_command'
        ),
        'avg_response_quality', (
            SELECT AVG(response_quality) 
            FROM public.ai_interactions 
            WHERE type = 'ai_command' AND response_quality IS NOT NULL
        ),
        'avg_response_time', (
            SELECT AVG(response_time) 
            FROM public.ai_interactions 
            WHERE type = 'ai_command' AND response_time IS NOT NULL
        ),
        'most_common_patterns', (
            SELECT json_agg(pattern_name ORDER BY usage_count DESC LIMIT 5)
            FROM public.ai_command_patterns
        ),
        'recent_errors', (
            SELECT json_agg(error_type ORDER BY timestamp DESC LIMIT 10)
            FROM public.ai_interactions 
            WHERE type = 'error'
        )
    ) INTO insights;
    
    RETURN insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 