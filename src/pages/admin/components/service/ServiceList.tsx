
import { Service } from "../../types";
import ServiceTable from "./ServiceTable";
import ServicePagination from "./ServicePagination";

interface ServiceListProps {
  paginatedServices: Service[];
  handleEditService: (service: Service) => void;
  openDeleteServiceDialog: (serviceId: number) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const ServiceList = ({
  paginatedServices,
  handleEditService,
  openDeleteServiceDialog,
  currentPage,
  totalPages,
  handlePageChange
}: ServiceListProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <ServiceTable 
        services={paginatedServices}
        handleEditService={handleEditService}
        openDeleteServiceDialog={openDeleteServiceDialog}
      />
      
      {totalPages > 0 && (
        <ServicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ServiceList;
