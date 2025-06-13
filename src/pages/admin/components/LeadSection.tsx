
import { useState } from "react";
import { Lead } from "../types";
import { useLeadHandlers } from "../hooks/useLeadHandlers";

// Import the new components
import LeadHeader from "./lead/LeadHeader";
import LeadSearch from "./lead/LeadSearch";
import LeadTable from "./lead/LeadTable";
import LeadPagination from "./lead/LeadPagination";

interface LeadSectionProps {
  leads: Lead[];
  handleEditLead: (lead: Lead) => void;
  openDeleteLeadDialog: (leadId: string) => void;
  ITEMS_PER_PAGE: number;
}

const LeadSection = ({ 
  ITEMS_PER_PAGE
}: LeadSectionProps) => {
  const {
    leads,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleEditLead,
    openDeleteDialog,
    handlePageChange
  } = useLeadHandlers(ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <LeadHeader />
      <LeadSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden w-full">
        <LeadTable 
          leads={leads} 
          handleEditLead={handleEditLead}
          openDeleteDialog={openDeleteDialog}
        />
        
        {totalPages > 0 && (
          <LeadPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default LeadSection;
