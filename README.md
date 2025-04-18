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

## Project Structure

```
todo-app/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── todo-item.tsx
│   │   │   └── todo-list.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── use-auth.tsx # Authentication hook
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.tsx
│   │   ├── lib/             # Utility functions
│   │   │   ├── queryClient.ts
│   │   │   ├── protected-route.tsx
│   │   │   └── utils.ts
│   │   ├── pages/           # Application pages
│   │   │   ├── admin-page.tsx
│   │   │   ├── auth-page.tsx
│   │   │   ├── home-page.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx          # Main application component
│   │   ├── index.css        # Global styles
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend Express application
│   ├── controllers/         # API route controllers
│   │   ├── admin.controller.ts
│   │   └── todo.controller.ts
│   ├── db/                  # Database related code
│   │   ├── connection.ts    # MongoDB connection setup
│   │   ├── models.ts        # Mongoose models
│   │   └── mongo-storage.ts # MongoDB storage implementation
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # Authentication middleware
│   ├── auth.ts              # Authentication setup
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes definition
│   ├── storage.ts           # Storage interface
│   └── vite.ts              # Vite integration
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Data schemas and types
├── drizzle.config.ts        # Drizzle ORM configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

This structure follows a modular approach that separates concerns and makes the codebase easier to maintain:

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB connection (local or Atlas)

### Environment Variables
The application requires the following environment variables:
- `MONGODB_URI`: Connection string for your MongoDB database

### MongoDB Setup

#### Using MongoDB Atlas (Recommended for Production)

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient for development)
3. Configure database access:
   - Create a database user with read/write permissions
   - Add your IP address to the IP whitelist (or use 0.0.0.0/0 for open access during development)
4. Connect to your cluster:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your credentials and database name
5. Use this connection string as your `MONGODB_URI` environment variable

#### Using Local MongoDB (Development)

1. Install MongoDB Community Edition on your machine:
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)
2. Start the MongoDB service:
   ```
   mongod --dbpath /path/to/data/directory
   ```
3. Use `mongodb://localhost:27017/todo-app` as your `MONGODB_URI` environment variable

#### Database Collections

The application uses the following MongoDB collections:
- `users`: Stores user account information
- `todos`: Stores todo items
- `counters`: Used for auto-incrementing IDs

These collections are created automatically the first time the application runs.

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

### Running the Application Locally

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd todo-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```
   - For local development, you can use a local MongoDB instance:
     ```
     MONGODB_URI=mongodb://localhost:27017/todo-app
     ```
   - Or use MongoDB Atlas (recommended for production):
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todo-app
     ```

4. Start the development server:

   **For Unix/Linux/Mac:**
   ```
   npm run dev
   ```

   **For Windows:**
   ```
   node start-dev.js
   ```

   **Alternative approach for all platforms (using cross-env):**
   ```
   npx cross-env NODE_ENV=development tsx server/index.ts
   ```

5. Open your browser and navigate to `http://localhost:5000`

The application uses a combined development server that serves both the backend API and frontend assets from the same port, making development simple and straightforward.

#### Troubleshooting NODE_ENV Issues

If you encounter NODE_ENV related errors when running the application:

- **Windows users:** The `npm run dev` script uses Unix-style environment variable setting which doesn't work on Windows. Use the provided `node start-dev.js` script instead.
  
- **Environment variable persistence:** If you need the NODE_ENV to persist across multiple commands, set it according to your platform:
  
  - Windows (Command Prompt):
    ```
    set NODE_ENV=development
    ```
  
  - Windows (PowerShell):
    ```
    $env:NODE_ENV = "development"
    ```
  
  - Unix/Linux/Mac:
    ```
    export NODE_ENV=development
    ```

- **Production deployment:** For production environments, you can use `node start-prod.js` to ensure NODE_ENV is set correctly.

### Production Deployment

#### Deploying to Replit

This application is preconfigured for easy deployment on Replit:

1. Fork the Repl
2. Add your `MONGODB_URI` as a secret in the Replit environment
3. Click the "Deploy" button in the Replit interface
4. Your application will be available at `https://your-repl-name.your-username.repl.co`

#### Deploying to Other Platforms

##### Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Initialize a Git repository if not done already:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a Heroku app:
   ```
   heroku create your-app-name
   ```
4. Set environment variables:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```
5. Deploy the application:
   ```
   git push heroku main
   ```
6. Open the deployed application:
   ```
   heroku open
   ```

##### Vercel or Netlify (Frontend) with Separate Backend

For a more scalable solution, you can split the deployment:

1. Frontend (Client):
   - Configure the build settings:
     ```
     Build command: npm run build
     Output directory: dist
     ```
   - Set environment variables for API URL
   - Deploy the client directory

2. Backend (Server):
   - Deploy the server to a platform like Heroku, Railway, or Render
   - Set the necessary environment variables
   - Configure CORS to allow requests from your frontend domain

#### Docker Deployment

For containerized deployment:

1. Build the Docker image:
   ```
   docker build -t todo-app .
   ```
2. Run the container:
   ```
   docker run -p 5000:5000 -e MONGODB_URI=your_mongodb_uri todo-app
   ```

This provides flexibility for deployment on any platform that supports Docker containers, including AWS, Google Cloud, or DigitalOcean.

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