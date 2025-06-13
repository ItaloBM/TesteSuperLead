import { FC } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useFilePagination } from "@/hooks/useFilePagination";
import FileTableContent from "./files/FileTableContent";
import FilePagination from "./files/FilePagination";
import ResultsHeader from "./files/ResultsHeader";
import { FileData } from "@/types/file"; // Importe o tipo FileData

// ✅ 1. A tabela agora recebe 'data' e 'isLoading' como props
interface FileTableProps {
  data: FileData[];
  isLoading: boolean;
  searchTerm: string;
}

const FileTable: FC<FileTableProps> = ({ data, isLoading, searchTerm }) => {
  const { user } = useAuth();
  const hasMeiAccess = user?.services?.includes('mei') || false;
  const hasCnpjAccess = user?.services?.includes('cnpj') || false;
  
  // ✅ 2. O hook 'useDocuments' foi removido daqui

  // A paginação agora usa os dados recebidos via props
  const { paginatedData, filteredData, currentPage, totalPages, handlePageChange } = 
    useFilePagination(data, "name", searchTerm); // "name" como filtro padrão, ajuste se necessário

  return (
    <div className="w-full space-y-4">
      <ResultsHeader totalResults={filteredData.length} />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Nome</TableHead>
                <TableHead className="w-[20%]">Tipo</TableHead>
                <TableHead className="w-[20%]">Última Modificação</TableHead>
                <TableHead className="w-[20%]">Criado Em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FileTableContent
                paginatedData={paginatedData}
                isLoading={isLoading}
                hasMeiAccess={hasMeiAccess}
                hasCnpjAccess={hasCnpjAccess}
              />
            </TableBody>
          </Table>
        </div>

        {filteredData.length > 0 && (
          <FilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default FileTable;