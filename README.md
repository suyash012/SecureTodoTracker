# Secure Todo Web Application

A secure task management application with role-based authentication built using the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Authentication & Authorization
- Secure user authentication with Passport.js
- Role-based access control (Admin and User roles)
- Password hashing with bcrypt
- Session management with express-session

### Todo Management
- Create, read, update, and delete todos
- Filter todos by completion status
- Mark todos as complete/incomplete
- Categorize todos by priority (Urgent/Non-Urgent)
- Set due dates for tasks

### Admin Dashboard
- User management (view all users)
- Update user roles (promote to admin or demote to regular user)
- View all todos across the system

### User Interface
- Responsive design that works on mobile, tablet, and desktop
- Modern UI built with Tailwind CSS and Shadcn/ui components
- Toast notifications for user feedback
- Form validation using Zod schema validation

## Technology Stack

### Frontend
- React for UI components
- TanStack Query for data fetching and caching
- Tailwind CSS for styling
- Shadcn/ui component library
- React Hook Form for form management
- Zod for schema validation
- Wouter for client-side routing

### Backend
- Express.js for the server
- MongoDB with Mongoose for data persistence
- Passport.js for authentication
- Express-session for session management
- Bcrypt for password hashing

### Development Tools
- TypeScript for type safety
- Vite for fast development and building
- MongoDB Atlas for cloud database hosting

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB connection (local or Atlas)

### Environment Variables
The application requires the following environment variables:
- `MONGODB_URI`: Connection string for your MongoDB database

### Default Users
The application comes with two default users:
- Admin User
  - Username: `admin`
  - Password: `password`
  - Role: `admin`
- Regular User
  - Username: `user`
  - Password: `password`
  - Role: `user`

### Running the Application

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `POST /api/auth/logout` - Logout the current user
- `GET /api/user` - Get the current authenticated user

### Todo Management
- `GET /api/todos` - Get all todos for the current user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PUT /api/todos/:id` - Update a specific todo
- `DELETE /api/todos/:id` - Delete a specific todo
- `PATCH /api/todos/:id/toggle` - Toggle the completion status of a todo

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/role` - Update a user's role (admin only)
- `GET /api/admin/todos` - Get all todos across the system (admin only)

## Security Features

- Password hashing with bcrypt and salt
- CSRF protection
- Session-based authentication
- Input validation with Zod
- Role-based access control
- Secure HTTP-only cookies

## License

This project is licensed under the MIT License.