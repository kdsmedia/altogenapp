import React, { useState, useEffect } from 'react';
import { X, Zap, ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ADMOB_CONFIG } from '../constants';

export function BannerAd() {
  return (
    <div className="w-full bg-zinc-50 border-t border-zinc-100 p-2 flex flex-col items-center">
      <div className="text-[8px] font-black uppercase tracking-widest text-zinc-300 mb-1 flex items-center gap-1">
        <Info size={8} /> AdMob Banner Simulation ({ADMOB_CONFIG.BANNER})
      </div>
      <div className="w-full h-12 bg-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 text-[10px] font-bold italic tracking-tighter">
        <Zap size={14} className="mr-2 opacity-50" /> ALTO PREMIUM ADS
      </div>
    </div>
  );
}

export function AppOpenAd({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [countdown, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8"
    >
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-12">
        AdMob App Open ({ADMOB_CONFIG.APP_OPEN})
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-zinc-900 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl">
          <Zap size={64} className="text-white fill-white" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter mb-2">ALTO AI</h2>
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Next Gen Intelligence</p>
      </div>

      <div className="w-full max-w-xs space-y-4 mb-12">
        <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: "linear" }}
            className="h-full bg-zinc-900"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <span>Loading Experience</span>
          <span>{countdown}s</span>
        </div>
      </div>

      <button 
        onClick={onComplete}
        className="px-8 py-4 bg-zinc-100 text-zinc-400 rounded-2xl text-xs font-black uppercase tracking-widest"
      >
        Skip in {countdown}s
      </button>
    </motion.div>
  );
}

export function InterstitialAd({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          AdMob Interstitial ({ADMOB_CONFIG.INTERSTITIAL})
        </div>
        <button 
          onClick={onComplete}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-full aspect-video bg-zinc-800 rounded-[2rem] mb-8 overflow-hidden relative group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/ads/800/450" 
            alt="Ad" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <ExternalLink size={24} className="text-black ml-1" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-black italic tracking-tighter text-white mb-4 uppercase">Unlock God Mode</h2>
        <p className="text-zinc-400 text-sm max-w-xs mb-8">Dapatkan akses tanpa batas ke semua fitur ALTO AI dengan berlangganan paket premium kami.</p>
        
        <button 
          onClick={onComplete}
          className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Learn More
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Sponsored by ALTO Network</p>
      </div>
    </motion.div>
  );
}
