
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlanSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PlanSearch = ({ searchTerm, setSearchTerm }: PlanSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        className="pl-10 border-gray-300"
        placeholder="Pesquisar planos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default PlanSearch;
