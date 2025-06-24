import { useAuth } from "@/contexts/AuthContext";
import { Coins, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react"; // Ícones para a UI
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  // Pega o usuário, saldo e função de logout do contexto de autenticação
  const { user, balance, logout, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          SuperLead<span className="text-superlead-pro">Pro</span>
        </div>

        {/* Informações do Usuário e Saldo */}
        <div className="flex items-center gap-6">
          
          {/* Mostra o saldo ou um efeito de loading */}
          {isLoading ? (
            <div className="bg-gray-200 h-9 w-28 rounded-lg animate-pulse"></div>
          ) : (
            balance !== null && (
              // ✅ LINHA ALTERADA AQUI
              <div className="flex items-center gap-2 bg-[#015360]/10 text-[#015360] font-semibold px-4 py-2 rounded-lg text-sm">
                <Coins className="w-5 h-5" />
                <span>Saldo Atual: {balance.toLocaleString('pt-BR')} | Total do Plano: {user.maxQueries}</span>
              </div>
            )
          )}
          
          {/* Mostra o nome do usuário */}
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700 hidden sm:block">
              {user ? `Olá, ${user.name.split(' ')[0]}` : "Carregando..."}
            </span>

            {user.isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">
                Dashboard Admin
              </span>
            </Button>
            )}

            {/* Botão de Sair */}
            <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-5 w-5"/>
              Sair
            </Button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;