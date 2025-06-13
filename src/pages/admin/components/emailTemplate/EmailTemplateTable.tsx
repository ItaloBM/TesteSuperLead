
import { Eye, Pencil, Trash } from "lucide-react";
import { EmailTemplate } from "../../types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmailTemplateTableProps {
  templates: EmailTemplate[];
  handleViewTemplate: (template: EmailTemplate) => void;
  handleEditTemplate: (template: EmailTemplate) => void;
  openDeleteTemplateDialog: (template: EmailTemplate) => void;
}

const EmailTemplateTable = ({
  templates,
  handleViewTemplate,
  handleEditTemplate,
  openDeleteTemplateDialog,
}: EmailTemplateTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assunto</TableHead>
          <TableHead>Mensagem</TableHead>
          <TableHead>Email SMTP</TableHead>
          <TableHead>Host SMTP</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
              Nenhum template encontrado.
            </TableCell>
          </TableRow>
        ) : (
          templates.map((template) => (
            <TableRow key={template._id}>
              <TableCell className="font-medium">{template.subject}</TableCell>
              <TableCell>{template.message || "—"}</TableCell>
              <TableCell>{template.smtpEmail}</TableCell>
              <TableCell>{template.smtpHost}</TableCell>
              <TableCell>
                {new Date(template.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTemplate(template)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTemplate(template)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => openDeleteTemplateDialog(template)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EmailTemplateTable;
