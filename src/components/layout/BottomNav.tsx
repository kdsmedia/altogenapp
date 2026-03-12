
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Gift, Zap, Wallet, User, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAltogen } from '@/lib/store'

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAltogen()

  const navItems = [
    { label: 'Home', icon: Home, href: '/dashboard' },
    { label: 'Bonus', icon: Gift, href: '/dashboard/bonus' },
    { label: 'Gen', icon: Zap, href: '/dashboard/gen' },
    { label: 'Saldo', icon: Wallet, href: '/dashboard/saldo' },
    { label: 'Profil', icon: User, href: '/dashboard/profile' },
  ]

  // Only show Admin if user email is appsidhanie@gmail.com
  if (user?.email === 'appsidhanie@gmail.com') {
    navItems.push({ label: 'Admin', icon: ShieldCheck, href: '/dashboard/admin' })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-white/5 pb-safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive && "bg-primary/10"
              )}>
                <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
