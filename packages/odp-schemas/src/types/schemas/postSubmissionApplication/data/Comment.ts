import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import {
  PublicCommentSummarySchema,
  SpecialistCommentSummarySchema
} from './CommentSummary'
import {
  PublicCommentSchema,
  PublicCommentRedactedSchema
} from './PublicComment'
import { SpecialistSchema, SpecialistRedactedSchema } from './SpecialistComment'

export type PublicComments = Static<typeof PublicCommentsSchema>
export const PublicCommentsSchema = Type.Object(
  {
    summary: PublicCommentSummarySchema,
    comments: Type.Array(PublicCommentSchema)
  },
  {
    id: '#PublicComments',
    description: 'The ordered list of public comments any associated metadata'
  }
)

export type PublicCommentsRedacted = Static<typeof PublicCommentsRedactedSchema>
export const PublicCommentsRedactedSchema = Type.Object(
  {
    summary: PublicCommentSummarySchema,
    comments: Type.Array(PublicCommentRedactedSchema)
  },
  {
    id: '#PublicCommentsRedacted',
    description: 'The ordered list of public comments any associated metadata'
  }
)

export type SpecialistComments = Static<typeof SpecialistCommentsSchema>
export const SpecialistCommentsSchema = Type.Object(
  {
    summary: SpecialistCommentSummarySchema,
    comments: Type.Array(SpecialistSchema)
  },
  {
    id: '#SpecialistComments',
    description:
      'The ordered list of specialist comments any associated metadata'
  }
)

export type SpecialistCommentsRedacted = Static<
  typeof SpecialistCommentsRedactedSchema
>
export const SpecialistCommentsRedactedSchema = Type.Object(
  {
    summary: SpecialistCommentSummarySchema,
    comments: Type.Array(SpecialistRedactedSchema)
  },
  {
    id: '#SpecialistCommentsRedacted',
    description:
      'The ordered list of specialist comments any associated metadata'
  }
)
