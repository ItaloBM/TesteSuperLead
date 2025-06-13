
import { useState, useEffect } from "react";
import { FileData } from "@/types/file";
import { useToast } from "@/hooks/use-toast";
import { fetchUserDocuments } from "@/services/documentService";

export const useDocuments = (
  type: string,
  hasMeiAccess: boolean,
  hasCnpjAccess: boolean
) => {
  const [data, setData] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      
      try {
        const documents = await fetchUserDocuments(hasMeiAccess, hasCnpjAccess, type);
        setData(documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar seus documentos. Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [type, hasMeiAccess, hasCnpjAccess, toast]);

  return {
    data,
    isLoading
  };
};
