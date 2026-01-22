import { getUserAccount } from '@/app/utils';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { User } from '@/types/User';
import { accountApi } from '@/lib/store/accountApi';

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


// PUT: /api/account
// Updates the user account for the given email
export async function PUT(request: Request) {
  const account = await request.json() as User;

  const {_id, ...rest} = account;
  console.log(account);
  const db = await connectToDatabase();
  const collection = db.collection('Users');
  const updatedAccount = await collection.updateOne({ email: account.email }, { $set: {
    ...rest,
    services: account.services.map((service) => service.toLowerCase()),
    hasRegistered: true,
    updatedAt: new Date(),
  } });
  return NextResponse.json(updatedAccount);
}
