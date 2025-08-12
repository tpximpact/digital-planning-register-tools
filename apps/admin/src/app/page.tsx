import { ExampleComponent } from '@dpr/ui/components'
import { Clients, dprApi } from '@dpr/libs'
import { Suspense } from 'react'
import { db } from '../libs/db'
import { ClientsTable } from '../components/ClientsTable'

export default async function Home() {
  const { data } = await dprApi.get()
  let result: Clients | undefined = []
  let loadingError = false

  try {
    result = await db.query.clients.findMany()
  } catch (error) {
    loadingError = true
    console.error('Database query failed:', error)
  }

  return (
    <main>
      <h1>Admin</h1>

      <Suspense fallback={<div>Loading...</div>}>
        {data && <code>{JSON.stringify(data)}</code>}
      </Suspense>

      <ExampleComponent
        name={'from the ui package to the next-example package'}
      />
      {loadingError ? (
        <div>Error fetching clients.</div>
      ) : (
        <>
          {result && result.length > 0 ? (
            <ClientsTable clients={result} />
          ) : (
            <div>No clients found.</div>
          )}
        </>
      )}
    </main>
  )
}
