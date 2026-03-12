
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Video, ChevronRight, Wand2 } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const tools = [
    {
      title: "Prompt Architect",
      desc: "Generate creative video scene prompts with OpenAI GPT-4o Vision.",
      icon: Sparkles,
      color: "bg-primary",
      href: "/dashboard/tools/prompts"
    },
    {
      title: "Motion Studio",
      desc: "Animate static images into 5s cinematic videos using Replicate.",
      icon: Video,
      color: "bg-accent",
      href: "/dashboard/tools/video"
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold">Creative Suite</h2>
        <p className="text-muted-foreground text-sm">Empower your innovation with next-gen AI tools.</p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool, idx) => {
          const Icon = tool.icon
          return (
            <Link key={idx} href={tool.href}>
              <Card className="bg-secondary border-white/5 rounded-3xl hover:bg-white/5 transition-all group active:scale-[0.98]">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white three-d-shadow`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{tool.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex flex-col items-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Wand2 size={24} />
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-sm">Professional Outputs</h5>
          <p className="text-[11px] text-muted-foreground leading-relaxed px-4">
            Our tools are optimized for e-commerce and creative professionals. All assets generated can be used for commercial projects.
          </p>
        </div>
      </div>
    </div>
  )
}
