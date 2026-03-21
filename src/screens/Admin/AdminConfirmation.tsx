import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';

interface Transaction {
  id: string;
  userId: string;
  email: string;
  amount: number;
  status: string;
  planDays: number;
}

export const approveTransaction = async (orderId: string, userId: string, days: number) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  try {
    // 1. Update Transaksi
    const transPath = `transactions/${orderId}`;
    await updateDoc(doc(db, "transactions", orderId), { status: "success" });

    // 2. Aktifkan Paket User
    const userPath = `users/${userId}`;
    await updateDoc(doc(db, "users", userId), {
      "subscription.isActive": true,
      "subscription.expiryDate": expiry,
      "subscription.status": "PRO"
    });
    
    alert("User Berhasil Diaktifkan!");
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `transactions/${orderId} or users/${userId}`);
  }
};

export default function AdminConfirmation() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(transData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (trans: Transaction) => {
    await approveTransaction(trans.id, trans.userId, trans.planDays || 30);
  };

  const handleReject = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "transactions", orderId), { status: "rejected" });
      alert("Transaksi Ditolak");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Payment Validation</h2>
      
      {transactions.length === 0 ? (
        <div className="p-12 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
          <FileText className="mx-auto text-zinc-300 mb-4" size={48} />
          <p className="text-zinc-500 font-medium">No pending transactions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(trans => (
            <div key={trans.id} className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-zinc-100 flex items-center justify-center text-zinc-400 relative">
                <FileText size={48} />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-zinc-900 shadow-sm">
                  PENDING
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-zinc-900">Order #{trans.id.slice(-4).toUpperCase()}</h3>
                    <p className="text-sm text-zinc-500">{trans.email}</p>
                  </div>
                  <div className="text-xl font-black tracking-tighter italic">
                    IDR {trans.amount?.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleReject(trans.id)}
                    className="flex-1 p-3 bg-zinc-100 text-zinc-600 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-200 transition-colors"
                  >
                    <XCircle size={20} /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(trans)}
                    className="flex-1 p-3 bg-zinc-900 text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-800 transition-colors active:scale-95"
                  >
                    <CheckCircle size={20} /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
