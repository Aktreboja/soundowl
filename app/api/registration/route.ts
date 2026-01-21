import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

interface RegistrationRequest {
    email: string;
    name: string;
    username: string;
}

export async function POST(request: Request) {
    const { email, name, username } = await request.json();
    const db = await connectToDatabase();
    const collection = db.collection('Users');
    const user = await collection.findOne({ email });
    if (user) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    const newUser = await collection.insertOne({ email, name, username });
    return NextResponse.json(newUser);
}