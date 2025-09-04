'use server'
import { getClientBySlug } from 'apps/admin/src/app/clients/actions'
import { NextRequest, NextResponse } from 'next/server'

const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authToken = request.headers.get('authorization')
  if (authToken !== `Bearer ${INTERNAL_API_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await getClientBySlug(params.slug)

    if (!client) {
      return NextResponse.json(
        { error: `Configuration for client '${params.slug}' not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      endpoint: client.endpoint
    })
  } catch (e) {
    console.error(`Failed to fetch config for ${params.slug}:`, e)
    return NextResponse.json(
      { error: 'Internal database error' },
      { status: 500 }
    )
  }
}
