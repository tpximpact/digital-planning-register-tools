import { Value } from '@sinclair/typebox/value'
import {
  BopsPostComment as BopsPostCommentSchema,
  type BopsPostComment
} from '../../schemas/bops/publicComments'
import {
  PostSubmissionPublicCommentPostBody as PostSubmissionPublicCommentPostBodySchema,
  type PostSubmissionPublicCommentPostBody
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { concatenateFieldsInOrder } from '@dpr/libs'

export const convertOdpPublicCommentToBops = (
  comment: PostSubmissionPublicCommentPostBody
): BopsPostComment | undefined => {
  if (!Value.Check(PostSubmissionPublicCommentPostBodySchema, comment)) {
    return undefined
  }

  if (!comment.author) {
    return undefined
  }

  const commentContent:
    | Pick<BopsPostComment, 'response' | 'tags'>
    | Pick<BopsPostComment, 'response'> = Array.isArray(comment.comment)
    ? comment.comment.reduce(
        (accumulator, currentValue) => {
          accumulator.response += `${currentValue.topic}: \n${currentValue.comment}\n\n\n\n`
          if (currentValue.topic) {
            accumulator.tags.push(currentValue.topic)
          }
          return accumulator
        },
        {
          response: '',
          tags: [] as string[]
        }
      )
    : { response: comment.comment }

  const bopsPostComment: BopsPostComment = {
    name: comment.author.name.singleLine,
    address: comment?.author?.address
      ? concatenateFieldsInOrder(
          comment.author.address,
          ['line1', 'line2', 'town', 'county', 'postcode', 'country'],
          ', '
        )
      : undefined,
    summary_tag: comment.sentiment,
    ...commentContent
  }

  if (!Value.Check(BopsPostCommentSchema, bopsPostComment)) {
    return undefined
  }

  return bopsPostComment
}
