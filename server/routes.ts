import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { authenticateJWT, authorizeRole } from "./middleware/auth";
import { todoController } from "./controllers/todo.controller";
import { adminController } from "./controllers/admin.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Todo routes
  app.get("/api/todos", authenticateJWT, todoController.getTodos);
  app.post("/api/todos", authenticateJWT, todoController.createTodo);
  app.get("/api/todos/:id", authenticateJWT, todoController.getTodo);
  app.put("/api/todos/:id", authenticateJWT, todoController.updateTodo);
  app.delete("/api/todos/:id", authenticateJWT, todoController.deleteTodo);
  app.patch("/api/todos/:id/toggle", authenticateJWT, todoController.toggleTodoCompletion);

  // Admin routes
  app.get("/api/admin/users", authenticateJWT, authorizeRole("admin"), adminController.getAllUsers);
  app.patch("/api/admin/users/:id/role", authenticateJWT, authorizeRole("admin"), adminController.updateUserRole);
  app.get("/api/admin/todos", authenticateJWT, authorizeRole("admin"), adminController.getAllTodos);

  const httpServer = createServer(app);
  return httpServer;
}
