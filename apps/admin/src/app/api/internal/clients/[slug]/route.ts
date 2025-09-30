'use server'
import { getClientBySlug } from 'apps/admin/src/app/clients/actions'
import { NextRequest, NextResponse } from 'next/server'
import { ENV_ADMIN as env } from '@dpr/config'

const { INTERNAL_API_TOKEN } = env

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const authToken = request.headers.get('authorization')
  if (authToken !== `Bearer ${INTERNAL_API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await getClientBySlug(slug)

    if (!client) {
      return NextResponse.json(
        { error: `Configuration for client '${slug}' not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      endpoint: client.endpoint
    })
  } catch (e) {
    console.error(`Failed to fetch config for ${slug}:`, e)
    return NextResponse.json(
      { error: 'Internal database error' },
      { status: 500 }
    )
  }
}
