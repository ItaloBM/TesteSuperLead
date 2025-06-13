// Arquivo: src/components/Header.tsx (AJUSTADO)

import { useAuth } from "@/contexts/AuthContext";
import { Coins, LogOut, User as UserIcon } from "lucide-react"; // Ícones para a UI
import { Button } from "./ui/button";

const Header = () => {
  // ✅ Pega o usuário, saldo e função de logout do contexto de autenticação
  const { user, balance, logout, isLoading } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          SuperLead<span className="text-blue-600">Pro</span>
        </div>

        {/* Informações do Usuário e Saldo */}
        <div className="flex items-center gap-6">
          
          {/* Mostra o saldo ou um efeito de loading */}
          {isLoading ? (
            <div className="bg-gray-200 h-9 w-28 rounded-lg animate-pulse"></div>
          ) : (
            balance !== null && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg text-sm">
                <Coins className="w-5 h-5" />
                <span>Saldo: {balance.toLocaleString('pt-BR')}</span>
              </div>
            )
          )}
          
          {/* Mostra o nome do usuário */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="font-medium text-gray-700 hidden sm:block">
              {user ? `Olá, ${user.name.split(' ')[0]}` : "Carregando..."}
            </span>
          </div>

          {/* Botão de Sair */}
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 hover:text-red-700">
            <LogOut className="w-5 h-5 mr-2"/>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;