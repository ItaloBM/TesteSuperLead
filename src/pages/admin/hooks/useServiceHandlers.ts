
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { serviceListService } from "@/services";
import { Service } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useServiceHandlers = (ITEMS_PER_PAGE: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: "",
    description: "",
    price: 0,
    maxQueries: 0,
    status: "active"
  });
  
  // Fetch services
  const { data, isLoading } = useQuery({
    queryKey: ["services", currentPage],
    queryFn: async () => {
      const response = await serviceListService.getServices(currentPage, ITEMS_PER_PAGE);
      return {
        services: response.services || [],
        totalCount: response.totalCount || 0
      };
    }
  });
  
  const services = data?.services || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);
  
  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: (serviceData: Omit<Service, 'id'>) => 
      serviceListService.createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Serviço criado",
        description: "O serviço foi criado com sucesso."
      });
      setIsNewServiceDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar serviço",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o serviço.",
        variant: "destructive"
      });
    }
  });
  
  const updateServiceMutation = useMutation({
    mutationFn: (params: { id: string; serviceData: Partial<Omit<Service, 'id'>> }) => 
      serviceListService.updateService(params.id, params.serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso."
      });
      setIsEditServiceDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o serviço.",
        variant: "destructive"
      });
    }
  });
  
  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => serviceListService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso."
      });
      setServiceToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover serviço",
        description: error.response?.data?.message || "Ocorreu um erro ao remover o serviço.",
        variant: "destructive"
      });
    }
  });

  // Handler functions
  const handleOpenNewServiceDialog = () => {
    setNewService({
      name: "",
      description: "",
      price: 0,
      maxQueries: 0,
      status: "active"
    });
    setIsNewServiceDialogOpen(true);
  };

  const handleCreateService = () => {
    if (!newService.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o serviço.",
        variant: "destructive"
      });
      return;
    }
    
    createServiceMutation.mutate(newService);
  };
  
  const handleEditService = (service: Service) => {
    setServiceToEdit(service);
    setIsEditServiceDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!serviceToEdit) return;
    
    updateServiceMutation.mutate({
      id: serviceToEdit.id.toString(),
      serviceData: {
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        price: serviceToEdit.price,
        maxQueries: serviceToEdit.maxQueries,
        status: serviceToEdit.status
      }
    });
  };

  const openDeleteServiceDialog = (serviceId: number) => {
    setServiceToDelete(serviceId);
  };

  const handleDeleteService = () => {
    if (serviceToDelete === null) return;
    deleteServiceMutation.mutate(serviceToDelete.toString());
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    services: filteredServices,
    isLoading,
    serviceToEdit,
    setServiceToEdit,
    isEditServiceDialogOpen,
    setIsEditServiceDialogOpen,
    isNewServiceDialogOpen,
    setIsNewServiceDialogOpen,
    serviceToDelete,
    setServiceToDelete,
    newService,
    setNewService,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    currentPage,
    totalPages,
    handleOpenNewServiceDialog,
    handleCreateService,
    handleEditService,
    handleUpdateService,
    openDeleteServiceDialog,
    handleDeleteService,
    handlePageChange
  };
};
