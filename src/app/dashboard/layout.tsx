"use client"

import { BottomNav } from '@/components/layout/BottomNav'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center three-d-shadow overflow-hidden">
            {!logoError ? (
              <img 
                src="/assets/img/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-white font-headline font-bold text-xs">A</span>
            )}
          </div>
          <h1 className="text-xl font-headline font-bold tracking-tight text-white uppercase">ALTOGEN</h1>
        </div>
      </header>
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
