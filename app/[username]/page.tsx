import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PublicProfile from '@/components/profile/PublicProfile';

interface PageProps {
  params: {
    username: string;
  };
}

// Disable static page generation to ensure fresh data
export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
