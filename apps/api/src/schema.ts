import { Elysia } from 'elysia'
import {
  PostSubmissionApplicationResponse,
  PostSubmissionApplicationsQueryParams,
  PostSubmissionApplicationsResponse,
  PostSubmissionApplicationUrlParams,
  PostSubmissionDocumentResponse,
  PostSubmissionDocumentsQueryParams,
  PostSubmissionDocumentsResponse,
  PostSubmissionDocumentsUrlParams,
  PostSubmissionDocumentUrlParams,
  PostSubmissionPublicCommentsUrlParams,
  PostSubmissionPublishedApplicationResponse,
  PostSubmissionPublishedApplicationsQueryParams,
  PostSubmissionPublishedApplicationsResponse,
  PostSubmissionPublishedApplicationUrlParams,
  PostSubmissionPublishedDocumentResponse,
  PostSubmissionPublishedDocumentsQueryParams,
  PostSubmissionPublishedDocumentsResponse,
  PostSubmissionPublishedDocumentsUrlParams,
  PostSubmissionPublishedDocumentUrlParams,
  PostSubmissionPublicCommentsQueryParams,
  PostSubmissionPublicCommentsResponse,
  PostSubmissionPublicCommentUrlParams,
  PostSubmissionPublicCommentResponse,
  PostSubmissionPublicCommentPostUrlParams,
  PostSubmissionPublicCommentPostBody,
  PostSubmissionPublishedPublicCommentsUrlParams,
  PostSubmissionPublishedPublicCommentsQueryParams,
  PostSubmissionPublishedPublicCommentsResponse,
  PostSubmissionPublishedPublicCommentUrlParams,
  PostSubmissionPublishedPublicCommentResponse,
  PostSubmissionSpecialistsUrlParams,
  PostSubmissionSpecialistsQueryParams,
  PostSubmissionSpecialistsResponse,
  PostSubmissionSpecialistUrlParams,
  PostSubmissionSpecialistResponse,
  PostSubmissionPublishedSpecialistsUrlParams,
  PostSubmissionPublishedSpecialistsQueryParams,
  PostSubmissionPublishedSpecialistsResponse,
  PostSubmissionPublishedSpecialistUrlParams,
  PostSubmissionPublishedSpecialistResponse
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'

export const SchemaModel = new Elysia().model({
  'applications.all.query': PostSubmissionApplicationsQueryParams,
  'applications.all.response': PostSubmissionApplicationsResponse,
  'applications.single.params': PostSubmissionApplicationUrlParams,
  'applications.single.response': PostSubmissionApplicationResponse,
  'public.applications.all.query':
    PostSubmissionPublishedApplicationsQueryParams,
  'public.applications.all.response':
    PostSubmissionPublishedApplicationsResponse,
  'public.applications.single.params':
    PostSubmissionPublishedApplicationUrlParams,
  'public.applications.single.response':
    PostSubmissionPublishedApplicationResponse,
  'documents.all.params': PostSubmissionDocumentsUrlParams,
  'documents.all.query': PostSubmissionDocumentsQueryParams,
  'documents.all.response': PostSubmissionDocumentsResponse,
  'documents.single.params': PostSubmissionDocumentUrlParams,
  'documents.single.response': PostSubmissionDocumentResponse,
  'public.documents.all.params': PostSubmissionPublishedDocumentsUrlParams,
  'public.documents.all.query': PostSubmissionPublishedDocumentsQueryParams,
  'public.documents.all.response': PostSubmissionPublishedDocumentsResponse,
  'public.documents.single.params': PostSubmissionPublishedDocumentUrlParams,
  'public.documents.single.response': PostSubmissionPublishedDocumentResponse,
  'publicComments.all.params': PostSubmissionPublicCommentsUrlParams,
  'publicComments.all.query': PostSubmissionPublicCommentsQueryParams,
  'publicComments.all.response': PostSubmissionPublicCommentsResponse,
  'publicComments.single.params': PostSubmissionPublicCommentUrlParams,
  'publicComments.single.response': PostSubmissionPublicCommentResponse,
  'publicComments.submit.params': PostSubmissionPublicCommentPostUrlParams,
  'publicComments.submit.body': PostSubmissionPublicCommentPostBody,
  'public.publicComments.all.params':
    PostSubmissionPublishedPublicCommentsUrlParams,
  'public.publicComments.all.query':
    PostSubmissionPublishedPublicCommentsQueryParams,
  'public.publicComments.all.response':
    PostSubmissionPublishedPublicCommentsResponse,
  'public.publicComments.single.params':
    PostSubmissionPublishedPublicCommentUrlParams,
  'public.publicComments.single.response':
    PostSubmissionPublishedPublicCommentResponse,
  'specialists.all.params': PostSubmissionSpecialistsUrlParams,
  'specialists.all.query': PostSubmissionSpecialistsQueryParams,
  'specialists.all.response': PostSubmissionSpecialistsResponse,
  'specialists.single.params': PostSubmissionSpecialistUrlParams,
  'specialists.single.response': PostSubmissionSpecialistResponse,
  'public.specialists.all.params': PostSubmissionPublishedSpecialistsUrlParams,
  'public.specialists.all.query': PostSubmissionPublishedSpecialistsQueryParams,
  'public.specialists.all.response': PostSubmissionPublishedSpecialistsResponse,
  'public.specialists.single.params':
    PostSubmissionPublishedSpecialistUrlParams,
  'public.specialists.single.response':
    PostSubmissionPublishedSpecialistResponse
})

export const schemaModels = SchemaModel.models

// Service handle business logic, decoupled from Elysia controller
// import { status } from 'elysia'

// import type { AuthModel } from './model'

// // If the class doesn't need to store a property,
// // you may use `abstract class` to avoid class allocation
// export abstract class Auth {
// 	static async signIn({ username, password }: AuthModel.signInBody) {
// 		const user = await sql`
// 			SELECT password
// 			FROM users
// 			WHERE username = ${username}
// 			LIMIT 1`

// 		if (await Bun.password.verify(password, user.password))
// 			// You can throw an HTTP error directly
// 			throw status(
// 				400,
// 				'Invalid username or password' satisfies AuthModel.signInInvalid
// 			)

// 		return {
// 			username,
// 			token: await generateAndSaveTokenToDB(user.id)
// 		}
// 	}
// }

// Model define the data structure and validation for the request and response
// import { t } from 'elysia'

// export namespace AuthModel {
// 	// Define a DTO for Elysia validation
// 	export const signInBody = t.Object({
// 		username: t.String(),
// 		password: t.String(),
// 	})

// 	// Define it as TypeScript type
// 	export type signInBody = typeof signInBody.static

// 	// Repeat for other models
// 	export const signInResponse = t.Object({
// 		username: t.String(),
// 		token: t.String(),
// 	})

// 	export type signInResponse = typeof signInResponse.static

// 	export const signInInvalid = t.Literal('Invalid username or password')
// 	export type signInInvalid = typeof signInInvalid.static
// }
