import { requireUser } from "@/lib/auth"
import { requireSelectedOrg } from "@/lib/org"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardPanels } from "@/components/dashboard/DashboardPanels"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)

  const org = membership.organization

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />
      <DashboardPanels />
    </main>
  )
}



