import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const session = await auth.signIn({ email, password });
    return NextResponse.json(session);
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
