
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DomainSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DomainSearch = ({ searchTerm, setSearchTerm }: DomainSearchProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Pesquisar domínios..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default DomainSearch;
