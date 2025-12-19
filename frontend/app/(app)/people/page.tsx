import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { requireUser } from "@/lib/auth"
import { requireSelectedOrg, getOrgMembers } from "@/lib/org"
import { listEventPeople } from "@/lib/people"
import { PeoplePageContent } from "@/components/people-page-content"

export default async function PeoplePage() {
  const user = await requireUser()
  const membership = await requireSelectedOrg(user)
  const org = membership.organization

  // Fetch all people types in parallel
  const [organizers, volunteersResult, mentorsResult, judgesResult, sponsorsResult, partnersResult] =
    await Promise.all([
      getOrgMembers(org.id),
      listEventPeople("volunteer", org.id),
      listEventPeople("mentor", org.id),
      listEventPeople("judge", org.id),
      listEventPeople("sponsor", org.id),
      listEventPeople("partner", org.id),
    ])

  const volunteers = volunteersResult.success ? volunteersResult.data || [] : []
  const mentors = mentorsResult.success ? mentorsResult.data || [] : []
  const judges = judgesResult.success ? judgesResult.data || [] : []
  const sponsors = sponsorsResult.success ? sponsorsResult.data || [] : []
  const partners = partnersResult.success ? partnersResult.data || [] : []

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader orgName={org.name} userEmail={user.email} role={membership.role} />

      <section className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">People</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            One place for organizers, volunteers, mentors, judges, sponsors, and partners tied to
            your event.
          </p>
        </header>

        <PeoplePageContent
          organizers={organizers}
          volunteers={volunteers}
          mentors={mentors}
          judges={judges}
          sponsors={sponsors}
          partners={partners}
          orgId={org.id}
        />
      </section>
    </main>
  )
}





