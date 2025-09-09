import { Type, type Static } from '@sinclair/typebox'

export type DprComment = Static<typeof DprComment>
export const DprComment = Type.Object({
  id: Type.Optional(Type.Number()),
  comment: Type.String(),
  receivedDate: Type.String(),
  sentiment: Type.Optional(Type.String())
})

export type DprApplicationStatus = Static<typeof DprApplicationStatus>
export const DprApplicationStatus = Type.Union([
  Type.Literal('Appeal allowed'),
  Type.Literal('Appeal dismissed'),
  Type.Literal('Appeal split decision'),
  Type.Literal('Appeal withdrawn'),
  Type.Literal('Appeal lodged'),
  Type.Literal('Appeal valid'),
  Type.Literal('Appeal started'),
  Type.Literal('Appeal determined'),
  Type.Literal('pending'),
  Type.Literal('not_started'),
  Type.Literal('invalid'),
  Type.Literal('assessment_in_progress'),
  Type.Literal('in_assessment'),
  Type.Literal('awaiting_determination'),
  Type.Literal('in_committee'),
  Type.Literal('to_be_reviewed'),
  Type.Literal('determined'),
  Type.Literal('returned'),
  Type.Literal('withdrawn'),
  Type.Literal('closed')
])
/**
 * DPR version of BopsApplication
 */
export const DprApplication = Type.Object({
  reference: Type.String(),
  status: DprApplicationStatus,
  consultation: Type.Object({
    startDate: Type.Union([Type.String(), Type.Null()]),
    endDate: Type.Union([Type.String(), Type.Null()]),
    publishedComments: Type.Union([Type.Array(DprComment), Type.Null()]),
    consulteeComments: Type.Union([Type.Array(DprComment), Type.Null()])
  }),
  expiryDate: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  receivedAt: Type.String(),
  publishedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  validAt: Type.Union([Type.String(), Type.Null()]),
  determinedAt: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  decision: Type.Optional(Type.Union([Type.String(), Type.Null()]))
})
export type DprApplication = Static<typeof DprApplication>
