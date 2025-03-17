"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCategories } from "./help-categories"
import { HelpArticle } from "./help-article"
import { HelpFaq } from "./help-fac"
import { HelpContact } from "./help-contact"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Search } from "lucide-react"
import { helpData } from "./help-data"

export function HelpCenter() {
    const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = useState("guides")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(helpData.categories[0].id)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

  // Filtra resultados de busca em todos os artigos
  const searchResults =
    searchQuery.length > 2
      ? helpData.categories.flatMap((category: { id: string; articles: { id: string; title: string; content: string }[] }) =>
          category.articles
            .filter(
              (article: { title: string; content: string }) =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((article: { id: string; title: string; content: string }) => ({ ...article, categoryId: category.id })),
        )
      : []

  // Manipula a seleção de um artigo
  const handleArticleSelect = (articleId: string) => {
    setSelectedArticle(articleId)
    if (isMobile) {
      setActiveTab("article")
    }
  }

  // Manipula a seleção de uma categoria
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
  }

  // Manipula o clique em um resultado de busca
  const handleSearchResultClick = (categoryId: string, articleId: string) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(articleId)
    setSearchQuery("")
    if (isMobile) {
      setActiveTab("article")
    }
  }

  // Volta para a visualização de categorias no mobile
  const handleBackToCategories = () => {
    setSelectedArticle(null)
    if (isMobile) {
      setActiveTab("guides")
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Centro de Ajuda</h1>

      {/* Barra de busca */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar ajuda..."
          className="pl-10 pr-4 py-3 rounded-full border-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Resultados da busca */}
        {searchQuery.length > 2 && searchResults.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 bg-card border rounded-lg shadow-lg mt-1 overflow-hidden">
            <ul className="py-2 max-h-80 overflow-y-auto">
              {searchResults.map((result: { id: string; title: string; content: string; categoryId: string }) => (
                <li key={result.id}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                    onClick={() => handleSearchResultClick(result.categoryId, result.id)}
                  >
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.content.substring(0, 80)}...</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchQuery.length > 2 && searchResults.length === 0 && (
          <div className="absolute z-10 top-full left-0 right-0 bg-card border rounded-lg shadow-lg mt-1 p-4 text-center">
            <p className="text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>

      {/* Navegação principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 mx-auto w-full max-w-md">
          <TabsTrigger value="guides">Guias</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        {/* Guias e artigos */}
        <TabsContent value="guides" className="w-full animate-in fade-in-50">
          <div
            className={`grid gap-6 ${isMobile ? "grid-cols-1" : selectedArticle ? "grid-cols-[300px_1fr]" : "grid-cols-1"}`}
          >
            {(!isMobile || !selectedArticle) && (
              <HelpCategories
                categories={helpData.categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onArticleSelect={handleArticleSelect}
                selectedArticle={selectedArticle}
              />
            )}

            {selectedArticle && (!isMobile || activeTab === "article") && (
              <HelpArticle
                article={helpData.categories
                  .find((c: { id: string; articles: { id: string }[] }) => c.id === selectedCategory)
                  ?.articles.find((a: { id: string }) => a.id === selectedArticle)}
                onBack={handleBackToCategories}
                isMobile={isMobile}
              />
            )}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="animate-in fade-in-50">
          <HelpFaq faqs={helpData.faqs} />
        </TabsContent>

        {/* Contato */}
        <TabsContent value="contact" className="animate-in fade-in-50">
          <HelpContact />
        </TabsContent>

        {/* Exibição de artigo no mobile */}
        {isMobile && (
          <TabsContent value="article" className="animate-in fade-in-50">
            <HelpArticle
              article={helpData.categories
                .find((c: { id: string; articles: { id: string }[] }) => c.id === selectedCategory)
                ?.articles.find((a: { id: string }) => a.id === selectedArticle)}
              onBack={handleBackToCategories}
              isMobile={isMobile}
            />
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}

