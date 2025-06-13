
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the API to request password reset token
      await authService.requestPasswordReset(email);
      
      // Armazenar o email para a próxima tela
      localStorage.setItem("resetEmail", email);
      
      toast.success("Token de recuperação enviado com sucesso! Verifique seu email.");
      
      navigate("/reset-password");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Email não encontrado em nossa base de dados.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Forgot Password Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-5">
            <img
              src="/removebg_Logo_WebSender_2k24.png"
              style={{ width: "220px" }}
              alt="WebSender Logo"
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Esqueceu sua senha?
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Digite seu email para receber um link de recuperação
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#015360] flex items-center gap-2">
  <Mail className="w-4 h-4 text-[#015360]" />
  Email
</Label>

              <Input
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full bg-white/60 border border-[#015360] focus:border-[#18363b] focus:ring-1 focus:ring-[#18363b] transition-colors"
  required
/>

            </div>

            <Button 
  type="submit"
  className="w-full h-11 text-base font-semibold shadow-lg bg-[#015360] hover:bg-[#18363b] hover:shadow-primary/20 transition-all duration-200 text-white"
  disabled={isLoading}
>
              {isLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
            style={{ color: '#015360' }}
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
            >
              Voltar para o login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
  Precisando de ajuda?{" "}
  <a 
    href="http://wa.me/553284591423" 
    className="text-[#015360] hover:text-[#18363b] transition-colors hover:underline"
  >
    Entre em contato
  </a>
</p>

      </div>
    </div>
  );
};

export default ForgotPassword;
