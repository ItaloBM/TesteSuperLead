
// Export all services from a single file for easier imports
export { default as api } from './axios';
export { setBaseUrl } from './axios';
export { authService } from './routes/auth';
export { userService } from './routes/user';
export { leadService } from './routes/lead';
export { serviceListService } from './routes/service';
export { originAccessService } from './routes/originAccess';
export { documentService } from './routes/document';
export { fetchUserDocuments } from './documentService';
export { emailTemplateService } from './routes/emailTemplate';
export { corsService } from './routes/cors';
export { planService } from './routes/plan';
export * from './routes/auth'; // Você já tem esta linha
export * from './routes/cnpj'; // ✅ ADICIONE ESTA LINHA