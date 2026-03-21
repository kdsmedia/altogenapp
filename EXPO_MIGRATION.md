# 🚀 Panduan Migrasi ALTO AI ke Expo

Aplikasi ini saat ini berjalan di **Web (React + Vite)** untuk pratinjau langsung, namun kodenya dirancang agar mudah dipindahkan ke **Expo (React Native)**.

## 1. Pemetaan Komponen Utama
Saat memindahkan kode dari file `.tsx` di web ke Expo, gunakan pemetaan berikut:

| Web (React) | Expo (React Native) |
| :--- | :--- |
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` |
| `<img>` | `<Image>` |
| `<button>` | `<TouchableOpacity>` atau `<Pressable>` |
| `overflow-y-auto` | `<ScrollView>` |

## 2. Styling (Tailwind)
Aplikasi ini menggunakan Tailwind CSS. Untuk Expo, Anda **SANGAT DISARANKAN** menggunakan **`NativeWind`**.
- Instalasi: `npx expo install nativewind tailwindcss`
- Penggunaan: `className="bg-zinc-900"` akan bekerja sama persis di Expo.

## 3. Integrasi AdMob Asli
Di Expo, gunakan `react-native-google-mobile-ads`.
- Ganti komponen `AdMobSimulation.tsx` dengan pemanggilan SDK asli:
```tsx
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
// Gunakan ID dari constants.ts
<BannerAd unitId={ADMOB_CONFIG.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
```

## 4. Integrasi AI (Gemini)
Kode di `src/services/geminiService.ts` akan bekerja **100% sama** di Expo karena menggunakan SDK JavaScript standar.

## 5. Firebase
Pastikan Anda menggunakan `firebase/auth` dan `firebase/firestore` versi web SDK di Expo (ini adalah praktik standar Expo).

---
**ALTO AI - Next Gen Intelligence**
