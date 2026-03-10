import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Globe } from "./Globe"
import { GlobeAtmosphere } from "./GlobeAtmosphere"
import { GlobeArcs } from "./GlobeArcs"
import { GlobePoints } from "./GlobePoints"

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={0.4} />
      <Globe />
      <GlobeAtmosphere />
      <GlobeArcs />
      <GlobePoints />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />
    </>
  )
}

export function GlobeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <GlobeScene />
      </Suspense>
    </Canvas>
  )
}
