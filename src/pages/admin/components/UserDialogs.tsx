import { useState, useEffect } from "react";
import { Power, PowerOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Plan } from "../types";
import NewUserDialog from "./user/NewUserDialog";
import { planService } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface UserDialogsProps {
  userToEdit: User | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToEdit: React.Dispatch<React.SetStateAction<User | null>>;
  handleUpdateUser: () => void;
  handleToggleStatus: (user: User) => void;

  isNewUserDialogOpen: boolean;
  setIsNewUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>;
  setNewUser: React.Dispatch<React.SetStateAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>>;
  handleCreateUser: (password: string) => Promise<void>;

  userToDelete: string | null;
  setUserToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteUser: () => void;
}

const UserDialogs = ({
  userToEdit,
  isEditDialogOpen,
  setIsEditDialogOpen,
  setUserToEdit,
  handleUpdateUser,
  handleToggleStatus,
  isNewUserDialogOpen,
  setIsNewUserDialogOpen,
  newUser,
  setNewUser,
  handleCreateUser,
  userToDelete,
  setUserToDelete,
  handleDeleteUser
}: UserDialogsProps) => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    // Carrega os planos apenas se o modal de edição estiver aberto para otimizar
    if (isEditDialogOpen) {
      const loadPlans = async () => {
        setIsLoadingPlans(true);
        try {
          const response = await planService.getPlans(1, 100);
          if (response.objRecords && response.objRecords.records) {
            setPlans(response.objRecords.records);
          }
        } catch (error) {
          console.error("Erro ao carregar planos:", error);
          toast({
            title: "Erro ao carregar planos",
            description: "Não foi possível carregar a lista de planos.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingPlans(false);
        }
      };
      loadPlans();
    }
  }, [isEditDialogOpen, toast]);

  return (
    <>
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os dados ou ative/desative a conta do usuário.
            </DialogDescription>
          </DialogHeader>

          {/* Formulário com os dados do usuário */}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={userToEdit?.name || ""}
                onChange={(e) => setUserToEdit(prev => prev ? { ...prev, name: e.target.value } : prev)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF/CNPJ</Label>
              <Input
                id="edit-cpf"
                value={userToEdit?.cpfOrCnpj || ""}
                onChange={(e) => setUserToEdit(prev => prev ? { ...prev, cpfOrCnpj: e.target.value } : prev)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={userToEdit?.email || ""}
                onChange={(e) => setUserToEdit(prev => prev ? { ...prev, email: e.target.value } : prev)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={userToEdit?.phone || ""}
                onChange={(e) => setUserToEdit(prev => prev ? { ...prev, phone: e.target.value } : prev)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-plan">Plano</Label>
              {isLoadingPlans ? (
                 <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-gray-50">
                   <span className="text-gray-500">Carregando planos...</span>
                 </div>
              ) : (
                <select
                  id="edit-plan"
                  value={userToEdit?.plan || ""}
                  onChange={(e) => setUserToEdit(prev => prev ? { ...prev, plan: e.target.value } : prev)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione um plano</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan.name}>
                      {plan.name} - {plan.description}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* === FOOTER AJUSTADO === */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
             {/* Botão de Ativar/Desativar Conta */}
            {userToEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleToggleStatus(userToEdit)}
                className={`w-full sm:w-auto mt-2 sm:mt-0
                  ${userToEdit.activeAccount 
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200' 
                    : 'text-green-600 hover:bg-green-50 hover:text-green-700 border-green-200'
                  }
                `}
              >
                {userToEdit.activeAccount ? (
                  <PowerOff className="mr-2 h-4 w-4" />
                ) : (
                  <Power className="mr-2 h-4 w-4" />
                )}
                {userToEdit.activeAccount ? 'Desativar Conta' : 'Ativar Conta'}
              </Button>
            )}

            {/* Botões de Fechar e Salvar */}
            <div className="flex justify-end gap-2 w-full sm:w-auto">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Fechar
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleUpdateUser} disabled={isLoadingPlans} className="w-full sm:w-auto">
                Salvar Alterações
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <NewUserDialog
        isOpen={isNewUserDialogOpen}
        onOpenChange={setIsNewUserDialogOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        onCreateUser={handleCreateUser}
      />

      {/* Delete User Dialog */}
      <AlertDialog open={userToDelete !== null} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDialogs;