import React, { useState } from 'react';
import { Member, Plan, Routine } from '../types';
import { X, CheckCircle2, RefreshCw, Phone, Mail, Fingerprint, Activity, Clock, Dumbbell, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { format, subDays } from 'date-fns';

interface MemberDetailDrawerProps {
  member: Member | null;
  isOpen: boolean;
  plans: Plan[];
  routines: Routine[];
  onClose: () => void;
  onRenewMembership: (memberId: string) => void;
  onAssignRoutine: (memberId: string, routineId: string) => void;
  onOpenWhatsapp: (member: Member) => void;
  onOpenPortalForMember: () => void;
}

export function MemberDetailDrawer({
  member,
  isOpen,
  plans,
  routines,
  onClose,
  onRenewMembership,
  onAssignRoutine,
  onOpenWhatsapp,
  onOpenPortalForMember,
}: MemberDetailDrawerProps) {
  const [renewing, setRenewing] = useState(false);

  if (!isOpen || !member) return null;

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => {
      onRenewMembership(member.id);
      setRenewing(false);
    }, 600);
  };

  // Find the plan object to show the correct price, fallback to first plan if not found.
  const currentPlan = plans.find(p => p.id === member.planId || p.name === member.planName) || plans[0];

  // Generate last 14 days attendance heat tiles
  const today = new Date();
  const last14Days = Array.from({ length: 14 }).map((_, index) => {
    const day = subDays(today, 13 - index);
    const dateStr = format(day, 'yyyy-MM-dd');
    const attended = member.attendancesHistory?.includes(dateStr);
    return {
      date: dateStr,
      dayLabel: format(day, 'dd/MM'),
      dayOfWeek: format(day, 'EEE'),
      attended,
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ficha del Socio</span>
            <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status and Fast Renew Card */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Estado de Membresía</p>
                <div className="mt-1">
                  <span className={clsx(
                    'px-3 py-1 text-xs font-bold rounded-full border',
                    member.status === 'ACTIVE' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    member.status === 'EXPIRING_SOON' && 'bg-amber-100 text-amber-700 border-amber-200',
                    member.status === 'EXPIRED' && 'bg-rose-100 text-rose-700 border-rose-200'
                  )}>
                    {member.status === 'ACTIVE' ? 'Activo' : member.status === 'EXPIRING_SOON' ? 'Próximo a Vencer' : 'Vencido'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Vence el</p>
                <p className="text-sm font-bold text-slate-900">{member.membershipExpiry}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Plan contratado</p>
                <p className="text-sm font-semibold text-slate-800">{member.planName || 'Pase Libre Musculación'}</p>
              </div>
              <button
                type="button"
                onClick={handleRenew}
                disabled={renewing}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className={clsx('w-3.5 h-3.5', renewing && 'animate-spin')} />
                {renewing ? 'Renovando...' : 'Renovar Cuota (+30d)'}
              </button>
            </div>
          </div>

          {/* Assigned Training Routine Card */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-blue-600" />
                Rutina de Entrenamiento Asignada
              </h4>
              <button
                type="button"
                onClick={onOpenPortalForMember}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Ver en App Socio
              </button>
            </div>
            <select
              value={member.assignedRoutineId || ''}
              onChange={(e) => onAssignRoutine(member.id, e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Sin rutina asignada --</option>
              {routines.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.goal})
                </option>
              ))}
            </select>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Información de Contacto</h4>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
                <button
                  onClick={() => onOpenWhatsapp(member)}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  WhatsApp
                </button>
              </div>
              <div className="p-3 flex items-center gap-2.5 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="p-3 flex items-center gap-2.5 text-sm text-slate-700">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <span>Huella Digital ID: <strong className="text-slate-900">{member.fingerprintId || 'No asignada'}</strong></span>
              </div>
            </div>
          </div>

          {/* Attendance Heat Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Seguimiento de Asistencias
              </h4>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {member.totalAttendances} días totales
              </span>
            </div>

            <p className="text-xs text-slate-500">Frecuencia en los últimos 14 días:</p>

            <div className="grid grid-cols-7 gap-1.5">
              {last14Days.map((d, i) => (
                <div
                  key={i}
                  title={`${d.date}: ${d.attended ? 'Asistió' : 'Ausente'}`}
                  className={clsx(
                    'p-2 rounded-xl flex flex-col items-center justify-center border text-center transition-all',
                    d.attended 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  )}
                >
                  <span className="text-[10px] uppercase font-bold">{d.dayOfWeek}</span>
                  <span className="text-[11px] font-semibold">{d.dayLabel}</span>
                  <div className="mt-1">
                    {d.attended ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="block w-1.5 h-1.5 rounded-full bg-slate-300 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Historial de Pagos
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Pago de Cuota</p>
                  <p className="text-slate-500">Última renovación registrada</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${currentPlan?.price.toLocaleString('es-AR')}</p>
                  <p className="text-emerald-600 font-medium">Acreditado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
