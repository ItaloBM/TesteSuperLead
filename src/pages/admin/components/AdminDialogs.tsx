
import UserDialogs from "./UserDialogs";
import { User, Lead } from "../types";

interface AdminDialogsProps {
  // User dialog props
  userToEdit: User | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToEdit: React.Dispatch<React.SetStateAction<User | null>>;
  handleUpdateUser: () => void;
  isNewUserDialogOpen: boolean;
  setIsNewUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>;
  setNewUser: React.Dispatch<React.SetStateAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>>;
  handleCreateUser: (password: string) => Promise<void>;
  userToDelete: string | null;
  setUserToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteUser: () => void;
  
  // Lead dialog props
  leadToEdit: Lead | null;
  isEditLeadDialogOpen: boolean;
  setIsEditLeadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLeadToEdit: React.Dispatch<React.SetStateAction<Lead | null>>;
  handleUpdateLead: () => void;
  leadToDelete: string | null;
  setLeadToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteLead: () => void;
}

const AdminDialogs = ({
  // User dialog props
  userToEdit,
  isEditDialogOpen,
  setIsEditDialogOpen,
  setUserToEdit,
  handleUpdateUser,
  isNewUserDialogOpen,
  setIsNewUserDialogOpen,
  newUser,
  setNewUser,
  handleCreateUser,
  userToDelete,
  setUserToDelete,
  handleDeleteUser,
  
  // Lead dialog props
  leadToEdit,
  isEditLeadDialogOpen,
  setIsEditLeadDialogOpen,
  setLeadToEdit,
  handleUpdateLead,
  leadToDelete,
  setLeadToDelete,
  handleDeleteLead
}: AdminDialogsProps) => {
  return (
    <>
      <UserDialogs
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
      />
    </>
  );
};

export default AdminDialogs;
