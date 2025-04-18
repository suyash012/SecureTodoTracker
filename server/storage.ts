import { users, todos, User, InsertUser, Todo, InsertTodo } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Password handling functions
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private userEntities: Map<number, User>;
  private todoEntities: Map<number, Todo>;
  private userIdCounter: number;
  private todoIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.userEntities = new Map();
    this.todoEntities = new Map();
    this.userIdCounter = 1;
    this.todoIdCounter = 1;
    
    // Create session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Create default admin user
    this.createUser({
      username: "admin",
      email: "admin@example.com",
      password: "password", // This will be hashed in createUser
      role: "admin"
    });
    
    // Create default regular user
    this.createUser({
      username: "user",
      email: "user@example.com",
      password: "password", // This will be hashed in createUser
      role: "user"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.userEntities.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userEntities.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.userEntities.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user: User = {
      id,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user",
    };
    
    this.userEntities.set(id, user);
    return { ...user };
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.userEntities.values());
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = this.userEntities.get(id);
    if (!user) return undefined;
    
    user.role = role;
    this.userEntities.set(id, user);
    
    return { ...user };
  }

  // Authentication helpers
  async verifyPassword(suppliedPassword: string, storedPassword: string): Promise<boolean> {
    return comparePasswords(suppliedPassword, storedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  // Todo operations
  async createTodo(todoData: InsertTodo & { userId: number }): Promise<Todo> {
    const id = this.todoIdCounter++;
    const user = await this.getUser(todoData.userId);
    
    const todo: Todo = {
      id,
      title: todoData.title,
      description: todoData.description || null,
      dueDate: todoData.dueDate || null,
      category: todoData.category || "Non-Urgent",
      completed: false,
      userId: todoData.userId,
      username: user?.username || "Unknown",
    };
    
    this.todoEntities.set(id, todo);
    return { ...todo };
  }

  async getTodos(userId: number): Promise<Todo[]> {
    return Array.from(this.todoEntities.values())
      .filter((todo) => todo.userId === userId);
  }

  async getAllTodos(): Promise<Todo[]> {
    return Array.from(this.todoEntities.values());
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return this.todoEntities.get(id);
  }

  async updateTodo(id: number, todoData: Partial<InsertTodo>): Promise<Todo | undefined> {
    const todo = this.todoEntities.get(id);
    if (!todo) return undefined;
    
    const updatedTodo: Todo = {
      ...todo,
      ...todoData,
    };
    
    this.todoEntities.set(id, updatedTodo);
    return { ...updatedTodo };
  }

  async deleteTodo(id: number): Promise<boolean> {
    return this.todoEntities.delete(id);
  }

  async toggleTodoCompletion(id: number): Promise<Todo | undefined> {
    const todo = this.todoEntities.get(id);
    if (!todo) return undefined;
    
    todo.completed = !todo.completed;
    this.todoEntities.set(id, todo);
    
    return { ...todo };
  }
}

export const storage = new MemStorage();
