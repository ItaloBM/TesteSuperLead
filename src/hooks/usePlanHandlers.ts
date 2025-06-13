
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { planService } from "@/services";
import { Plan, Service } from "../pages/admin/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePlanHandlers = (ITEMS_PER_PAGE: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [planToEdit, setPlanToEdit] = useState<Service | null>(null);
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false);
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<Omit<Service, 'id'>>({
    name: "",
    description: "",
    price: 0,
    maxQueries: 0,
    status: "active"
  });
  
  // Fetch plans
  const { data, isLoading } = useQuery({
    queryKey: ["plans", currentPage],
    queryFn: async () => {
      const response = await planService.getPlans(currentPage, ITEMS_PER_PAGE);
      console.log("Plans API response:", response);
      
      // Map the API response to the Service interface format
      const plans = response.objRecords.records.map((plan: Plan) => ({
        id: plan._id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        maxQueries: plan.maxQueries,
        _id: plan._id,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
        __v: plan.__v,
        status: "active" as const
      }));
      
      return {
        plans,
        totalCount: response.objRecords.records.length,
        totalPages: response.objRecords.totalPages
      };
    }
  });
  
  const plans = data?.plans || [];
  const totalPages = data?.totalPages || 0;
  
  // Filter plans based on search term
  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Mutations
  const createPlanMutation = useMutation({
    mutationFn: (planData: Omit<Service, 'id'>) => 
      planService.createPlan({
        name: planData.name,
        description: planData.description,
        price: planData.price,
        maxQueries: planData.maxQueries || 0,
        status: "active"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Plano criado",
        description: "O plano foi criado com sucesso."
      });
      setIsNewPlanDialogOpen(false);
      setNewPlan({
        name: "",
        description: "",
        price: 0,
        maxQueries: 0,
        status: "active"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar plano",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o plano.",
        variant: "destructive"
      });
    }
  });
  
  const updatePlanMutation = useMutation({
    mutationFn: (params: { id: string; planData: Partial<Omit<Service, 'id'>> }) => 
      planService.updatePlan(params.id, {
        name: params.planData.name,
        description: params.planData.description,
        price: params.planData.price,
        maxQueries: params.planData.maxQueries
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Plano atualizado",
        description: "O plano foi atualizado com sucesso."
      });
      setIsEditPlanDialogOpen(false);
      setPlanToEdit(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar plano",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o plano.",
        variant: "destructive"
      });
    }
  });
  
  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => planService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Plano removido",
        description: "O plano foi removido com sucesso."
      });
      setPlanToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover plano",
        description: error.response?.data?.message || "Ocorreu um erro ao remover o plano.",
        variant: "destructive"
      });
    }
  });

  // Handler functions
  const handleOpenNewPlanDialog = () => {
    setNewPlan({
      name: "",
      description: "",
      price: 0,
      maxQueries: 0,
      status: "active"
    });
    setIsNewPlanDialogOpen(true);
  };

  const handleCreatePlan = () => {
    if (!newPlan.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o plano.",
        variant: "destructive"
      });
      return;
    }
    
    createPlanMutation.mutate(newPlan);
  };
  
  const handleEditPlan = (plan: Service) => {
    setPlanToEdit(plan);
    setIsEditPlanDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    if (!planToEdit) return;
    
    if (!planToEdit.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o plano.",
        variant: "destructive"
      });
      return;
    }
    
    const planId = planToEdit._id || planToEdit.id.toString();
    
    updatePlanMutation.mutate({
      id: planId,
      planData: {
        name: planToEdit.name,
        description: planToEdit.description,
        price: planToEdit.price,
        maxQueries: planToEdit.maxQueries
      }
    });
  };

  const openDeletePlanDialog = (planId: number | string) => {
    setPlanToDelete(planId.toString());
  };

  const handleDeletePlan = () => {
    if (planToDelete === null) return;
    deletePlanMutation.mutate(planToDelete);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    plans: filteredPlans,
    isLoading,
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
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    currentPage,
    totalPages,
    handleOpenNewPlanDialog,
    handleCreatePlan,
    handleEditPlan,
    handleUpdatePlan,
    openDeletePlanDialog,
    handleDeletePlan,
    handlePageChange
  };
};
