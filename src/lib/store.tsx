"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { auth, db, googleProvider } from './firebase/config'
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  increment,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

interface EWalletData {
  provider: string
  name: string
  number: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  balance: number
  referralCode: string
  packageExpiry: any | null
  isAdmin: boolean
  eWallet: EWalletData | null
  referralCount: number
  lastCheckInDate?: string
  dailyVideoCount?: number
  lastVideoDate?: string
}

interface AltogenContextType {
  user: UserProfile | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  addBalance: (amount: number) => Promise<void>
  deductBalance: (amount: number) => Promise<void>
  updateSubscription: (days: number) => Promise<void>
  checkIn: () => Promise<boolean>
  watchVideo: () => Promise<{ success: boolean, remaining: number }>
  updateEWallet: (data: EWalletData) => Promise<void>
  createTransaction: (type: 'deposit' | 'withdraw' | 'subscription', amount: number, details?: any) => Promise<void>
}

const AltogenContext = createContext<AltogenContextType | null>(null)

export function AltogenProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Set persistence to LOCAL so user stays logged in
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        
        const unsubDoc = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...docSnap.data() as UserProfile, id: firebaseUser.uid })
          } else {
            const newUser: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
              balance: 0,
              referralCode: `ALTO-${Math.floor(1000 + Math.random() * 9000)}`,
              packageExpiry: null,
              isAdmin: firebaseUser.email === 'appsidhanie@gmail.com',
              eWallet: null,
              referralCount: 0
            }
            await setDoc(userDocRef, newUser)
            setUser(newUser)
          }
          setLoading(false)
        }, (error) => {
          console.error("Firestore Error:", error);
          setLoading(false)
        })
        return () => unsubDoc()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali, ${result.user.displayName}!`,
        });
      }
    } catch (error: any) {
      console.error("Login Detail Error:", error);
      let message = "Gagal masuk. Pastikan Google Sign-in sudah aktif di Firebase.";
      
      if (error.code === 'auth/popup-blocked') {
        message = "Popup login diblokir. Harap izinkan popup di browser Anda.";
      } else if (error.code === 'auth/unauthorized-domain') {
        message = "Domain ini belum didaftarkan di Firebase Console (Authorized Domains).";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Jendela login ditutup sebelum selesai.";
      }

      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: message,
      });
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Berhasil Keluar",
        description: "Sampai jumpa lagi!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal keluar dari akun.",
      });
    }
  }

  const addBalance = async (amount: number) => {
    if (!user) return
    const userDocRef = doc(db, 'users', user.id)
    await updateDoc(userDocRef, { balance: increment(amount) })
  }

  const deductBalance = async (amount: number) => {
    if (!user) return
    const userDocRef = doc(db, 'users', user.id)
    await updateDoc(userDocRef, { balance: increment(-amount) })
  }

  const updateSubscription = async (days: number) => {
    if (!user) return
    const userDocRef = doc(db, 'users', user.id)
    const now = new Date()
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    await updateDoc(userDocRef, { packageExpiry: Timestamp.fromDate(expiry) })
  }

  const checkIn = async () => {
    if (!user) return false
    const today = new Date().toDateString()
    
    if (user.lastCheckInDate !== today) {
      const userDocRef = doc(db, 'users', user.id)
      await updateDoc(userDocRef, { 
        balance: increment(50),
        lastCheckInDate: today
      })
      return true
    }
    return false
  }

  const watchVideo = async () => {
    if (!user) return { success: false, remaining: 0 }
    const today = new Date().toDateString()
    
    let count = user.dailyVideoCount || 0
    if (user.lastVideoDate !== today) {
      count = 0
    }

    if (count < 20) {
      const userDocRef = doc(db, 'users', user.id)
      await updateDoc(userDocRef, { 
        balance: increment(50),
        dailyVideoCount: count + 1,
        lastVideoDate: today
      })
      return { success: true, remaining: 19 - count }
    }
    return { success: false, remaining: 0 }
  }

  const updateEWallet = async (data: EWalletData) => {
    if (!user) return
    const userDocRef = doc(db, 'users', user.id)
    await updateDoc(userDocRef, { eWallet: data })
  }

  const createTransaction = async (type: 'deposit' | 'withdraw' | 'subscription', amount: number, details?: any) => {
    if (!user) return
    await addDoc(collection(db, 'transactions'), {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type,
      amount,
      status: 'pending',
      timestamp: serverTimestamp(),
      ...details
    })
  }

  return (
    <AltogenContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout, 
      addBalance, 
      deductBalance, 
      updateSubscription, 
      checkIn, 
      watchVideo,
      updateEWallet,
      createTransaction
    }}>
      {children}
    </AltogenContext.Provider>
  )
}

export function useAltogen() {
  const context = useContext(AltogenContext)
  if (!context) throw new Error("useAltogen must be used within AltogenProvider")
  return context
}