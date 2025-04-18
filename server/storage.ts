import { User, InsertUser, Todo, InsertTodo } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  
  // Authentication
  verifyPassword(suppliedPassword: string, storedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  
  // Todo operations
  createTodo(todo: InsertTodo & { userId: number }): Promise<Todo>;
  getTodos(userId: number): Promise<Todo[]>;
  getAllTodos(): Promise<Todo[]>;
  getTodo(id: number): Promise<Todo | undefined>;
  updateTodo(id: number, todo: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<boolean>;
  toggleTodoCompletion(id: number): Promise<Todo | undefined>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

// Import MongoDB storage
import { MongoStorage } from './db/mongo-storage';

// Create and export MongoDB storage instance
export const storage = new MongoStorage();
