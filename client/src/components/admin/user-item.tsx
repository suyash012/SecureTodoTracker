import { useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
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
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface UserItemProps {
  user: User;
}

export default function UserItem({ user }: UserItemProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { toast } = useToast();
  const newRole = user.role === "admin" ? "user" : "admin";
  
  const changeRoleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/admin/users/${user.id}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Role updated",
        description: `${user.username}'s role has been changed to ${newRole}`,
      });
      setIsConfirmDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
      setIsConfirmDialogOpen(false);
    },
  });

  const handleChangeRole = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmChangeRole = () => {
    changeRoleMutation.mutate();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium">{user.username}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="ml-13 mt-2">
              <span className={`text-xs font-medium px-2 py-1 rounded 
                ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                {user.role}
              </span>
            </div>
          </div>
          <div>
            <Button
              size="sm"
              variant="outline"
              className={user.role === "admin" ? "text-purple-600" : "text-indigo-600"}
              onClick={handleChangeRole}
              disabled={changeRoleMutation.isPending}
            >
              {changeRoleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                user.role === "admin" ? "Demote to User" : "Promote to Admin"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              {user.role === "admin"
                ? `Are you sure you want to demote ${user.username} to a regular user?`
                : `Are you sure you want to promote ${user.username} to an admin?`}
              This will change their permissions within the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChangeRole}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
