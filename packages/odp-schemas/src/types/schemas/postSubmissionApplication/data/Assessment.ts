import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import { AssessmentDecisionSchema } from '../enums/AssessmentDecision'
import '../../../shared/formats'
// type AssessmentBase = Static<typeof AssessmentBaseSchema>
const AssessmentBaseSchema = Type.Object(
  {
    expiryDate: Type.String({ format: 'date' }),
    decisionNotice: Type.Optional(
      Type.Object({
        url: Type.String()
      })
    )
  },
  { description: 'Base type for all assessments' }
)

// type AssessmentDecisionSection = Static<typeof AssessmentDecisionSectionSchema>
const AssessmentDecisionSectionSchema = Type.Object(
  {
    planningOfficerDecision: Type.Optional(AssessmentDecisionSchema),
    planningOfficerDecisionDate: Type.Optional(Type.String({ format: 'date' }))
  },
  { description: 'AssessmentDecisionSection' }
)

// type AssessmentCommitteeDecision = Static<
//   typeof AssessmentCommitteeDecisionSchema
// >
const AssessmentCommitteeDecisionSchema = Type.Object(
  {
    planningOfficerRecommendation: Type.Optional(AssessmentDecisionSchema),
    committeeSentDate: Type.Optional(Type.String({ format: 'date' })),
    committeeDecision: Type.Optional(AssessmentDecisionSchema),
    committeeDecisionDate: Type.Optional(Type.String({ format: 'date' }))
  },
  { description: 'AssessmentCommitteeDecision' }
)

export type PostSubmissionAssessment = Static<
  typeof PostSubmissionAssessmentSchema
>
export const PostSubmissionAssessmentSchema = Type.Intersect([
  AssessmentBaseSchema,
  AssessmentDecisionSectionSchema,
  AssessmentCommitteeDecisionSchema
])

export type PriorApprovalAssessment = Static<
  typeof PriorApprovalAssessmentSchema
>
export const PriorApprovalAssessmentSchema = Type.Intersect(
  [
    PostSubmissionAssessmentSchema,
    Type.Object({
      priorApprovalRequired: Type.Optional(Type.Boolean())
    })
  ],
  {
    description:
      'Assessment for a post submission application with type prior approval'
  }
)

// type AssessmentVariants = Static<typeof AssessmentVariantsSchema>
const AssessmentVariantsSchema = Type.Object({
  'pa.part1.classA': PriorApprovalAssessmentSchema,
  'pa.part1.classAA': PriorApprovalAssessmentSchema,
  'pa.part3.classG': PriorApprovalAssessmentSchema,
  'pa.part3.classM': PriorApprovalAssessmentSchema,
  'pa.part3.classMA': PriorApprovalAssessmentSchema,
  'pa.part3.classN': PriorApprovalAssessmentSchema,
  'pa.part3.classQ': PriorApprovalAssessmentSchema,
  'pa.part3.classR': PriorApprovalAssessmentSchema,
  'pa.part3.classS': PriorApprovalAssessmentSchema,
  'pa.part3.classT': PriorApprovalAssessmentSchema,
  'pa.part3.classV': PriorApprovalAssessmentSchema,
  'pa.part4.classBB': PriorApprovalAssessmentSchema,
  'pa.part4.classBC': PriorApprovalAssessmentSchema,
  'pa.part4.classCA': PriorApprovalAssessmentSchema,
  'pa.part4.classE': PriorApprovalAssessmentSchema,
  'pa.part6': PriorApprovalAssessmentSchema,
  'pa.part6.classA': PriorApprovalAssessmentSchema,
  'pa.part6.classB': PriorApprovalAssessmentSchema,
  'pa.part6.classE': PriorApprovalAssessmentSchema,
  'pa.part7.classC': PriorApprovalAssessmentSchema,
  'pa.part7.classM': PriorApprovalAssessmentSchema,
  'pa.part9.classD': PriorApprovalAssessmentSchema,
  'pa.part11.classB': PriorApprovalAssessmentSchema,
  'pa.part14.classA': PriorApprovalAssessmentSchema,
  'pa.part14.classB': PriorApprovalAssessmentSchema,
  'pa.part14.classJ': PriorApprovalAssessmentSchema,
  'pa.part14.classK': PriorApprovalAssessmentSchema,
  'pa.part14.classOA': PriorApprovalAssessmentSchema,
  'pa.part16.classA': PriorApprovalAssessmentSchema,
  'pa.part17': PriorApprovalAssessmentSchema,
  'pa.part17.classB': PriorApprovalAssessmentSchema,
  'pa.part17.classC': PriorApprovalAssessmentSchema,
  'pa.part17.classG': PriorApprovalAssessmentSchema,
  'pa.part18.classA': PriorApprovalAssessmentSchema,
  'pa.part19.classTA': PriorApprovalAssessmentSchema,
  'pa.part20.classA': PriorApprovalAssessmentSchema,
  'pa.part20.classAA': PriorApprovalAssessmentSchema,
  'pa.part20.classAB': PriorApprovalAssessmentSchema,
  'pa.part20.classAC': PriorApprovalAssessmentSchema,
  'pa.part20.classAD': PriorApprovalAssessmentSchema,
  'pa.part20.classZA': PriorApprovalAssessmentSchema
})

export type Assessment<T extends TSchema> = Static<
  ReturnType<typeof AssessmentSchema<T>>
>
export const AssessmentSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(AssessmentVariantsSchema),
    Type.Index(AssessmentVariantsSchema, T),
    PostSubmissionAssessmentSchema
  )
