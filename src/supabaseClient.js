import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://avxobkcqhcmzmorxuiua.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dKLJeO0bK_jXR8-V-K_9sA_N_QG9RU3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
