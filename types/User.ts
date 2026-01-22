import { ObjectId } from 'mongodb';
export interface User {
  _id: ObjectId;
  userId: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  services: string[];
  hasRegistered: boolean;
}
