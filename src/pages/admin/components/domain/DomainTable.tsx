
import { PenSquare, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Domain } from "../../types";

interface DomainTableProps {
  domains: Domain[];
  handleEditDomain: (domain: Domain) => void;
  openDeleteDomainDialog: (domainId: string) => void; // id string
}

const DomainTable = ({ domains, handleEditDomain, openDeleteDomainDialog }: DomainTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>DOMÍNIO</TableHead>
          <TableHead>DATA DE CRIAÇÃO</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>AÇÕES</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.length > 0 ? (
          domains.map((domain) => (
            <TableRow key={domain._id}>
              <TableCell className="font-medium">{domain.domain}</TableCell>
              <TableCell>{domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    domain.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {domain.isActive ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 hover:text-primary transition-colors"
                    onClick={() => handleEditDomain(domain)}
                  >
                    <PenSquare className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 hover:text-red-600 transition-colors"
                    onClick={() => openDeleteDomainDialog(domain._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
              Nenhum domínio encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DomainTable;
