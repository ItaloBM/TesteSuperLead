
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { authService } from "@/services";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar o email da tela anterior
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Se não tiver email, voltar para a tela de solicitar reset
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem. Por favor, verifique e tente novamente.");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (!token || token.trim() === "") {
      toast.error("Por favor, informe o token de recuperação recebido por email.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call API to reset password with the correct parameter names
      await authService.resetPassword(email, password, token);
      
      // Limpar dados do processo
      localStorage.removeItem("resetEmail");
      
      toast.success("Senha alterada com sucesso! Agora você pode fazer login com sua nova senha.");
      
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Token inválido ou expirado. Solicite um novo token.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Reset Password Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Logo adicionado aqui */}
          <div className="text-center mb-6">
            <img
              src="/public/Logo WebSender 2k24.png"
              alt="WebSender Logo"
              className="mx-auto"
              style={{ width: "180px" }}
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Redefinir senha
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Digite o token recebido por email e sua nova senha
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                className="w-full bg-gray-100 border-gray-200 focus:border-primary/50 transition-colors"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary/70" />
                Token de recuperação
              </Label>
              <Input
                type="text"
                placeholder="123456"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-white/60 border-gray-200 focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary/70" />
                Nova senha
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 bg-white/60 border-gray-200 focus:border-primary/50 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary/70" />
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 bg-white/60 border-gray-200 focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Redefinir senha"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
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
          <a href="http://wa.me/553284591423" className="text-primary hover:text-primary/80 transition-colors hover:underline">
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
