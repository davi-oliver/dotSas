"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, ChevronDown, Plus } from "lucide-react"

interface Organization {
  id: string
  name: string
  logo?: string
}

interface OrganizationSwitcherProps {
  onOrganizationChange: () => void
}

export default function OrganizationSwitcher({ onOrganizationChange }: OrganizationSwitcherProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")

  useEffect(() => {
    // Simulação de carregamento de dados
    const mockOrganizations: Organization[] = [
      { id: "org-1", name: "Minha Empresa Ltda.", logo: "/placeholder.svg?height=32&width=32" },
      { id: "org-2", name: "Startup Inovadora", logo: "/placeholder.svg?height=32&width=32" },
      { id: "org-3", name: "Consultoria ABC", logo: "/placeholder.svg?height=32&width=32" },
    ]

    setOrganizations(mockOrganizations)
    setCurrentOrganization(mockOrganizations[0])
  }, [])

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      const newOrg: Organization = {
        id: `org-${organizations.length + 1}`,
        name: newOrgName.trim(),
        logo: "/placeholder.svg?height=32&width=32",
      }

      setOrganizations([...organizations, newOrg])
      setCurrentOrganization(newOrg)
      setNewOrgName("")
      setIsCreateDialogOpen(false)
      onOrganizationChange()
    }
  }

  const handleSwitchOrganization = (org: Organization) => {
    setCurrentOrganization(org)
    onOrganizationChange()
  }

  if (!currentOrganization) return null

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {currentOrganization.logo ? (
              <img
                src={currentOrganization.logo || "/placeholder.svg"}
                alt={currentOrganization.name}
                className="h-5 w-5 rounded-sm"
              />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
            <span className="max-w-[150px] truncate">{currentOrganization.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          <DropdownMenuLabel>Suas Organizações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleSwitchOrganization(org)}
            >
              {org.logo ? (
                <img src={org.logo || "/placeholder.svg"} alt={org.name} className="h-5 w-5 rounded-sm" />
              ) : (
                <Building2 className="h-5 w-5" />
              )}
              <span className="flex-1 truncate">{org.name}</span>
              {org.id === currentOrganization.id && <span className="w-2 h-2 rounded-full bg-primary"></span>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                <Plus className="h-4 w-4" />
                <span>Criar Nova Organização</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Organização</DialogTitle>
                <DialogDescription>
                  Crie uma nova organização para gerenciar equipes e projetos separadamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nome da Organização</Label>
                  <Input
                    id="org-name"
                    placeholder="Digite o nome da organização"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateOrganization}>Criar Organização</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

