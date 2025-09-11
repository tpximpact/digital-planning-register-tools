import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'

export type DprApplicationSubmissionSubtopicValue = Static<
  typeof DprApplicationSubmissionSubtopicValue
>
export const DprApplicationSubmissionSubtopicValue = Type.Recursive((This) =>
  Type.Object({
    description: Type.String(),
    value: Type.Union([
      Type.String(),
      Type.Null(),
      Type.Any(), // JSX.Element
      Type.Array(This)
    ]),
    map: Type.Optional(Type.Any())
  })
)

export type DprApplicationSubmissionSubtopic = Static<
  typeof DprApplicationSubmissionSubtopic
>
export const DprApplicationSubmissionSubtopic = Type.Object({
  subtopic: Type.String(),
  value: Type.Array(DprApplicationSubmissionSubtopicValue)
})

export const DprApplicationSubmissionEndpoint = ApiResponse(
  Type.Object({
    application: Type.Any(), // we're not using this
    submission: Type.Union([
      Type.Object({
        data: Type.Array(DprApplicationSubmissionSubtopic),
        metadata: Type.Object({
          submittedAt: Type.String({ format: 'date-time' }),
          raw: Type.String()
        })
      }),
      Type.Null()
    ])
  })
)
export type DprApplicationSubmissionEndpoint = Static<
  typeof DprApplicationSubmissionEndpoint
>
