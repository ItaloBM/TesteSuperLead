import api from "../axios";

// Authentication Services
export const authService = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },
  
  // Request password reset
  requestPasswordReset: async (email: string) => {
    const response = await api.post("/password/request", { email }); 
    return response.data;
  },
  
  // Reset password with token
  resetPassword: async (email: string, newPassword: string, token: string) => {
  const url = `/password/reset?token=${token}`;
  
  // A função usa os parâmetros recebidos para montar o corpo
  const body = {
    email: email,
    newPassword: newPassword
  };
  
  const response = await api.post(url, body);
  return response.data;
},

  // Verificar se há sessão ativa no servidor
  checkAuth: async () => {
    try {
      const response = await api.get("/session");
      return {
        authenticated: response.data.authenticated,
        user: response.data.userData
      };
    } catch (error) {
      return {
        authenticated: false,
        user: null
      };
    }
  }
};