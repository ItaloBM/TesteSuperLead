
import { FileData } from "@/types/file";
import { documentService } from "./routes/document";

export const fetchUserDocuments = async (hasMeiAccess: boolean, hasCnpjAccess: boolean, type?: string): Promise<FileData[]> => {
  try {
    // Chama o serviço de documentos da API
    const apiDocuments = await documentService.getUserDocuments();
    
    // Converte os documentos da API para o formato FileData
    const documents: FileData[] = apiDocuments.map(doc => ({
      id: doc.id,
      name: doc.name,
      lastModified: doc.lastModified,
      date: doc.date,
      url: doc.url,
      type: doc.type
    }));

    // Filtra documentos com base no tipo de acesso e filtro opcional
    let filteredDocuments = documents.filter(doc => 
      (hasMeiAccess && doc.type === 'mei') || 
      (hasCnpjAccess && doc.type === 'cnpj')
    );

    // Aplica filtro adicional de tipo, se especificado
    if (type === 'mei') {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === 'mei');
    } else if (type === 'cnpj') {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === 'cnpj');
    }

    return filteredDocuments;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    return []; // Retorna lista vazia em caso de erro
  }
};
