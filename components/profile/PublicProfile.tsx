import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Link } from '../dashboard/DashboardLayout';
import PublicProfileContent from './PublicProfileContent';

interface PublicProfileProps {
  username: string;
}

export default async function PublicProfile({ username }: PublicProfileProps) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  // Fetch user's links ordered by order_index
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile?.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  return (
    <PublicProfileContent
      username={username}
      displayName={profile?.display_name}
      avatarUrl={profile?.avatar_url}
      links={links as Link[] || []}
    />
  );
}
