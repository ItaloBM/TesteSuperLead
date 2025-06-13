
import { List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceHeaderProps {
  handleOpenNewServiceDialog: () => void;
}

const ServiceHeader = ({ handleOpenNewServiceDialog }: ServiceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <List className="h-6 w-6 text-primary" />
        Gerenciamento de Serviços
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        onClick={handleOpenNewServiceDialog}
      >
        <Plus className="h-4 w-4" />
        Novo Serviço
      </Button>
    </div>
  );
};

export default ServiceHeader;
