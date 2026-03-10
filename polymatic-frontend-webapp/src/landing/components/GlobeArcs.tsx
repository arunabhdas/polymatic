import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { QuadraticBezierLine } from "@react-three/drei"
import type { Vector3Tuple } from "three"
import { allRoutes, latLngToSphere } from "./globeData"

const RADIUS = 1

interface ArcData {
  start: Vector3Tuple
  end: Vector3Tuple
  mid: Vector3Tuple
  color: string
  speed: number
}

function computeMidpoint(
  from: [number, number],
  to: [number, number],
  arcHeight: number
): Vector3Tuple {
  // Average the lat/lng, then push outward
  const midLat = (from[0] + to[0]) / 2
  const midLng = (from[1] + to[1]) / 2
  const [x, y, z] = latLngToSphere(midLat, midLng, RADIUS + arcHeight)
  return [x, y, z]
}

function ArcLine({ arc, index }: { arc: ArcData; index: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (!lineRef.current) return
    const mat = lineRef.current.material
    if (mat) {
      mat.dashOffset = -(clock.getElapsedTime() * arc.speed + index * 2.0)
    }
  })

  return (
    <QuadraticBezierLine
      ref={lineRef}
      start={arc.start}
      end={arc.end}
      mid={arc.mid}
      color={arc.color}
      lineWidth={1.2}
      dashed
      dashScale={8}
      dashSize={0.4}
      gapSize={0.2}
      transparent
      opacity={0.7}
    />
  )
}

export function GlobeArcs() {
  const arcs = useMemo<ArcData[]>(
    () =>
      allRoutes.map((route) => ({
        start: latLngToSphere(route.from[0], route.from[1], RADIUS),
        end: latLngToSphere(route.to[0], route.to[1], RADIUS),
        mid: computeMidpoint(route.from, route.to, route.arcHeight),
        color: route.color,
        speed: route.speed,
      })),
    []
  )

  return (
    <group>
      {arcs.map((arc, i) => (
        <ArcLine key={i} arc={arc} index={i} />
      ))}
    </group>
  )
}
