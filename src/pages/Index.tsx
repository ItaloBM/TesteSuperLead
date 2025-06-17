import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { documentService } from "@/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtractionSearchForm from "@/components/extraction/ExtractionSearchForm";
import FileTable from "@/components/FileTable";
import { CnpjDetailModal } from "@/components/extraction/CnpjDetailModal";
import { FileData, CnpjDetails } from "@/pages/admin/types";

const Index = () => {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCnpjDetails, setSelectedCnpjDetails] = useState<CnpjDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleSearchCompleted = (results: FileData[]) => {
    setSearchResults(results);
  };

  const handleViewDetails = async (cnpjId: string) => {
    setIsLoadingDetails(true);
    setSelectedCnpjDetails(null);
    setIsDetailModalOpen(true);
    try {
      const details = await documentService.getSingleCnpjDetails(cnpjId);
      setSelectedCnpjDetails(details);
    } catch (error) {
      toast({
        title: "Erro ao Carregar Detalhes",
        description: "Não foi possível buscar as informações completas da empresa.",
        variant: "destructive",
      });
      setIsDetailModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <ExtractionSearchForm onSearchCompleted={handleSearchCompleted} setIsLoading={setIsLoading} />
          <div className="mt-8">
            <FileTable data={searchResults} isLoading={isLoading} searchTerm={""} onViewDetails={handleViewDetails} />
          </div>
        </main>
        <Footer />
      </div>
      <CnpjDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedCnpjDetails} />
    </>
  );
};

export default Index;