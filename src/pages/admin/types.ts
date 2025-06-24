export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfOrCnpj: string;
  plan: string;
  apiKey: string;
  maxQueries: number;
  isOnline: string | null;
  activeAccount: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  cpf?: string;
  status?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfOrCnpj: string;
  plan: string;
  createdAt: string;
}

export interface Service {
  id: number;
  _id?: string;
  name: string;
  description: string;
  price: number;
  maxQueries: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Plan {
  id?: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  maxQueries: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Domain {
  _id: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmailTemplate {
  _id: string;
  emailToReceiver: string;
  smtpEmail: string;
  smtpPass: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  htmlTemplate: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CnpjDetails {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  matriz_filial: string;
  data_abertura: string;
  capital_social: number;
  situacao_cadastral: {
    situacao_atual: string;
    motivo: string;
    data: string;
  };
  porte_empresa: { // Corrigido de 'porte' para 'porte_empresa' para corresponder à API
    codigo: string;
    descricao: string;
  };
  natureza_juridica: { // Nome atualizado
    codigo: string;
    descricao: string;
  };
  descricao_natureza_juridica: string; // Campo adicional da API
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    uf: string;
    municipio: string;
  };
  quadro_societario?: Array<{
    nome: string;
    qualificacao_socio: string;
  }>;
  atividade_principal: {
    codigo: string;
    descricao: string;
  };
  atividade_secundaria?: Array<{
    codigo: string;
    descricao: string;
  }>;
  contato_telefonico?: Array<{
    completo: string;
    ddd: string;
    numero: string;
    tipo: string;
  }>;
  contato_email?: Array<{
    email: string;
    dominio: string;
    valido: boolean;
  }>;
  simples?: {
    optante: boolean;
    data_opcao_simples: string | null;
    data_exclusao_simples: string | null;
  };
  mei?: {
    optante: boolean;
  }
  [key:string]: any;
}

// Adicionando as interfaces que faltavam
export interface Suggestion {
  id: string;
  nome: string;
}

export interface BalanceResponse {
  message: { total_balance: number; };
}

export interface ApiDocument {
  id: string; 
  name: string; 
  lastModified: string;
  date: string; 
  url: string; 
  type: 'mei' | 'cnpj';
}

export interface FileData {
  id: string;
  name: string;
  lastModified: string;
  date: string;
  url: string;
  type: 'mei' | 'cnpj';
}