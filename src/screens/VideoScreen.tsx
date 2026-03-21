import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { Video as VideoIcon, Upload, Play, CheckCircle2, AlertCircle, Type as TypeIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { geminiService } from '../services/geminiService';
import { ADMOB_CONFIG } from '../constants';

const { width } = Dimensions.get('window');

export default function VideoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSubtitle, setUseSubtitle] = useState(true);
  const [status, setStatus] = useState<string>('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      Alert.alert('Error', 'Please upload a photo first.');
      return;
    }
    
    setLoading(true);
    setStatus('Analyzing scene with Gemini...');

    try {
      // 1. Get instructions from Gemini
      const scene = await geminiService.getVideoInstruction(prompt, useSubtitle);
      
      // Simulate Native Video Generation (Since FFmpeg-kit is for native)
      setStatus('Rendering cinematic clip...');
      
      // In a real native app, we would use ffmpeg-kit-react-native here
      // For this demo, we simulate the process
      setTimeout(() => {
        setLoading(false);
        setStatus('Generation complete!');
        Alert.alert('Success', 'Video generated successfully! (Native Simulation)');
      }, 3000);

    } catch (error) {
      console.error('Generation error:', error);
      setStatus('Error generating video.');
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#1A1A1A]">
      <View className="p-6 space-y-6">
        
        {/* Image Preview Area */}
        <TouchableOpacity 
          onPress={pickImage}
          disabled={loading}
          activeOpacity={0.8}
          className="relative aspect-[9/16] w-full bg-zinc-800 rounded-[3rem] border-2 border-dashed border-zinc-700 overflow-hidden items-center justify-center"
        >
          {image ? (
            <>
              <Image source={{ uri: image }} className="w-full h-full object-cover" />
              <TouchableOpacity 
                onPress={() => setImage(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center justify-center">
              <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
                <Upload size={32} color="#52525b" />
              </View>
              <Text className="text-zinc-400 font-black uppercase tracking-widest text-xs">Tap to Upload Photo</Text>
              <Text className="text-zinc-600 text-[10px] mt-2 font-bold">Portrait (9:16) recommended</Text>
            </View>
          )}
          
          {loading && (
            <View className="absolute inset-0 bg-black/70 items-center justify-center p-8">
              <ActivityIndicator size="large" color="#fff" />
              <Text className="text-white font-black italic text-2xl tracking-tighter mt-6">ALTO<Text className="text-zinc-500">GEN</Text></Text>
              <Text className="text-zinc-400 text-sm mt-2 text-center font-bold tracking-widest uppercase">{status}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Controls */}
        <View className="space-y-5">
          <View>
            <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-2">Scene Description</Text>
            <TextInput 
              placeholder="Apa adegan videonya?" 
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl p-5 text-white text-sm min-h-[100px]"
              value={prompt}
              onChangeText={setPrompt}
            />
          </View>

          <View className="flex-row items-center justify-between px-2">
            <TouchableOpacity 
              onPress={() => setUseSubtitle(!useSubtitle)}
              className="flex-row items-center gap-3"
            >
              <View className={`w-12 h-7 rounded-full p-1 ${useSubtitle ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                <View className={`w-5 h-5 bg-white rounded-full ${useSubtitle ? 'self-end' : 'self-start'}`} />
              </View>
              <Text className="text-white font-bold text-sm">Subtitle {useSubtitle ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
            
            <TypeIcon size={20} color={useSubtitle ? '#10b981' : '#52525b'} />
          </View>

          <TouchableOpacity 
            onPress={handleGenerate}
            disabled={!image || loading}
            className={`w-full py-6 rounded-3xl items-center justify-center flex-row gap-3 ${
              !image || loading ? 'bg-zinc-800' : 'bg-white shadow-xl'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Play size={22} color="#000" fill="#000" />
                <Text className="text-black font-black uppercase tracking-[0.3em] text-sm">Generate 5s Video</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View className="p-5 bg-zinc-900 rounded-3xl border border-zinc-800 flex-row gap-4 items-start">
          <AlertCircle size={20} color="#52525b" />
          <Text className="flex-1 text-[11px] text-zinc-500 leading-5">
            <Text className="text-zinc-300 font-bold">PRO TIP:</Text> Gunakan foto dengan pencahayaan yang baik untuk hasil gerakan yang lebih natural. AI akan menganalisis prompt Anda untuk menentukan arah gerakan kamera.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
