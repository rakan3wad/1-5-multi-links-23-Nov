import { notFound } from "next/navigation";
import PublicProfile from "@/components/profile/PublicProfile";
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const supabase = createServerClient();

  console.log('Fetching profile for username:', username);

  // Get profile by username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("username", username.toLowerCase())
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  console.log('Profile data:', profile);

  // If no profile found, show 404
  if (!profile) {
    console.error('Profile not found:', username);
    notFound();
  }

  // Fetch user's links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (linksError) {
    console.error('Error fetching links:', linksError);
  }

  console.log('Links data:', links);

  return (
    <PublicProfile 
      username={profile.username}
      displayName={profile.display_name}
      avatarUrl={profile.avatar_url}
      links={links || []} 
    />
  );
}
