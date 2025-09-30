import type { Responses } from 'digital-planning-data-schemas/types/shared/Responses.ts'
import { fakerEN_GB as faker } from '@faker-js/faker'

export const generateResponses = (): Responses => {
  const generateResponse = () => {
    return {
      question: faker.helpers.arrayElement([
        'Is the property in Lambeth?',
        'What type of property is it?',
        'What type of house it is?',
        'Is the property in a flood zone?',
        'What type of property is it?',
        'List the changes involved in the project',
        'Have works already started?',
        'Is the property in a flood zone?',
        'What type of changes does the project involve?',
        'Is the project to add an outbuilding?',
        'How much new floor area is being added to the house?',
        'How much exactly is the internal floor area of the property increasing by?',
        'Does the project involve creating any new bedrooms or bathrooms?',
        'Describe the wall materials of the existing house',
        'Describe the wall materials of the new extension',
        'Describe the material of the roof of the existing house',
        'Describe the material for the new roof of the extension',
        'Describe the window materials of the existing house',
        'Describe the window materials of the extension',
        'Describe the door materials of the existing house',
        'Describe the door materials of the extension',
        'Are there any trees that could fall within the property or the areas affected by the project (the previously drawn outline)?',
        'Does the project involve any of these?',
        'Is the property in Greater London?',
        'Does the site include more than one property?',
        'Do you know the title number of the property?',
        'Does the property have an Energy Performance Certificate (EPC)?',
        'What type of application is this?',
        'When will the works start?',
        'When will the works be completed?',
        'Does the site include parking spaces for any of these?',
        'Total number of car parking spaces before',
        'Total number of car parking spaces after',
        'What types of car parking space are present?',
        'Off-street, residents-only car spaces before',
        'Off-street, residents-only car spaces after',
        'What type of bicycle parking is there?',
        'Off-street bicycle spaces before',
        'Off-street bicycle spaces after',
        'Is the property on designated land?',
        'Does the property include any of these?',
        'Heritage Statement needed?',
        'Is the property in a flood zone?',
        'What type of application is it?',
        'Your contact details',
        'Is this a test?',
        'Are you applying on behalf of someone else?',
        'Which of these best describes you?',
        'Your contact address',
        'Which of these best describes the applicant?',
        "Applicant's title",
        'Do you want to provide an email address for the applicant?',
        'Do you want to provide a telephone number for the applicant?',
        "Is the applicant's contact address the same as the property address?",
        'Which of these best describes you?',
        'We may need to visit your site to assess your application. If we do, who should we contact to arrange the visit?',
        'Which of these best describes you?',
        "Which of these best describes the applicant's interest in the land?",
        'Did you get any pre-application advice from the council before making this application?',
        'What type of planning application are you making?',
        'Is the property a home?',
        'What types of changes does the application relate to?',
        'What type of extension is it?',
        'List the changes involved in the roof extension',
        'Is the purpose of the project to support the needs of a disabled resident?',
        'Is it a prior approval application?',
        'Is the property a home?',
        'What works does the project involve?',
        'Is this application a resubmission?',
        'Does the application qualify for a disability exemption?',
        'Does the application qualify for a resubmission exemption?',
        'Is the site a sports field?',
        'Is the application being made by (or on behalf of) a parish or community council?',
        'Are you also submitting another proposal for the same site today?',
        'Does the application qualify for the sports club fee reduction?',
        'Does the application qualify for the parish council reduction?',
        'Does the application qualify for the alternative application reduction?',
        'What type of application is it?',
        'What does the project involve?',
        'How much new floor area is being created?',
        'Is this a householder planning application?',
        'Have the works already started?',
        'What changes does the project involve?',
        'Is the project to add an outbuilding?',
        'Which Local Planning authority is it?',
        'Connections with London Borough of Lambeth',
        'I confirm that:',
        'Does the application qualify for a disability exemption?',
        'Does the application qualify for a resubmission exemption?',
        'Which Local Planning authority is it?'
      ]),
      responses: faker.datatype.boolean()
        ? Array.from({ length: 3 }, () => {
            return { value: faker.lorem.sentence() }
          })
        : faker.lorem.paragraph(),
      metadata: {
        autoAnswered: faker.datatype.boolean(),
        sectionName: faker.helpers.arrayElement([
          'The property',
          'About the project',
          'About you',
          'About this application',
          'Upload drawings',
          'Check',
          'Pay and send'
        ]),
        policyRefs: Array.from({ length: 2 }, () => ({
          text: faker.lorem.words({ min: 2, max: 5 }),
          url: faker.datatype.boolean()
            ? new URL(faker.internet.url()).toString()
            : undefined
        }))
      }
    }
  }

  // const questions = planningPermissionFullHouseholderPrototype.responses.map(
  //   (item: { question: string }) => item.metadata.sectionName
  // )

  // console.log(new Set(questions))

  return Array.from(
    { length: faker.number.int({ min: 20, max: 50 }) },
    generateResponse
  )
}
