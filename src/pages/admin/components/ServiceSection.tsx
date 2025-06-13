
import { useServicePagination } from "../hooks/useServicePagination";
import { Service } from "../types";
import ServiceHeader from "./service/ServiceHeader";
import ServiceSearch from "./service/ServiceSearch";
import ServiceList from "./service/ServiceList";

interface ServiceSectionProps {
  services: Service[];
  handleEditService: (service: Service) => void;
  openDeleteServiceDialog: (serviceId: number) => void;
  handleOpenNewServiceDialog: () => void;
  ITEMS_PER_PAGE: number;
}

const ServiceSection = ({ 
  services, 
  handleEditService, 
  openDeleteServiceDialog, 
  handleOpenNewServiceDialog,
  ITEMS_PER_PAGE
}: ServiceSectionProps) => {
  const {
    serviceSearchTerm,
    setServiceSearchTerm,
    currentPage,
    totalPages,
    paginatedServices,
    handlePageChange
  } = useServicePagination(services, ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col space-y-6">
      <ServiceHeader handleOpenNewServiceDialog={handleOpenNewServiceDialog} />
      
      <ServiceSearch 
        searchTerm={serviceSearchTerm}
        setSearchTerm={setServiceSearchTerm}
      />
      
      <ServiceList 
        paginatedServices={paginatedServices}
        handleEditService={handleEditService}
        openDeleteServiceDialog={openDeleteServiceDialog}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default ServiceSection;
