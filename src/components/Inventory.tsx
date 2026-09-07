import React from 'react';
import { Product } from '../types';
import { Package, Plus, ShoppingCart } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onOpenPos: () => void;
}

export function Inventory({ products, onOpenPos }: InventoryProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Inventario</h2>
          <p className="text-slate-500 mt-1">Control de stock de bebidas, suplementos y cobro en mostrador.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onOpenPos}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Venta Rápida / Cobro
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                {product.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">${product.price.toLocaleString('es-AR')}</p>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Stock</p>
                <p className={`font-bold ${product.stock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {product.stock} un.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
