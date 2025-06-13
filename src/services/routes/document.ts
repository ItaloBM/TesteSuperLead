import api from "../axios"; // Sua instância configurada do Axios

// --- Interfaces ---

// Interface para o payload da busca avançada, espelhando o JSON da API
interface CnpjQueryPayload {
  busca_textual?: Array<{ texto: string[]; razao_social: boolean; nome_fantasia: boolean; }>;
  codigo_atividade_principal?: string[];
  codigo_natureza_juridica?: string[];
  situacao_cadastral?: string[];
  uf?: string[];
  municipio?: string[];
  bairro?: string[];
  cep?: string[];
  ddd?: string[];
  data_abertura?: { inicio: string | null; fim: string | null; };
  capital_social?: { minimo: number; maximo: number; };
  mei?: { optante: boolean; excluir_optante: boolean; };
  simples?: { optante: boolean; excluir_optante: boolean; };
  mais_filtros?: {
    somente_matriz: boolean;
    somente_filial: boolean;
    com_email: boolean;
    com_telefone: boolean;
    somente_fixo: boolean;
    somente_celular: boolean;
    excluir_empresas_visualizadas?: boolean;
    excluir_email_contab?: boolean;
  };
  limite: number;
  pagina: number;
}

// Interface para o retorno das sugestões de autocomplete
interface Suggestion {
  id: string;
  nome: string;
}


// --- Serviço Unificado ---

export const documentService = {
  // --- Funções Principais de Documentos ---

  /**
   * Busca os documentos do usuário (MEI e/ou CNPJ baseado no plano).
   */
  getUserDocuments: async () => {
    // ⬇️ Lembre-se de verificar se esta rota está correta conforme o erro 404 anterior
    const response = await api.get('/user/documents');
    return response.data;
  },

  /**
   * Realiza o download de um documento específico.
   * @param documentId ID do documento a ser baixado.
   */
  downloadDocument: async (documentId: string) => {
    const response = await api.get(`/document/download/${documentId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // --- Funções de Busca Avançada ---

  /**
   * Dispara a busca avançada de CNPJs com base nos filtros.
   * @param payload Objeto com todos os filtros da busca.
   */
  startCnpjQuery: async (payload: CnpjQueryPayload) => {
    const resultType = 'completo'; // ou 'simples', conforme necessidade
    const response = await api.post(`/cnpj-query?resultType=${resultType}`, payload);
    return response.data;
  },

  // --- Funções de Sugestão / Autocomplete ---

  /**
   * Busca sugestões de Razão Social / Nome Fantasia.
   * @param query Termo digitado pelo usuário.
   */
  fetchEmpresaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    // ⬇️ Ajuste o endpoint se necessário
    const response = await api.get(`/sugestoes/empresas`, { params: { q: query } });
    return response.data;
  },
  
  /**
   * Busca sugestões de Atividade Principal (CNAE).
   * @param query Termo digitado pelo usuário.
   */
  fetchCnaeSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    // ⬇️ Ajuste o endpoint se necessário
    const response = await api.get(`/sugestoes/cnae`, { params: { q: query } });
    return response.data;
  },

  /**
   * Busca sugestões de Natureza Jurídica.
   * @param query Termo digitado pelo usuário.
   */
  fetchNaturezaJuridicaSuggestions: async (query: string): Promise<Suggestion[]> => {
    if (!query) return [];
    // ⬇️ Ajuste o endpoint se necessário
    const response = await api.get(`/sugestoes/natureza-juridica`, { params: { q: query } });
    return response.data;
  }
};