import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const session = await auth.signUp({ email, password, name });
    return NextResponse.json(session);
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 400 });
  }
}
