import React from 'react';
import { Plan } from '../types';
import { ClipboardList, Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';

interface PlansManagementProps {
  plans: Plan[];
  onAddPlan: () => void;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (id: string) => void;
}

export function PlansManagement({ plans, onAddPlan, onEditPlan, onDeletePlan }: PlansManagementProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Planes y Membresías</h2>
          <p className="text-slate-500 mt-1">Administra los tipos de pases y sus precios.</p>
        </div>
        <button 
          onClick={onAddPlan}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nuevo Plan
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => onEditPlan(plan)} 
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDeletePlan(plan.id)} 
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-4">{plan.name}</h3>
            
            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> Precio</span>
                <span className="font-bold text-slate-900">${plan.price.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duración</span>
                <span className="font-semibold text-slate-700">{plan.durationDays} días</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
