import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { Todo } from "@shared/schema";
import TodoList from "@/components/todo-list";
import CreateTodoModal from "@/components/create-todo-modal";
import { Button } from "@/components/ui/button";
import {
  LucideLogOut,
  Plus,
  CheckSquare,
  LayoutDashboard,
  Users,
} from "lucide-react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAdmin, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();

  // Fetch todos for the current user
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  // Handle user logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Navigate to admin dashboard
  const goToAdmin = () => {
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">TodoApp</h1>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-2 mr-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Hello, {user?.username}!</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  isAdmin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="ml-3 text-gray-600 hover:text-gray-800"
                aria-label="Logout"
              >
                <LucideLogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex overflow-hidden">
        {/* Sidebar navigation */}
        <div className="bg-indigo-700 text-white w-64 flex-shrink-0 hidden md:block">
          <div className="h-16 flex items-center px-6 border-b border-indigo-800">
            <h2 className="text-lg font-medium">Dashboard</h2>
          </div>

          <nav className="mt-5 px-3 space-y-1">
            <a
              href="#"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-800"
            >
              <CheckSquare className="mr-3 h-5 w-5" />
              <span>My Todos</span>
            </a>

            {isAdmin && (
              <div>
                <h3 className="px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider mt-6 mb-2">
                  Admin
                </h3>

                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
                  onClick={goToAdmin}
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>User Management</span>
                </Button>
              </div>
            )}

            <div className="mt-8 px-3">
              <Button
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> New Todo
              </Button>
            </div>
          </nav>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Todos</h2>
            <p className="text-gray-600">Manage your tasks and stay organized</p>
          </div>

          {/* Mobile view buttons */}
          <div className="md:hidden flex flex-col space-y-2 mb-4">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Todo
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={goToAdmin}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
              </Button>
            )}
          </div>

          {/* Todos list */}
          <TodoList todos={todos} isLoading={isLoading} />
        </div>
      </main>

      {/* Create Todo Modal */}
      <CreateTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
