import { useNavigate } from "react-router-dom";
import { Users, Globe, List, Menu, PhoneCall, Mail, Search } from "lucide-react";
import { toast } from "sonner";

interface SidebarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar = ({ isMenuOpen, toggleMenu, currentView, setCurrentView }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 w-full p-2">
          <Menu className="h-5 w-5 text-gray-600 lg:hidden" onClick={toggleMenu} />
          <span className="font-medium text-gray-700">Administração</span>
        </div>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <button
            onClick={() => setCurrentView("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary/5 rounded-md ${
              currentView === "users" ? "text-primary bg-primary/5" : "text-gray-600"
            }`}
          >
            <Users className="h-5 w-5" />
            Visualizar Usuários
          </button>

          <button
            onClick={() => setCurrentView("leads")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary/5 rounded-md ${
              currentView === "leads" ? "text-primary bg-primary/5" : "text-gray-600"
            }`}
          >
            <PhoneCall className="h-5 w-5" />
            Visualizar Leads
          </button>

          <button
            onClick={() => setCurrentView("cors")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary/5 rounded-md ${
              currentView === "cors" ? "text-primary bg-primary/5" : "text-gray-600"
            }`}
          >
            <Globe className="h-5 w-5" />
            Liberar Acesso CORS
          </button>

          <button
            onClick={() => setCurrentView("plans")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary/5 rounded-md ${
              currentView === "plans" ? "text-primary bg-primary/5" : "text-gray-600"
            }`}
          >
            <List className="h-5 w-5" />
            Listar Planos
          </button>
          
          <button
            onClick={() => setCurrentView("emailTemplates")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary/5 rounded-md ${
              currentView === "emailTemplates" ? "text-primary bg-primary/5" : "text-gray-600"
            }`}
          >
            <Mail className="h-5 w-5" />
            Templates de Email
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 text-sm transition-colors hover:bg-primary/5 rounded-md"
          >
            <Search className="h-5 w-5" />
            DashBoard de Pesquisa
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
