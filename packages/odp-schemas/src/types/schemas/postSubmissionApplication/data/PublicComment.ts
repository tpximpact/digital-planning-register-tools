import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { PublicCommentTopicSchema } from '../enums/PublicCommentTopic'
import { PublicCommentSentimentSchema } from '../enums/CommentSentiment'
import { CommentMetaDataSchema } from './CommentMetaData'
import { AddressSchema } from '../../../shared/Addresses'

export type TopicAndComments = Static<typeof TopicAndCommentsSchema>
export const TopicAndCommentsSchema = Type.Object(
  {
    topic: PublicCommentTopicSchema,
    question: Type.String(),
    comment: Type.String()
  },
  {
    id: '#TopicAndComments',
    description: 'A comment on an application, divided by topic'
  }
)

// type PublicCommentBase = Static<typeof PublicCommentBaseSchema>
const PublicCommentBaseSchema = Type.Object(
  {
    id: Type.String(),
    sentiment: PublicCommentSentimentSchema,
    metadata: CommentMetaDataSchema
  },
  { internal: 'All the required fields for a public or private public comment' }
)

export type PublicCommentAuthor = Static<typeof PublicCommentAuthorSchema>
export const PublicCommentAuthorSchema = Type.Object(
  {
    name: Type.Object({
      singleLine: Type.String()
    }),
    address: AddressSchema
  },
  { id: '#PublicCommentAuthor', description: 'The author of a public comment' }
)

export type PublicCommentAuthorRedacted = Static<
  typeof PublicCommentAuthorRedactedSchema
>
export const PublicCommentAuthorRedactedSchema = Type.Object(
  {
    name: Type.Object({
      singleLine: Type.String()
    })
  },
  {
    id: '#PublicCommentAuthorRedacted',
    description: 'The author of a public comment'
  }
)

export type PublicComment = Static<typeof PublicCommentSchema>
export const PublicCommentSchema = Type.Composite(
  [
    PublicCommentBaseSchema,
    Type.Object({
      author: PublicCommentAuthorSchema,
      comment: Type.Union([Type.Array(TopicAndCommentsSchema), Type.String()]),
      commentRedacted: Type.Optional(
        Type.Union([Type.Array(TopicAndCommentsSchema), Type.String()])
      )
    })
  ],
  {
    id: '#PublicComment',
    description:
      'A public comment and any associated metadata, including sensitive information'
  }
)

export type PublicCommentRedacted = Static<typeof PublicCommentRedactedSchema>
export const PublicCommentRedactedSchema = Type.Composite(
  [
    PublicCommentBaseSchema,
    Type.Object({
      author: PublicCommentAuthorRedactedSchema,
      commentRedacted: Type.Union([
        Type.Array(TopicAndCommentsSchema),
        Type.String()
      ]),
      metadata: Type.Required(CommentMetaDataSchema)
    })
  ],
  {
    id: '#PublicCommentRedacted',
    description:
      'A public comment and any associated metadata, excluding sensitive information'
  }
)
