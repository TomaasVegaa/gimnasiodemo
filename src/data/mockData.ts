import { Member, Product, MonthlyStats, Plan, Transaction } from '../types';
import { addDays, subDays, format } from 'date-fns';

export const today = new Date();

export const mockPlans: Plan[] = [
  { id: 'PLAN-1', name: 'Pase Libre Musculación', price: 22000, durationDays: 30 },
  { id: 'PLAN-2', name: 'Pase 3 días x semana', price: 18000, durationDays: 30 },
  { id: 'PLAN-3', name: 'Pase Anual Libre', price: 220000, durationDays: 365 },
  { id: 'PLAN-4', name: 'Clase Suelta / Pase Diario', price: 3000, durationDays: 1 },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TX-1001',
    type: 'MEMBERSHIP',
    description: 'Pago cuota: Carlos Rodríguez (Pase Libre)',
    amount: 22000,
    paymentMethod: 'EFECTIVO',
    timestamp: format(subDays(today, 0), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'TX-1002',
    type: 'PRODUCT',
    description: 'Venta: Agua Mineral 500ml x2',
    amount: 1600,
    paymentMethod: 'TRANSFERENCIA',
    timestamp: format(subDays(today, 0), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'TX-1003',
    type: 'MEMBERSHIP',
    description: 'Pago cuota: Nuevo Socio - Juan Pérez',
    amount: 18000,
    paymentMethod: 'DEBITO',
    timestamp: format(subDays(today, 0), 'yyyy-MM-dd HH:mm:ss'),
  },
];

export const mockMembers: Member[] = [
  {
    id: 'M-1001',
    name: 'Carlos Rodríguez',
    email: 'carlos.r@example.com',
    phone: '+54 11 1234-5678',
    joinDate: format(subDays(today, 120), 'yyyy-MM-dd'),
    membershipExpiry: format(addDays(today, 15), 'yyyy-MM-dd'),
    status: 'ACTIVE',
    fingerprintId: 'FP-8472',
    totalAttendances: 45,
    planName: 'Pase Libre Musculación',
    attendancesHistory: [
      format(today, 'yyyy-MM-dd'),
      format(subDays(today, 1), 'yyyy-MM-dd'),
      format(subDays(today, 3), 'yyyy-MM-dd'),
      format(subDays(today, 5), 'yyyy-MM-dd'),
      format(subDays(today, 7), 'yyyy-MM-dd'),
      format(subDays(today, 8), 'yyyy-MM-dd'),
      format(subDays(today, 10), 'yyyy-MM-dd'),
    ],
  },
  {
    id: 'M-1002',
    name: 'Laura Gómez',
    email: 'laura.g@example.com',
    phone: '+54 11 9876-5432',
    joinDate: format(subDays(today, 60), 'yyyy-MM-dd'),
    membershipExpiry: format(addDays(today, 2), 'yyyy-MM-dd'),
    status: 'EXPIRING_SOON',
    fingerprintId: 'FP-2938',
    totalAttendances: 18,
    planName: 'Pase 3 días x semana',
    attendancesHistory: [
      format(subDays(today, 2), 'yyyy-MM-dd'),
      format(subDays(today, 4), 'yyyy-MM-dd'),
      format(subDays(today, 6), 'yyyy-MM-dd'),
      format(subDays(today, 9), 'yyyy-MM-dd'),
      format(subDays(today, 11), 'yyyy-MM-dd'),
    ],
  },
  {
    id: 'M-1003',
    name: 'Martín Silva',
    email: 'martin.s@example.com',
    phone: '+54 11 5555-4444',
    joinDate: format(subDays(today, 200), 'yyyy-MM-dd'),
    membershipExpiry: format(subDays(today, 5), 'yyyy-MM-dd'),
    status: 'EXPIRED',
    fingerprintId: 'FP-1029',
    totalAttendances: 82,
    planName: 'Pase Libre Musculación',
    attendancesHistory: [
      format(subDays(today, 6), 'yyyy-MM-dd'),
      format(subDays(today, 8), 'yyyy-MM-dd'),
      format(subDays(today, 12), 'yyyy-MM-dd'),
    ],
  },
];

export const mockProducts: Product[] = [
  { id: 'P-001', name: 'Agua Mineral 500ml', price: 800, stock: 45, category: 'Bebidas' },
  { id: 'P-002', name: 'Gatorade 500ml', price: 1500, stock: 20, category: 'Bebidas' },
  { id: 'P-003', name: 'Barra de Proteína', price: 2200, stock: 15, category: 'Snacks' },
  { id: 'P-004', name: 'Toalla de Mano', price: 3500, stock: 8, category: 'Accesorios' },
];

export const mockMonthlyStats: MonthlyStats[] = [
  { month: 'Ene', income: 450000, newMembers: 25 },
  { month: 'Feb', income: 480000, newMembers: 28 },
  { month: 'Mar', income: 520000, newMembers: 35 },
  { month: 'Abr', income: 505000, newMembers: 22 },
  { month: 'May', income: 560000, newMembers: 40 },
  { month: 'Jun', income: 610000, newMembers: 45 },
];
