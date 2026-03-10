import type { Vector3Tuple } from "three"

// --- Coordinate Conversion ---

const DEG2RAD = Math.PI / 180

/** Convert lat/lng (degrees) to a 3D point on a sphere of given radius. */
export function latLngToSphere(
  lat: number,
  lng: number,
  radius: number
): Vector3Tuple {
  const phi = (90 - lat) * DEG2RAD
  const theta = (lng + 180) * DEG2RAD
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

// --- Route Types ---

export interface ArcRoute {
  from: [number, number] // [lat, lng]
  to: [number, number]
  color: string
  arcHeight: number
  speed: number // dash animation speed
  label?: string
}

export interface HotspotPoint {
  lat: number
  lng: number
  color: string
  type: "port" | "airport" | "conflict"
  label: string
}

// --- Maritime Routes (cyan, slow, low arcs) ---

export const maritimeRoutes: ArcRoute[] = [
  { from: [31.2, 121.5], to: [51.9, 4.5], color: "#22d3ee", arcHeight: 0.15, speed: 0.15, label: "Shanghai → Rotterdam" },
  { from: [1.3, 103.8], to: [26.5, 56.3], color: "#22d3ee", arcHeight: 0.12, speed: 0.12, label: "Singapore → Hormuz" },
  { from: [33.7, -118.2], to: [35.4, 139.6], color: "#22d3ee", arcHeight: 0.18, speed: 0.14, label: "Long Beach → Yokohama" },
  { from: [22.3, 114.2], to: [-33.9, 18.4], color: "#22d3ee", arcHeight: 0.2, speed: 0.13, label: "Hong Kong → Cape Town" },
  { from: [25.0, 55.3], to: [12.9, 80.2], color: "#22d3ee", arcHeight: 0.1, speed: 0.11, label: "Dubai → Chennai" },
  { from: [35.6, 139.8], to: [47.6, -122.3], color: "#22d3ee", arcHeight: 0.16, speed: 0.14, label: "Tokyo → Seattle" },
  { from: [51.9, 4.5], to: [40.7, -74.0], color: "#22d3ee", arcHeight: 0.14, speed: 0.13, label: "Rotterdam → New York" },
  { from: [-23.0, -43.2], to: [6.4, 3.4], color: "#22d3ee", arcHeight: 0.12, speed: 0.12, label: "Santos → Lagos" },
]

// --- Air Routes (amber, faster, high arcs) ---

export const airRoutes: ArcRoute[] = [
  { from: [40.6, -73.8], to: [51.5, -0.5], color: "#f59e0b", arcHeight: 0.35, speed: 0.4, label: "JFK → Heathrow" },
  { from: [25.3, 55.4], to: [1.4, 103.8], color: "#f59e0b", arcHeight: 0.3, speed: 0.38, label: "Dubai → Singapore" },
  { from: [33.9, -118.4], to: [35.6, 139.7], color: "#f59e0b", arcHeight: 0.4, speed: 0.42, label: "LAX → Narita" },
  { from: [51.5, -0.5], to: [25.3, 55.4], color: "#f59e0b", arcHeight: 0.28, speed: 0.36, label: "Heathrow → Dubai" },
  { from: [22.3, 113.9], to: [-33.9, 151.2], color: "#f59e0b", arcHeight: 0.25, speed: 0.35, label: "HKG → Sydney" },
  { from: [49.0, 2.5], to: [40.6, -73.8], color: "#f59e0b", arcHeight: 0.32, speed: 0.4, label: "CDG → JFK" },
  { from: [1.4, 103.8], to: [35.6, 139.7], color: "#f59e0b", arcHeight: 0.22, speed: 0.34, label: "Changi → Narita" },
  { from: [55.6, 37.4], to: [39.9, 116.4], color: "#f59e0b", arcHeight: 0.28, speed: 0.36, label: "SVO → PEK" },
]

// --- Military Routes (red, medium arcs) ---

export const militaryRoutes: ArcRoute[] = [
  { from: [48.4, 35.0], to: [50.4, 30.5], color: "#ef4444", arcHeight: 0.08, speed: 0.25, label: "Eastern Ukraine corridor" },
  { from: [24.0, 118.0], to: [23.5, 121.0], color: "#ef4444", arcHeight: 0.06, speed: 0.22, label: "Taiwan Strait" },
  { from: [33.3, 44.4], to: [36.2, 37.2], color: "#ef4444", arcHeight: 0.1, speed: 0.2, label: "Baghdad → Aleppo" },
  { from: [15.4, 44.2], to: [12.8, 45.0], color: "#ef4444", arcHeight: 0.05, speed: 0.18, label: "Sanaa → Aden" },
]

export const allRoutes: ArcRoute[] = [
  ...maritimeRoutes,
  ...airRoutes,
  ...militaryRoutes,
]

// --- Hotspot Points ---

export const hotspots: HotspotPoint[] = [
  // Major Ports (cyan)
  { lat: 31.2, lng: 121.5, color: "#22d3ee", type: "port", label: "Shanghai" },
  { lat: 1.3, lng: 103.8, color: "#22d3ee", type: "port", label: "Singapore" },
  { lat: 51.9, lng: 4.5, color: "#22d3ee", type: "port", label: "Rotterdam" },
  { lat: 33.7, lng: -118.2, color: "#22d3ee", type: "port", label: "Long Beach" },
  { lat: 22.3, lng: 114.2, color: "#22d3ee", type: "port", label: "Hong Kong" },
  { lat: 25.0, lng: 55.3, color: "#22d3ee", type: "port", label: "Dubai" },
  { lat: 35.4, lng: 139.6, color: "#22d3ee", type: "port", label: "Yokohama" },
  { lat: -33.9, lng: 18.4, color: "#22d3ee", type: "port", label: "Cape Town" },
  { lat: 40.7, lng: -74.0, color: "#22d3ee", type: "port", label: "New York" },
  { lat: 47.6, lng: -122.3, color: "#22d3ee", type: "port", label: "Seattle" },
  { lat: 6.4, lng: 3.4, color: "#22d3ee", type: "port", label: "Lagos" },
  { lat: -23.0, lng: -43.2, color: "#22d3ee", type: "port", label: "Santos" },
  { lat: 26.5, lng: 56.3, color: "#22d3ee", type: "port", label: "Strait of Hormuz" },

  // Major Airports (amber)
  { lat: 40.6, lng: -73.8, color: "#f59e0b", type: "airport", label: "JFK" },
  { lat: 51.5, lng: -0.5, color: "#f59e0b", type: "airport", label: "Heathrow" },
  { lat: 25.3, lng: 55.4, color: "#f59e0b", type: "airport", label: "DXB" },
  { lat: 33.9, lng: -118.4, color: "#f59e0b", type: "airport", label: "LAX" },
  { lat: 35.6, lng: 139.7, color: "#f59e0b", type: "airport", label: "Narita" },
  { lat: 49.0, lng: 2.5, color: "#f59e0b", type: "airport", label: "CDG" },
  { lat: 22.3, lng: 113.9, color: "#f59e0b", type: "airport", label: "HKG Airport" },
  { lat: -33.9, lng: 151.2, color: "#f59e0b", type: "airport", label: "Sydney" },
  { lat: 55.6, lng: 37.4, color: "#f59e0b", type: "airport", label: "SVO" },
  { lat: 39.9, lng: 116.4, color: "#f59e0b", type: "airport", label: "PEK" },
  { lat: 12.9, lng: 80.2, color: "#f59e0b", type: "airport", label: "Chennai" },

  // Conflict Zones (red)
  { lat: 48.4, lng: 35.0, color: "#ef4444", type: "conflict", label: "Eastern Ukraine" },
  { lat: 50.4, lng: 30.5, color: "#ef4444", type: "conflict", label: "Kyiv" },
  { lat: 24.0, lng: 118.0, color: "#ef4444", type: "conflict", label: "Taiwan Strait W" },
  { lat: 23.5, lng: 121.0, color: "#ef4444", type: "conflict", label: "Taiwan" },
  { lat: 33.3, lng: 44.4, color: "#ef4444", type: "conflict", label: "Baghdad" },
  { lat: 36.2, lng: 37.2, color: "#ef4444", type: "conflict", label: "Aleppo" },
  { lat: 15.4, lng: 44.2, color: "#ef4444", type: "conflict", label: "Sanaa" },
  { lat: 12.8, lng: 45.0, color: "#ef4444", type: "conflict", label: "Aden" },
  { lat: 11.6, lng: 43.1, color: "#ef4444", type: "conflict", label: "Djibouti" },
  { lat: 2.0, lng: 45.3, color: "#ef4444", type: "conflict", label: "Mogadishu" },
  { lat: 31.5, lng: 34.5, color: "#ef4444", type: "conflict", label: "Gaza" },
]

// --- Simplified Continent Outlines ---
// Each continent is an array of [lat, lng] pairs forming a rough outline.
// Kept intentionally low-poly for performance (~250 total points).

export const continentOutlines: [number, number][][] = [
  // North America
  [
    [60, -140], [65, -168], [72, -157], [71, -135], [60, -140],
    [60, -140], [54, -130], [49, -125], [42, -124], [33, -117],
    [23, -110], [15, -92], [18, -88], [21, -87], [26, -82],
    [25, -80], [30, -81], [35, -75], [40, -74], [43, -70],
    [45, -67], [47, -60], [52, -56], [55, -60], [60, -64],
    [63, -72], [70, -80], [73, -85], [70, -100], [68, -110],
    [65, -120], [60, -140],
  ],
  // South America
  [
    [12, -72], [10, -62], [7, -52], [2, -50], [-5, -35],
    [-10, -37], [-15, -39], [-23, -43], [-30, -50], [-35, -57],
    [-42, -63], [-50, -68], [-55, -68], [-55, -73], [-46, -75],
    [-40, -73], [-33, -72], [-27, -70], [-20, -70], [-15, -75],
    [-5, -80], [0, -78], [5, -77], [10, -75], [12, -72],
  ],
  // Europe
  [
    [36, -9], [38, -6], [43, -8], [44, -1], [47, -2],
    [48, 5], [51, 2], [54, 8], [56, 8], [58, 5],
    [62, 5], [65, 12], [70, 20], [72, 28], [70, 32],
    [65, 30], [60, 30], [56, 28], [55, 20], [54, 14],
    [52, 14], [48, 15], [47, 19], [44, 28], [41, 29],
    [37, 24], [36, 22], [35, 25], [34, 10], [37, -1],
    [36, -5], [36, -9],
  ],
  // Africa
  [
    [37, -1], [34, 10], [33, 12], [30, 32], [22, 37],
    [15, 42], [12, 44], [11, 50], [5, 42], [0, 42],
    [-5, 40], [-10, 40], [-15, 40], [-25, 35], [-34, 26],
    [-34, 18], [-28, 16], [-22, 14], [-17, 12], [-12, 13],
    [-5, 12], [0, 10], [5, 2], [4, -5], [7, -12],
    [15, -17], [21, -17], [26, -14], [32, -5], [36, -5],
    [37, -1],
  ],
  // Asia (simplified)
  [
    [42, 28], [44, 40], [40, 44], [38, 48], [37, 56],
    [25, 57], [24, 58], [20, 63], [15, 68], [8, 77],
    [7, 80], [22, 88], [22, 97], [10, 99], [1, 104],
    [-6, 106], [-8, 115], [-5, 120], [5, 119], [10, 109],
    [18, 107], [21, 110], [25, 120], [30, 122], [35, 129],
    [38, 128], [42, 130], [45, 135], [48, 141], [53, 143],
    [58, 150], [62, 163], [65, 170], [68, 180], [72, 180],
    [73, 140], [72, 120], [70, 90], [67, 68], [62, 60],
    [55, 65], [50, 53], [46, 40], [42, 28],
  ],
  // Australia
  [
    [-12, 130], [-14, 127], [-17, 123], [-20, 118], [-25, 114],
    [-32, 115], [-35, 117], [-35, 138], [-38, 145], [-37, 150],
    [-28, 153], [-23, 150], [-19, 146], [-15, 145], [-12, 142],
    [-11, 136], [-12, 130],
  ],
]

// --- Grid Lines ---

/** Generate lat/lng grid line coordinates at given degree intervals. */
export function generateGridLines(
  interval: number,
  _radius: number,
  segments = 64
): [number, number][][] {
  const lines: [number, number][][] = []

  // Latitude lines
  for (let lat = -90 + interval; lat < 90; lat += interval) {
    const line: [number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const lng = (i / segments) * 360 - 180
      line.push([lat, lng])
    }
    lines.push(line)
  }

  // Longitude lines
  for (let lng = -180; lng < 180; lng += interval) {
    const line: [number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * 180 - 90
      line.push([lat, lng])
    }
    lines.push(line)
  }

  return lines
}
