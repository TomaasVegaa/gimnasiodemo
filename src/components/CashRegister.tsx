import React from 'react';
import { Transaction } from '../types';
import { Wallet, Banknote, ArrowRightLeft, CreditCard, Receipt } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface CashRegisterProps {
  transactions: Transaction[];
}

export function CashRegister({ transactions }: CashRegisterProps) {
  const totalEfectivo = transactions
    .filter(t => t.paymentMethod === 'EFECTIVO')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalTransferencia = transactions
    .filter(t => t.paymentMethod === 'TRANSFERENCIA')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebito = transactions
    .filter(t => t.paymentMethod === 'DEBITO')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGeneral = totalEfectivo + totalTransferencia + totalDebito;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Caja y Transacciones</h2>
        <p className="text-slate-500 mt-1">Control de ingresos por membresías y ventas de mostrador.</p>
      </header>

      {/* Totals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">Total General</p>
          </div>
          <p className="text-3xl font-bold">${totalGeneral.toLocaleString('es-AR')}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">Efectivo</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalEfectivo.toLocaleString('es-AR')}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">Transferencias</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalTransferencia.toLocaleString('es-AR')}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-slate-500">Débito/Crédito</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalDebito.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-500" /> Últimos Movimientos
          </h3>
        </div>
        
        <div className="overflow-x-auto flex-1">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No hay movimientos registrados hoy</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">Método</th>
                  <th className="px-6 py-4 font-semibold text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice().reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {tx.timestamp}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md border",
                        tx.type === 'MEMBERSHIP' 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      )}>
                        {tx.type === 'MEMBERSHIP' ? 'MEMBRESÍA' : 'PRODUCTO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 text-[11px] font-bold rounded-md border",
                        tx.paymentMethod === 'EFECTIVO' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                        tx.paymentMethod === 'TRANSFERENCIA' && "bg-blue-50 text-blue-700 border-blue-200",
                        tx.paymentMethod === 'DEBITO' && "bg-purple-50 text-purple-700 border-purple-200"
                      )}>
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                      + ${tx.amount.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
