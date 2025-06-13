import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FileTable from "@/components/FileTable";
import Footer from "@/components/Footer";
import ExtractionSearchForm from "@/components/extraction/ExtractionSearchForm";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments } from "@/hooks/useDocuments"; // Importe o hook aqui

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("type") || "mei"; // 'mei' ou 'cnpj'
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { user } = useAuth();
  const hasMeiAccess = user?.services?.includes('mei') || false;
  const hasCnpjAccess = user?.services?.includes('cnpj') || false;

  // ✅ 1. CHAME O HOOK AQUI NA PÁGINA PAI
  const { data: documents, isLoading, refetch } = useDocuments(activeTab, hasMeiAccess, hasCnpjAccess);

  // ✅ 2. ATUALIZE A FUNÇÃO PARA CHAMAR O 'refetch'
  const handleSearchCompleted = () => {
    console.log("A BUSCA FOI CONCLUÍDA! Atualizando a lista de arquivos...");
    // Adiciona um pequeno delay para dar tempo ao backend de processar o arquivo
    setTimeout(() => {
      refetch();
    }, 1500); // 1.5 segundos de delay (ajuste se necessário)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        {/* O formulário de busca agora chama a função correta */}
        <ExtractionSearchForm onSearchCompleted={handleSearchCompleted} />
        
        <div className="mt-8">
          {/* ✅ 3. PASSE OS DADOS E O 'isLoading' COMO PROPS PARA A TABELA */}
          <FileTable 
            data={documents} 
            isLoading={isLoading}
            searchTerm={searchTerm} 
            // O tipo, filtro de busca, etc. ainda podem ser passados se a tabela fizer filtragem no cliente
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;