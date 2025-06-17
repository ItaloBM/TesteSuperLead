import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X as CloseIcon } from 'lucide-react';
import { DatePicker } from "./DatePicker";
import { SearchConfirmationDialog } from "./SearchConfirmationDialog";
import { SendEmailDialog } from "./SendEmailDialog";
import AutocompleteInput from '@/components/AutocompleteInput';
import { useToast } from "@/hooks/use-toast";
import { brazilianStates } from "@/constants/states";
import { documentService } from "@/services";
import { FileData } from "@/pages/admin/types";

interface ExtractionFormData {
  resultType: 'simples' | 'completo';
  companyName: string;
  mainActivity: string[];
  legalNature: string;
  status: string;
  state: string;
  city: string;
  neighborhood: string;
  zipCode: string;
  ddd: string;
  openingDateFrom: Date | undefined;
  openingDateTo: Date | undefined;
  capitalFrom: string;
  capitalTo: string;
  onlyMei: boolean;
  excludeMei: boolean;
  onlyMatrix: boolean;
  onlyBranch: boolean;
  withPhone: boolean;
  onlyLandline: boolean;
  onlyMobile: boolean;
  withEmail: boolean;
  limit: string;
}

interface ExtractionSearchFormProps {
  onSearchCompleted: (results: FileData[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const createApiPayload = (formData: ExtractionFormData) => {
  const payload: any = { pagina: 0 };
  const addField = (field: keyof any, value: any) => {
    if (value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      payload[field] = value;
    }
  };
  const formatNumber = (value: string | undefined) => value ? parseFloat(value.replace(',', '.')) : 0;
  const formatDateForApi = (date: Date | undefined) => date ? format(date, 'yyyy-MM-dd') : undefined;

  if (formData.companyName) {
    addField('busca_textual', [{
        texto: [formData.companyName],
        tipo_busca: "CONTEM",
        razao_social: true,
        nome_fantasia: true,
        nome_socio: false 
    }]);
  }
  
  if(formData.mainActivity && formData.mainActivity.length > 0) addField('codigo_atividade_principal', formData.mainActivity);
  if(formData.legalNature) addField('codigo_natureza_juridica', [formData.legalNature]);
  if(formData.status) addField('situacao_cadastral', [formData.status]);
  if(formData.state) addField('uf', [formData.state]);
  if(formData.city) addField('municipio', [formData.city]);
  if(formData.neighborhood) addField('bairro', [formData.neighborhood]);
  if(formData.zipCode) addField('cep', [formData.zipCode]);
  if(formData.ddd) addField('ddd', [formData.ddd]);

  const data_abertura: any = {};
  if(formData.openingDateFrom) data_abertura.inicio = formatDateForApi(formData.openingDateFrom);
  if(formData.openingDateTo) data_abertura.fim = formatDateForApi(formData.openingDateTo);
  if(Object.keys(data_abertura).length > 0) addField('data_abertura', data_abertura);
  
  const capital_social: any = {};
  const minCapital = formatNumber(formData.capitalFrom);
  const maxCapital = formatNumber(formData.capitalTo);
  if(minCapital > 0) capital_social.minimo = minCapital;
  if(maxCapital > 0) capital_social.maximo = maxCapital;
  if(Object.keys(capital_social).length > 0) addField('capital_social', capital_social);

  addField('mei', { optante: formData.onlyMei, excluir_optante: formData.excludeMei });
  addField('mais_filtros', {
      somente_matriz: formData.onlyMatrix, 
      somente_filial: formData.onlyBranch,
      com_email: formData.withEmail, 
      com_telefone: formData.withPhone,
      somente_fixo: formData.onlyLandline, 
      somente_celular: formData.onlyMobile,
  });

  addField('limite', parseInt(formData.limit) || 50);

  return payload;
};

const ExtractionSearchForm = ({ onSearchCompleted, setIsLoading }: ExtractionSearchFormProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentCnae, setCurrentCnae] = useState("");
  const { toast } = useToast();

  const form = useForm<ExtractionFormData>({
    defaultValues: {
      resultType: "simples",
      companyName: "",
      mainActivity: [],
      legalNature: "",
      status: "",
      state: "",
      city: "",
      neighborhood: "",
      zipCode: "",
      ddd: "",
      capitalFrom: "",
      capitalTo: "",
      openingDateFrom: undefined,
      openingDateTo: undefined,
      onlyMei: false,
      excludeMei: false,
      onlyMatrix: false,
      onlyBranch: false,
      withPhone: false,
      onlyLandline: false,
      onlyMobile: false,
      withEmail: false,
      limit: "50"
    },
  });

  const handleAddCnae = () => {
    const currentCnaes = form.getValues("mainActivity");
    if (currentCnae && !currentCnaes.includes(currentCnae)) {
      form.setValue("mainActivity", [...currentCnaes, currentCnae]);
      setCurrentCnae("");
    }
  };

  const handleRemoveCnae = (cnaeToRemove: string) => {
    const currentCnaes = form.getValues("mainActivity");
    form.setValue("mainActivity", currentCnaes.filter(cnae => cnae !== cnaeToRemove));
  };

  const handleConfirmSearch = async () => {
    setShowConfirmDialog(false);
    setIsSearching(true);
    setIsLoading(true);
    const formData = form.getValues();
    const apiPayload = createApiPayload(formData);

    try {
      const response = await documentService.startCnpjQuery(apiPayload, formData.resultType);
      const results = response.responseData?.cnpjs || [];
      const formattedResults: FileData[] = results.map((cnpj: any) => ({
        id: cnpj.cnpj,
        name: cnpj.razao_social || 'Nome não informado',
        lastModified: new Date().toLocaleDateString('pt-BR'),
        date: cnpj.data_abertura ? new Date(cnpj.data_abertura).toLocaleDateString('pt-BR') : '-',
        type: 'cnpj',
        url: ''
      }));
      toast({ title: "Busca concluída!", description: `${formattedResults.length} resultados foram encontrados.` });
      onSearchCompleted(formattedResults);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Não foi possível processar sua solicitação.";
      toast({ title: "Erro ao iniciar a busca", description: `Erro: ${errorMessage}`, variant: "destructive" });
      onSearchCompleted([]);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleConfirmEmailSend = async (details: { nome: string; enviar_para: string[] }) => {
    setIsSendingEmail(true);
    const formData = form.getValues();
    const emailApiPayload = {
      nome: details.nome,
      enviar_para: details.enviar_para,
      total_linhas: parseInt(formData.limit) || 50,
      pesquisa: createApiPayload(formData),
    };

    try {
      await documentService.startCnpjQueryAndSendEmail(emailApiPayload, formData.resultType);
      toast({ title: "Busca e envio de e-mail iniciados!", description: "Os resultados serão enviados para os e-mails informados." });
      onSearchCompleted([]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Não foi possível processar sua solicitação.";
      toast({ title: "Erro ao enviar por e-mail", description: `Erro: ${errorMessage}`, variant: "destructive" });
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
            <FormField
              control={form.control}
              name="resultType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Resultado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de resultado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simples">Simples (Rápido, dados básicos)</SelectItem>
                      <SelectItem value="completo">Completa (Todos os dados disponíveis)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Razão Social ou Nome Fantasia</FormLabel><FormControl><AutocompleteInput {...field} placeholder="Digite para buscar empresas..." fetchSuggestions={documentService.fetchEmpresaSuggestions} /></FormControl></FormItem>)}/>
            
            <FormField
              control={form.control}
              name="mainActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atividades Principais (CNAE)</FormLabel>
                  <div className="flex items-center gap-2">
                    <AutocompleteInput
                      placeholder="Digite para buscar atividades..."
                      fetchSuggestions={documentService.fetchCnaeSuggestions}
                      value={currentCnae}
                      onChange={(value) => setCurrentCnae(value)}
                    />
                    <Button type="button" onClick={handleAddCnae}>Adicionar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                    {field.value.map((cnae) => (
                      <Badge key={cnae} variant="secondary">
                        {cnae}
                        <button
                          type="button"
                          className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={() => handleRemoveCnae(cnae)}
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Não sabe o código?{" "}
                    <a href="https://concla.ibge.gov.br/busca-online-cnae.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                      Consulte aqui
                    </a>
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalNature"
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Natureza Jurídica</FormLabel>
                  <FormControl>
                    <AutocompleteInput {...field} placeholder="Digite para buscar naturezas..." fetchSuggestions={documentService.fetchNaturezaJuridicaSuggestions} />
                  </FormControl>
                  <FormDescription>
                    Não sabe o código?{" "}
                    <a href="https://concla.ibge.gov.br/classificacoes/por-tema/organizacao-juridica/tabela-de-natureza-juridica.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                      Consulte aqui
                    </a>
                  </FormDescription>
                </FormItem>
              )}
            />
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
            <FormField control={form.control} name="openingDateFrom" render={({ field }) => (<FormItem><FormLabel>Data de Abertura - De</FormLabel><DatePicker date={field.value} onSelect={field.onChange} /></FormItem>)}/>
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
            <FormField control={form.control} name="limit" render={({ field }) => (<FormItem className="max-w-xs"><FormLabel>Quantidade de registros</FormLabel><FormControl><Input type="number" min="1" placeholder="Padrão: 50" {...field} /></FormControl></FormItem>)}></FormField>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="bg-primary text-white" disabled={isSearching || isSendingEmail}>
              {isSearching ? "Pesquisando..." : "Pesquisar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowEmailDialog(true)} disabled={isSearching || isSendingEmail}>
                {isSendingEmail ? "Enviando..." : "Pesquisar e Enviar por E-mail"}
            </Button>
          </div>
        </form>
      </Form>
      <SearchConfirmationDialog isOpen={showConfirmDialog} onConfirm={handleConfirmSearch} onCancel={() => setShowConfirmDialog(false)} />
      <SendEmailDialog isOpen={showEmailDialog} onClose={() => setShowEmailDialog(false)} onSubmit={handleConfirmEmailSend} isLoading={isSendingEmail} />
    </div>
  );
};

export default ExtractionSearchForm;