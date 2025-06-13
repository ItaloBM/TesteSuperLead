import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface EmailTemplateFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const EmailTemplateForm = ({ onSubmit, isSubmitting }: EmailTemplateFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      subject: "",
      message: "",
      emailToReceiver: "",
      smtpEmail: "",
      smtpPass: "",
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: true,
    },
  });

  const handleSubmit = (values: any) => {
    if (!selectedFile) {
      toast.error("É necessário selecionar um arquivo HTML.");
      return;
    }
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("message", values.message);
    formData.append("emailToReceiver", values.emailToReceiver);
    formData.append("smtpEmail", values.smtpEmail);
    formData.append("smtpPass", values.smtpPass);
    formData.append("smtpHost", values.smtpHost);
    formData.append("smtpPort", values.smtpPort.toString());
    formData.append("smtpSecure", values.smtpSecure.toString());
    formData.append("htmlTemplate", selectedFile);
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto</FormLabel>
                <FormControl>
                  <Input placeholder="Assunto do E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Input placeholder="Mensagem de fallback" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="emailToReceiver"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do Destinatário</FormLabel>
              <FormControl>
                <Input type="email" placeholder="destinatario@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="my-2" />
        <h3 className="text-lg font-medium">Configuração SMTP</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smtpHost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host SMTP</FormLabel>
                <FormControl><Input placeholder="smtp.hostinger.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtpPort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porta SMTP</FormLabel>
                <FormControl><Input type="number" placeholder="587" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtpEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email SMTP</FormLabel>
                <FormControl><Input type="email" placeholder="seu-email@provedor.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtpPass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha SMTP</FormLabel>
                <FormControl><Input type="password" placeholder="Sua senha de e-mail" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="smtpSecure"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>SMTP Secure (SSL/TLS)</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <hr className="my-2" />

        {/* ✅ ESTA É A PARTE DO UPLOAD DE ARQUIVO */}
        <div className="space-y-2">
          <FormLabel>HTML Content (Arquivo)</FormLabel>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Clique para fazer upload</span>
                </p>
                <p className="text-xs text-gray-500">Somente arquivos .HTML</p>
              </div>
              <input
                id="htmlTemplate"
                type="file"
                className="hidden"
                accept=".html"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
            </label>
          </div>
          {selectedFile && (
            <p className="mt-2 text-sm text-center text-gray-600">
              Arquivo selecionado: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline">Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Template"}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmailTemplateForm;