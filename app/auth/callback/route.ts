// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Create user record in users table if it doesn't exist
      const { error: dbError } = await supabase.from('users').upsert(
        {
          user_id: data.user.id,
          name:
            data.user.user_metadata?.name ||
            data.user.email?.split('@')[0] ||
            'User',
          email: data.user.email || '',
        },
        {
          onConflict: 'user_id',
        }
      );

      if (dbError) {
        console.error('Error creating user record:', dbError);
      }

      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }
  }

  // Redirect to login page if something went wrong
  return NextResponse.redirect(new URL('/login', request.url));
}
