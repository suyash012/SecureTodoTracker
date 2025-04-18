import { Request, Response } from "express";
import { storage } from "../storage";
import { insertTodoSchema } from "@shared/schema";
import { z } from "zod";

export const todoController = {
  // Get all todos for the current user
  async getTodos(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const todos = await storage.getTodos(userId);
      
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  },

  // Create a new todo
  async createTodo(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = insertTodoSchema.parse(req.body);
      
      // Create todo with current user ID
      const todo = await storage.createTodo({
        ...validatedData,
        userId: req.user!.id,
      });
      
      res.status(201).json(todo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create todo" });
    }
  },

  // Get a single todo
  async getTodo(req: Request, res: Response) {
    try {
      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      const todo = await storage.getTodo(todoId);
      
      // Check if todo exists
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      // Check if user is authorized (owner or admin)
      if (todo.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: You do not have permission to access this todo" });
      }
      
      res.status(200).json(todo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todo" });
    }
  },

  // Update a todo
  async updateTodo(req: Request, res: Response) {
    try {
      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      // Validate request body
      const validatedData = insertTodoSchema.parse(req.body);
      
      // Get todo to check ownership
      const todo = await storage.getTodo(todoId);
      
      // Check if todo exists
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      // Check if user is authorized (owner or admin)
      if (todo.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: You do not have permission to update this todo" });
      }
      
      // Update todo
      const updatedTodo = await storage.updateTodo(todoId, validatedData);
      
      res.status(200).json(updatedTodo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update todo" });
    }
  },

  // Delete a todo
  async deleteTodo(req: Request, res: Response) {
    try {
      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      // Get todo to check ownership
      const todo = await storage.getTodo(todoId);
      
      // Check if todo exists
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      // Check if user is authorized (owner or admin)
      if (todo.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: You do not have permission to delete this todo" });
      }
      
      // Delete todo
      await storage.deleteTodo(todoId);
      
      res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo" });
    }
  },

  // Toggle todo completion status
  async toggleTodoCompletion(req: Request, res: Response) {
    try {
      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }
      
      // Get todo to check ownership
      const todo = await storage.getTodo(todoId);
      
      // Check if todo exists
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      // Check if user is authorized (owner or admin)
      if (todo.userId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: You do not have permission to update this todo" });
      }
      
      // Toggle completion status
      const updatedTodo = await storage.toggleTodoCompletion(todoId);
      
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update todo" });
    }
  },
};
