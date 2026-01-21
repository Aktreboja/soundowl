export interface User {
  email: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  services: string[];
  hasRegistered: boolean;
}
