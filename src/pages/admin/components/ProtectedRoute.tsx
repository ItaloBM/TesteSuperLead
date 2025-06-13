import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner"; // ou seu componente de loading

export const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Hook para saber a rota atual

  // 1. Enquanto verifica a autenticação, mostra um spinner
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 2. Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver autenticado mas tentar acessar /admin sem ser admin, redireciona
  if (location.pathname.startsWith('/admin') && !user?.isAdmin) {
    // Redireciona para o dashboard do usuário normal
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Se passou por todas as verificações, permite o acesso à rota solicitada
  return <Outlet />;
};