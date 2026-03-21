import React from 'react';
import { Save, Key, DollarSign } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1 flex items-center gap-2">
            <DollarSign size={16} /> Package Price (USD)
          </label>
          <input type="number" defaultValue="10" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1 flex items-center gap-2">
            <Key size={16} /> Gemini API Key
          </label>
          <input type="password" placeholder="••••••••••••" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl" />
        </div>

        <button className="w-full p-4 bg-zinc-900 text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-800 transition-all">
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}
