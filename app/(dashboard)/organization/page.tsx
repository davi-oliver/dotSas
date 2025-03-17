import OrganizationManagement from "@/app/components/Organization/organization-management";

export default function OrganizationPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Gerenciamento da Organização</h1>
      <p className="text-muted-foreground mb-6">Configure sua organização, gerencie membros e controle assinaturas</p>

      <OrganizationManagement />
    </main>
  )
}

