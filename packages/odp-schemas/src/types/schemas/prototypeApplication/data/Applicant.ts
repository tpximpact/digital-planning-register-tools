import { CloneType, Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'
import {
  OwnershipInterestSchema,
  OwnersInterestSchema,
  OwnersNoNoticeGivenSchema,
  OwnersNoticeDateSchema,
  OwnersNoticeGivenSchema
} from '../../../shared/Ownership'
import { SiteContactSchema } from '../../../shared/SiteContact'
import { ContactDetailsSchema } from '../../../shared/Contacts'
import { AddressSchema, UserAddressSchema } from '../../../shared/Addresses'
import { MaintenanceContactsSchema } from '../../../shared/MaintenanceContact'

export type BaseApplicant = Static<typeof BaseApplicantSchema>
export const BaseApplicantSchema = Type.Intersect(
  [
    ContactDetailsSchema,
    Type.Object({
      type: Type.Optional(
        Type.Union(
          [
            Type.Literal('individual'),
            Type.Literal('company'),
            Type.Literal('charity'),
            Type.Literal('public'),
            Type.Literal('parishCouncil')
          ],
          { description: 'The type of applicant' }
        )
      ),
      address: CloneType(UserAddressSchema, {
        description: 'Address information for the applicant'
      })
    })
  ],
  { title: 'Applicant', description: 'Details about the applicant' }
)

export type ApplicantWithAgent = Static<typeof ApplicantWithAgentSchema>
export const ApplicantWithAgentSchema = Type.Intersect(
  [
    BaseApplicantSchema,
    Type.Object({
      agent: Type.Intersect(
        [
          ContactDetailsSchema,
          Type.Object({
            address: AddressSchema
          })
        ],
        { description: 'Contact information for the agent or proxy' }
      )
    })
  ],
  {
    title: 'Applicant with agent',
    description:
      'Details about the applicant and the agent or proxy applying on their behalf'
  }
)

export type ApplicantBase = Static<typeof ApplicantBaseSchema>
export const ApplicantBaseSchema = Type.Union([
  BaseApplicantSchema,
  ApplicantWithAgentSchema
])

export type LDCApplicant = Static<typeof LDCApplicantSchema>
export const LDCApplicantSchema = Type.Intersect([
  ApplicantBaseSchema,
  SiteContactSchema,
  Type.Object({
    ownership: Type.Union(
      [
        Type.Object({
          interest: Type.Extract(OwnersInterestSchema, Type.Literal('owner'))
        }),
        Type.Object({
          interest: Type.Extract(OwnersInterestSchema, Type.Literal('other')),
          interestDescription: Type.String(),
          owners: Type.Array(
            Type.Union([OwnersNoticeGivenSchema, OwnersNoNoticeGivenSchema])
          )
        }),
        Type.Object({
          interest: OwnersInterestSchema,
          owners: Type.Array(
            Type.Union([OwnersNoticeGivenSchema, OwnersNoNoticeGivenSchema])
          )
        })
      ],
      {
        description:
          'Information about the property owners, if different than the applicant'
      }
    )
  })
])

export type PPApplicant = Static<typeof PPApplicantSchema>
export const PPApplicantSchema = Type.Intersect([
  ApplicantBaseSchema,
  SiteContactSchema,
  MaintenanceContactsSchema,
  Type.Object({
    ownership: Type.Object(
      {
        interest: OwnersInterestSchema,
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
        owners: Type.Optional(Type.Array(OwnersNoticeDateSchema)),
        certificate: Type.Union([
          Type.Literal('a'),
          Type.Literal('b'),
          Type.Literal('c'),
          Type.Literal('d')
        ]),
        declaration: Type.Object(
          {
            accurate: Type.Literal(true)
          },
          {
            description:
              'Declaration of the accuracy of the ownership certificate, including reasonable steps taken to find all owners and publish notice'
          }
        )
      },
      {
        description:
          'Information about the ownership certificate and property owners, if different than the applicant'
      }
    )
  })
])

// type ApplicantVariants = Static<typeof ApplicantVariantsSchema>
const ApplicantVariantsSchema = Type.Object({
  advertConsent: Type.Intersect([
    ApplicantBaseSchema,
    SiteContactSchema,
    OwnershipInterestSchema
  ]),
  complianceConfirmation: Type.Intersect([
    ApplicantBaseSchema,
    OwnershipInterestSchema
  ]),
  hedgerowRemovalNotice: Type.Intersect([
    ApplicantBaseSchema,
    SiteContactSchema,
    OwnershipInterestSchema
  ]),
  landDrainageConsent: Type.Intersect([
    ApplicantBaseSchema,
    MaintenanceContactsSchema,
    OwnershipInterestSchema
  ]),
  'ldc.breachOfCondition': LDCApplicantSchema,
  'ldc.existing': LDCApplicantSchema,
  'ldc.proposed': LDCApplicantSchema,
  'ldc.worksToListedBuilding': LDCApplicantSchema,
  listed: PPApplicantSchema,
  'pp.full.householder': PPApplicantSchema,
  'pp.full.householder.retro': PPApplicantSchema,
  'pp.full.major': PPApplicantSchema,
  'pp.full.minor': PPApplicantSchema,
  'wtt.consent': ApplicantBaseSchema,
  'wtt.notice': ApplicantBaseSchema
})

export type Applicant<T extends TSchema> = Static<
  ReturnType<typeof ApplicantSchema<T>>
>
export const ApplicantSchema = <T extends TSchema>(T: T) =>
  Type.Extends(
    T,
    Type.KeyOf(ApplicantVariantsSchema),
    Type.Index(ApplicantVariantsSchema, T),
    ApplicantBaseSchema
  )
