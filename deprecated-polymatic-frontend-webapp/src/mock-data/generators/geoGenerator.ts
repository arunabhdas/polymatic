import { nanoid } from 'nanoid'
import type {
  GeoEvent,
  GeoEventType,
  GeoCoords,
  GeoBounds,
  Severity,
  MotionTrack,
} from '@/types'
import { seedEntities } from '../seed/entities'

// ─── Geo Generator ───────────────────────────────────────────
// Generates geospatial events: ADS-B, AIS, conflict, earthquake, etc.

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// Active conflict/interest zones
const ZONES: Array<{
  name: string
  center: [number, number]
  radius: number // degrees
  eventTypes: GeoEventType[]
  entityIds: string[]
  trendIds: string[]
  marketIds: string[]
}> = [
  {
    name: 'Strait of Hormuz',
    center: [26.5, 56.3],
    radius: 3,
    eventTypes: ['ais', 'military', 'conflict'],
    entityIds: ['ent-021', 'ent-031', 'ent-011'],
    trendIds: ['trend-001'],
    marketIds: ['mkt-001', 'mkt-025'],
  },
  {
    name: 'Ukraine-Russia Front',
    center: [48.5, 37.5],
    radius: 4,
    eventTypes: ['adsb', 'conflict', 'military'],
    entityIds: ['ent-024', 'ent-023', 'ent-033'],
    trendIds: ['trend-006'],
    marketIds: ['mkt-009'],
  },
  {
    name: 'Taiwan Strait',
    center: [24.0, 120.5],
    radius: 3,
    eventTypes: ['ais', 'adsb', 'military'],
    entityIds: ['ent-026', 'ent-022', 'ent-032'],
    trendIds: ['trend-005'],
    marketIds: ['mkt-008'],
  },
  {
    name: 'Korean Peninsula',
    center: [38.5, 127.0],
    radius: 3,
    eventTypes: ['adsb', 'military'],
    entityIds: ['ent-029'],
    trendIds: ['trend-013'],
    marketIds: ['mkt-019'],
  },
  {
    name: 'South China Sea',
    center: [14.0, 115.0],
    radius: 5,
    eventTypes: ['ais', 'adsb', 'military'],
    entityIds: ['ent-022', 'ent-034'],
    trendIds: ['trend-005'],
    marketIds: ['mkt-008'],
  },
]

const EVENT_DESCRIPTIONS: Record<GeoEventType, string[]> = {
  adsb: [
    'Military transport aircraft detected on unusual flight path',
    'Surveillance aircraft conducting patterns over the region',
    'Unidentified aircraft with transponder intermittently active',
    'Heavy-lift cargo aircraft departing military airbase',
  ],
  ais: [
    'Naval vessel changed course toward restricted waters',
    'Tanker traffic rerouting around disputed zone',
    'Military vessel AIS signal went dark',
    'Unusual convoy formation detected on shipping lane',
  ],
  conflict: [
    'Reports of artillery fire near frontline positions',
    'Drone strike reported in contested area',
    'Ground forces movement detected via satellite',
    'Explosions reported near military installation',
  ],
  earthquake: [
    'Seismic activity detected: magnitude {mag} at depth {depth}km',
    'Earthquake swarm ongoing in region',
  ],
  fire: [
    'Large fire detected via VIIRS satellite data',
    'Industrial fire reported near critical infrastructure',
  ],
  protest: [
    'Large-scale protest gathering reported',
    'Civil unrest escalating in major urban center',
  ],
  military: [
    'Military exercise underway with live fire components',
    'Troop mobilization observed via commercial satellite',
    'Naval blockade formation detected in shipping corridor',
    'Air defense systems activated in region',
  ],
}

export class GeoGenerator {
  private events: GeoEvent[] = []
  private tracks = new Map<string, MotionTrack>()

  constructor() {
    // Seed some initial events
    for (let i = 0; i < 30; i++) {
      this.generateEvent()
    }
    // Seed motion tracks
    for (let i = 0; i < 8; i++) {
      this.generateTrack()
    }
  }

  tick(): void {
    // Generate 0-3 new events per tick
    const count = Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      this.generateEvent()
    }

    // Update motion tracks
    for (const [, track] of this.tracks) {
      this.advanceTrack(track)
    }

    // Cap events at 200
    if (this.events.length > 200) {
      this.events = this.events.slice(0, 200)
    }
  }

  getEvents(bounds?: GeoBounds): GeoEvent[] {
    if (!bounds) return [...this.events]

    return this.events.filter(e =>
      e.coords.latitude >= bounds.south &&
      e.coords.latitude <= bounds.north &&
      e.coords.longitude >= bounds.west &&
      e.coords.longitude <= bounds.east,
    )
  }

  getTracks(): MotionTrack[] {
    return Array.from(this.tracks.values())
  }

  private generateEvent(): void {
    const zone = pick(ZONES)
    const type = pick(zone.eventTypes)
    const descriptions = EVENT_DESCRIPTIONS[type]
    let description = pick(descriptions)

    if (type === 'earthquake') {
      description = description
        .replace('{mag}', (3 + Math.random() * 4).toFixed(1))
        .replace('{depth}', String(Math.floor(5 + Math.random() * 50)))
    }

    const entities = seedEntities.filter(e => zone.entityIds.includes(e.id))

    const severities: Severity[] = ['low', 'medium', 'high', 'critical']
    const severityWeights = [0.3, 0.35, 0.25, 0.1]
    const r = Math.random()
    let cumulative = 0
    let severity: Severity = 'low'
    for (let i = 0; i < severities.length; i++) {
      cumulative += severityWeights[i]
      if (r < cumulative) {
        severity = severities[i]
        break
      }
    }

    this.events.unshift({
      id: nanoid(),
      type,
      title: `${zone.name}: ${type.toUpperCase()} event`,
      description,
      coords: {
        latitude: zone.center[0] + (Math.random() - 0.5) * zone.radius * 2,
        longitude: zone.center[1] + (Math.random() - 0.5) * zone.radius * 2,
      },
      severity,
      entities,
      linkedTrendIds: zone.trendIds,
      linkedMarketIds: zone.marketIds,
      timestamp: new Date(Date.now() - Math.random() * 3600_000).toISOString(),
    })
  }

  private generateTrack(): void {
    const zone = pick(ZONES)
    const isAir = Math.random() > 0.5
    const type = isAir ? 'adsb' as const : 'ais' as const
    const id = nanoid()

    const callsigns = isAir
      ? ['RCH001', 'FORTE12', 'LAGR221', 'DUKE42', 'NATO05', 'USAF99']
      : ['TANKER-A', 'CVN-78', 'DDG-118', 'CARGO-7', 'VESSEL-X', 'PATROL-3']

    const waypoints: Array<GeoCoords & { timestamp: string }> = []
    let lat = zone.center[0] + (Math.random() - 0.5) * zone.radius
    let lng = zone.center[1] + (Math.random() - 0.5) * zone.radius

    for (let i = 0; i < 10; i++) {
      lat += (Math.random() - 0.5) * 0.5
      lng += (Math.random() - 0.5) * 0.5
      waypoints.push({
        latitude: lat,
        longitude: lng,
        altitude: isAir ? 25000 + Math.random() * 15000 : 0,
        timestamp: new Date(Date.now() - (10 - i) * 300_000).toISOString(),
      })
    }

    this.tracks.set(id, {
      id,
      type,
      callsign: pick(callsigns),
      waypoints,
      heading: Math.random() * 360,
      speed: isAir ? 300 + Math.random() * 400 : 10 + Math.random() * 20,
      active: true,
    })
  }

  private advanceTrack(track: MotionTrack): void {
    const last = track.waypoints[track.waypoints.length - 1]
    if (!last) return

    const headingRad = (track.heading + (Math.random() - 0.5) * 20) * Math.PI / 180
    const distance = track.type === 'adsb' ? 0.05 : 0.005

    track.heading = clamp(track.heading + (Math.random() - 0.5) * 10, 0, 360)

    track.waypoints.push({
      latitude: last.latitude + Math.cos(headingRad) * distance,
      longitude: last.longitude + Math.sin(headingRad) * distance,
      altitude: last.altitude,
      timestamp: new Date().toISOString(),
    })

    if (track.waypoints.length > 50) {
      track.waypoints.shift()
    }
  }
}
