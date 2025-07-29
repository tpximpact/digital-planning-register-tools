import { ExampleComponent } from '@dpr/ui/components'
import { serverApi } from '@dpr/libs'
import { Suspense } from 'react'

export default async function Home() {
  const { data } = await serverApi.get()
  return (
    <main>
      <h1>Example next.js app</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <code>{JSON.stringify(data)}</code>
      </Suspense>
      <ExampleComponent
        name={'from the ui package to the next-example package'}
      />
    </main>
  )
}
