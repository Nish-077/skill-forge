import mongoose, { Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IUser extends Document {
  userId: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

type UserModel = Model<IUser, {}>;

const User = (mongoose.models.User || mongoose.model<IUser, UserModel>('User', UserSchema, 'users')) as UserModel;

export default User;