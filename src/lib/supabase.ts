import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://parsfpaonvblthnlpdna.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcnNmcGFvbnZibHRobmxwZG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzQ5ODAsImV4cCI6MjA5NTQxMDk4MH0.JEb38DIBKIcVGo8wX-1WBiTjyCSV9aO1MLvum8dvpio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
