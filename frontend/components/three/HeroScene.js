'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Torus, Sphere, Box, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCube({ position, color, scale = 1 }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.15;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.6} />
    </mesh>
  );
}

function FloatingTorus({ position, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.4;
    meshRef.current.rotation.z = t * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[2]) * 0.2;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.5, 0.15, 16, 50]} />
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FF6B00" size={0.02} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CentralSphere() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshDistortMaterial
          color="#FF6B00"
          distort={0.25}
          speed={1.5}
          wireframe={false}
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.22, 1]} />
        <meshStandardMaterial color="#FF6B00" wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function GridPlane() {
  return (
    <gridHelper
      args={[20, 20, '#1f1f1f', '#141414']}
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#FF6B00" />
      <pointLight position={[-5, -3, -2]} intensity={0.5} color="#ffffff" />
      <spotLight position={[0, 8, 0]} intensity={0.3} color="#FF8C00" />

      <ParticleField />
      <CentralSphere />
      <GridPlane />

      <FloatingCube position={[-2.5, 1, -1]} color="#FF6B00" scale={1.2} />
      <FloatingCube position={[2.8, 0.5, -1.5]} color="#FF8C00" scale={0.8} />
      <FloatingCube position={[-1.5, -1.5, 0.5]} color="#ffffff" scale={0.6} />
      <FloatingCube position={[3, -1, 1]} color="#FF6B00" scale={1} />

      <FloatingTorus position={[2.2, 1.5, -0.5]} color="#FF6B00" />
      <FloatingTorus position={[-2.8, -0.5, 0]} color="#FF8C00" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
