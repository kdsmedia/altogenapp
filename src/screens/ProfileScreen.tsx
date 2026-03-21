import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { User, Shield, LogOut, Settings, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretTrigger = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      Alert.alert('Admin Access', 'Entering Admin Panel...');
      // navigation.navigate('Admin'); // Uncomment when Admin is ready
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-8">
        <TouchableOpacity 
          onPress={handleSecretTrigger}
          activeOpacity={0.7}
          className="flex-row items-center gap-6 mb-12"
        >
          <View className="w-20 h-20 bg-zinc-100 rounded-[2rem] items-center justify-center border border-zinc-200">
            <User size={40} color="#71717a" />
          </View>
          <View>
            <Text className="text-2xl font-black italic tracking-tighter text-zinc-900">User Profile</Text>
            <View className="bg-zinc-900 self-start px-3 py-1 rounded-full mt-1">
              <Text className="text-[10px] text-white font-black uppercase tracking-widest">Free Member</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View className="space-y-3">
          <TouchableOpacity className="w-full p-6 bg-zinc-50 rounded-3xl flex-row items-center justify-between border border-zinc-100">
            <View className="flex-row items-center gap-4">
              <Settings size={22} color="#a1a1aa" />
              <Text className="font-bold text-zinc-900">Account Settings</Text>
            </View>
            <ChevronRight size={18} color="#d4d4d8" />
          </TouchableOpacity>

          <TouchableOpacity className="w-full p-6 bg-zinc-50 rounded-3xl flex-row items-center justify-between border border-zinc-100">
            <View className="flex-row items-center gap-4">
              <Shield size={22} color="#a1a1aa" />
              <Text className="font-bold text-zinc-900">Privacy & Security</Text>
            </View>
            <ChevronRight size={18} color="#d4d4d8" />
          </TouchableOpacity>

          <TouchableOpacity className="w-full p-6 bg-red-50 rounded-3xl flex-row items-center gap-4 border border-red-100 mt-4">
            <LogOut size={22} color="#ef4444" />
            <Text className="font-bold text-red-600">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-16 items-center">
          <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">ALTO AI v1.0.0</Text>
          <Text className="text-[8px] font-bold text-zinc-300 mt-2 uppercase tracking-widest">Tap profile 5 times for Admin</Text>
        </View>
      </View>
    </ScrollView>
  );
}
