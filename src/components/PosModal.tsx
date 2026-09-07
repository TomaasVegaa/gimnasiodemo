import React, { useState } from 'react';
import { Product } from '../types';
import { X, Check, ShoppingCart, DollarSign, CreditCard, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PosModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmSale: (productId: string, quantity: number, paymentMethod: 'EFECTIVO' | 'TRANSFERENCIA' | 'DEBITO') => void;
}

export function PosModal({ products, isOpen, onClose, onConfirmSale }: PosModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TRANSFERENCIA' | 'DEBITO'>('EFECTIVO');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const maxStock = currentProduct ? currentProduct.stock : 0;
  const totalPrice = currentProduct ? currentProduct.price * quantity : 0;

  const handleSale = () => {
    if (!currentProduct || maxStock < quantity) return;
    onConfirmSale(currentProduct.id, quantity, paymentMethod);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Venta Rápida en Mostrador</h3>
              <p className="text-xs text-slate-500">Cobro express de bebidas y accesorios</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {successNotice ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-900">¡Venta Registrada!</p>
              <p className="text-sm text-slate-500">Stock descontado y cobro sumado a los ingresos diarios.</p>
            </div>
          ) : (
            <>
              {/* Product Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Seleccionar Producto
                </label>
                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {products.map((p) => {
                    const isSelected = p.id === currentProduct?.id;
                    const isOutOfStock = p.stock === 0;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setQuantity(1);
                        }}
                        className={clsx(
                          'p-3 rounded-xl border text-left flex flex-col justify-between transition-all',
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20' 
                            : 'border-slate-200 hover:border-slate-300 bg-white',
                          isOutOfStock && 'opacity-50 cursor-not-allowed bg-slate-50'
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm text-slate-900 leading-tight">{p.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <span className="font-bold text-slate-900">${p.price}</span>
                          <span className={clsx("font-medium", p.stock < 5 ? "text-rose-600" : "text-slate-500")}>
                            {p.stock > 0 ? `${p.stock} disp.` : 'Sin stock'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      disabled={quantity >= maxStock}
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Método de Pago
                  </label>
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {(['EFECTIVO', 'TRANSFERENCIA', 'DEBITO'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={clsx(
                          'flex-1 py-2 text-[11px] font-bold rounded-lg transition-all',
                          paymentMethod === method
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        )}
                      >
                        {method === 'EFECTIVO' ? 'Efectivo' : method === 'TRANSFERENCIA' ? 'Transf.' : 'Débito'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total a cobrar</p>
                  <p className="text-2xl font-bold">${totalPrice.toLocaleString('es-AR')}</p>
                </div>
                <button
                  type="button"
                  disabled={maxStock === 0}
                  onClick={handleSale}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  Confirmar Cobro <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
