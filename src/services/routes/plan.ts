
import api from "../axios";

// Plan Services
export const planService = {
  // Get all plans
  getPlans: async (page = 1, quantityRegisters = 50) => {
    const response = await api.get(`/plans?page=${page}&quantityRegisters=${quantityRegisters}`);
    return response.data;
  },
  
  // Get plan by ID
  getPlanById: async (id: string) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },
  
  // Create plan
  createPlan: async (planData: {
    name: string;
    description: string;
    price: number;
    maxQueries: number;
    status: "active" | "inactive";
  }) => {
    const response = await api.post("/plans", {
      name: planData.name,
      description: planData.description,
      price: planData.price,
      maxQueries: planData.maxQueries
    });
    return response.data;
  },
  
  // Update plan
  updatePlan: async (id: string, planData: {
    name?: string;
    description?: string;
    price?: number;
    maxQueries?: number;
    status?: "active" | "inactive";
  }) => {
    const response = await api.put(`/plans/${id}`, {
      name: planData.name,
      description: planData.description,
      price: planData.price,
      maxQueries: planData.maxQueries
    });
    return response.data;
  },
  
  // Delete plan
  deletePlan: async (id: string) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  }
};
