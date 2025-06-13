
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

interface Domain {
  _id: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DomainDialogsProps {
  domainToEdit: Domain | null;
  isEditDomainDialogOpen: boolean;
  setIsEditDomainDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDomainToEdit: React.Dispatch<React.SetStateAction<Domain | null>>;
  handleUpdateDomain: () => void;
  
  domainToDelete: string | null;
  setDomainToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeleteDomain: () => void;
}

const DomainDialogs = ({
  domainToEdit,
  isEditDomainDialogOpen,
  setIsEditDomainDialogOpen,
  setDomainToEdit,
  handleUpdateDomain,
  
  domainToDelete,
  setDomainToDelete,
  handleDeleteDomain
}: DomainDialogsProps) => {
  return (
    <>
      <Dialog open={isEditDomainDialogOpen} onOpenChange={setIsEditDomainDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Domínio</DialogTitle>
            <DialogDescription>
              Atualize as informações do domínio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-domain-url" className="text-sm font-medium">Domínio</label>
              <Input
                id="edit-domain-url"
                value={domainToEdit?.domain || ""}
                onChange={(e) => setDomainToEdit(prev => prev ? {...prev, domain: e.target.value} : prev)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="domain-status"
                    checked={domainToEdit?.isActive === true}
                    onChange={() => setDomainToEdit(prev => prev ? {...prev, isActive: true} : prev)}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Ativo</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="domain-status"
                    checked={domainToEdit?.isActive === false}
                    onChange={() => setDomainToEdit(prev => prev ? {...prev, isActive: false} : prev)}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Inativo</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleUpdateDomain}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={domainToDelete !== null} onOpenChange={() => setDomainToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este domínio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDomain} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DomainDialogs;
