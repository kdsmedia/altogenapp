import React from 'react';
import { BarChart3, Users, CreditCard, Settings, ShieldCheck, Key, Wallet, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';

export default function AdminPanel() {
  const navigate = useNavigate();
  const isAdmin = auth.currentUser?.email === 'appsidhanie@gmail.com';

  if (!isAdmin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-black italic tracking-tighter uppercase">Akses Ditolak</h2>
        <p className="text-zinc-500 text-sm max-w-xs">Anda tidak memiliki izin untuk mengakses panel ini.</p>
        <Link to="/" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Konfirmasi Pembayaran QRIS",
      icon: <CreditCard size={20} />,
      path: "/admin/confirm",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Kelola User & Paket (Harga/Durasi)",
      icon: <Users size={20} />,
      path: "/admin/users",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Kelola Rekening (DANA/Bank/QRIS)",
      icon: <Wallet size={20} />,
      path: "/admin/accounts",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "Kelola API KEY Gemini 1 & 2",
      icon: <Key size={20} />,
      path: "/admin/api-keys",
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="p-6 space-y-8 pb-24 bg-white min-h-full">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic leading-none">ADMIN<span className="text-zinc-300">PANEL</span></h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Welcome back, Admin.</p>
        </div>
        <ShieldCheck className="text-zinc-200" size={40} />
      </header>

      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <Link 
            key={index}
            to={item.path}
            className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-zinc-200 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <span className="font-black italic text-sm tracking-tight uppercase text-zinc-800">{item.title}</span>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="p-6 bg-red-50 border border-red-100 rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">System Status</p>
            <p className="text-sm font-black italic tracking-tighter text-red-600">Maintenance Mode: OFF</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all active:scale-95">
          TOGGLE
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Users</p>
          <p className="text-2xl font-black italic tracking-tighter">1,234</p>
        </div>
        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Today Revenue</p>
          <p className="text-2xl font-black italic tracking-tighter text-emerald-600">Rp 450k</p>
        </div>
      </div>
    </div>
  );
}
