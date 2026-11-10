import React, { useState } from 'react';
import { Member, Routine, RoutineGoal } from '../types';
import {
  Dumbbell,
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { clsx } from 'clsx';
import { ExerciseAnimator } from './ExerciseAnimator';

interface MemberPortalProps {
  members: Member[];
  routines: Routine[];
}

const GOAL_BADGES: Record<RoutineGoal, { label: string; color: string; icon: any }> = {
  HIPERTROFIA: { label: 'Masa Muscular', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Dumbbell },
  DEFINICION: { label: 'Definición', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: Flame },
  FUERZA: { label: 'Fuerza', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Trophy },
  FUNCIONAL: { label: 'Funcional', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Zap },
};

export function MemberPortal({ members, routines }: MemberPortalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [previewRoutineId, setPreviewRoutineId] = useState<string | null>(null);
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
    <div className="p-6 sm:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Sleek Compact Top Selector Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-slate-700">Vista App Socio</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMemberId}
            onChange={e => {
              setSelectedMemberId(e.target.value);
              setPreviewRoutineId(null);
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>
                Socio: {m.name}
              </option>
            ))}
          </select>

          <select
            value={previewRoutineId || currentMember?.assignedRoutineId || routines[0]?.id}
            onChange={e => setPreviewRoutineId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-500"
          >
            {routines.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Athlete Workout Screen */}
      {assignedRoutine && (
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          {/* Minimal Workout Header */}
          <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={clsx(
                    'text-[11px] font-bold px-2.5 py-0.5 rounded-full border',
                    GOAL_BADGES[assignedRoutine.goal].color
                  )}
                >
                  {GOAL_BADGES[assignedRoutine.goal].label}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  • {assignedRoutine.daysPerWeek} días/sem
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {assignedRoutine.name}
              </h3>
            </div>

            {/* Compact Progress Pill */}
            <div className="flex items-center gap-4 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800 min-w-[200px]">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400">Progreso</span>
                  <span className="text-blue-400">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clean Visual Exercise Cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedRoutine.exercises.map((ex, index) => {
              const doneSets = completedSets[ex.id] || [];
              const allSetsDone = doneSets.length === ex.sets;

              return (
                <div
                  key={ex.id}
                  className={clsx(
                    'rounded-2xl border p-4 flex flex-col justify-between gap-4 transition-all',
                    allSetsDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <ExerciseAnimator
                      type={ex.animationType}
                      speed={ex.animationSpeed}
                      imageUrl={ex.imageUrl}
                      customFrames={ex.customFrames}
                      size="md"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        #{index + 1} • {ex.muscleGroup}
                      </span>
                      <h4 className="text-base font-bold text-white truncate mt-0.5">
                        {ex.name}
                      </h4>

                      {/* Visual Metrics Row */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="bg-slate-800 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg border border-slate-700">
                          {ex.sets} × {ex.reps}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {ex.restSeconds}s
                        </span>
                      </div>

                      {ex.notes && (
                        <p className="text-[11px] text-slate-400 truncate mt-2">
                          {ex.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Minimalist Numbered Set Buttons */}
                  <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/70">
                    <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">
                      Series:
                    </span>
                    {Array.from({ length: ex.sets }).map((_, setIdx) => {
                      const setNum = setIdx + 1;
                      const isDone = doneSets.includes(setNum);
                      return (
                        <button
                          key={setNum}
                          type="button"
                          onClick={() => toggleSetCompletion(ex.id, setNum)}
                          className={clsx(
                            'flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer',
                            isDone
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
                          )}
                        >
                          {isDone && <CheckCircle2 className="w-3 h-3" />}
                          S{setNum}
                        </button>
                      );
                    })}
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
