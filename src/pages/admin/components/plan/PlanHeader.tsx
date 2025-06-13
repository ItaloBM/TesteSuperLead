
import { List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanHeaderProps {
  handleOpenNewServiceDialog: () => void;
}

const PlanHeader = ({ handleOpenNewServiceDialog }: PlanHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <List className="h-6 w-6 text-primary" />
        Gerenciamento de Planos
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        onClick={handleOpenNewServiceDialog}
      >
        <Plus className="h-4 w-4" />
        Novo Plano
      </Button>
    </div>
  );
};

export default PlanHeader;
