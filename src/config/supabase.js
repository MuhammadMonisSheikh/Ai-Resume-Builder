import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://btmstwhpsvjqxuaxqzyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bXN0d2hwc3ZqcXh1YXhxenlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY0MzM0MCwiZXhwIjoyMDY2MjE5MzQwfQ.niYp9-a5V8E83-Z6mBT2sVVLLwGJa3yik6uUlO8OPIo';

export const supabase = createClient(supabaseUrl, supabaseKey); 