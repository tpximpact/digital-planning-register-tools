import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import { bopsDocumentsEndpointToOdp } from './documents'
import { BopsDocumentsEndpoint } from '../../schemas/bops/documents'
import type { BopsFile } from '../../schemas/shared/BopsFile'

import { validBopsApplication } from '../../mocks/validBopsApplication'
import { validBopsFile } from '../../mocks/validBopsFile'
import { PostSubmissionPublishedDocumentsResponse } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Endpoints.ts'

describe('bopsDocumentsEndpointToOdp conversion', () => {
  describe('Conversion', () => {
    it('returns a valid response', () => {
      const bopsFiles: BopsFile[] = Array.from({ length: 100 }, (_, i) => ({
        ...validBopsFile,
        name: `Test Document ${i + 1}`
      }))

      const before: BopsDocumentsEndpoint = {
        application: validBopsApplication,
        files: bopsFiles,
        metadata: {
          results: 100,
          totalResults: 100
        }
      }

      expect(Value.Check(BopsDocumentsEndpoint, before)).toBe(true)

      const conversion = bopsDocumentsEndpointToOdp(
        before,
        {
          resultsPerPage: 10,
          page: 1
        },
        { code: 200, message: 'OK' }
      )

      expect(
        Value.Check(PostSubmissionPublishedDocumentsResponse, conversion)
      ).toBe(true)

      expect(conversion?.pagination?.resultsPerPage).toBe(10)
      if (conversion.pagination && 'currentPage' in conversion.pagination) {
        expect(conversion.pagination.currentPage).toBe(1)
        expect(conversion.pagination.totalPages).toBe(10)
      }
      expect(conversion?.pagination?.totalResults).toBe(100)
      expect(conversion?.pagination?.totalAvailableItems).toBe(100)
    })

    it('ignores invalid documents', () => {
      const bopsFiles: BopsFile[] = Array.from({ length: 100 }, (_, i) => ({
        ...validBopsFile,
        name: `Test Document ${i + 1}`
      }))

      bopsFiles.push({
        type: [],
        url: '',
        createdAt: ''
      } as unknown as BopsFile) // Invalid file

      const before: BopsDocumentsEndpoint = {
        application: validBopsApplication,
        files: bopsFiles,
        metadata: {
          results: 101,
          totalResults: 101
        }
      }

      const conversion = bopsDocumentsEndpointToOdp(
        before,
        {
          resultsPerPage: 10,
          page: 1
        },
        { code: 200, message: 'OK' }
      )

      expect(
        Value.Check(PostSubmissionPublishedDocumentsResponse, conversion)
      ).toBe(true)

      expect(conversion?.pagination?.resultsPerPage).toBe(10)
      if (conversion.pagination && 'currentPage' in conversion.pagination) {
        expect(conversion.pagination.currentPage).toBe(1)
        expect(conversion.pagination.totalPages).toBe(10)
      }
      expect(conversion?.pagination?.totalResults).toBe(100)
      expect(conversion?.pagination?.totalAvailableItems).toBe(100)
    })

    it('orders results by newest publishedAt first', () => {
      // Create files with different publishedAt dates
      const bopsFiles: BopsFile[] = [
        {
          ...validBopsFile,
          name: 'Oldest Document',
          createdAt: '2020-07-03T15:23:53.264+01:00'
        },
        {
          ...validBopsFile,
          name: 'Middle Document',
          createdAt: '2022-07-03T15:23:53.264+01:00'
        },
        {
          ...validBopsFile,
          name: 'Newest Document',
          createdAt: '2025-07-03T15:23:53.264+01:00'
        }
      ]

      const before: BopsDocumentsEndpoint = {
        application: validBopsApplication,
        files: bopsFiles,
        metadata: {
          results: 3,
          totalResults: 3
        }
      }

      const conversion = bopsDocumentsEndpointToOdp(
        before,
        {
          resultsPerPage: 3,
          page: 1
        },
        { code: 200, message: 'OK' }
      )
      expect(conversion?.data).toBeDefined()
      expect(conversion?.data).not.toBeNull()

      if (conversion?.data) {
        expect(conversion?.data[0]?.name).toBe('Newest Document')
        expect(conversion?.data[1]?.name).toBe('Middle Document')
        expect(conversion?.data[2]?.name).toBe('Oldest Document')
      }
    })
  })
})
