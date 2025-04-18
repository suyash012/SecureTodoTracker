import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Todo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import CreateTodoModal from "./create-todo-modal";

interface TodoItemProps {
  todo: Todo;
  showUsername?: boolean;
  isAdmin: boolean;
}

export default function TodoItem({ todo, showUsername = false, isAdmin }: TodoItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  // Toggle todo completion status
  const toggleCompleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/todos/${todo.id}/toggle`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/todos"] });
      }
      toast({
        title: todo.completed ? "Todo marked as incomplete" : "Todo marked as complete",
        description: `"${todo.title}" has been updated`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update todo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete todo
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/todos/${todo.id}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/todos"] });
      }
      toast({
        title: "Todo deleted",
        description: `"${todo.title}" has been deleted`,
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete todo",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    },
  });

  const handleToggleComplete = () => {
    toggleCompleteMutation.mutate();
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const borderColor = todo.category === "Urgent" ? "border-red-500" : "border-blue-500";
  const categoryColor = todo.category === "Urgent" 
    ? "bg-red-100 text-red-800" 
    : "bg-blue-100 text-blue-800";

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 relative ${borderColor}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div 
              className={`cursor-pointer w-6 h-6 mt-1 flex items-center justify-center rounded 
                ${todo.completed ? "bg-green-500" : "border-2 border-gray-300"}`}
              onClick={handleToggleComplete}
            >
              {todo.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className={todo.completed ? "line-through text-gray-500" : ""}>
              <h3 className="font-semibold text-lg mb-1">{todo.title}</h3>
              <p className="text-gray-600 mb-2">{todo.description || "No description"}</p>
              <div className="flex flex-wrap gap-2 mb-1">
                {todo.dueDate && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {todo.dueDate}
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
                  {todo.category}
                </span>
              </div>
              {showUsername && (
                <span className="text-xs text-gray-500">
                  By: {todo.username || "Unknown user"}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={openEditModal}>
              <Pencil className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <CreateTodoModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          todoToEdit={todo}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the todo "{todo.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
