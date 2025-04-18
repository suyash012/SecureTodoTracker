import { Request, Response } from "express";
import { storage } from "../storage";

export const adminController = {
  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  },

  // Update user role (admin only)
  async updateUserRole(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const { role } = req.body;
      
      // Validate role
      if (role !== "user" && role !== "admin") {
        return res.status(400).json({ message: "Invalid role. Role must be 'user' or 'admin'" });
      }
      
      // Prevent self-demotion
      if (userId === req.user!.id && role !== "admin") {
        return res.status(400).json({ message: "You cannot demote yourself from admin" });
      }
      
      // Get user to update
      const user = await storage.getUser(userId);
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user role
      const updatedUser = await storage.updateUserRole(userId, role);
      
      // Remove password from response
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  },

  // Get all todos (admin only)
  async getAllTodos(req: Request, res: Response) {
    try {
      const todos = await storage.getAllTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  },
};
