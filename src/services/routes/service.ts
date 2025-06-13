
import api from "../axios";
import { Service } from "@/pages/admin/types";

// Service List Services
export const serviceListService = {
  // Get all services
  getServices: async (page = 1, quantityRegisters = 50) => {
    const response = await api.get(`/service?page=${page}&quantityRegisters=${quantityRegisters}`);
    return response.data;
  },
  
  // Get service by ID
  getServiceById: async (id: string) => {
    const response = await api.get(`/service/${id}`);
    return response.data;
  },
  
  // Create service
  createService: async (serviceData: Omit<Service, 'id'>) => {
    const response = await api.post("/service", serviceData);
    return response.data;
  },
  
  // Update service
  updateService: async (id: string, serviceData: Partial<Omit<Service, 'id'>>) => {
    const response = await api.put(`/service/${id}`, serviceData);
    return response.data;
  },
  
  // Delete service
  deleteService: async (id: string) => {
    const response = await api.delete(`/service/${id}`);
    return response.data;
  }
};
