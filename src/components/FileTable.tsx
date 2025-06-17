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
import { FileData } from "@/types/file";

// ✅ A interface de props agora inclui a função onViewDetails
interface FileTableProps {
  data: FileData[];
  isLoading: boolean;
  searchTerm: string;
  onViewDetails: (id: string) => void;
}

const FileTable: FC<FileTableProps> = ({ data, isLoading, searchTerm, onViewDetails }) => {
  const { user } = useAuth();
  const hasMeiAccess = user?.services?.includes('mei') || false;
  const hasCnpjAccess = user?.services?.includes('cnpj') || false;

  const { paginatedData, filteredData, currentPage, totalPages, handlePageChange } = 
    useFilePagination(data, "name", searchTerm);

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
                onViewDetails={onViewDetails} // ✅ Passando a função para o componente filho
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