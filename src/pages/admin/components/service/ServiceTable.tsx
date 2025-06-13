
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

interface ServiceTableProps {
  services: Service[];
  handleEditService: (service: Service) => void;
  openDeleteServiceDialog: (serviceId: number) => void;
}

const ServiceTable = ({ 
  services, 
  handleEditService, 
  openDeleteServiceDialog 
}: ServiceTableProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          Serviços Disponíveis
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NOME DO SERVIÇO</TableHead>
            <TableHead>DESCRIÇÃO</TableHead>
            <TableHead>PREÇO</TableHead>
            <TableHead>STATUS</TableHead>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === "active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {service.status === "active" ? "Ativo" : "Inativo"}
                  </span>
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
                Nenhum serviço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;
