import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import {
  InstancedMesh,
  Object3D,
  Color,
  SphereGeometry,
  MeshBasicMaterial,
} from "three"
import type { Vector3Tuple } from "three"
import { hotspots, latLngToSphere } from "./globeData"

const RADIUS = 1.005
const POINT_SIZE = 0.008

const dummy = new Object3D()
const tempColor = new Color()

export function GlobePoints() {
  const meshRef = useRef<InstancedMesh>(null)

  const { geometry, material } = useMemo(() => {
    const geo = new SphereGeometry(POINT_SIZE, 8, 8)
    const mat = new MeshBasicMaterial({ transparent: true, opacity: 0.9 })
    return { geometry: geo, material: mat }
  }, [])

  // Pre-compute positions once
  const positions = useMemo<Vector3Tuple[]>(
    () => hotspots.map((h) => latLngToSphere(h.lat, h.lng, RADIUS)),
    []
  )

  // Set initial transforms + colors after mount
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    hotspots.forEach((h, i) => {
      const [x, y, z] = positions[i]
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      tempColor.set(h.color)
      mesh.setColorAt(i, tempColor)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [positions])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < hotspots.length; i++) {
      const [x, y, z] = positions[i]
      const scale = 1 + 0.4 * Math.sin(t * 2 + i * 0.4)

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, hotspots.length]}
    />
  )
}
