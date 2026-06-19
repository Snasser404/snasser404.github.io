import { useMemo, useRef, useEffect, useState, Suspense, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Icosahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------
   Scene3D — the interactive futuristic hero.
   A morphing "core" (the developer), an orbiting data ring (the
   marketer / funnel), a drifting particle field, and small satellites.
   The whole rig gently tracks the pointer for a parallax feel.
   No postprocessing deps — glow is faked with emissive + additive points.
-------------------------------------------------------------------*/

function Core() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.18
    ref.current.rotation.x += delta * 0.06
  })
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <Icosahedron ref={ref} args={[1.35, 6]}>
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#a855f7"
          emissiveIntensity={0.18}
          roughness={0.28}
          metalness={0.45}
          distort={0.38}
          speed={1.6}
        />
      </Icosahedron>
      {/* Inner wireframe shell */}
      <Icosahedron args={[1.62, 1]}>
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.4} />
      </Icosahedron>
    </Float>
  )
}

function DataRings() {
  const group = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.25
  })
  return (
    <group ref={group} rotation={[Math.PI / 2.4, 0.3, 0]}>
      <Torus args={[2.5, 0.014, 16, 120]}>
        <meshBasicMaterial color="#0891b2" transparent opacity={0.7} />
      </Torus>
      <Torus args={[3.05, 0.01, 16, 120]} rotation={[0.5, 0.4, 0]}>
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.55} />
      </Torus>
    </group>
  )
}

function Satellites() {
  const group = useRef<THREE.Group>(null!)
  const nodes = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number; c: string }[] = []
    const palette = ['#0891b2', '#7c3aed', '#4f46e5', '#0d9488']
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2
      const r = 2.6 + (i % 3) * 0.35
      arr.push({
        pos: [Math.cos(a) * r, Math.sin(a * 1.3) * 1.2, Math.sin(a) * r],
        s: 0.05 + (i % 3) * 0.025,
        c: palette[i % palette.length],
      })
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12
  })
  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <Float key={i} speed={2} floatIntensity={1.5} rotationIntensity={1}>
          <mesh position={n.pos}>
            <icosahedronGeometry args={[n.s, 0]} />
            <meshStandardMaterial color={n.c} emissive={n.c} emissiveIntensity={0.4} roughness={0.35} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function ParticleField({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // distribute in a soft sphere shell
      const r = 4 + Math.pow(Math.random(), 0.6) * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.cos(phi) * 0.6
      p[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return p
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8b93c4"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (!group.current) return
    // pointer parallax — smooth lerp toward target
    const x = state.pointer.x * 0.35
    const y = state.pointer.y * 0.25
    group.current.rotation.y += (x - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-y - group.current.rotation.x) * 0.04
  })
  return <group ref={group}>{children}</group>
}

export default function Scene3D() {
  const host = useRef<HTMLDivElement>(null)
  // Pause the render loop when the hero is scrolled out of view (saves GPU/battery).
  const [active, setActive] = useState(true)

  useEffect(() => {
    // Force R3F to re-measure once layout has settled (guards against the
    // lazy-mount-at-zero-size case where the canvas sticks at 300x150).
    const fire = () => window.dispatchEvent(new Event('resize'))
    const r = requestAnimationFrame(fire)
    const t = setTimeout(fire, 120)

    // Toggle the frame loop based on visibility.
    let io: IntersectionObserver | undefined
    if (host.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 })
      io.observe(host.current)
    }
    return () => {
      cancelAnimationFrame(r)
      clearTimeout(t)
      io?.disconnect()
    }
  }, [])

  return (
    <div ref={host} style={{ position: 'absolute', inset: 0 }}>
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      resize={{ debounce: 0 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={['#f5f7fc', 9, 20]} />
        <ambientLight intensity={0.85} />
        <pointLight position={[5, 5, 5]} intensity={1.8} color="#22d3ee" />
        <pointLight position={[-5, -3, -4]} intensity={1.5} color="#a855f7" />
        <pointLight position={[0, 4, -6]} intensity={1.0} color="#6366f1" />
        <Rig>
          <Core />
          <DataRings />
          <Satellites />
          <ParticleField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 550 : 1400} />
        </Rig>
      </Suspense>
    </Canvas>
    </div>
  )
}
