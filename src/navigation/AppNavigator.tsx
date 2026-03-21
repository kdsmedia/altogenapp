import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Video, Package, User, Shield } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import HomeScreen from '../screens/HomeScreen';
import VideoScreen from '../screens/VideoScreen';
import PackageScreen from '../screens/PackageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminPanel from '../screens/Admin/AdminPanel';
import AdminConfirmation from '../screens/Admin/AdminConfirmation';
import AdminSettings from '../screens/Admin/AdminSettings';
import { BannerAd, AppOpenAd, InterstitialAd } from '../components/AdMobSimulation';

function BottomNav() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <nav className="h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-4">
        <Link to="/admin" className={`flex flex-col items-center ${location.pathname === '/admin' ? 'text-zinc-900' : 'text-zinc-400'}`}>
          <Shield size={24} />
          <span className="text-[10px] font-bold mt-1">PANEL</span>
        </Link>
        <Link to="/" className="flex flex-col items-center text-zinc-400">
          <Home size={24} />
          <span className="text-[10px] font-bold mt-1">EXIT</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-4">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-zinc-900' : 'text-zinc-400'}`}>
        <Home size={24} />
        <span className="text-[10px] font-bold mt-1">CHAT</span>
      </Link>
      <Link to="/video" className={`flex flex-col items-center ${location.pathname === '/video' ? 'text-zinc-900' : 'text-zinc-400'}`}>
        <Video size={24} />
        <span className="text-[10px] font-bold mt-1">VIDEO</span>
      </Link>
      <Link to="/packages" className={`flex flex-col items-center ${location.pathname === '/packages' ? 'text-zinc-900' : 'text-zinc-400'}`}>
        <Package size={24} />
        <span className="text-[10px] font-bold mt-1">STORE</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-zinc-900' : 'text-zinc-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-bold mt-1">ME</span>
      </Link>
    </nav>
  );
}

function MainContent() {
  const location = useLocation();
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [navCount, setNavCount] = useState(0);

  useEffect(() => {
    // Show interstitial every 5 navigations
    if (navCount > 0 && navCount % 5 === 0) {
      setShowInterstitial(true);
    }
    setNavCount(prev => prev + 1);
  }, [location.pathname]);

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/video" element={<VideoScreen />} />
          <Route path="/packages" element={<PackageScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/confirm" element={<AdminConfirmation />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </main>
      
      <AnimatePresence>
        {showInterstitial && (
          <InterstitialAd onComplete={() => setShowInterstitial(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function AppNavigator() {
  const [showAppOpen, setShowAppOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden border-x border-zinc-100 relative">
        <AnimatePresence>
          {showAppOpen && (
            <AppOpenAd onComplete={() => setShowAppOpen(false)} />
          )}
        </AnimatePresence>

        <header className="h-14 border-b border-zinc-100 flex items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="font-black text-xl tracking-tighter italic">ALTO</h1>
        </header>
        
        <MainContent />

        <BannerAd />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
