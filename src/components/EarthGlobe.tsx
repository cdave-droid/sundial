import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { City } from '@/lib/timezones';
import earthTexture from '@/assets/earth-texture.jpg';

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

interface CityPinProps {
  city: City;
  isHome?: boolean;
  radius: number;
}

function CityPin({ city, isHome, radius }: CityPinProps) {
  const position = useMemo(() => 
    latLngToVector3(city.lat, city.lng, radius + 0.02),
    [city.lat, city.lng, radius]
  );

  // Create a pin that points outward from the globe center
  const pinHeight = 0.08;
  const pinDirection = position.clone().normalize();
  const pinTipPosition = position.clone().add(pinDirection.clone().multiplyScalar(pinHeight));

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh position={position}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial 
          color={isHome ? "#fbbf24" : "#f59e0b"} 
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Pin base on globe surface */}
      <mesh position={position}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial 
          color={isHome ? "#fbbf24" : "#f59e0b"} 
          emissive={isHome ? "#fbbf24" : "#f59e0b"}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Pin stem */}
      <mesh position={position.clone().add(pinDirection.clone().multiplyScalar(pinHeight / 2))}>
        <cylinderGeometry args={[0.008, 0.008, pinHeight, 8]} />
        <meshStandardMaterial 
          color={isHome ? "#fbbf24" : "#f59e0b"}
          emissive={isHome ? "#fbbf24" : "#f59e0b"}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* City label */}
      <Html
        position={pinTipPosition.toArray()}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap shadow-lg ${
          isHome 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-foreground border border-border'
        }`}>
          {city.name}
        </div>
      </Html>
    </group>
  );
}

interface EarthProps {
  cities?: City[];
  homeCity?: City | null;
  autoRotate?: boolean;
}

function Earth({ cities = [], homeCity, autoRotate = true }: EarthProps) {
  const earthRef = useRef<THREE.Group>(null);
  const radius = 1;
  
  // Load Earth texture
  const texture = useLoader(THREE.TextureLoader, earthTexture);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (earthRef.current && autoRotate) {
      earthRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth with texture */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* City pins */}
      {homeCity && (
        <CityPin city={homeCity} isHome radius={radius} />
      )}
      {cities.filter(c => c.id !== homeCity?.id).map((city) => (
        <CityPin key={city.id} city={city} radius={radius} />
      ))}
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      {/* Inner gold glow */}
      <Sphere args={[1.02, 32, 32]}>
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Outer atmosphere with gold tint */}
      <Sphere args={[1.08, 32, 32]}>
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

interface EarthGlobeProps {
  size?: number;
  className?: string;
  cities?: City[];
  homeCity?: City | null;
  showStars?: boolean;
}

export function EarthGlobe({ 
  size = 40, 
  className = '', 
  cities = [], 
  homeCity,
  showStars = false 
}: EarthGlobeProps) {
  const isHero = size > 200;

  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, isHero ? 2.8 : 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} />
        {showStars && <Stars />}
        <Earth cities={cities} homeCity={homeCity} autoRotate={!isHero} />
        <Atmosphere />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={isHero}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  );
}
