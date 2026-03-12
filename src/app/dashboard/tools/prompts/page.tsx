
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Image as ImageIcon, Loader2, Copy, Check } from 'lucide-react'
import { generatePrompts } from '@/lib/ai-actions'
import { useToast } from '@/hooks/use-toast'

export default function PromptGeneratorPage() {
  const [productName, setProductName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!productName) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please enter a product name." })
      return
    }

    setLoading(true)
    try {
      const scenes = await generatePrompts(productName, image || undefined)
      setResults(scenes)
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate prompts." })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
    toast({ title: "Copied!", description: "Prompt copied to clipboard." })
  }

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-primary">Prompt Architect</h2>
        <p className="text-muted-foreground text-sm">Create cinematic scene descriptions for your products.</p>
      </div>

      <Card className="bg-secondary border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Product Name / Title</Label>
            <Input 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Altogen Smart Watch v2"
              className="bg-background border-white/10 h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Reference Image (Optional)</Label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-background/50 group-hover:bg-background/80 transition-all overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-muted-foreground mb-2" size={24} />
                    <span className="text-xs text-muted-foreground">Click to upload product photo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 rounded-2xl gradient-primary border-none font-bold text-lg shadow-lg"
          >
            {loading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Sparkles size={20} className="mr-2" />
            )}
            {loading ? "Architecting..." : "Generate 3 Scenes"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-headline font-bold text-lg px-2">Generated Scenarios</h3>
          {results.map((scene, idx) => (
            <Card key={idx} className="bg-card border-white/5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Scene 0{idx + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    onClick={() => copyToClipboard(scene, idx)}
                  >
                    {copiedIdx === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 italic">"{scene.trim()}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
