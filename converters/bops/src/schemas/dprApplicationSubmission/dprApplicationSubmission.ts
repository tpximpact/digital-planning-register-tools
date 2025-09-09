import { Type, type Static } from '@sinclair/typebox'
import '@dpr/odp-schemas/types/shared/formats'
import { ApiResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'

type DprApplicationSubmissionSubtopicValue = Static<
  typeof DprApplicationSubmissionSubtopicValue
>
const DprApplicationSubmissionSubtopicValue = Type.Recursive((This) =>
  Type.Object({
    description: Type.String(),
    value: Type.Union([
      Type.String(),
      Type.Null(),

      // JSX.Element - budget version
      Type.Object({
        key: Type.Any(),
        ref: Type.Any(),
        props: Type.Any()
      }),

      Type.Array(This)
    ]),
    map: Type.Optional(Type.Any())
  })
)

type DprApplicationSubmissionSubtopic = Static<
  typeof DprApplicationSubmissionSubtopic
>
const DprApplicationSubmissionSubtopic = Type.Object({
  subtopic: Type.String(),
  value: Type.Array(DprApplicationSubmissionSubtopicValue)
})

export const DprApplicationSubmissionEndpoint = ApiResponse(
  Type.Object({
    application: Type.Any(), // we're not using this
    submission: Type.Object({
      data: Type.Array(DprApplicationSubmissionSubtopic),
      metadata: Type.Object({
        submittedAt: Type.String({ format: 'date-time' }),
        raw: Type.String()
      })
    })
  })
)
export type DprApplicationSubmissionEndpoint = Static<
  typeof DprApplicationSubmissionEndpoint
>
