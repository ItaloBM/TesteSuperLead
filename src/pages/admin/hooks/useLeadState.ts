
import { useState } from "react";
import { Lead } from "../types";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data until API is connected
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Ana Costa",
    cpfOrCnpj: "123.456.789-00",
    email: "ana@email.com",
    phone: "(11) 99999-9999",
    plan: "PRO",
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  {
    id: "2",
    name: "TechCorp LTDA",
    cpfOrCnpj: "12.345.678/0001-90",
    email: "contato@techcorp.com",
    phone: "(11) 98888-8888",
    plan: "FREE",
    createdAt: "2024-02-20T14:20:00.000Z"
  },
  {
    id: "3",
    name: "Carlos Silva",
    cpfOrCnpj: "987.654.321-00",
    email: "carlos@email.com",
    phone: "(21) 97777-7777",
    plan: "PRO",
    createdAt: "2024-03-10T09:15:00.000Z"
  }
];

export const useLeadState = () => {
  const { toast } = useToast();
  
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: "",
    cpfOrCnpj: "",
    email: "",
    phone: "",
    plan: "FREE"
  });

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditDialogOpen(true);
  };

  const handleUpdateLead = () => {
    if (!leadToEdit) return;
    
    setLeads(prev => prev.map(lead => 
      lead.id === leadToEdit.id ? leadToEdit : lead
    ));
    setIsEditDialogOpen(false);
    setLeadToEdit(null);
    
    toast({
      title: "Lead atualizado",
      description: "As informações do lead foram atualizadas com sucesso."
    });
  };

  const handleCreateLead = () => {
    const newLeadWithId = {
      ...newLead,
      id: (Math.max(...leads.map(l => parseInt(l.id))) + 1).toString(),
      createdAt: new Date().toISOString()
    };
    
    setLeads(prev => [...prev, newLeadWithId]);
    setIsNewLeadDialogOpen(false);
    setNewLead({
      name: "",
      cpfOrCnpj: "",
      email: "",
      phone: "",
      plan: "FREE"
    });
    
    toast({
      title: "Lead criado",
      description: "O lead foi criado com sucesso."
    });
  };

  const openDeleteDialog = (leadId: string) => {
    setLeadToDelete(leadId);
  };

  const handleDeleteLead = () => {
    if (leadToDelete === null) return;
    
    setLeads(prev => prev.filter(lead => lead.id !== leadToDelete));
    setLeadToDelete(null);
    
    toast({
      title: "Lead removido",
      description: "O lead foi removido com sucesso."
    });
  };

  const handleOpenNewLeadDialog = () => {
    setIsNewLeadDialogOpen(true);
  };

  return {
    isLeadsLoading,
    leads,
    setLeads,
    leadToEdit,
    setLeadToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isNewLeadDialogOpen,
    setIsNewLeadDialogOpen,
    leadToDelete,
    setLeadToDelete,
    newLead,
    setNewLead,
    handleEditLead,
    handleUpdateLead,
    handleCreateLead,
    openDeleteDialog,
    handleDeleteLead,
    handleOpenNewLeadDialog
  };
};
