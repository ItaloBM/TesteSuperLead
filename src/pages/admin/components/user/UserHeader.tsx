
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  handleOpenNewUserDialog: () => void;
}

const UserHeader = ({ handleOpenNewUserDialog }: UserHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        Gerenciamento de Usuários
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90"
        onClick={handleOpenNewUserDialog}
      >
        <Plus className="h-4 w-4 mr-1" />
        Novo Usuário
      </Button>
    </div>
  );
};

export default UserHeader;
