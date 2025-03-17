"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import type { Article } from "./help-data"

interface HelpArticleProps {
  article: Article | undefined
  onBack: () => void
  isMobile: boolean
}

export function HelpArticle({ article, onBack, isMobile }: HelpArticleProps) {
  if (!article) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Artigo não encontrado.</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Voltar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-card border-b px-6 py-4">
        <div className="flex items-start justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isMobile ? "Voltar" : "Todos os artigos"}
          </Button>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{article.updatedAt}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-6">{article.title}</h1>

        {article.content.split("\n\n").map((paragraph, index) => {
          // Verifica se é um título de seção (iniciado com ##)
          if (paragraph.startsWith("##")) {
            return (
              <h2 key={index} className="text-xl font-semibold mt-8 mb-4">
                {paragraph.replace("##", "").trim()}
              </h2>
            )
          }

          // Verifica se é uma lista (iniciada com - ou *)
          if (paragraph.trim().startsWith("-") || paragraph.trim().startsWith("*")) {
            const items = paragraph.split("\n").map((item) => item.replace(/^[-*]\s/, "").trim())
            return (
              <ul key={index} className="list-disc pl-5 mt-4 mb-4 space-y-2">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )
          }

          // Parágrafo normal
          return (
            <p key={index} className="my-4 text-card-foreground">
              {paragraph}
            </p>
          )
        })}

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-10 pt-6 border-t">
            <h3 className="font-medium mb-3">Artigos relacionados</h3>
            <ul className="space-y-2">
              {article.relatedArticles.map((related, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-primary hover:underline flex items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      // Aqui você implementaria a navegação para o artigo relacionado
                    }}
                  >
                    <ArrowLeft className="h-3 w-3 mr-2 rotate-[135deg]" />
                    {related}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

