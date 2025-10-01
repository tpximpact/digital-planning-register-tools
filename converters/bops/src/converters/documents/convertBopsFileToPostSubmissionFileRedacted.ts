import { Value } from '@sinclair/typebox/value'

import {
  type PostSubmissionFileRedacted,
  PostSubmissionFileRedacted as PostSubmissionFileRedactedSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import type { PostSubmissionFileAssociation } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/PostSubmissionFileAssociation.ts'
import { convertDateTimeToUtc } from '../../utils/formatDates'
import {
  type FileType,
  FileType as FileTypeSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/FileType.ts'

export const convertTypesToFileType = (fileTypes: unknown[]): FileType[] => {
  const seen = new Set<FileType>()
  return fileTypes
    .filter(
      (item): item is { value: unknown } =>
        typeof item === 'object' && item !== null && 'value' in item
    )
    .map((item) => item.value)
    .filter((value): value is FileType => Value.Check(FileTypeSchema, value))
    .filter((value) => {
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
}

export const convertBopsFileToPostSubmissionFileRedacted = (
  // allowed since it could really be anything and we don't need the typeguards from unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  association: PostSubmissionFileAssociation
): PostSubmissionFileRedacted => {
  if (Value.Check(PostSubmissionFileRedactedSchema, file)) {
    return file
  }

  const redactedUrl = file.url

  if (!redactedUrl) {
    throw new Error('File is missing url')
  }

  const object: PostSubmissionFileRedacted = {
    id: Date.now() + Math.floor(Math.random() * 1e9),
    name: file.name,
    redactedUrl,
    type: convertTypesToFileType(file.fileTypes ?? []),
    association: association ?? 'application',
    referencesInDocument: Array.isArray(file.referencesInDocument)
      ? file.referencesInDocument
      : undefined,
    description: file.applicantDescription ?? undefined,
    metadata: {
      size: { bytes: file.metadata.byteSize ?? 0 },
      mimeType: file.metadata.contentType ?? 'application/octet-stream',
      createdAt: convertDateTimeToUtc(file.createdAt),
      submittedAt: convertDateTimeToUtc(file.createdAt),
      validatedAt: convertDateTimeToUtc(file.createdAt),
      publishedAt: convertDateTimeToUtc(file.createdAt)
    }
  }

  if (Value.Check(PostSubmissionFileRedactedSchema, object)) {
    return object
  }

  throw new Error('Unable to convert file')
}
