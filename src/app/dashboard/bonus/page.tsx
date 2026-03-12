"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAltogen } from '@/lib/store'
import { Gift, Calendar, Share2, PlayCircle, Star, Crown, Check, Loader2, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import confetti from 'canvas-confetti'
import { AdBanner } from '@/components/ads/AdBanner'
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function BonusPage() {
  const { user, checkIn, watchVideo, updateSubscription, deductBalance } = useAltogen()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [adTimer, setAdTimer] = useState(15)

  const handleCheckIn = async () => {
    const success = await checkIn()
    if (success) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } })
      toast({ title: "Check-in Berhasil", description: "Rp 50 ditambahkan ke saldo Anda." })
    } else {
      toast({ variant: "destructive", title: "Gagal", description: "Anda sudah check-in hari ini." })
    }
  }

  const handleStartAd = () => {
    // Check if user has remaining video tasks
    const today = new Date().toDateString()
    const count = user?.dailyVideoCount || 0
    if (user?.lastVideoDate === today && count >= 20) {
      toast({ variant: "destructive", title: "Batas Tercapai", description: "Anda sudah menonton 20 video hari ini." })
      return
    }

    setShowAd(true)
    setAdTimer(15)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (showAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => prev - 1)
      }, 1000)
    } else if (showAd && adTimer === 0) {
      // Ad finished
    }
    return () => clearInterval(interval)
  }, [showAd, adTimer])

  const handleClaimReward = async () => {
    const result = await watchVideo()
    if (result.success) {
      setShowAd(false)
      confetti({ particleCount: 30, spread: 50 })
      toast({ title: "Reward Diklaim", description: `Rp 50 ditambahkan. Sisa hari ini: ${result.remaining}` })
    }
  }

  const buyPackage = (days: number, price: number) => {
    if (!user) return
    if (user.balance < price) {
      toast({ variant: "destructive", title: "Saldo Tidak Cukup", description: "Silahkan isi saldo terlebih dahulu." })
      return
    }
    
    setLoading(true)
    setTimeout(() => {
      deductBalance(price)
      updateSubscription(days)
      setLoading(false)
      toast({ title: "Pembelian Berhasil", description: `Paket ${days} hari aktif.` })
    }, 1000)
  }

  const packages = [
    { days: 7, price: 15000, label: "Lite" },
    { days: 10, price: 25000, label: "Medium" },
    { days: 30, price: 60000, label: "Ultimate" },
  ]

  if (!user) return null

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-primary">Pusat Bonus</h2>
        <p className="text-muted-foreground text-sm">Dapatkan keuntungan harian & aktivasi paket.</p>
      </div>

      <AdBanner />

      {/* Packages Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Crown size={16} /> Paket Langganan
        </h3>
        <div className="grid gap-3">
          {packages.map((pkg) => (
            <Card key={pkg.days} className="bg-secondary border-white/5 rounded-2xl overflow-hidden group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Paket {pkg.label} ({pkg.days} Hari)</h4>
                    <p className="text-xs text-muted-foreground">Rp {pkg.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => buyPackage(pkg.days, pkg.price)}
                  disabled={loading}
                  size="sm" 
                  className="rounded-xl gradient-primary border-none font-bold"
                >
                  Beli
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Check size={16} /> Tugas Harian
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card onClick={handleCheckIn} className="bg-card border-white/5 rounded-2xl cursor-pointer hover:bg-secondary transition-all active:scale-95">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <span className="text-xs font-bold">Check-in</span>
              <span className="text-[10px] text-primary">+Rp 50</span>
            </CardContent>
          </Card>

          <Card onClick={handleStartAd} className="bg-card border-white/5 rounded-2xl cursor-pointer hover:bg-secondary transition-all active:scale-95">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <PlayCircle size={20} />
              </div>
              <span className="text-xs font-bold">Video Reward</span>
              <span className="text-[10px] text-primary">+Rp 50</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Friends */}
      <Card className="bg-primary/5 border-dashed border-primary/20 rounded-3xl overflow-hidden">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Share2 size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg">Undang Teman</h4>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">
              Dapatkan bonus <span className="text-primary font-bold">Rp 500</span> untuk setiap teman yang mendaftar dengan kode Anda.
            </p>
          </div>
          <div className="bg-background rounded-xl p-3 flex items-center justify-between border border-white/5">
            <span className="font-headline font-bold text-primary tracking-widest">{user.referralCode}</span>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => {
              navigator.clipboard.writeText(user.referralCode)
              toast({ title: "Disalin!", description: "Kode referral berhasil disalin." })
            }}>Salin</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reward Video Dialog (Mock Ad Experience) */}
      <Dialog open={showAd} onOpenChange={(open) => !open && adTimer === 0 ? setShowAd(false) : null}>
        <DialogContent className="sm:max-w-md bg-background border-none p-0 overflow-hidden rounded-3xl">
          <div className="aspect-video bg-black flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {adTimer > 0 ? (
                <Badge variant="secondary" className="bg-white/10 backdrop-blur-md text-white border-none">
                  Sisa {adTimer} detik
                </Badge>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => setShowAd(false)} className="rounded-full bg-white/20 text-white hover:bg-white/40">
                  <X size={20} />
                </Button>
              )}
            </div>
            
            <PlayCircle size={64} className="text-primary/50 animate-pulse" />
            <p className="mt-4 text-white/50 text-xs font-bold uppercase tracking-widest">Memutar Iklan Video...</p>
            
            {/* Real AdSense Ad for Video can be placed here if enabled in dashboard */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
              <span className="text-4xl font-black">{user.referralCode}</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="text-lg font-bold">Tonton sampai selesai!</h4>
              <p className="text-xs text-muted-foreground">Selesaikan video untuk mendapatkan Rp 50 saldo instan.</p>
            </div>
            
            <Button 
              disabled={adTimer > 0} 
              onClick={handleClaimReward}
              className="w-full h-12 rounded-xl gradient-primary border-none font-bold"
            >
              {adTimer > 0 ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Menunggu Video...
                </>
              ) : (
                "KLAIM HADIAH SEKARANG"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
