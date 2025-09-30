import fs from 'fs'
import path from 'path'
import { generateExampleApplications } from '../generateExampleApplications'
import { generatePostSubmissionPublishedApplication } from '../generatePostSubmissionPublishedApplication'
import type { ApplicationType } from 'digital-planning-data-schemas/types/schemas/prototypeApplication/enums/ApplicationType.d.ts'
import { generatePostSubmissionApplication } from '../generatePostSubmissionApplication'

const basePath = path.join(__dirname, '..', '..', 'dist')

function saveApplicationToJson(
  application: object | undefined,
  filePath: string
): void {
  if (application === undefined) {
    console.warn(`Skipped saving undefined application for ${filePath}`)
    return
  }
  // Ensure the folder exists before writing the file
  const folder = path.dirname(filePath)
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }
  const jsonData = JSON.stringify(application, null, 2)
  fs.writeFileSync(filePath, jsonData, 'utf-8')
}

const applicationTypes: {
  key: ApplicationType
  prefix: string
}[] = [
  { key: 'pp.full.householder', prefix: 'PlanningPermissionFullHouseholder' },
  { key: 'pa.part1.classA', prefix: 'PriorApprovalLargerExtension' },
  { key: 'ldc.proposed', prefix: 'LawfulDevelopmentCertificateProposed' }
]

const stages = [
  // 01-submission
  // 01 the application is submitted via planX into BOPS
  { prop: 'submission', suffix: '01-submission' },
  // 02-validation-01-invalid
  // 02 The application is validated in BOPS - it passes - so it goes straight to consultation/assessment depending on application type
  // 02.01 The application is validated in BOPS - uhoh it fails so its now returned
  // handled separately

  // 03-consultation
  // 03 Applications move immediately into consultation from validation except for those that don't have consultation stage (ldc) which go to assessment
  { prop: 'consultation', suffix: '03-consultation' },

  // 04-assessment-00-assessment-in-progress
  // 04 Applications now moves to assessment and comments are no longer allowed unless the council allows it until a decision is made (ldc)
  {
    prop: 'assessmentInProgress',
    suffix: '04-assessment-00-assessment-in-progress'
  },
  // 04-assessment-01-council-determined
  // 04 01 council makes a decision on the application (comments are no longer allowed for those exempted per council)
  {
    prop: 'planningOfficerDetermined',
    suffix: '04-assessment-01-planning-officer-determined'
  },
  // 04-assessment-02-assessment-in-committee
  // 04 02 Alternatively application goes to committee for a decision
  {
    prop: 'assessmentInCommittee',
    suffix: '04-assessment-02-assessment-in-committee'
  },
  // 04-assessment-03-committee-determined
  // 04 03 The committee then makes a decision
  {
    prop: 'committeeDetermined',
    suffix: '04-assessment-03-committee-determined'
  },
  // 05-appeal-00-appeal-lodged
  // 05 Things can end before this but within 6 months of the decision a decision can be appealed
  { prop: 'appealLodged', suffix: '05-appeal-00-appeal-lodged' },
  // 05-appeal-01-appeal-validated
  // 05 01 After the appeal starts its validated
  { prop: 'appealValid', suffix: '05-appeal-01-appeal-validated' },
  // 05-appeal-02-appeal-started
  // 05 02 Then it starts
  { prop: 'appealStarted', suffix: '05-appeal-02-appeal-started' },
  // 05-appeal-03-appeal-determined
  // 05 03 and a decision is made by the appeal
  { prop: 'appealDetermined', suffix: '05-appeal-03-appeal-determined' },
  // 06-assessment-withdrawn
  { prop: 'withdrawn', suffix: '06-assessment-withdrawn' }
]

// Save generated examples for each application type and stage
for (const { key, prefix } of applicationTypes) {
  const example = generateExampleApplications(key)
  for (const { prop, suffix } of stages) {
    saveApplicationToJson(
      example[prop],
      path.join(
        `${basePath}/PostSubmissionPublishedApplication/${prefix}`,
        `${prefix}-${suffix}.json`
      )
    )
  }
}

// Save validation fail examples for each application type
for (const { key, prefix } of applicationTypes) {
  const validationFail = generatePostSubmissionPublishedApplication({
    applicationType: key,
    applicationStage: 'validation',
    applicationStatus: 'returned'
  })
  saveApplicationToJson(
    validationFail,
    path.join(
      `${basePath}/PostSubmissionPublishedApplication/${prefix}`,
      `${prefix}-02-validation-01-invalid.json`
    )
  )
}

// Save generated examples for each application type and stage
for (const { key, prefix } of applicationTypes) {
  const example = generateExampleApplications(key, false)
  for (const { prop, suffix } of stages) {
    saveApplicationToJson(
      example[prop],
      path.join(
        `${basePath}/PostSubmissionApplication/${prefix}`,
        `${prefix}-${suffix}.json`
      )
    )
  }
}

// Save validation fail examples for each application type
for (const { key, prefix } of applicationTypes) {
  const validationFail = generatePostSubmissionApplication({
    applicationType: key,
    applicationStage: 'validation',
    applicationStatus: 'returned'
  })
  saveApplicationToJson(
    validationFail,
    path.join(
      `${basePath}/PostSubmissionApplication/${prefix}`,
      `${prefix}-02-validation-01-invalid.json`
    )
  )
}
