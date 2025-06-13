
import { Lead } from "../../types";
import { PenSquare, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface LeadTableProps {
  leads: Lead[];
  handleEditLead: (lead: Lead) => void;
  openDeleteDialog: (leadId: string) => void;
}

const LeadTable = ({ leads, handleEditLead, openDeleteDialog }: LeadTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NOME</TableHead>
          <TableHead>CPF/CNPJ</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>TELEFONE</TableHead>
          <TableHead>PLANO</TableHead>
          <TableHead>DATA DE CRIAÇÃO</TableHead>
          <TableHead>AÇÕES</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.length > 0 ? (
          leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.cpfOrCnpj}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.plan === "PRO"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {lead.plan}
                </span>
              </TableCell>
              <TableCell>
                {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:text-primary transition-colors"
                    onClick={() => handleEditLead(lead)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 hover:text-red-600 transition-colors"
                    onClick={() => openDeleteDialog(lead.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
              Nenhum lead encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LeadTable;
