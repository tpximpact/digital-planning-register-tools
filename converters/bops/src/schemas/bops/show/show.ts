import { Type, type Static } from '@sinclair/typebox'
import { BopsApplicationSchema } from '../../shared/BopsApplication'
import { BopsFileSchema } from '../../shared/BopsFile'
import { AppealBaseSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/Appeal.ts'
import '@dpr/odp-schemas/types/shared/formats'

export type Address = Static<typeof AddressSchema>
export const AddressSchema = Type.Object(
  {
    line1: Type.String(),
    line2: Type.Optional(Type.String()),
    town: Type.String(),
    county: Type.Optional(Type.String()),
    postcode: Type.String(),
    country: Type.Optional(Type.String())
  },
  {
    title: 'Contact address',
    description:
      'Address information for a person associated with this application not at the site address'
  }
)

export type UserAddressNotSameSite = Static<typeof UserAddressNotSameSiteSchema>
export const UserAddressNotSameSiteSchema = Type.Composite(
  [
    AddressSchema,
    Type.Object({
      sameAsSiteAddress: Type.Literal(false)
    })
  ],
  {
    description:
      'Address information for an applicant with contact information that differs from the site address'
  }
)

export type UserAddress = Static<typeof UserAddressSchema>
export const UserAddressSchema = Type.Union(
  [
    Type.Object({
      sameAsSiteAddress: Type.Literal(true)
    }),
    UserAddressNotSameSiteSchema
  ],
  {
    title: 'User address',
    description: 'Address information for the applicant'
  }
)

// Temporarily use bops file schema for appeal files
const AppealBaseNoIdSchema = Type.Intersect([
  Type.Omit(AppealBaseSchema, ['files']),
  Type.Object({
    files: Type.Optional(Type.Array(BopsFileSchema))
  })
])
export const BopsAppealSchema = Type.Extends(
  Type.Object({}),
  Type.KeyOf(Type.Object({})),
  Type.Index(Type.Object({}), Type.Object({})),
  AppealBaseNoIdSchema
)

export const BopsShowEndpointSchema = Type.Object({
  application: BopsApplicationSchema,
  property: Type.Object({
    address: Type.Object({
      singleLine: Type.String()
    }),
    boundary: Type.Object({
      site: Type.Any()
    })
  }),
  proposal: Type.Object({
    description: Type.String()
  }),
  applicant: Type.Union([
    Type.Null(),
    Type.Object({
      type: Type.Union([
        Type.Union([
          Type.Literal('individual'),
          Type.Literal('company'),
          Type.Literal('charity'),
          Type.Literal('public'),
          Type.Literal('parishCouncil')
        ]),
        Type.Null()
      ]),
      address: Type.Union([AddressSchema, UserAddressSchema, Type.Null()]),
      ownership: Type.Union([Type.Any(), Type.Null()]), // json.ownership planning_application.applicant_interest
      agent: Type.Object({ address: Type.Union([AddressSchema, Type.Null()]) })
    })
  ]),
  officer: Type.Union([
    Type.Object({
      name: Type.String()
    }),
    Type.Null()
  ]),
  data: Type.Optional(
    Type.Object({
      appeal: Type.Optional(BopsAppealSchema)
    })
  )
})
export type BopsShowEndpoint = Static<typeof BopsShowEndpointSchema>
