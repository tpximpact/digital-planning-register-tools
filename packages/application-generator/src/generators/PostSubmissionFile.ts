import { fakerEN_GB as faker } from '@faker-js/faker'
import type {
  PostSubmissionFile,
  PostSubmissionFileRedacted
} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/data/File.js'
import type { PossibleDates } from '../libs/generateAllPossibleDates'
import type { PostSubmissionFileAssociation } from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/enums/FileAssociation.js'
import type { PrototypeFileType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/FileType.js'

export const generatePostSubmissionFileDates = (
  dates?: PossibleDates
): {
  createdAtDate: Date
  submittedAtDate: Date
  validatedAtDate: Date
  publishedAtDate: Date
} => {
  let fromDate: Date
  let toDate: Date

  if (dates?.submission?.submittedAt && dates?.appeal?.decidedAt) {
    fromDate = dates.submission.submittedAt.toDate()
    toDate = dates.appeal.decidedAt.toDate()
  } else {
    // Pick a random start date in the past year
    fromDate = faker.date.between({
      from: faker.date.past({ years: 1 }),
      to: new Date()
    })
    // toDate is 6 months after fromDate
    toDate = new Date(fromDate)
    toDate.setMonth(toDate.getMonth() + 6)
  }

  const createdAtDate = faker.date.between({ from: fromDate, to: toDate })
  const submittedAtDate = faker.date.between({
    from: createdAtDate,
    to: toDate
  })
  const validatedAtDate = faker.date.between({
    from: submittedAtDate,
    to: toDate
  })
  const publishedAtDate = faker.date.between({
    from: validatedAtDate,
    to: toDate
  })

  return {
    createdAtDate,
    submittedAtDate,
    validatedAtDate,
    publishedAtDate
  }
}

export const generatePostSubmissionFiles = (
  association?: PostSubmissionFileAssociation,
  dates?: PossibleDates
): PostSubmissionFile[] => {
  const numFiles = faker.number.int({ min: 1, max: 100 })
  const files: PostSubmissionFile[] = []

  for (let i = 0; i < numFiles; i++) {
    const file: PostSubmissionFile = generatePostSubmissionFile(
      association,
      dates
    )
    files.push(file)
  }

  return files
}

export const generatePostSubmissionFilesRedacted = (
  association?: PostSubmissionFileAssociation,
  dates?: PossibleDates
): PostSubmissionFileRedacted[] => {
  const numFiles = faker.number.int({ min: 1, max: 100 })
  const files: PostSubmissionFileRedacted[] = []

  for (let i = 0; i < numFiles; i++) {
    const file: PostSubmissionFileRedacted = generatePostSubmissionFileRedacted(
      association,
      dates
    )
    files.push(file)
  }

  return files
}

export const generatePostSubmissionFileRedacted = (
  association?: PostSubmissionFileAssociation,
  dates?: PossibleDates
): PostSubmissionFileRedacted => {
  const { url, ...file } = generatePostSubmissionFile(association, dates)
  return {
    ...file,
    redactedUrl: url ?? faker.internet.url()
  }
}

export const generatePostSubmissionFile = (
  association?: PostSubmissionFileAssociation,
  dates?: PossibleDates
): PostSubmissionFile => {
  const { createdAtDate, submittedAtDate, validatedAtDate, publishedAtDate } =
    generatePostSubmissionFileDates(dates)
  const file: PostSubmissionFile = {
    id: createdAtDate.getTime(),
    name: faker.system.fileName(),
    association: association
      ? association
      : faker.helpers.arrayElement([
          'application',
          'appeal',
          'specialistComment',
          'publicComment'
        ]),
    version: faker.datatype.boolean()
      ? faker.number.int({ min: 1, max: 10 })
      : undefined,
    type: faker.helpers.arrayElements<PrototypeFileType>(
      [
        'accessRoadsRightsOfWayDetails',
        'advertsDrawings',
        'affordableHousingStatement',
        'arboriculturistReport',
        'bankStatement',
        'basementImpactStatement',
        'bioaerosolAssessment',
        'birdstrikeRiskManagementPlan',
        'boreholeOrTrialPitAnalysis',
        'buildingControlCertificate',
        'conditionSurvey',
        'constructionInvoice',
        'contaminationReport',
        'councilTaxBill',
        'crimePreventionStrategy',
        'designAndAccessStatement',
        'disabilityExemptionEvidence',
        'ecologyReport',
        'elevations.existing',
        'elevations.proposed',
        'emissionsMitigationAndMonitoringScheme',
        'energyStatement',
        'environmentalImpactAssessment',
        'externalMaterialsDetails',
        'fireSafetyReport',
        'floodRiskAssessment',
        'floorPlan.existing',
        'floorPlan.proposed',
        'foulDrainageAssessment',
        'geodiversityAssessment',
        'hedgerowsInformation',
        'hedgerowsInformation.plantingDate',
        'heritageStatement',
        'hydrologicalAssessment',
        'hydrologyReport',
        'internalElevations',
        'internalSections',
        'joinersReport',
        'joinerySections',
        'landContaminationAssessment',
        'landscapeAndVisualImpactAssessment',
        'landscapeStrategy',
        'lightingAssessment',
        'litterVerminAndBirdControlDetails',
        'locationPlan',
        'methodStatement',
        'mineralsAndWasteAssessment',
        'necessaryInformation',
        'newDwellingsSchedule',
        'noiseAssessment',
        'openSpaceAssessment',
        'otherDocument',
        'otherDrawing',
        'otherEvidence',
        'otherSupporting',
        'parkingPlan',
        'photographs.existing',
        'photographs.proposed',
        'planningStatement',
        'recycleWasteStorageDetails',
        'relevantInformation',
        'residentialUnitsDetails',
        'roofPlan.existing',
        'roofPlan.proposed',
        'sections.existing',
        'sections.proposed',
        'sitePlan.existing',
        'sitePlan.proposed',
        'sketchPlan',
        'statementOfCommunityInvolvement',
        'statutoryDeclaration',
        'storageTreatmentAndWasteDisposalDetails',
        'streetScene',
        'subsidenceReport',
        'sunlightAndDaylightReport',
        'sustainabilityStatement',
        'technicalEvidence',
        'technicalSpecification',
        'tenancyAgreement',
        'tenancyInvoice',
        'townCentreImpactAssessment',
        'townCentreSequentialAssessment',
        'transportAssessment',
        'travelPlan',
        'treeAndHedgeLocation',
        'treeAndHedgeRemovedOrPruned',
        'treeCanopyCalculator',
        'treeConditionReport',
        'treesReport',
        'treeSurvey',
        'unitPlan.existing',
        'unitPlan.proposed',
        'usePlan.existing',
        'usePlan.proposed',
        'utilityBill',
        'utilitiesStatement',
        'ventilationStatement',
        'viabilityAppraisal',
        'visualisations',
        'wasteAndRecyclingStrategy',
        'wasteStorageDetails',
        'waterEnvironmentAssessment'
      ],
      { min: 1, max: 4 }
    ),
    thumbnailUrl: faker.datatype.boolean() ? faker.image.url() : undefined,
    url: faker.internet.url(),
    redactedUrl: faker.datatype.boolean() ? faker.internet.url() : undefined,
    metadata: {
      size: {
        bytes: Number(faker.string.numeric(8))
      },
      mimeType: faker.system.mimeType(),
      createdAt: createdAtDate.toISOString(),
      submittedAt: submittedAtDate.toISOString(),
      validatedAt: validatedAtDate.toISOString(),
      publishedAt: publishedAtDate.toISOString()
    }
  }

  return file
}
