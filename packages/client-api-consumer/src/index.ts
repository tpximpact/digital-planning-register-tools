import { treaty } from '@elysiajs/eden'
import type { App } from '@apps/server-api'

const client = treaty<App>('localhost:4000')

const { data } = await client.get()

// response: 1895
// .id({ id: 1 })
const { data: applicationsData } = await client.api[
  '@next'
].public.planningApplications.get({
  headers: {
    'x-client': 'cavyshire',
    'x-service': 'client-api-consumer'
  },
  query: {}
})

const { data: id } = await client.api['@next'].public.planningApplications
  .id({ id: 1 })
  .get({
    headers: {
      'x-client': 'cavyshire',
      'x-service': 'client-api-consumer'
    },
    query: {}
  })

// // response: { id: 1895, name: 'Skadi' }
// const { data: nendoroid } = await client.mirror.post({
//   id: 1895,
//   name: 'Skadi'
// })

console.log(data)
console.log(applicationsData)
console.log(id)
// console.log(nendoroid)
