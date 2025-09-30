import { type PostSubmissionFileAssociation } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/PostSubmissionFileAssociation.ts'
import type { BopsFile } from '../../schemas/shared/BopsFile'
import {
  PostSubmissionFile as PostSubmissionFileSchema,
  type PostSubmissionFile
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import type { PrototypeFileType as FileType } from '@dpr/odp-schemas/types/schemas/prototypeApplication/enums/FileType.ts'
import { convertDateTimeToUtc } from '../../utils/formatDates'
import { Value } from '@sinclair/typebox/value'

export const convertDocumentBopsFile = (
  document: BopsFile,
  association: PostSubmissionFileAssociation = 'application'
): PostSubmissionFile | undefined => {
  const postSubmissionFile: PostSubmissionFile = {
    id: Math.ceil(Math.random() * 10000),
    name: document.name ?? 'Unnamed document',
    association: association ?? 'application',
    // nb not validating here yet as its not needed in DPR (yet)
    type:
      Array.isArray(document.type) && document.type.length > 0
        ? (document.type.map((t) => t.value) as FileType[])
        : ['otherDocument'],
    url: document.url,
    metadata: {
      size: {
        bytes: document.metadata?.byteSize ?? 0
      },
      mimeType: document.metadata?.contentType ?? 'application/octet-stream',
      createdAt: convertDateTimeToUtc(document.createdAt),
      submittedAt: convertDateTimeToUtc(document.createdAt),
      validatedAt: convertDateTimeToUtc(document.createdAt),
      publishedAt: convertDateTimeToUtc(document.createdAt)
    }
  }

  if (!Value.Check(PostSubmissionFileSchema, postSubmissionFile)) {
    return undefined
  }

  return postSubmissionFile
}
