import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { SpecialistCommentSummary } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
import { DprComment } from '../../shared/DprComment'

export const DprSpecialistCommentsEndpoint = ApiResponse(
  Type.Union([
    Type.Object({
      comments: Type.Array(DprComment),
      summary: SpecialistCommentSummary
    }),
    Type.Null()
  ])
)
export type DprSpecialistCommentsEndpoint = Static<
  typeof DprSpecialistCommentsEndpoint
>
