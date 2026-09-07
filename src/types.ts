export type Role = 'ADMIN' | 'EMPLOYEE';

export type MembershipStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'DEBITO';

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  membershipExpiry: string;
  status: MembershipStatus;
  fingerprintId?: string;
  totalAttendances: number;
  attendancesHistory?: string[]; // Array of ISO dates
  planId?: string;
  planName?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: 'MEMBERSHIP' | 'PRODUCT';
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: string; // ISO date or time
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  newMembers: number;
}
