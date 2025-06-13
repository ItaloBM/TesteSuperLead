
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailTemplateHeaderProps {
  openNewTemplateDialog: () => void;
}

const EmailTemplateHeader = ({ openNewTemplateDialog }: EmailTemplateHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <Mail className="h-6 w-6 text-primary" />
        Templates de Email
      </h1>
      <Button onClick={openNewTemplateDialog}>Novo Template</Button>
    </div>
  );
};

export default EmailTemplateHeader;
