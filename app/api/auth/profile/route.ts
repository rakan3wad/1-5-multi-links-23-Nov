import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    
    if (!user?.id || !user?.email) {
      return NextResponse.json(
        { error: 'Missing user data' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email.split('@')[0],
        display_name: user.user_metadata?.display_name || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
