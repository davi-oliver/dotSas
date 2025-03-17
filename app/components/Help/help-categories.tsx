"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight, BookOpen } from "lucide-react"
import type { Category } from "./help-data"

interface HelpCategoriesProps {
  categories: Category[]
  selectedCategory: string
  selectedArticle: string | null
  onCategorySelect: (categoryId: string) => void
  onArticleSelect: (articleId: string) => void
}

export function HelpCategories({
  categories,
  selectedCategory,
  selectedArticle,
  onCategorySelect,
  onArticleSelect,
}: HelpCategoriesProps) {
  const selectedCategoryData = categories.find((c) => c.id === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-shadow hover:shadow-md",
              selectedCategory === category.id ? "border-primary" : "",
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategoryData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <selectedCategoryData.icon className="mr-2 h-5 w-5" />
            {selectedCategoryData.name}
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {selectedCategoryData.articles.map((article) => (
              <Card
                key={article.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedArticle === article.id ? "border-primary bg-primary/5" : "",
                )}
                onClick={() => onArticleSelect(article.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{article.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    </div>
                    <BookOpen className="h-4 w-4 text-muted-foreground ml-2 mt-1 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

