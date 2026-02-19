import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { AddressSchema } from './Addresses'

export type BaseOwners = Static<typeof BaseOwnersSchema>
export const BaseOwnersSchema = Type.Object({
  name: Type.String(),
  address: AddressSchema
})

export type OwnersNoticeDate = Static<typeof OwnersNoticeDateSchema>
export const OwnersNoticeDateSchema = Type.Composite([
  BaseOwnersSchema,
  Type.Object({
    noticeDate: Type.Date()
  })
])

export type OwnersInterestedInLand = Static<typeof OwnersInterestedInLandSchema>
export const OwnersInterestedInLandSchema = Type.Composite([
  BaseOwnersSchema,
  Type.Object({
    interest: Type.String()
  })
])

export type OwnersNoticeGiven = Static<typeof OwnersNoticeGivenSchema>
export const OwnersNoticeGivenSchema = Type.Composite([
  OwnersInterestedInLandSchema,
  Type.Object({
    noticeGiven: Type.Literal(true)
  })
])

export type OwnersNoNoticeGiven = Static<typeof OwnersNoNoticeGivenSchema>
export const OwnersNoNoticeGivenSchema = Type.Composite([
  OwnersInterestedInLandSchema,
  Type.Object({
    noticeGiven: Type.Literal(false),
    noNoticeReason: Type.String()
  })
])

export type OwnersInterest = Static<typeof OwnersInterestSchema>
export const OwnersInterestSchema = Type.Union([
  Type.Literal('owner'),
  Type.Literal('owner.sole'),
  Type.Literal('owner.co'),
  Type.Literal('lessee'),
  Type.Literal('occupier'),
  Type.Literal('other')
])

export type OwnershipInterest = Static<typeof OwnershipInterestSchema>
export const OwnershipInterestSchema = Type.Object(
  {
    ownership: Type.Object({
      interest: OwnersInterestSchema
    })
  },
  {
    title: 'Ownership interest',
    description:
      "Information about the applicant's relationship to the property owners"
  }
)

export type Owners = Static<typeof OwnersSchema>
export const OwnersSchema = Type.Union(
  [OwnersNoticeGivenSchema, OwnersNoNoticeGivenSchema, OwnersNoticeDateSchema],
  {
    title: '#Owners',
    description:
      'Names and addresses of all known owners and agricultural tenants who are not the applicant, including confirmation or date of notice, or reason requisite notice has not been given if applicable'
  }
)

export type Ownership = Static<typeof OwnershipSchema>
export const OwnershipSchema = Type.Object(
  {
    interest: Type.Optional(OwnersInterestSchema),
    interestDescription: Type.Optional(Type.String()),
    certificate: Type.Optional(
      Type.Union([
        Type.Literal('a'),
        Type.Literal('b'),
        Type.Literal('c'),
        Type.Literal('d')
      ])
    ),
    agriculturalTenants: Type.Optional(
      Type.Boolean({
        description: 'Does the land have any agricultural tenants?'
      })
    ),
    noticeGiven: Type.Optional(
      Type.Boolean({
        description:
          'Has requisite notice been given to all the known owners and agricultural tenants?'
      })
    ),
    noticePublished: Type.Optional(
      Type.Object(
        {
          status: Type.Boolean(),
          date: Type.Optional(Type.Date()),
          newspaperName: Type.Optional(Type.String())
        },
        {
          description:
            'Has a notice of the application been published in a newspaper circulating in the area where the land is situated?'
        }
      )
    ),
    ownersKnown: Type.Optional(
      Type.Union(
        [Type.Literal('all'), Type.Literal('some'), Type.Literal('none')],
        {
          description:
            'Do you know the names and addresses of all owners and agricultural tenants?'
        }
      )
    ),
    owners: Type.Optional(Type.Array(OwnersSchema)),
    declaration: Type.Optional(
      Type.Object(
        {
          accurate: Type.Literal(true)
        },
        {
          description:
            'Declaration of the accuracy of the ownership certificate, including reasonable steps taken to find all owners and publish notice'
        }
      )
    )
  },
  {
    title: '#Ownership',
    description:
      'Information about the ownership certificate and property owners, if different than the applicant'
  }
)
