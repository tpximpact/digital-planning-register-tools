import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { CommentMetaData } from './CommentMetaData'
import { PostSubmissionFile } from './PostSubmissionFile'
import { SpecialistCommentSentiment } from '../enums/CommentSentiment'
import '../../../shared/formats'

type SpecialistBase = Static<typeof SpecialistBase>
const SpecialistBase = Type.Object(
  {
    id: Type.String(),
    organisationSpecialism: Type.Optional(Type.String()),
    jobTitle: Type.Optional(Type.String()),
    reason: Type.Optional(
      Type.Union([Type.Literal('constraint'), Type.String()])
    ),
    // @TODO
    // constraints: Type.Optional(Type.Array(PlanningConstraint)),
    firstConsultedAt: Type.String({ format: 'date-time' })
  },
  { internal: 'All the required fields for a public or private specialist' }
)

type SpecialistCommentBase = Static<typeof SpecialistCommentBase>
const SpecialistCommentBase = Type.Object(
  {
    id: Type.String(),
    sentiment: SpecialistCommentSentiment,
    files: Type.Optional(Type.Array(PostSubmissionFile)),
    metadata: CommentMetaData
  },
  {
    internal:
      'All the required fields for a public or private specialist comment'
  }
)

export type SpecialistComment = Static<typeof SpecialistComment>
export const SpecialistComment = Type.Composite(
  [
    SpecialistCommentBase,
    Type.Object({
      comment: Type.String(),
      commentRedacted: Type.Optional(Type.String())
    })
  ],
  {
    id: '#SpecialistComment',
    description: 'A specialist comment and any associated metadata'
  }
)

export type SpecialistCommentRedacted = Static<typeof SpecialistCommentRedacted>
export const SpecialistCommentRedacted = Type.Composite(
  [
    SpecialistCommentBase,
    Type.Object({
      commentRedacted: Type.String(),
      metadata: Type.Required(CommentMetaData)
    })
  ],
  {
    id: '#SpecialistCommentRedacted',
    description:
      'A public comment and any associated metadata, excluding sensitive information'
  }
)

export type Specialist = Static<typeof Specialist>
export const Specialist = Type.Composite(
  [
    SpecialistBase,
    Type.Object({
      comments: Type.Array(SpecialistComment)
    })
  ],
  {
    id: '#Specialist',
    description: 'Details of a specialist and their comments on an application'
  }
)

export type SpecialistRedacted = Static<typeof SpecialistRedacted>
export const SpecialistRedacted = Type.Composite(
  [
    SpecialistBase,
    Type.Object({
      comments: Type.Array(SpecialistCommentRedacted)
    })
  ],
  {
    id: '#SpecialistRedacted',
    description: 'Details of a specialist and their comments on an application'
  }
)
