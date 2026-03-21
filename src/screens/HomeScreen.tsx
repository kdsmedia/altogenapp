import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, MessageSquare } from 'lucide-react-native';
import { geminiService } from '../services/geminiService';

export default function HomeScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    
    try {
      const response = await geminiService.generateChatResponse(input);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'No response' }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      className="flex-1 bg-zinc-50"
    >
      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.length === 0 && (
          <View className="flex-1 items-center justify-center py-20 opacity-20">
            <MessageSquare size={80} color="#18181b" />
            <Text className="text-zinc-900 font-black italic text-2xl mt-4">ALTO AI</Text>
          </View>
        )}
        {messages.map((msg, i) => (
          <View 
            key={i}
            className={`p-4 rounded-3xl mb-3 max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-zinc-900 self-end rounded-tr-none' 
                : 'bg-white border border-zinc-200 self-start rounded-tl-none'
            }`}
          >
            <Text className={`text-sm font-medium leading-5 ${msg.role === 'user' ? 'text-white' : 'text-zinc-900'}`}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="p-4 bg-white border-t border-zinc-100 flex-row items-center gap-3">
        <TextInput 
          value={input}
          onChangeText={setInput}
          placeholder="Ask Gemini..."
          placeholderTextColor="#a1a1aa"
          className="flex-1 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-zinc-900 font-medium"
        />
        <TouchableOpacity 
          onPress={handleSend} 
          className="w-14 h-14 bg-zinc-900 rounded-2xl items-center justify-center shadow-lg shadow-zinc-400"
        >
          <Send size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
