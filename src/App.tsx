import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MembersList } from './components/MembersList';
import { Inventory } from './components/Inventory';
import { AccessControl } from './components/AccessControl';
import { CashRegister } from './components/CashRegister';
import { PosModal } from './components/PosModal';
import { NewMemberModal } from './components/NewMemberModal';
import { WhatsappNotificationModal } from './components/WhatsappNotificationModal';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { mockMembers, mockProducts, mockPlans, mockTransactions } from './data/mockData';
import { Member, Product, Plan, Transaction, PaymentMethod } from './types';
import { addDays, format } from 'date-fns';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Reactive State
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [plans] = useState<Plan[]>(mockPlans);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  // Modals & Drawers State
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [whatsappMember, setWhatsappMember] = useState<Member | null>(null);

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

  const handleCreateMember = (name: string, email: string, phone: string, planId: string, paymentMethod: PaymentMethod) => {
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
      attendancesHistory: [],
    };

    setMembers(prev => [newMember, ...prev]);

    registerTransaction({
      type: 'MEMBERSHIP',
      description: `Alta Socio: ${newMember.name} (${selectedPlan.name})`,
      amount: selectedPlan.price,
      paymentMethod,
    });
  };

  const expiringCount = members.filter(m => m.status === 'EXPIRING_SOON').length;

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
        {activeTab === 'inventory' && (
          <Inventory 
            products={products}
            onOpenPos={() => setIsPosOpen(true)}
          />
        )}
        {activeTab === 'access' && <AccessControl />}
      </main>

      {/* Interactive Floating / Modal Components */}
      <PosModal products={products} isOpen={isPosOpen} onClose={() => setIsPosOpen(false)} onConfirmSale={handleConfirmSale} />
      <NewMemberModal isOpen={isNewMemberOpen} onClose={() => setIsNewMemberOpen(false)} plans={plans} onCreateMember={handleCreateMember} />
      <WhatsappNotificationModal member={whatsappMember} isOpen={!!whatsappMember} onClose={() => setWhatsappMember(null)} onNotificationSent={() => {}} />
      <MemberDetailDrawer member={selectedMember} plans={plans} isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} onRenewMembership={handleRenewMembership} onOpenWhatsapp={(m) => setWhatsappMember(m)} />

    </div>
  );
}
