import { getUserAccount } from '@/app/utils';
import { NextResponse } from 'next/server';

// GET: /api/account?email=user@example.com
// Returns the user account for the given email
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  const account = await getUserAccount(email);
  return NextResponse.json(account);
}
