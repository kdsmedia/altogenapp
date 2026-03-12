import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AltogenProvider } from '@/lib/store';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ALTOGEN | AI-Powered Innovation',
  description: 'Digital innovation and financial fluidity at your fingertips.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ALTOGEN',
  },
  other: {
    'google-play-app': 'app-id=com.altomedia.altogenapp',
    'google-adsense-account': 'ca-pub-6881903056221433'
  },
  icons: {
    icon: '/assets/img/icon.png',
    apple: '/assets/img/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* AdMob for Web / AdSense integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6881903056221433"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 min-h-screen bg-background" suppressHydrationWarning>
        <AltogenProvider>
          {children}
          <Toaster />
        </AltogenProvider>
      </body>
    </html>
  );
}
