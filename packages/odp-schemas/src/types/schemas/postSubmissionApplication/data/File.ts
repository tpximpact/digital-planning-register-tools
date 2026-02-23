import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { PostSubmissionFileAssociationSchema } from '../enums/PostSubmissionFileAssociation'
import { FileTypeSchema } from '../enums/FileType'
import '../../../shared/formats'

export type PostSubmissionFileMetadata = Static<
  typeof PostSubmissionFileMetadataSchema
>
export const PostSubmissionFileMetadataSchema = Type.Object(
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

export type PostSubmissionFileBase = Static<typeof PostSubmissionFileBaseSchema>
export const PostSubmissionFileBaseSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    association: PostSubmissionFileAssociationSchema,
    version: Type.Optional(Type.Number()),
    type: Type.Array(FileTypeSchema),
    thumbnailUrl: Type.Optional(Type.String()),
    referencesInDocument: Type.Optional(Type.Array(Type.String())),
    description: Type.Optional(Type.String()),
    metadata: PostSubmissionFileMetadataSchema
  },
  {
    id: '#PostSubmissionFileBase',
    description:
      'File uploaded and labeled by the user to support the application'
  }
)

export type PostSubmissionFile = Static<typeof PostSubmissionFileSchema>
export const PostSubmissionFileSchema = Type.Composite(
  [
    PostSubmissionFileBaseSchema,
    Type.Object({
      url: Type.String(),
      redactedUrl: Type.Optional(Type.String())
    })
  ],
  {
    id: '#PostSubmissionFile',
    description:
      'File uploaded and labeled by the user to support the application'
  }
)

export type PostSubmissionFileRedacted = Static<
  typeof PostSubmissionFileRedactedSchema
>
export const PostSubmissionFileRedactedSchema = Type.Intersect(
  [
    PostSubmissionFileBaseSchema,
    Type.Object({
      redactedUrl: Type.String()
    })
  ],
  {
    id: '#PostSubmissionFile',
    description:
      'File uploaded and labeled by the user to support the application'
  }
)
