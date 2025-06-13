
import { usePlanHandlers } from "@/hooks/usePlanHandlers";
import PlanHeader from "./plan/PlanHeader";
import PlanSearch from "./plan/PlanSearch";
import PlanList from "./plan/PlanList";
import PlanDialogs from "./PlanDialogs";

interface PlanSectionProps {
  ITEMS_PER_PAGE: number;
}

const PlanSection = ({ ITEMS_PER_PAGE }: PlanSectionProps) => {
  const {
    plans,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    planToEdit,
    setPlanToEdit,
    isEditPlanDialogOpen,
    setIsEditPlanDialogOpen,
    isNewPlanDialogOpen,
    setIsNewPlanDialogOpen,
    planToDelete,
    setPlanToDelete,
    newPlan,
    setNewPlan,
    handleOpenNewPlanDialog,
    handleCreatePlan,
    handleEditPlan,
    handleUpdatePlan,
    openDeletePlanDialog,
    handleDeletePlan,
    handlePageChange
  } = usePlanHandlers(ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <PlanHeader handleOpenNewServiceDialog={handleOpenNewPlanDialog} />
      
      <PlanSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <PlanList 
        paginatedServices={plans}
        handleEditService={handleEditPlan}
        openDeleteServiceDialog={openDeletePlanDialog}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />

      <PlanDialogs
        planToEdit={planToEdit}
        isEditPlanDialogOpen={isEditPlanDialogOpen}
        setIsEditPlanDialogOpen={setIsEditPlanDialogOpen}
        setPlanToEdit={setPlanToEdit}
        handleUpdatePlan={handleUpdatePlan}
        isNewPlanDialogOpen={isNewPlanDialogOpen}
        setIsNewPlanDialogOpen={setIsNewPlanDialogOpen}
        newPlan={newPlan}
        setNewPlan={setNewPlan}
        handleCreatePlan={handleCreatePlan}
        planToDelete={planToDelete}
        setPlanToDelete={setPlanToDelete}
        handleDeletePlan={handleDeletePlan}
      />
    </div>
  );
};

export default PlanSection;
