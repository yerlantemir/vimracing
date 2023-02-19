import { Schema, model } from 'mongoose';

interface IUser {
  id: string;
}

const UserSchema = new Schema<IUser>({
  id: String
});

const UserModel = model('User', UserSchema);

export { IUser, UserSchema, UserModel };
