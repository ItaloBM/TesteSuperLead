/**
 * Este arquivo centraliza e exporta corretamente todos os serviços
 * para que o resto da aplicação possa importá-los de um só lugar.
 */

// Exporta a instância do Axios e a função setBaseUrl
export { default as api, setBaseUrl } from './axios';

// Exporta cada serviço de sua respectiva pasta (caminhos corrigidos)
export { authService } from './routes/auth';
export { userService } from './routes/user';
export { leadService } from './routes/lead';
export { serviceListService } from './routes/service';
export { originAccessService } from './routes/originAccess';
export { documentService } from './routes/document';
export { emailTemplateService } from './routes/emailTemplate';
export { corsService } from './routes/cors';
export { planService } from './routes/plan';