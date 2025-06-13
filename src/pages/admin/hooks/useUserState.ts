import { useState } from "react";
import { User } from "../types";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data until API is connected
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    cpfOrCnpj: "123.456.789-00",
    plan: "PRO",
    apiKey: "mock-api-key-1",
    maxQueries: 100,
    isOnline: null,
    activeAccount: true,
    isAdmin: false,
    createdAt: "2024-01-14T00:00:00.000Z",
    updatedAt: "2024-01-14T00:00:00.000Z",
    // Keep backward compatibility fields
    cpf: "123.456.789-00",
    status: "active"
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(21) 98888-8888",
    cpfOrCnpj: "98.765.432/0001-10",
    plan: "BÁSICO",
    apiKey: "mock-api-key-2",
    maxQueries: 50,
    isOnline: "2024-02-19T00:00:00.000Z",
    activeAccount: false,
    isAdmin: false,
    createdAt: "2024-02-19T00:00:00.000Z",
    updatedAt: "2024-02-19T00:00:00.000Z",
    // Keep backward compatibility fields
    cpf: "98.765.432/0001-10",
    status: "inactive"
  }
];

export const useUserState = () => {
  const { toast } = useToast();
  
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>({
    name: "",
    email: "",
    phone: "",
    cpfOrCnpj: "",
    plan: "BÁSICO"
  });

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!userToEdit) return;
    
    setUsers(prev => prev.map(user => 
      user.id === userToEdit.id ? userToEdit : user
    ));
    setIsEditDialogOpen(false);
    setUserToEdit(null);
    
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso."
    });
  };

  const handleCreateUser = () => {
    const newUserWithId: User = {
      ...newUser,
      id: String(Math.max(...users.map(u => parseInt(u.id))) + 1),
      apiKey: `mock-api-key-${Date.now()}`,
      maxQueries: 50,
      isOnline: null,
      activeAccount: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUserWithId]);
    setIsNewUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      cpfOrCnpj: "",
      plan: "BÁSICO"
    });
    
    toast({
      title: "Usuário criado",
      description: "O usuário foi criado com sucesso."
    });
  };

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDeleteUser = () => {
    if (userToDelete === null) return;
    
    setUsers(prev => prev.filter(user => user.id !== userToDelete));
    setUserToDelete(null);
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso."
    });
  };

  const handleOpenNewUserDialog = () => {
    setIsNewUserDialogOpen(true);
  };

  return {
    isUsersLoading,
    users,
    setUsers,
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
    handleEditUser,
    handleUpdateUser,
    handleCreateUser,
    openDeleteDialog,
    handleDeleteUser,
    handleOpenNewUserDialog
  };
};
