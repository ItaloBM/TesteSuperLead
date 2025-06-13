
import { useState } from "react";
import { Domain } from "../../types";
import DomainSearch from "./DomainSearch";
import DomainTable from "./DomainTable";
import DomainPagination from "./DomainPagination";

interface DomainListProps {
  domains: Domain[];
  domainSearchTerm: string;
  setDomainSearchTerm: (term: string) => void;
  handleEditDomain: (domain: Domain) => void;
  openDeleteDomainDialog: (domainId: string) => void;
  ITEMS_PER_PAGE: number;
}

const DomainList = ({
  domains,
  domainSearchTerm,
  setDomainSearchTerm,
  handleEditDomain,
  openDeleteDomainDialog,
  ITEMS_PER_PAGE
}: DomainListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(domains.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDomains = domains.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <DomainSearch 
        searchTerm={domainSearchTerm} 
        setSearchTerm={setDomainSearchTerm} 
      />
      
      <div className="bg-white rounded-xl shadow-sm border">
        <DomainTable
          domains={paginatedDomains}
          handleEditDomain={handleEditDomain}
          openDeleteDomainDialog={openDeleteDomainDialog}
        />
        
        {domains.length > 0 && (
          <DomainPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default DomainList;
