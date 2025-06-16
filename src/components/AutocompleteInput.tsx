import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/pages/admin/hooks/useDebounce'; // Verifique se este caminho está correto
import { Loader2 } from 'lucide-react';

interface Suggestion {
  id: string;
  nome: string;
}

// A interface de props agora é mais simples
interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<Suggestion[] | undefined>;
}

// ✅ forwardRef é usado para passar a ref para o Input interno
const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ value, onChange, placeholder, fetchSuggestions, ...props }, ref) => {
    
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const debouncedSearchTerm = useDebounce(inputValue, 300);

    // Sincroniza o estado interno se o valor do formulário externo mudar
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      const loadSuggestions = async () => {
        if (!debouncedSearchTerm) {
          setSuggestions([]);
          return;
        }
        setIsLoading(true);
        try {
          const data = await fetchSuggestions(debouncedSearchTerm);
          // Garante que o estado será sempre um array para evitar crashes
          setSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
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
          {...props}
          ref={ref} // A ref do formulário é aplicada aqui
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
        />
        {showSuggestions && inputValue && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
            ) : (
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
  }
);

// Adiciona um nome de exibição para facilitar a depuração
AutocompleteInput.displayName = "AutocompleteInput";

export default AutocompleteInput;