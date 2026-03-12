
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Video, Upload, Loader2, Play, Download, Trash2, Wand2 } from 'lucide-react'
import { startVideoGeneration, getPredictionStatus } from '@/lib/ai-actions'
import { useToast } from '@/hooks/use-toast'

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
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
    if (!prompt) {
      toast({ variant: "destructive", title: "Prompt Required", description: "Describe the motion you want." })
      return
    }

    setLoading(true)
    setVideoUrl(null)
    setStatus('starting')
    
    try {
      const prediction = await startVideoGeneration(prompt, image || undefined)
      setPredictionId(prediction.id)
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to start generation." })
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!predictionId || !loading) return

    const interval = setInterval(async () => {
      try {
        const p = await getPredictionStatus(predictionId)
        setStatus(p.status)
        
        if (p.status === 'succeeded') {
          setVideoUrl(p.output)
          setLoading(false)
          setPredictionId(null)
          clearInterval(interval)
          toast({ title: "Success!", description: "Your video is ready." })
        } else if (p.status === 'failed' || p.status === 'canceled') {
          setLoading(false)
          setPredictionId(null)
          clearInterval(interval)
          toast({ variant: "destructive", title: "Failed", description: "Video generation failed." })
        }
      } catch (err) {
        console.error(err)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [predictionId, loading])

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-accent">Motion Studio</h2>
        <p className="text-muted-foreground text-sm">Bring your static images to life with AI motion.</p>
      </div>

      <Card className="bg-secondary border-white/5 rounded-3xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Starting Frame (Optional)</Label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-background/50 group-hover:bg-background/80 transition-all overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="text-muted-foreground mb-2" size={24} />
                    <span className="text-xs text-muted-foreground">Click to upload initial frame</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motion Prompt</Label>
            <Textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A woman walking through a busy Tokyo street at night, neon lights reflecting on wet pavement..."
              className="bg-background border-white/10 min-h-[100px] rounded-xl"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-lg shadow-accent/10"
          >
            {loading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Wand2 size={20} className="mr-2" />
            )}
            {loading ? `Generating (${status})...` : "Generate Motion"}
          </Button>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Realtime Progress</span>
                <span>{status}</span>
              </div>
              <Progress value={status === 'processing' ? 65 : 10} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>

      {videoUrl && (
        <Card className="bg-card border-accent/20 border-2 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
          <CardContent className="p-4 space-y-4">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full aspect-video rounded-2xl shadow-2xl"
            />
            <div className="flex gap-3">
              <Button asChild className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none">
                <a href={videoUrl} download="altogen-motion.mp4" target="_blank">
                  <Download size={18} className="mr-2" /> Download MP4
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setVideoUrl(null)
                  setPrompt('')
                  setImage(null)
                }}
                className="h-12 w-12 rounded-xl text-red-400"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
