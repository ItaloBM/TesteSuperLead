
import { useState } from "react";
import { Domain } from "../types";

export const useDomainPagination = (domains: Domain[], itemsPerPage: number) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredDomains = domains.filter(domain => 
    domain.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDomains = filteredDomains.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    filteredDomains,
    paginatedDomains,
    totalPages,
    handlePageChange
  };
};
