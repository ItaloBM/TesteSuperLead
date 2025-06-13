import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Usando sonner que parece ser o padrão no seu projeto
import { emailTemplateService } from "@/services";
import { EmailTemplate } from "../types";

export const useEmailTemplateHandlers = (ITEMS_PER_PAGE: number) => {
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Template states
  const [templateToView, setTemplateToView] = useState<EmailTemplate | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  
  const [templateToEdit, setTemplateToEdit] = useState<EmailTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);
  
  // Fetch templates
  const { data, isLoading } = useQuery({
    queryKey: ["emailTemplates", currentPage],
    queryFn: async () => {
      const response = await emailTemplateService.getEmailTemplates(currentPage, ITEMS_PER_PAGE);
      return response.objRecords || { records: [], totalPages: 0 };
    }
  });
  
  const allTemplates: EmailTemplate[] = data?.records || [];
  const totalPagesFromApi = data?.totalPages || 0;
  
  // Filter templates (lógica mantida)
  const filteredTemplates = allTemplates.filter(template => 
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.smtpEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = searchTerm ? Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE) : totalPagesFromApi;
  const templates = searchTerm 
    ? filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredTemplates;
  
  // --- MUTATIONS ---
  const createTemplateMutation = useMutation({
    mutationFn: (formData: FormData) => emailTemplateService.createEmailTemplate(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      toast.success("Template criado com sucesso.");
      setIsNewTemplateDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating template:", error);
      toast.error("Erro ao criar template.");
    }
  });
  
  // ✅ 1. AJUSTE NA MUTATION DE UPDATE
  const updateTemplateMutation = useMutation({
    // Ela agora espera um objeto com 'id' e 'formData'
    mutationFn: ({ id, formData }: { id: string, formData: FormData }) => {
      // E passa os dois separadamente para o serviço
      return emailTemplateService.updateEmailTemplate(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      toast.success("Template atualizado com sucesso.");
      setIsEditDialogOpen(false);
      setTemplateToEdit(null);
    },
    onError: (error) => {
      console.error("Error updating template:", error);
      toast.error("Erro ao atualizar template.");
    }
  });
  
  const deleteTemplateMutation = useMutation({
    mutationFn: () => {
      if (!templateToDelete) throw new Error("No template to delete");
      return emailTemplateService.deleteEmailTemplate(templateToDelete._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      toast.success("Template excluído com sucesso.");
      setTemplateToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template.");
    }
  });
  
  // --- HANDLERS ---
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleViewTemplate = (template: EmailTemplate) => {
    setTemplateToView(template);
    setIsViewDialogOpen(true);
  };
  
  const openNewTemplateDialog = () => {
    setIsNewTemplateDialogOpen(true);
  };
  
  const handleCreateTemplate = async (formData: FormData) => {
    await createTemplateMutation.mutateAsync(formData);
  };
  
  const handleEditTemplate = (template: EmailTemplate) => {
    setTemplateToEdit(template);
    setIsEditDialogOpen(true);
  };
  
  // ✅ 2. AJUSTE NO HANDLER DE UPDATE
  const handleUpdateTemplate = async (id: string, formData: FormData) => {
    // Passa um único objeto para o mutateAsync, contendo o id e o formData
    await updateTemplateMutation.mutateAsync({ id, formData });
  };
  
  const openDeleteTemplateDialog = (template: EmailTemplate) => {
    setTemplateToDelete(template);
  };
  
  const handleDeleteTemplate = async () => {
    await deleteTemplateMutation.mutateAsync();
  };

  return {
    // State and data
    searchTerm,
    setSearchTerm,
    currentPage,
    isLoading,
    templates,
    totalPages,
    
    // Dialog states
    templateToView,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isNewTemplateDialogOpen,
    setIsNewTemplateDialogOpen,
    templateToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    templateToDelete,
    setTemplateToDelete,
    
    // Handlers
    handlePageChange,
    handleViewTemplate,
    openNewTemplateDialog,
    handleCreateTemplate,
    handleEditTemplate,
    handleUpdateTemplate,
    openDeleteTemplateDialog,
    handleDeleteTemplate
  };
};