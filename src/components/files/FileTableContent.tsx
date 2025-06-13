
import { FC } from "react";
import { Download, File } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileData } from "@/types/file";
import { useToast } from "@/hooks/use-toast";

interface FileTableContentProps {
  paginatedData: FileData[];
  isLoading: boolean;
  hasMeiAccess: boolean;
  hasCnpjAccess: boolean;
}

const FileTableContent: FC<FileTableContentProps> = ({
  paginatedData,
  isLoading,
  hasMeiAccess,
  hasCnpjAccess
}) => {
  const { toast } = useToast();

  const handleDownload = (file: FileData) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${file.name}...`,
    });
    
    // In a real scenario, we'd call the API
    console.log(`Downloading ${file.name} from ${file.url}`);
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">Carregando documentos...</div>
        </TableCell>
      </TableRow>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
          {(!hasMeiAccess && !hasCnpjAccess) 
            ? "Você não tem acesso a nenhum tipo de documento." 
            : "Nenhum documento encontrado"}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {paginatedData.map((file) => (
        <TableRow key={file.id} className="hover:bg-gray-50">
          <TableCell>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-gray-500" />
                {file.name}
              </div>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-primary pl-6 -mt-1 h-auto py-0 justify-start"
                onClick={() => handleDownload(file)}
              >
                <Download className="h-3 w-3 mr-1" />
                baixar arquivo
              </Button>
            </div>
          </TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                file.type === "mei"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {file.type.toUpperCase()}
            </span>
          </TableCell>
          <TableCell>{file.lastModified}</TableCell>
          <TableCell>{file.date}</TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default FileTableContent;
