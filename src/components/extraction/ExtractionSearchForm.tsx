import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';

// Componentes
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "./DatePicker";
import { SearchConfirmationDialog } from "./SearchConfirmationDialog";
import { SendEmailDialog } from "./SendEmailDialog";
import AutocompleteInput from '@/components/AutocompleteInput';

// Hooks, Constantes, Tipos e Serviços
import { useToast } from "@/hooks/use-toast";
import { brazilianStates } from "@/constants/states";
import { documentService } from "@/services";
import { FileData } from "@/types/file";

// Interfaces
interface ExtractionFormData {
  companyName: string; mainActivity: string; legalNature: string; status: string;
  state: string; city: string; neighborhood: string; zipCode: string; ddd: string;
  openingDateFrom: Date | undefined; openingDateTo: Date | undefined;
  capitalFrom: string; capitalTo: string;
  onlyMei: boolean; excludeMei: boolean; onlyMatrix: boolean; onlyBranch: boolean;
  withPhone: boolean; onlyLandline: boolean; onlyMobile: boolean; withEmail: boolean;
  limit: string;
}

interface ExtractionSearchFormProps {
  onSearchCompleted: (results: FileData[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

// Função auxiliar para criar o payload da API
const createApiPayload = (formData: ExtractionFormData) => {
    const formatDateForApi = (date: Date | undefined) => date ? format(date, 'yyyy-MM-dd') : undefined;
    const formatNumber = (value: string | undefined) => (value ? parseFloat(value.replace(',', '.')) : 0) || 0;
    
    const payload: any = {
        busca_textual: formData.companyName ? [{ texto: [formData.companyName], razao_social: true, nome_fantasia: true }] : undefined,
        codigo_atividade_principal: formData.mainActivity ? [formData.mainActivity] : undefined,
        codigo_natureza_juridica: formData.legalNature ? [formData.legalNature] : undefined,
        situacao_cadastral: formData.status ? [formData.status] : undefined,
        uf: formData.state ? [formData.state] : undefined,
        municipio: formData.city ? [formData.city] : undefined,
        bairro: formData.neighborhood ? [formData.neighborhood] : undefined,
        cep: formData.zipCode ? [formData.zipCode] : undefined,
        ddd: formData.ddd ? [formData.ddd] : undefined,
        data_abertura: { inicio: formatDateForApi(formData.openingDateFrom), fim: formatDateForApi(formData.openingDateTo) },
        capital_social: { minimo: formatNumber(formData.capitalFrom), maximo: formatNumber(formData.capitalTo) },
        mei: { optante: formData.onlyMei, excluir_optante: formData.excludeMei },
        mais_filtros: {
            somente_matriz: formData.onlyMatrix, somente_filial: formData.onlyBranch,
            com_email: formData.withEmail, com_telefone: formData.withPhone,
            somente_fixo: formData.onlyLandline, somente_celular: formData.onlyMobile,
        },
        limite: parseInt(formData.limit), pagina: 0,
    };
    
    // Remove chaves com valor 'undefined' para não enviar dados desnecessários
    Object.keys(payload).forEach(key => {
      if (payload[key as keyof typeof payload] === undefined) {
        delete payload[key as keyof typeof payload];
      }
    });

    return payload;
};

const ExtractionSearchForm = ({ onSearchCompleted, setIsLoading }: ExtractionSearchFormProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExtractionFormData>({
    defaultValues: {
        companyName: "", mainActivity: "", legalNature: "", status: "",
        state: "", city: "", neighborhood: "", zipCode: "", ddd: "",
        capitalFrom: "", capitalTo: "",
        openingDateFrom: undefined, openingDateTo: undefined,
        onlyMei: false, excludeMei: false, onlyMatrix: false, onlyBranch: false,
        withPhone: false, onlyLandline: false, onlyMobile: false, withEmail: false,
        limit: "50"
    },
  });

  const handleConfirmSearch = async () => {
    setShowConfirmDialog(false);
    setIsSearching(true);
    setIsLoading(true);
    const apiPayload = createApiPayload(form.getValues());

    try {
      const response = await documentService.startCnpjQuery(apiPayload);
      const results = response.responseData?.cnpjs || [];
      const formattedResults: FileData[] = results.map((cnpj: any) => ({
        id: cnpj.cnpj,
        name: cnpj.razao_social || 'Nome não informado',
        lastModified: new Date().toLocaleDateString('pt-BR'),
        date: cnpj.data_abertura ? new Date(cnpj.data_abertura).toLocaleDateString('pt-BR') : '-',
        type: 'cnpj',
      }));
      toast({ title: "Busca concluída!", description: `${formattedResults.length} resultados foram encontrados.` });
      onSearchCompleted(formattedResults);
    } catch (error: any) {
      console.error("Erro ao iniciar a busca:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível processar sua solicitação.";
      toast({ title: "Erro ao iniciar a busca", description: `Erro ${error.response?.status}: ${errorMessage}`, variant: "destructive" });
      onSearchCompleted([]);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleConfirmEmailSend = async (details: { nome: string; tipo: string; enviar_para: string[] }) => {
    setIsSendingEmail(true);
    const emailApiPayload = {
      nome: details.nome,
      tipo: details.tipo,
      enviar_para: details.enviar_para,
      total_linhas: 50,
      pesquisa: createApiPayload(form.getValues()),
    };
    try {
      await documentService.startCnpjQueryAndSendEmail(emailApiPayload);
      toast({ title: "Busca e envio de e-mail iniciados!", description: "Os resultados serão enviados para os e-mails informados." });
      onSearchCompleted([]);
    } catch (error: any) {
      console.error("Erro ao enviar por e-mail:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível processar sua solicitação.";
      toast({ title: "Erro ao enviar por e-mail", description: `Erro ${error.response?.status}: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsSendingEmail(false);
      setShowEmailDialog(false);
    }
  };

  const onSubmit = () => setShowConfirmDialog(true);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Razão Social ou Nome Fantasia</FormLabel><FormControl><AutocompleteInput {...field} placeholder="Digite para buscar empresas..." fetchSuggestions={documentService.fetchEmpresaSuggestions} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="mainActivity" render={({ field }) => (<FormItem><FormLabel>Atividade Principal (CNAE)</FormLabel><FormControl><AutocompleteInput {...field} placeholder="Digite para buscar atividades..." fetchSuggestions={documentService.fetchCnaeSuggestions} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="legalNature" render={({ field }) => ( <FormItem><FormLabel>Natureza Jurídica</FormLabel><FormControl><AutocompleteInput {...field} placeholder="Digite para buscar naturezas..." fetchSuggestions={documentService.fetchNaturezaJuridicaSuggestions} /></FormControl></FormItem>)}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Situação Cadastral</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ativa">Ativa</SelectItem><SelectItem value="baixada">Baixada</SelectItem><SelectItem value="inapta">Inapta</SelectItem><SelectItem value="suspensa">Suspensa</SelectItem><SelectItem value="nula">Nula</SelectItem></SelectContent></Select></FormItem>)}/>
            <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>Estado (UF)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger></FormControl><SelectContent>{brazilianStates.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent></Select></FormItem>)}/>
            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Município</FormLabel><FormControl><Input placeholder="Nome do município" {...field} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="neighborhood" render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input placeholder="Nome do bairro" {...field} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="zipCode" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input placeholder="Somente 8 dígitos" {...field} /></FormControl></FormItem>)}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <FormField control={form.control} name="ddd" render={({ field }) => (<FormItem><FormLabel>DDD</FormLabel><FormControl><Input placeholder="2 dígitos" maxLength={2} {...field} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="openingDateFrom" render={({ field }) => (<FormItem><FormLabel>Data de Abertura - A partir de</FormLabel><DatePicker date={field.value} onSelect={field.onChange} /></FormItem>)}/>
            <FormField control={form.control} name="openingDateTo" render={({ field }) => (<FormItem><FormLabel>Data de Abertura - Até</FormLabel><DatePicker date={field.value} onSelect={field.onChange} /></FormItem>)}/>
            <FormItem><FormLabel>Capital Social</FormLabel><div className="grid grid-cols-2 gap-2"><FormField control={form.control} name="capitalFrom" render={({ field }) => (<FormItem><FormControl><Input placeholder="A partir de" {...field} /></FormControl></FormItem>)}/><FormField control={form.control} name="capitalTo" render={({ field }) => (<FormItem><FormControl><Input placeholder="Até" {...field} /></FormControl></FormItem>)}/></div></FormItem>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <FormField control={form.control} name="onlyMei" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Somente MEI</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="excludeMei" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Excluir MEI</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="onlyMatrix" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Somente matriz</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="onlyBranch" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Somente filial</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="withPhone" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Com contato de telefone</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="onlyLandline" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Somente fixo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="onlyMobile" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Somente celular</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="withEmail" render={({ field }) => (<FormItem className="flex items-center justify-between"><FormLabel>Com e-mail</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
          </div>
          <div>
            <FormField control={form.control} name="limit" render={({ field }) => (<FormItem className="max-w-xs"><FormLabel>Quantidade de registros: Por padrão 50</FormLabel><FormControl><Input type="number" min="1" placeholder="Ex: 50" {...field} /></FormControl></FormItem>)}></FormField>
          </div>
          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="bg-primary text-white" disabled={isSearching || isSendingEmail}>
              {isSearching ? "Pesquisando..." : "Pesquisar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowEmailDialog(true)} disabled={isSearching || isSendingEmail}>{isSendingEmail ? "Enviando..." : "Pesquisar e Enviar por E-mail"}</Button>
          </div>
        </form>
      </Form>
      <SearchConfirmationDialog isOpen={showConfirmDialog} onConfirm={handleConfirmSearch} onCancel={() => setShowConfirmDialog(false)} />
      <SendEmailDialog isOpen={showEmailDialog} onClose={() => setShowEmailDialog(false)} onSubmit={handleConfirmEmailSend} isLoading={isSendingEmail} />
    </div>
  );
};

export default ExtractionSearchForm;