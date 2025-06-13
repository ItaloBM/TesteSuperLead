
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

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  status: "active" | "inactive";
}

interface ServiceDialogsProps {
  serviceToEdit: Service | null;
  isEditServiceDialogOpen: boolean;
  setIsEditServiceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setServiceToEdit: React.Dispatch<React.SetStateAction<Service | null>>;
  handleUpdateService: () => void;
  
  isNewServiceDialogOpen: boolean;
  setIsNewServiceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newService: Omit<Service, 'id'>;
  setNewService: React.Dispatch<React.SetStateAction<Omit<Service, 'id'>>>;
  handleCreateService: () => void;
  
  serviceToDelete: number | null;
  setServiceToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  handleDeleteService: () => void;
}

const ServiceDialogs = ({
  serviceToEdit,
  isEditServiceDialogOpen,
  setIsEditServiceDialogOpen,
  setServiceToEdit,
  handleUpdateService,
  
  isNewServiceDialogOpen,
  setIsNewServiceDialogOpen,
  newService,
  setNewService,
  handleCreateService,
  
  serviceToDelete,
  setServiceToDelete,
  handleDeleteService
}: ServiceDialogsProps) => {
  return (
    <>
      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize as informações do serviço.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-service-name" className="text-sm font-medium">Nome do Serviço</label>
              <Input
                id="edit-service-name"
                value={serviceToEdit?.name || ""}
                onChange={(e) => setServiceToEdit(prev => prev ? {...prev, name: e.target.value} : prev)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-service-desc" className="text-sm font-medium">Descrição</label>
              <Input
                id="edit-service-desc"
                value={serviceToEdit?.description || ""}
                onChange={(e) => setServiceToEdit(prev => prev ? {...prev, description: e.target.value} : prev)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-service-price" className="text-sm font-medium">Preço</label>
              <Input
                id="edit-service-price"
                type="number"
                step="0.01"
                value={serviceToEdit?.price || 0}
                onChange={(e) => setServiceToEdit(prev => prev ? {...prev, price: parseFloat(e.target.value)} : prev)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="service-status"
                    checked={serviceToEdit?.status === "active"}
                    onChange={() => setServiceToEdit(prev => prev ? {...prev, status: "active"} : prev)}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Ativo</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="service-status"
                    checked={serviceToEdit?.status === "inactive"}
                    onChange={() => setServiceToEdit(prev => prev ? {...prev, status: "inactive"} : prev)}
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
            <Button type="button" onClick={handleUpdateService}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo serviço no formulário abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="new-service-name" className="text-sm font-medium">Nome do Serviço</label>
              <Input
                id="new-service-name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="new-service-desc" className="text-sm font-medium">Descrição</label>
              <Input
                id="new-service-desc"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="new-service-price" className="text-sm font-medium">Preço</label>
              <Input
                id="new-service-price"
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="new-service-status"
                    checked={newService.status === "active"}
                    onChange={() => setNewService({...newService, status: "active"})}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Ativo</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="new-service-status"
                    checked={newService.status === "inactive"}
                    onChange={() => setNewService({...newService, status: "inactive"})}
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
            <Button type="button" onClick={handleCreateService}>
              Criar serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={serviceToDelete !== null} onOpenChange={() => setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-red-600 hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceDialogs;
