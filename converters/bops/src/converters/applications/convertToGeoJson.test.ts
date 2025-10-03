import { describe, it, expect } from 'bun:test'
import { convertToGeoJson } from './convertToGeoJson'

describe('convertToGeoJson', () => {
  it('should convert to valid GeoJson', () => {
    const unknownExample = {
      'EPSG:3857': {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-0.036637634038913, 51.49435084436618],
                  [-0.03662401842583033, 51.49431873409662],
                  [-0.03649211132001997, 51.4943381293599],
                  [-0.03650909506810532, 51.49437057232669],
                  [-0.036637634038913, 51.49435084436618]
                ]
              ]
            },
            properties: null
          }
        ]
      },
      'EPSG:27700': {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [536393.8703425663, 179094.77221868327],
                  [536394.9112356603, 179091.22684706404],
                  [536404.0096181332, 179093.62923808262],
                  [536402.7339301897, 179097.20533311192],
                  [536393.8703425663, 179094.77221868327]
                ]
              ]
            },
            properties: null
          }
        ]
      }
    }

    const convert = convertToGeoJson(unknownExample)

    expect(convert).toBeDefined()
    expect(convert).toEqual({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-0.036637634038913, 51.49435084436618],
                [-0.03662401842583033, 51.49431873409662],
                [-0.03649211132001997, 51.4943381293599],
                [-0.03650909506810532, 51.49437057232669],
                [-0.036637634038913, 51.49435084436618]
              ]
            ]
          },
          properties: null
        }
      ]
    })
  })
})
