

import { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string,
  password: string,
  email: string;
  avatar: string;
  generateToken: () => string,
  _doc: UserDocument
}
