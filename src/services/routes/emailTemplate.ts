
import api from "../axios";

// Email Template Services
export const emailTemplateService = {
  // Get all email templates
  getEmailTemplates: async (page = 1, quantityRegisters = 50) => {
    const response = await api.get(`/template-email?page=${page}&quantityRegisters=${quantityRegisters}`);
    return response.data;
  },
  
  // Get template by ID
  getEmailTemplateById: async (id: string) => {
    const response = await api.get(`/template-email/${id}`);
    return response.data;
  },
  
  // Create new template
  createEmailTemplate: async (templateData: FormData) => {
    const response = await api.post("/template-email", templateData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Update template
  updateEmailTemplate: async (id: string, templateData: FormData) => {
    const response = await api.put(`/template-email/${id}`, templateData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete template
  deleteEmailTemplate: async (id: string) => {
    const response = await api.delete(`/template-email/${id}`);
    return response.data;
  },

  // Send test email
  sendTestEmail: async (templateId: string, email: string) => {
    const response = await api.post(`/template-email/${templateId}/send-test`, { email });
    return response.data;
  }
};
