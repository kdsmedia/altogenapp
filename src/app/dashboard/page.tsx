
"use client"

import { useAltogen } from '@/lib/store'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Zap, Bell, ChevronRight, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAltogen()

  if (!user) return null

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-headline font-bold">Halo, {user.name.split(' ')[0]}!</h2>
          <p className="text-xs text-muted-foreground">Inovasi tanpa batas dimulai hari ini.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </div>
      </div>

      {/* Main Balance Card */}
      <Card className="bg-primary gradient-primary border-none rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/70">Total Saldo</span>
              <h3 className="text-3xl font-headline font-bold text-white tracking-tighter">
                Rp {user.balance.toLocaleString('id-ID')}
              </h3>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-md">
              {user.packageExpiry ? 'Premium' : 'Free User'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/saldo?tab=deposit" className="flex-1">
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white text-xs font-bold rounded-xl h-10 backdrop-blur-md">
                Isi Saldo
              </Button>
            </Link>
            <Link href="/dashboard/saldo?tab=withdraw" className="flex-1">
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white text-xs font-bold rounded-xl h-10 backdrop-blur-md">
                Tarik Tunai
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-secondary border-white/5 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Earnings</p>
              <h4 className="text-sm font-bold text-white">Rp 2.4k</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-white/5 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Referral</p>
              <h4 className="text-sm font-bold text-white">{user.referralCount} User</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Eksplorasi</h4>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
        
        <Link href="/dashboard/gen">
          <Card className="bg-card border-white/5 rounded-3xl overflow-hidden group hover:border-primary/50 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold">AI Creative Engine</h5>
                <p className="text-[10px] text-muted-foreground">Mulai buat konten promosi Anda sekarang.</p>
              </div>
              <Badge variant="secondary" className="text-[8px] h-4">NEW</Badge>
            </CardContent>
          </Card>
        </Link>

        <Link href="https://t.me/altomediaindonesia" target="_blank">
          <Card className="bg-sky-500/5 border-sky-500/20 rounded-3xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-lg">
                <MessageSquare size={24} />
              </div>
              <div>
                <h5 className="text-sm font-bold">Grup Telegram</h5>
                <p className="text-[10px] text-muted-foreground">Bergabung dengan komunitas Altomedia.</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
