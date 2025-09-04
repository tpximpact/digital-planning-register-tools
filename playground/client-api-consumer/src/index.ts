import { treaty } from '@elysiajs/eden'
// import { app } from '@dpr/api'
import type { App } from '@dpr/api'

await new Promise((resolve) => setTimeout(resolve, 1000))

const client = treaty<App>('localhost:4000')

const { data } = await client.get()

// response: 1895
// .id({ id: 1 })
const { data: applications, error: searchError } =
  await client.api.handlers.bops[
    '@next'
  ].public.planningApplications.search.get({
    headers: {
      'x-client': 'cavyshire',
      'x-service': 'client-api-consumer'
    },
    query: {}
  })
if (searchError) console.error('Search Error:', searchError.value)
else console.log('Search Result:', applications)

const { data: application, error: showError } = await client.api.handlers.bops[
  '@next'
].public
  .planningApplications({ reference: '1' })
  .get({
    headers: {
      'x-client': 'cavyshire',
      'x-service': 'client-api-consumer'
    },
    query: {}
  })

if (showError) console.error('Show Error:', showError.value)
else console.log('Single Application Result:', application)

// // response: { id: 1895, name: 'Skadi' }
// const { data: nendoroid } = await client.mirror.post({
//   id: 1895,
//   name: 'Skadi'
// })

console.log(data)
console.log(applications)
console.log(application)
// console.log(nendoroid)
