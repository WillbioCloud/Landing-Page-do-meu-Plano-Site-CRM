import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign,
  LayoutDashboard,
  KanbanSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ArrowUpRight
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animação de Entrada Premium
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Anima o Header
      gsap.fromTo(".dash-header", 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Anima os Cards com Stagger (Efeito Cascata)
      gsap.fromTo(".stat-card",
        { y: 30, opacity: 0, scale: 0.95 },
        { 
          y: 0, opacity: 1, scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.2)",
          delay: 0.2
        }
      );

      // Anima a tabela/área de conteúdo principal
      gsap.fromTo(".content-area",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out" }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    // Futuramente aqui chamaremos o supabase.auth.signOut()
    navigate('/');
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-brand-500 selection:text-white">
      
      {/* MENU LATERAL (SIDEBAR) - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0a] fixed h-full z-40">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <span className="font-bold text-xl tracking-tight">Elevatio<span className="text-brand-500">Vendas</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2 px-3">Principal</div>
          
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-brand-500/10 text-brand-400 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <KanbanSquare className="w-5 h-5" /> CRM Kanban
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Building2 className="w-5 h-5" /> Imóveis
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Users className="w-5 h-5" /> Corretores
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 px-3">Sistema</div>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Settings className="w-5 h-5" /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* MENU MOBILE (OVERLAY) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm flex justify-end">
          <div className="w-64 bg-[#0a0a0a] h-full border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <span className="font-bold text-xl tracking-tight">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
               <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-brand-500/10 text-brand-400 font-medium"><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
               <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white"><KanbanSquare className="w-5 h-5" /> Kanban</button>
               <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 mt-auto"><LogOut className="w-5 h-5" /> Sair</button>
            </nav>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Topbar */}
        <header className="dash-header h-20 px-6 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center bg-[#111] border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-brand-500/50 transition-colors">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input type="text" placeholder="Buscar leads, imóveis..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-700 flex items-center justify-center font-bold text-sm border border-white/20 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              RM
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          
          <div className="dash-header mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Olá, <span className="text-white">Rafael Martins</span> 👋</h1>
            <p className="text-gray-400 text-sm">Aqui está o resumo da sua imobiliária hoje.</p>
          </div>

          {/* Grid de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            
            <div className="stat-card bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-brand-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                  +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <div className="text-gray-400 text-sm font-medium mb-1">Imóveis Ativos</div>
              <div className="text-3xl font-bold">142</div>
            </div>

            <div className="stat-card bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                  +5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <div className="text-gray-400 text-sm font-medium mb-1">Leads no Funil</div>
              <div className="text-3xl font-bold">84</div>
            </div>

            <div className="stat-card bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-gray-400 text-sm font-medium mb-1">Taxa de Conversão</div>
              <div className="text-3xl font-bold">4.2%</div>
            </div>

            <div className="stat-card bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                  +22% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <div className="text-gray-400 text-sm font-medium mb-1">VGC no Mês</div>
              <div className="text-3xl font-bold text-white">R$ 2.4M</div>
            </div>

          </div>

          {/* Área de Conteúdo Inferior (Mockup do Kanban) */}
          <div className="content-area bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-96 flex flex-col items-center justify-center text-center relative overflow-hidden">
             {/* Brilho de fundo */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
             
             <KanbanSquare className="w-16 h-16 text-white/10 mb-4" />
             <h3 className="text-xl font-bold mb-2">O seu Funil de Vendas</h3>
             <p className="text-gray-400 text-sm max-w-md">
               A sua conta foi criada com sucesso e está no período de Trial de 7 dias! 
               A arquitetura do Kanban Magnético será injetada aqui na próxima fase.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}