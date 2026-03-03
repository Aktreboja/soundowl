import { User } from '@/types/User';
export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

interface RegistrationRequest {
  email: string;
  name: string;
  username: string;
  userId: string;
  services?: string[];
  hasRegistered?: boolean;
}

// POST: /api/registration
// Creates a new user account in the database (single insert; can include services + hasRegistered when completing onboarding)
export async function POST(request: Request) {
  const { email, name, username, userId, services, hasRegistered } =
    (await request.json()) as RegistrationRequest;

  const newUser: User = {
    email,
    name,
    username,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    services: services ?? [],
    hasRegistered: hasRegistered ?? false,
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
