"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 
import { ShieldCheck, Grid3X3, UserCog } from "lucide-react"
import RolesManagement from "./roles-management"
import PermissionsMatrix from "./permissions-matrix"
import UserPermissions from "./user-permissions"
 

export default function PermissionsManagement() {
  const [activeTab, setActiveTab] = useState("roles")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDataUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Papéis</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Matriz de Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Permissões por Usuário</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RolesManagement refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="matrix">
          <PermissionsMatrix refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="users">
          <UserPermissions refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

