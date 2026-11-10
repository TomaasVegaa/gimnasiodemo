import React, { useState, useEffect } from 'react';
import { CatalogExercise, ExerciseAnimationType, AnimationSpeed } from '../types';
import { X, Check, Sparkles, Upload, Film, Layers, Gauge } from 'lucide-react';
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

  // Animation Studio State
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
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialExercise
                  ? 'Editar Ejercicio y Animación'
                  : 'Estudio Creador de Ejercicios y Animaciones'}
              </h3>
              <p className="text-xs text-slate-500">
                Elegí una animación 2D de la galería, subí un GIF o creá tu propia animación con 2 fotos (Inicio / Fin).
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Live Preview & Speed */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
                  Vista Previa en Tiempo Real
                </span>
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
                <h4 className="text-base font-bold text-white mt-3 truncate">
                  {name || 'Nombre del Ejercicio'}
                </h4>
                <p className="text-xs text-slate-400">
                  {muscleGroup} • {defaultSets} series x {defaultReps}
                </p>
              </div>

              {/* Speed / Cadence Selector */}
              <div className="pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  Velocidad / Cadencia de Animación
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'SLOW', label: 'Controlada' },
                      { id: 'NORMAL', label: 'Normal' },
                      { id: 'FAST', label: 'Explosiva' },
                    ] as { id: AnimationSpeed; label: string }[]
                  ).map(sp => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setAnimationSpeed(sp.id)}
                      className={clsx(
                        'py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer',
                        animationSpeed === sp.id
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      )}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Exercise Data & Animation Mode Tabs */}
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Exercise Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Nombre del Ejercicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Remo con Mancuerna / Prensa 45°"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Grupo Muscular *
                  </label>
                  <input
                    type="text"
                    required
                    value={muscleGroup}
                    onChange={e => setMuscleGroup(e.target.value)}
                    placeholder="Ej. Espalda, Pecho, Piernas, Glúteos..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Series Sugeridas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={defaultSets}
                    onChange={e => setDefaultSets(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Repeticiones
                  </label>
                  <input
                    type="text"
                    value={defaultReps}
                    onChange={e => setDefaultReps(e.target.value)}
                    placeholder="Ej. 10 - 12"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Descanso (seg)
                  </label>
                  <input
                    type="number"
                    step={15}
                    value={defaultRestSeconds}
                    onChange={e => setDefaultRestSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* 3 Animation Creation Modes */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  ¿Cómo querés armar la animación de este ejercicio?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setMode('VECTOR_2D')}
                    className={clsx(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5',
                      mode === 'VECTOR_2D'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">1. Catálogo 2D (14)</p>
                      <p className="text-[10px] text-slate-500">Figuras biomecánicas</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('TWO_FRAME_BUILDER')}
                    className={clsx(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5',
                      mode === 'TWO_FRAME_BUILDER'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">2. Crear con 2 Fotos</p>
                      <p className="text-[10px] text-slate-500">Anima Foto A ↔ Foto B</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('SINGLE_GIF')}
                    className={clsx(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5',
                      mode === 'SINGLE_GIF'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <Film className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">3. Subir GIF / Imagen</p>
                      <p className="text-[10px] text-slate-500">Archivo o Link web</p>
                    </div>
                  </button>
                </div>

                {/* MODE 1: Interactive Visual Grid of 14 Vector Animations */}
                {mode === 'VECTOR_2D' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600 mb-3">
                      Hacé clic en el movimiento que mejor represente tu ejercicio:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                      {ANIMATION_LIBRARY.map(item => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setAnimationType(item.type)}
                          className={clsx(
                            'p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                            animationType === item.type
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                          )}
                        >
                          <span
                            className={clsx(
                              'text-[10px] font-bold uppercase',
                              animationType === item.type ? 'text-blue-200' : 'text-blue-600'
                            )}
                          >
                            {item.muscleTag}
                          </span>
                          <span className="text-xs font-bold mt-1 leading-tight">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODE 2: 2-Frame Custom Animation Creator */}
                {mode === 'TWO_FRAME_BUILDER' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-600">
                      Subí o pegá 2 fotos (por ejemplo, vos o un profe en la máquina en{' '}
                      <strong>Posición Inicial</strong> y <strong>Posición Final</strong>) y el
                      sistema genera automáticamente el bucle animado:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">
                          Foto 1: Posición Inicial (Fase A)
                        </span>
                        <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Subir Foto 1 desde mi PC/Celular
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
                          placeholder="O pegá URL de imagen 1..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">
                          Foto 2: Contracción Final (Fase B)
                        </span>
                        <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Subir Foto 2 desde mi PC/Celular
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
                          placeholder="O pegá URL de imagen 2..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3: Upload GIF or Custom Image */}
                {mode === 'SINGLE_GIF' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-600">
                      Subí un archivo GIF animado desde tu computadora o pegá el link de cualquier GIF/imagen de internet:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0">
                        <Upload className="w-4 h-4" />
                        Subir GIF / Imagen
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
                        placeholder="https://ejemplo.com/ejercicio-animado.gif"
                        className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Tip Técnico / Indicación para el Alumno
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ej. Mantener espalda apoyada y controlar 2 segundos la bajada."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
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
              <Check className="w-4 h-4" /> Guardar en Biblioteca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
