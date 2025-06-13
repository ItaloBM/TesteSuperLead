import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/pages/admin/hooks/useDebounce'; // Certifique-se de que o caminho está correto
import { Loader2 } from 'lucide-react';

interface Suggestion {
  id: string;   // O código/ID que pode ser usado no filtro final
  nome: string; // O texto que será exibido para o usuário
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<Suggestion[]>;
}

export const AutocompleteInput = ({ value, onChange, placeholder, fetchSuggestions }: AutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearchTerm = useDebounce(inputValue, 300); // 300ms de delay

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      fetchSuggestions(debouncedSearchTerm).then(results => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    // Usamos o 'nome' para o campo de texto e o 'id' poderia ser usado em outro lugar se necessário
    onChange(suggestion.nome); 
    setInputValue(suggestion.nome);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value); // Atualiza o form em tempo real
            setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay para permitir o clique
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (inputValue.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {!isLoading && suggestions.length === 0 && debouncedSearchTerm && (
            <p className="p-2 text-sm text-gray-500">Nenhum resultado encontrado.</p>
          )}
          {!isLoading && suggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};