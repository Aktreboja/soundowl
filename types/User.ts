export interface User {
  userId: string;
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  services: string[];
  hasRegistered: boolean;
}
