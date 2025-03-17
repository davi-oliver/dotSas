"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, ShieldAlert, ShieldCheck } from "lucide-react"

interface PermissionsMatrixProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  isDefault: boolean
  permissions: string[]
  usersCount: number
}

export default function PermissionsMatrix({ refreshTrigger, onUpdate }: PermissionsMatrixProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockPermissions: Permission[] = [
        // Módulo de Usuários
        {
          id: "users.view",
          name: "Visualizar usuários",
          description: "Permite visualizar lista de usuários",
          module: "Usuários",
        },
        { id: "users.create", name: "Criar usuários", description: "Permite criar novos usuários", module: "Usuários" },
        {
          id: "users.edit",
          name: "Editar usuários",
          description: "Permite editar usuários existentes",
          module: "Usuários",
        },
        { id: "users.delete", name: "Excluir usuários", description: "Permite excluir usuários", module: "Usuários" },

        // Módulo de Produtos
        {
          id: "products.view",
          name: "Visualizar produtos",
          description: "Permite visualizar lista de produtos",
          module: "Produtos",
        },
        {
          id: "products.create",
          name: "Criar produtos",
          description: "Permite criar novos produtos",
          module: "Produtos",
        },
        {
          id: "products.edit",
          name: "Editar produtos",
          description: "Permite editar produtos existentes",
          module: "Produtos",
        },
        {
          id: "products.delete",
          name: "Excluir produtos",
          description: "Permite excluir produtos",
          module: "Produtos",
        },

        // Módulo de Pedidos
        {
          id: "orders.view",
          name: "Visualizar pedidos",
          description: "Permite visualizar lista de pedidos",
          module: "Pedidos",
        },
        { id: "orders.create", name: "Criar pedidos", description: "Permite criar novos pedidos", module: "Pedidos" },
        {
          id: "orders.edit",
          name: "Editar pedidos",
          description: "Permite editar pedidos existentes",
          module: "Pedidos",
        },
        { id: "orders.delete", name: "Excluir pedidos", description: "Permite excluir pedidos", module: "Pedidos" },
        { id: "orders.approve", name: "Aprovar pedidos", description: "Permite aprovar pedidos", module: "Pedidos" },
        { id: "orders.cancel", name: "Cancelar pedidos", description: "Permite cancelar pedidos", module: "Pedidos" },

        // Módulo de Relatórios
        {
          id: "reports.view",
          name: "Visualizar relatórios",
          description: "Permite visualizar relatórios",
          module: "Relatórios",
        },
        {
          id: "reports.export",
          name: "Exportar relatórios",
          description: "Permite exportar relatórios",
          module: "Relatórios",
        },

        // Módulo de Configurações
        {
          id: "settings.view",
          name: "Visualizar configurações",
          description: "Permite visualizar configurações do sistema",
          module: "Configurações",
        },
        {
          id: "settings.edit",
          name: "Editar configurações",
          description: "Permite editar configurações do sistema",
          module: "Configurações",
        },
      ]

      const mockRoles: Role[] = [
        {
          id: "admin",
          name: "Administrador",
          description: "Acesso completo a todas as funcionalidades do sistema",
          isSystem: true,
          isDefault: false,
          permissions: mockPermissions.map((p) => p.id),
          usersCount: 3,
        },
        {
          id: "manager",
          name: "Gerente",
          description: "Acesso a gerenciamento de usuários e relatórios",
          isSystem: false,
          isDefault: false,
          permissions: [
            "users.view",
            "users.create",
            "users.edit",
            "products.view",
            "products.create",
            "products.edit",
            "orders.view",
            "orders.create",
            "orders.edit",
            "orders.approve",
            "orders.cancel",
            "reports.view",
            "reports.export",
          ],
          usersCount: 5,
        },
        {
          id: "editor",
          name: "Editor",
          description: "Pode criar e editar conteúdo, mas não pode excluir",
          isSystem: false,
          isDefault: false,
          permissions: [
            "users.view",
            "products.view",
            "products.create",
            "products.edit",
            "orders.view",
            "orders.create",
            "orders.edit",
            "reports.view",
          ],
          usersCount: 8,
        },
        {
          id: "viewer",
          name: "Visualizador",
          description: "Acesso somente leitura a todas as áreas",
          isSystem: false,
          isDefault: true,
          permissions: ["users.view", "products.view", "orders.view", "reports.view"],
          usersCount: 12,
        },
      ]

      setPermissions(mockPermissions)
      setFilteredPermissions(mockPermissions)
      setRoles(mockRoles)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...permissions]

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permission.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por módulo
    if (moduleFilter !== "all") {
      filtered = filtered.filter((permission) => permission.module === moduleFilter)
    }

    setFilteredPermissions(filtered)
  }, [permissions, searchTerm, moduleFilter])

  const handleTogglePermission = (roleId: string, permissionId: string) => {
    setIsSaving(true)

    // Simulação de envio para API
    setTimeout(() => {
      setRoles(
        roles.map((role) => {
          if (role.id === roleId) {
            const hasPermission = role.permissions.includes(permissionId)

            return {
              ...role,
              permissions: hasPermission
                ? role.permissions.filter((id) => id !== permissionId)
                : [...role.permissions, permissionId],
            }
          }
          return role
        }),
      )

      setIsSaving(false)
      onUpdate()
    }, 300)
  }

  const getUniqueModules = () => {
    const modules = new Set<string>()
    permissions.forEach((permission) => modules.add(permission.module))
    return Array.from(modules)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Matriz de Permissões</CardTitle>
        <CardDescription>Visualize e configure permissões para cada papel em uma única tela</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar permissões..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os módulos</SelectItem>
                {getUniqueModules().map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Badge variant="secondary">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Sistema
              </Badge>
              <span className="text-muted-foreground">Papel do sistema</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Personalizado
              </Badge>
              <span className="text-muted-foreground">Papel personalizado</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[250px]">Permissão</TableHead>
                <TableHead className="text-center">Módulo</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.id} className="text-center min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span>{role.name}</span>
                      {role.isSystem ? (
                        <Badge variant="secondary" className="text-xs">
                          Sistema
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Personalizado
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={roles.length + 2} className="h-24 text-center">
                    Nenhuma permissão encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{permission.module}</Badge>
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                        <Checkbox
                          checked={role.permissions.includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(role.id, permission.id)}
                          disabled={role.isSystem || isSaving}
                          aria-label={`${permission.name} para ${role.name}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

