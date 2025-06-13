
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User } from "../../types";
import NewUserForm from "./NewUserForm";

interface NewUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>;
  setNewUser: React.Dispatch<React.SetStateAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>>;
  onCreateUser: (password: string) => void;
}

const NewUserDialog = ({ 
  isOpen, 
  onOpenChange, 
  newUser, 
  setNewUser, 
  onCreateUser 
}: NewUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário no formulário abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <NewUserForm
          newUser={newUser}
          setNewUser={setNewUser}
          onSubmit={onCreateUser}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
