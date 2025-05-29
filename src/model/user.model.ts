// lib/models/User.ts               (TypeScript – works in JS too)
import { Schema, Document, models, model } from 'mongoose';
import { randomUUID } from 'crypto';

export interface IChat extends Document {
  uuid: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    uuid: {
      type: String,
      default: () => randomUUID(),
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: true }  
);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  chats: IChat[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    chats: [ChatSchema],
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
