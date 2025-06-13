
import { useState, useMemo } from "react";
import { Service } from "../types";

export const usePlanPagination = (services: Service[], itemsPerPage: number) => {
  const [planSearchTerm, setPlanSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredPlans = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(planSearchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(planSearchTerm.toLowerCase())
    );
  }, [services, planSearchTerm]);
  
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    planSearchTerm,
    setPlanSearchTerm,
    currentPage,
    totalPages,
    paginatedPlans,
    handlePageChange
  };
};
