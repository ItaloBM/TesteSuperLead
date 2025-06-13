
import { useUserHandlers } from "./useUserHandlers";
import { useLeadHandlers } from "./useLeadHandlers";

const ITEMS_PER_PAGE = 50;

export const useAdminState = () => {
  const userHandlers = useUserHandlers();
  const leadHandlers = useLeadHandlers(ITEMS_PER_PAGE);

  return {
    // User data and handlers
    users: userHandlers.users,
    setUsers: userHandlers.setUsers,
    isUsersLoading: userHandlers.isUsersLoading,
    currentPage: userHandlers.currentPage,
    totalPages: userHandlers.totalPages,
    userToEdit: userHandlers.userToEdit,
    setUserToEdit: userHandlers.setUserToEdit,
    isEditDialogOpen: userHandlers.isEditDialogOpen,
    setIsEditDialogOpen: userHandlers.setIsEditDialogOpen,
    isNewUserDialogOpen: userHandlers.isNewUserDialogOpen,
    setIsNewUserDialogOpen: userHandlers.setIsNewUserDialogOpen,
    userToDelete: userHandlers.userToDelete,
    setUserToDelete: userHandlers.setUserToDelete,
    newUser: userHandlers.newUser,
    setNewUser: userHandlers.setNewUser,
    loadUsers: userHandlers.loadUsers,
    handleEditUser: userHandlers.handleEditUser,
    handleUpdateUser: userHandlers.handleUpdateUser,
    handleCreateUser: userHandlers.handleCreateUser,
    openDeleteDialog: userHandlers.openDeleteDialog,
    handleDeleteUser: userHandlers.handleDeleteUser,
    handleOpenNewUserDialog: userHandlers.handleOpenNewUserDialog,
    handlePageChange: userHandlers.handlePageChange,
    hasLoadedInitially: userHandlers.hasLoadedInitially,

    // Lead data and handlers  
    leads: leadHandlers.leads,
    setLeads: leadHandlers.leads,
    isLeadsLoading: leadHandlers.isLoading,
    leadCurrentPage: leadHandlers.currentPage,
    leadTotalPages: leadHandlers.totalPages,
    leadToEdit: leadHandlers.leadToEdit,
    setLeadToEdit: leadHandlers.setLeadToEdit,
    isEditLeadDialogOpen: leadHandlers.isEditDialogOpen,
    setIsEditLeadDialogOpen: leadHandlers.setIsEditDialogOpen,
    leadToDelete: leadHandlers.leadToDelete,
    setLeadToDelete: leadHandlers.setLeadToDelete,
    loadLeads: (() => {}) as () => void,
    handleEditLead: leadHandlers.handleEditLead,
    handleUpdateLead: leadHandlers.handleUpdateLead,
    handleDeleteLead: leadHandlers.handleDeleteLead,
    openDeleteLeadDialog: leadHandlers.openDeleteDialog,
    handleLeadPageChange: leadHandlers.handlePageChange
  };
};
