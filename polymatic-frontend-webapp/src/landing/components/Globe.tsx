import { useMemo } from "react"
import { Line } from "@react-three/drei"
import {
  latLngToSphere,
  continentOutlines,
  generateGridLines,
} from "./globeData"

const RADIUS = 1

export function Globe() {
  const gridLines = useMemo(() => generateGridLines(30, RADIUS, 64), [])

  const gridPoints = useMemo(
    () =>
      gridLines.map((line) =>
        line.map(([lat, lng]) => latLngToSphere(lat, lng, RADIUS))
      ),
    [gridLines]
  )

  const continentPoints = useMemo(
    () =>
      continentOutlines.map((outline) =>
        outline.map(([lat, lng]) => latLngToSphere(lat, lng, RADIUS * 1.001))
      ),
    []
  )

  return (
    <group>
      {/* Dark sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial color="#0a0f14" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid lines */}
      {gridPoints.map((points, i) => (
        <Line
          key={`grid-${i}`}
          points={points}
          color="#1a2a3a"
          lineWidth={0.3}
          transparent
          opacity={0.4}
        />
      ))}

      {/* Continent outlines */}
      {continentPoints.map((points, i) => (
        <Line
          key={`continent-${i}`}
          points={points}
          color="#1e3a5a"
          lineWidth={0.8}
          transparent
          opacity={0.7}
        />
      ))}
    </group>
  )
}
