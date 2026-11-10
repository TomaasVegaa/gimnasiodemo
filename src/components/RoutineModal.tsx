import React, { useState, useEffect } from 'react';
import {
  Routine,
  RoutineGoal,
  Exercise,
  ExerciseAnimationType,
  CatalogExercise,
  AnimationSpeed,
} from '../types';
import { X, Check, Dumbbell, Plus, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { ExerciseAnimator, ANIMATION_LIBRARY } from './ExerciseAnimator';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Omit<Routine, 'id'>, id?: string) => void;
  routine?: Routine;
  exerciseCatalog: CatalogExercise[];
}

export function RoutineModal({
  isOpen,
  onClose,
  onSave,
  routine,
  exerciseCatalog,
}: RoutineModalProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<RoutineGoal>('HIPERTROFIA');
  const [level, setLevel] = useState<'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'>('INTERMEDIO');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>(
    exerciseCatalog[0]?.id || ''
  );

  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setGoal(routine.goal);
      setLevel(routine.level);
      setDaysPerWeek(routine.daysPerWeek);
      setDescription(routine.description);
      setExercises(routine.exercises);
    } else {
      setName('');
      setGoal('HIPERTROFIA');
      setLevel('INTERMEDIO');
      setDaysPerWeek(4);
      setDescription('');
      setExercises([
        {
          id: `EX-${Date.now()}`,
          name: 'Press de Banca con Barra',
          muscleGroup: 'Pectorales',
          sets: 4,
          reps: '10 - 12',
          restSeconds: 90,
          notes: 'Controlar el descenso de la barra.',
          animationType: 'BENCH_PRESS',
          animationSpeed: 'NORMAL',
        },
      ]);
    }
  }, [routine, isOpen]);

  if (!isOpen) return null;

  const handleAddBlankExercise = () => {
    setExercises(prev => [
      ...prev,
      {
        id: `EX-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: '',
        muscleGroup: 'General',
        sets: 3,
        reps: '10 - 12',
        restSeconds: 60,
        notes: '',
        animationType: 'SQUAT',
        animationSpeed: 'NORMAL',
      },
    ]);
  };

  const handleImportFromCatalog = () => {
    const found = exerciseCatalog.find(c => c.id === selectedCatalogId);
    if (!found) return;
    setExercises(prev => [
      ...prev,
      {
        id: `EX-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        catalogExerciseId: found.id,
        name: found.name,
        muscleGroup: found.muscleGroup,
        sets: found.defaultSets,
        reps: found.defaultReps,
        restSeconds: found.defaultRestSeconds,
        notes: found.notes,
        animationType: found.animationType,
        animationSpeed: found.animationSpeed || 'NORMAL',
        imageUrl: found.imageUrl,
        customFrames: found.customFrames,
      },
    ]);
  };

  const handleExerciseGifUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleUpdateExercise(index, 'imageUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateExercise = (index: number, field: keyof Exercise, value: any) => {
    setExercises(prev =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || exercises.length === 0) return;
    onSave(
      {
        name,
        goal,
        level,
        daysPerWeek: Number(daysPerWeek),
        description,
        exercises,
      },
      routine?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {routine ? 'Editar Rutina de Entrenamiento' : 'Nueva Rutina de Entrenamiento'}
              </h3>
              <p className="text-xs text-slate-500">
                Importá ejercicios de tu Biblioteca de Animaciones o crealos a medida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nombre de la Rutina *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Hipertrofia Tren Superior / Definición Full Body"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Objetivo Principal *
              </label>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value as RoutineGoal)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="HIPERTROFIA">Subir Masa Muscular (Hipertrofia)</option>
                <option value="DEFINICION">Definición / Quema de Grasa</option>
                <option value="FUERZA">Fuerza Máxima / Power</option>
                <option value="FUNCIONAL">Acondicionamiento Funcional</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nivel
                </label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PRINCIPIANTE">Principiante</option>
                  <option value="INTERMEDIO">Intermedio</option>
                  <option value="AVANZADO">Avanzado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Días x Semana
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={daysPerWeek}
                  onChange={e => setDaysPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Descripción / Recomendación del Entrenador
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Indicaciones generales de entrada en calor, cadencia o hidratación..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Exercises List Builder */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Ejercicios de la Rutina ({exercises.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Sumá un ejercicio desde tu Biblioteca o agregá uno manual
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {exerciseCatalog.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-blue-50/70 p-1 rounded-xl border border-blue-200">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 ml-2" />
                    <select
                      value={selectedCatalogId}
                      onChange={e => setSelectedCatalogId(e.target.value)}
                      className="text-xs font-semibold text-blue-900 bg-transparent py-1 pr-2 focus:outline-none"
                    >
                      {exerciseCatalog.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.muscleGroup})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleImportFromCatalog}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Insertar
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddBlankExercise}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Ejercicio en Blanco
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row gap-4 items-start"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                    <ExerciseAnimator
                      type={ex.animationType}
                      speed={ex.animationSpeed}
                      imageUrl={ex.imageUrl}
                      customFrames={ex.customFrames}
                      size="sm"
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Ejercicio *
                      </label>
                      <input
                        type="text"
                        required
                        value={ex.name}
                        onChange={e => handleUpdateExercise(idx, 'name', e.target.value)}
                        placeholder="Ej. Sentadilla Libre"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Grupo Muscular
                      </label>
                      <input
                        type="text"
                        value={ex.muscleGroup}
                        onChange={e => handleUpdateExercise(idx, 'muscleGroup', e.target.value)}
                        placeholder="Ej. Piernas / Pecho"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Series
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={ex.sets}
                        onChange={e => handleUpdateExercise(idx, 'sets', Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Repeticiones / Tiempo
                      </label>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={e => handleUpdateExercise(idx, 'reps', e.target.value)}
                        placeholder="Ej. 10 - 12 o 45 seg"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Descanso (Segundos)
                      </label>
                      <input
                        type="number"
                        step={15}
                        value={ex.restSeconds}
                        onChange={e =>
                          handleUpdateExercise(idx, 'restSeconds', Number(e.target.value))
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Animación 2D (14 opciones)
                      </label>
                      <select
                        value={ex.animationType}
                        onChange={e =>
                          handleUpdateExercise(
                            idx,
                            'animationType',
                            e.target.value as ExerciseAnimationType
                          )
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        {ANIMATION_LIBRARY.map(opt => (
                          <option key={opt.type} value={opt.type}>
                            {opt.label} ({opt.muscleTag})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Velocidad Animación
                      </label>
                      <select
                        value={ex.animationSpeed || 'NORMAL'}
                        onChange={e =>
                          handleUpdateExercise(
                            idx,
                            'animationSpeed',
                            e.target.value as AnimationSpeed
                          )
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="SLOW">Lenta / Controlada</option>
                        <option value="NORMAL">Normal</option>
                        <option value="FAST">Rápida / Explosiva</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        GIF / Imagen Propia
                      </label>
                      <div className="flex gap-1.5">
                        <label className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0 flex items-center">
                          Subir GIF
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleExerciseGifUpload(idx, e)}
                          />
                        </label>
                        <input
                          type="url"
                          value={ex.imageUrl || ''}
                          onChange={e => handleUpdateExercise(idx, 'imageUrl', e.target.value)}
                          placeholder="o pegar link GIF..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        {ex.imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleUpdateExercise(idx, 'imageUrl', undefined)}
                            className="px-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Quitar GIF y volver a 2D"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(idx)}
                    disabled={exercises.length <= 1}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    title="Eliminar ejercicio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" /> Guardar Rutina
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
