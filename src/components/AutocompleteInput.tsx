import { FC, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/pages/admin/hooks/useDebounce';
import { Loader2 } from 'lucide-react';

interface Suggestion {
  id: string;
  nome: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<Suggestion[] | undefined>; // Aceita que o retorno pode ser undefined
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({ value, onChange, placeholder, fetchSuggestions }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 300);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!debouncedSearchTerm) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchSuggestions(debouncedSearchTerm);
        // ✅ A MUDANÇA PRINCIPAL: Garante que o estado seja SEMPRE um array.
        // Se 'data' for undefined ou qualquer outra coisa, 'suggestions' vira uma lista vazia.
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]); // Garante uma lista vazia em caso de erro.
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const newValue = suggestion.nome;
    onChange(newValue); 
    setInputValue(newValue);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && inputValue && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            // ✅ A verificação de 'suggestions.length' agora é segura.
            suggestions.length > 0 ? (
              suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.nome}
                </div>
              ))
            ) : (
              <p className="p-2 text-sm text-gray-500">Nenhum resultado encontrado.</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;