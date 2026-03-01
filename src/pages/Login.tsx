import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, Building2, Palette, UserCircle, 
  CheckCircle, Sparkles, MonitorSmartphone, Crown, PenTool, Loader2, LogIn
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // O NOSSO NOVO INTERRUPTOR: Modo Login vs Modo Registo (Onboarding)
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Estados do Formulário
  const selectedPlan = location.state?.plan || 'professional';
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    template: '',
    fullName: '',
    email: '',
    password: '',
    document: '' 
  });

  // Animação de transição suave ao trocar de passos ou ao alternar para Login
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".anim-content", 
        { opacity: 0, x: 30 }, 
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [step, isLoginMode]);

  const handleNext = () => {
    if (step === 1 && !formData.companyName) return;
    if (step === 2 && !formData.template) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  // ==========================================
  // MOTOR 1: FAZER LOGIN (CLIENTE EXISTENTE)
  // ==========================================
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) throw new Error("Chaves do servidor em falta.");

      const supabase = createClient(supabaseUrl, anonKey);

      // Tenta entrar com o email e senha
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error("E-mail ou senha incorretos.");
      }

      if (data.user) {
        // Sucesso! Vai para o painel de controlo.
        navigate('/dashboard');
      }

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // MOTOR 2: CRIAR CONTA (NOVO CLIENTE)
  // ==========================================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) throw new Error("Chaves do servidor em falta.");

      const supabase = createClient(supabaseUrl, anonKey);

      // 1. Criar Utilizador
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } }
      });

      if (authError) throw new Error(`Erro ao criar conta: ${authError.message}`);

      const userToken = authData.session?.access_token;
      if (!userToken) throw new Error("Sessão não iniciada. Tente fazer login.");

      // 2. Chamar a Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/create-asaas-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          cpfCnpj: formData.document,
          companyName: formData.companyName, 
          plan_name: selectedPlan,
          template: formData.template 
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro financeiro.");

      // 3. Sucesso!
      if (data.success) {
        navigate('/dashboard');
      }

    } catch (error: any) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-brand-500 selection:text-white" ref={containerRef}>
      
      {/* Navbar Minimalista */}
      <nav className="w-full px-8 h-24 flex items-center justify-between border-b border-white/5 absolute top-0 z-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="font-bold text-2xl tracking-tight">Elevatio<span className="text-brand-500">Vendas</span></span>
        </button>
        <div className="text-sm font-medium text-gray-400 hidden sm:block">
          {isLoginMode ? (
            <>Novo por aqui? <button onClick={() => setIsLoginMode(false)} className="text-brand-400 hover:text-brand-300 ml-1 font-bold">Criar uma conta</button></>
          ) : (
            <>Já tem uma conta? <button onClick={() => setIsLoginMode(true)} className="text-brand-400 hover:text-brand-300 ml-1 font-bold">Fazer Login</button></>
          )}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative min-h-[400px]">
          
          {/* ========================================================= */}
          {/* TELA DE LOGIN (CLIENTE EXISTENTE) */}
          {/* ========================================================= */}
          {isLoginMode ? (
            <div className="anim-content max-w-md mx-auto mt-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-400">
                  <LogIn className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta</h2>
                <p className="text-gray-400">Insira as suas credenciais para aceder ao CRM.</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-all" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">Senha</label>
                    <button type="button" className="text-xs text-brand-400 hover:text-brand-300">Esqueceu a senha?</button>
                  </div>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-all" />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {errorMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-70 text-white rounded-xl px-6 py-4 mt-6 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                >
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Entrando...</> : 'Entrar no Sistema'}
                </button>
              </form>
              
              <div className="mt-8 text-center sm:hidden text-sm text-gray-400">
                Novo por aqui? <button onClick={() => setIsLoginMode(false)} className="text-brand-400 font-bold ml-1">Criar conta</button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* TELA DE REGISTO (ONBOARDING) - 3 PASSOS */
            /* ========================================================= */
            <div className="anim-content">
              {/* Indicador de Progresso (Onboarding) */}
              <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full -z-10"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 rounded-full -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                
                {[
                  { num: 1, icon: Building2, label: "Identidade" },
                  { num: 2, icon: Palette, label: "Design" },
                  { num: 3, icon: UserCircle, label: "Conta" }
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-[#0a0a0a] ${step >= s.num ? 'border-brand-500 text-brand-400' : 'border-white/10 text-gray-500'}`}>
                      {step > s.num ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider hidden sm:block ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* PASSO 1: Nome da Empresa */}
              {step === 1 && (
                <div className="anim-content">
                  <h2 className="text-3xl font-bold mb-3">Como se chama a sua imobiliária?</h2>
                  <p className="text-gray-400 mb-8">Vamos personalizar a sua experiência a partir daqui.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <input 
                        type="text" 
                        autoFocus
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-lg"
                        placeholder="Ex: TR Imóveis Premium"
                      />
                    </div>
                    {formData.companyName && (
                      <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-brand-200">
                          Ótimo nome! O seu domínio temporário será: <br/>
                          <strong className="font-mono text-white mt-1 block">
                            {formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.elevatiovendas.com
                          </strong>
                        </p>
                      </div>
                    )}
                    <button onClick={handleNext} disabled={!formData.companyName} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl px-6 py-4 font-bold transition-all flex items-center justify-center gap-2 mt-8">
                      Continuar <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 2: A Escolha do Template */}
              {step === 2 && (
                <div className="anim-content">
                  <h2 className="text-3xl font-bold mb-3">Escolha a cara do seu negócio</h2>
                  <p className="text-gray-400 mb-8">Pode escolher um modelo pronto ou solicitar um design exclusivo.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => setFormData({...formData, template: 'minimalista'})} className={`text-left p-6 rounded-2xl border transition-all duration-300 ${formData.template === 'minimalista' ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-[#111] hover:border-white/30'}`}>
                      <MonitorSmartphone className={`w-8 h-8 mb-4 ${formData.template === 'minimalista' ? 'text-brand-400' : 'text-gray-400'}`} />
                      <h3 className="text-lg font-bold mb-1">Minimalista</h3>
                      <p className="text-sm text-gray-400">Foco nas fotos dos imóveis com fundo claro.</p>
                    </button>
                    <button onClick={() => setFormData({...formData, template: 'luxo'})} className={`text-left p-6 rounded-2xl border transition-all duration-300 ${formData.template === 'luxo' ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-[#111] hover:border-white/30'}`}>
                      <Crown className={`w-8 h-8 mb-4 ${formData.template === 'luxo' ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <h3 className="text-lg font-bold mb-1">Padrão Luxo</h3>
                      <p className="text-sm text-gray-400">Tema escuro, detalhes dourados e elegância.</p>
                    </button>
                    <button onClick={() => setFormData({...formData, template: 'sob-medida'})} className={`text-left p-6 rounded-2xl border transition-all duration-300 sm:col-span-2 relative overflow-hidden ${formData.template === 'sob-medida' ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-[#111] hover:border-white/30'}`}>
                      <div className="absolute top-0 right-0 bg-white/10 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Prazo: 7 a 15 dias</div>
                      <div className="flex items-center gap-4">
                        <PenTool className={`w-8 h-8 ${formData.template === 'sob-medida' ? 'text-brand-400' : 'text-gray-400'}`} />
                        <div>
                          <h3 className="text-lg font-bold mb-1">Sob Medida (Agência)</h3>
                          <p className="text-sm text-gray-400">Nossa equipa desenha um portal 100% exclusivo.</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 font-semibold transition-colors">Voltar</button>
                    <button onClick={handleNext} disabled={!formData.template} className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl px-6 py-4 font-bold flex items-center justify-center gap-2">
                      Continuar <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 3: Conta e Pagamento */}
              {step === 3 && (
                <div className="anim-content">
                  <h2 className="text-3xl font-bold mb-3">Quase lá!</h2>
                  <p className="text-gray-400 mb-8">Crie o seu acesso de Administrador para liberar o sistema.</p>
                  
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Seu Nome Completo</label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">E-mail Profissional</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">CPF ou CNPJ</label>
                        <input type="text" required value={formData.document} onChange={(e) => setFormData({...formData, document: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Senha Segura</label>
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
                    </div>

                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex gap-4 mt-8 pt-4">
                      <button type="button" onClick={handleBack} disabled={isLoading} className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 font-semibold disabled:opacity-50">Voltar</button>
                      <button type="submit" disabled={isLoading} className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-70 text-white rounded-xl px-6 py-4 font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : <>Entrar no Sistema <ArrowRight className="w-5 h-5" /></>}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}