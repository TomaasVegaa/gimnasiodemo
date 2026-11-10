import React, { useState } from 'react';
import { Routine, RoutineGoal, Member, CatalogExercise } from '../types';
import {
  Dumbbell,
  Plus,
  Edit2,
  Trash2,
  Flame,
  Zap,
  Trophy,
  Users,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { ExerciseAnimator } from './ExerciseAnimator';

interface RoutinesManagementProps {
  routines: Routine[];
  members: Member[];
  exerciseCatalog: CatalogExercise[];
  onAddRoutine: () => void;
  onEditRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
  onAddCatalogExercise: () => void;
  onEditCatalogExercise: (ex: CatalogExercise) => void;
  onDeleteCatalogExercise: (id: string) => void;
  onOpenPortal: () => void;
}

const GOAL_META: Record<
  RoutineGoal,
  { label: string; badgeClass: string; icon: any }
> = {
  HIPERTROFIA: {
    label: 'Masa Muscular',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Dumbbell,
  },
  DEFINICION: {
    label: 'Definición',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Flame,
  },
  FUERZA: {
    label: 'Fuerza',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Trophy,
  },
  FUNCIONAL: {
    label: 'Funcional',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Zap,
  },
};

export function RoutinesManagement({
  routines,
  members,
  exerciseCatalog,
  onAddRoutine,
  onEditRoutine,
  onDeleteRoutine,
  onAddCatalogExercise,
  onEditCatalogExercise,
  onDeleteCatalogExercise,
  onOpenPortal,
}: RoutinesManagementProps) {
  const [subTab, setSubTab] = useState<'ROUTINES' | 'EXERCISES'>('ROUTINES');
  const [selectedGoal, setSelectedGoal] = useState<RoutineGoal | 'ALL'>('ALL');

  const filteredRoutines =
    selectedGoal === 'ALL'
      ? routines
      : routines.filter(r => r.goal === selectedGoal);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Clean Minimal Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rutinas</h2>
          <div className="flex p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setSubTab('ROUTINES')}
              className={clsx(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                subTab === 'ROUTINES'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Planes ({routines.length})
            </button>
            <button
              onClick={() => setSubTab('EXERCISES')}
              className={clsx(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                subTab === 'EXERCISES'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Ejercicios ({exerciseCatalog.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPortal}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-blue-600" />
            App Socio
          </button>
          <button
            onClick={onAddCatalogExercise}
            className="bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> + Ejercicio
          </button>
          <button
            onClick={onAddRoutine}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nueva Rutina
          </button>
        </div>
      </header>

      {subTab === 'ROUTINES' ? (
        <>
          {/* Compact Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedGoal('ALL')}
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                selectedGoal === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Todas
            </button>
            {(['HIPERTROFIA', 'DEFINICION', 'FUERZA', 'FUNCIONAL'] as RoutineGoal[]).map(
              goalKey => {
                const meta = GOAL_META[goalKey];
                const Icon = meta.icon;
                return (
                  <button
                    key={goalKey}
                    onClick={() => setSelectedGoal(goalKey)}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border',
                      selectedGoal === goalKey
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {meta.label}
                  </button>
                );
              }
            )}
          </div>

          {/* Clean Routines Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredRoutines.map(routine => {
              const meta = GOAL_META[routine.goal];
              const GoalIcon = meta.icon;
              const assignedCount = members.filter(
                m => m.assignedRoutineId === routine.id
              ).length;

              return (
                <div
                  key={routine.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col overflow-hidden"
                >
                  {/* Compact Card Header */}
                  <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={clsx(
                            'text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1',
                            meta.badgeClass
                          )}
                        >
                          <GoalIcon className="w-3 h-3" />
                          {meta.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {routine.daysPerWeek}d/sem • {routine.level}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {routine.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1 mr-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {assignedCount}
                      </span>
                      <button
                        onClick={() => onEditRoutine(routine)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRoutine(routine.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Exercises List */}
                  <div className="p-4 space-y-2 flex-1 bg-slate-50/40">
                    {routine.exercises.map(ex => (
                      <div
                        key={ex.id}
                        className="p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-center gap-3"
                      >
                        <ExerciseAnimator
                          type={ex.animationType}
                          speed={ex.animationSpeed}
                          imageUrl={ex.imageUrl}
                          customFrames={ex.customFrames}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{ex.name}</p>
                          <span className="text-[11px] font-medium text-slate-400">
                            {ex.muscleGroup} • {ex.restSeconds}s descanso
                          </span>
                        </div>
                        <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shrink-0">
                          {ex.sets} × {ex.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* SUBTAB 2: CLEAN EXERCISE & ANIMATION GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exerciseCatalog.map(item => (
            <div
              key={item.id}
              onClick={() => onEditCatalogExercise(item)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-4 hover:border-blue-400 transition-all cursor-pointer group"
            >
              <ExerciseAnimator
                type={item.animationType}
                speed={item.animationSpeed}
                imageUrl={item.imageUrl}
                customFrames={item.customFrames}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {item.muscleGroup}
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {item.name}
                </h4>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {item.defaultSets} × {item.defaultReps}
                </p>
                <div className="mt-2 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <span className="text-[11px] font-bold text-blue-600">Editar</span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteCatalogExercise(item.id);
                    }}
                    className="ml-auto p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
