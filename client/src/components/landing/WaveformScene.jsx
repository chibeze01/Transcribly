import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function WaveformBar({ position, delay }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const h =
      0.5 +
      Math.sin(t * 2 + delay) * 0.4 +
      Math.sin(t * 0.7 + delay * 2) * 0.3;
    const clamped = Math.max(0.1, h);
    ref.current.scale.y = clamped;
    ref.current.position.y = clamped / 2;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.15, 1, 0.15]} />
      <meshStandardMaterial
        color="#28c840"
        emissive="#28c840"
        emissiveIntensity={0.4}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

function Particles({ count = 80 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#28c840" size={0.03} transparent opacity={0.5} />
    </points>
  );
}

function Waveform() {
  const groupRef = useRef();

  const bars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        position: [(i - 14) * 0.22, 0, 0],
        delay: i * 0.3,
      })),
    []
  );

  useFrame(({ clock }) => {
    groupRef.current.rotation.y =
      Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef}>
        {bars.map((bar, i) => (
          <WaveformBar key={i} position={bar.position} delay={bar.delay} />
        ))}
      </group>
    </Float>
  );
}

export default function WaveformScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
      <Canvas
        camera={{ position: [0, 3.5, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 6, 4]} intensity={0.6} color="#28c840" />
        <pointLight position={[-6, 4, -2]} intensity={0.3} color="#1a8a30" />
        <Waveform />
        <Particles />
      </Canvas>
    </div>
  );
}
