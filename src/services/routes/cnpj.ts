import api from "../axios";

// Define a estrutura da resposta da API
interface BalanceResponse {
  message: {
    total_balance: number;
  };
}

export const cnpjService = {
  /**
   * Obtém o saldo de consultas do usuário logado.
   */
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>("/cnpj-query/balance");
    return response.data;
  },

  // Outras funções relacionadas a CNPJ podem ser adicionadas aqui.
};