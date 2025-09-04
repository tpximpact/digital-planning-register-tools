/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleBopsPostRequest } from '../requests'

export async function postComment(
  client: string,
  reference: string,
  apiData: any
): Promise<any> {
  const url = `planning_applications/${reference}/comments/public`

  try {
    const request = await handleBopsPostRequest(client, url, apiData)
    return request
  } catch (error) {
    console.error(`Error posting comment for ${reference}:`, error)
    throw error
  }
}
