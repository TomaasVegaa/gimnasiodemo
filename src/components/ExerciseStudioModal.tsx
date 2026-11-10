import React, { useState, useEffect } from 'react';
import { CatalogExercise, ExerciseAnimationType, AnimationSpeed } from '../types';
import { X, Check, Sparkles, Upload, Film, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { ExerciseAnimator, ANIMATION_LIBRARY } from './ExerciseAnimator';

interface ExerciseStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<CatalogExercise, 'id'>, id?: string) => void;
  initialExercise?: CatalogExercise;
}

type AnimationMode = 'VECTOR_2D' | 'SINGLE_GIF' | 'TWO_FRAME_BUILDER';

export function ExerciseStudioModal({
  isOpen,
  onClose,
  onSave,
  initialExercise,
}: ExerciseStudioModalProps) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Pectorales');
  const [defaultSets, setDefaultSets] = useState(4);
  const [defaultReps, setDefaultReps] = useState('10 - 12');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(75);
  const [notes, setNotes] = useState('');

  const [mode, setMode] = useState<AnimationMode>('VECTOR_2D');
  const [animationType, setAnimationType] = useState<ExerciseAnimationType>('BENCH_PRESS');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('NORMAL');
  const [imageUrl, setImageUrl] = useState('');
  const [frameA, setFrameA] = useState('');
  const [frameB, setFrameB] = useState('');

  useEffect(() => {
    if (initialExercise) {
      setName(initialExercise.name);
      setMuscleGroup(initialExercise.muscleGroup);
      setDefaultSets(initialExercise.defaultSets);
      setDefaultReps(initialExercise.defaultReps);
      setDefaultRestSeconds(initialExercise.defaultRestSeconds);
      setNotes(initialExercise.notes || '');
      setAnimationType(initialExercise.animationType);
      setAnimationSpeed(initialExercise.animationSpeed || 'NORMAL');
      setImageUrl(initialExercise.imageUrl || '');
      if (initialExercise.customFrames && initialExercise.customFrames[0] && initialExercise.customFrames[1]) {
        setMode('TWO_FRAME_BUILDER');
        setFrameA(initialExercise.customFrames[0]);
        setFrameB(initialExercise.customFrames[1]);
      } else if (initialExercise.imageUrl) {
        setMode('SINGLE_GIF');
      } else {
        setMode('VECTOR_2D');
      }
    } else {
      setName('');
      setMuscleGroup('Pectorales');
      setDefaultSets(4);
      setDefaultReps('10 - 12');
      setDefaultRestSeconds(75);
      setNotes('');
      setMode('VECTOR_2D');
      setAnimationType('BENCH_PRESS');
      setAnimationSpeed('NORMAL');
      setImageUrl('');
      setFrameA('');
      setFrameB('');
    }
  }, [initialExercise, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name,
        muscleGroup,
        defaultSets: Number(defaultSets),
        defaultReps,
        defaultRestSeconds: Number(defaultRestSeconds),
        notes,
        animationType,
        animationSpeed,
        imageUrl: mode === 'SINGLE_GIF' ? imageUrl : undefined,
        customFrames:
          mode === 'TWO_FRAME_BUILDER' && frameA && frameB
            ? [frameA, frameB]
            : undefined,
      },
      initialExercise?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {initialExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Live Preview Column */}
            <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3">
              <ExerciseAnimator
                type={animationType}
                speed={animationSpeed}
                imageUrl={mode === 'SINGLE_GIF' ? imageUrl : undefined}
                customFrames={
                  mode === 'TWO_FRAME_BUILDER' && frameA && frameB
                    ? [frameA, frameB]
                    : undefined
                }
                size="lg"
              />
              <div>
                <p className="text-sm font-bold text-white truncate">
                  {name || 'Vista Previa'}
                </p>
                <p className="text-xs text-slate-400">
                  {defaultSets} × {defaultReps}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800">
                {(
                  [
                    { id: 'SLOW', label: 'Lenta' },
                    { id: 'NORMAL', label: 'Normal' },
                    { id: 'FAST', label: 'Rápida' },
                  ] as { id: AnimationSpeed; label: string }[]
                ).map(sp => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setAnimationSpeed(sp.id)}
                    className={clsx(
                      'py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer',
                      animationSpeed === sp.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    )}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Ejercicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Remo en Polea"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Músculo *
                  </label>
                  <input
                    type="text"
                    required
                    value={muscleGroup}
                    onChange={e => setMuscleGroup(e.target.value)}
                    placeholder="Ej. Espalda"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Series
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={defaultSets}
                    onChange={e => setDefaultSets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Reps
                  </label>
                  <input
                    type="text"
                    value={defaultReps}
                    onChange={e => setDefaultReps(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Descanso (s)
                  </label>
                  <input
                    type="number"
                    step={15}
                    value={defaultRestSeconds}
                    onChange={e => setDefaultRestSeconds(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Compact Mode Tabs */}
              <div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => setMode('VECTOR_2D')}
                    className={clsx(
                      'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer',
                      mode === 'VECTOR_2D'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500'
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    2D (14)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('TWO_FRAME_BUILDER')}
                    className={clsx(
                      'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer',
                      mode === 'TWO_FRAME_BUILDER'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500'
                    )}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    2 Fotos A↔B
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('SINGLE_GIF')}
                    className={clsx(
                      'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer',
                      mode === 'SINGLE_GIF'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500'
                    )}
                  >
                    <Film className="w-3.5 h-3.5 text-blue-600" />
                    GIF / Link
                  </button>
                </div>

                {mode === 'VECTOR_2D' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1">
                    {ANIMATION_LIBRARY.map(item => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setAnimationType(item.type)}
                        className={clsx(
                          'p-2 rounded-xl border text-left transition-all cursor-pointer',
                          animationType === item.type
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400'
                        )}
                      >
                        <span
                          className={clsx(
                            'text-[9px] font-bold uppercase block',
                            animationType === item.type ? 'text-blue-200' : 'text-blue-600'
                          )}
                        >
                          {item.muscleTag}
                        </span>
                        <span className="text-[11px] font-bold leading-tight block truncate">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {mode === 'TWO_FRAME_BUILDER' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                        <Upload className="w-3.5 h-3.5" /> Foto 1 (Inicio)
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, setFrameA)}
                        />
                      </label>
                      <input
                        type="url"
                        value={frameA}
                        onChange={e => setFrameA(e.target.value)}
                        placeholder="URL Foto 1..."
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <label className="flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                        <Upload className="w-3.5 h-3.5" /> Foto 2 (Final)
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFileUpload(e, setFrameB)}
                        />
                      </label>
                      <input
                        type="url"
                        value={frameB}
                        onChange={e => setFrameB(e.target.value)}
                        placeholder="URL Foto 2..."
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}

                {mode === 'SINGLE_GIF' && (
                  <div className="flex gap-2">
                    <label className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" /> Subir GIF
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, setImageUrl)}
                      />
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://... link del GIF o imagen"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
