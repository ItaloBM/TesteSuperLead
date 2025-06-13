
import { useState } from "react";
import AdminContent from "./components/AdminContent";
import AdminDialogs from "./components/AdminDialogs";
import Sidebar from "./components/Sidebar";
import Header from "@/components/Header";
import { useAdminState } from "./hooks/useAdminState";

const AdminPage = () => {
  const {
    // User data and handlers
    users,
    isUsersLoading,
    currentPage,
    totalPages,
    userToEdit,
    setUserToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isNewUserDialogOpen,
    setIsNewUserDialogOpen,
    newUser,
    setNewUser,
    userToDelete,
    setUserToDelete,
    loadUsers,
    handleUpdateUser,
    handleCreateUser,
    handleDeleteUser,
    handleEditUser,
    openDeleteDialog,
    handleOpenNewUserDialog,
    handlePageChange,
    hasLoadedInitially,
    
    // Lead data and handlers
    leads,
    isLeadsLoading,
    leadCurrentPage,
    leadTotalPages,
    leadToEdit,
    setLeadToEdit,
    isEditLeadDialogOpen,
    setIsEditLeadDialogOpen,
    leadToDelete,
    setLeadToDelete,
    loadLeads,
    handleEditLead,
    handleUpdateLead,
    handleDeleteLead,
    openDeleteLeadDialog,
    handleLeadPageChange
  } = useAdminState();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("users");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:static 
        inset-y-0 left-0 
        z-30 lg:z-auto
        w-64 
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <AdminContent
            currentView={currentView}
            users={users}
            isUsersLoading={isUsersLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            leads={leads}
            isLeadsLoading={isLeadsLoading}
            leadCurrentPage={leadCurrentPage}
            leadTotalPages={leadTotalPages}
            handleEditUser={handleEditUser}
            openDeleteDialog={openDeleteDialog}
            handleOpenNewUserDialog={handleOpenNewUserDialog}
            handlePageChange={handlePageChange}
            loadUsers={loadUsers}
            handleEditLead={handleEditLead}
            openDeleteLeadDialog={openDeleteLeadDialog}
            handleLeadPageChange={handleLeadPageChange}
            loadLeads={loadLeads}
            hasLoadedInitially={hasLoadedInitially}
          />
        </main>
      </div>

      {/* Dialogs */}
      <AdminDialogs
        // User dialog props
        userToEdit={userToEdit}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setUserToEdit={setUserToEdit}
        handleUpdateUser={handleUpdateUser}
        isNewUserDialogOpen={isNewUserDialogOpen}
        setIsNewUserDialogOpen={setIsNewUserDialogOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        handleCreateUser={handleCreateUser}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        handleDeleteUser={handleDeleteUser}
        
        // Lead dialog props
        leadToEdit={leadToEdit}
        isEditLeadDialogOpen={isEditLeadDialogOpen}
        setIsEditLeadDialogOpen={setIsEditLeadDialogOpen}
        setLeadToEdit={setLeadToEdit}
        handleUpdateLead={handleUpdateLead}
        leadToDelete={leadToDelete}
        setLeadToDelete={setLeadToDelete}
        handleDeleteLead={handleDeleteLead}
      />
    </div>
  );
};

export default AdminPage;
