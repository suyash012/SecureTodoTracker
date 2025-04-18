import session from 'express-session';
import { IStorage } from '../storage';
import { User, InsertUser, Todo, InsertTodo } from '@shared/schema';
import { 
  UserModel, 
  TodoModel, 
  getNextSequence, 
  userDocToUser, 
  todoDocToTodo,
  UserDocument,
  TodoDocument
} from './models';
import createMemoryStore from 'memorystore';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const MemoryStore = createMemoryStore(session);

// Password handling functions
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create default admin user if not exists
    const adminUser = await this.getUserByUsername('admin');
    if (!adminUser) {
      await this.createUser({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin'
      });
    }
    
    // Create default regular user if not exists
    const regularUser = await this.getUserByUsername('user');
    if (!regularUser) {
      await this.createUser({
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        role: 'user'
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await UserModel.findOne({ id });
    return user ? userDocToUser(user) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
    return user ? userDocToUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    return user ? userDocToUser(user) : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = await getNextSequence('userId');
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = new UserModel({
      id,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
    });
    
    await user.save();
    return userDocToUser(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => userDocToUser(user));
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = await UserModel.findOneAndUpdate(
      { id },
      { role },
      { new: true }
    );
    
    return user ? userDocToUser(user) : undefined;
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
    const id = await getNextSequence('todoId');
    const user = await this.getUser(todoData.userId);
    
    const todo = new TodoModel({
      id,
      title: todoData.title,
      description: todoData.description || null,
      dueDate: todoData.dueDate || null,
      category: todoData.category || 'Non-Urgent',
      completed: false,
      userId: todoData.userId,
      username: user?.username || 'Unknown',
    });
    
    await todo.save();
    return todoDocToTodo(todo);
  }

  async getTodos(userId: number): Promise<Todo[]> {
    const todos = await TodoModel.find({ userId });
    return todos.map(todo => todoDocToTodo(todo));
  }

  async getAllTodos(): Promise<Todo[]> {
    const todos = await TodoModel.find();
    return todos.map(todo => todoDocToTodo(todo));
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    const todo = await TodoModel.findOne({ id });
    return todo ? todoDocToTodo(todo) : undefined;
  }

  async updateTodo(id: number, todoData: Partial<InsertTodo>): Promise<Todo | undefined> {
    const todo = await TodoModel.findOneAndUpdate(
      { id },
      { ...todoData },
      { new: true }
    );
    
    return todo ? todoDocToTodo(todo) : undefined;
  }

  async deleteTodo(id: number): Promise<boolean> {
    const result = await TodoModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async toggleTodoCompletion(id: number): Promise<Todo | undefined> {
    const todo = await TodoModel.findOne({ id }) as TodoDocument;
    if (!todo) return undefined;
    
    todo.completed = !todo.completed;
    await todo.save();
    
    return todoDocToTodo(todo);
  }
}