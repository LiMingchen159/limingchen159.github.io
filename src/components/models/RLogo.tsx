import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RLogoProps {
    rotation?: [number, number, number];
}

export const RLogo = ({ rotation = [Math.PI / 6, 0, 0] }: RLogoProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // R letter shape
    const rShape = new THREE.Shape();

    // Outer contour
    rShape.moveTo(-1.4, -2.5);
    rShape.lineTo(-1.3, 2.5);
    rShape.lineTo(-0.4, 2.5);
    rShape.lineTo(0.6, 2.5);
    // Top curve (Bowl)
    rShape.bezierCurveTo(2.5, 2.5, 2.5, 0.0, 0.6, 0.0);
    rShape.lineTo(0.8, 0.0);
    // Leg
    rShape.lineTo(2.2, -2.5);
    rShape.lineTo(0.9, -2.5);
    rShape.lineTo(-0.2, -0.6);
    rShape.lineTo(-0.4, -0.6);
    rShape.lineTo(-0.4, -2.5);

    // R hole (Counter)
    const rHole = new THREE.Path();
    rHole.moveTo(-0.4, 0.8);
    rHole.lineTo(0.6, 0.8);
    rHole.bezierCurveTo(1.8, 0.8, 1.8, 2.0, 0.6, 2.0);
    rHole.lineTo(-0.4, 2.0);
    rHole.lineTo(-0.4, 0.8);
    rShape.holes.push(rHole);

    // Extrude settings for R
    const extrudeSettings = {
        steps: 2,
        depth: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5,
        curveSegments: 24
    };

    // Ring shape
    const ringShape = new THREE.Shape();
    const ovalWidth = 5.5;
    const ovalHeight = 4.2;
    const ringThickness = 0.7;

    // Outer ellipse
    ringShape.absellipse(0, 0, ovalWidth, ovalHeight, 0, Math.PI * 2, false, 0);

    // Inner ellipse (hole)
    const ringHole = new THREE.Path();
    ringHole.absellipse(0, 0, ovalWidth - ringThickness, ovalHeight - ringThickness * 0.9, 0, Math.PI * 2, true, 0);
    ringShape.holes.push(ringHole);

    const ringExtrudeSettings = {
        steps: 2,
        depth: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 5,
        curveSegments: 64
    };

    // Animation - only subtle floating, no rotation override
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.getElapsedTime();
            // Only animate vertical position, keeping the rotation prop intact
            groupRef.current.position.y = Math.sin(time) * 0.05;
        }
    });

    return (
        <group ref={groupRef} scale={0.25} rotation={rotation}>
            {/* R Letter */}
            <mesh position={[0, 0, 0.2]} rotation={[0, 0, THREE.MathUtils.degToRad(-5)]} castShadow receiveShadow>
                <extrudeGeometry args={[rShape, extrudeSettings]} />
                <meshPhysicalMaterial
                    color={0x1e6bb8}
                    metalness={0.1}
                    roughness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    reflectivity={0.5}
                />
            </mesh>

            {/* Elliptical Ring */}
            <mesh position={[0, 0, -0.1]} castShadow receiveShadow>
                <extrudeGeometry args={[ringShape, ringExtrudeSettings]} />
                <meshPhysicalMaterial
                    color={0xb0b6bc}
                    metalness={0.6}
                    roughness={0.3}
                    clearcoat={0.5}
                    clearcoatRoughness={0.2}
                />
            </mesh>
        </group>
    );
};
