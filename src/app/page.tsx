"use client"

import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap, Smartphone, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAltogen } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [logoError, setLogoError] = useState(false)
  const { user, login, loading } = useAltogen()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (isInitializing || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mb-8 three-d-shadow animate-float overflow-hidden">
          {!logoError ? (
            <img 
              src="/assets/img/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-white font-headline font-bold text-4xl">A</span>
          )}
        </div>
        <h1 className="text-3xl font-headline font-bold text-white mb-2">ALTOGEN</h1>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="mt-4 text-xs font-bold text-primary tracking-[0.3em] uppercase">Initializing Innovation</p>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[80%] h-[80%] rounded-full bg-accent/20 blur-[120px]"></div>
      </div>

      <main className="flex-1 flex flex-col p-8 justify-center items-center text-center space-y-12 max-w-lg mx-auto">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto three-d-shadow overflow-hidden">
            {!logoError ? (
              <img 
                src="/assets/img/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-white font-headline font-bold text-3xl">A</span>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-bold tracking-tighter text-white uppercase">ALTOGEN</h1>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Unlock the power of digital innovation. Manage your assets, grow your network, and innovate with the next generation financial suite.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
            <Globe className="text-primary" size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Access</span>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
            <Zap className="text-accent" size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fast Delivery</span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <Button 
            onClick={login}
            className="w-full h-16 rounded-2xl gradient-primary border-none text-lg font-bold shadow-2xl shadow-primary/20"
          >
            Get Started with Google
          </Button>
          <p className="text-[10px] text-muted-foreground leading-relaxed px-8">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>

      <footer className="p-8 text-center">
        <div className="flex justify-center gap-6 text-muted-foreground">
          <ShieldCheck size={20} className="hover:text-primary cursor-pointer transition-colors" />
          <Smartphone size={20} className="hover:text-primary cursor-pointer transition-colors" />
        </div>
      </footer>
    </div>
  )
}
