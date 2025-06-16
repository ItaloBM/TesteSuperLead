import { useState } from "react";
import Header from "@/components/Header";
import FileTable from "@/components/FileTable";
import Footer from "@/components/Footer";
import ExtractionSearchForm from "@/components/extraction/ExtractionSearchForm";
import { FileData } from "@/types/file";
import { CnpjDetailModal } from "@/components/extraction/CnpjDetailModal"; // ✅ Importa o novo modal

const Index = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Estados para controlar o modal
  const [selectedCnpj, setSelectedCnpj] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchCompleted = (results: any[]) => { // Recebe o array completo
    setSearchResults(results);
  };

  // ✅ Função para abrir o modal com os dados do CNPJ clicado
  const handleRowClick = (cnpjData: any) => {
    setSelectedCnpj(cnpjData);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          
          <ExtractionSearchForm 
            onSearchCompleted={handleSearchCompleted} 
            setIsLoading={setIsLoading} 
          />
          
          <div className="mt-8">
            <FileTable 
              data={searchResults} 
              isLoading={isLoading} 
              searchTerm={searchTerm}
              onRowClick={handleRowClick} // ✅ Passa a função de clique para a tabela
            />
          </div>
        </div>
        <Footer />
      </div>

      {/* ✅ Renderiza o modal */}
      <CnpjDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedCnpj}
      />
    </>
  );
};

export default Index;