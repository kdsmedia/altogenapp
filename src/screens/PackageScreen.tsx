import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, StyleSheet } from 'react-native';
import { Trophy, Clock, Zap, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { ADMOB_CONFIG } from '../constants';

const { width } = Dimensions.get('window');

interface MissionProps {
  label: string;
  progress: number;
  target: number;
  onPress: () => void;
  onClaim: () => void;
  reward: string;
  disabled: boolean;
}

function MissionItem({ label, progress, target, onPress, onClaim, reward, disabled }: MissionProps) {
  const percentage = Math.min((progress / target) * 100, 100);
  const isComplete = progress >= target;

  return (
    <View className="p-6 bg-white border border-zinc-200 rounded-[2.5rem] mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1">
          <Text className="font-black text-zinc-900 tracking-tighter text-xl uppercase italic">{label}</Text>
          <Text className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mt-1">Reward: {reward}</Text>
        </View>
        <View className="ml-4">
          {isComplete ? (
            <TouchableOpacity 
              onPress={onClaim}
              className="px-6 py-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200"
            >
              <Text className="text-white text-[10px] font-black uppercase tracking-widest">KLAIM</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={onPress}
              disabled={disabled}
              className={`px-5 py-3 rounded-2xl ${disabled ? 'bg-zinc-100' : 'bg-zinc-900 shadow-lg shadow-zinc-300'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${disabled ? 'text-zinc-400' : 'text-white'}`}>
                {disabled ? 'WAIT' : 'WATCH AD'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="space-y-2">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Progress</Text>
          <Text className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{progress} / {target}</Text>
        </View>
        <View className="h-4 bg-zinc-100 rounded-full overflow-hidden p-1 border border-zinc-200">
          <View 
            style={{ width: `${percentage}%` }}
            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-zinc-900'}`}
          />
        </View>
      </View>
    </View>
  );
}

export default function PackageScreen() {
  const [cooldown, setCooldown] = useState(0);
  const [progress, setProgress] = useState({ t10: 0, t50: 0, t250: 0 });
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleWatchAd = (task: keyof typeof progress) => {
    if (cooldown > 0) return;
    
    setIsWatching(true);
    
    // Simulate Ad Watching (Native AdMob would trigger here)
    setTimeout(() => {
      setProgress(prev => ({ ...prev, [task]: prev[task] + 1 }));
      setCooldown(60); 
      setIsWatching(false);
      Alert.alert('Reward Granted', 'You earned 1 progress point!');
    }, 5000);
  };

  const handleClaim = (reward: string) => {
    Alert.alert('Success', `Selamat! Anda berhasil mengklaim: ${reward}`);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 space-y-8 pb-24">
        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-4xl font-black tracking-tighter italic leading-none text-zinc-900">ALTO<Text className="text-zinc-300">MISSIONS</Text></Text>
            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Complete quests to unlock AI powers.</Text>
          </View>
          <Trophy color="#e4e4e7" size={48} />
        </View>

        {cooldown > 0 && (
          <View className="p-5 bg-zinc-900 rounded-[2.5rem] flex-row items-center justify-between shadow-xl shadow-zinc-400 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center">
                <Clock color="#fff" size={24} />
              </View>
              <View>
                <Text className="text-[10px] font-black uppercase tracking-widest text-white/50">Cooldown Active</Text>
                <Text className="text-xl font-black italic tracking-tighter text-white">Tunggu {cooldown}s lagi!</Text>
              </View>
            </View>
            <Text className="text-3xl font-black italic text-white/10">ALTO</Text>
          </View>
        )}

        <View>
          <MissionItem 
            label="Starter Quest" 
            progress={progress.t10} 
            target={10} 
            onPress={() => handleWatchAd('t10')}
            onClaim={() => handleClaim('1x Video')}
            reward="1x Video"
            disabled={cooldown > 0 || isWatching}
          />

          <MissionItem 
            label="Creator Quest" 
            progress={progress.t50} 
            target={50} 
            onPress={() => handleWatchAd('t50')}
            onClaim={() => handleClaim('10x Video')}
            reward="10x Video"
            disabled={cooldown > 0 || isWatching}
          />

          <MissionItem 
            label="Unlimited Day" 
            progress={progress.t250} 
            target={250} 
            onPress={() => handleWatchAd('t250')}
            onClaim={() => handleClaim('24 Jam Unlimited')}
            reward="24 Jam Unlimited"
            disabled={cooldown > 0 || isWatching}
          />
        </View>

        <View className="p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex-row gap-4 items-start">
          <AlertCircle color="#a1a1aa" size={20} />
          <Text className="flex-1 text-[10px] text-zinc-400 font-bold leading-5 uppercase tracking-wider">
            Ads help keep ALTO free for everyone. Cooldowns ensure system stability. 
            Completed missions automatically unlock rewards.
          </Text>
        </View>
      </View>

      {isWatching && (
        <View style={StyleSheet.absoluteFill} className="bg-black/95 z-50 items-center justify-center p-8">
          <View className="w-24 h-24 bg-white rounded-[2.5rem] items-center justify-center shadow-2xl mb-8">
            <Zap color="#000" size={48} fill="#000" />
          </View>
          <Text className="text-2xl font-black italic tracking-tighter text-white mb-2 uppercase">Watching Ad...</Text>
          <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Reward in 5 seconds</Text>
        </View>
      )}
    </ScrollView>
  );
}
