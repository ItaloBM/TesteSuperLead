
import { Menu } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  children: React.ReactNode;
}

const AdminLayout = ({ 
  isMenuOpen, 
  toggleMenu, 
  currentView, 
  setCurrentView,
  children 
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col lg:flex-row relative">
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="fixed top-20 left-4 z-20 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Sidebar - fixed position for mobile */}
        <div 
          className={`fixed inset-y-0 top-[72px] z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 lg:min-h-[calc(100vh-72px)]`}
        >
          <Sidebar 
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 py-8 lg:px-8 min-h-[calc(100vh-72px)]">
          <div className="w-full mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
