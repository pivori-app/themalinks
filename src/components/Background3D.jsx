import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Composant des particules flottantes
function FloatingParticles({ count = 2000 }) {
  const ref = useRef();
  
  // Génération des positions aléatoires des particules
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position aléatoire dans un cube
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Couleurs dégradées (bleu vers violet)
      const hue = 0.6 + Math.random() * 0.2; // Entre bleu et violet
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, [count]);
  
  // Animation des particules
  useFrame((state) => {
    if (ref.current) {
      // Rotation lente
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      
      // Effet de pulsation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });
  
  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Composant des vagues géométriques
function GeometricWaves() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animation des vagues
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(time * 0.4) * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshBasicMaterial
        color="#4f46e5"
        transparent
        opacity={0.1}
        wireframe
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Composant principal du fond 3D
export default function Background3D({ className = "", intensity = 1 }) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]} // Optimisation pour mobile
      >
        {/* Éclairage ambiant */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {/* Particules flottantes */}
        <FloatingParticles count={Math.floor(1500 * intensity)} />
        
        {/* Vagues géométriques */}
        <GeometricWaves />
        
        {/* Brouillard pour la profondeur */}
        <fog attach="fog" args={['#000000', 5, 15]} />
      </Canvas>
      
      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 pointer-events-none" />
    </div>
  );
}
