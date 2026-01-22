import { User } from '@/types/User';
export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

interface RegistrationRequest {
  email: string;
  name: string;
  username: string;
  userId: string;
}

// POST: /api/registration
// Creates a new user account in the database
export async function POST(request: Request) {
  const { email, name, username, userId } =
    (await request.json()) as RegistrationRequest;

  const newUser: User = {
    email,
    name,
    username,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    services: [],
    hasRegistered: false,
  };

  const db = await connectToDatabase();
  const collection = db.collection('Users');
  const user = await collection.findOne({ email });
  if (user) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  const result = await collection.insertOne(newUser);
  return NextResponse.json({ success: true, user: result });
}
