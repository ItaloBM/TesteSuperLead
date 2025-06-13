
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }
    
    setEmailError("");
    
    try {
      await login(email, password);
      // O toast de sucesso será gerenciado no AuthContext após o login bem-sucedido
    } catch (error) {
      // Error is handled by the AuthContext
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="py-2 h-100 gradient-form">
      <div className="container py-2 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center mb-5">
                      <img
                        src="/removebg_Logo_WebSender_2k24.png"
                        style={{ width: "220px" }}
                        alt="WebSender Logo"
                      />
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <Label className="form-label" htmlFor="email">
                          E-mail:
                        </Label>
                        <Input
                          type="text"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          required
                        />
                        {emailError && (
                          <span
                            className="text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {emailError}
                          </span>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <Label className="form-label" htmlFor="password">
                          Senha:
                        </Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {error && (
                          <span
                            className="text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {error}
                          </span>
                        )}
                      </div>

                      <div className="text-center pt-1 mb-4 pb-1">
                        <Button
                          className="btn btn-primary fa-lg mb-3"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processando..." : "Entrar"}
                        </Button>
                        <div className="text-center">
                          <a className="text-muted" href="/forgot-password">
                            Esqueceu a senha?
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white p-md-4 mx-md-4">
                    <h4 className="contact-title">
                      Não tem login?<br />Entre em contato!
                    </h4>
                    <p className="small mb-0">
                      • Plataforma de leads qualificados, com amplas áreas
                      (CNAES) para o usuário.<br /><br />
                      
                      • Todos os meses disponibilizamos novos CNPJ's
                      abertos.<br /><br />
                      
                      • + de 40mil leads disponibilizados para a sua
                      utilização, seja para disparos ou para prospecção manual.
                      <br /><br />
                      
                      <strong>Ficou interessado(a)? Entre em contato!</strong><br /><br />
                      
                      <a
                        className="number-whatsapp"
                        href="http://wa.me/553284591423?text=Vim%20do%20site%20SuperLead%20PRO%20e%20desejo%20saber%20mais%20sobre%20a%20ferramenta!"
                      >
                        (32) 98459-1423
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
