
import { Globe } from "lucide-react";
import { useDomainHandlers } from "../hooks/useDomainHandlers";
import AddDomainForm from "./domain/AddDomainForm";
import DomainList from "./domain/DomainList";
import DomainDialogs from "./DomainDialogs";

interface DomainSectionProps {
  ITEMS_PER_PAGE: number;
}

const DomainSection = ({ ITEMS_PER_PAGE }: DomainSectionProps) => {
  const {
    domains,
    isLoading,
    domainToEdit,
    setDomainToEdit,
    isEditDomainDialogOpen,
    setIsEditDomainDialogOpen,
    domainToDelete,
    setDomainToDelete,
    newDomain,
    setNewDomain,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleAddDomain,
    handleEditDomain,
    handleUpdateDomain,
    openDeleteDomainDialog,
    handleDeleteDomain,
    handlePageChange
  } = useDomainHandlers(ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando domínios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Gerenciamento de Domínios CORS
        </h1>
      </div>
      
      <AddDomainForm 
        newDomain={newDomain}
        setNewDomain={setNewDomain}
        handleAddDomain={handleAddDomain}
      />
      
      <DomainList 
        domains={domains}
        domainSearchTerm={searchTerm}
        setDomainSearchTerm={setSearchTerm}
        handleEditDomain={handleEditDomain}
        openDeleteDomainDialog={openDeleteDomainDialog}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
      />

      <DomainDialogs
        domainToEdit={domainToEdit}
        isEditDomainDialogOpen={isEditDomainDialogOpen}
        setIsEditDomainDialogOpen={setIsEditDomainDialogOpen}
        setDomainToEdit={setDomainToEdit}
        handleUpdateDomain={handleUpdateDomain}
        
        domainToDelete={domainToDelete}
        setDomainToDelete={setDomainToDelete}
        handleDeleteDomain={handleDeleteDomain}
      />
    </div>
  );
};

export default DomainSection;
