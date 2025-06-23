import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { setBaseUrl } from "@/services/axios";
import { authService, documentService } from "@/services";
import { User } from "@/pages/admin/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  balance: number | null;
  fetchBalance: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setApiUrl: (url: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const setApiUrl = (url: string) => {
    localStorage.setItem('api_url', url);
    setBaseUrl(url);
  };
  
  const fetchBalance = useCallback(async () => {
    try {
      const response = await documentService.getBalance();
      setBalance(response.message.total_balance);
    } catch (err) {
      console.error("Falha ao buscar saldo:", err);
      toast.error("Não foi possível carregar seu saldo.");
      setBalance(0);
    }
  }, []);

  const handleAuthenticationSuccess = useCallback(async (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchBalance();
    
    if (userData.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }, [navigate, fetchBalance]);

  // ✅ LÓGICA DE INICIALIZAÇÃO FINAL
  useEffect(() => {
    const initAuth = async () => {
      const savedApiUrl = localStorage.getItem('api_url');
      if (savedApiUrl) setBaseUrl(savedApiUrl);
      
      // Passo 1: Verifica se há um utilizador guardado localmente como "pista".
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        // Passo 2: Se houver, SÓ ENTÃO tenta validar a sessão com a API.
        try {
          const { authenticated, user: sessionUser } = await authService.checkAuth();
          if (authenticated && sessionUser) {
            setUser(sessionUser);
            await fetchBalance();
          } else {
            // Se o utilizador local for inválido (sessão expirou na API), limpa.
            localStorage.clear();
          }
        } catch (err) {
          console.error("Sessão local encontrada, mas falhou ao validar na API. Limpando.", err);
          localStorage.clear();
        }
      }
      
      // Passo 3: Finaliza o loading. Se não havia utilizador, nenhuma chamada à API foi feita.
      setIsLoading(false);
    };
    
    initAuth();
  }, [fetchBalance]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loginResponse = await authService.login(email, password);
      if (loginResponse.authenticated) {
        const sessionData = await authService.checkAuth();
        if (sessionData.authenticated && sessionData.user) {
          toast.success("Autenticação realizada com sucesso!");
          await handleAuthenticationSuccess(sessionData.user);
        } else {
          throw new Error("Sessão não pôde ser verificada após o login.");
        }
      } else {
        throw new Error(loginResponse.message || "Falha na autenticação.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Credenciais inválidas tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch(error) {
      console.error("API de logout falhou, desconectando do lado do cliente.", error);
    } finally {
      setUser(null);
      setBalance(null);
      localStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      toast.success("Você foi desconectado com sucesso!");
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, balance, fetchBalance, login, logout, error, setApiUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);