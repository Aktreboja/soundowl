import 'server-only';
import { auth0 } from '@/lib/auth0';
import { cache } from 'react';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/types/User';

export const verifyUser = cache(async () => {
    const session = await auth0.getSession();
    if (!session?.user) {
        return null
    }
    return session.user;
})


export const getUserAccount = cache(async (email: string) => {
    const user = await verifyUser();
    if (!user) {
        return null;
    }
    try {
        const db = await connectToDatabase();
        const collection = db.collection<User>('Users');
        const userAccount = await collection.findOne({ email });
        return userAccount;
    } catch (error) {
        console.error('Error fetching user account:', error);
        return null;
    }

})
