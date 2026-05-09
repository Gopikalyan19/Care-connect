import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('\n[NAU Care Connect] Missing Supabase credentials.');
  console.warn('Create backend/.env using backend/.env.example and add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.\n');
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-project.supabase.co',
  supabaseServiceRoleKey || 'missing-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}
