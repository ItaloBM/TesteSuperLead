
import { useState, useMemo } from "react";
import { FileData } from "@/types/file";

const ITEMS_PER_PAGE = 2; // Number of items to display per page

export const useFilePagination = (data: FileData[], searchFilter: string, searchTerm: string) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter data based on search criteria
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter((file) => {
      switch (searchFilter) {
        case "name":
          return file.name.toLowerCase().includes(searchLower);
        case "lastModified":
          return file.lastModified.toLowerCase().includes(searchLower);
        case "date":
          return file.date.toLowerCase().includes(searchLower);
        default:
          return true;
      }
    });
  }, [data, searchFilter, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    filteredData,
    paginatedData,
    currentPage,
    totalPages,
    handlePageChange
  };
};
