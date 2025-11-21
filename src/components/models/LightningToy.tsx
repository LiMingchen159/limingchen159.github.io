import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightningToyProps {
    rotation?: [number, number, number];
}

export const LightningToy = ({ rotation = [-0.2, 0, 0] }: LightningToyProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // High gloss electric yellow plastic material
    const electricYellowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFEB3B,
        emissive: 0xFFD600,
        emissiveIntensity: 0.1,
        metalness: 0.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0
    });

    // Create lightning shape
    const lightningShape = new THREE.Shape();
    lightningShape.moveTo(1.5, 5);
    lightningShape.lineTo(-1, 1);
    lightningShape.lineTo(0.5, 1);
    lightningShape.lineTo(-2.5, -5);
    lightningShape.lineTo(2, -0.5);
    lightningShape.lineTo(0.5, -0.5);
    lightningShape.lineTo(3, 3.5);

    // Extrude settings for rounded edges
    const extrudeSettings = {
        steps: 2,
        depth: 1.5,
        bevelEnabled: true,
        bevelThickness: 0.6,
        bevelSize: 0.6,
        bevelSegments: 12
    };

    // Animation - only subtle floating, no rotation override
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.getElapsedTime();
            // Only animate vertical position, keeping the rotation prop intact
            groupRef.current.position.y = Math.sin(time * 1.5) * 0.03;
        }
    });

    return (
        <group ref={groupRef} scale={0.16} rotation={rotation}>
            <mesh castShadow receiveShadow material={electricYellowMaterial}>
                <extrudeGeometry args={[lightningShape, extrudeSettings]} />
            </mesh>
        </group>
    );
};
