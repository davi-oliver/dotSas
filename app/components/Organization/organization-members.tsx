"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, MoreHorizontal, Plus, Search, Shield, User } from "lucide-react"
import { Member } from "@/types/organization"

interface OrganizationMembersProps {
  refreshTrigger?: number
  onUpdate: () => void
}



export default function OrganizationMembers({ refreshTrigger, onUpdate }: OrganizationMembersProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    // Simulação de carregamento de dados
    setIsLoading(true)
    setTimeout(() => {
      const mockMembers: Member[] = [
        {
          id: "user-1",
          name: "João Silva",
          email: "joao.silva@example.com",
          role: "owner",
          avatar: "/placeholder.svg?height=40&width=40",
          status: "active",
          joinedAt: "2022-01-15",
        },
        {
          id: "user-2",
          name: "Maria Oliveira",
          email: "maria.oliveira@example.com",
          role: "admin",
          avatar: "/placeholder.svg?height=40&width=40",
          status: "active",
          joinedAt: "2022-02-20",
        },
        {
          id: "user-3",
          name: "Pedro Santos",
          email: "pedro.santos@example.com",
          role: "member",
          avatar: "/placeholder.svg?height=40&width=40",
          status: "active",
          joinedAt: "2022-03-10",
        },
        {
          id: "user-4",
          name: "Ana Costa",
          email: "ana.costa@example.com",
          role: "member",
          status: "active",
          joinedAt: "2022-04-05",
        },
        {
          id: "user-5",
          name: "Carlos Ferreira",
          email: "carlos.ferreira@example.com",
          role: "guest",
          status: "invited",
          joinedAt: "-",
        },
      ]

      setMembers(mockMembers)
      setFilteredMembers(mockMembers)
      setIsLoading(false)
    }, 1000)
  }, [refreshTrigger])

  useEffect(() => {
    if (searchTerm) {
      setFilteredMembers(
        members.filter(
          (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else {
      setFilteredMembers(members)
    }
  }, [members, searchTerm])

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    setIsInviting(true)

    // Simulação de envio para API
    setTimeout(() => {
      const newMember: Member = {
        id: `user-${members.length + 1}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole as Member["role"],
        status: "invited",
        joinedAt: "-",
      }

      setMembers([...members, newMember])
      setInviteEmail("")
      setInviteRole("member")
      setIsInviting(false)
      setIsInviteDialogOpen(false)
      onUpdate()
    }, 1500)
  }

  const handleUpdateMemberRole = (memberId: string, newRole: Member["role"]) => {
    setMembers(members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
    onUpdate()
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
    onUpdate()
  }

  const getRoleBadge = (role: Member["role"]) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-primary">Proprietário</Badge>
      case "admin":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            Administrador
          </Badge>
        )
      case "member":
        return <Badge variant="secondary">Membro</Badge>
      case "guest":
        return <Badge variant="outline">Convidado</Badge>
    }
  }

  const getStatusBadge = (status: Member["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Ativo
          </Badge>
        )
      case "invited":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Convidado
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Suspenso
          </Badge>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
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
          <CardTitle>Membros da Organização</CardTitle>
          <CardDescription>Gerencie os membros e suas permissões</CardDescription>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Membro</DialogTitle>
              <DialogDescription>
                Envie um convite por email para adicionar um novo membro à organização.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="guest">Convidado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInviteMember} disabled={isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Convite"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum membro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>{member.joinedAt}</TableCell>
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
                          {member.role !== "owner" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Alterar Função</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleUpdateMemberRole(member.id, "admin")}
                                disabled={member.role === "admin"}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Administrador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateMemberRole(member.id, "member")}
                                disabled={member.role === "member"}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Membro
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateMemberRole(member.id, "guest")}
                                disabled={member.role === "guest"}
                              >
                                <User className="mr-2 h-4 w-4" />
                                Convidado
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          {member.role !== "owner" && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              Remover Membro
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

