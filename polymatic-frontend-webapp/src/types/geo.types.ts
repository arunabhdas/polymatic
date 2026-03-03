import type { Timestamp, Severity, Entity } from './common.types'

// ─── Geo ─────────────────────────────────────────────────────

export type GeoEventType = 'adsb' | 'ais' | 'conflict' | 'earthquake' | 'fire' | 'protest' | 'military'

export type LayerType = 'events' | 'sentiment' | 'markets' | 'poi' | 'motion-trails'

export interface GeoCoords {
  latitude: number
  longitude: number
  altitude?: number
}

export interface GeoBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface GeoEvent {
  id: string
  type: GeoEventType
  title: string
  description: string
  coords: GeoCoords
  severity: Severity
  entities: Entity[]
  linkedTrendIds: string[]
  linkedMarketIds: string[]
  timestamp: Timestamp
}

export interface GeoLayer {
  id: string
  type: LayerType
  label: string
  visible: boolean
  opacity: number
}

export interface POI {
  id: string
  name: string
  coords: GeoCoords
  severity: Severity
  velocity: number
  eventCount: number
  linkedMarketIds: string[]
  linkedTrendIds: string[]
  centroid: GeoCoords
}

export interface MotionTrack {
  id: string
  type: 'adsb' | 'ais'
  callsign: string
  waypoints: Array<GeoCoords & { timestamp: Timestamp }>
  heading: number
  speed: number
  active: boolean
}

export interface CameraPosition {
  longitude: number
  latitude: number
  height: number
}

export interface GeoRegion {
  id: string
  name: string
  bounds: GeoBounds
}
