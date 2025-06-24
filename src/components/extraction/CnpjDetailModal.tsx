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
import { CnpjDetails } from "@/pages/admin/types";
import { Mail, Phone, Building2 } from "lucide-react"; // Importando mais ícones

interface CnpjDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CnpjDetails | null;
}

// Componente auxiliar para renderizar as informações
const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div className="py-2 px-3 hover:bg-gray-50 rounded-md break-words">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
};

export const CnpjDetailModal: React.FC<CnpjDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{data.razao_social}</DialogTitle>
          <DialogDescription>Detalhes completos do CNPJ: {data.cnpj}</DialogDescription>
        </DialogHeader>
        
        {/* Seção de Informações Gerais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-4 border-b pb-4">
          <InfoRow label="Nome Fantasia" value={data.nome_fantasia} />
          <InfoRow label="Situação Cadastral" value={data.situacao_cadastral?.situacao_atual} />
          <InfoRow label="Data de Abertura" value={new Date(data.data_abertura).toLocaleDateString('pt-BR')} />
          <InfoRow label="Porte da Empresa" value={data.porte_empresa?.descricao} />
          <InfoRow label="Matriz ou Filial" value={data.matriz_filial} />
          <InfoRow label="Natureza Jurídica" value={data.descricao_natureza_juridica} />
          <InfoRow label="Capital Social" value={data.capital_social?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        </div>

        {/* ✅ NOVA SEÇÃO: CONTATOS */}
        {(data.contato_telefonico?.length || data.contato_email?.length) && (
          <div className="mt-4 border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2 px-3">Contatos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {data.contato_telefonico?.map((tel, index) => (
                <div key={`tel-${index}`} className="flex items-center gap-2 p-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{tel.completo} ({tel.tipo})</span>
                </div>
              ))}
              {data.contato_email?.map((email, index) => (
                <div key={`email-${index}`} className="flex items-center gap-2 p-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate" title={email.email}>{email.email.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Endereço */}
        <div className="mt-4 border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2 px-3">Endereço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
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
                <div className="mt-2 pl-3">
                    <p className="text-xs text-gray-500">Atividades Secundárias</p>
                    <ul className="list-disc list-inside text-sm text-gray-800 font-medium">
                        {data.atividade_secundaria.map(ativ => <li key={ativ.codigo}>{ativ.descricao}</li>)}
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