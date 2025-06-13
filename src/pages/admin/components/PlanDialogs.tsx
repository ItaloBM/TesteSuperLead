
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "../types";

interface PlanDialogsProps {
  // Edit dialog props
  planToEdit: Service | null;
  isEditPlanDialogOpen: boolean;
  setIsEditPlanDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPlanToEdit: React.Dispatch<React.SetStateAction<Service | null>>;
  handleUpdatePlan: () => void;
  
  // New plan dialog props
  isNewPlanDialogOpen: boolean;
  setIsNewPlanDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newPlan: Omit<Service, 'id'>;
  setNewPlan: React.Dispatch<React.SetStateAction<Omit<Service, 'id'>>>;
  handleCreatePlan: () => void;
  
  // Delete dialog props
  planToDelete: string | null;
  setPlanToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  handleDeletePlan: () => void;
}

const PlanDialogs = ({
  planToEdit,
  isEditPlanDialogOpen,
  setIsEditPlanDialogOpen,
  setPlanToEdit,
  handleUpdatePlan,
  isNewPlanDialogOpen,
  setIsNewPlanDialogOpen,
  newPlan,
  setNewPlan,
  handleCreatePlan,
  planToDelete,
  setPlanToDelete,
  handleDeletePlan
}: PlanDialogsProps) => {
  return (
    <>
      {/* New Plan Dialog */}
      <Dialog open={isNewPlanDialogOpen} onOpenChange={setIsNewPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
            <DialogDescription>
              Adicione um novo plano ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                placeholder="Digite o nome do plano"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Digite a descrição do plano"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxQueries">Máximo de Consultas</Label>
              <Input
                id="maxQueries"
                type="number"
                value={newPlan.maxQueries || 0}
                onChange={(e) => setNewPlan({ ...newPlan, maxQueries: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPlanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePlan}>
              Criar Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              Edite as informações do plano.
            </DialogDescription>
          </DialogHeader>
          {planToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome do Plano</Label>
                <Input
                  id="edit-name"
                  value={planToEdit.name}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, name: e.target.value })}
                  placeholder="Digite o nome do plano"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={planToEdit.description}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, description: e.target.value })}
                  placeholder="Digite a descrição do plano"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={planToEdit.price}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, price: Number(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-maxQueries">Máximo de Consultas</Label>
                <Input
                  id="edit-maxQueries"
                  type="number"
                  value={planToEdit.maxQueries || 0}
                  onChange={(e) => setPlanToEdit({ ...planToEdit, maxQueries: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePlan}>
              Atualizar Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Dialog */}
      <Dialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlanDialogs;
