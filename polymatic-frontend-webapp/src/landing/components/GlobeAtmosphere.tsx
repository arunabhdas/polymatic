import { useRef, useMemo } from "react"
import { BackSide, ShaderMaterial } from "three"
import { useFrame } from "@react-three/fiber"

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - dot(viewDir, vNormal);
    fresnel = pow(fresnel, 3.0);

    // Subtle pulse
    float pulse = 0.85 + 0.15 * sin(uTime * 0.5);

    vec3 color = vec3(0.15, 0.4, 0.8); // Blue glow
    float alpha = fresnel * 0.6 * pulse;

    gl_FragColor = vec4(color, alpha);
  }
`

export function GlobeAtmosphere() {
  const matRef = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta
    }
  })

  return (
    <mesh>
      <sphereGeometry args={[1.02, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
