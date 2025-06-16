// src/pages/Index.tsx

import { useState } from "react";
import Header from "@/components/Header";
import FileTable from "@/components/FileTable";
import Footer from "@/components/Footer";
import ExtractionSearchForm from "@/components/extraction/ExtractionSearchForm";
import { FileData } from "@/types/file";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FileData[]>([]);
  
  // ✅ 1. ESTADO DE 'CARREGANDO' ADICIONADO
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchCompleted = (results: FileData[]) => {
    console.log("Resultados recebidos na página Index:", results);
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        {/* ✅ 2. 'setIsLoading' AGORA É PASSADO COMO PROP */}
        <ExtractionSearchForm 
          onSearchCompleted={handleSearchCompleted} 
          setIsLoading={setIsLoading} 
        />
        
        <div className="mt-8">
          <FileTable 
            data={searchResults} 
            isLoading={isLoading} 
            searchTerm={searchTerm} 
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;