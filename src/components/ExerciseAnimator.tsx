import React, { useState, useEffect } from 'react';
import { ExerciseAnimationType, AnimationSpeed } from '../types';

export const ANIMATION_LIBRARY: {
  type: ExerciseAnimationType;
  label: string;
  muscleTag: string;
}[] = [
  { type: 'BENCH_PRESS', label: 'Press de Banca', muscleTag: 'Pecho' },
  { type: 'SQUAT', label: 'Sentadilla Libre', muscleTag: 'Piernas' },
  { type: 'DEADLIFT', label: 'Peso Muerto', muscleTag: 'Posterior' },
  { type: 'PULLDOWN', label: 'Polea al Pecho', muscleTag: 'Espalda' },
  { type: 'ROW', label: 'Remo Horizontal', muscleTag: 'Espalda' },
  { type: 'SHOULDER_PRESS', label: 'Press Militar', muscleTag: 'Hombros' },
  { type: 'LATERAL_RAISE', label: 'Vuelos Laterales', muscleTag: 'Hombros' },
  { type: 'CURL', label: 'Curl de Bíceps', muscleTag: 'Bíceps' },
  { type: 'TRICEP_PUSHDOWN', label: 'Tríceps en Polea', muscleTag: 'Tríceps' },
  { type: 'LEG_PRESS', label: 'Prensa 45°', muscleTag: 'Piernas' },
  { type: 'LUNGE', label: 'Estocadas / Zancadas', muscleTag: 'Glúteos' },
  { type: 'CRUNCH', label: 'Crunch Abdominal', muscleTag: 'Abdomen' },
  { type: 'PLANK', label: 'Plancha Isométrica', muscleTag: 'Core' },
  { type: 'CARDIO', label: 'Cardio HIIT', muscleTag: 'Metabólico' },
];

interface ExerciseAnimatorProps {
  type: ExerciseAnimationType;
  speed?: AnimationSpeed;
  imageUrl?: string;
  customFrames?: [string, string];
  size?: 'sm' | 'md' | 'lg';
}

export function ExerciseAnimator({
  type,
  speed = 'NORMAL',
  imageUrl,
  customFrames,
  size = 'md',
}: ExerciseAnimatorProps) {
  const [activeFrame, setActiveFrame] = useState<0 | 1>(0);

  const dimensions =
    size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-full h-48' : 'w-28 h-28';

  const durationMultiplier = speed === 'SLOW' ? 1.5 : speed === 'FAST' ? 0.65 : 1;
  const dur = (baseSeconds: number) => `${(baseSeconds * durationMultiplier).toFixed(2)}s`;

  // Alternate between Frame A and Frame B when customFrames are provided
  useEffect(() => {
    if (!customFrames || !customFrames[0] || !customFrames[1]) return;
    const intervalMs = speed === 'SLOW' ? 1500 : speed === 'FAST' ? 650 : 1000;
    const timer = setInterval(() => {
      setActiveFrame(prev => (prev === 0 ? 1 : 0));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [customFrames, speed]);

  // 1. Custom 2-Frame Stop-Motion Animation (Position A <-> Position B)
  if (customFrames && customFrames[0] && customFrames[1]) {
    return (
      <div
        className={`${dimensions} rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shrink-0 select-none`}
      >
        <img
          src={customFrames[0]}
          alt="Posición Inicial"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            activeFrame === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <img
          src={customFrames[1]}
          alt="Posición Final"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            activeFrame === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span className="absolute bottom-1.5 right-1.5 bg-blue-600/90 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
          {activeFrame === 0 ? 'FASE 1' : 'FASE 2'}
        </span>
      </div>
    );
  }

  // 2. Single Image / Animated GIF / Video Thumbnail
  if (imageUrl) {
    return (
      <div
        className={`${dimensions} rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shrink-0 select-none`}
      >
        <img src={imageUrl} alt={type} className="w-full h-full object-cover" />
        <span className="absolute bottom-1.5 right-1.5 bg-slate-900/80 text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded">
          MEDIA
        </span>
      </div>
    );
  }

  // 3. Built-in 14 Biomechanical 2D Vector Animations
  return (
    <div
      className={`${dimensions} rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shrink-0 select-none`}
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full p-2 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'BENCH_PRESS' && (
          <g>
            <rect x="20" y="82" width="80" height="6" rx="3" fill="#334155" />
            <rect x="30" y="88" width="6" height="18" fill="#475569" />
            <rect x="84" y="88" width="6" height="18" fill="#475569" />
            <circle cx="32" cy="73" r="7" fill="#94a3b8" />
            <line x1="40" y1="76" x2="78" y2="76" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="52" cy="73" r="6" fill="#3b82f6" opacity="0.65">
              <animate attributeName="r" values="4;8;4" dur={dur(1.8)} repeatCount="indefinite" />
            </circle>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-22; 0,0"
                dur={dur(1.8)}
                repeatCount="indefinite"
              />
              <line x1="26" y1="62" x2="82" y2="62" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <rect x="28" y="52" width="5" height="20" rx="2" fill="#3b82f6" />
              <rect x="75" y="52" width="5" height="20" rx="2" fill="#3b82f6" />
            </g>
            <line x1="52" y1="75" x2="52" y2="62" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="y2" values="62;40;62" dur={dur(1.8)} repeatCount="indefinite" />
            </line>
          </g>
        )}

        {type === 'SQUAT' && (
          <g>
            <line x1="20" y1="104" x2="100" y2="104" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,20; 0,0"
                dur={dur(2)}
                repeatCount="indefinite"
              />
              <circle cx="60" cy="26" r="7" fill="#94a3b8" />
              <line x1="60" y1="35" x2="56" y2="64" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="28" y1="36" x2="92" y2="36" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              <rect x="30" y="27" width="6" height="18" rx="2" fill="#3b82f6" />
              <rect x="84" y="27" width="6" height="18" rx="2" fill="#3b82f6" />
            </g>
            <line x1="56" y1="64" x2="66" y2="84" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round">
              <animate attributeName="y1" values="64;84;64" dur={dur(2)} repeatCount="indefinite" />
              <animate attributeName="x2" values="62;74;62" dur={dur(2)} repeatCount="indefinite" />
            </line>
            <line x1="62" y1="84" x2="60" y2="102" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round">
              <animate attributeName="x1" values="62;74;62" dur={dur(2)} repeatCount="indefinite" />
            </line>
          </g>
        )}

        {type === 'DEADLIFT' && (
          <g>
            <line x1="20" y1="104" x2="100" y2="104" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="102" x2="58" y2="68" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <line x1="58" y1="68" x2="60" y2="34" stroke="#3b82f6" strokeWidth="6.5" strokeLinecap="round">
              <animate attributeName="x2" values="76;58;76" dur={dur(2.1)} repeatCount="indefinite" />
              <animate attributeName="y2" values="52;34;52" dur={dur(2.1)} repeatCount="indefinite" />
            </line>
            <circle cx="60" cy="24" r="6.5" fill="#cbd5e1">
              <animate attributeName="cx" values="82;58;82" dur={dur(2.1)} repeatCount="indefinite" />
              <animate attributeName="cy" values="45;24;45" dur={dur(2.1)} repeatCount="indefinite" />
            </circle>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,18; 0,0; 0,18"
                dur={dur(2.1)}
                repeatCount="indefinite"
              />
              <circle cx="66" cy="72" r="11" fill="#1d4ed8" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="66" cy="72" r="3" fill="#e2e8f0" />
            </g>
          </g>
        )}

        {type === 'PULLDOWN' && (
          <g>
            <line x1="30" y1="14" x2="90" y2="14" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="14" x2="60" y2="54" stroke="#64748b" strokeWidth="2" />
            <circle cx="60" cy="48" r="6.5" fill="#94a3b8" />
            <line x1="60" y1="56" x2="60" y2="90" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,-20; 0,8; 0,-20"
                dur={dur(1.9)}
                repeatCount="indefinite"
              />
              <line x1="32" y1="50" x2="88" y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <line x1="36" y1="50" x2="52" y2="66" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
              <line x1="84" y1="50" x2="68" y2="66" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {type === 'ROW' && (
          <g>
            {/* Seated Cable Row */}
            <line x1="20" y1="90" x2="96" y2="90" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            {/*Pulley machine on right*/}
            <rect x="88" y="34" width="8" height="56" rx="2" fill="#475569" />
            {/* Athlete Torso & Legs */}
            <circle cx="42" cy="40" r="6.5" fill="#94a3b8" />
            <line x1="42" y1="50" x2="42" y2="86" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
            <line x1="42" y1="86" x2="82" y2="86" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            {/* Cable + Arms Pulling Horizontally */}
            <line x1="88" y1="62" x2="48" y2="62" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
              <animate attributeName="x2" values="68;44;68" dur={dur(1.8)} repeatCount="indefinite" />
            </line>
            <circle cx="48" cy="62" r="5" fill="#e2e8f0">
              <animate attributeName="cx" values="68;44;68" dur={dur(1.8)} repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {type === 'SHOULDER_PRESS' && (
          <g>
            <circle cx="60" cy="54" r="7" fill="#94a3b8" />
            <line x1="60" y1="64" x2="60" y2="98" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
            <circle cx="46" cy="66" r="5" fill="#3b82f6">
              <animate attributeName="r" values="4;7;4" dur={dur(1.7)} repeatCount="indefinite" />
            </circle>
            <circle cx="74" cy="66" r="5" fill="#3b82f6">
              <animate attributeName="r" values="4;7;4" dur={dur(1.7)} repeatCount="indefinite" />
            </circle>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-26; 0,0"
                dur={dur(1.7)}
                repeatCount="indefinite"
              />
              <rect x="28" y="48" width="16" height="6" rx="2" fill="#38bdf8" />
              <rect x="76" y="48" width="16" height="6" rx="2" fill="#38bdf8" />
              <line x1="36" y1="54" x2="46" y2="66" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
              <line x1="84" y1="54" x2="74" y2="66" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {type === 'LATERAL_RAISE' && (
          <g>
            <circle cx="60" cy="34" r="7" fill="#94a3b8" />
            <line x1="60" y1="44" x2="60" y2="94" stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" />
            {/* Deltoid glow */}
            <circle cx="49" cy="48" r="4.5" fill="#3b82f6" />
            <circle cx="71" cy="48" r="4.5" fill="#3b82f6" />
            {/* Left Arm */}
            <line x1="50" y1="48" x2="38" y2="80" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="x2" values="44;22;44" dur={dur(1.7)} repeatCount="indefinite" />
              <animate attributeName="y2" values="80;46;80" dur={dur(1.7)} repeatCount="indefinite" />
            </line>
            {/* Right Arm */}
            <line x1="70" y1="48" x2="82" y2="80" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="x2" values="76;98;76" dur={dur(1.7)} repeatCount="indefinite" />
              <animate attributeName="y2" values="80;46;80" dur={dur(1.7)} repeatCount="indefinite" />
            </line>
            {/* Dumbbells */}
            <circle cx="44" cy="80" r="4.5" fill="#38bdf8">
              <animate attributeName="cx" values="44;22;44" dur={dur(1.7)} repeatCount="indefinite" />
              <animate attributeName="cy" values="80;46;80" dur={dur(1.7)} repeatCount="indefinite" />
            </circle>
            <circle cx="76" cy="80" r="4.5" fill="#38bdf8">
              <animate attributeName="cx" values="76;98;76" dur={dur(1.7)} repeatCount="indefinite" />
              <animate attributeName="cy" values="80;46;80" dur={dur(1.7)} repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {type === 'CURL' && (
          <g>
            <circle cx="52" cy="30" r="7" fill="#94a3b8" />
            <line x1="52" y1="40" x2="52" y2="92" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <line x1="54" y1="45" x2="56" y2="68" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <circle cx="58" cy="56" r="5" fill="#3b82f6">
              <animate attributeName="r" values="3.5;7.5;3.5" dur={dur(1.6)} repeatCount="indefinite" />
            </circle>
            <g>
              <line x1="56" y1="68" x2="78" y2="68" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round">
                <animate attributeName="x2" values="74;62;74" dur={dur(1.6)} repeatCount="indefinite" />
                <animate attributeName="y2" values="84;46;84" dur={dur(1.6)} repeatCount="indefinite" />
              </line>
              <circle cx="74" cy="84" r="6" fill="#38bdf8">
                <animate attributeName="cx" values="74;62;74" dur={dur(1.6)} repeatCount="indefinite" />
                <animate attributeName="cy" values="84;46;84" dur={dur(1.6)} repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        )}

        {type === 'TRICEP_PUSHDOWN' && (
          <g>
            {/* High Pulley */}
            <rect x="76" y="14" width="6" height="90" fill="#334155" />
            <line x1="48" y1="16" x2="80" y2="16" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <line x1="66" y1="16" x2="66" y2="60" stroke="#64748b" strokeWidth="2" />
            {/* Athlete */}
            <circle cx="42" cy="32" r="6.5" fill="#94a3b8" />
            <line x1="42" y1="42" x2="42" y2="96" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
            {/* Tricep Highlight */}
            <circle cx="45" cy="54" r="5" fill="#3b82f6">
              <animate attributeName="r" values="3.5;7;3.5" dur={dur(1.5)} repeatCount="indefinite" />
            </circle>
            {/* Forearm pushing down */}
            <line x1="46" y1="62" x2="66" y2="52" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round">
              <animate attributeName="y2" values="50;82;50" dur={dur(1.5)} repeatCount="indefinite" />
              <animate attributeName="x2" values="66;58;66" dur={dur(1.5)} repeatCount="indefinite" />
            </line>
          </g>
        )}

        {type === 'LEG_PRESS' && (
          <g>
            {/* Angled Seat */}
            <line x1="22" y1="74" x2="46" y2="94" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <circle cx="28" cy="64" r="6" fill="#94a3b8" />
            {/* Legs pushing 45 deg sled */}
            <line x1="44" y1="88" x2="72" y2="54" stroke="#3b82f6" strokeWidth="6.5" strokeLinecap="round">
              <animate attributeName="x2" values="58;82;58" dur={dur(2)} repeatCount="indefinite" />
              <animate attributeName="y2" values="68;44;68" dur={dur(2)} repeatCount="indefinite" />
            </line>
            {/* Sled Plate */}
            <line x1="50" y1="60" x2="68" y2="76" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 22,-22; 0,0"
                dur={dur(2)}
                repeatCount="indefinite"
              />
            </line>
          </g>
        )}

        {type === 'LUNGE' && (
          <g>
            <line x1="16" y1="102" x2="104" y2="102" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,16; 0,0"
                dur={dur(1.9)}
                repeatCount="indefinite"
              />
              <circle cx="58" cy="30" r="6.5" fill="#94a3b8" />
              <line x1="58" y1="38" x2="58" y2="68" stroke="#3b82f6" strokeWidth="6.5" strokeLinecap="round" />
            </g>
            {/* Front Leg */}
            <line x1="58" y1="74" x2="78" y2="100" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
            {/* Back Leg */}
            <line x1="58" y1="74" x2="36" y2="100" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {type === 'CRUNCH' && (
          <g>
            <line x1="16" y1="92" x2="104" y2="92" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            {/* Bent knees */}
            <line x1="58" y1="88" x2="74" y2="68" stroke="#94a3b8" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="74" y1="68" x2="88" y2="88" stroke="#94a3b8" strokeWidth="5.5" strokeLinecap="round" />
            {/* Crunching Torso */}
            <line x1="58" y1="88" x2="30" y2="82" stroke="#3b82f6" strokeWidth="6.5" strokeLinecap="round">
              <animate attributeName="y2" values="84;62;84" dur={dur(1.6)} repeatCount="indefinite" />
              <animate attributeName="x2" values="28;42;28" dur={dur(1.6)} repeatCount="indefinite" />
            </line>
            <circle cx="28" cy="76" r="6" fill="#e2e8f0">
              <animate attributeName="cy" values="78;56;78" dur={dur(1.6)} repeatCount="indefinite" />
              <animate attributeName="cx" values="24;40;24" dur={dur(1.6)} repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {type === 'PLANK' && (
          <g>
            <line x1="16" y1="90" x2="104" y2="90" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur={dur(1.4)}
                repeatCount="indefinite"
              />
              <circle cx="88" cy="64" r="6" fill="#94a3b8" />
              <line x1="26" y1="78" x2="80" y2="68" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
              <line x1="78" y1="68" x2="78" y2="88" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
              <line x1="78" y1="88" x2="88" y2="88" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
              <circle cx="56" cy="73" r="6" fill="#38bdf8" opacity="0.6">
                <animate attributeName="r" values="4;9;4" dur={dur(1.4)} repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        )}

        {type === 'CARDIO' && (
          <g>
            <polyline
              points="14,64 34,64 44,36 56,90 68,46 78,74 86,64 106,64"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur={dur(1.1)} repeatCount="indefinite" />
            </polyline>
            <circle cx="60" cy="60" r="38" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 6">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 60 60"
                to="360 60 60"
                dur={dur(6)}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>

      <span className="absolute bottom-1.5 right-2 text-[9px] font-bold tracking-wider uppercase text-blue-400/90 bg-slate-900/90 px-1.5 py-0.5 rounded">
        LIVE 2D
      </span>
    </div>
  );
}
