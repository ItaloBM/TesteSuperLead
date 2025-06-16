import api from "../axios";

// --- Interfaces ---
interface Suggestion {
  id: string;
  nome: string;
}
interface BalanceResponse {
  message: { total_balance: number; };
}
interface ApiDocument {
  id: string; name: string; lastModified: string;
  date: string; url: string; type: 'mei' | 'cnpj';
}

// --- Serviço Unificado ---
export const documentService = {
  
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>("/cnpj-query/balance");
    return response.data;
  },

  // ✅ GARANTE QUE A RESPOSTA OU O ERRO SEJAM PROPAGADOS
  startCnpjQuery: async (payload: any) => {
    try {
      const response = await api.post(`/cnpj-query?resultType=completo`, payload);
      return response.data; 
    } catch (error) {
      console.error("Erro na chamada da API 'startCnpjQuery':", error);
      throw error; // Lança o erro para o componente tratar
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

  // Funções de sugestão e documentos com tratamento de erro para não quebrar a tela
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
  
  fetchCnaeSuggestions: async (query: string): Promise<Suggestion[]> => { /* ... mesmo tratamento try/catch ... */ return []; },
  fetchNaturezaJuridicaSuggestions: async (query: string): Promise<Suggestion[]> => { /* ... mesmo tratamento try/catch ... */ return []; }
};