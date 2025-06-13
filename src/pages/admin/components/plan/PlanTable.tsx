
import { List, PenSquare, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Service } from "../../types";

interface PlanTableProps {
  services: Service[];
  handleEditService: (service: Service) => void;
  openDeleteServiceDialog: (serviceId: number) => void;
}

const PlanTable = ({ 
  services, 
  handleEditService, 
  openDeleteServiceDialog 
}: PlanTableProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          Planos Disponíveis
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOME DO PLANO</TableHead>
            <TableHead>DESCRIÇÃO</TableHead>
            <TableHead>PREÇO</TableHead>
            <TableHead>MAX QUERIES</TableHead>
            <TableHead>AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  {service.name}
                </TableCell>
                <TableCell className="max-w-md">
                  {service.description}
                </TableCell>
                <TableCell>
                  {service.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell>
                  {service.maxQueries || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <PenSquare className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteServiceDialog(service.id)}
                      className="p-1 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                Nenhum plano encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlanTable;
