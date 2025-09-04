import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { PostSubmissionFileAssociation } from '../enums/PostSubmissionFileAssociation'
import { FileType } from '../enums/FileType'
import '../../utils'

type PostSubmissionFileMetadata = Static<typeof PostSubmissionFileMetadata>
const PostSubmissionFileMetadata = Type.Object(
  {
    size: Type.Object({
      bytes: Type.Number()
    }),
    mimeType: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    submittedAt: Type.String({ format: 'date-time' }),
    validatedAt: Type.Optional(Type.String({ format: 'date-time' })),
    publishedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { description: 'Metadata about the file' }
)

export type PostSubmissionFile = Static<typeof PostSubmissionFile>
export const PostSubmissionFile = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    association: PostSubmissionFileAssociation,
    version: Type.Optional(Type.Number()),
    type: Type.Array(FileType),
    url: Type.String(),
    thumbnailUrl: Type.Optional(Type.String()),
    referencesInDocument: Type.Optional(Type.Array(Type.String())),
    description: Type.Optional(Type.String()),
    metadata: PostSubmissionFileMetadata
  },
  {
    id: '#PostSubmissionFile',
    description:
      'File uploaded and labeled by the user to support the application'
  }
)
