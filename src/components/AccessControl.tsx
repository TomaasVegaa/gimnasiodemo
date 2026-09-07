import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { mockMembers } from '../data/mockData';

export function AccessControl() {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [member, setMember] = useState<any>(null);

  const simulateScan = () => {
    if (status === 'SCANNING') return;
    
    setStatus('SCANNING');
    setMember(null);

    // Simulate hardware delay
    setTimeout(() => {
      // Simulate finding a random member or error
      const random = Math.random();
      if (random > 0.2) {
        setStatus('SUCCESS');
        // Pick Carlos for demo success
        setMember(mockMembers[0]);
      } else {
        setStatus('ERROR');
      }
      
      // Auto reset after 3 seconds
      setTimeout(() => {
        setStatus('IDLE');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500 h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Control de Acceso</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Simulador de integración con lector ZKTeco. En producción, este módulo se conecta por WebSockets al servicio local del escáner USB.
        </p>
      </div>

      <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col items-center w-full max-w-md">
        
        {/* Scanner Circle */}
        <button 
          onClick={simulateScan}
          disabled={status !== 'IDLE'}
          className={clsx(
            "relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 group",
            status === 'IDLE' ? "bg-slate-50 border-4 border-slate-100 hover:border-blue-100 cursor-pointer" : "",
            status === 'SCANNING' ? "bg-blue-50 border-4 border-blue-200" : "",
            status === 'SUCCESS' ? "bg-emerald-50 border-4 border-emerald-200" : "",
            status === 'ERROR' ? "bg-rose-50 border-4 border-rose-200" : ""
          )}
        >
          {status === 'SCANNING' && (
            <>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20" />
              <div className="absolute h-1 w-full bg-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_1.5s_ease-in-out_infinite]" />
            </>
          )}

          <Fingerprint 
            className={clsx(
              "w-24 h-24 transition-colors duration-500",
              status === 'IDLE' ? "text-slate-300 group-hover:text-blue-400" : "",
              status === 'SCANNING' ? "text-blue-500" : "",
              status === 'SUCCESS' ? "text-emerald-500" : "",
              status === 'ERROR' ? "text-rose-500" : ""
            )} 
          />
        </button>

        <div className="mt-8 h-24 flex items-center justify-center w-full">
          {status === 'IDLE' && (
            <p className="text-slate-500 font-medium">Haz clic en la huella para simular lectura</p>
          )}
          {status === 'SCANNING' && (
            <p className="text-blue-600 font-medium animate-pulse">Esperando huella...</p>
          )}
          {status === 'SUCCESS' && member && (
            <div className="text-center animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-1">
                <CheckCircle2 className="w-5 h-5" /> Acceso Permitido
              </div>
              <p className="text-slate-900 font-semibold text-lg">{member.name}</p>
              <p className="text-slate-500 text-sm">Socio Activo</p>
            </div>
          )}
          {status === 'ERROR' && (
            <div className="text-center animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-center gap-2 text-rose-600 font-bold mb-1">
                <XCircle className="w-5 h-5" /> Acceso Denegado
              </div>
              <p className="text-slate-500 text-sm">Huella no reconocida o cuota vencida</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
