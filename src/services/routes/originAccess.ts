
import api from "../axios";

// Origin Access Services
export const originAccessService = {
  // Get all origins
  getOrigins: async () => {
    const response = await api.get("/origin-access");
    return response.data;
  },
  
  // Create origin
  createOrigin: async (originDomain: string) => {
    const response = await api.post("/origin-access", { origin_domain: originDomain });
    return response.data;
  },
  
  // Update origin
  updateOrigin: async (currentOriginDomain: string, newOriginDomain: string) => {
    const response = await api.put("/origin-access", {
      current_origin_domain: currentOriginDomain,
      origin_domain: newOriginDomain
    });
    return response.data;
  },
  
  // Delete origin
  deleteOrigin: async (originDomain: string) => {
    const response = await api.delete("/origin-access", {
      data: { origin_domain: originDomain }
    });
    return response.data;
  }
};
