import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockMonthlyStats } from '../data/mockData';
import { Member } from '../types';
import { Users, TrendingUp, AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardProps {
  members: Member[];
  dailySalesIncome: number;
  onOpenPos: () => void;
  onSelectMember: (member: Member) => void;
  onOpenWhatsapp: (member: Member) => void;
}

export function Dashboard({
  members,
  dailySalesIncome,
  onOpenPos,
  onSelectMember,
  onOpenWhatsapp,
}: DashboardProps) {
  const expiringList = members.filter(m => m.status === 'EXPIRING_SOON');
  const expiringMembersCount = expiringList.length;
  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">Resumen general en tiempo real del estado del gimnasio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Socios Activos" 
          value={activeMembersCount.toString()} 
          icon={Users} 
          trend="+12% este mes" 
        />
        <StatCard 
          title="Ingresos del Mes" 
          value={`$${(610000 + dailySalesIncome).toLocaleString('es-AR')}`} 
          icon={TrendingUp} 
          trend={dailySalesIncome > 0 ? `+$${dailySalesIncome.toLocaleString('es-AR')} en ventas hoy` : "+8% vs mes anterior"} 
        />
        <StatCard 
          title="Cuotas por Vencer" 
          value={expiringMembersCount.toString()} 
          icon={AlertCircle} 
          trend="Próximos 5 días" 
          alert
        />
        <StatCard 
          title="Asistencias Hoy" 
          value="142" 
          icon={CheckCircle2} 
          trend="Pico usual: 18:00hs" 
        />
      </div>

      {/* Proactive Expiring Members Section */}
      {expiringList.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Socios con cuota por vencer en los próximos días</h3>
                <p className="text-xs text-slate-600">Envíales un recordatorio por WhatsApp en un clic antes de que expire su membresía.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expiringList.map((m) => (
              <div key={m.id} className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-bold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">Vence: <strong className="text-amber-700">{m.membershipExpiry}</strong></p>
                </div>
                <button
                  onClick={() => onOpenWhatsapp(m)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Evolución de Ingresos</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value}`, 'Ingresos']}
              />
              <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, alert }: { title: string, value: string, icon: any, trend: string, alert?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={clsx("text-sm font-medium", alert ? "text-amber-600" : "text-emerald-600")}>
          {trend}
        </span>
      </div>
    </div>
  );
}
