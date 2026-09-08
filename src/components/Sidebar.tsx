import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Fingerprint, ShoppingCart, UserCheck, Wallet, ClipboardList } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPos: () => void;
  activeExpiringCount: number;
}

const navItems: { id: string; label: string; icon: any; countKey?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cashregister', label: 'Caja', icon: Wallet },
  { id: 'members', label: 'Socios', icon: Users, countKey: 'expiring' },
  { id: 'plans', label: 'Planes', icon: ClipboardList },
  { id: 'inventory', label: 'Inventario', icon: ShoppingBag },
  { id: 'access', label: 'Control de Acceso', icon: Fingerprint },
];

export function Sidebar({ activeTab, setActiveTab, onOpenPos, activeExpiringCount }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-lg text-white">G</span>
          </div>
          GymFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer',
              activeTab === item.id
                ? 'bg-blue-600/10 text-blue-500'
                : 'hover:bg-slate-800 hover:text-white'
            )}
          >
            <item.icon className={clsx("w-5 h-5", activeTab === item.id ? "text-blue-500" : "text-slate-400")} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === 'members' && activeExpiringCount > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeExpiringCount}
              </span>
            )}
          </button>
        ))}

        {/* Fast Action POS Button */}
        <div className="pt-4 px-1">
          <button
            onClick={onOpenPos}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Venta Mostrador
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold">
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@gymflow.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
