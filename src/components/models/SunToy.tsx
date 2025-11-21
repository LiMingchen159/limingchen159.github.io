import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunToyProps {
    rotation?: [number, number, number];
}

export const SunToy = ({ rotation = [0, 0, 0] }: SunToyProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // High gloss plastic materials
    const plasticYellow = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        metalness: 0.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.5,
    });

    const plasticOrange = new THREE.MeshPhysicalMaterial({
        color: 0xFF8C00,
        metalness: 0.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
    });

    const blackPlastic = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        roughness: 0.2,
        clearcoat: 0.8
    });

    const blushMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF69B4,
        roughness: 0.4,
        transparent: true,
        opacity: 0.6
    });

    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    // Animation - only subtle floating, no rotation override
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.getElapsedTime();
            // Only animate vertical position, keeping the rotation prop intact
            groupRef.current.position.y = Math.sin(time * 0.001) * 0.02;
        }
    });

    // Create sun rays
    const rays = [];
    const raysCount = 12;
    for (let i = 0; i < raysCount; i++) {
        const angle = (i / raysCount) * Math.PI * 2;
        rays.push(
            <group key={i} rotation={[0, 0, angle]}>
                <group position={[0, 4.0, 0]}>
                    {/* Ray main body */}
                    <mesh castShadow receiveShadow material={plasticOrange}>
                        <cylinderGeometry args={[0.8, 0.48, 1.5, 32]} />
                    </mesh>
                    {/* Ray top (rounded) */}
                    <mesh position={[0, 0.75, 0]} material={plasticOrange}>
                        <sphereGeometry args={[0.48, 32, 32]} />
                    </mesh>
                    {/* Ray bottom (blending) */}
                    <mesh position={[0, -0.75, 0]} scale={[1, 0.5, 1]} material={plasticOrange}>
                        <sphereGeometry args={[0.8, 32, 32]} />
                    </mesh>
                </group>
            </group>
        );
    }

    return (
        <group ref={groupRef} scale={0.2} rotation={rotation}>
            {/* Main sun sphere */}
            <mesh castShadow receiveShadow material={plasticYellow}>
                <sphereGeometry args={[3, 64, 64]} />
            </mesh>

            {/* Sun rays */}
            {rays}

            {/* Face group */}
            <group>
                {/* Left eye */}
                <mesh position={[-1, 0.5, 2.7]} scale={[1, 1, 0.5]} material={blackPlastic}>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    {/* Eye shine */}
                    <mesh position={[-0.1, 0.15, 0.3]} material={whiteMaterial}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                    </mesh>
                </mesh>

                {/* Right eye */}
                <mesh position={[1, 0.5, 2.7]} scale={[1, 1, 0.5]} material={blackPlastic}>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    {/* Eye shine */}
                    <mesh position={[-0.1, 0.15, 0.3]} material={whiteMaterial}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                    </mesh>
                </mesh>

                {/* Mouth (smile) */}
                <mesh
                    position={[0, -0.2, 2.8]}
                    rotation={[Math.PI / 1.1, 0, 0]}
                    material={blackPlastic}
                >
                    <torusGeometry args={[0.5, 0.1, 16, 32, Math.PI]} />
                </mesh>

                {/* Left blush */}
                <mesh
                    position={[-1.8, -0.3, 2.3]}
                    rotation={[-0.2, -0.5, 0]}
                    material={blushMaterial}
                >
                    <circleGeometry args={[0.6, 32]} />
                </mesh>

                {/* Right blush */}
                <mesh
                    position={[1.8, -0.3, 2.3]}
                    rotation={[-0.2, 0.5, 0]}
                    material={blushMaterial}
                >
                    <circleGeometry args={[0.6, 32]} />
                </mesh>
            </group>
        </group>
    );
};
