import { Type, type Static } from '@sinclair/typebox'
import { BopsApplication } from '../shared/BopsApplication'
import { BopsFile } from '../shared/BopsFile'
import { AppealBase } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/Appeal.ts'
import '@dpr/odp-schemas/types/shared/formats'

export type Address = Static<typeof Address>
export const Address = Type.Object(
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

export type UserAddressNotSameSite = Static<typeof UserAddressNotSameSite>
export const UserAddressNotSameSite = Type.Composite(
  [
    Address,
    Type.Object({
      sameAsSiteAddress: Type.Literal(false)
    })
  ],
  {
    description:
      'Address information for an applicant with contact information that differs from the site address'
  }
)

export type UserAddress = Static<typeof UserAddress>
export const UserAddress = Type.Union(
  [
    Type.Object({
      sameAsSiteAddress: Type.Literal(true)
    }),
    UserAddressNotSameSite
  ],
  {
    title: 'User address',
    description: 'Address information for the applicant'
  }
)

// Temporarily use bops file schema for appeal files
const AppealBaseNoId = Type.Intersect([
  Type.Omit(AppealBase, ['files']),
  Type.Object({
    files: Type.Optional(Type.Array(BopsFile))
  })
])
export const BopsAppealSchema = Type.Extends(
  Type.Object({}),
  Type.KeyOf(Type.Object({})),
  Type.Index(Type.Object({}), Type.Object({})),
  AppealBaseNoId
)

export const BopsShowEndpoint = Type.Object({
  application: BopsApplication,
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
      address: Type.Union([Address, UserAddress, Type.Null()]),
      ownership: Type.Union([Type.Any(), Type.Null()]), // json.ownership planning_application.applicant_interest
      agent: Type.Object({ address: Type.Union([Address, Type.Null()]) })
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
export type BopsShowEndpoint = Static<typeof BopsShowEndpoint>
