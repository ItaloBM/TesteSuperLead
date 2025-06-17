import api from "../axios";
import { CnpjDetails, Suggestion, BalanceResponse, ApiDocument } from "@/pages/admin/types";

export const documentService = {
  
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>("/cnpj-query/balance");
    return response.data;
  },

  startCnpjQuery: async (payload: any) => {
    try {
      const response = await api.post(`/cnpj-query?resultType=completo`, payload);
      return response.data; 
    } catch (error) {
      console.error("Erro na chamada da API 'startCnpjQuery':", error);
      throw error;
    }
  },

  startCnpjQueryAndSendEmail: async (payload: any) => {
    try {
      const response = await api.post('/cnpj-query/send-email', payload);
      return response.data;
    } catch(error) {
      console.error("Erro na chamada da API 'startCnpjQueryAndSendEmail':", error);
      throw error;
    }
  },
  
  getSingleCnpjDetails: async (cnpj: string): Promise<CnpjDetails> => {
    try {
      const payload = { cnpj: [cnpj], limite: 1 };
      const response = await api.post(`/cnpj-query?resultType=completo`, payload);
      if (response.data && response.data.responseData && response.data.responseData.cnpjs && response.data.responseData.cnpjs.length > 0) {
        return response.data.responseData.cnpjs[0];
      }
      throw new Error("CNPJ não encontrado ou resposta da API em formato inesperado.");
    } catch (error) {
      console.error(`Erro ao buscar detalhes para o CNPJ ${cnpj}:`, error);
      throw error;
    }
  },

  getUserDocuments: async (): Promise<ApiDocument[]> => {
    try {
      const response = await api.get('/user/documents'); 
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar documentos. Verifique a rota da API '/user/documents'.", error);
      return [];
    }
  },

  fetchEmpresaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    try {
      const response = await api.get(`/sugestoes/empresas`, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar sugestões. Verifique a rota da API '/sugestoes/empresas'.", error);
      return []; 
    }
  },
  
  fetchCnaeSuggestions: async (query: string): Promise<Suggestion[]> => { return []; },
  fetchNaturezaJuridicaSuggestions: async (query: string): Promise<Suggestion[]> => { return []; }
};