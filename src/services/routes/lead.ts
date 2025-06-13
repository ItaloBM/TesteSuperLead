
import api from "../axios";

// Lead Services
export const leadService = {
  // Get leads
  getLeads: async (page = 1, quantityRegisters = 50) => {
    const response = await api.get(`/leads?page=${page}&quantityRegisters=${quantityRegisters}`);
    return response.data;
  },
  
  // Get lead by ID
  getLeadById: async (id: string) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  
  // Create lead
  createLead: async (leadData: {
    name: string;
    cpfOrCnpj: string;
    email: string;
    phone: string;
    services_names: string[];
  }) => {
    const response = await api.post("/leads", leadData);
    return response.data;
  },

  // Update lead
  updateLead: async (id: string, leadData: {
    name?: string;
    cpfOrCnpj?: string;
    email?: string;
    phone?: string;
    status?: string;
  }) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id: string) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  // Mass sending to leads
  massSend: async (data: { leads_ids: string[], template_id: string }) => {
    const response = await api.post("/leads/mass-send", data);
    return response.data;
  }
};
