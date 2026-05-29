import { TypeCompiler } from '@sinclair/typebox/compiler'
import { PostSubmissionPublishedApplicationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/index.ts'
import { PrototypeApplicationSchema } from '@dpr/odp-schemas/types/schemas/prototypeApplication/minimumSubmission.ts'
import { PostSubmissionPublishedApplicationsResponseSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { PaginationSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'
import { FileTypeSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/FileType.ts'
import { PostSubmissionFileRedactedSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import { PublicCommentRedactedSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import { PostSubmissionPublishedDocumentsResponseSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { PostSubmissionPublishedPublicCommentsResponseSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { PublicCommentSummarySchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import { PostSubmissionPublishedSpecialistsResponseSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'
import { SpecialistCommentSummarySchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/CommentSummary.ts'
import {
  SpecialistRedactedSchema,
  SpecialistCommentRedactedSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/SpecialistComment.ts'

// Compiled once when the module loads, reused on every request
// specifically in libs because these checks are used in multiple places and
// we want to avoid recompiling the same schema multiple times across the codebase

export const PostSubmissionPublishedApplicationChecker = TypeCompiler.Compile(
  PostSubmissionPublishedApplicationSchema
)

export const PrototypeApplicationChecker = TypeCompiler.Compile(
  PrototypeApplicationSchema
)

export const PostSubmissionPublishedApplicationsResponseChecker =
  TypeCompiler.Compile(PostSubmissionPublishedApplicationsResponseSchema)

export const PaginationChecker = TypeCompiler.Compile(PaginationSchema)

export const FileTypeChecker = TypeCompiler.Compile(FileTypeSchema)

export const PostSubmissionFileRedactedChecker = TypeCompiler.Compile(
  PostSubmissionFileRedactedSchema
)

export const PostSubmissionPublishedDocumentsResponseChecker =
  TypeCompiler.Compile(PostSubmissionPublishedDocumentsResponseSchema)

export const PublicCommentRedactedChecker = TypeCompiler.Compile(
  PublicCommentRedactedSchema
)

export const PostSubmissionPublishedPublicCommentsResponseChecker =
  TypeCompiler.Compile(PostSubmissionPublishedPublicCommentsResponseSchema)

export const PublicCommentSummaryChecker = TypeCompiler.Compile(
  PublicCommentSummarySchema
)

export const SpecialistRedactedChecker = TypeCompiler.Compile(
  SpecialistRedactedSchema
)
export const SpecialistCommentRedactedChecker = TypeCompiler.Compile(
  SpecialistCommentRedactedSchema
)

export const PostSubmissionPublishedSpecialistsResponseChecker =
  TypeCompiler.Compile(PostSubmissionPublishedSpecialistsResponseSchema)

export const SpecialistCommentSummaryChecker = TypeCompiler.Compile(
  SpecialistCommentSummarySchema
)
