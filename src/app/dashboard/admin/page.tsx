"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Ban, Bell, CheckCircle, XCircle } from 'lucide-react'
import { useAltogen } from '@/lib/store'
import { redirect } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { db } from '@/lib/firebase/config'
import { collection, query, onSnapshot, doc, updateDoc, increment, getDocs, where } from 'firebase/firestore'

export default function AdminDashboardPage() {
  const { user } = useAltogen()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')

  useEffect(() => {
    if (user && user.email !== 'appsidhanie@gmail.com') {
      redirect('/dashboard')
    }
  }, [user])

  useEffect(() => {
    if (!user || user.email !== 'appsidhanie@gmail.com') return

    // Stream Users
    const qUsers = query(collection(db, 'users'))
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    // Stream Transactions
    const qTx = query(collection(db, 'transactions'), where('status', '==', 'pending'))
    const unsubTx = onSnapshot(qTx, (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => {
      unsubUsers()
      unsubTx()
    }
  }, [user])

  const handleApproveTx = async (tx: any) => {
    try {
      const txRef = doc(db, 'transactions', tx.id)
      const userRef = doc(db, 'users', tx.userId)

      if (tx.type === 'deposit') {
        await updateDoc(userRef, { balance: increment(tx.amount) })
      } else if (tx.type === 'subscription') {
        const days = tx.days || 7
        const now = new Date()
        const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
        await updateDoc(userRef, { packageExpiry: expiry })
      }

      await updateDoc(txRef, { status: 'success' })
      toast({ title: "Berhasil", description: "Transaksi telah disetujui." })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Gagal memproses transaksi." })
    }
  }

  const handleRejectTx = async (txId: string) => {
    await updateDoc(doc(db, 'transactions', txId), { status: 'failed' })
    toast({ title: "Ditolak", description: "Transaksi telah ditolak." })
  }

  if (!user || user.email !== 'appsidhanie@gmail.com') return null

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-red-500">Root Access</h2>
        <p className="text-muted-foreground text-sm">Panel kendali pusat Altogen.</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary rounded-2xl h-12 p-1 border border-white/5">
          <TabsTrigger value="users" className="rounded-xl">Users</TabsTrigger>
          <TabsTrigger value="tx" className="rounded-xl">Transact</TabsTrigger>
          <TabsTrigger value="news" className="rounded-xl">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="pt-6 space-y-4">
          <div className="relative">
            <Input 
              placeholder="Cari user..." 
              className="bg-secondary border-white/10 rounded-xl pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {users.filter(u => u.email.includes(search) || u.name.toLowerCase().includes(search.toLowerCase())).map((u) => (
              <Card key={u.id} className="bg-card border-white/5 rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">Rp {u.balance.toLocaleString('id-ID')}</p>
                    <Badge variant="outline" className="text-[8px] h-4 py-0">{u.email}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                      <Ban size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tx" className="pt-6 space-y-4">
          {transactions.length === 0 && (
            <div className="bg-secondary/50 p-8 rounded-2xl border border-dashed border-white/10 text-center">
              <p className="text-xs text-muted-foreground italic">Tidak ada transaksi tertunda.</p>
            </div>
          )}
          {transactions.map((tx) => (
            <Card key={tx.id} className="bg-card border-accent/20 border-2 rounded-2xl">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-sm">{tx.userName}</h5>
                    <p className="text-[10px] text-muted-foreground tracking-widest uppercase">{tx.type} • {tx.details?.provider || 'QRIS'}</p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">PENDING</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-headline font-bold">Rp {tx.amount.toLocaleString('id-ID')}</span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleApproveTx(tx)}
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 rounded-lg h-8 px-3"
                    >
                      <CheckCircle size={14} className="mr-1" /> Konfirmasi
                    </Button>
                    <Button 
                      onClick={() => handleRejectTx(tx.id)}
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 h-8 px-3"
                    >
                      <XCircle size={14} className="mr-1" /> Tolak
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="news" className="pt-6 space-y-4">
          <div className="space-y-4">
            <textarea 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Tulis pengumuman publik untuk semua user..." 
              className="w-full bg-secondary border border-white/10 rounded-2xl p-4 h-32 text-sm focus:ring-1 ring-primary outline-none"
            />
            <Button 
              onClick={() => {
                toast({ title: "Broadcast", description: "Fitur broadcast akan segera aktif." })
                setBroadcastMessage('')
              }}
              className="w-full h-12 rounded-xl gradient-primary font-bold border-none"
            >
              <Bell size={18} className="mr-2" /> Kirim Pengumuman
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}