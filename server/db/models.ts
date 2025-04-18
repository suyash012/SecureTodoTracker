import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType, Todo as TodoType } from '@shared/schema';

// Mongoose document interfaces
export interface UserDocument extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface TodoDocument extends Document {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  category: string;
  completed: boolean;
  userId: number;
  username: string;
}

// Counter interface
interface CounterDocument extends Document {
  _id: string;
  seq: number;
}

// User Schema
const userSchema = new Schema<UserDocument>({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { 
  timestamps: false 
});

// Todo Schema
const todoSchema = new Schema<TodoDocument>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  dueDate: { type: String, default: null },
  category: { type: String, default: 'Non-Urgent' },
  completed: { type: Boolean, default: false },
  userId: { type: Number, required: true },
  username: { type: String, required: true }
}, { 
  timestamps: false 
});

// Define counter schema for auto-incrementing IDs
const counterSchema = new Schema<CounterDocument>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Counter model
const Counter = mongoose.model<CounterDocument>('Counter', counterSchema);

// Export models
export const UserModel = mongoose.model<UserDocument>('User', userSchema);
export const TodoModel = mongoose.model<TodoDocument>('Todo', todoSchema);

// Function to get the next sequence for a given counter
export async function getNextSequence(name: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Convert Mongoose document to plain object matching our app interfaces
export function userDocToUser(doc: UserDocument): UserType {
  return {
    id: doc.id,
    username: doc.username,
    email: doc.email,
    password: doc.password,
    role: doc.role
  };
}

export function todoDocToTodo(doc: TodoDocument): TodoType {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    dueDate: doc.dueDate,
    category: doc.category,
    completed: doc.completed,
    userId: doc.userId,
    username: doc.username
  };
}