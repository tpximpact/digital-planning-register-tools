import { TypeCheck, TypeCompiler } from '@sinclair/typebox/compiler'
import { FileTypeSchema } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/enums/FileType.ts'
import {
  PostSubmissionFileSchema,
  PostSubmissionFileRedactedSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/File.ts'
import {
  PublicCommentSchema,
  TopicAndCommentsSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/PublicComment.ts'
import { AddressSchema } from '@dpr/odp-schemas/types/shared/Addresses.ts'
import { BaseApplicantSchema } from '@dpr/odp-schemas/types/schemas/prototypeApplication/data/Applicant.ts'
import { ContactDetailsSchema } from '@dpr/odp-schemas/types/shared/Contacts.ts'
import {
  PublicCommentsRedactedSchema,
  PublicCommentsSchema
} from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/data/Comment.ts'

import { Type, type TSchema } from '@sinclair/typebox'

// Compiled once when the module loads, reused on every request
// specifically in libs because these checks are used in multiple places and
// we want to avoid recompiling the same schema multiple times across the codebase

export const FileTypeArrayChecker = TypeCompiler.Compile(
  Type.Array(FileTypeSchema)
)

export const PostSubmissionFileChecker = TypeCompiler.Compile(
  PostSubmissionFileSchema
)

export const PostSubmissionFileArrayChecker = TypeCompiler.Compile(
  Type.Array(PostSubmissionFileSchema)
)

export const PostSubmissionFileRedactedArrayChecker = TypeCompiler.Compile(
  Type.Array(PostSubmissionFileRedactedSchema)
)

export const AddressChecker = TypeCompiler.Compile(AddressSchema)

export const BaseApplicantChecker = TypeCompiler.Compile(BaseApplicantSchema)
export const ContactDetailsChecker = TypeCompiler.Compile(ContactDetailsSchema)

export const TopicAndCommentsArrayChecker = TypeCompiler.Compile(
  Type.Array(TopicAndCommentsSchema)
)

export const PublicCommentChecker = TypeCompiler.Compile(PublicCommentSchema)
export const PublicCommentsChecker = TypeCompiler.Compile(PublicCommentsSchema)
export const PublicCommentsRedactedChecker = TypeCompiler.Compile(
  PublicCommentsRedactedSchema
)

export const assertSchema = <T extends TSchema>(
  checker: TypeCheck<T>,
  value: unknown
) => {
  if (!checker.Check(value)) {
    const errors = [...checker.Errors(value)]
    throw new Error(
      `Schema validation failed:\n${JSON.stringify(errors, null, 2)}`
    )
  }
}

export const assertSchemaFails = <T extends TSchema>(
  checker: TypeCheck<T>,
  value: unknown
) => {
  if (checker.Check(value)) {
    throw new Error(
      `Expected schema validation to fail but it passed for:\n${JSON.stringify(
        value,
        null,
        2
      )}`
    )
  }
}
