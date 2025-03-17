 
import { HelpCenter } from "@/app/components/Help/help-center"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Centro de Ajuda | Sistema",
  description: "Centro de ajuda com tutoriais, documentação e suporte técnico",
}

export default function HelpPage() {
  return <HelpCenter />
}

