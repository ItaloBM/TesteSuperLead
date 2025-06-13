import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { setBaseUrl } from "@/services/axios";
import { authService, cnpjService } from "@/services";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  cpfOrCnpj: string;
  plan: string;
  maxQueries: number;
  apiKey: string;
  permission_admin?: boolean;
  services?: string[];
}

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

  const fetchBalance = async () => {
    // Adicionamos uma verificação: só busca o saldo se houver um usuário
    if (!localStorage.getItem("user") && !user) return; 

    try {
      const response = await cnpjService.getBalance();
      setBalance(response.message.total_balance);
    } catch (err) {
      console.error("Falha ao buscar saldo:", err);
      toast.error("Não foi possível carregar seu saldo.");
      setBalance(0);
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedApiUrl = localStorage.getItem('api_url');
      if (savedApiUrl) {
        setBaseUrl(savedApiUrl);
      }
      try {
        const { authenticated, user: sessionUser } = await authService.checkAuth();
        if (authenticated && sessionUser) {
          setUser(sessionUser);
          await fetchBalance(); // Busca saldo para usuário da sessão
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            await fetchBalance(); // ✅ CORREÇÃO: Busca saldo também para usuário do localStorage
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      const sessionData = await authService.checkAuth();
      const userData: User = sessionData.user;
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      await fetchBalance();
      
      toast.success("Autenticação realizada com sucesso!");
      
      if (userData.isAdmin || userData.permission_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Credenciais inválidas. Verifique seu email e senha.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch(error) {
      console.error("Logout API call failed, logging out client-side anyway.", error);
    } finally {
      setUser(null);
      setBalance(null);
      localStorage.clear(); // Limpa todo o localStorage para garantir
      toast.success("Você foi desconectado com sucesso!");
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        balance,
        fetchBalance,
        login,
        logout,
        error,
        setApiUrl
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);