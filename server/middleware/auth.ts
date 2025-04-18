import { Request, Response, NextFunction } from "express";

// Middleware to authenticate JWT
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized: Please log in to access this resource" });
}

// Middleware to authorize roles
export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized: Please log in to access this resource" });
    }
    
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
    }
    
    next();
  };
}
