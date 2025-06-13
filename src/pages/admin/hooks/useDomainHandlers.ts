
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { corsService } from "@/services";
import { Domain } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useDomainHandlers = (ITEMS_PER_PAGE: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainToEdit, setDomainToEdit] = useState<Domain | null>(null);
  const [isEditDomainDialogOpen, setIsEditDomainDialogOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState({ domain: "", isActive: true });
  
  // Fetch domains
  const { data, isLoading } = useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const response = await corsService.getDomains();
      return response.objRecords || [];
    }
  });
  
  const allDomains = data || [];
  
  // Filter domains based on search term
  const filteredDomains = allDomains.filter((domain: Domain) => 
    domain.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination
  const totalPages = Math.ceil(filteredDomains.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDomains = filteredDomains.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Mutations
  const createDomainMutation = useMutation({
    mutationFn: (domainData: { domain: string; isActive: boolean }) => 
      corsService.addDomain(domainData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast({
        title: "Domínio adicionado",
        description: "O domínio foi adicionado com sucesso."
      });
      setNewDomain({ domain: "", isActive: true });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar domínio",
        description: error.response?.data?.message || "Ocorreu um erro ao adicionar o domínio.",
        variant: "destructive"
      });
    }
  });
  
  const updateDomainMutation = useMutation({
    mutationFn: (params: { id: string; domainData: { domain?: string; isActive?: boolean } }) => 
      corsService.updateDomain(params.id, params.domainData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast({
        title: "Domínio atualizado",
        description: "O domínio foi atualizado com sucesso."
      });
      setIsEditDomainDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar domínio",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o domínio.",
        variant: "destructive"
      });
    }
  });
  
  const deleteDomainMutation = useMutation({
    mutationFn: (id: string) => corsService.deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      toast({
        title: "Domínio removido",
        description: "O domínio foi removido com sucesso."
      });
      setDomainToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover domínio",
        description: error.response?.data?.message || "Ocorreu um erro ao remover o domínio.",
        variant: "destructive"
      });
    }
  });

  // Handler functions
  const handleAddDomain = () => {
    if (!newDomain.domain.trim()) {
      toast({
        title: "Domínio obrigatório",
        description: "Por favor, insira um domínio.",
        variant: "destructive"
      });
      return;
    }
    
    createDomainMutation.mutate(newDomain);
  };
  
  const handleEditDomain = (domain: Domain) => {
    setDomainToEdit(domain);
    setIsEditDomainDialogOpen(true);
  };

  const handleUpdateDomain = () => {
    if (!domainToEdit) return;
    
    updateDomainMutation.mutate({
      id: domainToEdit._id,
      domainData: {
        domain: domainToEdit.domain,
        isActive: domainToEdit.isActive
      }
    });
  };

  const openDeleteDomainDialog = (domainId: string) => {
    setDomainToDelete(domainId);
  };

  const handleDeleteDomain = () => {
    if (domainToDelete === null) return;
    deleteDomainMutation.mutate(domainToDelete);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    domains: paginatedDomains,
    filteredDomains,
    totalCount: filteredDomains.length,
    isLoading,
    domainToEdit,
    setDomainToEdit,
    isEditDomainDialogOpen,
    setIsEditDomainDialogOpen,
    domainToDelete,
    setDomainToDelete,
    newDomain,
    setNewDomain,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleAddDomain,
    handleEditDomain,
    handleUpdateDomain,
    openDeleteDomainDialog,
    handleDeleteDomain,
    handlePageChange
  };
};
