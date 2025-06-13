
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { leadService } from "@/services";
import { Lead } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useLeadHandlers = (ITEMS_PER_PAGE: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  
  // Fetch leads using real API
  const { data, isLoading } = useQuery({
    queryKey: ["leads", currentPage],
    queryFn: async () => {
      try {
        const response = await leadService.getLeads(currentPage, ITEMS_PER_PAGE);
        console.log("API response for leads:", response);
        
        if (!response || !response.objRecords || !response.objRecords.records) {
          console.error("Invalid API response format:", response);
          return { leads: [], totalCount: 0, totalPages: 0, currentPage: 1 };
        }
        
        // Map API response to our Lead type format
        const mappedLeads = response.objRecords.records.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          cpfOrCnpj: lead.cpfOrCnpj || "",
          phone: lead.phone || "",
          plan: lead.plan || "",
          createdAt: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : "-",
          updatedAt: lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('pt-BR') : "-"
        }));
        
        console.log("Mapped leads:", mappedLeads);
        
        return {
          leads: mappedLeads || [],
          totalCount: mappedLeads.length,
          totalPages: parseInt(response.objRecords.totalPages) || 1,
          currentPage: parseInt(response.objRecords.page) || 1
        };
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar a lista de leads.",
          variant: "destructive"
        });
        return { leads: [], totalCount: 0, totalPages: 0, currentPage: 1 };
      }
    }
  });
  
  const leads = data?.leads || [];
  const totalPages = data?.totalPages || 0;
  const apiCurrentPage = data?.currentPage || 1;
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.cpfOrCnpj.includes(searchTerm)
  );
  
  // Mutations
  const updateLeadMutation = useMutation({
    mutationFn: (params: { id: string; leadData: any }) => 
      leadService.updateLead(params.id, params.leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead atualizado",
        description: "O lead foi atualizado com sucesso."
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar lead",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o lead.",
        variant: "destructive"
      });
    }
  });
  
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead removido",
        description: "O lead foi removido com sucesso."
      });
      setLeadToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover lead",
        description: error.response?.data?.message || "Ocorreu um erro ao remover o lead.",
        variant: "destructive"
      });
    }
  });
  
  const massEmailMutation = useMutation({
    mutationFn: (data: { leads_ids: string[], template_id: string }) => 
      leadService.massSend(data),
    onSuccess: () => {
      toast({
        title: "Envio em massa iniciado",
        description: "O envio em massa foi iniciado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no envio em massa",
        description: error.response?.data?.message || "Ocorreu um erro ao iniciar o envio em massa.",
        variant: "destructive"
      });
    }
  });

  // Handler functions
  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditDialogOpen(true);
  };

  const handleUpdateLead = () => {
    if (!leadToEdit) return;
    
    updateLeadMutation.mutate({
      id: leadToEdit.id.toString(),
      leadData: {
        name: leadToEdit.name,
        email: leadToEdit.email,
        cpfOrCnpj: leadToEdit.cpfOrCnpj,
        phone: leadToEdit.phone
      }
    });
  };

  const openDeleteDialog = (leadId: string) => {
    setLeadToDelete(leadId);
  };

  const handleDeleteLead = () => {
    if (leadToDelete === null) return;
    deleteLeadMutation.mutate(leadToDelete.toString());
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const startMassSend = (leadsIds: string[], templateId: string) => {
    massEmailMutation.mutate({ leads_ids: leadsIds, template_id: templateId });
  };

  return {
    leads: filteredLeads,
    isLoading,
    leadToEdit,
    setLeadToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    leadToDelete,
    setLeadToDelete,
    searchTerm,
    setSearchTerm,
    currentPage: apiCurrentPage,
    totalPages,
    handleEditLead,
    handleUpdateLead,
    openDeleteDialog,
    handleDeleteLead,
    handlePageChange,
    startMassSend
  };
};
