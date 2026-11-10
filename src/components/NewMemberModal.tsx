import React, { useState } from 'react';
import { Plan, PaymentMethod } from '../types';
import { X, UserPlus, Check, Fingerprint, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  onCreateMember: (
    name: string,
    email: string,
    phone: string,
    planId: string,
    paymentMethod: PaymentMethod,
    fingerprintId?: string
  ) => void;
}

export function NewMemberModal({ isOpen, onClose, plans, onCreateMember }: NewMemberModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState<string>(plans[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [fingerprintId, setFingerprintId] = useState<string | undefined>();
  const [isScanning, setIsScanning] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !planId) return;

    onCreateMember(name, email, phone, planId, paymentMethod, fingerprintId);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setName('');
      setEmail('');
      setPhone('');
      setFingerprintId(undefined);
      setIsScanning(false);
      onClose();
    }, 1500);
  };

  const simulateFingerprintScan = () => {
    setIsScanning(true);
    // Simulate SDK read delay
    setTimeout(() => {
      const simulatedId = `FP-${Math.floor(Math.random() * 9000) + 1000}`;
      setFingerprintId(simulatedId);
      setIsScanning(false);
    }, 2000);
  };

  const selectedPlan = plans.find(p => p.id === planId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg max-h-[95vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Nuevo Socio</h3>
              <p className="text-xs text-slate-500">Alta de cliente y cobro inicial</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {successNotice ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-900">¡Socio Registrado!</p>
              <p className="text-sm text-slate-500">Se dio de alta el pase y se registró el cobro en la caja.</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Nombre Completo *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Ej. +54 11 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Asociar Huella Digital
                </label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "p-2.5 rounded-lg transition-colors",
                      fingerprintId ? "bg-emerald-100 text-emerald-600" : isScanning ? "bg-blue-100 text-blue-600 animate-pulse" : "bg-slate-200 text-slate-500"
                    )}>
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {fingerprintId ? 'Huella Registrada' : isScanning ? 'Apoye el dedo en el lector...' : 'Sin huella asociada'}
                      </p>
                      {fingerprintId ? (
                        <p className="text-xs text-emerald-600 font-bold">ID: {fingerprintId}</p>
                      ) : (
                        <p className="text-xs text-slate-500">Agilizará el ingreso por el molinete</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={simulateFingerprintScan}
                    disabled={isScanning}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer",
                      fingerprintId 
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300" 
                        : "bg-slate-900 text-white hover:bg-slate-800",
                      isScanning && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isScanning ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : fingerprintId ? (
                      'Escanear de nuevo'
                    ) : (
                      'Escanear Huella'
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Plan a Contratar *
                </label>
                <div className="space-y-2">
                  {plans.map((p) => (
                    <label 
                      key={p.id} 
                      className={clsx(
                        "flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all",
                        planId === p.id ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="plan" 
                          value={p.id} 
                          checked={planId === p.id} 
                          onChange={(e) => setPlanId(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                        />
                        <span className="font-medium text-sm text-slate-900">{p.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">${p.price.toLocaleString('es-AR')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Método de Pago *
                </label>
                <div className="flex gap-2">
                  {(['EFECTIVO', 'TRANSFERENCIA', 'DEBITO'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={clsx(
                        'flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer',
                        paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      {method === 'EFECTIVO' ? 'Efectivo' : method === 'TRANSFERENCIA' ? 'Transferencia' : 'Débito/Crédito'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between gap-4">
                <div className="text-slate-500 text-xs">
                  Total a cobrar:<br/>
                  <span className="text-xl font-bold text-slate-900">${selectedPlan?.price.toLocaleString('es-AR') || 0}</span>
                </div>
                <button
                  type="submit"
                  disabled={!name || !planId}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Registrar Socio
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
