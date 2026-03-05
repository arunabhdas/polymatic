import type { Entity, Timestamp, Severity } from './common.types';

export type GeoEventType = 'adsb' | 'ais' | 'conflict' | 'earthquake' | 'fire' | 'protest' | 'military';

export type LayerType = 'events' | 'pois' | 'motion' | 'heatmap';

export interface GeoCoords {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface GeoEvent {
  id: string;
  type: GeoEventType;
  title: string;
  description: string;
  coords: GeoCoords;
  severity: Severity;
  entities: Entity[];
  linkedTrendIds: string[];
  linkedMarketIds: string[];
  timestamp: Timestamp;
}

export interface POI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  velocity: number;
  eventCount: number;
  centroidLat: number;
  centroidLng: number;
  linkedMarketIds: string[];
  linkedTrendIds: string[];
}

export interface MotionWaypoint {
  lat: number;
  lng: number;
  alt?: number;
  timestamp: Timestamp;
}

export interface MotionTrack {
  id: string;
  type: 'adsb' | 'ais';
  callsign: string;
  waypoints: MotionWaypoint[];
  heading: number;
  speed: number;
  active: boolean;
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CameraPosition {
  lat: number;
  lng: number;
  altitude: number;
  heading: number;
  pitch: number;
}

export interface GeoRegion {
  id: string;
  name: string;
  bounds: GeoBounds;
  defaultCamera: CameraPosition;
}
