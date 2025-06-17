import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../ui/use-toast'; // Verifique se o caminho para use-toast está correto

interface SendEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { nome: string; enviar_para: string[]; tipo: 'csv' | 'xlsx' }) => void;
  isLoading: boolean;
}

export const SendEmailDialog: React.FC<SendEmailDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [nome, setNome] = useState('');
  const [emails, setEmails] = useState('');
  const [fileType, setFileType] = useState<'csv' | 'xlsx'>('csv');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast({ title: 'Erro de Validação', description: 'Por favor, insira um nome para o arquivo.', variant: 'destructive' });
      return;
    }
    if (!emails.trim()) {
      toast({ title: 'Erro de Validação', description: 'Por favor, insira pelo menos um e-mail.', variant: 'destructive' });
      return;
    }

    const emailArray = emails.split(',').map(email => email.trim()).filter(email => email);

    if (emailArray.length === 0) {
        toast({ title: 'Erro de Validação', description: 'Por favor, insira pelo menos um e-mail válido.', variant: 'destructive' });
        return;
    }

    onSubmit({ nome, enviar_para: emailArray, tipo: fileType });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Extração por E-mail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Arquivo</Label>
            <Input id="nome" placeholder="Ex: Clientes de São Paulo" value={nome} onChange={e => setNome(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileType">Formato do Arquivo</Label>
            <Select onValueChange={(value: 'csv' | 'xlsx') => setFileType(value)} defaultValue={fileType}>
              <SelectTrigger id="fileType">
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (separado por vírgulas)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emails">E-mails para envio</Label>
            <Input id="emails" placeholder="email1@exemplo.com, email2@exemplo.com" value={emails} onChange={e => setEmails(e.target.value)} />
            <p className="text-sm text-muted-foreground">Separe múltiplos e-mails por vírgula.</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Confirmar e Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};