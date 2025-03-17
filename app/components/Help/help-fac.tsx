"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"
import type { FAQ } from "./help-data"

interface HelpFaqProps {
  faqs: FAQ[]
}

export function HelpFaq({ faqs }: HelpFaqProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Agrupa as FAQs por categoria
  const groupedFaqs = faqs.reduce(
    (groups, faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = []
      }
      groups[faq.category].push(faq)
      return groups
    },
    {} as Record<string, FAQ[]>,
  )

  // Filtra as FAQs baseado na busca
  const filteredGroups = Object.entries(groupedFaqs)
    .map(([category, items]) => {
      const filteredItems = searchQuery
        ? items.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : items
      return { category, items: filteredItems }
    })
    .filter((group) => group.items.length > 0)

  // Expande automaticamente os itens quando há busca
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      // Expande todos os itens que correspondem à busca
      const itemsToExpand = faqs
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase()),
        )
        .map((faq) => faq.id)
      setExpandedItems(itemsToExpand)
    } else if (query.length === 0) {
      // Colapsa todos os itens quando a busca é limpa
      setExpandedItems([])
    }
  }

  // Manipula a expansão/colapso de um item
  const handleItemToggle = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar nas perguntas frequentes..."
          className="pl-10 pr-4 py-3 rounded-full border-2"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">Nenhuma pergunta encontrada com este termo.</p>
        </div>
      )}

      {filteredGroups.map(({ category, items }) => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" value={expandedItems}>
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger onClick={() => handleItemToggle(faq.id)} className="text-left hover:no-underline">
                    <span className="font-medium">{highlightMatches(faq.question, searchQuery)}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="py-2 text-card-foreground">{highlightMatches(faq.answer, searchQuery)}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Função para destacar termos de busca nas FAQs
function highlightMatches(text: string, query: string) {
  if (!query || query.length < 3) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-200 dark:bg-yellow-900">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

