import { GovukPageLayout } from '@dpr/ui/layouts'
import { GovukHeading, GovukBody } from '@dpr/ui/components'

export default async function Home() {
  return (
    <GovukPageLayout>
      <GovukHeading size={'l'} tag={'h2'}>
        Admin Dashboard
      </GovukHeading>
      <GovukBody>Welcome to the admin dashboard.</GovukBody>
    </GovukPageLayout>
  )
}
