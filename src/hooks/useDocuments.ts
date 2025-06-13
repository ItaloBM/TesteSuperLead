import { useState, useEffect, useCallback } from "react";
import { FileData } from "@/types/file";
import { useToast } from "@/hooks/use-toast";
import { documentService } from "@/services";

export const useDocuments = (
  type: string,
  hasMeiAccess: boolean,
  hasCnpjAccess: boolean
) => {
  const [data, setData] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiDocuments = await documentService.getUserDocuments();
      const documents: FileData[] = apiDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        lastModified: doc.lastModified,
        date: doc.date,
        url: doc.url,
        type: doc.type
      }));

      let filteredDocuments = documents.filter(doc => 
        (hasMeiAccess && doc.type === 'mei') || 
        (hasCnpjAccess && doc.type === 'cnpj')
      );
      if (type === 'mei') {
        filteredDocuments = filteredDocuments.filter(doc => doc.type === 'mei');
      } else if (type === 'cnpj') {
        filteredDocuments = filteredDocuments.filter(doc => doc.type === 'cnpj');
      }
      setData(filteredDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erro ao carregar documentos",
        description: "Não foi possível carregar seus documentos. Verifique as rotas da API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, hasMeiAccess, hasCnpjAccess, toast]);

  useEffect(() => {
    if (hasMeiAccess || hasCnpjAccess) {
      loadDocuments();
    } else {
      setIsLoading(false);
      setData([]);
    }
  }, [loadDocuments, hasMeiAccess, hasCnpjAccess]);

  // A função 'loadDocuments' agora é retornada como 'refetch'
  return {
    data,
    isLoading,
    refetch: loadDocuments 
  };
};