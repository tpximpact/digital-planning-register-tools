import { Elysia } from 'elysia'
import {
  PostSubmissionApplicationResponseSchema,
  PostSubmissionApplicationsQueryParamsSchema,
  PostSubmissionApplicationsResponseSchema,
  PostSubmissionApplicationUrlParamsSchema,
  PostSubmissionDocumentResponseSchema,
  PostSubmissionDocumentsQueryParamsSchema,
  PostSubmissionDocumentsResponseSchema,
  PostSubmissionDocumentsUrlParamsSchema,
  PostSubmissionDocumentUrlParamsSchema,
  PostSubmissionPublicCommentsUrlParamsSchema,
  PostSubmissionPublishedApplicationResponseSchema,
  PostSubmissionPublishedApplicationsQueryParamsSchema,
  PostSubmissionPublishedApplicationsResponseSchema,
  PostSubmissionPublishedApplicationUrlParamsSchema,
  PostSubmissionPublishedDocumentResponseSchema,
  PostSubmissionPublishedDocumentsQueryParamsSchema,
  PostSubmissionPublishedDocumentsResponseSchema,
  PostSubmissionPublishedDocumentsUrlParamsSchema,
  PostSubmissionPublishedDocumentUrlParamsSchema,
  PostSubmissionPublicCommentsQueryParamsSchema,
  PostSubmissionPublicCommentsResponseSchema,
  PostSubmissionPublicCommentUrlParamsSchema,
  PostSubmissionPublicCommentResponseSchema,
  PostSubmissionPublicCommentPostUrlParamsSchema,
  PostSubmissionPublicCommentPostBodySchema,
  PostSubmissionPublishedPublicCommentsUrlParamsSchema,
  PostSubmissionPublishedPublicCommentsQueryParamsSchema,
  PostSubmissionPublishedPublicCommentsResponseSchema,
  PostSubmissionPublishedPublicCommentUrlParamsSchema,
  PostSubmissionPublishedPublicCommentResponseSchema,
  PostSubmissionSpecialistsUrlParamsSchema,
  PostSubmissionSpecialistsQueryParamsSchema,
  PostSubmissionSpecialistsResponseSchema,
  PostSubmissionSpecialistUrlParamsSchema,
  PostSubmissionSpecialistResponseSchema,
  PostSubmissionPublishedSpecialistsUrlParamsSchema,
  PostSubmissionPublishedSpecialistsQueryParamsSchema,
  PostSubmissionPublishedSpecialistsResponseSchema,
  PostSubmissionPublishedSpecialistUrlParamsSchema,
  PostSubmissionPublishedSpecialistResponseSchema,
  PostSubmissionPublishedSpecialistQueryParamsSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { PostSubmissionPublishedApplicationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
import { PostSubmissionApplicationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/index.ts'

export const SchemaModel = new Elysia().model({
  PostSubmissionPublishedApplication: PostSubmissionPublishedApplicationSchema,
  PostSubmissionApplication: PostSubmissionApplicationSchema,
  'applications.all.query': PostSubmissionApplicationsQueryParamsSchema,
  'applications.all.response': PostSubmissionApplicationsResponseSchema,
  'applications.single.params': PostSubmissionApplicationUrlParamsSchema,
  'applications.single.response': PostSubmissionApplicationResponseSchema,
  'public.applications.all.query':
    PostSubmissionPublishedApplicationsQueryParamsSchema,
  'public.applications.all.response':
    PostSubmissionPublishedApplicationsResponseSchema,
  'public.applications.single.params':
    PostSubmissionPublishedApplicationUrlParamsSchema,
  'public.applications.single.response':
    PostSubmissionPublishedApplicationResponseSchema,
  'documents.all.params': PostSubmissionDocumentsUrlParamsSchema,
  'documents.all.query': PostSubmissionDocumentsQueryParamsSchema,
  'documents.all.response': PostSubmissionDocumentsResponseSchema,
  'documents.single.params': PostSubmissionDocumentUrlParamsSchema,
  'documents.single.response': PostSubmissionDocumentResponseSchema,
  'public.documents.all.params':
    PostSubmissionPublishedDocumentsUrlParamsSchema,
  'public.documents.all.query':
    PostSubmissionPublishedDocumentsQueryParamsSchema,
  'public.documents.all.response':
    PostSubmissionPublishedDocumentsResponseSchema,
  'public.documents.single.params':
    PostSubmissionPublishedDocumentUrlParamsSchema,
  'public.documents.single.response':
    PostSubmissionPublishedDocumentResponseSchema,
  'publicComments.all.params': PostSubmissionPublicCommentsUrlParamsSchema,
  'publicComments.all.query': PostSubmissionPublicCommentsQueryParamsSchema,
  'publicComments.all.response': PostSubmissionPublicCommentsResponseSchema,
  'publicComments.single.params': PostSubmissionPublicCommentUrlParamsSchema,
  'publicComments.single.response': PostSubmissionPublicCommentResponseSchema,
  'publicComments.submit.params':
    PostSubmissionPublicCommentPostUrlParamsSchema,
  'publicComments.submit.body': PostSubmissionPublicCommentPostBodySchema,
  'public.publicComments.all.params':
    PostSubmissionPublishedPublicCommentsUrlParamsSchema,
  'public.publicComments.all.query':
    PostSubmissionPublishedPublicCommentsQueryParamsSchema,
  'public.publicComments.all.response':
    PostSubmissionPublishedPublicCommentsResponseSchema,
  'public.publicComments.single.params':
    PostSubmissionPublishedPublicCommentUrlParamsSchema,
  'public.publicComments.single.response':
    PostSubmissionPublishedPublicCommentResponseSchema,
  'specialists.all.params': PostSubmissionSpecialistsUrlParamsSchema,
  'specialists.all.query': PostSubmissionSpecialistsQueryParamsSchema,
  'specialists.all.response': PostSubmissionSpecialistsResponseSchema,
  'specialists.single.params': PostSubmissionSpecialistUrlParamsSchema,
  'specialists.single.response': PostSubmissionSpecialistResponseSchema,
  'public.specialists.all.params':
    PostSubmissionPublishedSpecialistsUrlParamsSchema,
  'public.specialists.all.query':
    PostSubmissionPublishedSpecialistsQueryParamsSchema,
  'public.specialists.all.response':
    PostSubmissionPublishedSpecialistsResponseSchema,
  'public.specialists.single.params':
    PostSubmissionPublishedSpecialistUrlParamsSchema,
  'public.specialists.single.query':
    PostSubmissionPublishedSpecialistQueryParamsSchema,
  'public.specialists.single.response':
    PostSubmissionPublishedSpecialistResponseSchema
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
