
"use client"

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAltogen } from '@/lib/store'
import { QrCode, TrendingUp, History, Download, Info, Timer, Smartphone, User, Wallet } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import confetti from 'canvas-confetti'

const QRIS_BASE = "00020101021126610014COM.GO-JEK.WWW01189360091439663050810210G9663050810303UMI51440014ID.CO.QRIS.WWW0215ID10254671365660303UMI5204549953033605802ID5917ALTOMEDIA, Grosir6008KARAWANG61054136162070703A016304D21A";

function crc16(data: string) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export default function WalletPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'deposit'
  const { user } = useAltogen()
  const { toast } = useToast()

  // Form States
  const [amount, setAmount] = useState('')
  const [ewalletName, setEwalletName] = useState('')
  const [userName, setUserName] = useState('')
  const [ewalletNumber, setEwalletNumber] = useState('')
  
  // QRIS States
  const [qrisData, setQrisData] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(180)
  const [isExpired, setIsExpired] = useState(false)
  const [trxId, setTrxId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const qrRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const presetAmounts = [10000, 50000, 100000, 250000]

  useEffect(() => {
    if (qrisData && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [qrisData])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleGenerateQR = () => {
    if (!amount || parseInt(amount) < 10000) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Minimal deposit Rp 10.000" })
      return
    }
    if (!ewalletName || !userName || !ewalletNumber) {
      toast({ variant: "destructive", title: "Missing Info", description: "Harap lengkapi semua data pengirim." })
      return
    }

    setIsLoading(true)
    
    // Simulate generation delay
    setTimeout(() => {
      const qrisTanpaCRC = QRIS_BASE.split("6304")[0]
      const tagNominal = "54" + amount.length.toString().padStart(2, '0') + amount
      const dataSiapCRC = qrisTanpaCRC + tagNominal + "6304"
      const fullQRIS = dataSiapCRC + crc16(dataSiapCRC)

      setQrisData(fullQRIS)
      setTrxId("TRX-" + Math.floor(Date.now() / 1000))
      setTimeLeft(180)
      setIsExpired(false)
      setIsLoading(false)
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A26EF7', '#7AC6FF', '#ffffff']
      })

      toast({ title: "QRIS Generated", description: "Silahkan simpan QR untuk pembayaran." })
      
      // Voice synthesis simulation
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Silahkan simpan atau screenshot kris untuk melakukan top up")
        msg.lang = 'id-ID'
        window.speechSynthesis.speak(msg)
      }
    }, 800)
  }

  const handleDownloadQR = async () => {
    if (!qrRef.current) return
    const canvas = await html2canvas(qrRef.current)
    const link = document.createElement('a')
    link.download = `QRIS-ALTOGEN-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!user) return null

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold">Financial Center</h2>
        <p className="text-muted-foreground text-sm">Grow your assets with digital fluidty.</p>
      </div>

      <Card className="bg-primary/10 border-primary/20 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <CardContent className="p-6 flex flex-col items-center gap-2 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Total Balance</span>
          <h3 className="text-4xl font-headline font-bold tracking-tighter">Rp {user.balance.toLocaleString('id-ID')}</h3>
        </CardContent>
      </Card>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary rounded-2xl p-1 h-14 border border-white/5">
          <TabsTrigger value="deposit" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Top Up</TabsTrigger>
          <TabsTrigger value="withdraw" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Withdraw</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">E-Wallet Asal</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Contoh: DANA / OVO / GoPay"
                    value={ewalletName}
                    onChange={(e) => setEwalletName(e.target.value)}
                    className="bg-secondary border-white/10 h-11 pl-10 rounded-xl focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Nama Anda</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <Input 
                      placeholder="Nama Sesuai App"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-secondary border-white/10 h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Nomor E-Wallet</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <Input 
                      placeholder="08xx..."
                      value={ewalletNumber}
                      onChange={(e) => setEwalletNumber(e.target.value)}
                      className="bg-secondary border-white/10 h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Pilih Nominal</Label>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((preset) => (
                  <Button 
                    key={preset} 
                    variant="outline" 
                    onClick={() => setAmount(preset.toString())}
                    className={`rounded-2xl border-white/10 h-12 font-bold transition-all ${amount === preset.toString() ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'bg-secondary'}`}
                  >
                    Rp {preset.toLocaleString('id-ID')}
                  </Button>
                ))}
              </div>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Atau ketik nominal lain (Min 10rb)"
                className="bg-secondary border-white/10 h-12 rounded-xl text-center font-bold"
              />
            </div>

            <Button onClick={handleGenerateQR} disabled={isLoading} className="w-full h-14 rounded-2xl gradient-primary text-lg font-bold shadow-lg shadow-primary/20">
              {isLoading ? 'Sedang Memproses...' : 'BUAT QRIS PEMBAYARAN'}
            </Button>
          </div>

          {qrisData && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div ref={qrRef} className="bg-white p-8 rounded-[2rem] flex flex-col items-center gap-6 shadow-2xl">
                <div className="w-full flex justify-between items-center">
                  <div className="w-16 h-5 bg-red-600 rounded flex items-center justify-center text-[8px] text-white font-black">QRIS</div>
                  <div className="text-black font-black text-xs tracking-tighter">GPN QR CODE</div>
                  <div className="w-16 h-5 bg-red-600 rounded flex items-center justify-center text-[8px] text-white font-black">QRIS</div>
                </div>
                
                <div className={`p-4 border-2 border-dashed border-gray-200 rounded-2xl relative ${isExpired ? 'opacity-20' : ''}`}>
                  <QRCodeSVG value={qrisData} size={220} level="M" />
                  {isExpired && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">EXPIRED</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="text-black font-black text-3xl tracking-tighter">Rp {parseInt(amount).toLocaleString('id-ID')}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{trxId}</p>
                </div>
                
                <div className="w-full h-px bg-gray-100 border-dashed border-t" />
                
                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full">
                  <Timer size={14} />
                  <span className="text-xs font-black">{isExpired ? 'Waktu Habis' : `Selesaikan dalam ${formatTime(timeLeft)}`}</span>
                </div>
              </div>

              <div className="bg-secondary/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-sm text-primary">Cara Pembayaran:</h4>
                <ol className="text-xs text-muted-foreground space-y-3 list-decimal pl-4 leading-relaxed">
                  <li>Klik tombol <b className="text-white">"SIMPAN QR CODE"</b> di bawah.</li>
                  <li>Buka aplikasi <b className="text-white">BCA, Dana, OVO, GoPay,</b> atau E-Wallet lainnya.</li>
                  <li>Pilih menu <b className="text-white">Scan / Bayar / QRIS</b>.</li>
                  <li>Klik ikon <b className="text-white">Galeri</b> dan pilih gambar yang baru disimpan.</li>
                  <li>Konfirmasi nominal <b className="text-white">Rp {parseInt(amount).toLocaleString('id-ID')}</b> dan selesaikan bayar.</li>
                </ol>
              </div>

              {!isExpired && (
                <Button onClick={handleDownloadQR} className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg">
                  <Download size={20} className="mr-2" /> SIMPAN QR CODE
                </Button>
              )}
              
              <Button variant="ghost" onClick={() => setQrisData(null)} className="w-full text-muted-foreground text-xs">
                Batalkan Transaksi
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6 pt-6">
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 flex gap-4">
            <Info size={20} className="text-accent shrink-0" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-accent">Info Penarikan</h5>
              <p className="text-[11px] text-accent/80 leading-relaxed">
                Minimal penarikan adalah Rp 100.000. Biaya admin flat 10%. Proses manual 1-24 jam kerja.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">E-Wallet Tujuan (DANA/OVO/GoPay)</Label>
              <Input 
                placeholder="Contoh: DANA - 08123456789"
                className="bg-secondary border-white/10 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Jumlah Penarikan (Rp)</Label>
              <Input 
                type="number" 
                placeholder="Min 100,000"
                className="bg-secondary border-white/10 h-12 rounded-xl"
              />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold shadow-lg shadow-accent/10">
              Kirim Permintaan
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-bold">Transaksi Terakhir</h4>
            <History size={16} className="text-muted-foreground" />
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-secondary transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${i % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'} flex items-center justify-center three-d-shadow`}>
                  {i % 2 === 0 ? <TrendingUp size={20} /> : <QrCode size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold">{i % 2 === 0 ? 'Referral Bonus' : 'Deposit QRIS'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">1{i} Feb 2024 • 14:2{i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${i % 2 === 0 ? 'text-primary' : 'text-white'}`}>
                  {i % 2 === 0 ? '+' : ''}Rp {(50000 * i).toLocaleString('id-ID')}
                </p>
                <Badge variant="outline" className="text-[8px] py-0 h-4 border-white/10 text-muted-foreground uppercase font-black">Success</Badge>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Menampilkan 3 transaksi terakhir</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
