// Arquivo: src/pages/Index.tsx (VERSÃO CORRIGIDA)

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FileTable from "@/components/FileTable";
import Footer from "@/components/Footer";
import ExtractionSearchForm from "@/components/extraction/ExtractionSearchForm";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("type") || "mei";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ 1. CRIE A FUNÇÃO QUE SERÁ PASSADA COMO PROP
  const handleSearchCompleted = () => {
    console.log("A BUSCA FOI CONCLUÍDA! A página foi notificada.");
    // No futuro, esta função irá forçar a atualização da <FileTable />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        {/* ✅ 2. PASSE A FUNÇÃO PARA A PROP 'onSearchCompleted' */}
        <ExtractionSearchForm onSearchCompleted={handleSearchCompleted} />
        
        <div className="mt-8">
          <FileTable 
            type={activeTab} 
            searchFilter={searchFilter} 
            searchTerm={searchTerm} 
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;