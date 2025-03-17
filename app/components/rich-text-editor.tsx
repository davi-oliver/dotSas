"use client"

import { useEffect, useState } from "react"
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react"

import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [editorContent, setEditorContent] = useState(value)

  useEffect(() => {
    setIsMounted(true)
    setEditorContent(value)
  }, [value])

  if (!isMounted) {
    return <div className="border rounded-md w-full h-64 flex items-center justify-center">Carregando editor...</div>
  }

  const handleCommand = (command: string) => {
    document.execCommand(command, false)
    const content = document.getElementById("rich-text-editor")?.innerHTML || ""
    setEditorContent(content)
    onChange(content)
  }

  const handleContentChange = () => {
    const content = document.getElementById("rich-text-editor")?.innerHTML || ""
    setEditorContent(content)
    onChange(content)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex gap-1 border-b">
        <Toggle size="sm" aria-label="Negrito" onClick={() => handleCommand("bold")}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Itálico" onClick={() => handleCommand("italic")}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Sublinhado" onClick={() => handleCommand("underline")}>
          <Underline className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-6 bg-border mx-1" />
        <Toggle size="sm" aria-label="Lista com marcadores" onClick={() => handleCommand("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Lista numerada" onClick={() => handleCommand("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>
      <div
        id="rich-text-editor"
        className={cn("min-h-[200px] p-3 focus:outline-none", "prose prose-sm max-w-none")}
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleContentChange}
        onBlur={handleContentChange}
      />
    </div>
  )
}

