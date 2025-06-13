

import api from "../axios";

// User Services
export const userService = {
  // Get all users with real pagination
  getUsers: async (page = 1, quantityRegisters = 50) => {
    console.log(`Calling API: GET /users?page=${page}&quantityRegisters=${quantityRegisters}`);
    const response = await api.get(`/users?page=${page}&quantityRegisters=${quantityRegisters}`);
    console.log("API response in service:", response.data);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user with password
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    cpfOrCnpj: string;
    plan: string;
    apiKey?: string;
  }) => {
    console.log("=== CREATE USER SERVICE ===");
    console.log("Original userData:", userData);
    
    // Validate required fields including apiKey
    const requiredFields = ['name', 'email', 'password', 'plan', 'cpfOrCnpj'];
    const missingFields = requiredFields.filter(field => !userData[field as keyof typeof userData]);
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Clean and prepare data with all required fields
    const cleanedData = {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      phone: userData.phone?.trim() || "",
      cpfOrCnpj: userData.cpfOrCnpj?.trim() || "",
      plan: userData.plan.trim(),
      apiKey: userData.apiKey || "" // Include apiKey field
    };
    
    console.log("Cleaned userData:", cleanedData);
    console.log("Request URL: POST /users");
    console.log("Stringified JSON being sent:", JSON.stringify(cleanedData));
    
    try {
      const response = await api.post("/users", cleanedData);
      console.log("Create user SUCCESS response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Create user FAILED");
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error headers:", error.response?.headers);
      
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    cpfOrCnpj?: string;
    plan?: string;
    apiKey?: string;
  }) => {
    console.log(`Updating user ${id} with data:`, userData);
    const response = await api.put(`/users/${id}`, userData);
    console.log("Update user response:", response.data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    console.log(`Deleting user ${id}`);
    const response = await api.delete(`/users/${id}`);
    console.log("Delete user response:", response.data);
    return response.data;
  }
};
