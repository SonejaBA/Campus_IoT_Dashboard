import { createClient } from '@supabase/supabase-js';

const supabaseClient = import.meta.env.VITE_SUPABASE_CLIENT;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseClient,supabaseKey);

export async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
}

export {supabase}