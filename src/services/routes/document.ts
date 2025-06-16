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
  
  // Funções que já estão funcionando corretamente
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>("/cnpj-query/balance");
    return response.data;
  },

  startCnpjQuery: async (payload: any) => {
    try {
      const response = await api.post(`/cnpj-query?resultType=completo`, payload);
      // ✅ GARANTE QUE OS DADOS DA RESPOSTA SEJAM RETORNADOS
      return response.data; 
    } catch (error) {
      console.error("Erro na chamada da API 'startCnpjQuery':", error);
      // Lança o erro para que o componente que chamou possa tratá-lo
      throw error;
    }
  },

  startCnpjQueryAndSendEmail: async (payload: any) => {
    return api.post('/cnpj-query/send-email', payload);
  },

  // ======================================================================
  // Funções com tratamento de erro para evitar que a tela quebre
  // ======================================================================

  getUserDocuments: async (): Promise<ApiDocument[]> => {
    try {
      // ATENÇÃO: A rota '/user/documents' ainda precisa ser corrigida no seu backend.
      const response = await api.get('/user/documents'); 
      return response.data;
    } catch (error) {
      console.error("Erro 404 ao buscar documentos. Verifique a rota da API.", error);
      return []; // Retorna um array vazio em caso de erro para não quebrar a aplicação.
    }
  },

  fetchEmpresaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    try {
      // ATENÇÃO: A rota '/sugestoes/empresas' precisa ser corrigida no seu backend.
      const response = await api.get(`/sugestoes/empresas`, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Erro 404 ao buscar sugestões de empresas. Verifique a rota da API.", error);
      return []; // Retorna um array vazio em caso de erro.
    }
  },
  
  fetchCnaeSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    try {
      // ATENÇÃO: A rota '/sugestoes/cnae' precisa ser corrigida no seu backend.
      const response = await api.get(`/sugestoes/cnae`, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Erro 404 ao buscar sugestões de CNAE. Verifique a rota da API.", error);
      return []; // Retorna um array vazio em caso de erro.
    }
  },

  fetchNaturezaJuridicaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    try {
      // ATENÇÃO: A rota '/sugestoes/natureza-juridica' precisa ser corrigida no seu backend.
      const response = await api.get(`/sugestoes/natureza-juridica`, { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Erro 404 ao buscar sugestões de Natureza Jurídica. Verifique a rota da API.", error);
      return []; // Retorna um array vazio em caso de erro.
    }
  }
};