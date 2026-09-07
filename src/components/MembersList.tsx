import React, { useState } from 'react';
import { Member } from '../types';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface MembersListProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onOpenWhatsapp: (member: Member) => void;
  onOpenNewMember: () => void;
}

export function MembersList({
  members,
  onSelectMember,
  onOpenWhatsapp,
  onOpenNewMember,
}: MembersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredMembers = members.filter(m => 
    (filterStatus === 'ALL' || m.status === filterStatus) &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Socios</h2>
          <p className="text-slate-500 mt-1">Registra pagos, asocia huellas y revisa vencimientos.</p>
        </div>
        <button 
          onClick={onOpenNewMember}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Socio
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            {['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  filterStatus === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {st === 'ALL' ? 'Todos' : st === 'ACTIVE' ? 'Activos' : st === 'EXPIRING_SOON' ? 'Por Vencer' : 'Vencidos'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No se encontraron socios</div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-6 py-4 font-semibold">Socio</th>
                <th className="px-6 py-4 font-semibold">Vencimiento</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Asistencias</th>
                <th className="px-6 py-4 font-semibold">Teléfono</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col cursor-pointer group" onClick={() => onSelectMember(member)}>
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</span>
                      <span className="text-xs text-slate-500">{member.planName || 'Pase Libre'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {member.membershipExpiry}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.totalAttendances} días
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onOpenWhatsapp(member); }}
                        className={clsx(
                          "p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer",
                          member.status === 'EXPIRING_SOON' 
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200" 
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                        )}
                        title="Enviar mensaje por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectMember(member); }}
                        className="text-xs font-semibold text-blue-700 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        Ver perfil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    EXPIRING_SOON: "bg-amber-100 text-amber-700 border-amber-200 animate-pulse",
    EXPIRED: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const labels = {
    ACTIVE: "Activo",
    EXPIRING_SOON: "Pronto a vencer",
    EXPIRED: "Vencido",
  };

  return (
    <span className={clsx("px-3 py-1 text-xs font-bold rounded-full border", styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700 border-slate-200")}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}
