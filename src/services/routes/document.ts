import api from "../axios";
import {
  ApiDocument,
  BalanceResponse,
  CnpjDetails,
  Suggestion,
} from "@/pages/admin/types";

export const documentService = {
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>("/cnpj-query/balance");
    return response.data;
  },

  startCnpjQuery: async (
    payload: any,
    resultType: "simples" | "completo" = "simples"
  ) => {
    try {
      const response = await api.post(
        `/cnpj-query?resultType=${resultType}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Erro na chamada da API 'startCnpjQuery':", error);
      throw error;
    }
  },

  startCnpjQueryAndSendEmail: async (
    payload: any,
    resultType: "simples" | "completo" = "simples"
  ) => {
    try {
      const response = await api.post(
        `/cnpj-query/send-email?resultType=${resultType}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro na chamada da API 'startCnpjQueryAndSendEmail':",
        error
      );
      throw error;
    }
  },

  getSingleCnpjDetails: async (cnpj: string): Promise<CnpjDetails> => {
    try {
      const payload = { cnpj: [cnpj], limite: 1 };
      const response = await api.post(
        `/cnpj-query?resultType=completo`,
        payload
      );
      if (
        response.data &&
        response.data.responseData &&
        response.data.responseData.cnpjs &&
        response.data.responseData.cnpjs.length > 0
      ) {
        return response.data.responseData.cnpjs[0];
      }
      throw new Error(
        "CNPJ não encontrado ou resposta da API em formato inesperado."
      );
    } catch (error) {
      console.error(`Erro ao buscar detalhes para o CNPJ ${cnpj}:`, error);
      throw error;
    }
  },

  getUserDocuments: async (): Promise<ApiDocument[]> => {
    try {
      const response = await api.get("/user/documents");
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao buscar documentos. Verifique a rota da API '/user/documents'.",
        error
      );
      return [];
    }
  },

  fetchEmpresaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    try {
      // A chamada original para '/sugestoes/empresas' está comentada para evitar o erro 404.
      // Você precisa substituir 'SUA_URL_DE_SUGESTOES' pela URL correta da sua API.
      // const response = await api.get(`/SUA_URL_DE_SUGESTOES`, { params: { q: query } });
      // return response.data;

      console.warn(
        "A URL para sugestões de empresas não está configurada. Verifique 'fetchEmpresaSuggestions' em document.ts."
      );
      return [];
    } catch (error) {
      console.error(
        "Erro ao buscar sugestões. Verifique a rota da API.",
        error
      );
      return [];
    }
  },
};
