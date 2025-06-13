
import api from "../axios";

// CORS Services
export const corsService = {
  // Get all allowed domains
  getDomains: async () => {
    const response = await api.get("/cors");
    return response.data;
  },
  
  // Get domain by ID
  getDomainById: async (id: string) => {
    const response = await api.get(`/cors/${id}`);
    return response.data;
  },
  
  // Add allowed domain
  addDomain: async (domainData: { domain: string; isActive: boolean; }) => {
    const response = await api.post("/cors", domainData);
    return response.data;
  },
  
  // Update domain
  updateDomain: async (id: string, domainData: { domain?: string; isActive?: boolean; }) => {
    const response = await api.put(`/cors/${id}`, domainData);
    return response.data;
  },
  
  // Delete domain
  deleteDomain: async (id: string) => {
    const response = await api.delete(`/cors/${id}`);
    return response.data;
  }
};
