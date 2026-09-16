import { createClient } from '@supabase/supabase-js';

const supabaseClient = import.meta.env.VITE_SUPABASE_CLIENT;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseClient,supabaseKey);

export {supabase}