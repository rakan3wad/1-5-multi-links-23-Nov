import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';
import { cache } from 'react';

export const createClient = cache(() => {
  return createClientComponentClient<Database>();
});