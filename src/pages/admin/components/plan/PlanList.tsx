
import { Service } from "../../types";
import PlanTable from "./PlanTable";
import PlanPagination from "./PlanPagination";

interface PlanListProps {
  paginatedServices: Service[];
  handleEditService: (service: Service) => void;
  openDeleteServiceDialog: (serviceId: number) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const PlanList = ({
  paginatedServices,
  handleEditService,
  openDeleteServiceDialog,
  currentPage,
  totalPages,
  handlePageChange
}: PlanListProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <PlanTable 
        services={paginatedServices}
        handleEditService={handleEditService}
        openDeleteServiceDialog={openDeleteServiceDialog}
      />
      
      {totalPages > 0 && (
        <PlanPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PlanList;
