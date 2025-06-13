import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "../../types";
import { planService } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  _id: string;
  name: string;
  description: string;
}

interface NewUserFormProps {
  newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>;
  setNewUser: React.Dispatch<React.SetStateAction<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'apiKey' | 'maxQueries' | 'isOnline' | 'activeAccount' | 'isAdmin'>>>;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

const NewUserForm = ({ newUser, setNewUser, onSubmit, onCancel }: NewUserFormProps) => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [formData, setFormData] = useState({
    name: newUser.name || "",
    email: newUser.email || "",
    password: "",
    phone: newUser.phone || "",
    cpfOrCnpj: newUser.cpfOrCnpj || "",
    plan: newUser.plan || "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Keep the form data in sync with any changes to newUser prop
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: newUser.name || prev.name,
      email: newUser.email || prev.email,
      phone: newUser.phone || prev.phone,
      cpfOrCnpj: newUser.cpfOrCnpj || prev.cpfOrCnpj,
      plan: newUser.plan || prev.plan,
    }));
  }, [newUser]);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const response = await planService.getPlans(1, 100);
        console.log("Plans response:", response);
        
        if (response.objRecords && response.objRecords.records) {
          setPlans(response.objRecords.records);
        }
      } catch (error) {
        console.error("Error loading plans:", error);
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos disponíveis.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadPlans();
  }, [toast]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = "Nome é obrigatório";
    if (!formData.email) errors.email = "Email é obrigatório";
    if (!formData.password) errors.password = "Senha é obrigatória";
    if (!formData.plan) errors.plan = "Plano é obrigatório";
    
    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Email inválido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log("Form submitted with data:", formData);
    
    // Update the parent state with the form data
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cpfOrCnpj: formData.cpfOrCnpj,
      plan: formData.plan,
    };
    
    console.log("Updating parent state with:", userData);
    
    // Update parent state and then call onSubmit
    setNewUser(userData);
    onSubmit(formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={formErrors.name ? "border-red-500" : ""}
        />
        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Digite a senha"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className={formErrors.password ? "border-red-500" : ""}
        />
        {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpfOrCnpj">CPF/CNPJ</Label>
        <Input
          id="cpfOrCnpj"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={formData.cpfOrCnpj}
          onChange={(e) => handleInputChange("cpfOrCnpj", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="plan">Plano *</Label>
        {isLoadingPlans ? (
          <div className="h-10 flex items-center px-3 py-2 border rounded-md bg-gray-50">
            <span className="text-gray-500">Carregando planos...</span>
          </div>
        ) : (
          <select
            id="plan"
            value={formData.plan}
            onChange={(e) => handleInputChange("plan", e.target.value)}
            className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${formErrors.plan ? "border-red-500" : ""}`}
          >
            <option value="">Selecione um plano</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan.name}>
                {plan.name} - {plan.description}
              </option>
            ))}
          </select>
        )}
        {formErrors.plan && <p className="text-sm text-red-500">{formErrors.plan}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoadingPlans}>
          Criar usuário
        </Button>
      </div>
    </form>
  );
};

export default NewUserForm;
