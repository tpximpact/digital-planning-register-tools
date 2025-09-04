'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '../../libs/db'
import { clients } from '../../db/clients'
import { eq } from 'drizzle-orm'
import type { Client } from '../../types/types'

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const endpoint = formData.get('endpoint') as string

  if (!name || !endpoint) {
    return
  }

  try {
    await db.insert(clients).values({ name, endpoint })
  } catch (_error) {
    return
  }

  revalidatePath('/clients')
  redirect('/clients')
}

export async function getClients() {
  try {
    return await db.query.clients.findMany({
      orderBy: (clients, { asc }) => [asc(clients.id)]
    })
  } catch (error) {
    console.error('Database query failed:', error)
    return []
  }
}

export async function getClientById(id: Client['id']) {
  return db.query.clients.findFirst({
    where: eq(clients.id, id)
  })
}

export async function getClientBySlug(slug: string) {
  return db.query.clients.findFirst({
    where: eq(clients.slug, slug)
  })
}
export async function updateClient(id: Client['id'], formData: FormData) {
  const name = formData.get('name') as string
  const endpoint = formData.get('endpoint') as string

  await db.update(clients).set({ name, endpoint }).where(eq(clients.id, id))

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)

  redirect(`/clients/${id}`)
}

export async function deleteClient(id: Client['id']) {
  await db.delete(clients).where(eq(clients.id, id))

  revalidatePath('/clients')

  redirect('/clients')
}
