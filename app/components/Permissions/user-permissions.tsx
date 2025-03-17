"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Search, ShieldAlert, ShieldCheck, UserCog } from "lucide-react"

interface UserPermissionsProps {
  refreshTrigger?: number
  onUpdate: () => void
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  customPermissions?: {
    granted: string[]
    denied: string[]
  }
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

export default function UserPermissions({ refreshTrigger, onUpdate }: UserPermissionsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          id: "admin",
          name: "Administrador",
          description: "Acesso completo a todas as funcionalidades do sistema",
          isSystem: true,
          isDefault: false,
          permissions: [
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",
            "products.view",
            "products.create",
            "products.edit",
            "products.delete",
            "orders.view",
            "orders.create",
            "orders.edit",
            "orders.delete",
            "orders.approve",
            "orders.cancel",
            "reports.view",
            "reports.export",
            "settings.view",
            "settings.edit",
          ],
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

      const mockUsers: User[] = [
        {
          id: "user-1",
          name: "João Silva",
          email: "joao.silva@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin",
        },
        {
          id: "user-2",
          name: "Maria Oliveira",
          email: "maria.oliveira@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "manager",
        },
        {
          id: "user-3",
          name: "Pedro Santos",
          email: "pedro.santos@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "editor",
          customPermissions: {
            granted: ["products.delete"],
            denied: ["orders.edit"],
          },
        },
        {
          id: "user-4",
          name: "Ana Costa",
          email: "ana.costa@example.com",
          role: "viewer",
        },
        {
          id: "user-5",
          name: "Carlos Ferreira",
          email: "carlos.ferreira@example.com",
          role: "viewer",
          customPermissions: {
            granted: ["reports.export"],
            denied: [],
          },
        },
        {
          id: "user-6",
          name: "Fernanda Lima",
          email: "fernanda.lima@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "manager",
        },
        {
          id: "user-7",
          name: "Roberto Alves",
          email: "roberto.alves@example.com",
          role: "editor",
        },
        {
          id: "user-8",
          name: "Juliana Martins",
          email: "juliana.martins@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin",
        },
      ]

      setRoles(mockRoles)
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...users]

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por papel
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const handleUpdateUserRole = () => {
    if (!selectedUser) return

    setIsSaving(true)

    // Simulação de envio para API
    setTimeout(() => {
      setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)))

      setIsSaving(false)
      setIsEditDialogOpen(false)
      onUpdate()
    }, 1500)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleBadge = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)

    if (!role) return null

    if (role.isSystem) {
      return (
        <Badge variant="secondary">
          <ShieldAlert className="mr-1 h-3 w-3" />
          {role.name}
        </Badge>
      )
    }

    return (
      <Badge variant="outline">
        <ShieldCheck className="mr-1 h-3 w-3" />
        {role.name}
      </Badge>
    )
  }

  const hasCustomPermissions = (user: User) => {
    return (
      user.customPermissions && (user.customPermissions.granted.length > 0 || user.customPermissions.denied.length > 0)
    )
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
        <CardTitle>Permissões por Usuário</CardTitle>
        <CardDescription>Gerencie papéis e permissões específicas para cada usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Permissões Personalizadas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {hasCustomPermissions(user) ? (
                        <Badge variant="secondary">
                          <UserCog className="mr-1 h-3 w-3" />
                          Permissões personalizadas
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Padrão do papel</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            Editar Permissões
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          {selectedUser && (
                            <>
                              <DialogHeader>
                                <DialogTitle>Editar Permissões do Usuário</DialogTitle>
                                <DialogDescription>
                                  Altere o papel ou defina permissões personalizadas para {selectedUser.name}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="user-role">Papel do Usuário</Label>
                                  <Select
                                    value={selectedUser.role}
                                    onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                                  >
                                    <SelectTrigger id="user-role">
                                      <SelectValue placeholder="Selecione um papel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                          {role.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <p className="text-xs text-muted-foreground">
                                    O papel define o conjunto base de permissões do usuário
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <Label>Permissões Personalizadas</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Adicione permissões específicas para este usuário, independente do papel
                                  </p>

                                  <div className="mt-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => {
                                        // Aqui abriria um modal mais complexo para gerenciar permissões específicas
                                        // Para simplificar, apenas simulamos a adição de uma permissão personalizada
                                        setSelectedUser({
                                          ...selectedUser,
                                          customPermissions: {
                                            granted: ["products.delete", "reports.export"],
                                            denied: [],
                                          },
                                        })
                                      }}
                                    >
                                      Configurar Permissões Específicas
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdateUserRole} disabled={isSaving}>
                                  {isSaving ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Salvando...
                                    </>
                                  ) : (
                                    "Salvar Alterações"
                                  )}
                                </Button>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
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

