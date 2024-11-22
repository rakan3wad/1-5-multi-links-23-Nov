import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PublicProfile from '@/components/profile/PublicProfile';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({ params: { username } }: PageProps) {
  const supabase = createServerComponentClient({ cookies });

  // Check if username exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    redirect('/');
  }

  return <PublicProfile username={username} />;
}
