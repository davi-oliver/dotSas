"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { Building2, Users, CreditCard, Plug, Settings } from "lucide-react"
import OrganizationSwitcher from "./switcher"
import OrganizationProfile from "./organization-profile"
import OrganizationMembers from "./organization-members"
import OrganizationSubscription from "./organization-subscriptions"
import OrganizationIntegrations from "./organization-integrations"
import OrganizationSettings from "./organization-settings"

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState("profile")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDataUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <OrganizationSwitcher onOrganizationChange={handleDataUpdated} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Membros</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Assinatura</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configurações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <OrganizationProfile refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="members">
          <OrganizationMembers refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="subscription">
          <OrganizationSubscription refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="integrations">
          <OrganizationIntegrations refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>

        <TabsContent value="settings">
          <OrganizationSettings refreshTrigger={refreshTrigger} onUpdate={handleDataUpdated} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

