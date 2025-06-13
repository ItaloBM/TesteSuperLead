
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddDomainFormProps {
  newDomain: { domain: string; isActive: boolean };
  setNewDomain: React.Dispatch<React.SetStateAction<{ domain: string; isActive: boolean }>>;
  handleAddDomain: () => void;
}

const AddDomainForm = ({ newDomain, setNewDomain, handleAddDomain }: AddDomainFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Novo Domínio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="domain">Domínio</Label>
            <Input
              id="domain"
              placeholder="https://exemplo.com"
              value={newDomain.domain}
              onChange={(e) => setNewDomain(prev => ({ ...prev, domain: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="domain-status"
                  checked={newDomain.isActive === true}
                  onChange={() => setNewDomain(prev => ({ ...prev, isActive: true }))}
                  className="h-4 w-4 text-primary"
                />
                <span>Ativo</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="domain-status"
                  checked={newDomain.isActive === false}
                  onChange={() => setNewDomain(prev => ({ ...prev, isActive: false }))}
                  className="h-4 w-4 text-primary"
                />
                <span>Inativo</span>
              </label>
            </div>
          </div>
          
          <div className="md:col-span-2 lg:col-span-1">
            <Button onClick={handleAddDomain} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddDomainForm;
