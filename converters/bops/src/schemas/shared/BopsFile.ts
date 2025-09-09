import { Type, type Static } from '@sinclair/typebox'
import './formats'
import '@dpr/odp-schemas/types/shared/formats'
/**
 * Bops file schema
 * engines/bops_api/app/views/bops_api/v2/shared/_document.json.jbuilder
 */
export const BopsFile = Type.Object({
  name: Type.Union([Type.String(), Type.Null()]),
  referencesInDocument: Type.Array(Type.String()),
  url: Type.String({ format: 'uri' }),
  type: Type.Array(
    Type.Object({
      value: Type.String(),
      description: Type.String()
    })
  ),
  createdAt: Type.String({ format: 'bops-date-time' }),
  applicantDescription: Type.Union([Type.String(), Type.Null()]),
  metadata: Type.Object({
    byteSize: Type.Number(),
    contentType: Type.String()
  })
})
export type BopsFile = Static<typeof BopsFile>

// json.name document.name
// json.references_in_document [document.numbers].compact_blank
// json.url main_app.uploaded_file_url(document.blob)
// json.type document.tags do |tag|
//   json.value tag
//   json.description I18n.t("document_tags.#{tag}")
// end
// json.extract! document,
//   :created_at,
//   :applicant_description
// json.metadata do
//   json.byteSize document.file.byte_size
//   json.contentType document.file.content_type
// end
