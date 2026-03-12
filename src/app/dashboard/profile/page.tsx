
"use client"

import { useAltogen } from '@/lib/store'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Settings, 
  MessageCircle, 
  LogOut, 
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  Smartphone,
  Send
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, logout } = useAltogen()
  const router = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const sections = [
    {
      title: "Data & Keamanan",
      items: [
        { label: "Data E-Wallet", icon: Smartphone, color: "text-blue-400", href: "#" },
        { label: "Ketentuan Layanan", icon: FileText, color: "text-muted-foreground", href: "#" },
        { label: "Kebijakan Privasi", icon: ShieldAlert, color: "text-red-400", href: "#" },
      ]
    },
    {
      title: "Dukungan & Komunitas",
      items: [
        { label: "Channel Telegram", icon: Send, color: "text-sky-400", href: "https://t.me/altomediaindonesia" },
        { label: "Grup WhatsApp", icon: MessageCircle, color: "text-green-400", href: "https://chat.whatsapp.com/..." },
        { label: "Tentang Kami", icon: HelpCircle, color: "text-primary", href: "#" },
      ]
    }
  ]

  return (
    <div className="p-6 space-y-8 pb-24">
      {/* User Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
            <Badge className="bg-transparent border-none p-0"><Settings size={14} className="text-white" /></Badge>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-headline font-bold">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20">
            Code: {user.referralCode}
          </Badge>
          {user.packageExpiry && (
            <Badge className="rounded-full gradient-primary border-none">Premium</Badge>
          )}
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">{section.title}</h4>
            <div className="grid gap-2">
              {section.items.map((item, i) => (
                <Link key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : '_self'}>
                  <Card className="bg-secondary border-white/5 hover:bg-white/5 active:scale-[0.98] transition-all rounded-2xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-background flex items-center justify-center ${item.color}`}>
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-bold">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="ghost" 
        onClick={handleLogout}
        className="w-full h-14 rounded-2xl text-red-400 hover:text-red-400 hover:bg-red-500/10 font-bold"
      >
        <LogOut size={18} className="mr-2" /> Keluar Akun
      </Button>

      <div className="text-center space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Altogen v2.5.0</p>
        <p className="text-[9px] text-muted-foreground/60 italic px-8">Disclaimer: Seluruh transaksi & aktivitas di platform ini merupakan tanggung jawab pengguna.</p>
      </div>
    </div>
  )
}
