
import { PhoneCall } from "lucide-react";

const LeadHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <PhoneCall className="h-6 w-6 text-primary" />
        Gerenciamento de Leads
      </h1>
    </div>
  );
};

export default LeadHeader;
