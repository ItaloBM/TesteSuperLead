
import { useState, useEffect } from "react";
import { User } from "../types";

// Import the components
import UserHeader from "./user/UserHeader";
import UserSearch from "./user/UserSearch";
import UserTable from "./user/UserTable";
import UserPagination from "./user/UserPagination";

interface UserSectionProps {
  users: User[];
  isUsersLoading: boolean;
  currentPage: number;
  totalPages: number;
  handleEditUser: (user: User) => void;
  openDeleteDialog: (userId: string) => void;
  handleOpenNewUserDialog: () => void;
  handlePageChange: (page: number) => void;
  loadUsers: (page?: number, quantityRegisters?: number) => void;
  hasLoadedInitially: boolean;
}

const UserSection = ({ 
  users, 
  isUsersLoading,
  currentPage,
  totalPages,
  handleEditUser, 
  openDeleteDialog, 
  handleOpenNewUserDialog,
  handlePageChange,
  loadUsers,
  hasLoadedInitially
}: UserSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load users only when component is first rendered and hasn't loaded yet
  useEffect(() => {
    if (!hasLoadedInitially && !isUsersLoading) {
      loadUsers();
    }
  }, [hasLoadedInitially, isUsersLoading, loadUsers]);
  
  console.log("Users in UserSection:", users);
  console.log("Current page:", currentPage, "Total pages:", totalPages);
  
  // Filter users based on search term (client-side filtering for displayed results)
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpfOrCnpj?.includes(searchTerm)
  );

  if (isUsersLoading && !hasLoadedInitially) {
    return (
      <div className="flex flex-col space-y-6 w-full">
        <UserHeader handleOpenNewUserDialog={handleOpenNewUserDialog} />
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Carregando usuários...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <UserHeader handleOpenNewUserDialog={handleOpenNewUserDialog} />
      <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden w-full">
        <UserTable 
          users={filteredUsers}
          handleEditUser={handleEditUser}
          openDeleteDialog={openDeleteDialog}
        />
        
        {/* Show pagination based on API data, not filtered results */}
        {totalPages > 1 && (
          <UserPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>

      {/* Show total results info */}
      <div className="text-sm text-gray-500 text-center">
        {searchTerm ? (
          `Mostrando ${filteredUsers.length} usuário(s) filtrado(s) de ${users.length} total`
        ) : (
          `Página ${currentPage} de ${totalPages} - Total de usuários: ${users.length}`
        )}
      </div>
    </div>
  );
};

export default UserSection;
