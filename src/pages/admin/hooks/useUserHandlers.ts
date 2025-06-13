
import { useState, useEffect } from "react";
import { User } from "../types";
import { userService } from "@/services/routes/user";
import { useToast } from "@/hooks/use-toast";

export const useUserHandlers = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>({
    name: "",
    email: "",
    phone: "",
    cpfOrCnpj: "",
    plan: ""
  });

  // Load users from API
  const loadUsers = async (page = 1, quantityRegisters = 50) => {
    setIsUsersLoading(true);
    try {
      const response = await userService.getUsers(page, quantityRegisters);
      console.log("Users API response:", response);
      
      if (response.objRecords) {
        setUsers(response.objRecords.records || []);
        setCurrentPage(response.objRecords.page || 1);
        setTotalPages(response.objRecords.totalPages || 1);
        setHasLoadedInitially(true);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;
    
    try {
      const updateData = {
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        cpfOrCnpj: userToEdit.cpfOrCnpj,
        plan: userToEdit.plan
      };
      
      await userService.updateUser(userToEdit.id, updateData);
      
      // Reload users to get updated data
      await loadUsers(currentPage);
      
      setIsEditDialogOpen(false);
      setUserToEdit(null);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async (password: string) => {
    try {
      // Use the current newUser state directly to ensure we have the latest data
      const createData = {
        name: newUser.name,
        email: newUser.email,
        password: password,
        phone: newUser.phone,
        cpfOrCnpj: newUser.cpfOrCnpj,
        plan: newUser.plan
      };
      
      console.log("Creating user with data:", createData);
      console.log("Data validation:");
      console.log("- Name:", createData.name, "Length:", createData.name?.length);
      console.log("- Email:", createData.email, "Valid format:", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createData.email));
      console.log("- Password:", "Length:", password?.length);
      console.log("- Phone:", createData.phone);
      console.log("- CPF/CNPJ:", createData.cpfOrCnpj);
      console.log("- Plan:", createData.plan);
      
      // Validate required fields on the client-side before sending the request
      if (!createData.name || !createData.email || !createData.plan || !password) {
        throw new Error("Campos obrigatórios não preenchidos. Verifique nome, email, senha e plano.");
      }
      
      await userService.createUser(createData);
      
      // Reload users to include the new user
      await loadUsers(currentPage);
      
      // Reset the form and close the dialog
      setIsNewUserDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        cpfOrCnpj: "",
        plan: ""
      });
      
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso."
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      console.error("Error details:");
      console.error("- Status:", error.response?.status);
      console.error("- Status Text:", error.response?.statusText);
      console.error("- Response Data:", error.response?.data);
      console.error("- Request Config:", error.config);
      
      // Show detailed error message
      let errorMessage = "Não foi possível criar o usuário.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete);
      
      // Reload users to reflect the deletion
      await loadUsers(currentPage);
      
      setUserToDelete(null);
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso."
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao remover usuário",
        description: "Não foi possível remover o usuário.",
        variant: "destructive"
      });
    }
  };

  const handleOpenNewUserDialog = () => {
    // Reset the new user form data when opening the dialog
    setNewUser({
      name: "",
      email: "",
      phone: "",
      cpfOrCnpj: "",
      plan: ""
    });
    setIsNewUserDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadUsers(page);
  };

  return {
    users,
    setUsers,
    isUsersLoading,
    currentPage,
    totalPages,
    userToEdit,
    setUserToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isNewUserDialogOpen,
    setIsNewUserDialogOpen,
    userToDelete,
    setUserToDelete,
    newUser,
    setNewUser,
    loadUsers,
    handleEditUser,
    handleUpdateUser,
    handleCreateUser,
    openDeleteDialog,
    handleDeleteUser,
    handleOpenNewUserDialog,
    handlePageChange,
    hasLoadedInitially
  };
};
