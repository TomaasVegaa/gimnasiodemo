import React, { useState } from 'react';
import { Member, Routine, RoutineGoal } from '../types';
import {
  Smartphone,
  Dumbbell,
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  Info,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { ExerciseAnimator } from './ExerciseAnimator';

interface MemberPortalProps {
  members: Member[];
  routines: Routine[];
}

const GOAL_BADGES: Record<RoutineGoal, { label: string; color: string; icon: any }> = {
  HIPERTROFIA: { label: 'Subir Masa Muscular', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Dumbbell },
  DEFINICION: { label: 'Definición Muscular', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: Flame },
  FUERZA: { label: 'Fuerza y Potencia', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Trophy },
  FUNCIONAL: { label: 'Funcional & Salud', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Zap },
};

export function MemberPortal({ members, routines }: MemberPortalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [previewRoutineId, setPreviewRoutineId] = useState<string | null>(null);
  // Track completed sets per exercise ID: { [exerciseId]: number[] }
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});

  const currentMember = members.find(m => m.id === selectedMemberId) || members[0];
  const assignedRoutine =
    routines.find(r => r.id === (previewRoutineId || currentMember?.assignedRoutineId)) ||
    routines[0];

  const toggleSetCompletion = (exerciseId: string, setNumber: number) => {
    setCompletedSets(prev => {
      const current = prev[exerciseId] || [];
      const exists = current.includes(setNumber);
      return {
        ...prev,
        [exerciseId]: exists
          ? current.filter(s => s !== setNumber)
          : [...current, setNumber],
      };
    });
  };

  const totalSetsInRoutine = assignedRoutine
    ? assignedRoutine.exercises.reduce((acc, ex) => acc + ex.sets, 0)
    : 0;

  const completedSetsInRoutine = assignedRoutine
    ? assignedRoutine.exercises.reduce(
        (acc, ex) => acc + (completedSets[ex.id]?.length || 0),
        0
      )
    : 0;

  const progressPct =
    totalSetsInRoutine > 0
      ? Math.round((completedSetsInRoutine / totalSetsInRoutine) * 100)
      : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Top Controls Bar for Demo Presenter */}
      <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Vista del Socio (Portal Móvil / Totem del Gym)
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                En Vivo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Así ven los alumnos su rutina asignada en su celular al escanear el QR del gimnasio o ingresar con su DNI.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Simular como Socio:
            </label>
            <select
              value={selectedMemberId}
              onChange={e => {
                setSelectedMemberId(e.target.value);
                setPreviewRoutineId(null);
              }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.planName || 'Socio'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Explorar Objetivo / Rutina:
            </label>
            <select
              value={previewRoutineId || currentMember?.assignedRoutineId || routines[0]?.id}
              onChange={e => setPreviewRoutineId(e.target.value)}
              className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 focus:outline-none focus:border-blue-500"
            >
              {routines.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({GOAL_BADGES[r.goal].label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Athlete Experience Layout */}
      {assignedRoutine && (
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Athlete Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border-b border-slate-800 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Hola, {currentMember?.name.split(' ')[0]}
                </span>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border',
                    GOAL_BADGES[assignedRoutine.goal].color
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Objetivo: {GOAL_BADGES[assignedRoutine.goal].label}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {assignedRoutine.daysPerWeek} días x semana
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {assignedRoutine.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {assignedRoutine.description}
              </p>
            </div>

            {/* Live Workout Progress Widget */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 min-w-[240px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Progreso de Hoy
                </span>
                <span className="text-lg font-extrabold text-blue-400">{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {completedSetsInRoutine} de {totalSetsInRoutine} series completadas. Tocá cada serie al terminar.
              </p>
            </div>
          </div>

          {/* Interactive Animated Exercise Cards */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedRoutine.exercises.map((ex, index) => {
              const doneSets = completedSets[ex.id] || [];
              const allSetsDone = doneSets.length === ex.sets;

              return (
                <div
                  key={ex.id}
                  className={clsx(
                    'rounded-2xl border p-5 flex flex-col justify-between transition-all',
                    allSetsDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  )}
                >
                  <div>
                    <div className="flex items-start gap-4">
                      {/* Animated SVG / Image / Custom 2-Frame */}
                      <ExerciseAnimator
                        type={ex.animationType}
                        speed={ex.animationSpeed}
                        imageUrl={ex.imageUrl}
                        customFrames={ex.customFrames}
                        size="md"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                            Ejercicio #{index + 1} • {ex.muscleGroup}
                          </span>
                          {allSetsDone && (
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-white mt-1">{ex.name}</h4>

                        {/* Prescription Pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                            <span className="text-[10px] uppercase text-slate-400 block">
                              Series
                            </span>
                            <span className="text-sm font-extrabold text-white">
                              {ex.sets} series
                            </span>
                          </div>
                          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                            <span className="text-[10px] uppercase text-slate-400 block">
                              Repeticiones
                            </span>
                            <span className="text-sm font-extrabold text-blue-400">
                              {ex.reps}
                            </span>
                          </div>
                          <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                            <span className="text-[10px] uppercase text-slate-400 block">
                              Descanso
                            </span>
                            <span className="text-sm font-bold text-slate-200 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {ex.restSeconds}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {ex.notes && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-white">Tip técnico:</strong> {ex.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Set Checkboxes for the Member */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Marcar series realizadas:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const setNum = setIdx + 1;
                        const isDone = doneSets.includes(setNum);
                        return (
                          <button
                            key={setNum}
                            type="button"
                            onClick={() => toggleSetCompletion(ex.id, setNum)}
                            className={clsx(
                              'flex-1 min-w-[60px] py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                              isDone
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                            )}
                          >
                            <CheckCircle2
                              className={clsx(
                                'w-3.5 h-3.5',
                                isDone ? 'text-slate-950' : 'text-slate-600'
                              )}
                            />
                            Serie {setNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
