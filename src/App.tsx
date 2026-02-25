import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign,
  PieChart as PieChartIcon,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Simulado Shadcn */}
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Performance</h2>
          <p className="text-gray-400">Visualize as métricas da sua imobiliária em tempo real.</p>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Receita Total", value: "R$ 45.231,89", icon: DollarSign, trend: "+20.1%" },
            { label: "Novos Leads", value: "+2350", icon: Users, trend: "+180.1%" },
            { label: "Vendas", value: "+12.234", icon: Building2, trend: "+19%" },
            { label: "Ativos", value: "+573", icon: TrendingUp, trend: "+201 desde ontem" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-card p-6 shadow-sm bg-[#111]">
              <div className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-brand-400 mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Gráficos e Atividades */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico de Vendas (Simulado) */}
          <div className="col-span-4 rounded-xl border border-white/10 bg-[#111] p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-brand-500" /> Visão Geral de Vendas
            </h3>
            <div className="h-[300px] flex items-end justify-between gap-2 px-2">
              {[40, 70, 45, 90, 65, 55, 80, 95, 40, 60, 85, 75].map((height, i) => (
                <div key={i} className="w-full bg-brand-600/20 hover:bg-brand-500 rounded-t-sm transition-all duration-500 relative group" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono">
              <span>JAN</span><span>MAR</span><span>MAI</span><span>JUL</span><span>SET</span><span>DEZ</span>
            </div>
          </div>

          {/* Leads Recentes */}
          <div className="col-span-3 rounded-xl border border-white/10 bg-[#111] p-6">
            <h3 className="font-semibold mb-6">Leads Recentes</h3>
            <div className="space-y-6">
              {[
                { name: "Guilherme Silva", email: "gui@email.com", amount: "R$ 1.999,00" },
                { name: "Ana Souza", email: "ana.s@email.com", amount: "R$ 39,00" },
                { name: "Roberto Junior", email: "robert@email.com", amount: "R$ 299,00" },
                { name: "Clara Luz", email: "clara@email.com", amount: "R$ 99,00" },
              ].map((lead, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-brand-900 flex items-center justify-center text-xs font-bold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                  <div className="font-medium text-sm text-brand-400">{lead.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}