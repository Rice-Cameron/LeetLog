import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('X-Stack-Signature');
    const body = await request.json();

    // Verify the webhook signature
    if (!auth.verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle different webhook events
    switch (body.type) {
      case 'user.created':
        await handleUserCreated(body.data);
        break;
      case 'user.updated':
        await handleUserUpdated(body.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(body.data);
        break;
      default:
        console.log('Unhandled webhook event:', body.type);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleUserCreated(userData: any) {
  // Handle user creation
  console.log('User created:', userData);
}

async function handleUserUpdated(userData: any) {
  // Handle user updates
  console.log('User updated:', userData);
}

async function handleUserDeleted(userData: any) {
  // Handle user deletion
  console.log('User deleted:', userData);
}
