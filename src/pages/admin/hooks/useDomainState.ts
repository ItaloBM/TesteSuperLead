
import { useState } from "react";
import { Domain } from "../types";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data until API is connected
const mockDomains: Domain[] = [
  {
    _id: "1",
    domain: "https://example.com",
    isActive: true,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    __v: 0
  },
  {
    _id: "2",
    domain: "https://test.com",
    isActive: true,
    createdAt: "2024-02-20T14:20:00.000Z",
    updatedAt: "2024-02-20T14:20:00.000Z",
    __v: 0
  }
];

export const useDomainState = () => {
  const { toast } = useToast();
  
  const [isDomainsLoading, setIsDomainsLoading] = useState(false);
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [domainToEdit, setDomainToEdit] = useState<Domain | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState({ domain: "", isActive: true });

  const handleEditDomain = (domain: Domain) => {
    setDomainToEdit(domain);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDomain = () => {
    if (!domainToEdit) return;
    
    setDomains(prev => prev.map(domain => 
      domain._id === domainToEdit._id ? domainToEdit : domain
    ));
    setIsEditDialogOpen(false);
    setDomainToEdit(null);
    
    toast({
      title: "Domínio atualizado",
      description: "As informações do domínio foram atualizadas com sucesso."
    });
  };

  const handleAddDomain = () => {
    const newDomainWithId: Domain = {
      ...newDomain,
      _id: (parseInt(domains[domains.length - 1]?._id || "0") + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };
    
    setDomains(prev => [...prev, newDomainWithId]);
    setNewDomain({ domain: "", isActive: true });
    
    toast({
      title: "Domínio adicionado",
      description: "O domínio foi adicionado com sucesso."
    });
  };

  const openDeleteDialog = (domainId: string) => {
    setDomainToDelete(domainId);
  };

  const handleDeleteDomain = () => {
    if (domainToDelete === null) return;
    
    setDomains(prev => prev.filter(domain => domain._id !== domainToDelete));
    setDomainToDelete(null);
    
    toast({
      title: "Domínio removido",
      description: "O domínio foi removido com sucesso."
    });
  };

  return {
    isDomainsLoading,
    domains,
    setDomains,
    domainToEdit,
    setDomainToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    domainToDelete,
    setDomainToDelete,
    newDomain,
    setNewDomain,
    handleEditDomain,
    handleUpdateDomain,
    handleAddDomain,
    openDeleteDialog,
    handleDeleteDomain
  };
};
