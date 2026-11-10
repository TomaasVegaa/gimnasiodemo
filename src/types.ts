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
  assignedRoutineId?: string;
}

export type RoutineGoal = 'HIPERTROFIA' | 'DEFINICION' | 'FUERZA' | 'FUNCIONAL';

export type ExerciseAnimationType =
  | 'BENCH_PRESS'
  | 'SQUAT'
  | 'DEADLIFT'
  | 'CURL'
  | 'PULLDOWN'
  | 'SHOULDER_PRESS'
  | 'PLANK'
  | 'CARDIO'
  | 'LATERAL_RAISE'
  | 'TRICEP_PUSHDOWN'
  | 'LEG_PRESS'
  | 'LUNGE'
  | 'ROW'
  | 'CRUNCH';

export type AnimationSpeed = 'SLOW' | 'NORMAL' | 'FAST';

export interface Exercise {
  id: string;
  catalogExerciseId?: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  animationType: ExerciseAnimationType;
  animationSpeed?: AnimationSpeed;
  imageUrl?: string;
  customFrames?: [string, string]; // [Posición A (Inicio), Posición B (Final)] para crear animación A<->B
}

export interface CatalogExercise {
  id: string;
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
  notes?: string;
  animationType: ExerciseAnimationType;
  animationSpeed?: AnimationSpeed;
  imageUrl?: string;
  customFrames?: [string, string];
}

export interface Routine {
  id: string;
  name: string;
  goal: RoutineGoal;
  level: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  daysPerWeek: number;
  description: string;
  exercises: Exercise[];
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

