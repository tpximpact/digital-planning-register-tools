import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export type Design = Static<typeof DesignSchema>
export const DesignSchema = Type.Literal('design', {
  description:
    'Comment on the design, size or height of new buildings or extensions'
})

export type Use = Static<typeof UseSchema>
export const UseSchema = Type.Literal('use', {
  description: 'Comment on the use and function of the proposed development'
})

export type Light = Static<typeof LightSchema>
export const LightSchema = Type.Literal('light', {
  description: 'Comment on impacts on natural light'
})

export type Privacy = Static<typeof PrivacySchema>
export const PrivacySchema = Type.Literal('privacy', {
  description: 'Comment on impacts to the privacy of neighbours'
})

export type Access = Static<typeof AccessSchema>
export const AccessSchema = Type.Literal('access', {
  description: "Comment on impacts on disabled persons' access"
})

export type Noise = Static<typeof NoiseSchema>
export const NoiseSchema = Type.Literal('noise', {
  description: 'Comment on any noise from new uses'
})

export type Traffic = Static<typeof TrafficSchema>
export const TrafficSchema = Type.Literal('traffic', {
  description: 'Comment on impacts to traffic, parking or road safety'
})

export type Other = Static<typeof OtherSchema>
export const OtherSchema = Type.Literal('other', {
  description: 'Comment on other things'
})

export type PublicCommentTopic = Static<typeof PublicCommentTopicSchema>
export const PublicCommentTopicSchema = Type.Union(
  [
    DesignSchema,
    UseSchema,
    LightSchema,
    PrivacySchema,
    AccessSchema,
    NoiseSchema,
    TrafficSchema,
    OtherSchema
  ],
  { id: '#PublicCommentTopic', description: 'Types of comments' }
)
