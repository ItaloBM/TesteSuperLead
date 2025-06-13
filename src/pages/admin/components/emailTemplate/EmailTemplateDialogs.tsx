// Substitua todo o conteúdo do seu arquivo EmailTemplateDialogs.tsx por este código

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { EmailTemplate } from "../../types";

interface EmailTemplateDialogsProps {
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  templateToView: EmailTemplate | null;
  isNewTemplateDialogOpen: boolean;
  setIsNewTemplateDialogOpen: (open: boolean) => void;
  handleCreateTemplate: (formData: FormData) => Promise<void>;
  templateToDelete: EmailTemplate | null;
  setTemplateToDelete: (template: EmailTemplate | null) => void;
  handleDeleteTemplate: () => Promise<void>;
  templateToEdit: EmailTemplate | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  handleUpdateTemplate: (id: string, formData: FormData) => Promise<void>;
}

const EmailTemplateDialogs = ({
  isViewDialogOpen, setIsViewDialogOpen, templateToView,
  isNewTemplateDialogOpen, setIsNewTemplateDialogOpen, handleCreateTemplate,
  templateToEdit, isEditDialogOpen, setIsEditDialogOpen, handleUpdateTemplate,
  templateToDelete, setTemplateToDelete, handleDeleteTemplate
}: EmailTemplateDialogsProps) => {

  // --- LÓGICA PARA NOVO TEMPLATE ---
  const [newTemplate, setNewTemplate] = useState({ subject: "", message: "", emailToReceiver: "", smtpEmail: "", smtpPass: "", smtpHost: "", smtpPort: 587, smtpSecure: true });
  const [selectedHtmlFile, setSelectedHtmlFile] = useState<File | null>(null);
  
  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
  };
  
  const handleNewSwitchChange = (checked: boolean) => {
    setNewTemplate({ ...newTemplate, smtpSecure: checked });
  };

  const handleSubmitNew = async () => {
    if (!selectedHtmlFile) { toast.error("Por favor, selecione um arquivo HTML."); return; }
    const formData = new FormData();
    formData.append("subject", newTemplate.subject);
    formData.append("message", newTemplate.message);
    formData.append("emailToReceiver", newTemplate.emailToReceiver);
    formData.append("smtpEmail", newTemplate.smtpEmail);
    formData.append("smtpPass", newTemplate.smtpPass);
    formData.append("smtpHost", newTemplate.smtpHost);
    formData.append("smtpPort", newTemplate.smtpPort.toString());
    formData.append("smtpSecure", newTemplate.smtpSecure.toString());
    formData.append("htmlTemplate", selectedHtmlFile);
    await handleCreateTemplate(formData);
    setNewTemplate({ subject: "", message: "", emailToReceiver: "", smtpEmail: "", smtpPass: "", smtpHost: "", smtpPort: 587, smtpSecure: true });
    setSelectedHtmlFile(null);
  };

  // --- LÓGICA PARA EDIÇÃO DE TEMPLATE ---
  const [editFormData, setEditFormData] = useState<EmailTemplate | null>(null);
  const [newFileForEdit, setNewFileForEdit] = useState<File | null>(null);

  useEffect(() => {
    if (templateToEdit) {
      setEditFormData(templateToEdit);
    }
  }, [templateToEdit]);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSwitchChange = (checked: boolean) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, smtpSecure: checked });
  };
  
  const handleSubmitEdit = async () => {
    if (!editFormData) return;
    const formData = new FormData();
    formData.append("subject", editFormData.subject);
    formData.append("message", editFormData.message);
    formData.append("emailToReceiver", editFormData.emailToReceiver);
    formData.append("email", editFormData.smtpEmail);
    formData.append("pass", editFormData.smtpPass);
    formData.append("host", editFormData.smtpHost);
    formData.append("port", editFormData.smtpPort.toString());
    formData.append("secure", editFormData.smtpSecure.toString());
    if (newFileForEdit) {
      formData.append("htmlTemplate", newFileForEdit);
    }
    await handleUpdateTemplate(editFormData._id, formData);
    setNewFileForEdit(null);
  };

  return (
    <>
      {/* ✅ CÓDIGO RESTAURADO: View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualizar Template</DialogTitle>
          </DialogHeader>
          {templateToView && (
            <div className="space-y-2">
              <p><strong>Assunto:</strong> {templateToView.subject}</p>
              <p><strong>Mensagem:</strong> {templateToView.message}</p>
              <p><strong>Email SMTP:</strong> {templateToView.smtpEmail}</p>
              <p><strong>Host SMTP:</strong> {templateToView.smtpHost}</p>
              {/* Adicione outros campos que queira visualizar */}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ✅ CÓDIGO RESTAURADO: New Template Dialog */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
              {/* Campos do formulário para novo template */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="new-subject">Assunto</Label>
                      <Input id="new-subject" name="subject" value={newTemplate.subject} onChange={handleNewInputChange} />
                  </div>
                  <div>
                      <Label htmlFor="new-message">Mensagem (Descrição)</Label>
                      <Input id="new-message" name="message" value={newTemplate.message} onChange={handleNewInputChange} />
                  </div>
              </div>
              <div>
                <Label htmlFor="new-emailToReceiver">Email do Destinatário</Label>
                <Input id="new-emailToReceiver" name="emailToReceiver" value={newTemplate.emailToReceiver} onChange={handleNewInputChange}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="new-smtpEmail">Email SMTP</Label>
                      <Input id="new-smtpEmail" name="smtpEmail" value={newTemplate.smtpEmail} onChange={handleNewInputChange} />
                  </div>
                  <div>
                      <Label htmlFor="new-smtpPass">Senha SMTP</Label>
                      <Input id="new-smtpPass" name="smtpPass" type="password" value={newTemplate.smtpPass} onChange={handleNewInputChange} />
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                      <Label htmlFor="new-smtpHost">Host SMTP</Label>
                      <Input id="new-smtpHost" name="smtpHost" value={newTemplate.smtpHost} onChange={handleNewInputChange} />
                  </div>
                  <div>
                      <Label htmlFor="new-smtpPort">Porta SMTP</Label>
                      <Input id="new-smtpPort" name="smtpPort" type="number" value={newTemplate.smtpPort} onChange={handleNewInputChange} />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                      <Switch id="new-smtpSecure" checked={newTemplate.smtpSecure} onCheckedChange={handleNewSwitchChange} />
                      <Label htmlFor="new-smtpSecure">Secure</Label>
                  </div>
              </div>
              {/* Upload de Arquivo HTML */}
              <div className="space-y-2">
                <Label>Arquivo do Template HTML</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para escolher o arquivo</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".html, .htm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSelectedHtmlFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                {selectedHtmlFile && (
                  <p className="mt-2 text-sm text-center text-gray-600">
                    Arquivo selecionado: {selectedHtmlFile.name}
                  </p>
                )}
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmitNew}>Criar Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog (conforme ajustado anteriormente) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template de Email</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-subject">Assunto</Label>
                  <Input id="edit-subject" name="subject" value={editFormData.subject} onChange={handleEditInputChange}/>
                </div>
                <div>
                  <Label htmlFor="edit-message">Mensagem</Label>
                  <Input id="edit-message" name="message" value={editFormData.message} onChange={handleEditInputChange}/>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-emailToReceiver">Email do Destinatário</Label>
                <Input id="edit-emailToReceiver" name="emailToReceiver" value={editFormData.emailToReceiver} onChange={handleEditInputChange}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-smtpEmail">Email SMTP</Label>
                  <Input id="edit-smtpEmail" name="smtpEmail" value={editFormData.smtpEmail} onChange={handleEditInputChange}/>
                </div>
                <div>
                  <Label htmlFor="edit-smtpPass">Senha SMTP</Label>
                  <Input id="edit-smtpPass" name="smtpPass" type="password" placeholder="Deixe em branco para não alterar" onChange={handleEditInputChange}/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <Label htmlFor="edit-smtpHost">Host SMTP</Label>
                  <Input id="edit-smtpHost" name="smtpHost" value={editFormData.smtpHost} onChange={handleEditInputChange}/>
                </div>
                <div>
                  <Label htmlFor="edit-smtpPort">Porta SMTP</Label>
                  <Input id="edit-smtpPort" name="smtpPort" type="number" value={editFormData.smtpPort} onChange={handleEditInputChange}/>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch id="edit-smtpSecure" checked={editFormData.smtpSecure} onCheckedChange={handleEditSwitchChange}/>
                  <Label htmlFor="edit-smtpSecure">Secure</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Substituir HTML (opcional)</Label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para escolher novo arquivo</span></p>
                        </div>
                        <input type="file" className="hidden" accept=".html, .htm" onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setNewFileForEdit(e.target.files[0]);
                            }
                        }}/>
                    </label>
                </div>
                {newFileForEdit && (
                    <p className="mt-2 text-sm text-center text-gray-600">Novo arquivo: {newFileForEdit.name}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setNewFileForEdit(null); }}>Cancelar</Button>
                <Button onClick={handleSubmitEdit}>Salvar Alterações</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog (sem alterações) */}
      <Dialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir o template "{templateToDelete?.subject}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailTemplateDialogs;