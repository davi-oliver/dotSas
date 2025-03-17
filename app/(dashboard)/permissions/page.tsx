import PermissionsManagement from "@/app/components/Permissions/permissions-management";

export default function PermissionsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Gerenciamento de Permissões</h1>
      <p className="text-muted-foreground mb-6">
        Configure papéis e permissões para controlar o acesso aos recursos do sistema
      </p>

      <PermissionsManagement />
    </main>
  )
}

