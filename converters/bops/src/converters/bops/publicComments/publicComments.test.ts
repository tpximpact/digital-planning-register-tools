import { describe, it, expect } from 'bun:test'
import { Value } from '@sinclair/typebox/value'
import before from '../../fixtures/bops/documents.json'
import after from '../../fixtures/dpr/documents.json'
import { bopsDocumentsEndpointToOdp } from './documents'
import { BopsDocumentsEndpoint } from '../../schemas/documents'
import { PostSubmissionPublishedDocumentsEndpoint } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/documents/documents'
import type { PostSubmissionPublishedDocumentsSearchParams } from '@dpr/odp-schemas/types/schemas/postSubmissionPublishedApplication/implementation/documents/documentsSearchParams.ts'
import { Pagination } from '@dpr/odp-schemas/types/schemas/postSubmissionApplication/implementation/Pagination.ts'

describe('bopsDocumentsEndpointToOdp conversion', () => {
  describe('with results', () => {
    it('converts to a valid response successfully', () => {
      expect(Value.Check(BopsDocumentsEndpoint, before)).toBe(true)

      const conversion = bopsDocumentsEndpointToOdp(
        before,
        {
          resultsPerPage: 10,
          page: 1
        },
        { code: 200, message: 'OK' }
      )
      // exclude id because its randomly generated for now
      expect(conversion).toEqual(
        expect.objectContaining({
          ...after,
          data: after.data.map(({ id, ...rest }) =>
            expect.objectContaining(rest)
          )
        })
      )
      expect(Value.Check(PostSubmissionPublishedDocumentsEndpoint, after)).toBe(
        true
      )
    })
    describe('searchParams', () => {
      it('handles missing searchParams', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          before,
          {} as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 2,
          totalResults: 10,
          totalAvailableItems: 13
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
      it('handles missing searchParams.page', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          before,
          {
            resultsPerPage: 10
          } as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 2,
          totalResults: 10,
          totalAvailableItems: 13
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
      it('handles missing searchParams.resultsPerPage', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          before,
          {
            page: 1
          } as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 2,
          totalResults: 10,
          totalAvailableItems: 13
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
    })
  })

  describe('with no results', () => {
    it('converts to a valid response successfully', () => {
      const conversion = bopsDocumentsEndpointToOdp(
        {
          application: before.application,
          files: [],
          metadata: { results: 0, totalResults: 0 }
        },
        {
          resultsPerPage: 10,
          page: 1
        },
        { code: 200, message: 'OK' }
      )
      expect(conversion).toEqual({
        data: null,
        pagination: {
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 0,
          totalResults: 0,
          totalAvailableItems: 0
        },
        status: { code: 200, message: 'OK' }
      })
      expect(
        Value.Check(PostSubmissionPublishedDocumentsEndpoint, conversion)
      ).toBe(true)
    })
    describe('searchParams', () => {
      it('handles missing searchParams', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          {
            application: before.application,
            files: [],
            metadata: { results: 0, totalResults: 0 }
          },
          {} as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 0,
          totalResults: 0,
          totalAvailableItems: 0
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
      it('handles missing searchParams.page', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          {
            application: before.application,
            files: [],
            metadata: { results: 0, totalResults: 0 }
          },
          {
            resultsPerPage: 10
          } as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 0,
          totalResults: 0,
          totalAvailableItems: 0
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
      it('handles missing searchParams.resultsPerPage', () => {
        const conversion = bopsDocumentsEndpointToOdp(
          {
            application: before.application,
            files: [],
            metadata: { results: 0, totalResults: 0 }
          },
          {
            page: 1
          } as PostSubmissionPublishedDocumentsSearchParams,
          { code: 200, message: 'OK' }
        )
        expect(conversion.pagination).toEqual({
          resultsPerPage: 10,
          currentPage: 1,
          totalPages: 0,
          totalResults: 0,
          totalAvailableItems: 0
        })
        expect(Value.Check(Pagination, conversion.pagination)).toBe(true)
      })
    })
  })
})
