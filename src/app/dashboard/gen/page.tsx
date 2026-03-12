
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PromptGeneratorPage from "@/app/dashboard/tools/prompts/page"
import VideoGeneratorPage from "@/app/dashboard/tools/video/page"
import { Sparkles, Video } from 'lucide-react'

export default function GeneratorPage() {
  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-primary">Creative Engine</h2>
        <p className="text-muted-foreground text-sm">Generator AI untuk konten kreatif Anda.</p>
      </div>

      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary rounded-2xl h-14 p-1">
          <TabsTrigger value="prompt" className="rounded-xl flex gap-2">
            <Sparkles size={16} /> Prompt
          </TabsTrigger>
          <TabsTrigger value="video" className="rounded-xl flex gap-2">
            <Video size={16} /> Video
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt">
          <PromptGeneratorPage />
        </TabsContent>

        <TabsContent value="video">
          <VideoGeneratorPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
