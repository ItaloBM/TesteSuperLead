
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailTemplateSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const EmailTemplateSearch = ({ searchTerm, setSearchTerm }: EmailTemplateSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Pesquisar templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default EmailTemplateSearch;
