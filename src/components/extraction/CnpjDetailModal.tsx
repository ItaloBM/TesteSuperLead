import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define uma interface para os dados completos do CNPJ que virão da API
interface CnpjDetails {
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  situacao_cadastral: string;
  data_abertura: string;
  capital_social?: number;
  natureza_juridica: {
    id: string;
    descricao: string;
  };
  porte: {
    id: string;
    descricao: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cep: string;
    municipio: {
      id: string;
      nome: string;
    };
    uf: string;
  };
  qsa?: Array<{
    nome_socio: string;
    qualificacao_socio: {
        id: string;
        descricao: string;
    };
  }>;
  // Adicione outros campos que você espera receber da API
  [key: string]: any;
}

interface CnpjDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CnpjDetails | null;
}

// Componente para renderizar uma linha de informação no modal
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-2 px-3 hover:bg-gray-50 rounded-md">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || '-'}</p>
  </div>
);

export const CnpjDetailModal: React.FC<CnpjDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-superlead-pro">
            {data.razao_social}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do CNPJ: {data.cnpj}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <InfoRow label="CNPJ" value={data.cnpj} />
            <InfoRow label="Situação Cadastral" value={data.situacao_cadastral} />
            <InfoRow label="Data de Abertura" value={new Date(data.data_abertura).toLocaleDateString('pt-BR')} />
            <InfoRow label="Nome Fantasia" value={data.nome_fantasia} />
            <InfoRow label="Natureza Jurídica" value={data.natureza_juridica?.descricao} />
            <InfoRow label="Porte" value={data.porte?.descricao} />
            <InfoRow label="Capital Social" value={data.capital_social?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        </div>

        <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2 px-3">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-2">
                <InfoRow label="Logradouro" value={`${data.endereco?.logradouro}, ${data.endereco?.numero}`} />
                <InfoRow label="Complemento" value={data.endereco?.complemento} />
                <InfoRow label="Bairro" value={data.endereco?.bairro} />
                <InfoRow label="Município" value={data.endereco?.municipio?.nome} />
                <InfoRow label="UF" value={data.endereco?.uf} />
                <InfoRow label="CEP" value={data.endereco?.cep} />
            </div>
        </div>

        {data.qsa && data.qsa.length > 0 && (
            <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2 px-3">Quadro de Sócios e Administradores (QSA)</h3>
                <div className="border rounded-lg p-2 space-y-2">
                    {data.qsa.map((socio, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded-md">
                           <p className="text-sm text-gray-800 font-medium">{socio.nome_socio}</p>
                           <p className="text-xs text-gray-500">{socio.qualificacao_socio.descricao}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        <div className="flex justify-end mt-6">
            <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};