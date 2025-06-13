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
  // Keep backward compatibility fields
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
