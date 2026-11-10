import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MembersList } from './components/MembersList';
import { Inventory } from './components/Inventory';
import { AccessControl } from './components/AccessControl';
import { CashRegister } from './components/CashRegister';
import { PlansManagement } from './components/PlansManagement';
import { RoutinesManagement } from './components/RoutinesManagement';
import { MemberPortal } from './components/MemberPortal';
import { PosModal } from './components/PosModal';
import { NewMemberModal } from './components/NewMemberModal';
import { WhatsappNotificationModal } from './components/WhatsappNotificationModal';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { ProductModal } from './components/ProductModal';
import { PlanModal } from './components/PlanModal';
import { RoutineModal } from './components/RoutineModal';
import { ExerciseStudioModal } from './components/ExerciseStudioModal';
import { mockMembers, mockProducts, mockPlans, mockTransactions, mockRoutines, mockExerciseCatalog } from './data/mockData';
import { Member, Product, Plan, Transaction, PaymentMethod, Routine, CatalogExercise } from './types';
import { addDays, format } from 'date-fns';

function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Persistent Reactive State (survives page refreshes & code updates)
  const [members, setMembers] = useState<Member[]>(() => loadSaved('gymflow_members_v1', mockMembers));
  const [products, setProducts] = useState<Product[]>(() => loadSaved('gymflow_products_v1', mockProducts));
  const [plans, setPlans] = useState<Plan[]>(() => loadSaved('gymflow_plans_v1', mockPlans));
  const [routines, setRoutines] = useState<Routine[]>(() => loadSaved('gymflow_routines_v1', mockRoutines));
  const [exerciseCatalog, setExerciseCatalog] = useState<CatalogExercise[]>(() =>
    loadSaved('gymflow_catalog_v1', mockExerciseCatalog)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadSaved('gymflow_transactions_v1', mockTransactions)
  );

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_members_v1', JSON.stringify(members));
    } catch {}
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_products_v1', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_plans_v1', JSON.stringify(plans));
    } catch {}
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_routines_v1', JSON.stringify(routines));
    } catch {}
  }, [routines]);

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_catalog_v1', JSON.stringify(exerciseCatalog));
    } catch {}
  }, [exerciseCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem('gymflow_transactions_v1', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  // Modals & Drawers State
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [whatsappMember, setWhatsappMember] = useState<Member | null>(null);
  
  // CRUD Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>();
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | undefined>();
  const [isExerciseStudioOpen, setIsExerciseStudioOpen] = useState(false);
  const [editingCatalogExercise, setEditingCatalogExercise] = useState<CatalogExercise | undefined>();

  const registerTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `TX-${Date.now()}`,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    setTransactions(prev => [...prev, newTx]);
  };

  // Handlers
  const handleConfirmSale = (productId: string, quantity: number, paymentMethod: PaymentMethod) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    // Deduct stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock - quantity) };
      }
      return p;
    }));

    // Register transaction
    registerTransaction({
      type: 'PRODUCT',
      description: `Venta: ${targetProd.name} x${quantity}`,
      amount: targetProd.price * quantity,
      paymentMethod,
    });
  };

  const handleRenewMembership = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const targetPlan = plans.find(p => p.id === m.planId || p.name === m.planName) || plans[0];
        
        registerTransaction({
          type: 'MEMBERSHIP',
          description: `Renovación: ${m.name} (${targetPlan.name})`,
          amount: targetPlan.price,
          paymentMethod: 'EFECTIVO', // defaulting for quick renew
        });

        const newExpiry = format(addDays(new Date(), targetPlan.durationDays), 'yyyy-MM-dd');
        const updated = {
          ...m,
          membershipExpiry: newExpiry,
          status: 'ACTIVE' as const,
        };
        if (selectedMember && selectedMember.id === memberId) {
          setSelectedMember(updated);
        }
        return updated;
      }
      return m;
    }));
  };

  const handleCreateMember = (name: string, email: string, phone: string, planId: string, paymentMethod: PaymentMethod, fingerprintId?: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    const newMember: Member = {
      id: `M-${Date.now()}`,
      name,
      email,
      phone,
      joinDate: format(new Date(), 'yyyy-MM-dd'),
      membershipExpiry: format(addDays(new Date(), selectedPlan.durationDays), 'yyyy-MM-dd'),
      status: 'ACTIVE',
      totalAttendances: 0,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      assignedRoutineId: routines[0]?.id,
      attendancesHistory: [],
      fingerprintId,
    };

    setMembers(prev => [newMember, ...prev]);

    registerTransaction({
      type: 'MEMBERSHIP',
      description: `Alta Socio: ${newMember.name} (${selectedPlan.name})`,
      amount: selectedPlan.price,
      paymentMethod,
    });
  };

  const handleAssignRoutine = (memberId: string, routineId: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          const updated = { ...m, assignedRoutineId: routineId || undefined };
          if (selectedMember?.id === memberId) {
            setSelectedMember(updated);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const expiringCount = members.filter(m => m.status === 'EXPIRING_SOON').length;

  // CRUD Handlers
  const handleSaveProduct = (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      setProducts(prev => prev.map(p => p.id === id ? { ...productData, id } : p));
    } else {
      setProducts(prev => [...prev, { ...productData, id: `P-${Date.now()}` }]);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSavePlan = (planData: Omit<Plan, 'id'>, id?: string) => {
    if (id) {
      setPlans(prev => prev.map(p => p.id === id ? { ...planData, id } : p));
    } else {
      setPlans(prev => [...prev, { ...planData, id: `PLAN-${Date.now()}` }]);
    }
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveRoutine = (routineData: Omit<Routine, 'id'>, id?: string) => {
    if (id) {
      setRoutines(prev => prev.map(r => r.id === id ? { ...routineData, id } : r));
    } else {
      setRoutines(prev => [...prev, { ...routineData, id: `RUT-${Date.now()}` }]);
    }
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveCatalogExercise = (exerciseData: Omit<CatalogExercise, 'id'>, id?: string) => {
    if (id) {
      const previousCat = exerciseCatalog.find(c => c.id === id);
      setExerciseCatalog(prev => prev.map(c => (c.id === id ? { ...exerciseData, id } : c)));

      // Propagate updated GIF, customFrames, animationType, speed, name, and muscleGroup to all Routines using this exercise!
      setRoutines(prevRoutines =>
        prevRoutines.map(routine => ({
          ...routine,
          exercises: routine.exercises.map(ex => {
            const isMatch =
              ex.catalogExerciseId === id ||
              (previousCat && ex.name.toLowerCase().trim() === previousCat.name.toLowerCase().trim()) ||
              ex.name.toLowerCase().trim() === exerciseData.name.toLowerCase().trim();

            if (!isMatch) return ex;

            return {
              ...ex,
              catalogExerciseId: id,
              name: exerciseData.name,
              muscleGroup: exerciseData.muscleGroup,
              animationType: exerciseData.animationType,
              animationSpeed: exerciseData.animationSpeed,
              imageUrl: exerciseData.imageUrl,
              customFrames: exerciseData.customFrames,
              notes: exerciseData.notes || ex.notes,
            };
          }),
        }))
      );
    } else {
      setExerciseCatalog(prev => [{ ...exerciseData, id: `CAT-${Date.now()}` }, ...prev]);
    }
  };

  const handleDeleteCatalogExercise = (id: string) => {
    setExerciseCatalog(prev => prev.filter(c => c.id !== id));
  };

  // Calculate daily sales for dashboard
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const dailySalesIncome = transactions
    .filter(t => t.timestamp.startsWith(todayStr))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenPos={() => setIsPosOpen(true)}
        activeExpiringCount={expiringCount}
      />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            members={members}
            dailySalesIncome={dailySalesIncome}
            onOpenPos={() => setIsPosOpen(true)}
            onSelectMember={(m) => setSelectedMember(m)}
            onOpenWhatsapp={(m) => setWhatsappMember(m)}
          />
        )}
        {activeTab === 'cashregister' && (
          <CashRegister transactions={transactions} />
        )}
        {activeTab === 'members' && (
          <MembersList 
            members={members}
            onSelectMember={(m) => setSelectedMember(m)}
            onOpenWhatsapp={(m) => setWhatsappMember(m)}
            onOpenNewMember={() => setIsNewMemberOpen(true)}
          />
        )}
        {activeTab === 'routines' && (
          <RoutinesManagement
            routines={routines}
            members={members}
            exerciseCatalog={exerciseCatalog}
            onAddRoutine={() => { setEditingRoutine(undefined); setIsRoutineModalOpen(true); }}
            onEditRoutine={(r) => { setEditingRoutine(r); setIsRoutineModalOpen(true); }}
            onDeleteRoutine={handleDeleteRoutine}
            onAddCatalogExercise={() => { setEditingCatalogExercise(undefined); setIsExerciseStudioOpen(true); }}
            onEditCatalogExercise={(ex) => { setEditingCatalogExercise(ex); setIsExerciseStudioOpen(true); }}
            onDeleteCatalogExercise={handleDeleteCatalogExercise}
            onOpenPortal={() => setActiveTab('member-portal')}
          />
        )}
        {activeTab === 'member-portal' && (
          <MemberPortal
            members={members}
            routines={routines}
          />
        )}
        {activeTab === 'plans' && (
          <PlansManagement 
            plans={plans}
            onAddPlan={() => { setEditingPlan(undefined); setIsPlanModalOpen(true); }}
            onEditPlan={(p) => { setEditingPlan(p); setIsPlanModalOpen(true); }}
            onDeletePlan={handleDeletePlan}
          />
        )}
        {activeTab === 'inventory' && (
          <Inventory 
            products={products}
            onOpenPos={() => setIsPosOpen(true)}
            onAddProduct={() => { setEditingProduct(undefined); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
        {activeTab === 'access' && <AccessControl />}
      </main>

      {/* Interactive Floating / Modal Components */}
      <PosModal products={products} isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} onConfirmSale={handleConfirmSale} />
      <NewMemberModal isOpen={isNewMemberOpen} onClose={() => setIsNewMemberOpen(false)} plans={plans} onCreateMember={handleCreateMember} />
      <WhatsappNotificationModal member={whatsappMember} isOpen={!!whatsappMember} onClose={() => setWhatsappMember(null)} onNotificationSent={() => {}} />
      <MemberDetailDrawer
        member={selectedMember}
        plans={plans}
        routines={routines}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onRenewMembership={handleRenewMembership}
        onAssignRoutine={handleAssignRoutine}
        onOpenWhatsapp={(m) => setWhatsappMember(m)}
        onOpenPortalForMember={() => {
          setSelectedMember(null);
          setActiveTab('member-portal');
        }}
      />
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} product={editingProduct} />
      <PlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} onSave={handleSavePlan} plan={editingPlan} />
      <RoutineModal isOpen={isRoutineModalOpen} onClose={() => setIsRoutineModalOpen(false)} onSave={handleSaveRoutine} routine={editingRoutine} exerciseCatalog={exerciseCatalog} />
      <ExerciseStudioModal isOpen={isExerciseStudioOpen} onClose={() => setIsExerciseStudioOpen(false)} onSave={handleSaveCatalogExercise} initialExercise={editingCatalogExercise} />

    </div>
  );
}

