
import { useState } from "react";
import { Service } from "../types";
import { useToast } from "@/hooks/use-toast";

const mockServices: Service[] = [
  {
    id: 1,
    name: "Serviço de Email",
    description: "Envio automatizado de emails em massa",
    price: 99.90,
    maxQueries: 1000,
    status: "active"
  },
  {
    id: 2,
    name: "Integração WhatsApp",
    description: "API de integração com WhatsApp Business",
    price: 149.90,
    maxQueries: 2000,
    status: "active"
  }
];

export const useServiceState = () => {
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>(mockServices);
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

  return {
    services,
    setServices,
    serviceToEdit,
    setServiceToEdit,
    isEditServiceDialogOpen,
    setIsEditServiceDialogOpen,
    isNewServiceDialogOpen,
    setIsNewServiceDialogOpen,
    serviceToDelete,
    setServiceToDelete,
    newService,
    setNewService
  };
};
