// import type { BopsApplicationSubmissionEndpoint } from '../../schemas/applicationSubmission'
// import type { DprApplicationSubmissionEndpoint } from '../../schemas/dprApplicationSubmission'
// import type { ApiResponseStatus } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.ts'
// // import { convertBopsApplicationToDpr } from '../shared/convertBopsApplicationToDpr'

// export const bopsSubmissionEndpointToOdp = (
//   input: BopsApplicationSubmissionEndpoint,
//   status: ApiResponseStatus
// ): DprApplicationSubmissionEndpoint => {
//   // if (input) {
//   //   try {
//   //   const application = convertBopsApplicationToDpr(input?.application)
//   //   const submission = request.data?.submission
//   //     ? convertApplicationSubmissionBops(request.data?.submission)
//   //     : null
//   //   const convertedData = {
//   //     application: application,
//   //     submission: submission
//   //   }
//   //   return { data: convertedData, status }
//   // } catch (error) {
//   //   return {
//   //     data: null,
//   //     status: {
//   //       code: 500,
//   //       message: `Error converting application data: ${error}`
//   //     }
//   //   }
//   // } else {
//   //   return {
//   //     data: null,
//   //     status: {
//   //       code: 404,
//   //       message: 'Unable to return application information'
//   //     }
//   //   }
//   // }
// }
