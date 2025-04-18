import { useAuth } from "@/hooks/use-auth";
import TodoItem from "./todo-item";
import { Todo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoListProps {
  todos?: Todo[];
  isLoading: boolean;
  showUsername?: boolean;
}

export default function TodoList({ todos, isLoading, showUsername = false }: TodoListProps) {
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-5 mb-4 border-l-4 border-gray-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-6 w-6 rounded" />
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-2" />
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Skeleton className="h-5 w-24 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No todos found. Create one now!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          showUsername={showUsername}
          isAdmin={isAdmin} 
        />
      ))}
    </div>
  );
}
