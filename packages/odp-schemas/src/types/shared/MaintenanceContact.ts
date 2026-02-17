import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { AddressSchema } from './Addresses'
import { ContactDetailsSchema } from './Contacts'

export type MaintenanceContacts = Static<typeof MaintenanceContactsSchema>
export const MaintenanceContactsSchema = Type.Object(
  {
    maintenanceContact: Type.Optional(
      Type.Array(
        Type.Object({
          when: Type.Union([
            Type.Literal('duringConstruction'),
            Type.Literal('afterConstruction'),
            Type.Literal('duringAndAfterConstruction')
          ]),
          address: AddressSchema,
          contact: ContactDetailsSchema
        })
      )
    )
  },
  {
    title: 'Maintenance contacts',
    description:
      'Contact information for the person(s) responsible for maintenance while the works are carried out'
  }
)
