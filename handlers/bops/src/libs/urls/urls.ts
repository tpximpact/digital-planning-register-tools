import { ENV_HANDLER_BOPS as ENV } from '@dpr/config'
import { createUrlSearchParams } from '@dpr/libs'
import type {
  PostSubmissionPublishedApplicationsQueryParams,
  PostSubmissionPublishedDocumentsQueryParams,
  PostSubmissionPublishedPublicCommentsQueryParams,
  PostSubmissionPublishedSpecialistsQueryParams
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'

const {
  BOPS_LEGACY_APPLICATIONS,
  BOPS_LEGACY_APPLICATION,
  BOPS_LEGACY_DOCUMENTS,
  BOPS_LEGACY_PUBLIC_COMMENTS,
  BOPS_LEGACY_SPECIALIST_COMMENTS
} = ENV

/**
 * Helper to build public comments endpoint URL with query params.
 */
export function getPublicApplicationsUrl(
  query?: PostSubmissionPublishedApplicationsQueryParams
): string {
  const legacy = BOPS_LEGACY_APPLICATIONS || false
  let url = legacy
    ? `public/planning_applications/search`
    : `public/planningApplications`
  if (query) {
    const { sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)

    if (legacy) {
      // Convert sortBy from publishedAt to receivedAt
      if (sortBy) {
        if (sortBy === 'publishedAt') params.append('sortBy', 'receivedAt')
      }
    }
    url += `?${params.toString()}`
  }
  return url
}

/**
 * Helper to build public application endpoint URL.
 * @param applicationId - ID of the application
 * @returns
 */
export function getPublicApplicationUrl(applicationId: string) {
  const legacy = BOPS_LEGACY_APPLICATION || false
  const url = legacy
    ? `public/planning_applications/${applicationId}`
    : `public/planningApplications/${applicationId}`

  return url
}

/**
 * Helper to build public application endpoint URL.
 * @param applicationId - ID of the application
 * @returns
 */
export function getPublicApplicationSubmissionUrl(applicationId: string) {
  const legacy = BOPS_LEGACY_APPLICATION || false
  const url = legacy
    ? `public/planning_applications/${applicationId}/submission`
    : `public/planningApplications/${applicationId}`

  return url
}

export function getPublicApplicationDocumentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedDocumentsQueryParams
): string {
  const legacy = BOPS_LEGACY_DOCUMENTS || false
  let url = legacy
    ? `public/planning_applications/${applicationId}/documents`
    : `public/planningApplications/${applicationId}/documents`
  if (query) {
    const { sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)

    if (legacy) {
      // Convert sortBy from publishedAt to receivedAt
      if (sortBy) {
        if (sortBy === 'publishedAt') params.append('sortBy', 'receivedAt')
      }
    }
    url += `?${params.toString()}`
  }
  return url
}

export function getPublicApplicationPublicCommentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedPublicCommentsQueryParams
): string {
  const legacy = BOPS_LEGACY_PUBLIC_COMMENTS || false
  let url = legacy
    ? `public/planning_applications/${applicationId}/comments/public`
    : `public/planningApplications/${applicationId}/publicComments`
  if (query) {
    const { sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)

    if (legacy) {
      // Convert sortBy from publishedAt to receivedAt
      if (sortBy) {
        if (sortBy === 'publishedAt') params.append('sortBy', 'receivedAt')
      }
    }
    url += `?${params.toString()}`
  }
  return url
}

export function getPublicApplicationSpecialistCommentsUrl(
  applicationId: string,
  query?: PostSubmissionPublishedSpecialistsQueryParams
): string {
  const legacy = BOPS_LEGACY_SPECIALIST_COMMENTS || false
  let url = legacy
    ? `public/planning_applications/${applicationId}/comments/specialist`
    : `public/planningApplications/${applicationId}/specialistComments`
  if (query) {
    const { sortBy, ...searchParams } = query
    const params = createUrlSearchParams(searchParams)

    if (legacy) {
      // Convert sortBy from publishedAt to receivedAt
      if (sortBy) {
        if (sortBy === 'publishedAt') params.append('sortBy', 'receivedAt')
      }
    }
    url += `?${params.toString()}`
  }
  return url
}

export function getPublicApplicationSpecialistCommentUrl(
  applicationId: string,
  specialistId: string,
  query?: PostSubmissionPublishedSpecialistsQueryParams
): string {
  const legacy = BOPS_LEGACY_SPECIALIST_COMMENTS || false
  let url = legacy
    ? `public/planning_applications/${applicationId}/comments/specialist`
    : `public/planningApplications/${applicationId}/specialistComments/${specialistId}`
  if (query) {
    const searchParams = query
    const params = createUrlSearchParams(searchParams)
    url += `?${params.toString()}`
  }
  return url
}
