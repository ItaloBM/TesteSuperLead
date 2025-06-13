
import { useState, useMemo } from "react";
import { Service } from "../types";

export const useServicePagination = (services: Service[], itemsPerPage: number) => {
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
  }, [services, serviceSearchTerm]);
  
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    serviceSearchTerm,
    setServiceSearchTerm,
    currentPage,
    totalPages,
    paginatedServices,
    handlePageChange
  };
};
