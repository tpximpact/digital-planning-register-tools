import { Type, type Static } from '@sinclair/typebox'

export type DprComment = Static<typeof DprComment>
export const DprComment = Type.Object({
  id: Type.Optional(Type.Number()),
  comment: Type.String(),
  receivedDate: Type.String(),
  sentiment: Type.Optional(Type.String())
})
