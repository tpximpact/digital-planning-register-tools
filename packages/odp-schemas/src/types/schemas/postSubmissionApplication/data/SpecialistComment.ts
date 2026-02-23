import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { CommentMetaDataSchema } from './CommentMetaData'
import {
  PostSubmissionFileSchema,
  PostSubmissionFileRedactedSchema
} from './File'
import { SpecialistCommentSentimentSchema } from '../enums/CommentSentiment'
import { AddressSchema } from '../../../shared/Addresses'
import '../../../shared/formats'

export type SpecialistCommentAuthor = Static<
  typeof SpecialistCommentAuthorSchema
>
export const SpecialistCommentAuthorSchema = Type.Object(
  {
    name: Type.Object({
      singleLine: Type.String()
    }),
    address: AddressSchema
  },
  {
    id: '#SpecialistCommentAuthor',
    description: 'The author of a public comment'
  }
)

export type SpecialistCommentAuthorRedacted = Static<
  typeof SpecialistCommentAuthorRedactedSchema
>
export const SpecialistCommentAuthorRedactedSchema = Type.Object(
  {
    name: Type.Object({
      singleLine: Type.String()
    })
  },
  {
    id: '#SpecialistCommentAuthorRedacted',
    description: 'The author of a public comment'
  }
)

// type SpecialistCommentBase = Static<typeof SpecialistCommentBaseSchema>
const SpecialistCommentBaseSchema = Type.Object(
  {
    id: Type.String(),
    sentiment: SpecialistCommentSentimentSchema,
    metadata: CommentMetaDataSchema
  },
  {
    internal:
      'All the required fields for a public or private specialist comment'
  }
)

export type SpecialistComment = Static<typeof SpecialistCommentSchema>
export const SpecialistCommentSchema = Type.Composite(
  [
    SpecialistCommentBaseSchema,
    Type.Object({
      files: Type.Optional(Type.Array(PostSubmissionFileSchema)),
      comment: Type.String(),
      commentRedacted: Type.Optional(Type.String())
    })
  ],
  {
    id: '#SpecialistComment',
    description: 'A specialist comment and any associated metadata'
  }
)

export type SpecialistCommentRedacted = Static<
  typeof SpecialistCommentRedactedSchema
>
export const SpecialistCommentRedactedSchema = Type.Composite(
  [
    SpecialistCommentBaseSchema,
    Type.Object({
      files: Type.Optional(Type.Array(PostSubmissionFileRedactedSchema)),
      commentRedacted: Type.String(),
      metadata: Type.Required(CommentMetaDataSchema)
    })
  ],
  {
    id: '#SpecialistCommentRedacted',
    description:
      'A public comment and any associated metadata, excluding sensitive information'
  }
)

export type SpecialistBase = Static<typeof SpecialistBaseSchema>
export const SpecialistBaseSchema = Type.Object(
  {
    id: Type.String(),
    organisationSpecialism: Type.Optional(Type.String()),
    jobTitle: Type.Optional(Type.String()),
    reason: Type.Optional(
      Type.Union([Type.Literal('constraint'), Type.String()])
    ),
    constraints: Type.Optional(Type.Array(Type.Any())), // @TODO PlanningConstraints
    firstConsultedAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { internal: 'All the required fields for a public or private specialist' }
)

export type Specialist = Static<typeof SpecialistSchema>
export const SpecialistSchema = Type.Intersect(
  [
    SpecialistBaseSchema,
    SpecialistCommentAuthorSchema,
    Type.Object({
      comments: Type.Optional(Type.Array(SpecialistCommentSchema))
    })
  ],
  {
    id: '#Specialist',
    description: 'Details of a specialist and their comments on an application'
  }
)

export type SpecialistRedacted = Static<typeof SpecialistRedactedSchema>
export const SpecialistRedactedSchema = Type.Intersect(
  [
    SpecialistBaseSchema,
    SpecialistCommentAuthorRedactedSchema,
    Type.Object({
      comments: Type.Array(SpecialistCommentRedactedSchema)
    })
  ],
  {
    id: '#SpecialistRedacted',
    description: 'Details of a specialist and their comments on an application'
  }
)
