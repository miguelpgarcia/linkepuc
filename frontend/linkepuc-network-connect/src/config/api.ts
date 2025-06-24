/**
 * Centralized API Configuration
 * All API endpoints and backend URLs are defined here
 */

// Environment-based API base URL
const getApiBaseUrl = (): string => {

  // Development/local
  return 'http://167.99.145.60:8000';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints - All backend endpoints centralized here
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/users/login`,
    VERIFY_EMAIL: `${API_BASE_URL}/users/verify-email`,
  },

  // User endpoints
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    CREATE: `${API_BASE_URL}/users`,
    BY_ID: (id: string | number) => `${API_BASE_URL}/users/${id}`,
    AVATAR: (id: string | number) => `${API_BASE_URL}/users/${id}/avatar`,
  },

  // Opportunities (Vagas) endpoints
  VAGAS: {
    BASE: `${API_BASE_URL}/vagas`,
    CREATE: `${API_BASE_URL}/vagas/`,
    BY_ID: (id: string | number) => `${API_BASE_URL}/vagas/${id}`,
    PAGINATED: (skip: number, limit: number) => `${API_BASE_URL}/vagas/?skip=${skip}&limit=${limit}`,
    PROFESSOR: `${API_BASE_URL}/vagas/professor`,
    STATUS: (id: string | number) => `${API_BASE_URL}/vagas/${id}/status`,
    TIPOS: `${API_BASE_URL}/vagas/tipo`,
  },

  // Interests endpoints
  INTERESSES: {
    BASE: `${API_BASE_URL}/interesses/`,
    USUARIO: `${API_BASE_URL}/interesses/usuario`,
    BY_USER_ID: (userId: string | number) => `${API_BASE_URL}/interesses/usuario/${userId}`,
  },

  // Messages endpoints
  MENSAGENS: {
    BASE: `${API_BASE_URL}/mensagens`,
    CONVERSAS: `${API_BASE_URL}/mensagens/conversas`,
    BY_USER: (userId: string | number) => `${API_BASE_URL}/mensagens/conversa/${userId}`,
  },

  // Recommendations endpoints
  RECOMENDACOES: {
    BASE: `${API_BASE_URL}/recomendacoes/`,
    REFRESH: `${API_BASE_URL}/recomendacoes/refresh`,
    EXPLANATION: (vagaId: string | number) => `${API_BASE_URL}/recomendacoes/explanation/${vagaId}`,
    STATS: `${API_BASE_URL}/recomendacoes/stats`,
    CALCULATE_ALL: `${API_BASE_URL}/recomendacoes/calculate-all`,
  },

  // Applications (Candidaturas) endpoints
  CANDIDATURAS: {
    VAGA_STATUS: (vagaId: string | number) => `${API_BASE_URL}/api/candidaturas/vaga/${vagaId}/candidatura-status`,
    CANDIDATAR: (vagaId: string | number) => `${API_BASE_URL}/api/candidaturas/vaga/${vagaId}/candidatar`,
    CANDIDATOS: (vagaId: string | number) => `${API_BASE_URL}/api/candidaturas/vaga/${vagaId}/candidatos`,
    BY_VAGA: (vagaId: string | number) => `${API_BASE_URL}/candidaturas/vaga/${vagaId}`,
  },

  // Curriculum/History endpoints
  HISTORICOS: {
    BASE: `${API_BASE_URL}/historicos/`,
    UPLOAD: `${API_BASE_URL}/historicos/upload`,
    STATUS: `${API_BASE_URL}/historicos/status`,
  },

  // Departments endpoints
  DEPARTAMENTOS: {
    BASE: `${API_BASE_URL}/departamentos/`,
  },
} as const;

/**
 * Helper function to build API URLs with query parameters
 */
export const buildApiUrl = (baseUrl: string, params?: Record<string, string | number>): string => {
  if (!params) return baseUrl;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  
  return `${baseUrl}?${searchParams.toString()}`;
};

/**
 * Environment helper
 */
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

/**
 * API Configuration info (useful for debugging)
 */
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  environment: isProduction() ? 'production' : 'development',
  endpoints: Object.keys(API_ENDPOINTS).length,
});

// Log API configuration in development
if (isDevelopment()) {
  console.log('🔧 API Configuration:', getApiConfig());
} 