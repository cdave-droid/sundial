import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#1e40af"
        roughness={0.8}
        metalness={0.1}
      />
      {/* Land masses approximation using simple geometry */}
      <mesh>
        <sphereGeometry args={[1.002, 64, 64]} />
        <meshStandardMaterial
          color="#22c55e"
          roughness={0.9}
          transparent
          opacity={0.6}
          wireframe={false}
        />
      </mesh>
    </Sphere>
  );
}

function Atmosphere() {
  return (
    <Sphere args={[1.15, 32, 32]}>
      <meshBasicMaterial
        color="#60a5fa"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

interface EarthGlobeProps {
  size?: number;
  className?: string;
}

export function EarthGlobe({ size = 40, className = '' }: EarthGlobeProps) {
  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        <Earth />
        <Atmosphere />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
