"use client"

import { useEffect } from 'react'

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-4 overflow-hidden bg-secondary/30 rounded-2xl border border-white/5 min-h-[100px]">
      {/* Banner Ad ca-app-pub-6881903056221433/8562989757 */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '90px' }}
           data-ad-client="ca-pub-6881903056221433"
           data-ad-slot="8562989757"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  )
}
