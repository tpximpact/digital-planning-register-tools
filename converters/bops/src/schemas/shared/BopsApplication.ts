import { Type, type Static } from '@sinclair/typebox'
import './formats'

/**
 * BOPS represents application with a shared file in many places, replicating that here
 * engines/bops_api/app/views/bops_api/v2/shared/_application.json.jbuilder
 */
export const BopsApplication = Type.Object({
  type: Type.Object({
    value: Type.String(),
    description: Type.String()
  }),
  reference: Type.String(),
  fullReference: Type.String(),
  targetDate: Type.String({ format: 'date' }),
  expiryDate: Type.String({ format: 'date' }),
  receivedAt: Type.String({ format: 'bops-date-time' }),
  validAt: Type.String({ format: 'bops-date-time' }),
  publishedAt: Type.String({ format: 'bops-date-time' }),
  determinedAt: Type.Union([
    Type.Null(),
    Type.String({ format: 'bops-date-time' })
  ]),
  decision: Type.Union([Type.Null(), Type.String()]),
  status: Type.String(),
  consultation: Type.Optional(
    Type.Object({
      startDate: Type.Union([Type.Null(), Type.String({ format: 'date' })]),
      endDate: Type.Union([Type.Null(), Type.String({ format: 'date' })]),
      publicUrl: Type.String({ format: 'uri' }),
      publishedComments: Type.Array(
        Type.Object({
          comment: Type.String(),
          receivedAt: Type.String({ format: 'bops-date-time' }),
          summaryTag: Type.String()
        })
      ),
      consulteeComments: Type.Array(
        Type.Object({
          comment: Type.String(),
          receivedAt: Type.String({ format: 'bops-date-time' })
        })
      )
    })
  ),
  pressNotice: Type.Union([
    Type.Null(),
    Type.Object({
      required: Type.Boolean(),
      reason: Type.String(),
      publishedAt: Type.Union([
        Type.String({ format: 'bops-date-time' }),
        Type.Null()
      ])
    })
  ])
})
export type BopsApplication = Static<typeof BopsApplication>

// json.application do
//   json.type do
//     json.value planning_application.application_type.code
//     json.description planning_application.application_type.name
//   end
//   json.reference planning_application.reference
//   json.fullReference planning_application.reference_in_full
//   json.targetDate planning_application.target_date
//   json.expiryDate planning_application.expiry_date
//   json.receivedAt planning_application.received_at
//   json.validAt planning_application.validated_at
//   json.publishedAt planning_application.published_at
//   json.determinedAt planning_application.determined_at
//   json.decision planning_application.determined? ? planning_application.decision : nil
//   json.status planning_application.appeal_display_status || planning_application.status

//   if (consultation = planning_application.consultation)
//     json.consultation do
//       json.startDate consultation.start_date
//       json.endDate consultation.end_date
//       json.publicUrl consultation.application_link

//       json.publishedComments planning_application.consultation.neighbour_responses.redacted do |response|
//         json.comment response.redacted_response
//         json.receivedAt response.received_at
//         json.summaryTag response.summary_tag
//       end

//       json.consulteeComments planning_application.consultation.consultee_responses.redacted do |response|
//         json.comment response.redacted_response
//         json.receivedAt response.received_at
//       end
//     end
//   end

//   json.pressNotice do
//     if (press_notice = planning_application.press_notice)
//       json.required press_notice.required
//       json.reason press_notice.reason
//       json.publishedAt press_notice.published_at
//     else
//       json.null!
//     end
//   end
// end
