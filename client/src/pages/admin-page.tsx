import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Todo, User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import TodoList from "@/components/todo-list";
import UserList from "@/components/admin/user-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideLogOut, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const { user, isAdmin, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect non-admin users
  if (!isAdmin) {
    setLocation("/");
    return null;
  }

  // Fetch todos for the current user
  const { data: personalTodos, isLoading: isLoadingPersonal } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  // Fetch all todos (admin only)
  const { data: allTodos, isLoading: isLoadingAll } = useQuery<Todo[]>({
    queryKey: ["/api/admin/todos"],
    enabled: isAdmin,
  });

  // Fetch all users (admin only)
  const { data: allUsers, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  // Handle user logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Return to main dashboard
  const goToHome = () => {
    setLocation("/");
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
                <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-800">
                  Admin
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
            <h2 className="text-lg font-medium">Admin Dashboard</h2>
          </div>

          <nav className="mt-5 px-3 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
              onClick={goToHome}
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              <span>Back to My Todos</span>
            </Button>
          </nav>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {/* Mobile back button */}
          <div className="md:hidden mb-4">
            <Button variant="outline" onClick={goToHome}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Todos
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Manage users and all todos</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="personal">My Todos</TabsTrigger>
              <TabsTrigger value="all">All Todos</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <TodoList todos={personalTodos} isLoading={isLoadingPersonal} />
            </TabsContent>

            <TabsContent value="all">
              <TodoList todos={allTodos} isLoading={isLoadingAll} showUsername />
            </TabsContent>

            <TabsContent value="users">
              <UserList users={allUsers} isLoading={isLoadingUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
