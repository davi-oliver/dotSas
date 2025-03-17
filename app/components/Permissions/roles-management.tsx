"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, MoreHorizontal, Plus, ShieldAlert, ShieldCheck, Users } from "lucide-react"
import { id } from "date-fns/locale"

interface RolesManagementProps {
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

export default function RolesManagement({ refreshTrigger, onUpdate }: RolesManagementProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState<Role[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [newRole, setNewRole] = useState({
        name: "",
        id: "new-role-id",
        description: "",
        isDefault: false,
        usersCount: 0,
        isSystem: false,
        permissions: [] as string[],
    })
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
            setRoles(mockRoles)
            setIsLoading(false)
        }, 1000)
    }, [refreshTrigger])

    const handleCreateRole = () => {
        setIsSaving(true)

        // Simulação de envio para API
        setTimeout(() => {
            const newRoleObj: Role = {
                id: `role-${Date.now()}`,
                name: newRole.name,
                description: newRole.description,
                isSystem: false,
                isDefault: newRole.isDefault,
                permissions: newRole.permissions,
                usersCount: 0,
            }

            setRoles([...roles, newRoleObj])
            setNewRole({
                name: "",
                id: "new-role-id",
                description: "",
                isDefault: false,
                usersCount: 0,
                isSystem: false,
                permissions: [],
            })
            setIsSaving(false)
            setIsCreateDialogOpen(false)
            onUpdate()
        }, 1500)
    }

    const handleUpdateRole = () => {
        if (!selectedRole) return

        setIsSaving(true)

        // Simulação de envio para API
        setTimeout(() => {
            setRoles(roles.map((role) => (role.id === selectedRole.id ? selectedRole : role)))

            setIsSaving(false)
            setIsEditDialogOpen(false)
            onUpdate()
        }, 1500)
    }

    const handleDeleteRole = () => {
        if (!selectedRole) return

        // Simulação de exclusão
        setRoles(roles.filter((role) => role.id !== selectedRole.id))
        setIsDeleteDialogOpen(false)
        onUpdate()
    }

    const handleTogglePermission = (permissionId: string, roleObj: Role | null) => {
        if (!roleObj) return

        const updatedPermissions = roleObj.permissions.includes(permissionId)
            ? roleObj.permissions.filter((id) => id !== permissionId)
            : [...roleObj.permissions, permissionId]

        if (roleObj === selectedRole) {
            setSelectedRole({
                ...selectedRole,
                permissions: updatedPermissions,
            })
        } else {
            setNewRole({
                ...newRole,
                permissions: updatedPermissions,
            })
        }
    }

    const handleToggleDefault = (roleId: string) => {
        setRoles(
            roles.map((role) => ({
                ...role,
                isDefault: role.id === roleId,
            })),
        )

        onUpdate()
    }

    const getPermissionsByModule = () => {
        const modules: Record<string, Permission[]> = {}

        permissions.forEach((permission) => {
            if (!modules[permission.module]) {
                modules[permission.module] = []
            }
            modules[permission.module].push(permission)
        })

        return modules
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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Papéis e Permissões</CardTitle>
                    <CardDescription>Gerencie os papéis de usuários e suas permissões</CardDescription>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Papel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Papel</DialogTitle>
                            <DialogDescription>Defina um novo papel e suas permissões no sistema</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Nome do Papel</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Gerente de Vendas"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Descreva as responsabilidades deste papel"
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={newRole.isDefault}
                                    onCheckedChange={(checked) => setNewRole({ ...newRole, isDefault: checked as boolean })}
                                />
                                <Label htmlFor="isDefault">Definir como papel padrão para novos usuários</Label>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label>Permissões</Label>

                                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                                    <div key={module} className="space-y-2">
                                        <h4 className="text-sm font-medium">{module}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                                            {modulePermissions.map((permission) => (
                                                <div key={permission.id} className="flex items-start space-x-2">
                                                    <Checkbox
                                                        id={`new-${permission.id}`}
                                                        checked={newRole.permissions.includes(permission.id)}
                                                        onCheckedChange={() => handleTogglePermission(permission.id, newRole)}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <Label
                                                            htmlFor={`new-${permission.id}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {permission.name}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCreateRole}
                                disabled={isSaving || !newRole.name || newRole.permissions.length === 0}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    "Criar Papel"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Papel</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="w-[150px]">Usuários</TableHead>
                                <TableHead className="w-[100px]">Padrão</TableHead>
                                <TableHead className="w-[100px]">Tipo</TableHead>
                                <TableHead className="text-right w-[100px]">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{role.usersCount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {role.isSystem ? (
                                            <Badge variant="outline" className="pointer-events-none opacity-50">
                                                N/A
                                            </Badge>
                                        ) : (
                                            <Switch
                                                checked={role.isDefault}
                                                onCheckedChange={() => handleToggleDefault(role.id)}
                                                aria-label="Toggle default role"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {role.isSystem ? (
                                            <Badge variant="secondary">
                                                <ShieldAlert className="mr-1 h-3 w-3" />
                                                Sistema
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                <ShieldCheck className="mr-1 h-3 w-3" />
                                                Personalizado
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Ações</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRole(role)
                                                            setIsEditDialogOpen(true)
                                                        }}
                                                        disabled={role.isSystem}
                                                    >
                                                        Editar Papel
                                                    </DropdownMenuItem>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        {selectedRole && (
                                                            <>
                                                                <DialogHeader>
                                                                    <DialogTitle>Editar Papel</DialogTitle>
                                                                    <DialogDescription>
                                                                        Modifique as permissões e configurações deste papel
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="grid gap-6 py-4">
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="edit-name">Nome do Papel</Label>
                                                                        <Input
                                                                            id="edit-name"
                                                                            value={selectedRole.name}
                                                                            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                                                        />
                                                                    </div>

                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="edit-description">Descrição</Label>
                                                                        <Textarea
                                                                            id="edit-description"
                                                                            value={selectedRole.description}
                                                                            onChange={(e) =>
                                                                                setSelectedRole({ ...selectedRole, description: e.target.value })
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="flex items-center space-x-2">
                                                                        <Checkbox
                                                                            id="edit-isDefault"
                                                                            checked={selectedRole.isDefault}
                                                                            onCheckedChange={(checked) =>
                                                                                setSelectedRole({ ...selectedRole, isDefault: checked as boolean })
                                                                            }
                                                                        />
                                                                        <Label htmlFor="edit-isDefault">
                                                                            Definir como papel padrão para novos usuários
                                                                        </Label>
                                                                    </div>

                                                                    <Separator />

                                                                    <div className="space-y-4">
                                                                        <Label>Permissões</Label>

                                                                        {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                                                                            <div key={module} className="space-y-2">
                                                                                <h4 className="text-sm font-medium">{module}</h4>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                                                                                    {modulePermissions.map((permission) => (
                                                                                        <div key={permission.id} className="flex items-start space-x-2">
                                                                                            <Checkbox
                                                                                                id={`edit-${permission.id}`}
                                                                                                checked={selectedRole.permissions.includes(permission.id)}
                                                                                                onCheckedChange={() =>
                                                                                                    handleTogglePermission(permission.id, selectedRole)
                                                                                                }
                                                                                            />
                                                                                            <div className="grid gap-1.5 leading-none">
                                                                                                <Label
                                                                                                    htmlFor={`edit-${permission.id}`}
                                                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                                                >
                                                                                                    {permission.name}
                                                                                                </Label>
                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                    {permission.description}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <DialogFooter>
                                                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleUpdateRole}
                                                                        disabled={isSaving || !selectedRole.name || selectedRole.permissions.length === 0}
                                                                    >
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

                                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedRole(role)
                                                            setIsDeleteDialogOpen(true)
                                                        }}
                                                        disabled={role.isSystem || role.usersCount > 0}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        Excluir Papel
                                                    </DropdownMenuItem>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o papel
                                                                {selectedRole && ` "${selectedRole.name}"`} e suas configurações.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={handleDeleteRole}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Excluir
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

