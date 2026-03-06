import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const mockTable = () => ({
  select: (cols) => ({
    eq: () => ({
      single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
    in: () => Promise.resolve({ data: [], error: null }),
    order: () => Promise.resolve({ data: [], error: null }),
  }),
  insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }),
  update: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) }),
  delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
});

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: (table) => mockTable(),
        rpc: () => Promise.resolve({ data: null, error: null }),
      };
