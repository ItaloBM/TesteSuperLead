import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// A interface pode ser importada de um arquivo de tipos compartilhado no futuro
interface CnpjDetails {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  matriz_filial: string;
  data_abertura: string;
  capital_social: number;
  situacao_cadastral: {
    situacao_atual: string;
    motivo: string;
    data: string;
  };
  porte: {
    codigo: string;
    descricao: string;
  };
  natureza_juridica: {
    codigo: string;
    descricao: string;
  };
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    uf: string;
    municipio: string;
  };
  quadro_societario?: Array<{
    nome: string;
    qualificacao_socio: string;
  }>;
  atividade_principal: {
    codigo: string;
    descricao: string;
  };
  atividade_secundaria?: Array<{
    codigo: string;
    descricao: string;
  }>;
  contato_telefonico?: Array<{
    completo: string;
  }>
  [key:string]: any;
}


interface CnpjDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CnpjDetails | null;
}

// Componente auxiliar para renderizar as informações de forma limpa
const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => {
  if (!value) return null; // Não renderiza se o valor for nulo ou vazio
  return (
    <div className="py-2 px-3 hover:bg-gray-50 rounded-md break-words">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
};


export const CnpjDetailModal: React.FC<CnpjDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null; // Guarda de segurança, não renderiza o modal sem dados

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {data.razao_social}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do CNPJ: {data.cnpj}
          </DialogDescription>
        </DialogHeader>
        
        {/* Seção de Informações Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-4 border-b pb-4">
          <InfoRow label="Nome Fantasia" value={data.nome_fantasia} />
          <InfoRow label="Situação Cadastral" value={data.situacao_cadastral?.situacao_atual} />
          <InfoRow label="Data de Abertura" value={new Date(data.data_abertura).toLocaleDateString('pt-BR')} />
          <InfoRow label="Porte" value={data.porte?.descricao} />
          <InfoRow label="Natureza Jurídica" value={data.natureza_juridica?.descricao} />
          <InfoRow label="Capital Social" value={data.capital_social?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        </div>

        {/* Seção de Endereço */}
        <div className="mt-4 border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2 px-3">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
                <InfoRow label="Logradouro" value={`${data.endereco?.logradouro}, ${data.endereco?.numero}`} />
                <InfoRow label="Complemento" value={data.endereco?.complemento} />
                <InfoRow label="Bairro" value={data.endereco?.bairro} />
                <InfoRow label="Município / UF" value={`${data.endereco?.municipio} / ${data.endereco?.uf}`} />
                <InfoRow label="CEP" value={data.endereco?.cep} />
            </div>
        </div>

        {/* Seção de Atividades */}
        <div className="mt-4 border-b pb-4">
             <h3 className="font-semibold text-gray-700 mb-2 px-3">Atividades</h3>
             <InfoRow label="Atividade Principal (CNAE)" value={data.atividade_principal?.descricao} />
             {data.atividade_secundaria && data.atividade_secundaria.length > 0 && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500 px-3">Atividades Secundárias</p>
                    <ul className="list-disc list-inside px-3">
                        {data.atividade_secundaria.map(ativ => <li key={ativ.codigo} className="text-sm">{ativ.descricao}</li>)}
                    </ul>
                </div>
             )}
        </div>

        {/* Seção de Quadro Societário (QSA) */}
        {data.quadro_societario && data.quadro_societario.length > 0 && (
            <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2 px-3">Quadro de Sócios e Administradores (QSA)</h3>
                <div className="space-y-2">
                    {data.quadro_societario.map((socio, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                           <p className="text-sm text-gray-800 font-medium">{socio.nome}</p>
                           <p className="text-xs text-gray-500">{socio.qualificacao_socio}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        <div className="flex justify-end mt-6">
            <DialogClose asChild>
                <Button type="button" variant="outline">Fechar</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};