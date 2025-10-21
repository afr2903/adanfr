"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  onSend: (message: string) => Promise<void> | void
  isLoading?: boolean
}

export default function AdamInput({ onSend, isLoading }: Props) {
  const [value, setValue] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    await onSend(trimmed)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-2 p-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe the role, ask a question, or paste a JD..."
          className="bg-[#1b1b1b] text-white placeholder:text-white/40"
        />
        <Button type="submit" disabled={isLoading || value.trim().length === 0} className="shrink-0">
          <Send className="mr-1 h-4 w-4" /> Send
        </Button>
      </div>
    </form>
  )
}


