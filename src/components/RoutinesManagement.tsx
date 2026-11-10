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
  Clock,
  Users,
  Smartphone,
  Sparkles,
  BookOpen,
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
    label: 'Subir Masa Muscular',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Dumbbell,
  },
  DEFINICION: {
    label: 'Definición & Quema',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Flame,
  },
  FUERZA: {
    label: 'Fuerza & Potencia',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Trophy,
  },
  FUNCIONAL: {
    label: 'Funcional / Salud',
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
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Rutinas y Estudio de Animaciones
          </h2>
          <p className="text-slate-500 mt-1">
            Armá tus propios ejercicios animados y asignalos en planes según el objetivo del socio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenPortal}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-blue-400" />
            Ver App del Socio
          </button>
          <button
            onClick={onAddCatalogExercise}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Crear Ejercicio / Animación
          </button>
          <button
            onClick={onAddRoutine}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nueva Rutina
          </button>
        </div>
      </header>

      {/* Main Switcher: Routines vs Exercise & Animation Library */}
      <div className="flex gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setSubTab('ROUTINES')}
          className={clsx(
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
            subTab === 'ROUTINES'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Dumbbell className="w-4 h-4 text-blue-600" />
          Planes de Rutinas ({routines.length})
        </button>
        <button
          onClick={() => setSubTab('EXERCISES')}
          className={clsx(
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer',
            subTab === 'EXERCISES'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Biblioteca de Ejercicios & Creador de Animaciones ({exerciseCatalog.length})
        </button>
      </div>

      {subTab === 'ROUTINES' ? (
        <>
          {/* Filter Bar by Goal */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedGoal('ALL')}
              className={clsx(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                selectedGoal === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              Todos los Objetivos ({routines.length})
            </button>
            {(['HIPERTROFIA', 'DEFINICION', 'FUERZA', 'FUNCIONAL'] as RoutineGoal[]).map(
              goalKey => {
                const meta = GOAL_META[goalKey];
                const Icon = meta.icon;
                const count = routines.filter(r => r.goal === goalKey).length;
                return (
                  <button
                    key={goalKey}
                    onClick={() => setSelectedGoal(goalKey)}
                    className={clsx(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border',
                      selectedGoal === goalKey
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {meta.label} ({count})
                  </button>
                );
              }
            )}
          </div>

          {/* Routines Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRoutines.map(routine => {
              const meta = GOAL_META[routine.goal];
              const GoalIcon = meta.icon;
              const assignedCount = members.filter(
                m => m.assignedRoutineId === routine.id
              ).length;

              return (
                <div
                  key={routine.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={clsx(
                            'text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5',
                            meta.badgeClass
                          )}
                        >
                          <GoalIcon className="w-3.5 h-3.5" />
                          {meta.label}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          Nivel {routine.level}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {routine.daysPerWeek} días/sem
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{routine.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{routine.description}</p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onEditRoutine(routine)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        title="Editar Rutina"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRoutine(routine.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Eliminar Rutina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Exercises Preview List */}
                  <div className="p-6 space-y-3 flex-1 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      <span>Ejercicios ({routine.exercises.length})</span>
                      <span>Series x Reps</span>
                    </div>

                    {routine.exercises.map(ex => (
                      <div
                        key={ex.id}
                        className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-2xs"
                      >
                        <ExerciseAnimator
                          type={ex.animationType}
                          speed={ex.animationSpeed}
                          imageUrl={ex.imageUrl}
                          customFrames={ex.customFrames}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            {ex.muscleGroup}
                          </span>
                          <p className="text-sm font-bold text-slate-900 truncate">{ex.name}</p>
                          {ex.notes && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">{ex.notes}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            {ex.sets} x {ex.reps}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" /> {ex.restSeconds}s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-blue-600" />
                      {assignedCount} {assignedCount === 1 ? 'socio asignado' : 'socios asignados'}
                    </span>
                    <button
                      onClick={() => onEditRoutine(routine)}
                      className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                    >
                      Configurar ejercicios →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* SUBTAB 2: EXERCISE & ANIMATION CATALOG */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Catálogo Reutilizable del Gimnasio
              </span>
              <h3 className="text-xl font-bold">
                Creá tus propios Ejercicios con Animación 2D, GIF o Doble Foto
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Todo ejercicio que guardes acá queda disponible para insertarlo con 1 clic dentro de cualquier rutina. Podés elegir entre las 14 figuras biomecánicas, ajustar su velocidad o subir 2 fotos para que el sistema las anime solas.
              </p>
            </div>
            <button
              onClick={onAddCatalogExercise}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" /> + Crear Nuevo Ejercicio Animado
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exerciseCatalog.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <ExerciseAnimator
                    type={item.animationType}
                    speed={item.animationSpeed}
                    imageUrl={item.imageUrl}
                    customFrames={item.customFrames}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {item.muscleGroup}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditCatalogExercise(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar animación y datos"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCatalogExercise(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar de biblioteca"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      Sugerido: {item.defaultSets} series x {item.defaultReps} ({item.defaultRestSeconds}s)
                    </p>
                    {item.notes && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Cadencia:{' '}
                    <strong className="text-slate-700">
                      {item.animationSpeed === 'SLOW'
                        ? 'Controlada'
                        : item.animationSpeed === 'FAST'
                        ? 'Explosiva'
                        : 'Normal'}
                    </strong>
                  </span>
                  <button
                    onClick={() => onEditCatalogExercise(item)}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Personalizar Animación →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
